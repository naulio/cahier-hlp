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
        x = lib.load(ROOT / sg["file"])
        if sg["file"].endswith("V01_1.wav"):   # v6 : attaque de « Rabelais » adoucie (-2,5 dB sur 80 ms), sans toucher à la hauteur
            env_a = np.ones(len(x), np.float32)
            n1, n2 = lib.seconds(0.15), lib.seconds(0.22)   # v8 : le pic est à 121 ms, pas dans les 60 premières
            env_a[:n1] = db(-3.5)                   # v10 : -3,5 dB (le +1 dB du nom faisait de nouveau travailler le limiteur)
            env_a[n1:n2] = np.linspace(db(-3.5), 1.0, n2 - n1)
            x = x * env_a[:, None]
        voice.add(x, sg["at"])
# très légère ambiance commune (la voix « habite » la même pièce que le film)
# v8-v9 : attaques qui faisaient le plus travailler le limiteur : gain réduit sur 120 ms centrées sur le pic RÉEL
# de la voix autour du repère (le repère Whisper peut être en retard sur la syllabe, ex. « Ta » avant « progression »)
for mk, g, lo, hi in (("v12_gratuit", -2.0, -0.2, 0.15), ("v12_progression", -2.0, -0.2, 0.15),
                      ("v11_arendt", -1.5, -0.30, -0.12)):   # v10-v11 : le pic est sur « -lais à », avant « Arendt »
    w0, w1 = lib.seconds(M[mk] + lo), lib.seconds(M[mk] + hi)
    pk = w0 + int(np.argmax(np.abs(voice.buf[w0:w1]).max(1)))
    n, r = lib.seconds(0.12), lib.seconds(0.03)
    a = pk - n // 2
    e = np.full(n, db(g), np.float32)
    e[-r:] = np.linspace(db(g), 1.0, r)
    e[:r] = np.linspace(1.0, db(g), r)
    voice.buf[a:a + n] *= e[:, None]
vbuf = lib.fx(voice.buf, Reverb(room_size=0.18, damping=0.7, wet_level=0.05, dry_level=1.0, width=0.6))[: len(voice.buf)]

# ------------------------------------------------------------------ SFX
cues = []


def S(name, t, g=0.0, p=0.0, lpf=None, fin=None):
    c = {"t": round(t, 3), "sfx": name, "gain_db": g, "pan": p}
    if fin:
        c["fade_in"] = fin
    if lpf:
        c["lpf"] = lpf                    # v5 : adoucit les aigus (sifflantes de la voix au même moment)
    cues.append(c)


sh = M["shutter"]
# hook : chaque Polaroid qui tombe (impact 0.04 s après la syllabe)
for k, x in enumerate([-0.35, -0.12, 0.12, 0.35]):
    S(f"paper_hit_{k % 3 + 1}", M[f"n{k + 1}"] + 0.035, -13 - k * 0.5, x)
S("room_tone", 0.0, -30)
S("air_long", M["q_tout"] + 0.45, -18)     # v6 : suit le recul, qui part après la question ; v7 : -4 dB (il tombait sur la voix)
# les feuilles arrivent (glissé, puis petit impact), sans en sonoriser chacune
arr = [("v3_rentree", 0, 0.5), ("v3_textes", 0, -0.4), ("v3_accum", 0, 0.3), ("v4_feuilles", 0, -0.5), ("v4_notes", -0.25, 0.1)]
for k, (m, off, p) in enumerate(arr):
    ta = M[m] + off - 0.34
    S(f"paper_slide_{k % 6 + 1}", ta + 0.05, -19, p, lpf=5000)
    if m != "v4_notes":                   # v6 : l'impact tombait 10 ms avant le premier trait de stylo (double attaque)
        S(f"paper_hit_{(k + 1) % 3 + 1}", ta + 0.5, -21, p)
# notes au stylo, surligneur sur les citations
for k in range(3):
    S(f"pen_stroke_{k + 2}", M["v4_notes"] - 0.1 + k * 0.22, -19, 0.3 - k * 0.3, lpf=6000)
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
for k, i in enumerate((0, 3, 6)):         # v10 : un tic par rangée de cartes ; v11 : trois sons différents
    S(f"card_tick_{k + 1}", sh + 0.35 + i * 0.05 + 0.78 + JIT[i][0], -23 + JIT[i][1], -0.4 + 0.1 * i)
# l'application
build = M["v7_end"] + 0.35
S("air_soft", build - 0.05, -20)
clicks = [M["v8_fiche"] - 0.28, M["v9_start"] - 0.55 - 0.08, M["v9_reviennent"] + 0.05 - 0.05,
          M["v10_start"] - 0.3 - 0.08, M["v10_corriges"] - 0.14]   # v7 : le clic se fond avec le do aigu de « corrigés »
for i, c in enumerate(clicks):
    S("ui_click", c, -20 if i == 3 else -15)   # v5 : le clic de navigation vers le QCM, plus discret
S("air_soft", M["v8_fiche"] - 0.28 + 0.12, -22)
for k in range(3):
    S("ui_tick", M["v8_epoque"] - 0.08 + k * 0.1, -22)
S("marker_3", M["v8_retenir"] - 0.05, -22)
S("air_soft", M["v9_start"] - 0.5, -22)
S("card_flip", M["v9_flash"] + 0.4, -13)          # v6-v7 : suit le retournement (avancé)
S("wood_tock", M["v9_reviennent"] + 0.05 + 0.7, -16)   # la carte se pose dans la boîte 3
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
S("polaroid_eject", M["capture"] + 0.12, -9, lpf=6000)   # v8 : il dominait la fin
S("pencil_caption", M["capture"] + 1.05, -24, fin=0.3)

sfx = Track(DUR)
for c in cues:
    x = lib.load(SFX / f"{c['sfx']}.wav")
    if c.get("lpf"):
        x = lib.filt(x, "lowpass", c["lpf"])
    if c.get("fade_in"):
        x = lib.fade(x, c["fade_in"], 0.005)
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
# v9 : creux de musique très localisés sous deux mots qu'elle couvrait (« Tu », « Arendt »)
for t0, t1, gdb in ((M["q_start"] - 0.03, M["q_start"] + 0.42, -4.0), (M["v11_arendt"] - 0.1, M["v11_arendt"] + 0.24, -3.0)):
    a, b, r = lib.seconds(t0), lib.seconds(t1), lib.seconds(0.03)
    r2 = lib.seconds(0.15)                   # v10 : retour lent (la musique ne remonte plus d'un coup)
    e = np.full(b - a, db(gdb), np.float32)
    e[:r] = np.linspace(1.0, db(gdb), r)
    e[-r2:] = np.linspace(db(gdb), 1.0, r2)
    music[a:b] *= e[:, None]

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
    lib.sf.write(str(OUT / f"{name}.wav"), (x * db(gain)).astype(np.float32), SR, subtype="FLOAT")   # v8 : plus d'écrêtage des stems
lib.sf.write(str(OUT / "trailer_mix.wav"), mix.astype(np.float32), SR, subtype="PCM_24")
(ROOT / "logs" / "sfx_cues.json").write_text(json.dumps(cues, ensure_ascii=False, indent=1))
report = {"integrated_lufs": round(float(final), 2), "true_peak_dbtp": round(float(tp), 2), "max_gain_reduction_db": round(gr, 2), "gain_applied_db": round(float(gain), 2),
          "voice_lufs": round(float(meter.integrated_loudness(vbus * db(gain))), 2),
          "music_lufs": round(float(meter.integrated_loudness(music * db(gain))), 2),
          "sfx_cues": len(cues), "duration_s": round(len(mix) / SR, 2)}
(ROOT / "logs" / "mix_report.json").write_text(json.dumps(report, indent=1))
print(report)
