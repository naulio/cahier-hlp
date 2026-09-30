"""Livrables : vidéo finale, version de travail sous-titrée, sous-titres, pistes audio.

usage: python scripts/deliver.py renders/video_only.mp4

exports/
  cahier-hlp_trailer_4-3_1440x1080.mp4        vidéo finale (H.264, AAC 256k, -14 LUFS)
  cahier-hlp_trailer_travail_960x720.mp4      version de travail : plus légère, avec une piste de sous-titres
                                              (répliques + nom de chaque plan, horodatés)
  cahier-hlp_trailer_sous-titres.srt          sous-titres de la voix off (accessibilité, diffusion sans le son)
  audio/mix.flac, voix.flac, musique.flac, bruitages.flac   pistes du mixage final (48 kHz, 16 bits)
"""
import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
EXP = ROOT / "exports"
(EXP / "audio").mkdir(parents=True, exist_ok=True)
video = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / "renders" / "video_only.mp4"
TL = json.loads((ROOT / "logs" / "timeline.json").read_text())
M = TL["marks"]
LINES = {l["id"]: l for l in json.loads((ROOT / "scripts" / "voice" / "lines.json").read_text())["lines"]}
sys.path.insert(0, str(ROOT / "scripts"))
from write_script_doc import SHOTS, at   # noqa: E402  (découpage plan par plan, mêmes repères)


def run(*cmd):
    subprocess.run([str(c) for c in cmd], check=True)


def ts(t):
    t = max(0.0, t)
    h, r = divmod(t, 3600)
    m, s = divmod(r, 60)
    return f"{int(h):02d}:{int(m):02d}:{int(s):02d},{int(round((s % 1) * 1000)) % 1000:03d}"


def srt(entries):
    out = []
    for k, (a, b, txt) in enumerate(entries, 1):
        out += [str(k), f"{ts(a)} --> {ts(b)}", txt, ""]
    return "\n".join(out)


# 1) vidéo finale
final = EXP / "cahier-hlp_trailer_4-3_1440x1080.mp4"
run(sys.executable, ROOT / "scripts" / "export.py", video, final, "--crf", "18")

# 2) sous-titres de la voix off (texte exact du script, découpé aux phrases)
voice = []
for l in TL["lines"]:
    voice.append((l["at"], l["end"] + 0.35, LINES[l["id"]]["text"].replace("'", "’")))   # apostrophe typographique
voice = [(a, min(b, voice[i + 1][0] - 0.02) if i + 1 < len(voice) else b, t) for i, (a, b, t) in enumerate(voice)]
(EXP / "cahier-hlp_trailer_sous-titres.srt").write_text(srt(voice), encoding="utf-8")

# 3) version de travail : répliques + plan en cours, horodatés
starts = [(at(m), name) for m, _sec, name, *_ in SHOTS]
work = []
for i, (t0, name) in enumerate(starts):
    t1 = starts[i + 1][0] if i + 1 < len(starts) else TL["duration"]
    work.append((t0, t1, f"[{name} · {t0:.1f} s]"))
for a, b, txt in voice:
    work.append((a, b, txt))
work.sort(key=lambda e: e[0])
wsrt = ROOT / "renders" / "travail.srt"
wsrt.write_text(srt(work), encoding="utf-8")
run("ffmpeg", "-loglevel", "error", "-y", "-i", final, "-i", wsrt, "-map", "0:v", "-map", "0:a", "-map", "1:s",
    "-vf", "scale=960:720", "-c:v", "libx264", "-preset", "slow", "-crf", "24", "-c:a", "aac", "-b:a", "160k",
    "-c:s", "mov_text", "-metadata:s:s:0", "language=fre", "-movflags", "+faststart",
    EXP / "cahier-hlp_trailer_travail_960x720.mp4")

# 4) pistes audio
for src, dst in [("trailer_mix", "mix"), ("stem_voice", "voix"), ("stem_music", "musique"), ("stem_sfx", "bruitages")]:
    run("ffmpeg", "-loglevel", "error", "-y", "-i", ROOT / "audio" / "mix" / f"{src}.wav", "-c:a", "flac",
        "-sample_fmt", "s16", EXP / "audio" / f"{dst}.flac")

for p in sorted(EXP.rglob("*")):
    if p.is_file():
        print(f"{p.relative_to(ROOT)}  {p.stat().st_size / 1e6:.1f} Mo")
