# Évaluation n°3 : son, musique, mixage (v7)

**Note : 8,7/10** (mix : 8,6). Hook 8,2 · problème 8,8 · révélation 8,5 · fonctions 8,8 · communauté 8,5 · fin 8,8.

Rien n'a été écouté : tout est mesuré sur les stems et le code. Invérifiables : timbre du piano, transparence du limiteur, piano inversé.

## Ce qui marche
- **Fidèle à la v1** : 59 bruitages (62 en v1), aucun ajout, pas de batterie.
- **Voix devant** : 11,46 LU d'avance sur la musique (11,39 en v1). Master à -14,01 LUFS et -1,21 dBTP.
- **Trois corrections réussies** :
  - le clic du QCM et le do aigu tombent ensemble à 33,81 s ;
  - le souffle du recul perd 3,6 dB à son pic ;
  - le crayon final passe sous la musique (environ -47 contre -37 dBFS).
- Le retournement de carte tombe dans le blanc entre « flashcards » et « qui ». La fin décroît sans coupure.

## Problèmes et corrections
1. **1,40-1,46 s, « Rabelais » : le correctif a manqué le pic, et c'est pire qu'en v6.** Le limiteur réduit de 2,85 dB (2,41 en v6). Le -4 dB porte sur les 60 premières ms, déjà faibles (-15 dBFS). Le pic est à 121 ms (1,428 s) : là, il ne retire que 1 dB environ. *Correction :* -2,5 dB de 0 à 150 ms, puis retour à 0 dB à 220 ms.
2. **Le limiteur travaille davantage sur la voix.** Au moins 2,65 dB à 41,8 s (« gratuit ») et 2,55 dB à 43,4 s (« progression ») ; en v6, rien ne dépassait 2,41 dB. *Correction :* -2 dB sur les 100 premières ms de ces attaques.
3. **47,99-48,51 s, l'arpège de la classe tombe sur « classe ».** Entre 1 et 4 kHz, la voix n'a que 3,5 dB d'avance : c'est pour cela qu'il a fallu relever le mot. *Correction :* -3 dB sur les notes jouées avant 48,5 s, sans les déplacer.
4. **56,8-58,8 s, éjection du Polaroid (inchangée depuis la v6).** Ce qui dominait la fin était l'éjection, pas le crayon : 2 s sur tout le spectre, 8 à 9 dB au-dessus de la musique. *Correction :* après 57,4 s, -3 dB et coupe-haut à 6 kHz.
5. **33,75-33,95 s, do et fa aigus sur « corrigés ».** Entre 1 et 4 kHz, ces notes restent à 1-7 dB seulement sous la voix. *Correction :* -2 dB sur ces deux notes.
6. **Stems voix écrêtés** (PCM 24 bits au-delà de 0 dBFS ; master intact). *Correction :* les écrire en flottant.

## v6 → v7
- **Réglés** : le flam du QCM, le souffle, le crayon.
- **Abîmé** : la limitation (points 1 et 2).

## Par rapport à la v1
Même partition sans batterie. Les bruitages sont un peu moins nombreux et plus bas, et l'équilibre voix-musique est le même. La v7 est plus propre que la v1 partout, sauf sur la limitation (2,85 contre 2,21 dB). Avec les retouches de gain 1 à 3, la bande-son vaut 9.
