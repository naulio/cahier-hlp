"""Final mix: voice + ducked music + SFX -> mastered stereo track.

Priorities: 1) the voice, always intelligible; 2) music present but under it
(sidechain ducking driven by the voice); 3) sound design felt, never in front.
Master: EBU R128 loudness -14 LUFS integrated, limiter ceiling -1 dBTP.

SFX cues are computed from the same timeline marks as the animation (the
formulas mirror source/scenes/*.js; keep them together when editing).
v4 : bruitages et mixage de la v1 (retenus par le commanditaire), seul le limiteur a été rendu attentif à la
crête vraie. La couche VFX (fx_track.js) ne porte plus de bruitages.
Outputs audio/mix/{trailer_mix,stem_voice,stem_music,stem_sfx}.wav, logs/sfx_cues.json
"""
import json

import numpy as np
import pyloudnorm as pyln
from pedalboard import Compressor, Reverb

import lib
from lib import SR, Track, db

ROOT = lib.ROOT
TL = json.loads((ROOT / "logs" / "timeline.json").read_text())
M = TL["marks"]
DUR = TL["duration"] + 0.3
SFX = ROOT / "audio" / "sfx"
OUT = ROOT / "audio" / "mix"
OUT.mkdir(parents=True, exist_ok=True)

# ------------------------------------------------------------------ voix
voice = Track(DUR)
for line in TL["lines"]:
    for sg in line["segments"]:
        voice.add(lib.load(ROOT / sg["file"]), sg["at"])
# très légère ambiance commune (la voix « habite » la même pièce que le film)
vbuf = lib.fx(voice.buf, Reverb(room_size=0.18, damping=0.7, wet_level=0.05, dry_level=1.0, width=0.6))[: len(voice.buf)]

# ------------------------------------------------------------------ SFX
cues = []


def S(name, t, g=0.0, p=0.0, lpf=None):
    c = {"t": round(t, 3), "sfx": name, "gain_db": g, "pan": p}
    if lpf:
        c["lpf"] = lpf                    # v5 : adoucit les aigus (sifflantes de la voix au même moment)
    cues.append(c)


sh = M["shutter"]
# hook : chaque Polaroid qui tombe (impact 0.04 s après la syllabe)
for k, x in enumerate([-0.35, -0.12, 0.12, 0.35]):
    S(f"paper_hit_{k % 3 + 1}", M[f"n{k + 1}"] + 0.035, -13 - k * 0.5, x)
S("room_tone", 0.0, -30)
S("air_long", M["q_tout"] - 0.15, -14)
# les feuilles arrivent (glissé, puis petit impact), sans en sonoriser chacune
arr = [("v3_rentree", 0, 0.5), ("v3_textes", 0, -0.4), ("v3_accum", 0, 0.3), ("v4_feuilles", 0, -0.5), ("v4_notes", -0.25, 0.1)]
for k, (m, off, p) in enumerate(arr):
    ta = M[m] + off - 0.34
    S(f"paper_slide_{k % 6 + 1}", ta + 0.05, -19, p, lpf=5000)
    S(f"paper_hit_{(k + 1) % 3 + 1}", ta + 0.5, -21, p)
# notes au stylo, surligneur sur les citations
for k in range(3):
    S(f"pen_stroke_{k + 2}", M["v4_notes"] - 0.1 + k * 0.22, -15, 0.3 - k * 0.3)
for k in range(2):
    S(f"marker_{k + 1}", M["v4_citations"] - 0.05 + k * 0.18, -20, -0.2 + k * 0.4, lpf=5000)
# « Mais où ? » : le viseur cherche (moteur AF), puis verrouille (bip)
for k in range(3):
    S(f"af_motor_{k + 1}", M["v5_mais"] + 0.05 + k * 0.62, -17, [-0.4, 0.4, -0.1][k])
S("af_beep", sh - 0.35, -21)
# le déclic
S("shutter_k1000", sh - 0.03, -4)
S("film_advance", sh + 0.42, -14, 0.2)
S("paper_sweep", sh + 0.3, -13)
JIT = [(0.004, 0.8), (-0.011, -1.5), (0.013, 0.4), (-0.006, 1.7), (0.009, -0.9), (-0.014, 1.1), (0.002, -1.8), (0.012, 0.6), (-0.008, -0.3)]
for i in range(9):                        # v5 : léger décalage ±15 ms / ±2 dB (fixe), moins mécanique
    S(f"card_tick_{i % 3 + 1}", sh + 0.35 + i * 0.075 + 0.78 + JIT[i][0], -23 + JIT[i][1], -0.4 + 0.1 * i)
# l'application
build = M["v7_end"] + 0.35
S("air_soft", build - 0.05, -20)
clicks = [M["v8_fiche"] - 0.28, M["v9_start"] - 0.55 - 0.08, M["v9_reviennent"] + 0.05 - 0.05,
          M["v10_start"] - 0.5 - 0.08, M["v10_corriges"] - 0.18]
for i, c in enumerate(clicks):
    S("ui_click", c, -20 if i == 3 else -15)   # v5 : le clic de navigation vers le QCM, plus discret
S("air_soft", M["v8_fiche"] - 0.28 + 0.12, -22)
for k in range(3):
    S("ui_tick", M["v8_epoque"] - 0.08 + k * 0.1, -22)
S("marker_3", M["v8_retenir"] - 0.05, -22)
S("air_soft", M["v9_start"] - 0.5, -22)
S("card_flip", M["v9_flash"] + 0.62, -13)
S("wood_tock", M["v9_reviennent"] + 0.05 + 0.12 + 0.62, -16)
S("ui_tick", M["v9_moment"] - 0.2, -20)
S("air_soft", M["v10_expliques"] - 0.05, -24)
# frise
S("marker_3", M["v11_frise"] - 0.25, -21)
S("air_soft", M["v11_rabelais"] + 0.05, -22)
# classe
S("air_soft", M["v13_start"] - 0.15, -21)
# fin : les rangées se rejoignent, le logo, puis le Polaroid final
S("air_soft", M["v14_start"] - 0.8, -21)
S("shutter_k1000", M["capture"] - 0.03, -6)
S("polaroid_eject", M["capture"] + 0.12, -7)
S("pencil_caption", M["capture"] + 1.05, -18)

sfx = Track(DUR)
for c in cues:
    x = lib.load(SFX / f"{c['sfx']}.wav")
    if c.get("lpf"):
        x = lib.filt(x, "lowpass", c["lpf"])
    if c["sfx"] == "room_tone":           # lit d'ambiance jusqu'au déclic, en fondu
        n = lib.seconds(sh + 0.1)
        x = np.concatenate([x] * 3)[:n]
        x = lib.fade(x, 1.5, 0.12)
    sfx.add(x, c["t"], c["gain_db"], c["pan"])
sbuf = lib.fx(sfx.buf, Reverb(room_size=0.25, damping=0.6, wet_level=0.08, dry_level=1.0))[: len(sfx.buf)]

# ------------------------------------------------------------------ musique + ducking
music = np.zeros_like(voice.buf)
mus = lib.load(ROOT / "audio" / "music" / "score.wav")[: len(music)]
music[: len(mus)] = mus
env = np.abs(voice.buf).mean(1)
fr = lib.seconds(0.02)
env = np.sqrt(np.convolve(env ** 2, np.ones(fr) / fr, "same"))
act = (20 * np.log10(env + 1e-9) > -42).astype(np.float32)
# lissage attaque 60 ms / relâchement 450 ms
g = np.zeros_like(act)
a_up, a_dn = np.exp(-1 / (0.06 * SR)), np.exp(-1 / (0.45 * SR))
v = 0.0
for i in range(len(act)):
    v = a_up * v + (1 - a_up) * act[i] if act[i] > v else a_dn * v + (1 - a_dn) * act[i]
    g[i] = v
DUCK = 5.0
MUSIC_GAIN = -3.0
music *= (db(MUSIC_GAIN) * db(-DUCK * g))[:, None]

# ------------------------------------------------------------------ bus et master
VOICE_GAIN, SFX_GAIN = 0.0, -2.0
vbus = vbuf * db(VOICE_GAIN)
sbus = sbuf * db(SFX_GAIN)
mix = vbus + music + sbus
mix = lib.fx(mix, Compressor(threshold_db=-12, ratio=1.5, attack_ms=30, release_ms=220))
meter = pyln.Meter(SR)
# gain de sortie ajusté pour atteindre -14 LUFS après limitation (-1.2 dBFS, crête vraie vérifiée)
gain = -14.0 - meter.integrated_loudness(mix)
ceiling = -1.3
for _ in range(10):                     # loudness visée ET crête vraie ≤ -1 dBTP
    out, gr = lib.limiter(mix * db(gain), ceiling_db=ceiling)
    final = meter.integrated_loudness(out)
    tp = lib.true_peak_db(out)
    if tp > -1.05:
        ceiling -= max(0.2, tp + 1.05)
        continue
    if abs(final + 14.0) < 0.1:
        break
    gain += -14.0 - final
mix = out
tp = lib.true_peak_db(mix)
for name, x in (("stem_voice", vbus), ("stem_music", music), ("stem_sfx", sbus)):
    lib.sf.write(str(OUT / f"{name}.wav"), (x * db(gain)).astype(np.float32), SR, subtype="PCM_24")
lib.sf.write(str(OUT / "trailer_mix.wav"), mix.astype(np.float32), SR, subtype="PCM_24")
(ROOT / "logs" / "sfx_cues.json").write_text(json.dumps(cues, ensure_ascii=False, indent=1))
report = {"integrated_lufs": round(float(final), 2), "true_peak_dbtp": round(float(tp), 2), "max_gain_reduction_db": round(gr, 2), "gain_applied_db": round(float(gain), 2),
          "voice_lufs": round(float(meter.integrated_loudness(vbus * db(gain))), 2),
          "music_lufs": round(float(meter.integrated_loudness(music * db(gain))), 2),
          "sfx_cues": len(cues), "duration_s": round(len(mix) / SR, 2)}
(ROOT / "logs" / "mix_report.json").write_text(json.dumps(report, indent=1))
print(report)
