"""Original score, generated from code and locked to the picture (v2).

Instruments: Salamander grand piano (real samples, played soft and filtered
like a felt piano), a warm synth pad, sub bass, and percussion made from the
project's own CC0 paper and pen recordings (paper hits, marker strokes)
with a very soft kick. No synth arpeggio, no hi-hat loop.

Harmony: D minor / F major, modal (Dm9 – B♭maj7 – F/A – Gm7), the loop is
broken on the timeline. One motif (A C D E) is played on the four authors'
names, becomes the ostinato of the app section, and resolves on F on « là ».

Tempo map: 80 BPM before the shutter (the names fall on the beats),
90 BPM from the shutter on (the grid restarts on the click).
Writes audio/music/score.wav and stems.
"""
import json

import numpy as np
from pedalboard import Chorus, Compressor, HighpassFilter, LowpassFilter, Reverb

import lib
from lib import SR, Track, db, n2m

ROOT = lib.ROOT
TL = json.loads((ROOT / "logs" / "timeline.json").read_text())
M = TL["marks"]
DUR = TL["duration"] + 0.5
rng = np.random.default_rng(7)

piano = lib.Piano(ROOT / "assets" / "instruments" / "SalamanderGrandPianoV3_44.1khz16bit" / "44.1khz16bit")
T = {k: Track(DUR) for k in ("piano", "keys", "pad", "bass", "perc", "texture")}

# percussions de papier et de crayon (mêmes enregistrements CC0 que les effets)
SFX = ROOT / "audio" / "sfx"
PAPER = [lib.load(SFX / f"paper_hit_{k}.wav") for k in (1, 2, 3)]
PEN = [lib.load(SFX / f"pen_stroke_{k}.wav") for k in (1, 3, 4)]
SLIDE = [lib.load(SFX / f"paper_slide_{k}.wav") for k in (1, 2, 4)]


def P(name, at, vel=50, dur=1.5, gain=0.0, pan_=0.0, rel=0.8, track="piano"):
    for nm in (name if isinstance(name, (list, tuple)) else [name]):
        T[track].add(piano.note(n2m(nm), vel, dur, release=rel), at, gain, pan_)


def chord_pad(notes, at, dur, level=0.16, cutoff=1600, attack=1.0, release=1.8):
    T["pad"].add(lib.pad([lib.mtof(n2m(n)) for n in notes], dur, attack=attack, release=release,
                         cutoff=cutoff, level=level), at)


def bass(note, at, dur, level=0.3):
    T["bass"].add(lib.sub(lib.mtof(n2m(note)), dur, level=level), at)


def hit(buf, at, g, p=0.0, lp=None):
    x = buf
    if lp:
        x = lib.filt(x, "lowpass", lp)
    T["perc"].add(x, at, g + rng.uniform(-1.5, 1.5), p)


def words(lid):
    return next(l for l in TL["lines"] if l["id"] == lid)["words"]


# =====================================================================
# 1) HOOK — une note par nom (la do ré mi), bourdon de ré mineur
# =====================================================================
MOTIF = ["A4", "C5", "D5", "E5"]
for k, nm in enumerate(MOTIF):
    t = M[f"n{k + 1}"]
    P(nm, t - 0.012, vel=54 + k * 3, dur=2.4, gain=-2, pan_=[-0.25, -0.08, 0.08, 0.25][k])
    P(nm.replace("4", "3").replace("5", "4"), t - 0.012, vel=32, dur=2.0, gain=-10)
chord_pad(["D2", "A2", "D3", "F3"], 0.2, M["q_tout"] + 0.6, level=0.11, cutoff=650, attack=2.4, release=2.0)
P(["Bb2", "F3", "A3", "D4"], M["q_start"] - 0.02, vel=42, dur=1.8, gain=-4)
P(["D2", "D1"], M["q_tout"] - 0.02, vel=60, dur=3.0, gain=-3)
T["texture"].add(lib.noise_swell(1.4, 200, 2400, level=0.03, curve=1.6), M["q_tout"] - 1.2)

# =====================================================================
# 2) LE PROBLÈME — ostinato en croches (80 BPM), les couches s'empilent
# =====================================================================
BEAT_A = 0.75
g0 = M["q_end"] + 0.35
cut = M["v5_mais"] - 0.04                  # tout s'arrête sur « Mais où ? »
PROBLEM = [(["D4", "A4", "F4", "A4", "D5", "A4", "F4", "A4"], "D2", ["D3", "F3", "A3"]),
           (["D4", "Bb4", "F4", "Bb4", "D5", "Bb4", "F4", "Bb4"], "Bb1", ["D3", "F3", "Bb3"]),
           (["C4", "A4", "F4", "A4", "C5", "A4", "F4", "A4"], "C2", ["C3", "F3", "A3"]),
           (["E4", "A4", "D5", "A4", "E5", "A4", "C#5", "A4"], "A1", ["E3", "A3", "C#4"])]
b = 0
while g0 + b * 4 * BEAT_A < cut:
    notes, bnote, padn = PROBLEM[b % 4]
    bar0 = g0 + b * 4 * BEAT_A
    for i, nm in enumerate(notes):
        t = bar0 + i * BEAT_A / 2 + rng.uniform(-0.008, 0.008)
        if t >= cut:
            break
        acc = 1.0 if i % 4 == 0 else 0.0
        P(nm, t, vel=int(38 + 9 * acc + 4 * b + rng.integers(-4, 5)), dur=0.3, rel=0.25, gain=-5 + b * 0.6,
          pan_=0.18 * np.sin(i), track="keys")
    if b >= 1:
        bass(bnote, bar0, min(4 * BEAT_A, cut - bar0), level=0.2 + 0.02 * b)
    chord_pad(padn, bar0, min(4 * BEAT_A, cut - bar0) + 0.2, level=0.06 + 0.02 * b, cutoff=800 + 300 * b, attack=0.8, release=0.5)
    for i in range(8):                     # le papier et le crayon comme percussion, discrets
        t = bar0 + i * BEAT_A / 2
        if t >= cut:
            break
        if b >= 1 and i % 2 == 1:
            hit(PEN[rng.integers(0, 3)], t, -30, 0.3 if i % 4 == 1 else -0.3, lp=7000)
        if b >= 2 and i in (2, 6):
            hit(PAPER[rng.integers(0, 3)], t, -24, 0.0, lp=5000)
    b += 1

# =====================================================================
# 3) SUSPENSE — note tenue, souffle inversé jusqu'au déclic
# =====================================================================
sh = M["shutter"]
P("A5", cut + 0.05, vel=34, dur=1.6, gain=-7, rel=1.5)
src = np.zeros((lib.seconds(2.6), 2), np.float32)
for nn in ["F3", "C4", "A4", "G5"]:
    x = piano.note(n2m(nn), 70, 2.0)[: len(src)]
    src[: len(x)] += x * 0.5
rv = lib.reverb(src, room=0.92, wet=1.0, tail=3.0)
rv = rv[::-1][-lib.seconds(2.0):]
T["texture"].add(lib.fade(rv * 0.45, 0.6, 0.01), sh - 2.0)

# =====================================================================
# 4) RÉVÉLATION — fa (add9) sur le déclic ; le logo s'écrit sur si♭
# =====================================================================
BEAT = 60 / 90
BAR = 4 * BEAT
G = sh
P(["F2", "C3"], G, vel=64, dur=3.0)
P(["F4", "A4", "C5", "G5"], G + 0.02, vel=48, dur=2.6, gain=-3)
chord_pad(["F2", "C3", "A3", "G4", "C5"], G, 2 * BAR + 0.4, level=0.15, cutoff=2200, attack=0.35, release=1.5)
bass("F1", G, BAR * 1.6, level=0.28)
T["perc"].add(lib.kick(level=0.42, f0=80, f1=40, tau=0.5), G)
P(["Bb1", "F2"], M["v7_start"] - 0.02, vel=52, dur=2.4)
P(["D4", "F4", "A4", "C5"], M["v7_cahier"] - 0.02, vel=42, dur=2.2, gain=-4)
bass("Bb1", M["v7_start"], BAR * 0.95, level=0.22)

# =====================================================================
# 5) L'APPLICATION — ré m9, si♭ maj7, fa/la, sol m7 ; ostinato du motif ;
#    percussions papier ; la boucle se brise sur la frise
# =====================================================================
g1 = M["v8_start"] - 0.35
frise = M["v11_start"] - 0.5
brk = M["v12_start"] - 0.2
GROOVE = [(["D3", "F3", "A3", "E4"], "D2", ["D2", "A2", "F3", "E4"], ["A4", "C5", "D5", "E5"]),
          (["D3", "F3", "A3", "C4"], "Bb1", ["Bb1", "F2", "D3", "A3"], ["A4", "C5", "D5", "F5"]),
          (["C3", "F3", "A3", "E4"], "A1", ["A1", "E2", "C3", "F3"], ["A4", "C5", "E5", "F5"]),
          (["D3", "F3", "Bb3", "D4"], "G1", ["G1", "D2", "Bb2", "F3"], ["G4", "Bb4", "D5", "F5"])]
FRISE = [(["D3", "G3", "Bb3", "D4"], "Bb1", ["Bb1", "F2", "D3", "A3"], ["D5", "F5", "A5", "C6"]),
         (["E3", "G3", "C4", "E4"], "C2", ["C2", "G2", "E3", "G3"], ["E5", "G5", "C6", "D6"])]
t = g1
bi = 0
while t < brk - 0.05:
    in_frise = t >= frise - 0.1
    keys, bn, padn, mot = (FRISE[bi % 2] if in_frise else GROOVE[bi % 4])
    end_bar = min(t + BAR, brk)
    chord_pad(padn, t, end_bar - t + 0.15, level=0.1 + (0.03 if in_frise else 0), cutoff=1700 + (1200 if in_frise else 0), attack=0.3, release=0.6)
    P(keys, t, vel=42 + (6 if in_frise else 0), dur=BEAT * 1.8, gain=-4)
    for (pos, d) in ((0, 1.6), (2.5, 1.2)):
        tt = t + pos * BEAT
        if tt < brk:
            bass(bn, tt, d * BEAT, level=0.24)
    for i in range(8):                       # ostinato du motif, en croches, jamais identique
        tt = t + i * BEAT / 2 + rng.uniform(-0.01, 0.01)
        if tt >= brk:
            break
        nm = mot[[0, 1, 2, 3, 2, 1, 3, 2][i] if bi % 2 == 0 else [0, 2, 1, 3, 1, 2, 0, 3][i]]
        P(nm, tt, vel=int(32 + (10 if i % 4 == 0 else 0) + rng.integers(-4, 5)), dur=0.32, rel=0.3,
          gain=-7 + (1.5 if in_frise else 0), pan_=0.25 * np.sin(i * 0.9), track="keys")
    for i in range(8):                       # papier, crayon, et un kick très doux
        tt = t + i * BEAT / 2
        if tt >= brk:
            break
        if i == 0:
            T["perc"].add(lib.kick(level=0.3, f0=85, f1=45, tau=0.3), tt)
        if i in (2, 6):
            hit(PAPER[(bi + i) % 3], tt, -21, -0.1, lp=6000)
        if i % 2 == 1:
            hit(PEN[rng.integers(0, 3)], tt, -29, 0.35 if i % 4 == 1 else -0.35, lp=7500)
        if in_frise and i % 2 == 0:
            hit(SLIDE[rng.integers(0, 3)], tt + BEAT / 4, -31, 0.4, lp=7000)
    t += BAR
    bi += 1
# « corrigés » : deux notes pour la bonne réponse
P("C6", M["v10_corriges"] - 0.14, vel=44, dur=0.6, gain=-6)
P("F6", M["v10_corriges"] - 0.02, vel=48, dur=1.2, gain=-5)
# les auteurs de la frise s'allument : une note chacun, très doux
frise_notes = ["D4", "F4", "A4", "C5", "D5", "F5", "A5", "C6", "D6"]
for k, nm in enumerate(frise_notes):
    P(nm, M["v11_start"] - 0.45 + 0.25 + 0.9 * k / 8 * 0.85, vel=30, dur=0.5, gain=-12, pan_=-0.5 + k / 8)
T["texture"].add(lib.noise_swell(1.0, 500, 7000, level=0.025, curve=2.5), brk - 1.0)

# =====================================================================
# 6) RESPIRATION — la classe : accords ouverts, plus présents
# =====================================================================
BR = [(["Bb1", "F2", "D3", "A3", "C4"], ["Bb2", "F3", "A3", "D4"]),
      (["A1", "E2", "C3", "F3", "A3"], ["A2", "F3", "C4", "E4"]),
      (["G1", "D2", "Bb2", "F3", "A3"], ["G2", "F3", "Bb3", "D4"]),
      (["C2", "G2", "C3", "F3", "Bb3"], ["C3", "G3", "Bb3", "F4"])]
v14 = M["v14_start"]
seglen = (v14 - brk) / len(BR)
for k, (pd, pn) in enumerate(BR):
    t = brk + k * seglen
    chord_pad(pd, t, seglen + 0.2, level=0.13, cutoff=1400, attack=0.8, release=1.0)
    P(pn, t, vel=44, dur=seglen, gain=-2, rel=1.2)
    bass(pd[0], t, seglen * 0.9, level=0.18)
    P(pn[-1].replace("4", "5").replace("3", "5"), t + seglen * 0.5, vel=36, dur=seglen * 0.5, gain=-6)
for r, nm in enumerate(["F5", "G5", "A5", "C6", "D6", "F6"]):     # toute la classe cochée
    P(nm, M["v13_classe"] - 0.25 + r * 0.16 + rng.uniform(-0.03, 0.03), vel=34 + r * 2, dur=1.6, gain=-5, pan_=-0.4 + r * 0.16, rel=1.5)

# =====================================================================
# 7) FIN — résolution ; le motif revient et se pose sur fa, sur « là »
# =====================================================================
P(["F1", "F2", "C3"], v14 + 0.3, vel=58, dur=5.5, rel=2.5)
P(["A3", "C4", "G4"], v14 + 0.32, vel=40, dur=5.0, gain=-3, rel=2.5)
chord_pad(["F2", "C3", "A3", "G4", "C5", "E5"], v14 + 0.25, M["end"] - v14 - 1.4, level=0.13, cutoff=2000, attack=0.6, release=2.5)
bass("F1", v14 + 0.3, 5.0, level=0.22)
T["perc"].add(lib.kick(level=0.3, f0=80, f1=40, tau=0.5), v14 + 0.3)
w = {x["w"]: x["t0"] for x in words("V14")}
motif_t = [w.get("cahier"), w.get("hlp"), w.get("tout"), w.get("est")]
for nm, t in zip(MOTIF, motif_t):
    if t:
        P(nm, t - 0.01, vel=46, dur=1.2, gain=-4, rel=2.0)
P("F5", w.get("là", M["v14_end"]) - 0.01, vel=56, dur=4.0, gain=-2, rel=2.5)
land = M["capture"] + 1.35                  # le Polaroid se pose : dernier accord
P(["F2", "C3", "A3", "E4"], land, vel=48, dur=3.0, gain=-3, rel=2.5)
P(["C5", "F5"], land + 0.02, vel=40, dur=3.0, gain=-5, rel=2.5)

# texture : souffle de bande très discret, qui disparaît au déclic
n = lib.seconds(sh + 0.3)
hiss = lib.filt(rng.standard_normal((n, 2)).astype(np.float32), "bandpass", [1800, 9000]) * 0.005
hiss *= np.clip(np.arange(n) / lib.seconds(1.0), 0, 1)[:, None]
hiss[-lib.seconds(0.25):] *= np.linspace(1, 0, lib.seconds(0.25))[:, None]
T["texture"].add(hiss, 0.0)


# =====================================================================
# traitement et sortie
# =====================================================================
def proc(name, x):
    if name in ("piano", "keys"):
        x = lib.fx(x, HighpassFilter(45), LowpassFilter(5200 if name == "piano" else 3600),
                   Compressor(threshold_db=-18, ratio=2.0, attack_ms=15, release_ms=200))
        x = lib.saturate(x, 1.1)
        x = lib.fx(x, Reverb(room_size=0.72, damping=0.55, wet_level=0.22, dry_level=0.85, width=1.0))
    elif name == "pad":
        x = lib.fx(x, Chorus(rate_hz=0.25, depth=0.3, mix=0.35), Reverb(room_size=0.85, wet_level=0.3, dry_level=0.8))
    elif name == "perc":
        x = lib.fx(x, Compressor(threshold_db=-18, ratio=2.5, attack_ms=6, release_ms=120),
                   Reverb(room_size=0.3, damping=0.6, wet_level=0.14, dry_level=0.95))
    elif name == "bass":
        x = lib.fx(x, LowpassFilter(240))
    return x[: len(T["piano"].buf)]


GAIN = {"piano": 0.0, "keys": -3.0, "pad": 0.0, "bass": -9.0, "perc": -1.0, "texture": 0.0}
out = ROOT / "audio" / "music"
out.mkdir(parents=True, exist_ok=True)
for f in out.glob("stem_*.wav"):
    f.unlink()
mix = np.zeros_like(T["piano"].buf)
for k, tr in T.items():
    x = proc(k, tr.buf) * db(GAIN[k])
    x = np.pad(x, ((0, max(0, len(mix) - len(x))), (0, 0)))[: len(mix)]
    lib.sf.write(str(out / f"stem_{k}.wav"), x, SR, subtype="PCM_24")
    mix += x
mix = lib.fx(mix, HighpassFilter(40), Compressor(threshold_db=-14, ratio=2.0, attack_ms=20, release_ms=250))
mix *= db(-3) / max(np.max(np.abs(mix)), 1e-6)
# automation par section : la courbe d'énergie du film
AUTO = [(0.0, -5), (M["q_tout"], -4), (M["v3_start"], -7), (M["v4_notes"], -5), (M["v5_tout"], -3), (M["v5_mais"], -3),
        (sh, 0), (g1, -1), (frise, 0), (brk - 0.2, 0), (brk + 0.8, -2), (M["v13_classe"] - 0.5, -1),
        (v14 + 0.3, 0), (M["capture"], 0), (M["end"] - 1.2, 0), (M["end"], -12)]
ts = np.array([a for a, _ in AUTO]); gs = np.array([g for _, g in AUTO])
tt = np.arange(len(mix)) / SR
mix *= db(np.interp(tt, ts, gs))[:, None].astype(np.float32)
mix[-lib.seconds(0.4):] *= np.linspace(1, 0, lib.seconds(0.4))[:, None]
lib.sf.write(str(out / "score.wav"), mix, SR, subtype="PCM_24")
print("score", round(len(mix) / SR, 2), "s")
