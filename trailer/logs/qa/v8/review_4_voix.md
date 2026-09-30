# Revue 4 : voix off (v8)

**Note : 8,6/10** (v7 : 8,7). Hook 8,5 · Problème 9 · Révélation 9 · Expérience 8 · Communauté 9 · Fin 8,5.

Méthode : mesures sur `processed/` et les stems (enveloppes, silences, pyin, Whisper). Je n'ai rien écouté.

## Vérifié
- **Hauteur intacte** : le recalage des histogrammes de F0 donne 0,0 demi-ton sur les 15 répliques.
- **WER 0** : « DQCM » et « Pensez » sont des artefacts de Whisper.

## Problèmes
1. **24,27-24,59 s : la pause après « claire » coupe le mot.** Les 0,28 s de zéros sont insérées alors que « clai- » est encore voisé, à −18 dB. La fin sourde du [ʁ] (40 ms) ressort après le trou. Il n'y a aucun fondu : l'amplitude saute de 0,155 à 0, puis de 0 à 0,178, d'où deux clics probables. Le point d'insertion est le même qu'en v7 ; le trou est simplement passé de 0,15 à 0,28 s. *Correction* : dans `insert_pause`, insérer au minimum d'énergie du vrai silence (0,10 s) avant « l'auteur », ajouter 0,20 s et mettre des fondus de 10 ms.
2. **52,60-54,40 s : la phrase finale reste la plus rapide**, à environ 5,6 syllabes/s articulées, contre environ 4,3 pour V08 et V12. « au même endroit » tient en 0,65 s. Passer de 0,95 à 0,92 n'a ajouté que 0,08 s, et la pause après « réviser » est toujours de 0,18 s. *Correction* : passer ce segment seul à 0,88 et porter la pause après « réviser » à 0,28 s.
3. **4,03-4,19 s : « Tu » (+5 dB) n'est qu'à +6 dB au-dessus de la musique**, contre +18 pour « te souviens ». Une attaque musicale tombe dessus (−27 dB, contre −31 juste après). *Correction* : baisser la musique de 4 dB sur 3,95-4,25 s, avec des fondus de 30 ms, au lieu de remonter encore la voix.
4. **39,88-40,30 s : « Arendt » n'a que +5 dB sur la musique**, qui monte à −25 dB. *Correction* : baisser la musique de 3 dB sur 39,8-40,4 s.
5. **« Rabelais » est désormais le nom le plus faible**, de 2 à 3 dB (mineur). *Correction* : `part_gain` à 0.

## Depuis la v7
- **Réglé** : « pour toute la classe » n'est plus qu'à −2 dB de « Pensé en TG1 », une retombée naturelle.
- **Réglé** : « Rousseau » est au niveau de « Flaubert ».
- **Partiel** : « Tu » et la phrase finale.
- **Aggravé** : la pause après « claire » (point 1).

## Invérifiable sans écoute
- Le naturel.
- Les artefacts d'étirement (V02, V05b, V14).
- Les clics réellement audibles sous la musique.

## À garder
- La voix B sans retouche.
- La grille des noms.
- La montée de V02.
- Le calme de V08.
- « rassemblé… dans ».
- Le silence et le souffle avant « Tout pour réviser ».
