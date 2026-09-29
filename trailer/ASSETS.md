# Ressources, provenance et licences

Tout ce qui apparaît ou s'entend dans le trailer est listé ici. Rien n'est tiré d'une banque d'images
« stock » ni généré par une IA d'image : les visuels sont dessinés en code (HTML/CSS/SVG), les seules
images sont des portraits du domaine public.

## Crédits à mentionner (licences avec attribution)

- **Piano** : *Salamander Grand Piano V3*, Alexander Holm — licence **CC BY 3.0**
  (https://archive.org/details/SalamanderGrandPianoV3). Échantillons rééchantillonnés et joués par
  `scripts/audio/music.py` ; non inclus dans le dépôt (`sh scripts/audio/get_piano.sh`).
- **Moteur de voix** : *Kyutai TTS 1.6B* (`kyutai/tts-1.6b-en_fr`) — modèle sous **CC BY 4.0**, Kyutai.
  Voix de référence `unmute-prod-website/fabieng-enhanced-v2` (dépôt `kyutai/tts-voices`, **CC0**).

Texte de crédit proposé (description de la vidéo) :
> Piano : Salamander Grand Piano V3 (Alexander Holm, CC BY 3.0). Voix de synthèse : Kyutai TTS (CC BY 4.0).
> Bruitages : Freesound (CC0). Portraits : domaine public (Wikimedia Commons).

## Voix off

| Élément | Source | Licence |
|---|---|---|
| Voix actuelle | Kyutai TTS 1.6B, local (CPU), voix CC0 ci-dessus ; prises choisies automatiquement (Whisper + prosodie) | CC BY 4.0 (modèle) / CC0 (voix) |
| Voix Google (prête, non utilisée faute de clé) | Gemini TTS ou Cloud Text-to-Speech (Chirp 3 HD), via `GEMINI_API_KEY` / `GOOGLE_TTS_API_KEY` | conditions Google Cloud |
| Alignement | faster-whisper `medium` (vérification et repères de synchro uniquement) | MIT |

## Musique

Partition entièrement générée par `scripts/audio/music.py` (aucune boucle ni musique de banque) :
piano Salamander (voir plus haut), nappe, basse et cordes synthétisées en Python, percussions faites
avec les bruitages de papier et de stylo ci-dessous.

## Bruitages

Enregistrements **CC0 1.0** de Freesound (téléchargés par `scripts/audio/fetch_sfx.py`, licence
revérifiée à la source ; métadonnées complètes dans `audio/sfx/sources/sources.json`, découpes dans
`audio/sfx/library.json`) :

| Son(s) utilisé(s) | Enregistrement | Auteur | Page |
|---|---|---|---|
| paper_slide_1…6 | Paper sheets (sliding) | Pipelenisf | https://freesound.org/people/Pipelenisf/sounds/560352/ |
| paper_hit_1…3, stamp (impact) | Paper sheets (hitting) | Pipelenisf | https://freesound.org/people/Pipelenisf/sounds/560353/ |
| paper_sweep | Paper shuffling | meeser9 | https://freesound.org/people/meeser9/sounds/642770/ |
| paper_down | 01_pokladani_papiru_na_lavici | 13GPanska_Markova_Lucie | https://freesound.org/people/13GPanska_Markova_Lucie/sounds/379888/ |
| pen_stroke_1…4 | pen (marker pen) writes on paper | SSkiba88 | https://freesound.org/people/SSkiba88/sounds/751055/ |
| pencil_caption, write_a, write_b | Pencil Writing on Paper | elliotlp | https://freesound.org/people/elliotlp/sounds/277312/ |
| marker_1…3 | fast and slow marker strokes | MBPiM | https://freesound.org/people/MBPiM/sounds/351145/ |
| card_flip | flipCard.wav | Splashdust | https://freesound.org/people/Splashdust/sounds/84322/ |
| shutter_k1000 (déclic) | Pentax K1000 Camera Shutter | yfjesse | https://freesound.org/people/yfjesse/sounds/579883/ |
| polaroid_eject | PRO_Polaroid | Sami_Zadoud | https://freesound.org/people/Sami_Zadoud/sounds/755841/ |
| room_tone | Room tone, very quiet small apartment room | visionear | https://freesound.org/people/visionear/sounds/565535/ |

Sons **procéduraux** (créés en code dans `scripts/audio/sfx.py`) : `ui_click`, `ui_tick`, `wood_tock`,
`card_tick_1…3`, `air_soft`, `air_long`, et le corps du tampon `stamp`.

Écartés : 40 autres enregistrements CC0 écoutés/mesurés puis rejetés (trop bruités, trop « cinéma »,
ou appareils photo numériques) ; en v2, les sons d'autofocus et d'avance de film ont été retirés pour ne
garder **qu'un seul appareil** (déclic + éjection de Polaroid). Liste complète avec `retenu: False`
dans `sources.json`.

## Images

| Fichier | Œuvre | Source | Statut |
|---|---|---|---|
| `assets/archive/rabelais.jpg` | Portrait de François Rabelais (anonyme, XVIIe s.) | https://commons.wikimedia.org/wiki/File:Francois_Rabelais_-_Portrait.jpg | domaine public |
| `assets/archive/rousseau_latour.jpg` | Jean-Jacques Rousseau, pastel de Maurice Quentin de La Tour (1753) | https://commons.wikimedia.org/wiki/File:Jean-Jacques_Rousseau_(painted_portrait).jpg | domaine public |
| `assets/archive/flaubert.jpg` | Gustave Flaubert, photographie du XIXe siècle | https://commons.wikimedia.org/wiki/File:Gustave_Flaubert.jpg | domaine public |
| `assets/archive/hugo_carjat_1876.jpg` | Victor Hugo par Étienne Carjat (1876) | https://commons.wikimedia.org/wiki/File:Victor_Hugo_by_%C3%89tienne_Carjat_1876_-_full.jpg | domaine public |

Les versions `*_sq.jpg` sont des recadrages carrés (`scripts/prepare_archive.py`). Aucun portrait
d'auteur encore protégé (Camus, Arendt, Péguy…) : ils n'apparaissent que par leur nom.
Textures (`assets/textures/*.png` : papier, bureau, masque d'encre) : générées par
`scripts/make_textures.py` (bruit procédural).

## Textes cités à l'écran

Extraits courts (quelques mots à deux alexandrins) des textes étudiés en classe, pour les auteurs du
domaine public (Rabelais, Rousseau, Hugo, Flaubert, Balzac, Ferry, Péguy). Pour Camus et Arendt,
seuls le titre et une référence apparaissent (pas de citation longue), conformément à la règle du dépôt.

## Polices (toutes SIL Open Font License 1.1, fichiers dans `assets/fonts/`, licences dans `assets/fonts/licenses/`)

| Police | Usage | Auteur |
|---|---|---|
| Newsreader (romain + italique) | titres éditoriaux, citations | Production Type |
| Schibsted Grotesk | interface | Schibsted |
| DM Mono | légendes, adresse | Colophon Foundry |
| Caveat | écriture manuscrite | Impallari Type |

## Marque

Symbole « c’ » (réglure Seyès, marge rouge, carré kaki) et logotype dessinés pour le trailer
(`source/lib/brand.js`). Nom « Cahier d'HLP » : celui du site existant, centralisé dans
`source/data/content.js` (`brand`) pour pouvoir être remplacé.
