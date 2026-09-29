"""Render stills of the trailer at given times (quick visual checks).
usage: python stills.py out_dir t1 t2 ...   (or --sheet name.png for a contact sheet)"""
import sys, math
from pathlib import Path
from playwright.sync_api import sync_playwright
from PIL import Image
ROOT = Path(__file__).resolve().parents[1]
CHROME = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome"
args = sys.argv[1:]
sheet = None
if "--sheet" in args:
    i = args.index("--sheet"); sheet = args[i + 1]; del args[i:i + 2]
out = Path(args[0]); out.mkdir(parents=True, exist_ok=True)
times = [float(x) for x in args[1:]]
paths = []
with sync_playwright() as p:
    b = p.chromium.launch(executable_path=CHROME, args=["--allow-file-access-from-files", "--disable-web-security"])
    pg = b.new_page(viewport={"width": 1440, "height": 1080})
    logs = []
    pg.on("console", lambda m: logs.append(f"{m.type}: {m.text}"))
    pg.on("pageerror", lambda e: logs.append(f"ERROR: {e}"))
    pg.goto("file://" + str(ROOT / "source" / "index.html"))
    pg.evaluate("window.ready")
    for t in times:
        pg.evaluate(f"window.renderFrame({t})")
        f = out / f"t{t:06.2f}.png"
        pg.screenshot(path=str(f)); paths.append(f)
    b.close()
for l in logs[:30]: print(l)
if sheet:
    ims = [Image.open(f) for f in paths]
    cols = 3 if len(ims) > 4 else 2; rows = math.ceil(len(ims) / cols)
    tw, th = 480, 360
    c = Image.new("RGB", (cols * tw, rows * th), "black")
    from PIL import ImageDraw
    d = ImageDraw.Draw(c)
    for k, (im, t) in enumerate(zip(ims, times)):
        x, y = (k % cols) * tw, (k // cols) * th
        c.paste(im.convert("RGB").resize((tw, th)), (x, y))
        d.rectangle([x, y, x + 64, y + 20], fill="black"); d.text((x + 4, y + 4), f"{t:.2f}s", fill="white")
    c.save(sheet)
    print("sheet", sheet)
