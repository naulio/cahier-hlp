"""Export the sound cues of the VFX/SFX cue sheet (source/scenes/fx_track.js, window.soundCues)
to logs/sfx_cues_anim.json. Visual effects and sounds come from the same list, computed from
the voice-over marks, so image and sound hit together. Run after build_timeline.py, before mix.py.
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
    pg.evaluate("window.renderFrame(1.0)")
    cues = pg.evaluate("window.soundCues()")
    b.close()
if errors:
    raise SystemExit("erreurs JS : " + "; ".join(errors))
for c in cues:
    c["t"] = round(c["t"], 3)
    c["p"] = round(c.get("p", 0), 3)
(ROOT / "logs" / "sfx_cues_anim.json").write_text(json.dumps(cues, ensure_ascii=False, indent=1))
print(len(cues), "bruitages exportés")
