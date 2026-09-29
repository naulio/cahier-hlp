"""For a line that is cut into pieces, pick the take whose pieces are each understood alone.

A take can be perfect as a whole ("Rabelais, Rousseau, Flaubert, Hugo") and still be
impossible to cut when the words are linked (« Rabelais-rousse / ouf »). Each take is
cut (silences first, then word gaps), every piece is transcribed alone by Whisper, and
the take where all pieces match their text, with the clearest gaps, is kept; among
valid takes, the whole-line score of generate_voice.py breaks ties.

Pieces: "parts" in lines.json (texts of the pieces), else one word per piece.

usage: python pick_split_take.py V01 V05 V13 V14
Writes audio/voice/lines/<ID>.wav and updates logs/voice_takes.json (best + split_check);
voice_process.py then uses the validated cut points.
"""
import difflib
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

LOG = ROOT / "logs" / "voice_takes.json"
LINES = json.loads((ROOT / "scripts/voice/lines.json").read_text())["lines"]


def wer(ref, hyp):
    sm = difflib.SequenceMatcher(a=ref, b=hyp, autojunk=False)
    errs = sum(max(i2 - i1, j2 - j1) for tag, i1, i2, j1, j2 in sm.get_opcodes() if tag != "equal")
    return errs / max(1, len(ref))


def pieces_score(y, cuts, parts):
    edges = [0] + cuts + [len(y)]
    heard, score = [], 0.0
    for k, (a, b) in enumerate(zip(edges, edges[1:])):
        with tempfile.NamedTemporaryFile(suffix=".wav") as tmp:
            sf.write(tmp.name, lib.fade(y[a:b], 0.004, 0.02), lib.SR)
            txt, words = transcribe(tmp.name, "medium")
        heard.append(txt)
        ok = wer(norm_words(parts[k]), norm_words(txt)) <= 0.15
        p = float(np.mean([x["p"] for x in words])) if words else 0.0
        score += (0 if ok else 10) + (1 - p)
    return score, heard


def gap_depth_db(y, cuts):
    fr = int(lib.SR * 0.01)
    m = y.mean(1)
    r = np.sqrt(np.convolve(m ** 2, np.ones(fr) / fr, "same"))
    peak = 20 * np.log10(r.max() + 1e-9)
    return float(np.mean([peak - 20 * np.log10(r[c] + 1e-9) for c in cuts]))


def run(lid, log):
    spec = next(l for l in LINES if l["id"] == lid)
    n = int(spec["split"])
    parts = spec.get("parts") or norm_words(spec["text"])
    line_score = {t["file"]: t["score"] for t in log[lid]["takes"]}
    results = []
    for f in sorted(line_score):
        y = lib.load(f)
        best = None
        methods = (("silences", lambda y: cut_points(y, n)), ("mots", lambda y: cut_points_words(y, n, spec.get("parts"))))
        for how, fn in methods:
            try:
                cuts = fn(y)
            except SystemExit:
                continue
            if len(cuts) != n - 1:
                continue
            s, heard = pieces_score(y, cuts, parts)
            s += line_score[f] * 0.5 - gap_depth_db(y, cuts) / 40      # prise entière + silences francs
            if best is None or s < best["score"]:
                best = {"file": f, "how": how, "score": round(s, 3), "heard": heard,
                        "cuts_s": [round(c / lib.SR, 3) for c in cuts]}
        if best:
            results.append(best)
            print(f"  {Path(f).name} {best['how']} {best['score']} {best['heard']}")
    win = min(results, key=lambda r: r["score"])
    if win["score"] >= 10:
        raise SystemExit(f"{lid} : aucune prise ne se découpe proprement ; régénérer (plus de prises ou autre texte)")
    y, sr = sf.read(win["file"])
    sf.write(ROOT / "audio/voice/lines" / f"{lid}.wav", y, sr, subtype="PCM_24")
    log[lid]["best"] = win["file"]
    log[lid]["split_check"] = results
    print(lid, "->", Path(win["file"]).name, win["how"], win["heard"])


if __name__ == "__main__":
    log = json.loads(LOG.read_text())
    for lid in sys.argv[1:]:
        run(lid, log)
    LOG.write_text(json.dumps(log, ensure_ascii=False, indent=1))
