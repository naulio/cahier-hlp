"""Final export: rendered picture + mastered mix -> MP4 H.264 (4:3, 1440x1080).

A very light temporal grain is added at encode time: it dithers the soft
gradients (no banding) and keeps flat UI areas from looking dead. It is kept
below the threshold where it reads as an effect.

usage: python export.py renders/video_only.mp4 exports/trailer.mp4 [--grain 2]
"""
import argparse
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ap = argparse.ArgumentParser()
ap.add_argument("video")
ap.add_argument("out")
ap.add_argument("--audio", default=str(ROOT / "audio" / "mix" / "trailer_mix.wav"))
ap.add_argument("--grain", type=float, default=2.0)
ap.add_argument("--crf", type=int, default=16)
a = ap.parse_args()
vf = f"noise=alls={a.grain}:allf=t,format=yuv420p" if a.grain > 0 else "format=yuv420p"
cmd = ["ffmpeg", "-loglevel", "error", "-y", "-i", a.video, "-i", a.audio, "-map", "0:v", "-map", "1:a",
       "-vf", vf, "-c:v", "libx264", "-preset", "slow", "-crf", str(a.crf), "-profile:v", "high", "-level", "4.1",
       "-tune", "film", "-g", "60", "-c:a", "aac", "-b:a", "256k", "-ar", "48000", "-movflags", "+faststart",
       "-metadata", "title=Cahier d'HLP — trailer", "-metadata", "comment=TG1 · Lycée Notre-Dame",
       "-shortest", a.out]
subprocess.run(cmd, check=True)
print("wrote", a.out)
