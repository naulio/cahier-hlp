# Évaluation n°3 : son, musique, mixage (v6)

**Note : 8,6/10** (mix : 8,8/10). Hook 8,5 · problème 8,5 · révélation 8,5 · fonctions 8,5 · respiration 9 · fin 8,5.

Je n'ai pas pu écouter : tout vient des stems, des images et du code. Restent invérifiables : le timbre du piano, l'effet du piano inversé (musical ou « levée »), le naturel de l'attaque de « Rabelais ».

## Ce qui marche
- **Fidèle à la v1.** 59 bruitages (60 en v5, 62 en v1), aucun ajout. `DRUMLESS = True` : pas de batterie.
- **Voix devant.** Elle a 11,35 LU d'avance sur la musique (11,39 en v1). Entre 1 et 4 kHz, elle dépasse la musique d'au moins 14,6 dB dans chaque section. Mesures : -14,07 LUFS, -1,25 dBTP.
- **Synchro tenue malgré les décalages** (+0,35 à +0,55 s). Le déclic tombe sur sa marque (15,95/15,98). La respiration commence 40 ms avant « C'est ». Les notes du motif final suivent le ralenti de la dernière phrase, et le film finit toujours sur elles (58,55 s).
- **Corrections v5 réussies.** Les stylos (10,06-10,5 s) sont maintenant 8 dB **sous** la voix entre 4 et 10 kHz (9 dB au-dessus en v5). L'impact en double attaque a disparu. Au-dessus de 5 kHz, la montée descend à -53 dB. La levée avant la respiration est 25 dB sous la musique, soit presque inaudible.

## Problèmes et corrections
1. **5,47-6,77 s, souffle du recul, nouveau.** Il a été déplacé de 0,6 s. Son pic (-28,6 dB) tombe maintenant à 6,17 s, **en plein sur « À la rentrée »** (la voix commence à 6,07 s). Dans la v1, le pic arrivait 0,2 s avant la voix. Sous la voix, il n'est que 10,7 dB en dessous d'elle entre 1 et 4 kHz, plus fort que toute la musique à cet endroit. *Correction :* garder le départ, raccourcir à 0,9 s (fondu fini à 6,05 s) ou le baisser de 3 dB. Rien d'autre.
2. **1,43-1,46 s, « Rabelais ».** C'est toujours le plus gros travail du limiteur dans le film : 2,41 dB au maximum (2,62 en v5, 2,21 en v1). *Correction :* baisser de 1,5 dB les 60 premières ms du mot (gain seul, sans toucher la hauteur). Le limiteur retombera au niveau de la v1.
3. **57,7-58,8 s, crayon de la fin.** On l'a baissé de 4 dB, mais la musique ne dépasse pas -44 dBFS à cet endroit. Le crayon (-28 dB RMS) reste donc 16 dB au-dessus d'elle, et le son de la fin passe devant la musique (-23,6 contre -26,5 LUFS). Moins envahissant qu'en v1 (-14 dB), mais il sonne dans un presque-silence. *Correction :* encore -2 dB, avec une entrée en fondu de 0,3 s.
4. **33,81 / 33,85 s, clic du QCM et do aigu de « corrigés ».** Les deux attaques sont 40 ms l'une de l'autre, un écart qui risque de les faire entendre comme un « flam » (déjà présent en v5). *Correction :* poser le clic à ±10 ms du do (33,84 s) pour que les deux attaques se fondent.
5. **13,6-15,98 s, montée.** Le souffle est plus doux, mais le piano inversé reste la couche la plus forte avant le déclic (-19,4 dB dans le stem, -23,8 dB dans le bus musique à 15,75 s). C'est acceptable parce qu'il était déjà dans la v1. *Correction facultative, à décider à l'écoute :* -2 dB sur ses 0,5 dernières secondes.

## v5 → v6
- **Réglés :** les stylos, la double attaque, la brillance de la montée, la levée, le crayon (en partie).
- **Hook :** un peu mieux (-0,2 dB de limitation).
- **Abîmé :** le souffle du recul, qui tombe maintenant sur la voix (point 1).

## Par rapport à la v1
C'est la même partition sans batterie, avec les mêmes bruitages (un peu moins, un peu plus bas) et le même écart entre voix et musique. Il y a moins de défauts, sauf deux : la limitation sur « Rabelais » et le souffle du recul. Ce sont deux retouches de gain et de durée : faites, elles mettent la bande-son à 9.
