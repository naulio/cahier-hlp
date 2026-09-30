# Évaluation n°3 : son, musique, mixage (v10)

**Note : 9,1/10** (mix : 9,1). Hook 9,2 · problème 9,0 · solution 8,9 · expérience 9,0 · communauté 8,8 · fin 9,0.

Rien n'a été écouté. J'ai recalculé le compresseur et le limiteur à partir des stems : l'écart avec le master est de -97 dB.
Invérifiables : le timbre, le naturel des nouvelles pauses, la perception réelle des tics.

## Ce qui marche
- **Fidèle à la v1** : même partition sans batterie (il n'y a aucun stem de batterie), 53 bruitages (59 en v9, 62 en v1). La voix est 11,40 LU au-dessus de la musique (11,39 en v1).
- **Tics des cartes, 9 → 3** : c'est le sens du goût du commanditaire.
- **Premier « Rabelais » (1,43 s)** : le limiteur passe de 1,94 à 1,09 dB. Le plafond revient à -1,3 dBFS, donc le déclic de 16,02 s repasse à 1,72 dB.
- **« Tu »** : la musique remonte doucement, d'environ 2 dB entre 4,25 et 4,40 s.
- **« Arendt »** : le creux est enfin sur le mot, et l'accord de 40,0 s tombe dans le silence qui suit.

## Problèmes et corrections
1. **39,51 s, « -lais à » : le pic est manqué pour la troisième fois.**
   - La fenêtre de recherche couvre 39,54-39,89 s. Elle commence 30 ms après le pic.
   - Le -1,5 dB tombe donc à 39,74 s sur « Ar- », qui a déjà 12,5 dB d'avance et le creux de musique.
   - Le limiteur retire 1,71 dB, autant que le maximum du film.
   - *Correction :* chercher entre `M["v11_arendt"] - 0.30` et `- 0.12`, ou supprimer ce -1,5 dB.
2. **17,11-17,56 s, les trois tics jouent le même son.** Avec i = 0, 3 et 6, `i % 3 + 1` vaut toujours 1 : on entend trois fois `card_tick_1`.
   *Correction :* utiliser `card_tick_{k+1}` avec k = 0, 1, 2, sans monter le niveau.
3. **48,44-48,62 s, fin de « classe »** : 1,6 dB d'avance entre 1 et 4 kHz. C'est la sifflante, dont l'énergie est au-dessus de 4 kHz. Ne rien toucher.

## v9 → v10
- **Réglés** : le premier « Rabelais », le plafond, les creux sous « Tu » et sous « Arendt ».
- **Manqué** : le pic de « à A- ».
- **Abîmé** : rien de mesurable.

## Par rapport à la v1
Même musique et même équilibre, avec moins de bruitages et moins de limitation (1,72 dB contre 2,21). En corrigeant le point 1, cette bande-son vaut 9,2.
