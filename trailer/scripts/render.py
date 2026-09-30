"""Deterministic frame renderer: HTML scenes -> video (no audio).

Each worker opens source/index.html in headless Chromium, calls
window.renderFrame(t) for its range of frames and pipes RGB frames to an
ffmpeg process (near-lossless intermediate). Where a scene asks for motion
blur (window.subframes(t) > 1) several sub-frames spread over a 180° shutter
are averaged.

usage: python render.py [--fps 30] [--workers 3] [--start s] [--end s] [--out renders/video_only.mp4]
"""
import argparse
import io
import math
import os
import subprocess
import sys
import time
from multiprocessing import Process
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
CHROME = os.environ.get("CHROME", "/opt/pw-browsers/chromium-1194/chrome-linux/chrome")
W, H = 1440, 1080


def worker(k, frames, fps, out_path, log_path):
    from playwright.sync_api import sync_playwright
    ff = subprocess.Popen(["ffmpeg", "-loglevel", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24",
                           "-s", f"{W}x{H}", "-r", str(fps), "-i", "pipe:0", "-c:v", "libx264", "-preset", "fast",
                           "-crf", "6", "-pix_fmt", "yuv444p", str(out_path)], stdin=subprocess.PIPE)
    t0 = time.time()
    with sync_playwright() as p:
        b = p.chromium.launch(executable_path=CHROME, args=[
            "--allow-file-access-from-files", "--force-color-profile=srgb", "--hide-scrollbars",
            "--font-render-hinting=none", "--disable-lcd-text"])
        pg = b.new_page(viewport={"width": W, "height": H}, device_scale_factor=1)
        errors = []
        pg.on("pageerror", lambda e: errors.append(str(e)))
        pg.goto("file://" + str(ROOT / "source" / "index.html"))
        pg.evaluate("window.ready")
        pg.wait_for_timeout(300)

        def grab(t):
            pg.evaluate(f"window.renderFrame({t:.6f})")
            return np.asarray(Image.open(io.BytesIO(pg.screenshot(type="png"))).convert("RGB"), dtype=np.float32)

        for n, i in enumerate(frames):
            t = i / fps
            sub = int(pg.evaluate(f"window.subframes({t:.6f})"))
            shut = float(pg.evaluate(f"window.shutter ? window.shutter({t:.6f}) : 0.5"))
            if sub <= 1:
                img = grab(t)
            else:
                # obturateur (180° par défaut) : sous-images réparties sur une fraction d'image, centrées sur t
                acc = np.zeros((H, W, 3), np.float32)
                for s in range(sub):
                    acc += grab(t + ((s + 0.5) / sub - 0.5) * shut / fps)
                img = acc / sub
            ff.stdin.write(np.clip(img + 0.5, 0, 255).astype(np.uint8).tobytes())
            if n % 60 == 0:
                with open(log_path, "a") as f:
                    f.write(f"worker {k}: frame {i} ({n + 1}/{len(frames)}) {time.time() - t0:.0f}s\n")
        if errors:
            with open(log_path, "a") as f:
                f.write(f"worker {k} page errors: {errors[:5]}\n")
        b.close()
    ff.stdin.close()
    ff.wait()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--fps", type=int, default=30)
    ap.add_argument("--workers", type=int, default=3)
    ap.add_argument("--start", type=float, default=0.0)
    ap.add_argument("--end", type=float, default=None)
    ap.add_argument("--out", default=str(ROOT / "renders" / "video_only.mp4"))
    a = ap.parse_args()
    import json
    import re
    cues = (ROOT / "source" / "data" / "cues.js").read_text()
    duration = json.loads(re.search(r"window\.CUES = (.*);", cues, re.S).group(1))["duration"]
    end = a.end if a.end is not None else duration
    frames = list(range(int(round(a.start * a.fps)), int(math.floor(end * a.fps))))
    chunks = [frames[i::1] for i in range(1)]
    size = math.ceil(len(frames) / a.workers)
    chunks = [frames[i * size:(i + 1) * size] for i in range(a.workers)]
    tmp = ROOT / "renders" / "chunks"
    tmp.mkdir(parents=True, exist_ok=True)
    log = ROOT / "logs" / "render.log"
    log.write_text(f"render {len(frames)} frames @ {a.fps} fps, {a.workers} workers\n")
    procs, parts = [], []
    for k, ch in enumerate(chunks):
        if not ch:
            continue
        out = tmp / f"chunk_{k:02d}.mp4"
        parts.append(out)
        pr = Process(target=worker, args=(k, ch, a.fps, out, log))
        pr.start()
        procs.append(pr)
    for pr in procs:
        pr.join()
    lst = tmp / "list.txt"
    lst.write_text("".join(f"file '{p}'\n" for p in parts))
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-f", "concat", "-safe", "0", "-i", str(lst),
                    "-c", "copy", a.out], check=True)
    print("wrote", a.out, len(frames), "frames")


if __name__ == "__main__":
    main()
