# v6 : évaluation n°2, motion design

**Note : 8/10** (v5 : 7,5). C'est le motion de la v1, sans effet ajouté. Les deux clignotements hérités de la v1, au déclic et à la capture, sont enfin propres. Il reste un creux gris, que la v6 a créé, et deux petites ruptures de continuité.

Notes par section : hook 8,5 · problème 7,5 · solution 8 · expérience 7,5 · communauté 8,5 · fin 8,5.

## Problèmes (du plus grave au moins grave)

1. **36,20-36,50 s, passage du QCM à la frise (défaut nouveau).** La fenêtre du QCM devient un rectangle gris. Le fond papier s'assombrit en gris pendant environ 0,3 s avant l'arrivée de la frise. L'image paraît sale et vide.
   *Correction* : ne faire varier que l'opacité de la fenêtre, sur un fond qui reste papier. Faire naître les colonnes de la frise dès 36,35 s.
2. **16,00 s, déclic.** L'assombrissement est maintenant uniforme. Mais entre 15,97 et 16,07 s, la disposition change : des feuilles apparaissent et recouvrent les post-it « citations à revoir » et « Arendt ?? p. 92 », ainsi que la carte « perfectibilité ». Le bureau d'avant et celui d'après ne correspondent pas.
   *Correction* : faire partir la scène suivante de l'état exact de la fin de l'accumulation (mêmes feuilles, même ordre d'empilement).
3. **31,62-31,92 s, flashcard.**
   - À 31,62 s, « Vers 4 heures du matin » est flou et dédoublé ; à 31,72 s, la carte n'est plus qu'un petit bloc gris flou.
   - La boîte 2 passe de 4 à 3 dès 31,62 s, mais la boîte 3 affiche encore 7 à 31,92 s.

   *Correction* : réduire la carte sans flou (échelle et opacité seulement). Faire passer le compteur de 7 à 8 sur l'image où la carte disparaît, vers 31,80 s.
4. **50,30-50,65 s, logo de fin.** Les lignes blanches restent seules sur le vert. Le carré n'apparaît qu'à 50,69 s : kaki sur kaki, il ne se voit pas.
   *Correction* : dès 50,3 s, un liseré clair de 1 à 2 px sur le carré, ou une teinte plus claire de 8 %.
5. **20,60-21,03 s, entrée de l'app.** La fenêtre reste presque vide pendant 0,4 s. La grille entre ensuite floue (fort flou à 21,03 s).
   *Correction* : faire entrer la grille 0,15 s plus tôt, en fondu seul, sans flou.
6. **Détails.**
   - 16,4-16,7 s : les feuilles s'envolent floues (hérité de la v1). Diviser le flou par deux.
   - 26,5-27,6 s : le logo de la barre latérale est coupé par le bord haut. Descendre le cadrage de 20 px.
   - 50,8-51,0 s : le fond passe encore par un kaki grisâtre. Acceptable.

## Ce qui marche
- Le déclic : une seule couche à 35 % sur deux images (16,00-16,03 s), sans voile ensuite. Le recul du viseur (15,70-15,90 s) est fluide.
- La capture (56,67-57,37 s) : l'assombrissement est net, sans image blanche. Le texte n'est pas dédoublé ; il reste un très léger flou à 57,10 s. Le Polaroid se pose proprement.
- La poussée vers la fiche (23,9-24,4 s) est douce et régulière. « Accueil » n'est plus coupé.
- « Cahier d'HLP » ne s'écrit plus sur « dans le ».
- La tenue sur « *tout* » dans le hook.
- Le morphing des places en lignes (49,6-50,4 s).
- Les masques de « Gratuit. » et « Sans compte. ».
- Le fondu au noir final.

## Comparaison
- **Réglé depuis la v5** :
  - le déclic en « glitch » suivi d'un voile ;
  - l'image blanche et le fantôme de la capture ;
  - le saut de zoom de la fiche ;
  - les creux entre les écrans de l'app (il en reste une image presque vide à 23,72 s, imperceptible) ;
  - la barre latérale coupée ;
  - l'écriture du logo en avance ;
  - l'arc qui frôlait Hugo.
- **Persiste, atténué** :
  - la carte floue de la flashcard ;
  - la rupture de disposition au déclic ;
  - la fenêtre vide à 20,6 s ;
  - les feuilles floues à 16,5 s.
- **Abîmé par les corrections** :
  - le creux gris entre le QCM et la frise ;
  - le décalage entre les compteurs 4→3 et 7→8.
- **Par rapport à la v1** : même vocabulaire, même retenue, plus propre partout. Rien n'est plus chargé que la v1. En corrigeant les n°1 à 3 (des retouches de quelques images), on peut viser 8,5-9.
