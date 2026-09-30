# Revue 4 : voix off (v9)

**Note : 8,9/10** (v8 : 8,6). Hook 8,8 · Problème 9 · Révélation 9 · Expérience 8,6 · Communauté 8,8 · Fin 9.

Méthode : mesures sur `processed/` et les stems (enveloppes à 10 ms, pyin, détection des silences). Je n'ai rien écouté.

## Vérifié
- **Hauteur intacte** : le recalage des histogrammes de F0 entre les prises brutes et les fichiers montés donne 0,0 demi-ton sur les 15 répliques. `VOICE_SHIFT_ST` vaut 0.
- **WER 0** : « DQCM » et « Pensez » sont des artefacts de Whisper.
- **Grille des noms** : attaques à 1,32, 1,99, 2,64 et 3,33 s, soit moins de 30 ms d'écart avec la grille.
- **Aucun saut d'échantillon suspect** dans le stem voix.

## Problèmes (tous mineurs)
1. **24,90-25,98 s : l'énumération de V08 est irrégulière.** Les pauses durent 0,12 s après « l'auteur », 0,21 s après « l'époque » et 0,28 s après « cinq points ». « l'auteur, l'époque » risque de se coller. *Correction* : `pauses: ["auteur", 0.08]`. L'insertion est désormais sûre.
2. **37,0-37,4 s : V11 tombe en trois blocs.** La virgule après « frise » dure 0,36 s, autant que la suspension après « œuvres… » (0,38 s), qui perd son relief. *Correction* : `cap_pauses ["frise", 0.22]`.
3. **1,32-1,73 s : « Rabelais » reste le nom le plus faible** en p90 : 1,2 dB sous « Hugo », 3,7 dB sous « Flaubert ». *Correction* : `part_gain` +1 pour Rabelais et −1 pour Flaubert.
4. **48,3-48,7 s : « classe » a la plus faible marge sur la musique** : 11 dB, contre 12 à 25 dB ailleurs. La finale est plate (−0,2 demi-ton). Le mot reste intelligible. À surveiller, sans rien ajouter.
5. **52,6-54,6 s : la phrase finale reste un peu plus rapide.** Elle est à 5,5 syllabes/s articulées, contre 5,1 pour V08 et 4,7 pour V12 ; l'écart est désormais faible. *Facultatif* : ×0,88 sur « Tout pour réviser… » seul.

## Depuis la v8
- **Réglé : la pause après « claire ».** Le silence est inséré 60 ms après la chute sous −55 dB, avec des bords à zéro : le mot n'est plus coupé et il n'y a plus de clic.
- **Réglé : « Tu » et « Arendt ».** « Tu » passe à +14 dB au-dessus de la musique et « Arendt » à +13 dB.
- **Réglé : la fin de V14.** La pause après « réviser » dure 0,29 s, et « au même endroit » passe de 0,65 à 0,76 s.
- **Partiel** : « Rabelais ».
- **Rien d'abîmé** n'a été détecté.

## Invérifiable sans écoute
- Le naturel.
- Les artefacts Rubber Band : V02 à ×0,88, V05b et V14 à ×0,90.
- « Mais où ? » finit 5,8 demi-tons plus bas : question rhétorique ou ton résigné ?
- La fin peu conclusive d'« appareil ».

## À garder
- La voix B telle quelle.
- La montée de « tout ? » (+9,7 demi-tons).
- La grille des noms.
- « rassemblé… dans » (environ 0,45 s).
- Les 0,40 s après « HLP ».
