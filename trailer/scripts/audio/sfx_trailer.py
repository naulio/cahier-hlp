"""Trailer sound design kit (v3), fully procedural: whooshes, impacts, risers, sub drops,
shimmers, pops, flash fizz. Written next to the CC0 library in audio/sfx/ and added to
audio/sfx/library.json (source « procédural », licence « créé pour le projet »).

Run after sfx.py:  cd scripts/audio && python sfx_trailer.py
"""
import json

import numpy as np
from pedalboard import Compressor, HighpassFilter, LowpassFilter, Reverb

import lib
from lib import SR

OUT = lib.ROOT / "audio" / "sfx"
rng = np.random.default_rng(11)
LIB_PATH = OUT / "library.json"
LIB = json.loads(LIB_PATH.read_text()) if LIB_PATH.exists() else {}
t_ = lambda n: np.arange(n) / SR


def save(name, x, note, peak_db=-1.0):
    x = lib.st(x).astype(np.float32)
    x = lib.fade(x, 0.001, min(0.05, len(x) / SR / 5))
    x *= lib.db(peak_db) / max(1e-6, np.max(np.abs(x)))
    lib.sf.write(str(OUT / f"{name}.wav"), x, SR, subtype="PCM_24")
    LIB[name] = {"source": "procédural", "title": "", "author": "", "url": "", "license": "créé pour le projet",
                 "note": note, "dur": round(len(x) / SR, 3)}


def swept_noise(dur, f0, f1, q=1.2, shape=0.55, width=0.8):
    """Bruit filtré dont la bande glisse de f0 à f1 (souffle qui passe), en stéréo mobile."""
    n = lib.seconds(dur)
    tt = np.linspace(0, 1, n)
    noise = rng.standard_normal((n, 2)).astype(np.float32)
    out = np.zeros_like(noise)
    hop = 256
    fc = f0 * (f1 / f0) ** tt
    from scipy.signal import butter, sosfilt
    zi = None
    for i in range(0, n, hop):          # filtre passe-bande variant dans le temps (par blocs)
        c = fc[min(i, n - 1)]
        lo, hi = c / (1 + 1 / q), c * (1 + 1 / q)
        sos = butter(2, [max(30, lo) / (SR / 2), min(hi, SR / 2 - 100) / (SR / 2)], btype="band", output="sos")
        out[i:i + hop] = sosfilt(sos, noise[i:i + hop], axis=0)
    e = np.where(tt < shape, (tt / shape) ** 2.2, ((1 - tt) / (1 - shape)) ** 1.4)
    p = np.sin(np.pi * tt) * width
    out[:, 0] *= e * (1 - 0.5 * p)
    out[:, 1] *= e * (1 - 0.5 * (width - p))
    return out


def whoosh(dur, f0, f1, body=True):
    x = swept_noise(dur, f0, f1)
    if body:                             # un peu de corps grave qui suit le passage
        n = len(x)
        tt = np.linspace(0, 1, n)
        fr = 90 * (1.8 ** np.sin(np.pi * tt))
        ph = 2 * np.pi * np.cumsum(fr) / SR
        x += lib.st(np.sin(ph) * np.sin(np.pi * tt) ** 3 * 0.25)
    return lib.fx(x, Reverb(room_size=0.35, wet_level=0.18, dry_level=0.9))


def impact(tail=1.6, f_hi=58, f_lo=34, crack=0.6, tau=0.3):
    n = lib.seconds(tail)
    tt = t_(n)
    f = f_lo + (f_hi - f_lo) * np.exp(-tt / 0.06)
    sub = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt / tau)
    body = lib.filt(rng.standard_normal(n).astype(np.float32), "bandpass", [120, 900]) * np.exp(-tt / 0.08) * 0.8
    click = lib.filt(rng.standard_normal(n).astype(np.float32), "highpass", 2500) * np.exp(-tt / 0.006) * crack
    x = lib.st(sub * 1.2 + body + click)
    x = lib.fx(x, Compressor(threshold_db=-10, ratio=3, attack_ms=2, release_ms=120),
               Reverb(room_size=0.75, damping=0.4, wet_level=0.22, dry_level=0.95, width=1.0))
    return lib.saturate(x, 1.15)


def riser(dur, f0=200, f1=4200, tone=True):
    x = swept_noise(dur, f0, f1, q=0.8, shape=0.97, width=0.4)
    n = len(x)
    tt = np.linspace(0, 1, n)
    if tone:                              # accord qui monte (quinte + octave), tension croissante
        base = 110 * 2 ** (tt * 1.0)
        s = sum(np.sin(2 * np.pi * np.cumsum(base * r) / SR) * a for r, a in ((1, 0.5), (1.5, 0.3), (2, 0.25)))
        x += lib.st(s * tt ** 2.5 * 0.35)
    x *= (tt ** 1.8)[:, None]
    x[-lib.seconds(0.01):] *= np.linspace(1, 0, lib.seconds(0.01))[:, None]   # coupe nette sur le temps fort
    return lib.fx(x, Reverb(room_size=0.5, wet_level=0.15, dry_level=0.95))


def sub_drop(dur=1.4, f0=90, f1=28):
    n = lib.seconds(dur)
    tt = t_(n)
    f = f1 + (f0 - f1) * np.exp(-tt / 0.35)
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt / 0.45)
    return lib.saturate(lib.st(x), 1.3)


def shimmer(dur=1.2, notes=(2093, 2637, 3136, 4186)):
    n = lib.seconds(dur)
    x = np.zeros(n, np.float32)
    for k, f in enumerate(notes):
        i = lib.seconds(k * 0.045)
        m = n - i
        tt = t_(m)
        x[i:] += np.sin(2 * np.pi * f * tt) * np.exp(-tt / 0.35) * 0.3
    x += lib.filt(rng.standard_normal(n).astype(np.float32), "highpass", 7000) * np.exp(-t_(n) / 0.25) * 0.08
    return lib.fx(lib.st(x), Reverb(room_size=0.85, wet_level=0.45, dry_level=0.7, width=1.0))


def pop(f=900, dur=0.12):
    n = lib.seconds(dur)
    tt = t_(n)
    fr = f * (1 + 0.6 * np.exp(-tt / 0.012))
    x = np.sin(2 * np.pi * np.cumsum(fr) / SR) * np.exp(-tt / 0.03)
    x += lib.filt(rng.standard_normal(n).astype(np.float32), "bandpass", [2000, 8000]) * np.exp(-tt / 0.004) * 0.3
    return lib.st(x)


def fizz(dur=0.45):
    """Flash : souffle clair et bref (ampoule de flash qui part)."""
    n = lib.seconds(dur)
    tt = t_(n)
    x = lib.filt(rng.standard_normal((n, 2)).astype(np.float32), "highpass", 3000) * np.exp(-tt / 0.09)[:, None]
    x += lib.st(np.sin(2 * np.pi * 5200 * tt) * np.exp(-tt / 0.05) * 0.15)
    return lib.fx(x, Reverb(room_size=0.6, wet_level=0.3, dry_level=0.9))


def reverse_swell(dur=1.6):
    n = lib.seconds(dur)
    src = np.zeros((lib.seconds(0.3), 2), np.float32)
    for f in (220, 330, 440, 660):
        src += lib.st(np.sin(2 * np.pi * f * t_(len(src))) * 0.2)
    src += lib.filt(rng.standard_normal((len(src), 2)).astype(np.float32), "bandpass", [500, 6000]) * 0.3
    rv = lib.reverb(src, room=0.95, wet=1.0, tail=dur)
    rv = rv[::-1][-n:]
    rv[-lib.seconds(0.008):] *= np.linspace(1, 0, lib.seconds(0.008))[:, None]
    return rv


for k, (d, f0, f1) in enumerate([(0.45, 300, 3000), (0.6, 2500, 250), (0.8, 180, 2400), (0.35, 900, 5000)]):
    save(f"whoosh_{k + 1}", whoosh(d, f0, f1), f"souffle de passage {d}s ({f0}→{f1} Hz)")
save("whoosh_long", whoosh(1.4, 120, 3200), "grand souffle (recul de caméra)")
save("impact_1", impact(tau=0.32), "impact grave (révélation)")
save("impact_2", impact(1.1, 70, 40, 0.9, tau=0.2), "impact plus sec")
save("hit_small", impact(0.5, 95, 60, 1.0, tau=0.07), "petit impact (arrivée d'un élément)")
save("riser_2", riser(2.0), "montée 2 s, coupe nette")
save("riser_4", riser(4.0, 120, 5200), "montée 4 s, coupe nette")
save("sub_drop", sub_drop(), "chute grave (après un temps fort)")
save("shimmer", shimmer(), "scintillement (reflet lumineux)")
for k, f in enumerate([760, 980, 1240]):
    save(f"pop_{k + 1}", pop(f), f"apparition d'élément d'interface ({f} Hz)", peak_db=-4)
save("fizz", fizz(), "flash (ampoule)")
save("reverse_swell", reverse_swell(), "souffle inversé (aspiration avant un temps fort)")
LIB_PATH.write_text(json.dumps(LIB, ensure_ascii=False, indent=1))
print(len(LIB), "sons dans la bibliothèque")
