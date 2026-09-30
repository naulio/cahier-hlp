# Revue 4 : voix off (v5)

**Note : 7,5/10** (cible ≥ 9). Hook (V01-V02) 8,5 · Problème (V03-V05b) 8,5 · Révélation (V06-V07) 7 · Expérience (V08-V11) 7 · Fin (V12-V14) 8.

Méthode : j'ai mesuré les fichiers `processed/` placés dans la timeline (enveloppes, silences, pyin, Whisper medium avec les mots horodatés). Je n'ai rien écouté. `voice_metrics.json` v5 porte encore sur les prises brutes : il est identique à la v4, sauf pour V07.

## Vérifié
- **La voix B est intacte** : l'écart de F0 entre prise brute et fichier traité va de 0,0 à ±0,25 demi-ton, ce qui reste dans le bruit de mesure de pyin. Aucun décalage de hauteur.
- WER de 0 partout. Niveaux très réguliers : le L90 va de −15,7 à −17,2 dB de V02 à V14.
- « Tu te souviens de tout ? » monte de +9,4 demi-tons. Les noms restent sur la grille.

## Problèmes
1. **38,86-39,38 s : la correction de V11 n'a pas été appliquée**, alors que QA_REPORT l'annonce. Le fichier fait toujours 4,403 s, et ses silences sont les mêmes qu'en v4 : 0,36 / 0,38 / **0,52 s**. On entend donc toujours « de Rabelais | à Arendt », et c'est la plus longue pause de la réplique. Cause probable : `cap_pause` se fie aux bornes de mots de Whisper, et Whisper étire « Rabelais » jusqu'à 39,34 s en englobant le silence. *Correction* : couper au niveau d'énergie. Repérer le silence sous −60 dBFS entre 3,0 et 3,7 s du fichier, le ramener à 0,15 s avec des fondus de 10 ms, puis recaler `v11_arendt` (−0,37 s) et l'arc. Garder la durée totale en passant V12 à `"+1.2"`. Ajouter aussi une assertion : si un plafond est demandé et que la durée ne change pas, le script échoue.
2. **18,29-18,75 s : « dans » est très faible.** Le mot sort à environ −45 dBFS, contre −18 pour « le Cahier d'HLP », soit ~25 dB de moins (probabilité Whisper 0,62). L'attaque n'est plus rognée, mais sous la musique on risque d'entendre « …rassemblé… le Cahier d'HLP ». *Correction* : vérifier à l'oreille. Si le mot est avalé, remonter 0,18-0,46 s de +10 dB (fondus de 20 ms). Si c'est un souffle, générer 6 prises et choisir celle dont le premier mot a une probabilité ≥ 0,85 et un niveau à moins de 8 dB du reste.
3. **15,98-16,94 s : il reste une pause de 0,48 s après « Alors ».** La virgule du `tts` n'a pas été retirée. Cela donne deux suspensions dans une phrase de 8 syllabes. *Correction* : retirer la virgule, puis régénérer ou plafonner cette pause à 0,2 s (au niveau d'énergie).
4. **52,00-53,68 s : « Tout pour réviser, au même endroit » est encore pressé.** Le débit est de 5,4 syll/s, contre ~4,7 pour V12. *Correction* : étirer à 0,94 ce seul segment (Rubber Band, formants préservés), soit +0,1 s.
5. **1,31 s : « Rabelais », premier mot du film, est le nom le plus faible.** Il est environ 3 dB sous « Rousseau » (pondération K approchée) et c'est le nom le moins sûr (0,75). *Correction* : à l'oreille, et si c'est confirmé, passer `part_gain[0]` de −2 à −0,5.
6. **13,57 s : « Mais où ? » descend toujours** (−5,6 demi-tons). C'est naturel pour une question partielle. Rien à faire, sauf si on l'entend comme plat.

## Changements depuis la v4
- **Réglé** : l'attaque de V07 est propre (0,20 s de silence, montée progressive). La suspension se place bien après « rassemblé » (~0,7 s). La pause après « HLP » est réelle (0,64 s jusqu'à « Tout »). La fin respire davantage (~2,1 s entre V13 et V14).
- **Persiste** : la coupure de V11, faussement annoncée comme corrigée ; le débit de la phrase finale ; la chute de « Mais où ? ».
- **Abîmé** : le « dans » faible, qui vient de la nouvelle prise.

## Invérifiable sans écoute
La netteté réelle de « dans », les artefacts de l'étirement sur V02 et V05b, les souffles, et le naturel de la pause après « Alors ».

## À garder
- La voix B sans changement de hauteur et la normalisation régulière.
- La grille des noms et la montée de V02.
- Les enchaînements serrés du « problème ».
- Le calme de V08.
- L'air ajouté à la fin.
