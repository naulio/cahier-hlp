# Évaluation n°7 : AI SLOP DETECTOR (v8)

## Note : 8,5/10 (légèrement mieux que la v7)
Hook 9 · Problème 8,5 · Solution 8 · Expérience 8,5 · Communauté 8 · Fin 9

La v8 reste fidèle à la v1 : 59 bruitages (62 en v1), sans batterie, sans flash ni secousse. La voix B est intacte (WER 0 sur les 14 répliques). La voix est à −12,7 LUFS et la musique à −24,1, soit 11,4 dB d'écart ; le limiteur agit de 1,9 dB au maximum. Rien n'a été ajouté.

## Symptômes
1. **16,8-17,6 s, passage des feuilles aux cartes (3ᵉ signalement).** Le flou est divisé par deux, mais :
   - les Polaroids tombent encore flous (17,08 s) ;
   - le fond passe toujours par l'olive (16,78-16,98 s) ;
   - à 17,38-17,5 s, des feuilles translucides couvrent encore Hugo, Péguy, Camus et Arendt.

   On voit un fondu enchaîné de calques. **Correction :** sortir les feuilles avant 17,2 s et passer du noir au crème en un seul fondu.
2. **50,2-50,6 s, formation du logo.** Six barres apparaissent, grises puis blanches, et le carré ne naît qu'à 50,52 s. À 50,62 s, les barres dépassent encore du carré à droite. On lit une icône « menu » pendant environ 0,3 s. **Correction :** passer directement des pupitres à trois lignes, placées d'emblée dans le carré.
3. **37,5-40,5 s, frise (5ᵉ signalement).** Chaque portrait est toujours du côté opposé à son nom, et Hugo reste collé à « Flaubert ». **Correction :** placer chaque portrait du même côté que son nom.
4. **41,5 s.** Entre la frise et « Gratuit. », l'image est entièrement olive et vide : on dirait une image perdue. **Correction :** raccourcir ce relais de 0,3 s.
5. **Téléphone.** « SANS PUBLICITÉ… » (43,2 s) et « LYCÉE NOTRE-DAME… » (49 s) restent illisibles. **Correction :** agrandir ces textes de 20 %.
6. **17,11-17,70 s.** Neuf tics en 0,6 s, un par carte : c'est le seul passage où le son fait « automatique ». **Correction :** n'en garder que trois.
7. **57,5 s.** Le recul vers le Polaroid final est nettement flou (vu sur une seule image). **Correction :** obturateur à 90°, comme pour l'envol des feuilles.

Sans écoute, un point reste invérifiable : « Tu te souviens de tout ? » a seulement reçu +5 dB sur « Tu ». La pause proposée avant « de tout » n'a pas été ajoutée.

## Ce qui est maîtrisé
- Hook : « Rabelais » est désormais entièrement visible (3,17 s, y compris sur téléphone).
- V10 : Whisper entend bien « Des QCM » (WER 0).
- Cartes : titres sur deux lignes, « Belle Époque » ; compteurs cohérents (4 → 3, 7 → 8, 12 → 11).
- Fin : carton net ; « TG1 — 2026-27 » reste lisible à 360 px.
- Aucune image générée ; les textes sont réels et le français est juste.

## Comparaison
- **v7 (8,5) :** le hook et V10 sont réglés. Les symptômes 1 et 2 sont seulement atténués. La frise, le texte sur téléphone et les tics n'ont pas changé. Rien n'a été abîmé.
- **v1 :** même sobriété. Corriger les points 1 à 3 permettrait d'atteindre 9.
