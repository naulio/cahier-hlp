# Évaluation n°3 : son, musique, mixage (v8)

**Note : 9,0/10** (mix : 8,9). Hook 9,1 · problème 8,8 · révélation 8,6 · fonctions 9,1 · communauté 8,6 · fin 9,0.

Rien n'a été écouté. J'ai recalculé le compresseur et le limiteur à partir des stems : l'écart avec le master est de -80 dB, donc les réductions mesurées sont exactes.
Invérifiables : le timbre du piano, le son de l'éjection coupée au-dessus de 6 kHz, les artefacts de l'étirement à 92 %, le souffle du « Tu » relevé de 5 dB.

## Ce qui marche
- **Fidèle à la v1** : 59 bruitages (-31 LUFS), aucun ajout, pas de batterie (la piste n'est plus rendue).
- **Limiteur : 1,88 dB au maximum** (2,8 en v7, 2,21 en v1).
  - « Rabelais » : 2,85 → 1,10 dB.
  - « gratuit » ne fait plus travailler le limiteur.
- **Niveaux** :
  - voix 11,39 LU au-dessus de la musique, comme en v1 ;
  - master à -14,07 LUFS et -1,25 dBTP ;
  - stems en flottant, sans écrêtage.
- **« corrigés »** : la voix a 15 dB d'avance sur le mot, et le do tombe dans le blanc qui le précède.
- **« Tu »** : la voix a 12 dB d'avance sur la musique entre 1 et 4 kHz.

## Problèmes et corrections
1. **43,52-43,60 s, « Ta progression » : le correctif arrive 90 ms trop tard.**
   - Le pic du limiteur (1,88 dB, le maximum du film) est sur « Ta », à 43,56 s.
   - Le -2 dB ne commence qu'à 43,65 s : c'est l'erreur de « Rabelais » en v7.
   - *Correction :* chercher le pic réel de la voix entre -0,2 s et +0,15 s autour du repère, puis centrer -2 dB sur 120 ms à cet endroit.
2. **48,44-48,62 s, « classe » reste le mot le plus couvert.**
   - Entre 1 et 4 kHz, la voix n'a que 2,7 dB d'avance.
   - Le mot est 6 dB sous « toute la » (-20,9 contre -14,5 dBFS RMS).
   - Les six notes de l'arpège sonnent sur le mot ; le ré6 et le fa6 commencent dessus.
   - *Correction :* -3 dB sur le ré6 et le fa6 seulement, sans les déplacer.
3. **Pics du limiteur plus petits, tous sous la v1.**
   - 39,66 s, second « Rabelais » : 1,66 dB. *Correction :* -1,5 dB sur 100 ms.
   - 16,02 s, déclic : 1,73 dB, sans voix. Ne rien faire.
4. **57,4-58,6 s, éjection du Polaroid.**
   - Elle domine toujours la fin, environ 14 dB au-dessus d'une musique très basse.
   - Mais elle est maintenant 2 dB sous la v1 et coupée au-dessus de 6 kHz.
   - *Ne plus la baisser*, sinon le geste final devient terne.
5. **32,67 s, clic vers le QCM avancé de 0,2 s sans être consigné.** Il reste dans un blanc : sans dommage. *Correction :* le noter dans QA_REPORT.

## v7 → v8
- **Réglés** : points 1, 3, 4, 5 et 6.
- **Réglé à moitié** : le point 2 (réglé sur « gratuit », manqué sur « progression »).
- **Abîmé** : rien de mesurable.

## Par rapport à la v1
- Même partition sans batterie.
- Bruitages identiques ou plus bas.
- Même équilibre voix-musique.
- Limitation plus douce.

C'est la bande-son la plus propre de la série. Avec le point 1 corrigé, elle vaut 9,2.
