# v4 : évaluation n°2, motion design

**Note : 7/10.** La v4 reprend le motion de la v1 presque image pour image (mêmes transitions, décalées de −1,8 s) et n'ajoute rien de voyant. C'est le bon cap. En revanche, les petits défauts de mouvement déjà relevés en v1 n'ont pas été corrigés, alors que ce sont précisément les « minuscules détails » attendus. Avec les corrections ci-dessous, 8,5 est atteignable.

| Hook | Problème | Solution | Expérience | Communauté | Fin |
|---|---|---|---|---|---|
| 7,5 | 6,5 | 6,5 | 7 | 8 | 7 |

## Problèmes (du plus grave au moins grave)

1. **15,23-15,33 s, déclic** : pendant deux images, la composition change (les Polaroid des auteurs et plusieurs fiches disparaissent, l'image s'assombrit), puis deux images de voile gris. On lit un glitch suivi d'un flash. Le défaut était identique en v1 (16,99 s). La poussée de 1,2 % ajoutée à 15,25 s tombe pile dessus et ne se voit donc pas. *Correction* : garder la même composition pendant le déclic (vérifier la visibilité des calques dans `desk.js` entre `shutter` et `shutter`+0,07), remplacer voile et bascule par un seul assombrissement à 60 % sur deux images, sans gris.
2. **19,53-19,66 s, sortie du logo** : traînée horizontale sur cinq images, avec trois ou quatre copies du logo. On la lit comme un filé, au moins aussi visible que le « logo en double » de la v1. De 19,66 à 20,06 s, la fenêtre de l'app arrive vide. *Correction* : supprimer le flou de mouvement du logo et le déplacer vers la barre latérale avec un simple ease-in-out de 0,5 s ; faire apparaître la grille en même temps.
3. **52,47 s, capture** : une image entièrement noire, puis un fondu gris ; de 52,60 à 52,67 s, le bord du Polaroid est dédoublé et entouré d'un halo flou. C'est le même défaut qu'en v1 (58,47 s). *Correction* : remplacer le noir par un assombrissement à environ 40 % et ramener le flou de `end.js` (`S.blur` = 6 pendant 1,3 s) à 1-2.
4. **24,5-26,5 s, fiche Rousseau** : le zoom coupe le fil d'Ariane en haut et les libellés de la barre latérale à gauche. Déjà relevé en v1. *Correction* : limiter le zoom à environ 1,15 et garder 40 px de marge au-dessus du fil d'Ariane.
5. **Fondus entre écrans de l'app** : de 22,75 à 22,85 s, le fondu grille → fiche passe par un creux presque vide ; de 28,16 à 28,26 s, on voit une double exposition fiche/flashcards. *Correction* : ne fondre que le panneau principal (barre latérale fixe), l'image entrante démarrant 0,1 s avant la fin de la sortante.
6. **30,25-30,65 s, flashcard** : la carte vole floue, se pose sur la boîte 3 et reste en bloc sombre sur le « 7 ». Vers 30,45 s, le curseur laisse une traînée grise en diagonale. *Correction* : réduire la carte à zéro dans la boîte, le compteur passant de 7 à 8 ; curseur sans flou, avec un déplacement de 0,35 s.
7. **Écrans vides** : de 31,0 à 31,85 s, le QCM n'affiche que son en-tête alors que la voix dit « Des QCM » (31,25 s) ; de 34,06 à 34,30 s, la frise ne montre que les bandes de siècles. *Correction* : faire apparaître la question à 31,3 s et les premiers nœuds avec les bandes.
8. **16,33-16,53 s** : les Polaroid qui s'envolent en bas à droite, flous, produisent un moiré sur la gravure (hérité de la v1). *Correction* : les faire disparaître 0,1 s plus tôt.

## Ce qui marche (à garder)
- Retenue : les 4 détails de `fx_track.js` sont quasi invisibles (la poussée sur « tout » et les reflets sur le logo à 18,6 et 48,7 s se remarquent à peine). Aucune secousse, aucun filé ajouté, aucun flash volontaire.
- Synchronisation précise : « *tout* » à 5,02 s ; sélection du QCM à 32,32 s sur « corrigés » ; « Gratuit. » à 39,58 s et « Sans compte. » à 40,3 s ; les places s'allument sur « classe » (46,16 s) ; le nom apparaît sur « Cahier » (48,04 s).
- La chaîne téléphone → place → vague → barres → logo (44,5-48,5 s) est la meilleure idée de motion du film : fluide et motivée.
- Chute des Polaroid dans le hook, accumulation du bureau, retournement de la flashcard, carton final posé.

## Comparaison avec la v1
Le mouvement est le même : aucune surcharge façon v3, donc aucun recul de goût. Mais aucune des finitions de mouvement demandées aux évaluateurs de la v1 n'a été faite (déclic, image noire, logo fantôme, curseur, cadrage de la fiche, écrans vides). La sortie du logo reste au moins aussi marquée qu'en v1. La v4 égale donc la v1 sans encore la dépasser : les corrections 1 à 3 suffiraient à la rendre nettement plus propre.
