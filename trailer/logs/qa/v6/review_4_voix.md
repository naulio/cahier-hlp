# Revue 4 : voix off (v6)

**Note : 8,5/10** (v5 : 7,5). Hook 8,5 · Problème 8,5 · Révélation 8 · Expérience 8,5 · Fin 8.

Méthode : mesures sur les 15 fichiers `processed/` (énergie, pyin/yin, Whisper medium) et alignement DTW de chaque fichier sur sa prise brute. Je n'ai rien écouté.

## Vérifié
- **Aucun décalage de hauteur.** Après alignement, l'écart de F0 est de 0,00 demi-ton en médiane sur les 15 fichiers. Les écarts de la clé `processed` (V06 +1,36) sont du bruit de pyin.
- WER de 0 et niveaux réguliers.

## Problèmes
1. **39,75-40,12 s : « Arendt » retombe à −29 dB**, contre −20,5 pour le reste de la réplique. Les autres fins de phrase perdent 2 à 5 dB. *Correction* : si l'oreille le confirme, remonter de +4 dB les secondes 3,50-3,92 de V11, avec des fondus de 20 ms.
2. **48,13-48,54 s : « la classe » s'éteint** (−10 dB), alors que c'est le mot-clé. *Correction* : +5 dB entre 1,92 et 2,33 s de V13, ou une autre prise.
3. **52,49-54,25 s : la phrase finale est un peu rapide** (≈5,1 syll/s, contre 4,7 pour V12). *Correction* : 0,93 sur ce seul segment.
4. **24,39 s : aucune pause après « claire : »**. *Correction* : `pauses: [["claire", 0.15]]`.
5. **4,07 s : « Tu » est faible (−34 dB).** À vérifier à l'oreille.

## Depuis la v5
- **Réglé** : l'écart « Rabelais | à » passe à 0,15 s. « Alors » fait 0,27 s. « Rabelais » est au niveau de « Hugo ».
- **« dans » était une fausse alerte** : c'est une inspiration.
- **Persiste** : la fin est un peu rapide et « Mais où ? » descend.
- **À surveiller** : il y a 0,9 s entre « rassemblé » et « dans » ; on peut retirer 0,15 s en tête de V07.

## Invérifiable sans écoute
Le naturel, les artefacts d'étirement et le masquage par la musique.

## À garder
La voix B telle quelle, la grille des noms, la montée de V02, le calme de V08, la nouvelle coupe de V11.
