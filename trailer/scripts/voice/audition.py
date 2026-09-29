"""Audition of candidate narrator voices (Kyutai TTS 1.6B): same text, 2 takes each, measured.

usage: python audition.py voice1 voice2 ...   (names as in assets/voices_ref/, without the .safetensors suffix)
Writes audio/voice/audition/<voice>_<k>.wav and logs/voice_audition.json.
"""
import json
import os
import sys
from pathlib import Path

import soundfile as sf

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts"))
sys.path.insert(0, str(ROOT / "scripts" / "voice"))
import generate_voice as g  # noqa: E402
from voice_metrics import analyse  # noqa: E402

TEXT = "Depuis la rentrée, les textes s'accumulent. Alors on a tout rassemblé. Dans le Cahier d'hache-elle-pé."
REF = "Depuis la rentrée, les textes s'accumulent. Alors on a tout rassemblé. Dans le Cahier d'HLP."
OUT = ROOT / "audio" / "voice" / "audition"
OUT.mkdir(parents=True, exist_ok=True)
LOG = ROOT / "logs" / "voice_audition.json"
res = json.loads(LOG.read_text()) if LOG.exists() else {}
for v in sys.argv[1:]:
    g.KYUTAI_VOICE = v
    for k in range(int(os.environ.get("AUDITION_TAKES", 1))):
        p = OUT / f"{v}_{k}.wav"
        if not p.exists():
            y, sr = g.tts_kyutai(TEXT, "", 2000 + k * 7919)
            sf.write(p, g.trim(y, sr), sr, subtype="PCM_24")
        m, _ = analyse(str(p), REF, "medium")
        res[f"{v}_{k}"] = {k2: m.get(k2) for k2 in ("wer", "mean_word_prob", "f0_median_hz", "f0_std_st", "f0_range_p5_p95_st",
                                                   "words_per_min_speech", "duration_s", "transcript")}
        print(v, k, res[f"{v}_{k}"], flush=True)
        LOG.write_text(json.dumps(res, ensure_ascii=False, indent=1))
