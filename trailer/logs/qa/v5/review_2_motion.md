# v5 : évaluation n°2, motion design

**Note : 7,5/10** (v4 : 7). Le motion reste celui de la v1, sans ajout voyant. Plusieurs finitions ont réussi, mais le déclic et la capture finale clignotent encore sur deux images.

Notes par section : hook 8 · problème 6,5 · solution 7,5 · expérience 7 · communauté 8,5 · fin 7.

## Problèmes (du plus grave au moins grave)

1. **15,63-15,73 s, déclic.** Seuls certains calques s'assombrissent (Polaroid et post-it grisent, deux fiches disparaissent), puis le fond noir devient gris. On voit un glitch, puis un voile. *Correction* : un seul calque noir à 35 % au-dessus de tout, sur 2 images, puis retour direct à la normale.
2. **56,20-56,40 s, capture.** Après l'assombrissement : une image voilée de blanc (petit flash), puis textes dédoublés, contour fantôme du Polaroid, bords flous. *Correction* : supprimer l'image voilée et ramener `S.blur` (`end.js`) à 1-2 px, pendant 0,3 s au plus.
3. **30,80-31,45 s, flashcard.** La réponse n'est lisible que 0,25 s. La carte vole ensuite en bloc sombre flou et masque le « 7 » de la boîte 3. *Correction* : laisser la réponse 0,8 s, garder le texte sur la carte sans flou, la réduire à zéro dans la boîte et faire passer le compteur de 7 à 8.
4. **23,73-23,83 s.** Le zoom vers la fiche saute d'environ 25 % en 3 images. *Correction* : un ease-in-out de 0,6 s.
5. **23,53-23,73 s et 28,90-29,10 s.** Le panneau passe par un vide. *Correction* : faire entrer le contenu 0,1 s avant la fin de la sortie.
6. **26,5-27,6 s.** Les libellés de la barre latérale sont encore coupés (« ccueil »). *Correction* : arrêter le panoramique 60 px plus tôt.
7. **18,3-18,9 s.** « Cahier d'HLP » s'écrit pendant « dans le » et reste 0,3 s en avance sur « Cahier ». *Correction* : décaler l'écriture de +0,5 s.
8. **Détails.**
   - 16,6-16,9 s : les Polaroid s'envolent flous (hérité de la v1).
   - 20,44-20,84 s : la fenêtre de l'app arrive vide.
   - 39,5 s : l'arc frôle le Polaroid de Hugo. *Correction* : le monter de 15 px.

## Ce qui marche
- Le hook : la chute et le développement des Polaroid, et « *tout* » à 5,02 s.
- Le logo passe dans l'app sans filé ni copie ; le reflet est invisible.
- Le QCM est sélectionné sur « corrigés » (33,50 s).
- L'arc de la frise ne croise plus aucun nom.
- Les masques de « Gratuit. » et « Sans compte. ».
- La chaîne place → vague → barres → icône (47,4-50,5 s).

## Comparaison
- **Réglé depuis la v4** :
  - la traînée du logo ;
  - l'image noire de la capture ;
  - l'écran vide du QCM ;
  - l'écran vide de la frise (en grande partie) ;
  - la double exposition entre les écrans.
- **Persiste** :
  - le déclic (seulement transformé) ;
  - le fantôme de la capture ;
  - le bloc de la flashcard ;
  - le cadrage de la fiche (atténué) ;
  - les Polaroid flous.
- **Abîmé par les corrections** :
  - l'image voilée de blanc à 56,20 s ;
  - les creux vides, qui remplacent les fondus ;
  - la réponse de la flashcard, plus brève à lire.
- **Par rapport à la v1** : même mouvement et même retenue, en un peu plus propre. Les deux clignotements hérités de la v1 restent visibles. En corrigeant les n°1 à 3, on peut viser 8,5.
