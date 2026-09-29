"""Export the sound cues declared by the scenes (window.soundCues) to logs/sfx_cues_anim.json.

The animation and the sound design share the same timing formulas: each scene's
sounds() uses the exact expressions of its update(t). Run after build_timeline.py
(cues.js) and before mix.py.
"""
import json
import os
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
CHROME = os.environ.get("CHROME", "/opt/pw-browsers/chromium-1194/chrome-linux/chrome")

with sync_playwright() as p:
    b = p.chromium.launch(executable_path=CHROME, args=["--allow-file-access-from-files"])
    pg = b.new_page(viewport={"width": 1440, "height": 1080})
    errors = []
    pg.on("pageerror", lambda e: errors.append(str(e)))
    pg.goto("file://" + str(ROOT / "source" / "index.html"))
    pg.evaluate("window.ready")
    # une image de la scène « application » pour mesurer les cibles du doigt (panoramique des clics)
    pg.evaluate("window.renderFrame(window.SCENES.find(s => s.name === 'app').T().tapCard)")
    cues = pg.evaluate("window.soundCues()")
    b.close()
if errors:
    raise SystemExit("erreurs JS : " + "; ".join(errors))
for c in cues:
    c["t"] = round(c["t"], 3)
    c["p"] = round(c.get("p", 0), 3)
(ROOT / "logs" / "sfx_cues_anim.json").write_text(json.dumps(cues, ensure_ascii=False, indent=1))
print(len(cues), "bruitages exportés")
