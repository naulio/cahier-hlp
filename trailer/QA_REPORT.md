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

## v3 — `renders/trailer_v3.mp4` (56,5 s)

**Verdict du commanditaire : « horrible »** — « beaucoup trop de VFX et de SFX, je parlais de minuscules
détails » ; veut une bande-son **sans batterie** (celle de la v1) ; la voix abaissée d'un demi-ton sonne « bizarre ».

### Notes des agents (5 sur 7 ; voix et français interrompus par la limite d'usage)

| Agent | Note | v3 jugée par rapport à la v1 |
|---|---|---|
| Direction artistique | 6,5 | « légèrement mieux » (plus d'énergie) |
| Motion / VFX | 6,5 | « mieux » ; demandait des filés et secousses plus forts |
| Son / musique / mix | 7 (mix 7,5) | « mieux » : « SFX enfin audibles et denses » ; demandait +3 dB de musique et plus de batterie |
| Montage / storytelling | 7 | « mieux » ; demandait des drops et des relances |
| AI slop detector | 6,5 | « plus d'énergie, pas plus propre » (pops en rafale, reflets rectangulaires) |

### Calibrage : les agents étaient mal réglés
- **Sens du jugement inversé.** Les cinq ont préféré la v3 à la v1 ; le commanditaire préfère nettement la v1.
- **Écart de note.** 6,5-7/10 contre un « horrible » (≈ 2/10) : environ 4 à 5 points trop haut.
- **Surcharge non vue comme défaut principal.** Aucun agent ne l'a désignée ainsi. Plusieurs ont même demandé
  plus d'effets (filés « de 900 px », secousses de 8 px, drops, batterie plus forte).
- **Seuls points alignés, mais secondaires.** Le détecteur de « slop » et la direction artistique ont relevé
  des effets « bon marché » (reflets en rectangle, voiles gris, rafales de pops).
- **Batterie et demi-ton non signalés.** Personne n'a relevé la batterie ; la voix abaissée n'a pas été jugée,
  l'agent voix ayant été interrompu.
- **Cause principale : mon brief.** J'avais traduit « manque de VFX et SFX » par « plus d'effets » au lieu de
  « minuscules détails », et le brief disait aux agents qu'une bande-son dense était souhaitée.
- **Correctif.** Le brief (`logs/qa/BRIEF.md`) donne maintenant les verdicts du commanditaire sur v1, v2 et v3
  comme **étalon** (v3 ≈ 2/10, v1 = référence). Il interdit de recommander toute densification. Il précise que la
  musique est celle de la v1 sans batterie, et que la voix est la voix B telle quelle.

### Modifications v3 → v4
- **Bande-son de la v1** : partition de la v1 **sans batterie** ; bruitages et mixage de la v1 (62 sons) ; seul le
  limiteur garde la correction de crête vraie.
- **Voix B d'origine** : plus de décalage d'un demi-ton, égalisation légère de la v1.
- **VFX réduits à 4 minuscules détails** : un reflet doux (bords fondus) sur le nom au logo et au carton ; deux
  poussées de caméra de 0,8 % et 1,2 % (« tout », déclic). Plus de flashs, secousses, filés, halos.
- Deux corrections relevées par les agents : « 9 auteurs » au lieu de « 9 textes » (il y a 10 textes pour 9
  auteurs) ; plus de bord de feuille visible à l'ouverture.

## v4 — `renders/trailer_v4.mp4` (56,4 s)

### Notes des agents (brief recalé sur les verdicts du commanditaire)

| Agent | Note | v4 par rapport à la v1 |
|---|---|---|
| Direction artistique | 8 | « mieux » en typographie, « pareil » en identité ; aucun ajout recommandé |
| Motion | 7 | « égale la v1 sans la dépasser » ; défauts de mouvement hérités de la v1 |
| Son / musique / mix | 7,5 (mix 8) | « au moins autant » que la v1 ; deux défauts nés du resserrement |
| Voix | 7,5 | voix B intacte (0,0 demi-ton), WER 0 ; retouches de pauses et d'une prise |
| Montage / storytelling | 7 | même film que la v1 (≈ 7,5), mais plus pressé : temps de lecture perdus |
| Orthographe / français | 7,5 | aucune faute ; libellés à aligner sur le vrai site |
| AI slop detector | 7,5 | plus aucun signe de la v3 ; petits signes hérités de la v1 |

**Calibrage** : cette fois conforme. Les agents situent la v4 au niveau de la v1 (7-8), ne recommandent plus
aucun ajout d'effet, et ne proposent que des retraits, des corrections et des durées.

### Modifications v4 → v5 (finitions seulement, rien d'ajouté)
- **Textes alignés sur le vrai site** : boîtes de Leitner « chaque tour · 10 min · 1 h · 6 h · 24 h » et
  « Revient dans 1 h » (`app/moteur.js`) ; « QCM · 16 » et « Question 4 / 16 » (`lecons/education.js`) ;
  apostrophes courbes, « 100 % », « 2026–27 », « 12 cartes à revoir » insécable ; micro-légendes plus lisibles
  sur téléphone.
- **Mouvement** :
  - le curseur clique bien sur « Je savais », puis marque un temps ;
  - plus de traînée du logo ni de dédoublements (flou de mouvement retiré ou doublé selon les plans) ;
  - l'image noire des deux déclics devient un assombrissement ;
  - plus de fondus enchaînés entre les écrans de l'app ;
  - la fiche est cadrée moins serré ;
  - la question du QCM est là dès l'arrivée ;
  - l'arc rouge « de Rabelais à Arendt » passe au-dessus de la frise : il sort de derrière le Polaroid de
    Rabelais et ne croise plus aucun nom, aucune photo ni aucune étiquette de siècle ; il se pose sur Arendt
    au moment où le nom est dit et tient environ 1 s.
- **Durées** : on rend du temps de lecture aux moments clés : question du hook, réponse de la flashcard,
  explication du QCM, classe allumée, adresse. Durée totale : 56,4 s → 60,3 s (cible du brief : ~60 s).
- **Voix** :
  - prise de « dans le Cahier d'HLP » à l'attaque propre ;
  - pause déplacée avant « dans » ;
  - silence réduit dans « de Rabelais à Arendt » ;
  - courte pause après « HLP » dans la phrase finale.
- **Son** :
  - la respiration musicale démarre sur un temps fort, pile sur « C'est gratuit » (plus de double attaque :
    aucune note du groove ne déborde dessus) ;
  - musique −1 dB ;
  - bruitages de l'accumulation −3 dB et adoucis dans les aigus ;
  - un souffle retiré sur « au bon moment » ;
  - autofocus et crayon final plus bas ;
  - dernières notes plus présentes ;
  - tics des cartes moins mécaniques.

## v5

60,0 s. Sept évaluateurs indépendants, même brief recalé sur le goût du commanditaire. Trois d'entre eux ont été
coupés par une limite d'utilisation : son et montage avaient déjà écrit leur rapport, la voix a été relancée.

| Domaine | Note v5 | (v4) | Verdict |
|---|---|---|---|
| Direction artistique | 8,5 | 8 | « la version la plus propre » ; mieux que la v1 en typographie et conformité au site |
| Motion | 7,5 | 7 | même mouvement et même retenue que la v1, un peu plus propre ; deux clignotements (déclic, capture) |
| Son / musique / mix | 8,3 (mix 8,5) | 7,5 | « même musique sans batterie, mêmes bruitages, moins de défauts : c'est la demande » |
| Voix | 7,5 | 7,5 | voix B intacte ; une pause annoncée corrigée ne l'était pas (V11) |
| Montage / storytelling | 7,8 | 7 | « même film, en plus propre, il dépasse la v1 » ; trois lectures trop courtes |
| Orthographe / français | 8 | 7,5 | aucune faute ; libellés à aligner, curseur sur un mot |
| AI slop detector | 8 | 7,5 | « aussi sobre que la v1, plus propre » ; petits signes de rendu scripté |

**Calibrage** : conforme. Tous situent la v5 au niveau de la v1 ou juste au-dessus, aucun ne demande d'ajouter
un effet ; toutes les corrections proposées sont des retraits, des durées ou des alignements.
**Vérification d'un rapport** : l'évaluateur voix pensait « dans » (V07) presque inaudible ; l'analyse spectrale
montre que la zone faible est une inspiration (énergie 1-6 kHz, sans voisement) et que « dans le » est à niveau.
Rien changé sur ce point.

### Modifications v5 → v6 (finitions seulement, rien d'ajouté)
- **Déclics** : un seul assombrissement léger (35 %) sur deux images, au-dessus de tout ; le voile clair qui
  suivait (et remontait les noirs) est supprimé, au premier déclic comme à la capture finale. Le viseur a
  désormais 0,35 s pour reculer avant le déclic (il sautait du plan serré au plan large en une image).
- **Capture finale** : départ plus doux et flou de mouvement réduit (plus de textes dédoublés).
- **Hook** : « Tu te souviens de *tout* ? » reste immobile ~0,6 s avant le recul.
- **Logo de fin** : le carré et la marge naissent avec les lignes (plus de « trois barres seules ») ; le nom
  entre sur fond clair ; le fond passe du vert au papier par un beige chaud au lieu d'un gris.
- **Logo du début** : « Cahier d'HLP » s'écrit sur « Cahier », plus sur « dans le » ; la barre latérale apparaît
  en fondu sur place.
- **Fiche** : poussée plus douce, cadrages tenus (auteur, cinq points, citation) ; la citation est cadrée sans
  couper la barre latérale ; le curseur se gare sous la liste ; l'encadré « Piège », qui surgissait juste avant la
  sortie, est retiré ; +0,3 s entre la fiche et les flashcards.
- **Écrans de l'app** : le nouvel écran entre pendant la fin de la sortie (plus de creux vide, sans fondu enchaîné).
- **Flashcard** : la réponse reste lisible ~0,7 s ; la carte garde son texte en rétrécissant et disparaît dans la
  boîte 3 ; la boîte 2 passe de 4 à 3 quand la boîte 3 passe de 7 à 8.
- **QCM** : les réponses sont posées ~0,4 s avant le clic ; l'explication s'ouvre sur « expliqués » et reste
  cadrée jusqu'à la sortie ; la frise n'entre qu'une fois le QCM parti.
- **Frise** : arc remonté de 15 px (ne frôle plus Hugo) ; +0,3 s de tenue après « Arendt ».
- **Textes** : « Touche la carte pour la retourner », « 15 questions entrelacées » (libellés du site),
  « 1712–1778 », « 52 % » et « 12 cartes à revoir » sur deux lignes voulues, espaces fines ; le 52 % du téléphone
  est affiché d'emblée (seul l'anneau se remplit) ; plus de bout de lettre sous « Gratuit. ».
- **Couleurs** : places allumées un peu moins « citron » ; micro-légende « Sans publicité · Rien n'est envoyé »
  plus lisible.
- **Voix** (même voix B, aucune hauteur changée) : la pause « de Rabelais … à Arendt » passe de 0,53 à 0,15 s
  (détection au niveau d'énergie, Whisper étirait le mot sur le silence) ; pause après « Alors » 0,44 → 0,28 s ;
  phrase finale ralentie de 5 % ; attaque de « Rabelais » adoucie, le nom un peu plus présent.
- **Son** : traits de stylo −4 dB et adoucis ; l'impact de papier collé au premier trait retiré ; souffle avant le
  déclic −4 dB et moins brillant ; levée avant la respiration −3 dB ; crayon final −4 dB ; souffle déplacé sur le
  recul du hook.
- Durée : 60,0 → 60,9 s.

## v6

(évaluation à venir)
