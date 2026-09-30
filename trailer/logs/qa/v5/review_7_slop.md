# Évaluation n°7 : AI SLOP DETECTOR (v5)

## Note : 8/10
Hook 8,5 · Problème 8,5 · Solution 7,5 · Expérience 7,5 · Communauté 8 · Fin 8

C'est la v1 en plus propre : 60 bruitages (62 dans la v1), aucun flash, secousse ni filé, et le même écart voix/musique que la v1 (11,4 dB). Il reste des tells minuscules, mais trois d'entre eux trahissent encore un rendu scripté.

## Symptômes

1. **41,0-42,2 s : un pixel blanc persiste sous « Gratuit. »** en x 176, y 539 (luminance 226 sur un fond à 61, f_041.960). Déjà signalé en v4. **Correction :** trouver l'élément qui le dessine et le supprimer.
2. **31,03-31,23 s : la carte devient une dalle vierge.** En filant vers la boîte 3, elle perd « Vers 4 heures du matin » et devient un rectangle vert très flou : c'est la doublure `flash.mini` (f_031.030). Autre incohérence : la boîte 3 passe de 7 à 8 sans qu'aucune boîte ne diminue (`app.js:319`). **Correction :** garder le texte sur la miniature, réduire le flou de moitié et faire passer la boîte 2 de 4 à 3.
3. **33,30-33,45 s : clic de robot.** La 4ᵉ option apparaît à 33,3 s et « Une métaphore » est cliquée 0,1 s plus tard, alors que le curseur la survolait déjà. **Correction :** placer le clic au moins 0,5 s après la dernière option.
4. **36,5-40 s : la frise mêle les portraits.** Hugo est collé à droite de l'étiquette « Flaubert », et Flaubert est sous « Balzac/Hugo » (f_037.500). Déjà signalé en v4. **Correction :** poser chaque portrait du même côté que son nom.
5. **43,5-45,5 s : compteur qui défile de 1 % à 52 %** (f_043.500). C'est un réflexe de gabarit. **Correction :** afficher 52 % d'emblée et laisser seulement l'anneau se remplir.
6. **20,44-20,74 s : la barre latérale est tronquée.** « nsmission » et « REVOIR » apparaissent coupés dans un panneau encore vide (f_020.540). **Correction :** faire apparaître la barre latérale par un fondu sur place, sans glissement sous le masque.
7. **49,7-50,9 s : le logo passe par une étape boueuse.** Les barres grises évoquent un écran de chargement, le texte noir sur olive manque de contraste (f_050.520) et le fond traverse un gris sale (f_050.820). **Correction :** passer le fond au crème avant que le texte n'apparaisse ; réduire l'état « barres » à 0,2 s.

## Voix (d'après les données, sans écoute)
- WER nul, aucun décalage de hauteur. « dans le Cahier d'HLP » passe de 0,80 à 0,91 de confiance.
- **« Tu te souviens de tout ? » est la prise de la v4** : 1,16 s, 375 mots/min. On a allongé l'écran, pas la réplique, et la question reste pressée. **Correction :** choisir une prise de la voix B d'environ 1,6 s, sans toucher à la hauteur.
- « QCM » est le mot le moins sûr (0,81) : à réécouter.

## Ce qui est maîtrisé
- Le clic tombe bien sur « Je savais », la traînée du curseur a disparu, et le passage fiche → flashcards (28,8-29,1 s) se fait par une sortie puis une entrée, barre latérale fixe. Le logo glisse net, et l'arc rouge ne croise plus rien.
- Polaroids qui se développent, texte réel et lisible, typographie française juste, capture manuscrite finale : rien de généré, aucune image IA.

## Comparaison
- **v4 (7,5) :** les symptômes 1, 2, 4 et 5 sont réglés, le 3 est atténué ; le 7 et le 8 persistent. En retirant les flous ailleurs, la correction a fait ressortir la dalle floue de 31 s.
- **v1 :** la v5 est aussi sobre et plus propre ; elle la dépasse légèrement. Corriger les symptômes 1 à 5, qui sont des retouches invisibles, mène à 8,5-9.
