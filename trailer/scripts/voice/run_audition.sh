#!/bin/sh
# Audition des voix candidates (hors ligne : le modèle est déjà en cache).
cd "$(dirname "$0")/../.." || exit 1
HF_HUB_OFFLINE=1 nice -n 5 python3 -u scripts/voice/audition.py \
  cml-tts_fr_4193_3103_000004-0001_enhanced.wav cml-tts_fr_4482_3103_000063-0001_enhanced.wav \
  cml-tts_fr_2114_1656_000053-0001_enhanced.wav cml-tts_fr_928_486_000075-0001_enhanced.wav \
  cml-tts_fr_1406_1028_000009-0003_enhanced.wav cml-tts_fr_9834_9697_000150-0003_enhanced.wav \
  cml-tts_fr_2216_1745_000007-0001_enhanced.wav cml-tts_fr_4937_3731_000004-0001_enhanced.wav \
  unmute-prod-website_developer-1.mp3 cml-tts_fr_2154_2576_000020-0003_enhanced.wav \
  cml-tts_fr_1591_1028_000108-0004_enhanced.wav > logs/voice_audition.log 2>&1
