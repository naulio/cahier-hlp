# Pipeline complet du trailer « Cahier d'HLP ».  make all  (ou étape par étape)
PY ?= python3
VERSION ?= final

all: voice timeline sfx music mix video export

voice:            ## voix off : génération TTS (Google si clé, sinon Kyutai local) + choix des prises
	$(PY) scripts/voice/generate_voice.py --takes 4 --whisper medium
	cd scripts/audio && $(PY) voice_process.py

timeline:         ## placement des répliques + repères de synchro -> source/data/cues.js
	$(PY) scripts/build_timeline.py medium

music:            ## partition générée (après sfx : percussions de papier ; piano via scripts/audio/get_piano.sh)
	cd scripts/audio && $(PY) music.py

sfx:              ## bibliothèque d'effets (sons CC0 découpés + sons procéduraux)
	cd scripts/audio && $(PY) sfx.py

mix:              ## repères des bruitages (déclarés par les scènes) puis mixage, ducking, mastering -14 LUFS
	$(PY) scripts/export_cues.py
	cd scripts/audio && $(PY) mix.py

video:            ## rendu image par image (Chromium headless)
	$(PY) scripts/render.py --workers 3 --out renders/video_only.mp4

export:           ## MP4 final
	$(PY) scripts/export.py renders/video_only.mp4 exports/cahier-hlp_trailer_4-3_1440x1080.mp4

deliver:          ## livrables : vidéo finale, version de travail sous-titrée, .srt, pistes audio FLAC
	$(PY) scripts/deliver.py renders/video_only.mp4

qa:               ## dossier de contrôle qualité pour les évaluateurs
	$(PY) scripts/qa_package.py $(VERSION) exports/cahier-hlp_trailer_4-3_1440x1080.mp4

preview:          ## aperçu interactif : http://localhost:8790/source/index.html?play
	$(PY) -m http.server 8790

.PHONY: all voice timeline music sfx mix video export deliver qa preview
