"""SFX library: CC0 field recordings cut into single events + a few procedural sounds.

Each source file is split into events by an energy detector; we keep chosen
events, trim them, high-pass the rumble and normalise. Procedural sounds are
used where a recording would be less precise (UI clicks, soft air, ticks).

Output: audio/sfx/<name>.wav  and  audio/sfx/library.json (provenance).
"""
import json

import numpy as np
from pedalboard import HighpassFilter, LowpassFilter

import lib
from lib import SR

ROOT = lib.ROOT
SRC = ROOT / "audio" / "sfx" / "sources"
OUT = ROOT / "audio" / "sfx"
META = json.loads((SRC / "sources.json").read_text())
rng = np.random.default_rng(3)
LIB = {}


def events(key, thr=0.06, min_gap=0.05, pad=(0.01, 0.06)):
    y = lib.load(SRC / META[key]["file"])
    m = np.abs(y).mean(1)
    fr = int(SR * 0.005)
    env = np.convolve(m, np.ones(fr) / fr, "same")
    on = env > env.max() * thr
    ev, i = [], 0
    while i < len(on):
        if on[i]:
            j = i
            while j < len(on) and (on[j] or (j + int(min_gap * SR) < len(on) and on[j:j + int(min_gap * SR)].any())):
                j += 1
            ev.append((max(0, i - int(pad[0] * SR)), min(len(y), j + int(pad[1] * SR))))
            i = j
        else:
            i += 1
    return y, ev


def save(name, x, key=None, note="", peak_db=-3.0, hp=60, lp=None):
    plugins = [HighpassFilter(hp)] + ([LowpassFilter(lp)] if lp else [])
    x = lib.fx(x, *plugins)
    x = lib.fade(x, 0.002, min(0.03, len(x) / SR / 4))
    x *= lib.db(peak_db) / max(1e-6, np.max(np.abs(x)))
    lib.sf.write(str(OUT / f"{name}.wav"), x.astype(np.float32), SR, subtype="PCM_24")
    src = META.get(key, {})
    LIB[name] = {"source": key or "procédural", "title": src.get("title", ""), "author": src.get("user", ""),
                 "url": src.get("page", ""), "license": src.get("license", "créé pour le projet"), "note": note,
                 "dur": round(len(x) / SR, 3)}


def cut(key, idx, name, **kw):
    y, ev = events(key, **{k: v for k, v in kw.items() if k in ("thr", "min_gap", "pad")})
    a, b = ev[idx % len(ev)]
    save(name, y[a:b], key, note=f"événement {idx + 1}/{len(ev)}",
         **{k: v for k, v in kw.items() if k in ("peak_db", "hp", "lp")})
    return len(ev)


# ------------------------------------------------ papier
for k, idx in enumerate([0, 1, 2, 4, 6, 7]):
    cut("paper_slide__560352", idx, f"paper_slide_{k + 1}", thr=0.1, min_gap=0.015, pad=(0.005, 0.04))
for k in range(3):
    cut("paper_sheet__560353", k, f"paper_hit_{k + 1}", hp=90)
cut("paper_shuffle__642770", 1, "paper_sweep", thr=0.04)
cut("paper_down__379888", 0, "paper_down", thr=0.05, min_gap=0.25)

# ------------------------------------------------ stylo, surligneur, carte
for k in range(4):
    cut("pen_write__751055", k + 1, f"pen_stroke_{k + 1}", thr=0.08, hp=200)
y, ev = events("pen_write__277312", thr=0.05, min_gap=0.12)
save("pencil_caption", y[ev[0][0]:ev[-1][1]], "pen_write__277312", note="toutes les traces", hp=200)
for k in range(3):
    cut("highlighter__351145", k + 1, f"marker_{k + 1}", thr=0.05, hp=250)
cut("card_flip__84322", 0, "card_flip", thr=0.03, min_gap=0.15, hp=150)

# ------------------------------------------------ appareil photo
y, ev = events("shutter__579883", thr=0.03, min_gap=0.08)
save("shutter_k1000", y[ev[0][0]:ev[-1][1] + int(0.08 * SR)], "shutter__579883", note="Pentax K1000", hp=80)
y, ev = events("shutter__734819", thr=0.03, min_gap=0.06)
adv = [e for e in ev if e[0] / SR > 1.0]
save("film_advance", y[adv[0][0]:adv[-1][1]], "shutter__734819", note="levier d'avance du film", hp=120) if adv else None
y, ev = events("polaroid__755841", thr=0.03, min_gap=0.3)
save("polaroid_eject", y[ev[0][0]:ev[-1][1]], "polaroid__755841", note="moteur d'éjection", hp=90)
y, ev = events("autofocus__176539", thr=0.1, min_gap=0.03)
for k in range(3):
    a, b = ev[(k * 2 + 1) % len(ev)]
    save(f"af_motor_{k + 1}", y[a:b], "autofocus__176539", note=f"rafale {k * 2 + 2}", hp=300)
y, _ = events("autofocus__483381")
save("af_beep", y[: int(0.14 * SR)], "autofocus__483381", note="bip de mise au point (début)", hp=500)
y = lib.load(SRC / META["room_tone__565535"]["file"])
save("room_tone", y, "room_tone__565535", peak_db=-12, hp=40)

# ------------------------------------------------ procédural
def click(level=1.0, f=2100):
    n = lib.seconds(0.05)
    t = np.arange(n) / SR
    x = np.sin(2 * np.pi * f * t) * lib.exp_env(n, 0.006) * 0.6
    x += lib.filt(rng.standard_normal(n).astype(np.float32), "bandpass", [2000, 9000]) * lib.exp_env(n, 0.0025)
    x += np.sin(2 * np.pi * 180 * t) * lib.exp_env(n, 0.012) * 0.35
    return lib.st(x * level)


save("ui_click", click(), note="clic de trackpad", hp=100)
save("ui_tick", click(0.6, 3300)[: lib.seconds(0.03)], note="micro-tic", hp=400)


def wood(f=620):
    n = lib.seconds(0.18)
    t = np.arange(n) / SR
    x = sum(a * np.sin(2 * np.pi * f * m * t) * lib.exp_env(n, 0.05 / m) for m, a in ((1, 1), (2.76, 0.4), (5.4, 0.15)))
    x += lib.filt(rng.standard_normal(n).astype(np.float32), "bandpass", [800, 5000]) * lib.exp_env(n, 0.003) * 0.4
    return lib.st(x)


save("wood_tock", wood(), note="carte qui tombe dans la boîte", hp=120)
for k, f in enumerate([900, 980, 1060]):
    save(f"card_tick_{k + 1}", wood(f)[: lib.seconds(0.08)], note="carte qui se range", hp=300, peak_db=-6)


def air(dur, lo, hi, curve_up=0.45):
    n = lib.seconds(dur)
    x = lib.filt(rng.standard_normal((n, 2)).astype(np.float32), "bandpass", [lo, hi])
    t = np.linspace(0, 1, n)
    e = np.where(t < curve_up, (t / curve_up) ** 2, ((1 - t) / (1 - curve_up)) ** 1.6)
    # léger mouvement stéréo
    p = 0.5 + 0.35 * np.sin(np.pi * t)
    return np.stack([x[:, 0] * e * (1 - p * 0.5), x[:, 1] * e * (0.5 + p * 0.5)], 1)


save("air_soft", air(0.55, 400, 3500), note="souffle très doux (transition)", hp=300)
save("air_long", air(1.3, 150, 1800, 0.55), note="recul de caméra", hp=100)

(OUT / "library.json").write_text(json.dumps(LIB, ensure_ascii=False, indent=1))
print(len(LIB), "sons")
