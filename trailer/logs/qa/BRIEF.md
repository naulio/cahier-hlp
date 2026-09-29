# Brief de contrôle qualité : trailer « Cahier d'HLP »

Tu es un évaluateur **indépendant et exigeant**. Tu n'as pas fait cette vidéo. Ton but n'est pas d'être gentil :
c'est de trouver ce qui empêche ce trailer d'être excellent. Les notes gonflées sont inutiles.

## Le produit
Un site gratuit de révision (spécialité HLP : humanités, littérature, philosophie ; Terminale), fait pour
la classe de **TG1 du lycée Notre-Dame**. Nom réel du site : **Cahier d'HLP** (naulio.github.io/cahier-hlp).
Fonctions réelles : une fiche par texte (l'essentiel en 5 points, auteur, époque, mouvement, citations,
notes de cours, pièges), flashcards à répétition espacée (boîtes de Leitner), QCM corrigés et expliqués,
examen blanc, frise chronologique, mode oral… Gratuit, sans compte, sans publicité, progression stockée
dans le navigateur. Premier chapitre : « Éducation, transmission et émancipation » (Rabelais, Rousseau,
Balzac, Flaubert, Hugo, Ferry, Péguy, Camus, Arendt).

## ⚠️ Retour du commanditaire après la v2 — PRIORITAIRE sur tout le reste de ce brief
Le commanditaire a vu la v1 et la v2. Son verdict, mot pour mot : « la v1 était mieux en tout point. […] la voix,
longue, pas assez narrateur, et vraiment mauvaise. Manque de VFX et SFX, il faut captiver l'attention, le style
motion avec moins de texture de la v1 est… 100× mieux. »
Les évaluations précédentes ont poussé la v2 dans la mauvaise direction (plus de papier, de crayon, de textures,
d'« artisanal », moins d'effets sonores). **Ne recommande plus cela.** Ce qu'il veut, et ce que tu dois noter :
- **Captiver l'attention** du début à la fin : énergie, rythme, relances visuelles et sonores, moments « wow ».
- **Style motion net et moderne de la v1** (interface claire, aplats, peu de textures, typographie propre) :
  c'est la référence de style. Des textures lourdes, un look « fait main » terne ou lent sont des défauts.
- **VFX** : transitions dynamiques et motivées (poussées de caméra, whip, zooms punchés sur le rythme, flashs,
  halos et balayages de lumière, masques, vitesse variable, typographie cinétique forte, parallaxe). Absence
  d'effets = défaut. Seule limite : rien de cheap, de néon/cyberpunk ou d'illisible.
- **SFX riches et synchronisés** : whooshes, impacts, montées (risers), sub drops, clics d'interface, déclics…
  Une bande-son dense est **souhaitée** tant qu'elle reste calée à l'image et sous la voix.
- **Voix de narrateur** : présence, assurance, rythme soutenu, vraie narration de bande-annonce ; une voix lente,
  étirée, plate ou « lecture » est un défaut majeur. Durée totale serrée (≈ 55-60 s).
- La **musique** doit porter l'énergie (montée, drops, relances), pas rester en retrait.
Tout ce qui suit reste valable **sauf** là où cela contredit ce retour (en particulier : « pas un whoosh sur chaque
animation », « interdits : particules, glitchs », « voix calme ») — le retour du commanditaire l'emporte.
La **v1** (`logs/qa/v1/`) est la référence de style : compare la version évaluée à la v1 et dis si elle fait mieux.

## Ce que le commanditaire exigeait au départ (résumé fidèle)
- Trailer de **55 à 70 s** (idéal ~60 s), **4:3 paysage** (1440×1080), lisible sur ordinateur **et téléphone**.
- Ton : moderne, intelligent, élégant, accessible, ambitieux, légèrement émotionnel ; **jamais** cringe,
  corporate artificiel, infantilisant ou trop scolaire. Pas une pub agressive : un projet d'élève pour la classe.
- Direction artistique : startup tech haut de gamme × littérature française / archives / papier × rétro discret
  (appareils photo, Polaroid) — le rétro doit venir des palettes, matières, bordures, typographie, détails,
  **pas d'un filtre vintage global**. Réalisation contemporaine.
- Palette : vert kaki, beige, blanc cassé, noir doux/anthracite (+ touches : rouge désaturé, orange brûlé,
  bleu pâle, jaune papier, brun, vert profond). Pas de néon, pas de cyberpunk, pas de « startup générique ».
- Motion : typographie cinétique synchronisée avec la voix, masques, caméra numérique subtile, parallaxe,
  morphing, interfaces qui se construisent, micro-interactions, transitions motivées. **Interdits** :
  transitions PowerPoint, wipes génériques, zooms excessifs, glitchs, 3D inutile, particules, animation
  toutes les 0,2 s pour « montrer de l'animation ».
- Structure : 0-5 s hook ; 5-15 s le problème (élégant, pas dramatique) ; 15-30 s la solution (l'app devient
  le centre) ; 30-45 s l'expérience (fonctions rapides mais lisibles) ; 45-55 s identité / communauté (humain,
  pas « RÉVOLUTIONNE TON APPRENTISSAGE ») ; 55-65 s carton de fin (nom, promesse, dernière animation propre).
  Courbe de rythme : mystérieux → problème → accélération → révélation → montée → ralentissement → fin mémorable.
- Voix off française naturelle, jeune adulte, calme, articulée, légèrement chaleureuse ; pas robotique,
  pas « TikTok », pas GPS, pas assistant vocal, pas grave caricaturale. (Google TTS était demandé ; aucune clé
  Google n'était disponible dans l'environnement : moteur local Kyutai TTS 1.6B, voix de référence CC0.)
- Sound design précis, synchronisé, intelligent (pas un whoosh sur chaque animation). Mixage : 1) voix
  intelligible, 2) musique présente mais secondaire, 3) SFX perceptibles jamais envahissants ; pas de saturation.
- Musique cohérente avec l'identité (ambient minimal, électronique organique, piano léger…), qui évolue ;
  pas de musique corporate.
- Textes à l'écran : français impeccable, courts, lisibles, synchronisés.
- Interface : crédible comme une vraie app, hiérarchie, espace, pas surchargée ; pas d'interface incohérente.
- **Aucun « AI slop »** : pas d'images IA, de mains/visages bizarres, de texte illisible généré, d'effets
  gratuits, de sensation « vidéo générée automatiquement ».

## Barème (note sur 10)
- **< 5** : raté, à refaire structurellement. **5 à < 8** : insuffisant, à corriger. **≥ 8** : bon / très bon.
- Pour le hook, la voix, l'identité visuelle, le carton de fin et le sound design, la cible est **≥ 9**.
- La note mesure **l'écart au résultat attendu par le commanditaire** (retour ci-dessus), pas ton goût personnel :
  un trailer « sage » et bien fait mais qui ne captive pas ne dépasse pas 6.

## Matériel (dossier de la version à évaluer, ex. `logs/qa/v1/`)
Tu **ne peux pas regarder la vidéo en temps réel ni écouter l'audio**. Tu disposes de :
- `contact_*.jpg` : une image par seconde (horodatée) ;
- `strip_*.jpg` : 12 images à 10 i/s (0,1 s d'écart) sur les moments clés (mouvement, transitions) ;
- `phone_size_360px.jpg` : images réduites à la largeur d'un téléphone (lisibilité) ;
- `frames/` : images pleine résolution (1440×1080) aux instants des planches ;
- `timeline.json` : répliques de la voix off placées, mots horodatés, repères de synchro (`marks`) ;
- `voice_takes.json` : toutes les prises générées par réplique, leurs mesures et la prise retenue ;
- `voiceover_script.json` : le texte exact de la voix off ;
- `voice_metrics.json` : par réplique, transcription Whisper (medium), WER, confiance moyenne des mots,
  F0 médiane et dispersion (demi-tons), débit ;
- `audio_mix_stems.png` / `audio_music_stems.png` : enveloppes de niveau (dB) par piste + spectrogramme, avec repères ;
- `mix_report.json` : loudness intégrée, crête vraie, niveaux voix/musique ;
- `sfx_cues.json` (placement de chaque effet, avec la scène qui le déclare), `sfx_library.json` (provenance et licence de chaque son) ;
- `onscreen_content.js` : tous les textes affichés dans l'interface.
Le code source des scènes est dans `source/` (JS) et le pipeline dans `scripts/` si tu veux vérifier un point.
Pour l'audio, dis clairement ce que tu déduis des données et ce que tu ne peux pas vérifier sans écoute.

## Version à évaluer
Le dossier indiqué dans ta mission (ex. `logs/qa/v2/`). Pour une version ≥ 2, `logs/qa/v1/REVIEWS.md` résume
les critiques de la version précédente et ce qui a été changé (`QA_REPORT.md`). Juge d'abord la nouvelle
version **pour elle-même**, puis dis brièvement quels problèmes signalés sont réglés, lesquels persistent,
et ce que la correction a abîmé. `voice_takes.json` détaille toutes les prises de voix et leurs mesures
(dont `_names_check` : les quatre noms du hook réentendus ensemble).

## Ce que tu dois rendre
1. **Note /10** pour ton domaine (et, si pertinent, une note par section : hook, problème, solution,
   expérience, communauté, fin).
2. **Problèmes**, du plus grave au moins grave, **horodatés** (ex. « 17,4-18,1 s ») et **précis** (quoi, où, pourquoi).
3. Pour chacun, une **correction concrète** (pas « améliorer le rythme » : dis quoi changer).
4. Ce qui fonctionne et doit être gardé (brièvement).
Réponds en français, de façon structurée, en moins de 700 mots.
