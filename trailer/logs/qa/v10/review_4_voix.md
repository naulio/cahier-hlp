# Revue 4 : voix off (v10)

**Note : 8,7/10** (v9 : 8,9). Hook 8,7 · Problème 9 · Révélation 9 · Expérience 8,3 · Communauté 8,8 · Fin 8,8.
Méthode : mesures sur les prises brutes, `processed/` et les stems (enveloppe à 10 ms, pyin, Whisper sur des extraits). Je n'ai rien écouté.

## Problèmes
1. **25,16-25,33 s : la pause après « l'auteur » est mal placée. C'est un défaut nouveau.** Le silence après « l'auteur » est resté à 0,12 s. Les 80 ms ont été ajoutées dans l'occlusion du /p/ de « l'époque », qui passe de 0,09 à 0,17 s.
   *Preuve* : Whisper entend « l'auteur » en entier sur la prise brute coupée à 3,42 s. Le son suivant commence par un /l/ (centroïde spectral de 450 Hz).
   *Risque* : on peut entendre « l'é…poque ».
   *Correction* : insérer la pause à la fin du mot donnée par Whisper (3,42 s), au point d'énergie minimale. Prendre un seuil relatif (p90 − 30 dB) au lieu de −55 dB absolus. Refuser l'insertion si le silence trouvé est à plus de 80 ms du mot.
2. **1,31-1,95 s : « Rabelais » reste le nom le plus faible.** Son p90 est à −13,1 dB, contre −10,6 à −11,5 dB pour les autres noms, et Whisper le reconnaît avec une confiance de 0,63, contre 0,95. L'attaque abaissée de 3,5 dB l'affaiblit encore.
   *Correction* : +1,5 dB sur le corps du mot à partir de 1,42 s. Limiter la baisse d'attaque aux 30 premières ms.
3. **54,28-54,62 s : « endroit », le dernier mot, a la plus faible marge du film.** Il n'est qu'à 9,9 dB au-dessus de la musique, et 6 dB sous « HLP ».
   *Correction* : +2 dB sur « même endroit », ou un creux de musique de 2 dB comme sous « Arendt ».
4. **13,6-14,2 s : « Mais où ? » (étiré à ×0,90) montre un possible artefact d'étirement.** pyin ne trouve que 53 trames voisées sur les 73 environ attendues, et la crête de hauteur passe de 153 à 140 Hz. Je ne peux pas le vérifier sans écoute. *Si c'est audible* : garder la prise à ×1,0.

## Depuis la v9
- **Réglé : V11.** La virgule après « frise » dure 0,22 s et « œuvres… » garde 0,39 s : la suspension retrouve son relief.
- **Réglé : « Flaubert » −1 dB.**
- **Non réglé, et abîmé : l'énumération de V08** (voir le point 1).
- **Inchangé** : « classe » à +11,5 dB au-dessus de la musique ; la fin à environ 5,5 syllabes/s.

## Vérifié
- **Hauteur intacte** : 0,0 à 0,1 demi-ton d'écart sur V01, V02, V06 et V14. V05b est identique à l'attaque.
- **WER 0.** « DQCM », « Pensez » et « toutes et » sont des homophones de Whisper. « Merci d'avoir regardé… » à 60 s est une hallucination sur un silence à −85 dB.

## À garder
La voix B telle quelle, la grille des noms, la montée de « tout ? », la pause de 0,27 s après « Alors » et les 0,40 s après « HLP ».

## Invérifiable sans écoute
Le naturel, les artefacts d'étirement et l'audibilité réelle du point 1.
