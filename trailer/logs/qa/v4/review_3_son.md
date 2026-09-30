# Évaluation n°3 : son, musique, mixage (v4)

**Note : 7,5/10** (mix : 8/10). Hook 8 · problème 6,5 · révélation 8 · fonctions 7,5 · communauté 6,5 · fin 7.

Sans écoute : chiffres mesurés sur les stems et dans le code. Le timbre et le pompage perçu restent invérifiables, comme l'effet de la basse syncopée sans grosse caisse.

## Ce qui marche
- C'est la bande-son de la v1 : les mêmes 62 bruitages aux mêmes gains, et la batterie est exclue du mix (vérifié). Rien n'a été ajouté.
- La voix reste devant : entre 1 et 4 kHz, elle dépasse la musique d'au moins 11,7 dB dans chaque section.
- -14,07 LUFS, -1,25 dBTP, aucune saturation.
- Le motif du hook revient sur « tout / réviser / au / même / endroit » : le plus beau détail du film.

## Problèmes et corrections
1. **39,24 s, sur « C'est gratuit » : une mesure en trop (défaut nouveau).** La timeline plus courte laisse une dernière mesure de groove de 0,27 s. Son accord et sa basse sont suivis 0,26 s plus tard par l'accord de la « respiration » : double attaque. La mélodie et le clavier continuent ensuite jusqu'à 41,3 s. C'est le pic de toute la partition (-2 dBFS), sur l'attaque de la voix. *Correction :* faire commencer la respiration sur la barre de mesure (environ 39,23 s) et arrêter mélodie et clavier à cet instant.
2. **6,1-10,8 s : bruitages sur les sibilantes (hérité de la v1, plus dense).** Ce passage compte 17 bruitages en 5,5 s (6,6 s en v1). Entre 4 et 10 kHz, ils ne sont que 6 à 8 dB sous la voix, contre 26 dB dans les fonctions. *Correction :* -3 dB et une coupe au-dessus de 5 kHz sur les glissés et marqueurs, marqueurs de 10,61 et 10,79 s décalés dans les silences, `paper_slide_6` (7,69 s) supprimé.
3. **30,41-30,82 s : quatre sons sur « au bon moment ».** Par rapport à la v1, le clic vers le QCM (30,67 s) passe désormais avant la carte qui tombe dans sa boîte. *Correction :* retirer le souffle de 30,75 s et baisser ce clic de 5 dB.
4. **La musique est 1 LU plus près de la voix qu'en v1** (écart de 10,5 LU contre 11,4), malgré le retrait de la batterie. Le volume de la partition est maintenant réglé sur le pic du point 1. *Correction :* baisser la musique de 1 dB (`MUSIC_GAIN` -3).
5. **Hook : noms inégaux.** Rousseau est à -19,8 dB et Hugo à -13,8 dB, soit 6 dB d'écart. « Rabelais » subit 4,3 dB de limitation. *Correction :* gain par prise (Rousseau +2, Hugo -2, attaque de « Rabelais » -3), sans toucher à la hauteur.
6. **13,22 s :** l'autofocus crête au niveau de la voix sur « mais ». *Correction :* le placer après « où » ou le baisser de 4 dB.
7. **52,4-55 s :** le crayon (-25 dB) couvre la musique (-38 dB), et la fin se termine sur un grattement. *Correction :* crayon -4 dB, dernières notes (54,4 s) +3 dB.

## Comparaison avec la v1
La v4 correspond à la demande (sans batterie, bruitages de la v1, voix B intacte), donc au goût du commanditaire au moins autant que la v1. Mais la timeline 10 % plus courte a créé deux défauts nouveaux (points 1 et 3) et resserré le passage le plus chargé (point 2). Une fois ces retouches faites, toutes invisibles, le son pourrait viser 8,5 à 9.
