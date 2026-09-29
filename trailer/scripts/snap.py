"""Screenshot an HTML file (or a render(t) page at time t) for quick visual checks."""
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright
CHROME = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome"
src, out = sys.argv[1], sys.argv[2]
times = [float(x) for x in sys.argv[3:]] or [None]
with sync_playwright() as p:
    b = p.chromium.launch(executable_path=CHROME, args=["--allow-file-access-from-files"])
    pg = b.new_page(viewport={"width": 1440, "height": 1080})
    pg.goto("file://" + str(Path(src).resolve()))
    pg.evaluate("document.fonts.ready")
    pg.wait_for_timeout(300)
    for i, t in enumerate(times):
        if t is not None:
            pg.evaluate(f"window.renderFrame && window.renderFrame({t})")
        o = out if len(times) == 1 else out.replace(".png", f"_{t:06.2f}.png")
        pg.screenshot(path=o)
    b.close()
