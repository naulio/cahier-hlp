# Évaluateur 2 : motion design et VFX (v3)

**Note : 6,5/10** (v1 : 6). Hook 7 · Problème 6 · Révélation 7,5 · Expérience 6,5 · Communauté 5 · Fin 7,5.

La v3 garde le squelette et le style net de la v1, en plus court (56,5 s). Elle ajoute 46 effets, mais surtout comme un calque global posé sur les scènes (voile, zoom, flou). Beaucoup sont invisibles ou ternes, et peu produisent un vrai « wow ».

## Problèmes (du plus grave au moins grave)

1. **38,7-39,7 s : trou d'énergie.** La frise s'assombrit en fondu, puis le cadre reste vide 0,6 s (fond olive, halo flou) avant « Gratuit. ». Toute la section 39,5-47,8 s est molle (batterie coupée, texte, téléphone, jauge). → Cut sec sur le temps à 38,9 s. Faire claquer « Gratuit. » (39,72 s) puis « Sans compte. » (40,46 s) : apparition par masque, échelle 1,15→1 en 0,15 s, punch 5 %, secousse 8 px. Faire entrer le téléphone en filé depuis la droite, avec parallaxe. Garder un kick sur les temps 1 et 3.
2. **Filés à 19,62, 28,1, 30,8 et 33,9 s : du flou, pas un mouvement.** Un glissement de 40 px avec un flou de 38 px donne une traînée sur place. De 33,94 à 34,24 s, on voit 4 images de crème vide. → Faire de vrais whip-pans : la scène sortante part de −900 px en 0,15 s, l'entrante arrive depuis +900 px, coupe au pic du flou, 0,25 s en tout. Pour la frise, zoomer à travers l'entrée « Frise » du menu.
3. **Flashs sur fond sombre : un brouillard gris.** Aux 4 flashs du hook (1,07 / 1,74 / 2,41 / 3,07 s), l'image se voile de gris. De 15,29 à 15,7 s, elle reste laiteuse, avec des franges RVB de 5 px (presque un glitch). De 48,15 à 48,5 s, le coup final grise tout le cadre et délave le logo. → Une image blanche pleine, puis une décroissance de 0,12 à 0,2 s en surexposition (luminosité 2→1 sur la scène). Séparation RVB ≤ 2 px. À 48,15 s, passer au fond crème sur l'image du pic.
4. **Reflets en boîte (18,5-19,3 s, 27,1 s, 49,0-49,6 s).** La barre lumineuse, dans un rectangle, déborde sur le fond : à 18,8 s, un rectangle pâle à bords durs entoure l'icône. Ça fait cheap. → Limiter le reflet aux lettres et à l'icône (`mask-image` du logo), avec une barre de 12 % inclinée à 20° et a ≈ 0,6.
5. **Problème (5,7-13,2 s) : caméra figée, impacts invisibles.** Les secousses font 1,6 px, les punchs du viseur 1,2 %. → Poussée continue 1,00→1,08 sur toute la séquence. Chaque feuille arrive en 0,18 s avec un léger dépassement, punch 2,5 % et secousse 4 px.
6. **22,6-23,2 s : de la carte à la fiche en fondu enchaîné.** C'est la transition la plus « PowerPoint » (image délavée à 22,83 s). → La carte Rousseau grandit jusqu'à devenir l'en-tête de la fiche (0,35 s, ease-out expo), et les autres cartes s'écartent en parallaxe.
7. **Temps morts.** De 28,4 à 28,95 s, la zone des flashcards est vide, puis la carte arrive en simple fondu. De 31,3 à 31,9 s, le QCM n'a pas encore de question. De 32,5 à 33,5 s, il reste figé. → À 28,6 s, la carte tombe (échelle 0,92→1, ombre). Sur « QCM » (31,85 s), la question s'écrit en typographie cinétique. Sur « expliqués » (33,23 s), l'explication glisse avec un punch de 2 %.
8. **Calage sur la musique.** Les temps forts sont calés sur la voix (bien). Mais plusieurs tombent à contretemps de la grille à 90 BPM (qui part de 20,62 s) : flip à 29,71 s (−0,25 s), clic du QCM à 32,21 s (+0,25 s), filé vers la frise à 34,23 s (+0,27 s), Rabelais à 36,79 s (+0,17 s). → Décaler les répliques V09-V11 de 0,1 à 0,25 s, ou poser un accent de percussion sur chaque temps fort.
9. **Frise (36,5-38,4 s) : plan fixe.** Le punch ne se voit pas, et l'arc passe sous les Polaroids de Rousseau et de Flaubert. → Un travelling qui suit l'arc (Polaroids en parallaxe ×1,15), l'arc au premier plan, un halo sur le nœud d'Arendt à 37,94 s.
10. **0,5-1,6 s : bord gauche.** Un bout de feuille crème dépasse en bas à gauche (x ≈ 0-25 px) sur le noir de l'ouverture. → Éloigner les feuilles en attente de 200 px, ou les masquer jusqu'à 5,5 s.

## Ce qui marche (à garder)
- Les Polaroids qui se développent et se posent pendant le hook.
- Le recul sur « tout ? », avec son halo.
- La mise au point du viseur, puis le déclic : les feuilles s'envolent et deviennent des cartes (15,3-17 s).
- Le logo qui s'écrit lettre à lettre.
- **Le flip 3D de la flashcard et sa chute dans la boîte, avec flou de mouvement (29,8-30,7 s)** : le meilleur moment.
- **Les places de la classe qui deviennent des barres, puis le logo (47,0-48,0 s)** : excellent raccord.
- Le titre qui sort d'un masque (48,1 s).
- La capture finale qui recule dans le Polaroid (52,5-53,5 s).

## Comparaison avec la v1
Mieux que la v1 : plus serré, sans l'aller-retour logo/cartes, avec plus de temps forts, dans le même style net. Mais les VFX restent un calque global au lieu d'être intégrés au mouvement des objets. Il manque encore des moments « wow » entre 20 et 48 s, et la communauté reste le point faible des deux versions.
