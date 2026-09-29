# Trailer « Cahier d'HLP »

Trailer de lancement (≈ 62 s, 4:3 paysage 1440×1080, H.264) du site de révision
[Cahier d'HLP](https://naulio.github.io/cahier-hlp/), fait pour la TG1 du lycée Notre-Dame.
Tout est produit par du code, de façon reproductible : animation HTML/CSS rendue image par image,
voix off par synthèse vocale, musique composée en Python, effets sonores CC0 + procéduraux, mixage.

**Vidéo finale : `exports/cahier-hlp_trailer_4-3_1440x1080.mp4`**

| Document | Contenu |
|---|---|
| `SCRIPT.md` | script de la voix off, découpage plan par plan, textes à l'écran |
| `QA_REPORT.md` | rapport qualité : notes des 7 évaluateurs par version, problèmes, corrections |
| `ASSETS.md` | tous les assets, leur provenance et leur licence |

## Arborescence

```
trailer/
  source/            la « timeline » : scènes HTML/JS, pures fonctions du temps
    index.html         scène 1440×1080 ; ?t=12.5 (image fixe) ou ?play (lecture)
    lib/               moteur (easing, ressorts, caméra), icônes, composants d'interface
    data/              contenu affiché (tiré du vrai chapitre) + cues.js (généré : synchro voix)
    scenes/            desk (hook, problème, déclic) · app · frise · classe · end
  scripts/
    voice/             script (lines.json) + génération TTS multi-prises + choix automatique
    audio/             traitement voix, musique, effets, mixage, graphiques de contrôle
    build_timeline.py  place la voix, aligne chaque mot (Whisper), exporte les repères de synchro
    render.py          rendu image par image (Chromium headless, flou de mouvement par sous-images)
    export.py          encodage final
    qa_package.py      dossier remis aux évaluateurs (planches, bandes 10 i/s, mesures audio)
  assets/            polices (OFL), portraits du domaine public, textures procédurales, voix de référence
  audio/             voice/ (prises, répliques traitées) · music/ · sfx/ (sources CC0 + bibliothèque) · mix/
  exports/           vidéo finale + pistes audio (FLAC)
  renders/           rendus intermédiaires (non versionnés)
  logs/              timeline, mesures, rapports, dossiers QA par version
```

## Reproduire

```
pip install numpy scipy soundfile pedalboard pyloudnorm librosa faster-whisper playwright pillow moshi gtts
sh scripts/audio/get_piano.sh      # samples du piano (1,2 Go, non versionnés)
make all                           # voix → timeline → sfx → musique → mix → rendu → export
```
Chromium : `CHROME=/chemin/vers/chrome` si besoin (par défaut celui de Playwright).

## Voix off : Google TTS

`scripts/voice/generate_voice.py` choisit le moteur automatiquement (`--provider auto`) :

1. **Gemini TTS** (Google) si la variable d'environnement `GEMINI_API_KEY` existe
   (modèle `GEMINI_TTS_MODEL`, défaut `gemini-2.5-flash-preview-tts` ; voix `GEMINI_TTS_VOICE`, défaut `Achird`) ;
2. **Google Cloud Text-to-Speech** (voix Chirp 3 HD, `GOOGLE_TTS_VOICE`, défaut `fr-FR-Chirp3-HD-Achird`) si `GOOGLE_TTS_API_KEY` existe ;
3. sinon **Kyutai TTS 1.6B** en local (modèle CC-BY 4.0, voix de référence CC0).

Aucune clé Google n'était disponible pendant la production : la voix actuelle vient de Kyutai TTS.
Pour passer à Google, ajouter la clé comme variable d'environnement (jamais dans le code), puis
`make voice timeline sfx music mix video export` : la synchro, la musique et les effets suivent
automatiquement les nouveaux horaires des mots. Les conditions d'accès gratuites des API Google
évoluent : vérifier les quotas en vigueur avant usage.

## Changer le nom du produit

Le nom est centralisé dans `source/data/content.js` (`brand`) et dans le mot-symbole de
`source/lib/brand.js` (`wordmark`). La voix off le prononce dans `scripts/voice/lines.json` (V06, V14 ; champ `tts` pour Kyutai, `tts_google` pour Google).
