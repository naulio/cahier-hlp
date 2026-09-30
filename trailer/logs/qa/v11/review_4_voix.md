# Revue 4 : voix off (v11)

**Note : 8,0/10** (v10 : 8,7). Mesures sur `processed/` et les stems, avec Whisper sur les deux côtés de chaque coupe. Rien écouté.

## Problème bloquant
**24,32-24,61 s (V08) : la pause de « claire » coupe « l'auteur » en deux.** C'est une régression. Les 200 ms tombent à 3,06 s, dans l'occlusion du /t/ : il reste 0,29 s de silence entre « l'au » et « teur ».
*Preuves* : la tête coupée donne « claire l'autre », la queue commence par « 3. L'époque ». Le centroïde passe de 1,2 kHz (/o/) à 3,6 kHz (explosion du /t/).
La prise enchaîne « claire l'auteur » sans silence, donc la fenêtre de +120 ms a pris le suivant. On entendra probablement « l'au… teur ».
*Correction* : retirer `["claire", 0.2]` de `lines.json`. Dans `insert_pause`, refuser l'insertion si la tête ne finit pas par le mot visé ou si la queue ne commence pas par le mot suivant.

## Réglé
- La pause après « l'auteur » est dans le vrai silence (205 ms), et le /l/ de « l'époque » est intact.
- « endroit » est à 13,3 dB au-dessus de la musique (9,9 en v10).
- Dans V14, les pauses tombent dans de vrais silences.
- « Rabelais » n'est plus le nom le plus faible.

## À garder
La voix B sans décalage de hauteur, WER 0, la grille des noms, la suspension de V11.

## Invérifiable sans écoute
Si le trou s'entend vraiment, et « Mais où ? » étiré.

## Verdict
**Pas livrable en l'état.** Une ligne à corriger et un nouveau rendu, pour environ 8,8/10.
