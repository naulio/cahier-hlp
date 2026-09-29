"""Procedural textures (no stock images): paper and desk surfaces.

Low-contrast on purpose: the texture must be felt, not seen.
Outputs PNGs in assets/textures/.
"""
from pathlib import Path

import numpy as np
from PIL import Image
from scipy.ndimage import gaussian_filter

OUT = Path(__file__).resolve().parents[1] / "assets" / "textures"
OUT.mkdir(parents=True, exist_ok=True)
rng = np.random.default_rng(7)


def fbm(h, w, octaves=5, base=64.0):
    acc = np.zeros((h, w), np.float32)
    amp, tot = 1.0, 0.0
    for o in range(octaves):
        n = rng.standard_normal((h, w)).astype(np.float32)
        acc += amp * gaussian_filter(n, base / (2 ** o), mode="wrap")
        tot += amp
        amp *= 0.55
    acc /= tot
    return (acc - acc.mean()) / (acc.std() + 1e-6)


def fibres(h, w, count=2600, length=(6, 26)):
    img = Image.new("L", (w, h), 0)
    px = img.load()
    for _ in range(count):
        x, y = rng.uniform(0, w), rng.uniform(0, h)
        ang = rng.uniform(0, np.pi)
        ln = rng.uniform(*length)
        val = int(rng.uniform(40, 120))
        for s in np.linspace(0, ln, int(ln * 2)):
            xx = int(x + np.cos(ang) * s + np.sin(s * 0.4) * 0.6) % w
            yy = int(y + np.sin(ang) * s) % h
            px[xx, yy] = max(px[xx, yy], val)
    a = np.asarray(img, np.float32) / 255.0
    return gaussian_filter(a, 0.6)


def paper(name, rgb, size=(2048, 2048), mottling=0.006, fibre=0.035, grain=0.010):
    h, w = size
    base = np.ones((h, w, 3), np.float32) * (np.array(rgb, np.float32) / 255.0)
    m = fbm(h, w, 3, 420.0)[..., None]
    f = fibres(h, w)[..., None]
    g = gaussian_filter(rng.standard_normal((h, w)).astype(np.float32), 0.7)[..., None] * 2.2
    img = base * (1 + mottling * m) - fibre * f * 0.6 + grain * g * 0.5
    img = np.clip(img, 0, 1)
    Image.fromarray((img * 255).astype(np.uint8)).save(OUT / f"{name}.png", optimize=True)
    print("wrote", name)


def desk(name, rgb, size=(2400, 1800)):
    h, w = size
    base = np.ones((h, w, 3), np.float32) * (np.array(rgb, np.float32) / 255.0)
    m = fbm(h, w, 4, 260.0)[..., None]
    # faint linoleum / felt grain, directional
    n = rng.standard_normal((h, w)).astype(np.float32)
    d = gaussian_filter(n, (0.8, 6.0))[..., None]
    img = base * (1 + 0.05 * m + 0.05 * d)
    img = np.clip(img, 0, 1)
    Image.fromarray((img * 255).astype(np.uint8)).save(OUT / f"{name}.png", optimize=True)
    print("wrote", name)


if __name__ == "__main__":
    paper("paper_offwhite", (242, 237, 227))
    paper("paper_sheet", (246, 243, 236), size=(1400, 1400), mottling=0.004, fibre=0.03)
    desk("desk_dark", (32, 33, 29))
