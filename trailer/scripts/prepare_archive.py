"""Square head-and-shoulders crops of the public-domain portraits (Polaroids)."""
from pathlib import Path
from PIL import Image
A = Path(__file__).resolve().parents[1] / "assets" / "archive"
# file: (center x, center y, side) as fractions of the image width/height/width
CROPS = {
    "rabelais.jpg": (0.46, 0.38, 0.76),
    "rousseau_latour.jpg": (0.50, 0.33, 0.80),
    "flaubert.jpg": (0.57, 0.36, 0.64),
    "hugo_carjat_1876.jpg": (0.485, 0.225, 0.50),
}
for f, (cx, cy, side) in CROPS.items():
    im = Image.open(A / f).convert("RGB")
    W, H = im.size
    s = side * W
    box = (int(cx * W - s / 2), int(cy * H - s / 2), int(cx * W + s / 2), int(cy * H + s / 2))
    im.crop(box).resize((600, 600), Image.LANCZOS).save(A / f.replace(".jpg", "_sq.jpg"), quality=92)
    print(f, box)
