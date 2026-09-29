"""For a line that is cut into separate words (the four names of the hook), pick the take
whose pieces are each understood on their own.

A take can be perfect as a whole ("Rabelais, Rousseau, Flaubert, Hugo") and still be
impossible to cut when the names are linked (« Rabelais-rousse / ouf »). Each take is
cut (silences first, then word gaps), every piece is transcribed alone by Whisper, and
the take where all pieces match their word, with the clearest silences, is kept.

usage: python pick_split_take.py V01
Writes audio/voice/lines/<ID>.wav and updates logs/voice_takes.json (best + split_check).
"""
import json
import sys
import tempfile
from pathlib import Path

import numpy as np
import soundfile as sf

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts"))
sys.path.insert(0, str(ROOT / "scripts" / "audio"))
import lib  # noqa: E402
from voice_metrics import norm_words, transcribe  # noqa: E402
from voice_process import cut_points, cut_points_words  # noqa: E402

lid = sys.argv[1]
spec = next(l for l in json.loads((ROOT / "scripts/voice/lines.json").read_text())["lines"] if l["id"] == lid)
n = int(spec["split"])
target = norm_words(spec["text"])
LOG = ROOT / "logs" / "voice_takes.json"
log = json.loads(LOG.read_text())
takes = sorted({t["file"] for t in log[lid]["takes"]} | {str(p) for p in (ROOT / "audio/voice/takes").glob(f"{lid}_*.wav")})


def pieces_ok(y, cuts):
    edges = [0] + cuts + [len(y)]
    heard, score = [], 0.0
    for k, (a, b) in enumerate(zip(edges, edges[1:])):
        with tempfile.NamedTemporaryFile(suffix=".wav") as tmp:
            sf.write(tmp.name, lib.fade(y[a:b], 0.004, 0.02), lib.SR)
            txt, words = transcribe(tmp.name, "medium")
        w = norm_words(txt)
        heard.append(txt)
        ok = len(w) == 1 and w[0] == target[k]
        p = float(np.mean([x["p"] for x in words])) if words else 0.0
        score += (0 if ok else 10) + (1 - p)
    return score, heard


def gap_depth_db(y, cuts):
    fr = int(lib.SR * 0.01)
    m = y.mean(1)
    r = np.sqrt(np.convolve(m ** 2, np.ones(fr) / fr, "same"))
    peak = 20 * np.log10(r.max() + 1e-9)
    return float(np.mean([peak - 20 * np.log10(r[c] + 1e-9) for c in cuts]))


results = []
for f in takes:
    y = lib.load(f)
    best = None
    for how, fn in (("silences", cut_points), ("mots", cut_points_words)):
        try:
            cuts = fn(y, n)
        except SystemExit:
            continue
        if len(cuts) != n - 1:
            continue
        s, heard = pieces_ok(y, cuts)
        s -= gap_depth_db(y, cuts) / 40          # préférer des silences francs entre les noms
        if best is None or s < best["score"]:
            best = {"file": f, "how": how, "score": round(s, 3), "heard": heard, "cuts_s": [round(c / lib.SR, 3) for c in cuts]}
    if best:
        results.append(best)
        print(Path(f).name, best["how"], best["score"], best["heard"])
win = min(results, key=lambda r: r["score"])
if win["score"] >= 10:
    raise SystemExit("aucune prise ne se découpe proprement : régénérer (plus de prises ou autre texte)")
y, sr = sf.read(win["file"])
sf.write(ROOT / "audio/voice/lines" / f"{lid}.wav", y, sr, subtype="PCM_24")
log[lid]["best"] = win["file"]
log[lid]["split_check"] = results
LOG.write_text(json.dumps(log, ensure_ascii=False, indent=1))
print(lid, "->", Path(win["file"]).name, win)
