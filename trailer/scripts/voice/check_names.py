"""Check the four names of the hook together: extracted names, joined with silences,
must be understood as « Rabelais, Rousseau, Flaubert, Hugo ». (Whisper hallucinates on a
single isolated name; in a list it has the context a listener has.)"""
import json
import sys
import tempfile
from pathlib import Path

import numpy as np
import soundfile as sf

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts"))
from voice_metrics import norm_words, transcribe  # noqa: E402

ids = ["V01a", "V01b", "V01c", "V01d"]
parts, sr = [], None
for lid in ids:
    y, sr = sf.read(ROOT / "audio/voice/lines" / f"{lid}.wav")
    parts += [y, np.zeros((int(sr * 0.35),) + y.shape[1:])]
with tempfile.NamedTemporaryFile(suffix=".wav") as tmp:
    sf.write(tmp.name, np.concatenate(parts), sr)
    heard, words = transcribe(tmp.name, "medium")
ok = norm_words(heard) == ["rabelais", "rousseau", "flaubert", "hugo"]
res = {"heard": heard, "word_prob": [round(float(w["p"]), 2) for w in words], "ok": ok}
log = json.loads((ROOT / "logs/voice_takes.json").read_text())
log["_names_check"] = res
(ROOT / "logs/voice_takes.json").write_text(json.dumps(log, ensure_ascii=False, indent=1))
print(res)
sys.exit(0 if ok else 1)
