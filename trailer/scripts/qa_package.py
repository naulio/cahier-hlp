"""Build the review package given to the independent QA agents for one version.

usage: python qa_package.py v1 renders/trailer_v1.mp4
Creates logs/qa/<version>/ with contact sheets (1 fps), phone-size sheets,
10 fps filmstrips of key moments, audio plots, metrics and texts.
Reviewers cannot hear audio: they get objective measurements + spectrograms.
"""
import json
import shutil
import subprocess
import sys
from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
ver, video = sys.argv[1], Path(sys.argv[2])
Q = ROOT / "logs" / "qa" / ver
if Q.exists():
    shutil.rmtree(Q)
(Q / "frames").mkdir(parents=True)
TL = json.loads((ROOT / "logs" / "timeline.json").read_text())
M = TL["marks"]
dur = TL["duration"]


def frame(t, path, w=None):
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-ss", f"{t:.3f}", "-i", str(video), "-frames:v", "1",
                    *(["-vf", f"scale={w}:-1"] if w else []), "-q:v", "3", str(path)], check=True)


def sheet(times, out, cols=4, tw=480, label=True):
    ims = []
    for t in times:
        p = Q / "frames" / f"f_{t:07.3f}.jpg"
        if not p.exists():
            frame(t, p)
        ims.append(Image.open(p).convert("RGB").resize((tw, tw * 3 // 4)))
    rows = (len(ims) + cols - 1) // cols
    th = tw * 3 // 4
    c = Image.new("RGB", (cols * tw, rows * th), "black")
    d = ImageDraw.Draw(c)
    for k, (im, t) in enumerate(zip(ims, times)):
        x, y = (k % cols) * tw, (k // cols) * th
        c.paste(im, (x, y))
        if label:
            d.rectangle([x, y, x + 70, y + 18], fill="black")
            d.text((x + 4, y + 3), f"{t:.2f}s", fill="white")
    c.save(out, quality=88)


# 1) planches 1 image/s
secs = [round(s + 0.5, 2) for s in range(int(dur))]
for i in range(0, len(secs), 12):
    sheet(secs[i:i + 12], Q / f"contact_{i // 12 + 1:02d}_{secs[i]:.0f}s-{secs[min(i + 11, len(secs) - 1)]:.0f}s.jpg")
# 2) taille téléphone (vidéo vue ~ 360 px de large)
phone = [3.6, 6.0, 12.5, 19.0, 21.0, 25.9, 27.9, 30.0, 32.4, 34.0, 36.4, 38.0, 41.7, 44.3, 46.3, 51.4, 54.0, 57.0, 59.5]
sheet(phone, Q / "phone_size_360px.jpg", cols=5, tw=360)
# 3) bandes à 10 i/s sur les moments clés
KEY = {
    "01_hook_polaroid_drop": M["n1"] - 0.35, "02_pullback_on_tout": M["q_tout"] - 0.1,
    "03_viewfinder_and_shutter": M["shutter"] - 0.7, "04_morph_to_cards": M["shutter"] + 0.3,
    "05_logo_to_app": M["v7_end"] + 0.2, "06_card_to_fiche": M["v8_fiche"] - 0.35,
    "07_flashcard_flip_box": M["v9_flash"] + 0.4, "08_qcm_answer": M["v10_corriges"] - 0.4,
    "09_frise_arc": M["v11_rabelais"] - 0.3, "10_phone_to_class": M["v13_start"] - 0.25,
    "11_class_to_logo": M["v14_start"] - 1.0, "12_polaroid_capture": M["capture"] - 0.1,
}
for name, t0 in KEY.items():
    sheet([round(t0 + k * 0.1, 3) for k in range(12)], Q / f"strip_{name}.jpg", cols=6, tw=320)
# 4) audio
subprocess.run([sys.executable, str(ROOT / "scripts/audio/plot_audio.py"), str(Q / "audio_mix_stems.png"),
                str(ROOT / "audio/mix/trailer_mix.wav"), str(ROOT / "audio/mix/stem_voice.wav"),
                str(ROOT / "audio/mix/stem_music.wav"), str(ROOT / "audio/mix/stem_sfx.wav")], check=True)
subprocess.run([sys.executable, str(ROOT / "scripts/audio/plot_audio.py"), str(Q / "audio_music_stems.png"),
                *[str(ROOT / f"audio/music/{f}") for f in ("score.wav", "stem_piano.wav", "stem_keys.wav", "stem_pad.wav",
                                                          "stem_bass.wav", "stem_drums.wav", "stem_arp.wav")]], check=True)
takes = json.loads((ROOT / "logs" / "voice_takes.json").read_text())
vm = []
for lid, d in takes.items():
    best = next(t for t in d["takes"] if t["file"] == d["best"]) if any(t["file"] == d["best"] for t in d["takes"]) else d["takes"][0]
    vm.append({k: best.get(k) for k in ("wer", "mean_word_prob", "f0_median_hz", "f0_std_st", "f0_range_p5_p95_st",
                                         "words_per_min_speech", "duration_s", "transcript")} | {"id": lid, "text": d["text"]})
(Q / "voice_metrics.json").write_text(json.dumps(vm, ensure_ascii=False, indent=1))
for f in ("mix_report.json", "sfx_cues.json", "timeline.json"):
    shutil.copy(ROOT / "logs" / f, Q / f)
shutil.copy(ROOT / "audio/sfx/library.json", Q / "sfx_library.json")
shutil.copy(ROOT / "scripts/voice/lines.json", Q / "voiceover_script.json")
# 5) textes à l'écran
shutil.copy(ROOT / "source/data/content.js", Q / "onscreen_content.js")
print("package", Q, len(list(Q.iterdir())), "files")
