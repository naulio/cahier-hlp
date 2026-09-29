# Rapport de contrôle qualité

Sept évaluateurs indépendants (sous-agents sans accès à la conversation de production), un domaine chacun :
1. direction artistique · 2. motion design · 3. sound design / mix · 4. voix off · 5. montage / storytelling ·
6. orthographe / français · 7. « AI slop detector » (sévère).
Brief commun : `logs/qa/BRIEF.md`. Matériel par version : `logs/qa/<version>/` (planches 1 i/s, bandes à
10 i/s sur les moments clés, taille téléphone, mesures audio, textes). Retours détaillés :
`logs/qa/<version>/REVIEWS.md`.

Barème : < 5 à refaire structurellement ; 5 à < 8 à corriger puis réévaluer ; ≥ 8 bon.
Cible ≥ 9 pour le hook, la voix, l'identité visuelle, le carton de fin et le sound design.

**Limite assumée** : aucun évaluateur (ni la production) ne peut écouter l'audio ni lire la vidéo en temps
réel. L'audio est jugé sur mesures objectives (Whisper : taux d'erreur et confiance par mot ; hauteur et
dispersion de la voix ; débit ; loudness EBU R128 ; crête vraie ; enveloppes et spectrogrammes par piste).
Une écoute humaine reste recommandée avant diffusion.

---

## v1 — `renders/trailer_v1.mp4` (62,4 s)

| Agent | Note |
|---|---|
| Direction artistique | 6 |
| Motion design | 6 |
| Sound design / mix | 6,5 (mix 7) |
| Voix off | 6 |
| Montage / storytelling | 6,5 |
| Orthographe / français | 7 |
| AI slop detector | 6 |

Verdict : **insuffisant partout** → reprise structurelle (pas de retouches cosmétiques).
Problèmes principaux et idées retenues : `logs/qa/v1/REVIEWS.md`.

### Modifications v1 → v2

**Image**
- Hook : Polaroids qui tombent chacun sur son nom, se développent ; « tout » souligné à la main.
- Problème : feuilles, post-it, surligneur, notes au stylo ; mots de la question sans flou.
- Un seul appareil, un **Polaroid** : viseur à stigmomètre (plus d'affichage numérique « AF / ISO »),
  déclic par éclat d'exposition (plus d'image noire), caméra figée à l'instant du déclic.
- Symbole refait : « c’ » sur réglure Seyès, marge rouge qui déborde, carré kaki (plus d'icône « hamburger »).
- Application : feuille de papier (grain, barre latérale kraft) au lieu d'une maquette SaaS flottante ; doigt
  (point de toucher) au lieu d'un curseur macOS ; la carte Rousseau devient l'en-tête de sa fiche (plus de page
  vide) ; flashcard bristol, boîtes de Leitner kraft avec des intervalles réels, tampon « Revient dans 1 heure » ;
  caméra réduite à trois cadres tenus et recentrés ; flou de mouvement à 6-8 sous-images (plus d'images fantômes).
- Frise refaite : espacement régulier, étiquettes sur deux rangs, Polaroids alignés sur leur point, trait
  terracotta qui relie Rabelais à Arendt ; titre exact « Neuf auteurs, quatre siècles ».
- Communauté refaite : **plan de classe dessiné au crayon** sur une page Seyès, « TG1 » entouré, le téléphone
  rejoint une place, les coches arrivent stylo par stylo à un rythme irrégulier (plus de grille qui s'allume).
- Fin : les rangées de tables deviennent la réglure du symbole ; « Tout est là. » (écho de « Mais où ? ») ;
  adresse tenue à l'écran ; dernier déclic : le carton devient un Polaroid posé sur le bureau du début.
- Typographie : apostrophes courbes, espaces insécables, orphelins supprimés, 4 familles (Newsreader,
  Schibsted Grotesk, DM Mono, Caveat) au lieu de 5.
- Exactitude : 10 textes / 9 auteurs, titres complets, ponctuation des extraits respectée.

**Voix**
- Les quatre noms : un nom seul est mal lu par le moteur local (« Brabeulet », « Égout ») et une liste lue
  d'un trait lie les noms (« Rabelais-rousse / ouf »). Chaque nom vient donc d'une courte phrase porteuse
  (« Rousseau, puis tout le reste. » ; « Et puis, Hugo. ») coupée dans la pause qui suit : intonation de
  continuation sur les trois premiers, chute sur Hugo, attaque nette ; chaque nom est posé sur son Polaroid
  (0,85 s d'écart, plus de chevauchement). Contrôle : les quatre noms extraits, réentendus ensemble par
  Whisper, donnent « Rabelais, Rousseau, Flaubert, Hugo. » (confiance 0,75 à 0,96).
- Répliques découpées (« Mais où ? », TG1, « Tout est là. ») : chaque morceau est réentendu seul avant
  d'être retenu ; l'ancienne prise de « Mais où ? » se serait coupée en « Mais… Ouf ! ».
- « Chaque texte … a sa fiche » (entendu « s'affiche ») → « Pour chaque texte vu en classe, une fiche » ;
  « Fait en TG1 » (entendu « Faites en ») → « Imaginé en TG1 ».
- Débit : pénalité doublée pour les prises pressées ; ralentissement de 5 % sans changer le timbre ;
  pauses réelles (« Mais où ? », « Tout est là. ») par découpe aux silences.
- Attaques préservées (marge de 80 ms avant la parole, fondu de 10 ms).

**Son**
- Bruitages déclarés par les scènes elles-mêmes (mêmes formules de temps que l'image), 57 au lieu d'un par
  animation ; un seul appareil (déclic + éjection de Polaroid) ; plus d'autofocus ni d'avance de film ;
  `air_soft` limité à deux occurrences ; sons d'écriture réels (crayon, stylo, feutre, tampon).
- Sous la voix, les bruitages sont adoucis au-dessus de 5,5 kHz et baissés de 2 dB (sibilantes dégagées).
- Musique réécrite : harmonie modale en ré mineur / fa, motif de quatre notes joué sur les noms, repris en
  ostinato dans l'application, résolu sur « là » ; percussions faites de papier et de crayon ; plus de
  charleston, d'arpège synthétique ni de suite d'accords « corporate ».

---

## v2 — `renders/trailer_v2.mp4` (64,9 s)

**Verdict du commanditaire** (prioritaire sur toute note d'agent) : « la v1 était mieux en tout point » ; voix
« longue, pas assez narrateur, et vraiment mauvaise » ; « manque de VFX et SFX, il faut captiver l'attention » ;
« le style motion avec moins de texture de la v1 est… 100× mieux ».
L'évaluation v2 par les 7 agents a été interrompue (limite d'usage, puis arrêt volontaire : leurs critères
poussaient dans la mauvaise direction). Aucune note v2 n'est donc rapportée.

**Leçon retenue** : les agents avaient poussé vers le « fait main » (papier, crayon, textures), moins de
bruitages et une voix plus lente — l'inverse de ce que veut le commanditaire. Le brief des agents
(`logs/qa/BRIEF.md`) commence désormais par son retour, mot pour mot, marqué prioritaire, et la v1 y est la
référence de style ; la note mesure l'écart au résultat attendu (un trailer sage qui ne captive pas ≤ 6).

### Modifications v2 → v3
- **Retour à la v1** : scènes, interface nette, style de mouvement, frise, communauté, carton et musique de la v1
  (corrections de texte de la v2 conservées : apostrophes, espaces insécables, titres exacts ; « Neuf auteurs »).
- **Voix** : nouveau narrateur (voix B de l'audition, choisie par le commanditaire pour son intonation), débit
  naturel sans ralentissement, traitement « cinéma » (−1 demi-ton, grave chaud, présence, compression) ;
  durée totale 56,5 s au lieu de 64,9 s. Les quatre noms, réentendus ensemble : « Rabelais, Rousseau, Flaubert, Hugo. »
- **VFX** (`source/lib/vfx.js`, `source/scenes/fx_track.js`) : flash sur chaque Polaroid, éclair blanc + séparation
  des couleurs + secousse au déclic, poussées de caméra sur les temps forts, filés horizontaux entre les écrans,
  halos chauds, reflets lumineux sur le logo et la citation, vignette de tension avant le déclic.
- **SFX** : ~145 bruitages calés sur les mêmes instants que les effets : souffles, impacts, montées (4 s avant le
  déclic, 2 s avant le nom), chutes graves, scintillements, pops d'interface, déclics d'appareil
  (`scripts/audio/sfx_trailer.py`, tout en synthèse, + la bibliothèque CC0).
- **Musique** : partition de la v1 avec caisse claire et batterie plus présentes, pulsation dès le problème,
  la communauté garde le rythme, roulement vers le nom.
- **Technique** : flou de mouvement à 6-8 sous-images (plus d'images fantômes) ; limiteur attentif à la crête vraie
  (−14 LUFS, ≤ −1 dBTP).

## v3

(évaluation en cours)
