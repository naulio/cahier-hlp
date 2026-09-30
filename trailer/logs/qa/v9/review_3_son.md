# Évaluation n°3 : son, musique, mixage (v9)

**Note : 9,0/10** (mix : 8,9). Hook 8,9 · problème 8,8 · révélation 8,6 · fonctions 9,1 · communauté 8,8 · fin 9,0.

Rien n'a été écouté. J'ai recalculé le compresseur et le limiteur à partir des stems : l'écart avec le master est de -69 dB, pour un plafond de -1,5 dBFS.
Invérifiables : le timbre, les artefacts de l'étirement à 90 %, le raccord de la pause après « claire » (le fond ne tombe jamais sous -62 dB, donc pas de trou numérique).

## Ce qui marche
- **Fidèle à la v1** : 59 bruitages, les mêmes qu'en v8, seulement recalés sur les repères (-0,08 s, puis +0,1 s à la fin). Pas de batterie. Voix 11,44 LU au-dessus de la musique (11,39 en v1).
- **« Ta progression » réglé** : le limiteur passe de 1,88 à 0,74 dB.
- **« Tu »** : la voix a 17 dB d'avance entre 1 et 4 kHz (12 dB en v8).

## Problèmes et corrections
1. **1,43 s, premier « Rabelais » : le +1 dB a créé le pic de limitation du film.**
   - Le limiteur y retire 1,94 dB (1,10 en v8), sur une voix seule.
   - La crête vraie a aussi forcé le plafond de -1,3 à -1,5 dBFS. Chaque pic prend donc 0,2 dB : le déclic de 16,02 s passe de 1,73 à 1,92 dB.
   - *Correction :* garder le +1 dB, mais passer l'adoucissement des 150 premières ms de -2,5 à -3,5 dB.
2. **39,70 s : le correctif du « second Rabelais » vise le mauvais mot.** C'était mon erreur d'étiquette en v8.
   - Le vrai pic (1,59 dB) est sur « à A- », 0,5 s après.
   - Le -1,5 dB tombe sur « Rabelais » vers 39,0 s, où il ne sert à rien.
   - *Correction :* le chercher entre 39,55 et 39,80 s, ou le supprimer.
3. **39,85-40,45 s, creux sous « Arendt » : il arrive 170 ms trop tard.**
   - Le mot occupe 39,68-39,96 s, et il avait déjà 17 dB d'avance.
   - Le creux atténue surtout l'accord de piano de 39,97 s.
   - À sa fin, il s'ajoute au relâchement du ducking : la musique remonte d'environ 8 dB entre 40,0 et 40,7 s.
   - *Correction :* le placer sur 39,64-39,96 s, ou le retirer.
4. **4,22-4,25 s, fin du creux sous « Tu » : l'accord tenu remonte de 4 dB en 30 ms.** Cela tombe dans le blanc entre « Tu » et « te ». *Correction :* un retour de 150 ms, fini vers 4,40 s, sous « souviens ».
5. **48,44-48,62 s, fin de « classe » : la voix n'a aucune avance entre 1 et 4 kHz.**
   - La voyelle, elle, a 7,5 à 10 dB d'avance.
   - Le -3 dB sur le ré6 et le fa6 n'a rien changé de mesurable.
   - *Ne plus toucher* à l'arpège.

## v8 → v9
- **Réglés** : « Ta » et « Tu ».
- **Manqués** : les points 2 et 3 ci-dessus, ainsi que « classe ».
- **Abîmé** : le premier « Rabelais », et un plafond abaissé de 0,2 dB.
- Rien de tout cela n'est probablement audible.

## Par rapport à la v1
- Même partition sans batterie, bruitages au plus au niveau de la v1, même équilibre.
- Limitation maximale plus basse : 1,94 contre 2,21 dB.

En corrigeant les points 1 à 3, cette bande-son vaut 9,2.
