# Revue 4 : voix off (v7)

**Note : 8,7/10** (v6 : 8,5). Hook 8,5 · Problème 9 · Révélation 9 · Expérience 8,5 · Fin 8.

Méthode : mesures sur `processed/` et les stems (niveaux, silences, pyin, Whisper), comparées aux prises brutes. Je n'ai rien écouté.

## Vérifié
- **Hauteur intacte** : le meilleur recalage des histogrammes de F0 entre fichier monté et prise brute est de 0,0 demi-ton (0,1 pour V05b).
- **WER 0** (« DQCM » est un artefact).
- **Voix/fond** : +13 dB en médiane.
- **La question de V02 monte** de 12 demi-tons.

## Problèmes
1. **4,07-4,19 s : « Tu » est à −29 dB**, contre −18 pour la suite. C'est à peine au-dessus de la musique (−3 à +5 dB) et c'est inchangé depuis la v6. *Correction* : +7 dB sur 0,07-0,21 s de V02, fondus de 15 ms.
2. **52,43-54,24 s : la phrase finale reste la plus rapide** (5,5 syll/s, contre 4,6 pour V08 et V12). C'est inchangé. *Correction* : passer ce segment seul à 0,90, sans toucher la hauteur, et allonger la pause après « réviser » de 0,15 à 0,25 s.
3. **24,28 s : la pause après « claire : » ne dure que 0,14 s**, contre 0,28 et 0,34 s entre les éléments de l'énumération. La hiérarchie des pauses est donc inversée. *Correction* : `pauses: [["claire", 0.3]]`.
4. **47,75-48,56 s : « pour toute la classe » reste 5 à 6 dB sous « Pensé en TG1 ».** C'est toute la fin de phrase qui retombe, pas seulement « classe ». *Correction* : +2,5 dB sur 1,53-2,34 s de V13.
5. **« Rousseau » dépasse les autres noms d'environ 2 dB** (mineur). *Correction* : `part_gain` +0,5 au lieu de +1,5.

## Depuis la v6
- **Réglé** : « Arendt » est remonté à −20/−22 dB (il était à −29 ; la réplique est à −18). Il n'y a pas de saut de gain.
- **Réglé** : l'écart entre « rassemblé » et « dans » passe de 0,86 à 0,71 s.
- **Partiel** : « classe » et la pause après « claire ».
- **Persiste** : « Tu » et la fin rapide.

## Invérifiable sans écoute
- Le naturel.
- Les artefacts d'étirement (V02 à 0,88).
- Le [t] final d'« Arendt », sous la musique.
- La descente de « Mais où ? », naturelle pour une question en « où ».

## À garder
- La voix B sans retouche.
- La grille des noms.
- La montée de V02.
- Le calme de V08.
- La suspension « rassemblé… dans ».
