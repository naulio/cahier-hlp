# v5 : évaluation n°2, motion design

**Note : 7,5/10** (v4 : 7). Le motion reste celui de la v1, sans rien de voyant en plus : c'est le bon cap. Plusieurs finitions ont réussi : le logo ne laisse plus de traînée, l'image noire a disparu, la question du QCM est là dès l'arrivée. Mais les deux micro-défauts les plus visibles, le déclic et la capture finale, clignotent encore sur deux images.

| Hook | Problème | Solution | Expérience | Communauté | Fin |
|---|---|---|---|---|---|
| 8 | 6,5 | 7,5 | 7 | 8,5 | 7 |

## Problèmes (du plus grave au moins grave)

1. **15,63-15,73 s, déclic.** À 15,63 s, seuls certains calques s'assombrissent : les Polaroid et les post-it deviennent gris, deux petites fiches disparaissent, alors que les grandes feuilles restent claires. À 15,73 s, le fond noir devient gris moyen. On voit un glitch, puis un voile. *Correction* : un seul calque noir à 35-40 % posé **au-dessus de tout**, sur 2 images, puis retour direct à la normale, sans remontée des noirs.
2. **56,10-56,40 s, capture.** L'image noire est bien devenue un assombrissement, mais elle est suivie à 56,20 s d'un voile blanc (logo et adresse délavés) : c'est un petit flash. À 56,30-56,40 s, les textes sont dédoublés, le cadre du Polaroid a un contour fantôme et les bords sont flous. *Correction* : supprimer l'image voilée et ramener `S.blur` (`end.js`) à 1-2 px, sur 0,3 s au plus.
3. **30,93-31,45 s, flashcard.** La réponse « Vers 4 heures du matin » n'est lisible que 0,25 s (30,80-31,03). La carte vole ensuite en bloc sombre flou, puis reste posée sur la boîte 3 et masque le « 7 ». *Correction* : laisser le texte sur la carte pendant qu'elle rétrécit, garder la réponse 0,8 s, ne pas flouter la carte, la réduire à zéro dans la boîte et faire passer le compteur de 7 à 8.
4. **23,73-23,83 s, grille → fiche.** Le zoom saute d'environ 25 % en 3 images. *Correction* : un ease-in-out de 0,6 s, lancé une fois la fiche affichée.
5. **Creux vides entre les écrans de l'app** : 23,53-23,73 s et 28,90-29,10 s. Le fondu enchaîné a disparu, mais le panneau passe par un vide. *Correction* : faire entrer le nouveau contenu 0,1 s avant la fin de la sortie.
6. **26,5-27,6 s.** Le recadrage coupe encore les libellés de la barre latérale (« ccueil », « extes »). *Correction* : arrêter le pan horizontal 60 px plus tôt.
7. **18,3-18,9 s.** « Cahier d'HLP » s'écrit pendant « dans le » : le nom est complet 0,3 s avant que la voix dise « Cahier » (19,17 s). *Correction* : décaler l'écriture de +0,5 s.
8. **Détails.** De 16,6 à 16,9 s, les Polaroid s'envolent flous en bas du cadre (hérité de la v1) : les éteindre 0,1 s plus tôt. De 20,44 à 20,84 s, la fenêtre de l'app arrive encore vide. À 39,5 s, l'arc frôle le haut du Polaroid de Hugo : le monter de 15 px.

## Ce qui marche
- Le hook : la chute des Polaroid, le développement de la photo, et « *tout* » à 5,02 s.
- La sortie du logo vers l'app, sans filé ni copie. Le reflet ne se voit pas.
- La sélection du QCM sur « corrigés » (33,50 s) et les réponses qui entrent en cascade.
- L'arc de la frise, qui part de Rabelais et ne croise plus aucun nom.
- « Gratuit. » (41,4 s) et « Sans compte. » (42,1 s), révélés par des masques justes.
- La chaîne place → vague → barres → icône (47,4-50,5 s), qui reste la meilleure idée du film, et le nom qui arrive sur « Cahier » (50,46 s).

## Comparaison
- **Réglé depuis la v4** : la traînée du logo (n°2), l'image noire de la capture (moitié du n°3), le QCM vide (n°7), l'essentiel du vide de la frise (n°7), le fondu en double exposition (n°5).
- **Persiste** : le déclic (n°1, seulement transformé), le flou et le fantôme de la capture, le bloc de la flashcard (n°6), le cadrage de la fiche (n°4, atténué) et le moiré des Polaroid (n°8).
- **Abîmé par les corrections** : un flash blanc d'une image à 56,20 s, des creux vides à la place des fondus, et la réponse de la flashcard, devenue plus brève à lire.
- **Par rapport à la v1** : même mouvement et même retenue, avec des finitions en plus. La v5 est légèrement plus propre que la v1, mais les deux clignotements hérités de la v1 sont toujours là. Corriger les n°1 à 3 suffirait pour viser 8,5.
