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

60,6 s. Sept évaluateurs, même brief. Tous les rapports sont complets.

| Domaine | Note v6 | (v5) | Verdict |
|---|---|---|---|
| Direction artistique | 8,5 | 8,5 | trois défauts réglés, mais un passage par le gris créé entre le QCM et la frise |
| Motion | 8 | 7,5 | déclic et capture « enfin propres » ; même creux gris à 36,2 s |
| Son / musique / mix | 8,6 (mix 8,8) | 8,3 | stylos, double attaque, levée réglés ; le souffle du recul tombe maintenant sur la voix |
| Voix | 8,5 | 7,5 | pause « Rabelais | à » corrigée, « Rabelais » au niveau des autres noms ; fins de phrase qui s'éteignent |
| Montage / storytelling | 8,1 | 7,8 | « même film, mieux minuté, sans surcharge » ; citation de la fiche jamais cadrée |
| Orthographe / français | 8,5 | 8 | aucune faute ; « Flaubert » coupé par le Polaroid de Hugo ; deux titres à aligner sur le site |
| AI slop detector | 8,5 | 8 | aussi sobre que la v1, plus propre ; barres seules du logo, gris à 36,2 s |

**Calibrage** : conforme, toujours aucune demande d'effet en plus. Défaut créé par la v6 et relevé par quatre
évaluateurs : le fondu QCM → frise laissait voir le fond sombre de la scène (les deux calques étaient
semi-transparents en même temps).
**Vérification** : l'évaluateur « slop » a relevé que les mots de « Des QCM corrigés, et expliqués » étaient placés
à intervalles fixes : exact. Whisper entendait « DQCM corrigé et expliqué » et l'alignement abandonnait. Il est
désormais insensible à ces homophones (et découpe « DQCM ») : le clic et l'explication sont calés sur les vrais mots.

### Modifications v6 → v7 (finitions seulement, rien d'ajouté)
- **Plus aucun passage par le gris** : QCM → frise, la fenêtre s'efface vers le papier puis la frise entre (le
  fond ne devient jamais transparent) ; frise → classe, la frise reste opaque sous un fondu court (0,25 s).
- **Logo de fin** : le carré naît dès que les lignes blanchissent, un peu plus clair sur le vert pour qu'on le voie.
- **Viseur** : le recul part dès la dernière visée et se fait à vitesse régulière (0,6 s au lieu d'un zoom éclair).
- **Déclic** : les post-it, pages et Polaroids restent au-dessus des feuilles qui deviennent des cartes (le bureau
  ne change plus d'aspect pendant les deux images assombries).
- **Flashcard** : la carte rétrécit sans flou ; les compteurs changent ensemble quand elle se pose (boîte 2 : 4 → 3,
  boîte 3 : 7 → 8) et il reste « 11 cartes à revoir » (en-tête, barre latérale, téléphone).
- **Fiche** : les boutons arrivent avec les cinq points (ils ne détournent plus l'œil au moment de la citation) ;
  le curseur se gare dans le vide et ne part qu'au dernier moment ; le logo de la barre latérale n'est plus coupé.
- **Hook** : le Polaroid de Hugo ne cache plus le « t » de « Flaubert ».
- **Textes** : titres des cartes Hugo et Ferry repris du site ; « Neuf auteurs » partout ; espaces insécables
  dans « 10 min », « 1 h »…
- **Fin** : le Polaroid « TG1 — 2026–27 » tient 0,5 s de plus avant le fondu au noir.
- **Voix** (même voix B, aucune hauteur changée) : « Arendt » et « classe » +3 dB (ils s'éteignaient) ; courte pause
  après « une fiche claire : » ; « dans le Cahier d'HLP » arrive 0,15 s plus tôt.
- **Son** : souffle du recul −4 dB (il couvrait « Depuis la rentrée ») ; attaque de « Rabelais » −4 dB sur 60 ms ;
  crayon final −2 dB avec entrée en fondu ; le clic du QCM se fond avec la note de « corrigés » ; le retournement de
  la flashcard et le « toc » de la boîte suivent l'image.
- Durée : 60,6 → 61,1 s.

## v7

61,1 s. Sept évaluateurs, même brief.

| Domaine | Note v7 | (v6) | Verdict |
|---|---|---|---|
| Direction artistique | 9 | 8,5 | « le creux gris a disparu » ; reste le calage carré/lignes du logo |
| Motion | 8,5 | 8 | gris, logo et flashcard propres ; empilement au déclic encore faux |
| Son / musique / mix | 8,7 (mix 8,6) | 8,6 | flam du QCM, souffle, crayon réglés ; limiteur plus sollicité (correctif de « Rabelais » à côté du pic) |
| Voix | 8,7 | 8,5 | « Arendt » réglé ; « Tu » faible, fin de V13 et phrase finale un peu rapides |
| Montage / storytelling | 8,4 | 8,1 | « même film, mieux minuté et pas plus chargé » ; résultat de la flashcard trop bref |
| Orthographe / français | 8 | 8,5 | titres du site tronqués par « … » (défaut créé par la v7) ; « s » de « Rabelais » |
| AI slop detector | 8,5 | 8,5 | voile gris réglé ; flou de l'envol, six barres du logo |

**Calibrage** : conforme ; aucune demande d'effet. **Vérifications** : le « saut d'échelle » du viseur signalé par
l'évaluateur motion ne se retrouve pas image par image (230 → 180 px, sans saut) ; en revanche l'empilement au
déclic était bien faux (les cartes, avec un z-index propre, passaient au-dessus du calque des post-it).

### Modifications v7 → v8 (finitions seulement, rien d'ajouté)
- **Déclic** : les post-it, pages et Polaroids restent réellement au-dessus des cartes.
- **Envol** : flou de mouvement des feuilles divisé par deux (obturateur 90° sur ce plan seulement).
- **Cartes** : les titres du site passent sur deux lignes au lieu d'être tronqués ; Péguy : « Belle Époque ».
- **Hook** : le Polaroid de Rabelais laisse voir tout son nom.
- **Flashcard** : la carte reste opaque jusqu'au bord de la boîte ; compteurs et bulle « Revient dans 1 h » changent
  sur la même image ; le résultat reste ~0,6 s avant le QCM.
- **App** : la grille entre moins floue.
- **Logo de fin** : lignes plus vite à leur taille ; le carré naît en fondu à 85 % (plus de « point » isolé), teinte
  opaque.
- **Classe** : relais chaud pendant le fondu depuis la frise ; « Gratuit. » 0,1 s plus tôt.
- **Voix** (même voix B, aucune hauteur changée) : « Tu » +5 dB ; « pour toute la classe » +2,5 dB ; pause après
  « une fiche claire : » 0,28 s ; phrase finale à 92 % ; « Rousseau » −1 dB.
- **Son** : attaque de « Rabelais » −2,5 dB sur 150 ms (le pic est à 121 ms) ; « gratuit » et « progression »
  −2 dB sur 100 ms (limiteur : 2,8 → 1,9 dB au maximum, 2,2 en v1) ; éjection du Polaroid −2 dB et adoucie ;
  notes de « corrigés » −2 dB ; arpège de la classe −3 dB ; stems écrits en flottant (plus d'écrêtage).
- Durée : 61,1 → 61,3 s.

## v8

61,3 s. Sept évaluateurs (relancés après une coupure de la limite d'utilisation).

| Domaine | Note v8 | (v7) | Verdict |
|---|---|---|---|
| Direction artistique | 9 | 9 | envol, Rabelais, relais chaud réglés ; lignes du logo qui débordent du carré |
| Motion | 8,8 | 8,5 | « déclic enfin propre » ; quelques doubles expositions de quelques images |
| Son / musique / mix | 9 (mix 8,9) | 8,7 | « la bande-son la plus propre de la série » ; limiteur 1,9 dB (v1 : 2,2) |
| Voix | 8,6 | 8,7 | pause après « claire » insérée dans le mot (défaut créé par la v8) ; fin encore rapide |
| Montage / storytelling | 8,5 | 8,4 | « même film, mieux minuté, pas plus chargé » ; petits textes illisibles sur téléphone |
| Orthographe / français | 9 | 8 | aucune faute ; « comparaison. » seul sur sa ligne ; coupures des titres |
| AI slop detector | 8,5 | 8,5 | hook et V10 réglés ; relais feuilles → cartes, six barres du logo |

**Calibrage** : conforme ; aucune demande d'effet. Moyenne 8,8.

### Modifications v8 → v9 (finitions seulement, rien d'ajouté)
- **Logo de fin** : les lignes rétrécissent autour de leur place finale dans le carré et une barre sur deux s'efface
  (plus d'étape « menu » qui déborde) ; le passage vert → papier est plus court ; le nom sort sur « Cahier ».
- **Lisibilité sur téléphone** : « Sans publicité · Rien n'est envoyé » +20 %, « Lycée Notre-Dame · TG1 · 2026–27 »
  ×1,4, adresse ×1,25.
- **Fiche** : la grille part avant l'entrée du titre (plus de double titre) ; le haut de la fenêtre et le logo restent
  dans le cadre.
- **Feuilles → cartes** : l'encre des feuilles s'éteint avant que le texte des cartes n'apparaisse (jamais de texte
  sur texte).
- **Flashcard** : la carte disparaît dans la boîte par l'échelle (plus de pavé gris) ; bulle lisible tout de suite.
- **Textes** : « une comparaison. » et les titres longs ne se coupent plus après un article.
- **Voix** (même voix B, aucune hauteur changée) : la pause après « claire » est insérée au creux du vrai silence,
  avec des fondus (elle coupait le mot) ; phrase finale à 90 % avec une courte pause après « réviser » ; « Rabelais »
  +1 dB.
- **Son** : la baisse de gain sur les attaques se cale sur le pic réel de la voix (« Ta progression », second
  « Rabelais ») ; ré6 et fa6 de l'arpège −3 dB sous « classe » ; musique −4 dB sous « Tu » et −3 dB sous « Arendt ».
  (Rappel v8 : le clic de navigation vers le QCM avait suivi l'écran, 0,2 s plus tôt.)
- Durée : 61,3 → 61,4 s.

## v9

61,4 s. Sept évaluateurs.

| Domaine | Note v9 | (v8) | Verdict |
|---|---|---|---|
| Direction artistique | 9 | 9 | titre, cadrage, flashcard, symbole mieux ; lignes encore calées à gauche du carré |
| Motion | 8,9 | 8,8 | texte sur texte et pavé gris réglés ; logo et entrée floue de l'app |
| Son / musique / mix | 9 (mix 8,9) | 9 | « Ta » et « Tu » réglés ; deux correctifs mal ciblés (« à Arendt », creux sous « Arendt ») |
| Voix | 8,9 | 8,6 | pause après « claire » réparée, « Tu » et « Arendt » réglés ; énumération de V08 irrégulière |
| Montage / storytelling | 8,6 | 8,5 | « mieux minuté, pas plus chargé » ; citation, adresse, logo |
| Orthographe / français | 9 | 9 | aucune faute ; trois finitions typographiques |
| AI slop detector | 8,5 | 8,5 | téléphone, fiche, flashcard réglés ; logo, tics de cartes |

**Calibrage** : conforme ; aucune demande d'effet. Moyenne 8,8.

### Modifications v9 → v10 (finitions seulement, rien d'ajouté ; un bruitage retiré)
- **Logo de fin** : la classe se referme en barres pleines avant le relais (plus de raccords) ; les lignes prennent
  leur largeur et leur place dans le carré avant qu'il naisse ; le carré a d'emblée sa teinte finale, avec un liseré
  clair le temps que le fond passe par sa teinte ; le fond s'éclaircit ensuite.
- **App** : la grille n'est plus floue à l'entrée (seulement estompée) ; la carte de la flashcard s'efface avant
  d'atteindre le compteur.
- **Polaroid final** : recul moins filé (obturateur 90°).
- **Classe** : le relais chaud s'efface avec le fondu (plus de saut de luminosité).
- **Textes** : « quel procédé ? » insécable ; titre de l'œuvre en italique sur la fiche ; renvois des vers de Hugo
  en retrait.
- **Voix** (même voix B, aucune hauteur changée) : courte pause après « l'auteur » ; virgule après « frise » 0,22 s
  (la suspension après « œuvres… » retrouve son relief) ; « Flaubert » −1 dB.
- **Son** : attaque de « Rabelais » −3,5 dB ; la baisse de gain vise « à A(rendt) » ; creux de musique sous
  « Arendt » recalé sur le mot ; retours des creux en 150 ms ; **tics des cartes : 3 au lieu de 9** (un par rangée).
  Limiteur : 1,7 dB au maximum (v1 : 2,2).

## v10

61,4 s. Sept évaluateurs (le rapport voix est arrivé après la préparation de la v11).

| Domaine | Note v10 | (v9) | Verdict |
|---|---|---|---|
| Direction artistique | 9 | 9 | « la naissance du symbole est enfin propre » ; feuilles vierges sur les cartes à 17,3 s |
| Motion | 9 | 8,9 | grille, tiret, raccords réglés ; carré né avant les lignes placées ; nom/titre qui se touchent |
| Son / musique / mix | 9,1 (mix 9,1) | 9 | limiteur 1,72 dB (v1 : 2,21) ; pic « -lais à » encore manqué ; trois tics identiques |
| Montage / storytelling | 8,7 | 8,6 | « même film, mieux minuté, pas plus chargé » ; adresse courte, citation |
| Orthographe / français | 9,5 | 9 | aucune faute visible |
| AI slop detector | 8,6 | 8,5 | tics et recul réglés ; feuilles → cartes |

**Calibrage** : conforme ; aucune demande d'effet. Moyenne ≈ 9.

### Modifications v10 → v11 (finitions seulement, rien d'ajouté)
- **Feuilles → cartes** : même empilement que les feuilles au déclic, puis chaque carte posée passe au-dessus des
  feuilles encore en vol ; toute l'encre des feuilles s'éteint avant ~17,1 s ; cascade resserrée.
- **Logo de fin** : 6 → 3 barres presque en coupe franche ; le carré naît une fois les lignes en place ; passage
  vert → papier en 0,3 s.
- **App** : aucune grille fantôme sous le nom en transit ; le titre entre après le passage du nom ; une image vide
  de moins entre la grille et la fiche ; la carte de la flashcard s'efface avant la boîte.
- **Fin** : le déclic final arrive 0,3 s plus tard (l'adresse se lit ~2,3 s), le Polaroid tient toujours ~3,4 s.
- **Textes** : espaces fines insécables dans les notes du bureau.
- **Son** : la baisse de gain vise enfin le pic « -lais à » (fenêtre avant « Arendt ») ; trois tics de cartes
  différents.

## v11

61,4 s. Sept évaluateurs, avec un verdict de livraison demandé à chacun.

| Domaine | Note v11 | (v10) | Livrable ? |
|---|---|---|---|
| Direction artistique | 9 | 9 | oui (« le film de la v1, en plus propre ») |
| Motion | 9,2 | 9 | oui |
| Son / musique / mix | 9,2 (mix 9,1) | 9,1 | oui (« -lais à » enfin réglé ; pauses dans de vrais silences) |
| Voix | 8 | 8,7 | **non** : la pause de « claire » tombait dans « l'au…teur » |
| Montage / storytelling | 8,8 | 8,7 | oui |
| Orthographe / français | 9,5 | 9,5 | oui |
| AI slop detector | 8,7 | 8,6 | oui |

**Vérification** : exact. La prise enchaîne « claire l'auteur » sans aucun silence ; la recherche élargie de la v11
avait pris l'occlusion du /t/ pour un silence.

### Modifications v11 → v12
- **Voix** : plus de pause après « claire » (la prise n'en a pas) ; une pause n'est plus insérée que dans un vrai
  silence d'au moins 40 ms, cherché de −200 ms à +120 ms autour de la fin du mot donnée par Whisper (qui finit
  parfois le mot après le silence) : « l'auteur », « HLP » et « réviser » tombent dans des silences de −59 à −92 dB.
- **Son** : creux de −3 dB sous « pour (relier) », qu'une note de piano masquait ; fondu de 50 ms sur la toute fin ;
  baisses de gain calées sur les pics, sur 200 ms. Le rapport de mixage indique désormais où le limiteur travaille le
  plus (2,2 dB au maximum, comme la v1, sur « à Arendt »).
- **Livrables** : les pistes FLAC gardent une marge commune (plus d'écrêtage) ; `exports/audio/LISEZMOI.txt`.
- Durée : 61,2 s.

## v12 — version livrée (`exports/cahier-hlp_trailer_4-3_1440x1080.mp4`, 61,2 s)

Les changements v11 → v12 ne touchent que le son : l'image est la même, simplement recalée sur la voix.
La voix et le son ont été réévalués. Les cinq autres domaines gardent leur note v11, déjà « livrable ».

| Domaine | Note v12 | (v11) | Livrable ? |
|---|---|---|---|
| Direction artistique | 9 (v11) | 9 | oui |
| Motion | 9,2 (v11) | 9,2 | oui |
| Son / musique / mix | 9 (mix 8,9) | 9,2 | oui, avec deux corrections (appliquées ci-dessous) |
| Voix | 8,8 | 8 | oui (« l'auteur », « HLP » et « réviser » coupés dans de vrais silences, WER 0) |
| Montage / storytelling | 8,8 (v11) | 8,8 | oui |
| Orthographe / français | 9,5 (v11) | 9,5 | oui |
| AI slop detector | 8,7 (v11) | 8,7 | oui |

Moyenne ≈ 9. **Calibrage** conforme du début à la fin : à partir de la v5, aucun évaluateur n'a demandé d'effet
en plus.

### Corrections appliquées après les relectures (avant les livrables)
- **« -lais à » (39,45 s)** : la baisse de gain visait un autre maximum. Il y en a maintenant deux, −2 dB sur le
  pic juste avant « Arendt » et −1,5 dB plus tôt. Le limiteur retire au plus **2,1 dB, à 16,0 s** (le déclic,
  sans voix) et plus rien de notable sous la voix.
- **Fin** : le mix est coupé à la durée de l'image **avant** le fondu de 50 ms. Le MP4 finit donc sur le fondu
  (−45 dB sur les 20 dernières ms) et non plus sur une coupe sèche.
- **Voix, pipeline** : chaque pause insérée est revérifiée. La suite de la coupe est retranscrite seule par
  Whisper et doit commencer par le mot attendu (« contrôle de coupe : OK »).
- Mesures finales : **−14,1 LUFS, crête vraie −1,23 dBTP**, voix 11,5 LU au-dessus de la musique, 53 bruitages,
  aucune batterie.

### Reste, non bloquant
- « claire : l'auteur » (24,2 s) s'enchaîne sans silence, et la prise n'en a pas. On pourrait régénérer V08 avec
  une vraie respiration, mais la phrase reste comprise (WER 0).
- **Sans écoute humaine, rien n'est garanti** : le timbre, le naturel des pauses et l'effet des 300 ms après
  « HLP » restent à juger à l'oreille avant diffusion.
