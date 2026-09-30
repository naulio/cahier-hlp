"""Original score, generated from code and locked to the picture.

v4 : la partition de la v1, sans batterie (choix du commanditaire : « bande son drumless »).
La piste « drums » est encore écrite en stem pour mémoire, mais n'entre plus dans le mix.

Instruments: Salamander grand piano (real samples, played soft and filtered
like a felt piano), synth pad, sub bass, soft procedural percussion, a
plucked arpeggio, tape hiss. Key of F major / D minor, 90 BPM.

Structure (times come from logs/timeline.json):
  hook      one piano note per author name (A C D E) over a D minor drone
  problem   8th-note piano ostinato, layers pile up like the sheets; cut on « Mais où ? »
  suspense  held note + reversed swell into the shutter
  reveal    F(add9) bloom on the shutter; sparkle on the logo
  groove    F – Am7 – Dm7 – Bbmaj7, soft kit, bass, arpeggio; lift on the timeline
  breath    drums out, spread piano chords; rising arpeggio when the class lights up
  end       resolution: the hook motif returns and lands on F (« au même endroit »)

Writes audio/music/score.wav (full) and stems (piano, pad, bass, drums, texture).
"""
import json

import numpy as np
from pedalboard import Chorus, Compressor, Delay, HighpassFilter, LowpassFilter, Reverb

import lib
from lib import SR, Track, db, n2m

ROOT = lib.ROOT
TL = json.loads((ROOT / "logs" / "timeline.json").read_text())
M = TL["marks"]
DUR = TL["duration"] + 0.5
BPM = 90.0
BEAT = 60 / BPM
BAR = 4 * BEAT
rng = np.random.default_rng(7)

piano = lib.Piano(ROOT / "assets" / "instruments" / "SalamanderGrandPianoV3_44.1khz16bit" / "44.1khz16bit")

T = {k: Track(DUR) for k in ("piano", "keys", "pad", "bass", "drums", "arp", "texture")}


def P(name, at, vel=50, dur=1.5, gain=0.0, pan_=0.0, rel=0.8, track="piano"):
    for nm in (name if isinstance(name, (list, tuple)) else [name]):
        T[track].add(piano.note(n2m(nm), vel, dur, release=rel), at, gain, pan_)


def chord_pad(notes, at, dur, level=0.16, cutoff=1600, attack=1.0, release=1.8):
    T["pad"].add(lib.pad([lib.mtof(n2m(n)) for n in notes], dur, attack=attack, release=release,
                         cutoff=cutoff, level=level), at)


def bass(note, at, dur, level=0.3):
    T["bass"].add(lib.sub(lib.mtof(n2m(note)), dur, level=level), at)


# =====================================================================
# 1) HOOK — une note par nom, sur un bourdon de ré mineur
# =====================================================================
hook_notes = ["A4", "C5", "D5", "E5"]
for k, nm in enumerate(hook_notes):
    t = M[f"n{k + 1}"]
    P(nm, t - 0.012, vel=58 + k * 4, dur=2.4, pan_=[-0.25, -0.08, 0.08, 0.25][k])
    P(nm.replace("4", "3").replace("5", "4"), t - 0.012, vel=34, dur=2.0, gain=-8)
chord_pad(["D2", "A2", "D3", "F3"], 0.0, M["q_tout"] + 0.6, level=0.13, cutoff=700, attack=2.2, release=2.0)
# « Tu te souviens de tout ? » : accord suspendu, puis grave sur « tout »
P(["Bb2", "F3", "A3", "D4"], M["q_start"] - 0.02, vel=44, dur=1.8, gain=-3)
P(["D2", "D1"], M["q_tout"] - 0.02, vel=62, dur=3.0, gain=-2)
T["texture"].add(lib.noise_swell(1.4, 200, 2400, level=0.035, curve=1.6), M["q_tout"] - 1.2)

# =====================================================================
# 2) LE PROBLÈME — ostinato en croches, les couches s'empilent
# =====================================================================
g0 = 5.333                                # grille à 90 BPM depuis 0 : mesure 3
cut = M["v5_mais"] - 0.04                 # tout s'arrête sur « Mais où ? »
PROBLEM = [("Dm", ["D4", "A4", "F4", "A4", "D5", "A4", "F4", "A4"], "D2", ["D3", "F3", "A3"]),
           ("Bb", ["D4", "Bb4", "F4", "Bb4", "D5", "Bb4", "F4", "Bb4"], "Bb1", ["D3", "F3", "Bb3"]),
           ("F/C", ["C4", "A4", "F4", "A4", "C5", "A4", "F4", "A4"], "C2", ["C3", "F3", "A3"]),
           ("A", ["E4", "A4", "D5", "A4", "E5", "A4", "C#5", "A4"], "A1", ["E3", "A3", "C#4"])]
for b, (_, notes, bnote, padn) in enumerate(PROBLEM):
    bar0 = g0 + b * BAR
    for i, nm in enumerate(notes):
        t = bar0 + i * BEAT / 2
        if t < 6.0 or t >= cut:
            continue
        acc = 1.0 if i % 4 == 0 else 0.0
        P(nm, t, vel=int(40 + 10 * acc + 6 * b + rng.integers(-3, 4)), dur=0.28, rel=0.25, gain=-4 + b * 0.8,
          pan_=0.18 * np.sin(i), track="keys")
    if bar0 >= 7.9 and bar0 < cut:
        bass(bnote, bar0, min(BAR, cut - bar0), level=0.22 + 0.03 * b)
    chord_pad(padn, bar0, min(BAR, cut - bar0) + 0.2, level=0.07 + 0.02 * b, cutoff=900 + 300 * b, attack=0.8, release=0.5)
    # tic-tac (croches) à partir de la 2e mesure, puis shaker et pulsation
    for i in range(8):
        t = bar0 + i * BEAT / 2
        if t >= cut:
            break
        if b >= 1:
            T["drums"].add(lib.rim(level=0.05 if i % 2 else 0.075, f=2400), t, p=0.3 if i % 2 else -0.3)
        if b >= 2:
            T["drums"].add(lib.shaker(level=0.035), t + BEAT / 4, p=0.4)
        if b >= 2 and i % 4 == 0:
            T["drums"].add(lib.kick(level=0.35, f0=90, f1=42, tau=0.28), t)

# =====================================================================
# 3) SUSPENSE — note tenue, souffle inversé jusqu'au déclic
# =====================================================================
sh = M["shutter"]
P("A5", cut + 0.05, vel=36, dur=1.4, gain=-6, rel=1.5)
# souffle inversé : accord de fa réverbéré, retourné, qui finit pile sur le déclic
src = np.zeros((lib.seconds(2.6), 2), np.float32)
for nn in ["F3", "C4", "A4", "G5"]:
    x = piano.note(n2m(nn), 70, 2.0)[: len(src)]
    src[: len(x)] += x * 0.5
rv = lib.reverb(src, room=0.92, wet=1.0, tail=3.0)
rv = rv[::-1][-lib.seconds(2.2):]
T["texture"].add(lib.fade(rv * 0.5, 0.6, 0.01), sh - 2.2)
T["texture"].add(lib.noise_swell(1.6, 600, 5000, level=0.032, curve=3.0), sh - 1.6)   # v6 : -4 dB, moins d'aigus (plus de « levée » de bande-annonce)

# =====================================================================
# 4) RÉVÉLATION — fa (add9) sur le déclic ; éclat sur le logo
# =====================================================================
G = sh                                     # nouvelle grille : mesure 1 = le déclic
P(["F2", "C3"], G, vel=66, dur=3.0)
P(["F4", "A4", "C5", "G5"], G + 0.02, vel=50, dur=2.6, gain=-2)
chord_pad(["F2", "C3", "A3", "G4", "C5"], G, 2 * BAR + 0.4, level=0.16, cutoff=2400, attack=0.35, release=1.5)
bass("F1", G, BAR * 1.6, level=0.32)
T["drums"].add(lib.kick(level=0.55, f0=80, f1=38, tau=0.5), G)
P(["Bb2", "F3"], G + BAR, vel=52, dur=2.4)
P(["D4", "F4", "A4", "C5"], G + BAR + 0.02, vel=44, dur=2.2, gain=-3)
bass("Bb1", G + BAR, BAR * 0.95, level=0.26)
P(["F6", "C7"], M["v7_cahier"] - 0.01, vel=40, dur=1.6, gain=-4, pan_=0.2)
P("A6", M["v7_hlp"], vel=34, dur=1.4, gain=-7, pan_=-0.2)

# =====================================================================
# 5) LE GROOVE — fa, la m7, ré m7, si♭ maj7 (x2) ; montée sur la frise
# =====================================================================
g1 = G + 2 * BAR
brk = M["v12_start"] + 0.3               # respiration : un peu après « C'est gratuit »
brk = g1 + round((brk - g1) / (BAR / 2)) * BAR / 2  # v5 : calée sur un temps fort (1 ou 3), plus de double attaque
GROOVE = [(["F3", "A3", "C4", "E4"], "F1", ["F2", "C3", "A3", "E4"], ["F4", "A4", "C5", "E5"]),
          (["E3", "G3", "A3", "C4"], "A1", ["A2", "E3", "G3", "C4"], ["E4", "A4", "C5", "G5"]),
          (["D3", "F3", "A3", "C4"], "D2", ["D2", "A2", "F3", "C4"], ["D4", "F4", "A4", "C5"]),
          (["D3", "F3", "A3", "Bb3"], "Bb1", ["Bb1", "F2", "D3", "A3"], ["D4", "F4", "A4", "D5"])]
nb = int(np.ceil((brk - g1) / BAR - 1e-6))
for b in range(nb):
    bar0 = g1 + b * BAR
    keys, bn, padn, arp = GROOVE[b % 4]
    end_bar = min(bar0 + BAR, brk)
    lift = 1.0 if bar0 >= M["v11_start"] - BAR * 0.5 else 0.0
    chord_pad(padn, bar0, end_bar - bar0 + 0.1, level=0.1 + 0.03 * lift, cutoff=1800 + 1400 * lift, attack=0.25, release=0.6)
    P(keys, bar0, vel=46 + 6 * lift, dur=BEAT * 1.5, gain=-3)
    if bar0 + BEAT * 2.5 < brk - 0.1:     # v5 : rien ne déborde sur la respiration
        P(keys, bar0 + BEAT * 2.5, vel=40, dur=BEAT * 1.2, gain=-6)
    # basse syncopée
    for (pos, d) in ((0, 1.4), (1.5, 0.45), (2.5, 1.2)):
        tt = bar0 + pos * BEAT
        if tt < brk:
            bass(bn, tt, d * BEAT, level=0.28)
    for i in range(16):
        tt = bar0 + i * BEAT / 4
        if tt >= brk:
            break
        if i % 8 == 0 or i == 6 or (i == 14 and b % 2):
            T["drums"].add(lib.kick(level=0.5 if i % 8 == 0 else 0.34), tt)
        if i % 8 == 4:
            T["drums"].add(lib.rim(level=0.11, f=1650), tt, p=-0.1)
        if i % 2 == 0:
            T["drums"].add(lib.rim(level=0.028 if i % 4 else 0.04, f=5200), tt, p=0.35)   # charleston fermé, doux
        if b >= 1:
            T["drums"].add(lib.shaker(level=0.026 + 0.012 * lift), tt + 0.012 * (i % 2), p=-0.4)
        # arpège (16es), à partir de la 2e mesure
        if b >= 1:
            nm = arp[[0, 1, 2, 3, 2, 1, 2, 3][i % 8]]
            T["arp"].add(lib.pluck(lib.mtof(n2m(nm) + (12 if (lift and i % 8 >= 4) else 0)), level=0.075, decay=0.16,
                                   bright=2200 + 1600 * lift), tt, p=0.3 * np.sin(i * 0.8))
    # mélodie au piano sur la frise
    if lift:
        mel = ["A5", "G5", "F5", "E5"] if b % 2 == 0 else ["D5", "F5", "A5", "C6"]
        for k, nm in enumerate(mel):
            if bar0 + k * BEAT < brk - 0.1:
                P(nm, bar0 + k * BEAT, vel=54, dur=BEAT * 1.6, gain=-2, pan_=0.1)

# « corrigés » : deux notes au piano pour la bonne réponse
P("C6", M["v10_corriges"] - 0.14, vel=46, dur=0.6, gain=-5)
P("F6", M["v10_corriges"] - 0.02, vel=50, dur=1.2, gain=-4)
# les neuf textes de la frise s'allument : une note chacun, montante
frise_notes = ["F4", "G4", "A4", "C5", "D5", "F5", "G5", "A5", "C6"]
for k, nm in enumerate(frise_notes):
    P(nm, M["v11_frise"] - 0.25 + 0.9 * k / 8 * 0.95, vel=38, dur=0.5, gain=-8, pan_=-0.5 + k / 8)
# levée vers la respiration
T["texture"].add(lib.noise_swell(1.2, 500, 8000, level=0.025, curve=2.5), brk - 1.2)   # v6 : -3 dB

# =====================================================================
# 6) RESPIRATION — la batterie s'efface, accords ouverts
# =====================================================================
BR = [(["Bb1", "F2", "D3", "A3", "C4"], ["Bb2", "F3", "A3", "D4"]),
      (["A1", "E2", "C3", "F3", "A3"], ["A2", "F3", "C4", "E4"]),
      (["G1", "D2", "Bb2", "F3", "A3"], ["G2", "F3", "Bb3", "D4"]),
      (["C2", "G2", "C3", "F3", "Bb3"], ["C3", "G3", "Bb3", "F4"])]
v14 = M["v14_start"]
seglen = (v14 - brk) / len(BR)
for k, (pd, pn) in enumerate(BR):
    t = brk + k * seglen
    chord_pad(pd, t, seglen + 0.2, level=0.11, cutoff=1300, attack=0.9, release=1.0)
    P(pn, t, vel=40, dur=seglen, gain=-3, rel=1.2)
    bass(pd[0], t, seglen * 0.9, level=0.18)
    P(pn[-1].replace("4", "5").replace("3", "5"), t + seglen * 0.5, vel=34, dur=seglen * 0.5, gain=-8)
# la classe s'allume : arpège montant (une note par rangée)
for r, nm in enumerate(["F5", "G5", "A5", "C6", "D6", "F6"]):
    P(nm, M["v13_classe"] - 0.35 + r * 0.075 + 0.02, vel=34 + r * 2, dur=1.6, gain=-6, pan_=-0.4 + r * 0.16, rel=1.5)

# =====================================================================
# 7) FIN — résolution ; le motif du début revient et se pose sur fa
# =====================================================================
P(["F1", "F2", "C3"], v14 + 0.35, vel=60, dur=5.0, rel=2.5)
P(["A3", "C4", "G4"], v14 + 0.37, vel=42, dur=4.5, gain=-3, rel=2.5)
chord_pad(["F2", "C3", "A3", "G4", "C5", "E5"], v14 + 0.3, M["end"] - v14 - 1.8, level=0.14, cutoff=2000, attack=0.6, release=2.5)
bass("F1", v14 + 0.35, 4.5, level=0.24)
T["drums"].add(lib.kick(level=0.38, f0=80, f1=38, tau=0.5), v14 + 0.35)
tag = [w for w in next(l for l in TL["lines"] if l["id"] == "V14")["words"]][-6:]
motif = [("A4", tag[0]["t0"]), ("C5", tag[2]["t0"]), ("D5", tag[3]["t0"] if len(tag) > 3 else tag[2]["t1"]),
         ("E5", tag[4]["t0"]), ("F5", tag[5]["t0"])]
for k, (nm, t) in enumerate(motif):
    P(nm, t - 0.01, vel=48 + (8 if k == 4 else 0), dur=3.5 if k == 4 else 1.2, gain=-2 if k == 4 else -4, rel=2.0)
P(["C6", "F6"], M["capture"] + 1.9, vel=32, dur=3.0, gain=-5, rel=2.5)   # v5 : +3 dB, audibles

# =====================================================================
# texture : souffle de bande très discret, qui disparaît au déclic
# =====================================================================
n = lib.seconds(sh + 0.3)
hiss = lib.filt(rng.standard_normal((n, 2)).astype(np.float32), "bandpass", [1800, 9000]) * 0.006
hiss *= np.clip(np.arange(n) / lib.seconds(1.0), 0, 1)[:, None]
hiss[-lib.seconds(0.25):] *= np.linspace(1, 0, lib.seconds(0.25))[:, None]
T["texture"].add(hiss, 0.0)


# =====================================================================
# traitement et sortie
# =====================================================================
def proc(name, x):
    if name in ("piano", "keys"):
        x = lib.fx(x, HighpassFilter(45), LowpassFilter(5200 if name == "piano" else 3400),
                   Compressor(threshold_db=-18, ratio=2.0, attack_ms=15, release_ms=200))
        x = lib.saturate(x, 1.1)
        x = lib.fx(x, Reverb(room_size=0.72, damping=0.55, wet_level=0.22, dry_level=0.85, width=1.0))
    elif name == "pad":
        x = lib.fx(x, Chorus(rate_hz=0.25, depth=0.3, mix=0.35), Reverb(room_size=0.85, wet_level=0.3, dry_level=0.8))
    elif name == "arp":
        x = lib.fx(x, Delay(delay_seconds=BEAT * 0.75, feedback=0.25, mix=0.2),
                   Reverb(room_size=0.6, wet_level=0.18, dry_level=0.9))
    elif name == "drums":
        x = lib.fx(x, Compressor(threshold_db=-16, ratio=3, attack_ms=8, release_ms=120),
                   Reverb(room_size=0.35, damping=0.6, wet_level=0.12, dry_level=0.95))
    elif name == "bass":
        x = lib.fx(x, LowpassFilter(260))
    return x[: len(T["piano"].buf)]


GAIN = {"piano": 0.0, "keys": -4.0, "pad": 0.0, "bass": -8.0, "drums": -3.0, "arp": -5.0, "texture": 0.0}
out = ROOT / "audio" / "music"
out.mkdir(parents=True, exist_ok=True)
mix = np.zeros_like(T["piano"].buf)
DRUMLESS = True
for k, tr in T.items():
    if DRUMLESS and k == "drums":        # v4 : sans batterie
        continue
    x = proc(k, tr.buf) * db(GAIN[k])
    x = np.pad(x, ((0, max(0, len(mix) - len(x))), (0, 0)))[: len(mix)]
    lib.sf.write(str(out / f"stem_{k}.wav"), x, SR, subtype="PCM_24")
    mix += x
mix = lib.fx(mix, HighpassFilter(28), Compressor(threshold_db=-14, ratio=2.0, attack_ms=20, release_ms=250))
peak = np.max(np.abs(mix))
mix *= db(-3) / max(peak, 1e-6)
# automation par section : la courbe d'énergie du film
AUTO = [(0.0, -3), (M["q_tout"], -2), (M["v3_start"], -7), (M["v4_notes"], -5), (M["v5_tout"], -3), (M["v5_mais"], -3),
        (sh, 0), (g1, 0), (M["v11_start"], 1), (brk - 0.2, 1), (brk + 0.8, -5), (M["v13_classe"] - 0.5, -4),
        (v14 + 0.3, 0), (M["capture"], -1), (M["end"], -4)]
ts = np.array([a for a, _ in AUTO]); gs = np.array([g for _, g in AUTO])
tt = np.arange(len(mix)) / SR
mix *= db(np.interp(tt, ts, gs))[:, None].astype(np.float32)
mix[-lib.seconds(0.4):] *= np.linspace(1, 0, lib.seconds(0.4))[:, None]
lib.sf.write(str(out / "score.wav"), mix, SR, subtype="PCM_24")
print("score", round(len(mix) / SR, 2), "s")
