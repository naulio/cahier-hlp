"""Final mix: voice + ducked music + SFX -> mastered stereo track.

Priorities: 1) the voice, always intelligible; 2) music present but under it
(sidechain ducking driven by the voice); 3) sound design felt, never in front.
Master: EBU R128 loudness -14 LUFS integrated, limiter ceiling -1 dBTP.

SFX cues are declared by the scenes themselves (sounds() in source/scenes/*.js,
same timing formulas as the animation) and exported by scripts/export_cues.py.
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
# Les repères viennent des scènes elles-mêmes (window.soundCues → scripts/export_cues.py) :
# un bruitage = un geste à l'image, avec la même formule de temps que l'animation.
cues = json.loads((ROOT / "logs" / "sfx_cues_anim.json").read_text())
sh = M["shutter"]
sfx = Track(DUR)
for c in cues:
    x = lib.load(SFX / f"{c['sfx']}.wav")
    if c.get("len"):                        # coupe (éjection du Polaroid, trait long) avec fondu
        x = x[: lib.seconds(c["len"])]
        x = lib.fade(x, 0.003, c.get("fade", 0.2))
    t0 = c["at_end"] - len(x) / SR if c.get("at_end") else c["t"]   # sons inversés : la fin tombe sur le temps fort
    sfx.add(x, t0, c["g"], c["p"])
# lit d'ambiance (pièce calme) jusqu'au déclic, en fondu : le bureau « existe », puis on entre dans l'écran
rt = lib.load(SFX / "room_tone.wav")
rt = lib.fade(np.concatenate([rt] * 3)[: lib.seconds(sh + 0.1)], 1.5, 0.12)
sfx.add(rt, 0.0, -30)
cues.append({"t": 0.0, "sfx": "room_tone", "g": -30, "p": 0, "scene": "desk", "len": round(sh + 0.1, 2)})
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
MUSIC_GAIN = -0.5
music *= (db(MUSIC_GAIN) * db(-DUCK * g))[:, None]
# bruitages sous la voix : aigus adoucis (pas de conflit avec les sifflantes) et 2 dB plus bas
sl = lib.filt(sbuf, "lowpass", 5500, order=2)
sbuf = (sbuf * (1 - g)[:, None] + sl * g[:, None]) * db(-2.0 * g)[:, None]

# ------------------------------------------------------------------ bus et master
VOICE_GAIN, SFX_GAIN = 0.0, -2.0
vbus = vbuf * db(VOICE_GAIN)
sbus = sbuf * db(SFX_GAIN)
mix = vbus + music + sbus
mix = lib.fx(mix, Compressor(threshold_db=-12, ratio=1.5, attack_ms=30, release_ms=220))
meter = pyln.Meter(SR)
# gain de sortie ajusté pour atteindre -14 LUFS après limitation (-1.2 dBFS, crête vraie vérifiée)
gain = -14.0 - meter.integrated_loudness(mix)
for _ in range(4):
    out, gr = lib.limiter(mix * db(gain), ceiling_db=-1.3)
    final = meter.integrated_loudness(out)
    if abs(final + 14.0) < 0.1:
        break
    gain += -14.0 - final
mix = out
tp = lib.true_peak_db(mix)
for name, x in (("stem_voice", vbus), ("stem_music", music), ("stem_sfx", sbus)):
    lib.sf.write(str(OUT / f"{name}.wav"), (x * db(gain)).astype(np.float32), SR, subtype="PCM_24")
lib.sf.write(str(OUT / "trailer_mix.wav"), mix.astype(np.float32), SR, subtype="PCM_24")
(ROOT / "logs" / "sfx_cues.json").write_text(json.dumps(sorted(cues, key=lambda c: c["t"]), ensure_ascii=False, indent=1))
report = {"integrated_lufs": round(float(final), 2), "true_peak_dbtp": round(float(tp), 2), "max_gain_reduction_db": round(gr, 2), "gain_applied_db": round(float(gain), 2),
          "voice_lufs": round(float(meter.integrated_loudness(vbus * db(gain))), 2),
          "music_lufs": round(float(meter.integrated_loudness(music * db(gain))), 2),
          "sfx_cues": len(cues), "duration_s": round(len(mix) / SR, 2)}
(ROOT / "logs" / "mix_report.json").write_text(json.dumps(report, indent=1))
print(report)
