# Évaluation n°7 : AI SLOP DETECTOR (v6)

## Note : 8,5/10
Hook 8,5 · Problème 8,5 · Solution 8 · Expérience 8,5 · Communauté 9 · Fin 8,5

La v6 reste dans la ligne de la v1 : 59 bruitages (62 dans la v1), aucun flash, aucune secousse, aucune batterie, et le même écart voix/musique (11,4 dB). Les retouches sont bien invisibles. Quatre transitions trahissent encore un rendu scripté.

## Symptômes
1. **50,3-50,65 s : six barres blanches seules sur l'olive.** Les rangées de places fusionnent en un empilement qui évoque une icône de menu ou un chargement (strip_16). Le carré n'apparaît qu'à 50,69 s. Ce défaut était annoncé comme corrigé, il persiste. **Correction :** fusionner directement en trois lignes et faire naître le carré dès 50,3 s, sous les lignes.
2. **16,7-17,4 s : filé et fond gris-olive.** En se dispersant, les feuilles prennent un fort flou directionnel qui étale l'écriture, au point qu'elle paraît générée. Le fond passe aussi par un kaki grisâtre (f_016.980). À 17,2-17,5 s, des feuilles vierges recouvrent encore les cartes « Péguy » et « Hugo ». **Correction :** diviser le flou par deux et passer du noir au crème sans palier gris. Les feuilles doivent être sorties avant l'arrivée de la 2ᵉ rangée de cartes.
3. **36,2-36,55 s : voile gris entre le QCM et la frise.** L'écran vire au gris sale, puis « Rabelais » et « Rousseau » flottent en fantômes (strip_12). C'est le même défaut que celui du logo, corrigé ailleurs. **Correction :** faire sortir le QCM vers le papier crème, sans voile sombre.
4. **37-40 s : les portraits sont opposés à leur nom.** Hugo est collé à droite de « Flaubert », et Flaubert se trouve sous « Balzac/Hugo ». La tige les relie, mais l'œil lit l'étiquette voisine. Déjà signalé en v4 et en v5. **Correction :** poser chaque portrait du même côté que son nom.
5. **Micro-légendes sur téléphone.** « SANS PUBLICITÉ · RIEN N'EST ENVOYÉ » et « LYCÉE NOTRE-DAME · TG1 · 2026-27 » font moins de 4 px de haut à 360 px de large. **Correction :** agrandir ces légendes de 20 % environ, sans rien changer d'autre.

## Voix (d'après les données, sans écoute)
- **V10 : une fois traitée, Whisper l'entend « DQCM corrigé » (WER 0,8)**, alors que la prise brute est parfaite. Le « Des » semble avalé par la chaîne de traitement, peut-être par l'attaque adoucie. De plus, les mots de V10 sont répartis à pas fixe dans timeline.json (0,533 s) : l'explication qui s'ouvre « sur expliqués » est donc calée sur une estimation. **Correction :** réécouter la réplique, raccourcir son fondu d'entrée et caler « expliqués » sur l'énergie du signal.
- **« Tu te souviens de tout ? » dure toujours 1,16 s** (316 mots/min une fois traitée), contre 2,0 s dans la v1. C'est le seul endroit où la voix sonne pressée. Signalé en v5, non traité.
- La hauteur est inchangée. Les autres répliques ont un WER nul.

## Ce qui est maîtrisé
- Plus de pixel sous « Gratuit. » : luminance maximale de 61 dans la zone, soit la valeur du fond (f_041.930).
- Les boîtes affichent 5-3-8-3-11, ce qui est cohérent. Le 52 % est affiché d'emblée, les réponses sont posées avant le clic et la barre latérale apparaît en fondu.
- Les polaroids se développent, la typographie française est juste, le texte est réel et lisible, et « TG1 — 2026-27 » est écrit à la main. Rien ne sent la banque d'images ni l'image générée par IA.

## Comparaison
- **v5 (8) :** les symptômes 1, 2, 3, 5 et 6 sont réglés. Le logo (7) est amélioré, sans passage par le gris, mais les barres restent. La frise (4) et la question pressée persistent. Régression possible sur « Des QCM ».
- **v1 :** la v6 est aussi sobre qu'elle et plus propre, donc la dépasse, sauf sur la question du hook, mieux posée dans la v1. Corriger les symptômes 1 à 3 et V10 mène à 9.
