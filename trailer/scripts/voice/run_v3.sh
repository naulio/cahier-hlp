#!/bin/sh
# Voix v3 : génération de toutes les répliques (narrateur 4482), puis choix des découpes validées.
cd "$(dirname "$0")/../.." || exit 1
export HF_HUB_OFFLINE=1
nice -n 5 python3 -u scripts/voice/generate_voice.py --provider kyutai --whisper medium > logs/voice_v3.log 2>&1
nice -n 5 python3 -u scripts/voice/pick_split_take.py V01 >> logs/voice_v3.log 2>&1
