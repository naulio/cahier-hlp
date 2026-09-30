# Évaluation n°3 : son, musique, mixage (v12)

**Note : 9,0/10** (mix : 8,9). **Livrable : oui.**

Rien n'a été écouté. J'ai recalculé le limiteur à partir des stems : l'écart avec le master est de −77 dB. Invérifiables : le timbre, le naturel des pauses, et si les deux défauts ci-dessous s'entendent vraiment.

## Ce qui marche
- **Toujours fidèle à la v1.** Pas de batterie, 53 bruitages. La voix est 11,5 LU au-dessus de la musique. −14,08 LUFS, −1,23 dBTP.
- **« pour (relier) », 37,12-37,32 s : mieux.** Entre 1 et 4 kHz, la voix a désormais environ +5 dB d'avance sur la musique, contre 0 ± 3 dB en v11.
- **Pauses.** « auteur », « HLP » et « réviser » tombent dans le silence (sous −50 dB), sans clic.

## Problèmes
1. **39,45 s, « -lais à » : régression.** Le limiteur retire 2,2 dB à la voix, contre 0,7 dB en v11. La baisse de −1,5 dB vise un autre maximum, et la vraie crête lui échappe. En plus, le plafond est descendu à −1,7 dBFS. C'est probablement inaudible (la v1 avait aussi 2,2 dB).
   *Correction :* `("v11_arendt", -2.0, -0.15, 0.0)`.
2. **61,17 s : le fondu est perdu.** L'audio dure 61,49 s mais le MP4 61,17 s (`-shortest`). Le son est donc coupé net à −51 dBFS.
   *Correction :* couper le mix à `TL["duration"]` avant d'appliquer le fondu de 50 ms.

## v11 → v12
« pour » est amélioré. La fin n'est pas réglée. « -lais à » est abîmé.
