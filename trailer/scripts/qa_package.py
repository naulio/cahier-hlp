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
phone = [M["n3"] + 0.5, M["q_tout"] + 0.2, M["v4_citations"] + 0.6, M["v5_mais"] + 0.4, M["shutter"] + 1.8, M["v7_end"],
         M["v8_essentiel"] + 1.0, M["v8_retenir"] + 0.8, M["v9_moment"] + 0.4, M["v10_expliques"] + 0.6, M["v11_arendt"] + 0.3,
         M["v12_compte"] + 0.5, M["v12_appareil"] + 0.4, M["v13_classe"] + 0.6, M["v14_start"] + 0.6, M["v14_endroit"] + 0.5,
         M["capture"] - 0.2, M["capture"] + 2.6, M["end"] - 0.8]
phone = [round(t, 2) for t in phone]
sheet(phone, Q / "phone_size_360px.jpg", cols=5, tw=360)
# 3) bandes à 10 i/s sur les moments clés
KEY = {
    "01_hook_polaroid_flash": M["n1"] - 0.4, "02_pullback_on_tout": M["q_tout"] - 0.2,
    "03_accumulation": M["v4_feuilles"] - 0.5, "04_viewfinder_and_shutter": M["shutter"] - 0.7,
    "05_morph_to_cards": M["shutter"] + 0.3, "06_logo_reveal": M["v7_cahier"] - 0.3,
    "07_logo_to_app_whip": M["v7_end"] + 0.25, "08_card_to_fiche": M["v8_fiche"] - 0.45,
    "09_to_flashcards_whip": M["v9_start"] - 0.65, "10_flashcard_flip_box": M["v9_flash"] + 0.5,
    "11_qcm_answer": M["v10_corriges"] - 0.4, "12_app_to_frise": M["v11_start"] - 0.4,
    "13_frise_arc": M["v11_rabelais"] - 0.3, "14_gratuit_slam": M["v12_gratuit"] - 0.4,
    "15_class_wave": M["v13_classe"] - 0.5, "16_class_to_logo": M["v14_start"] - 0.9,
    "17_end_logo_hit": M["v14_start"] + 0.2, "18_polaroid_capture": M["capture"] - 0.1,
}
for name, t0 in KEY.items():
    sheet([round(t0 + k * 0.1, 3) for k in range(12)], Q / f"strip_{name}.jpg", cols=6, tw=320)
# 4) audio
subprocess.run([sys.executable, str(ROOT / "scripts/audio/plot_audio.py"), str(Q / "audio_mix_stems.png"),
                str(ROOT / "audio/mix/trailer_mix.wav"), str(ROOT / "audio/mix/stem_voice.wav"),
                str(ROOT / "audio/mix/stem_music.wav"), str(ROOT / "audio/mix/stem_sfx.wav")], check=True)
subprocess.run([sys.executable, str(ROOT / "scripts/audio/plot_audio.py"), str(Q / "audio_music_stems.png"),
                *[str(p) for p in [ROOT / "audio/music/score.wav"] + sorted((ROOT / "audio/music").glob("stem_*.wav"))]], check=True)
takes = json.loads((ROOT / "logs" / "voice_takes.json").read_text())
current = [l["id"] for l in json.loads((ROOT / "scripts/voice/lines.json").read_text())["lines"]]
vm = []
for lid in current:                      # seulement les répliques du script actuel
    d = takes[lid]
    best = next(t for t in d["takes"] if t["file"] == d["best"]) if any(t["file"] == d["best"] for t in d["takes"]) else d["takes"][0]
    vm.append({k: best.get(k) for k in ("wer", "mean_word_prob", "f0_median_hz", "f0_std_st", "f0_range_p5_p95_st",
                                         "words_per_min_speech", "duration_s", "transcript")} | {"id": lid, "text": d["text"]})
(Q / "voice_metrics.json").write_text(json.dumps(vm, ensure_ascii=False, indent=1))
for f in ("mix_report.json", "sfx_cues.json", "timeline.json", "voice_takes.json"):
    shutil.copy(ROOT / "logs" / f, Q / f)
shutil.copy(ROOT / "audio/sfx/library.json", Q / "sfx_library.json")
shutil.copy(ROOT / "scripts/voice/lines.json", Q / "voiceover_script.json")
# 5) textes à l'écran
shutil.copy(ROOT / "source/data/content.js", Q / "onscreen_content.js")
print("package", Q, len(list(Q.iterdir())), "files")
