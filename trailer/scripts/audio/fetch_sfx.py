"""Fetch candidate CC0 field recordings from Freesound (HQ previews, 128 kb/s).

Only sounds whose license is Creative Commons 0 are considered (search filter
+ license re-checked on each sound page). Every download is logged with its
id, author, title, page URL and license in audio/sfx/sources/sources.json.

usage: python fetch_sfx.py            # all queries
"""
import html
import json
import re
import subprocess
import time
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "audio" / "sfx" / "sources"
OUT.mkdir(parents=True, exist_ok=True)
UA = {"User-Agent": "Mozilla/5.0 (CahierHLP trailer; school project)"}

QUERIES = {
    "paper_slide": ("paper slide", 6, 5.0),
    "paper_sheet": ("paper sheet", 4, 5.0),
    "paper_down": ("paper put down", 3, 5.0),
    "paper_handling": ("paper handling", 5, 5.0),
    "paper_shuffle": ("paper shuffle", 4, 5.0),
    "shutter": ("film camera shutter", 6, 3.0),
    "polaroid": ("polaroid camera", 6, 6.0),
    "autofocus": ("autofocus", 4, 5.0),
    "pen_write": ("pen writing paper", 5, 6.0),
    "highlighter": ("marker pen paper", 4, 5.0),
    "card_flip": ("card flip", 4, 2.0),
    "room_tone": ("room tone quiet", 3, 30.0),
}


def get(url):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read().decode("utf-8", "replace")


def search(q, maxdur):
    url = "https://freesound.org/search/?" + urllib.parse.urlencode(
        {"q": q, "f": f'license:"Creative Commons 0" duration:[0 TO {maxdur}]', "s": "Relevance"})
    h = get(url)
    out = []
    for m in re.finditer(r'<div\s+class="bw-player"(.*?)</div>', h, re.S):
        blk = m.group(1)
        g = lambda k: (re.search(k + r'="([^"]*)"', blk) or [None, None])[1]
        sid, user, mp3, title, dur = g("data-sound-id"), g("data-username"), g("data-mp3"), g("data-title"), g("data-duration")
        if sid and mp3:
            out.append({"id": sid, "user": user, "title": html.unescape(title or ""), "dur": float(dur or 0),
                        "hq": mp3.replace("-lq.mp3", "-hq.mp3"),
                        "page": f"https://freesound.org/people/{urllib.parse.quote(user)}/sounds/{sid}/"})
    return out


def license_of(page):
    h = get(page)
    m = re.search(r'creativecommons\.org/(publicdomain/zero|licenses/[a-z\-]+)/[0-9.]+', h)
    return m.group(0) if m else "?"


def main():
    log_p = OUT / "sources.json"
    log = json.loads(log_p.read_text()) if log_p.exists() else {}
    for key, (q, n, maxdur) in QUERIES.items():
        try:
            res = search(q, maxdur)[:n]
        except Exception as e:  # noqa
            print("search failed", key, e)
            continue
        for r in res:
            name = f"{key}__{r['id']}"
            if name in log:
                continue
            time.sleep(1.0)
            lic = license_of(r["page"])
            if "publicdomain/zero" not in lic:
                print("skip (license)", name, lic)
                continue
            mp3 = OUT / f"{name}.mp3"
            req = urllib.request.Request(r["hq"], headers=UA)
            mp3.write_bytes(urllib.request.urlopen(req, timeout=60).read())
            subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", str(mp3), "-ar", "48000", str(mp3.with_suffix(".wav"))])
            mp3.unlink()
            subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", str(mp3.with_suffix(".wav")), "-c:a", "flac", str(mp3.with_suffix(".flac"))])
            mp3.with_suffix(".wav").unlink()
            r.update({"license": "CC0 1.0 (" + lic + ")", "query": q, "file": f"{name}.flac"})
            log[name] = r
            print("ok", name, r["title"], r["dur"], "s")
            log_p.write_text(json.dumps(log, ensure_ascii=False, indent=1))


if __name__ == "__main__":
    main()
