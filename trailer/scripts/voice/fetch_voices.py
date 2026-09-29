"""Download Kyutai TTS voice embeddings (kyutai/tts-voices on Hugging Face) into assets/voices_ref/.

usage: python fetch_voices.py cml-tts/fr/4193_3103_000004-0001_enhanced.wav [...]
Licences: cml-tts/fr = CC BY 4.0 (CML-TTS dataset, LibriVox readers); voice-donations and
Kyutai's own unmute-prod-website recordings = CC0 (see the repo README).
"""
import sys
import time
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "assets" / "voices_ref"
OUT.mkdir(parents=True, exist_ok=True)
BASE = "https://huggingface.co/kyutai/tts-voices/resolve/main/"

for v in sys.argv[1:]:
    for suffix in (".1e68beda@240.safetensors", ""):
        dst = OUT / (v.replace("/", "_") + suffix)
        if dst.exists():
            continue
        for attempt in range(4):
            try:
                with urllib.request.urlopen(BASE + v + suffix, timeout=60) as r:
                    dst.write_bytes(r.read())
                break
            except Exception as e:      # 429 : on espace les requêtes
                print("retry", v + suffix, e)
                time.sleep(2 ** (attempt + 1))
        time.sleep(0.3)
    print("ok", v)
