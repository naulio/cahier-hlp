# v3 — Évaluateur 1 : direction artistique

**Note : 6,5/10.** Le style net de la v1 est bien revenu et les effets donnent de l'énergie. Mais l'identité (logo, communauté) garde les faiblesses de la v1, et plusieurs effets font « bon marché ». On n'est pas encore au niveau premium (cible ≥ 9).

| Hook 0-5,5 | Problème 5,5-16 | Solution 16-28 | Expérience 28-39 | Communauté 39-47,5 | Fin 47,5-56,5 |
|---|---|---|---|---|---|
| 7 | 7 | 6 | 6 | 4,5 | 6,5 |

## Problèmes (du plus grave au moins grave)

1. **39,3-47,5 s, communauté.** C'est le passage le plus « modèle de site ».
   - De 39,3 à 39,6 s, un fond kaki flou avec une tache brune : un temps mort au moment où ça devrait monter.
   - À 40,5 s, « Gratuit. » est collé à gauche, sans rien en face.
   - Ensuite, la mise en page ressemble à une page d'atterrissage : texte à gauche, iPhone à droite.
   - De 44,5 à 46,8 s, la grille de classe n'occupe qu'environ 25 % de l'image, et les places s'allument en vert-jaune acide.
   - **Correction :** attaquer « Gratuit. » sur le temps fort, en coupe franche : texte centré et énorme (≈ 200 px), punch d'échelle de 1,12 à 1, flash d'une image. Faire arriver « Sans compte. » par un filé. Recentrer le téléphone et lui donner de la parallaxe. Pour la classe : poussée de caméra depuis la place du téléphone, grille sur 70 % de l'image, places allumées en onde depuis le téléphone, en beige chaud ou orange brûlé avec un halo doux.

2. **18-20 s et 47,5-56 s, logo.** Il se lit toujours comme une icône « hamburger » (trois barres). La marge rouge est invisible en petit.
   - **Correction :** garder le fondu des rangées vers les lignes, mais en faire une vraie réglure Seyès : marge rouge épaisse et bien visible, coin corné, ou monogramme « c’ » en Newsreader sur le carré kaki.

3. **18,75-19,05 s et 48,9-49,1 s, reflet sur le logo.** Ce n'est pas un reflet mais un rectangle blanc arrondi, à bords durs, qui traverse le logo et le sous-titre. On dirait un bug d'interface.
   - **Correction :** une bande dégradée en diagonale (−20°, bords doux, en mode additif), limitée au pictogramme et aux lettres, en 300 ms sur l'impact.

4. **Voiles gris sur les temps forts : 1,1 s et 1,7 s (flashs des Polaroids), 15,3-15,7 s (après le déclic), 48,2-48,4 s (passage du kaki au beige).** Toute l'image s'éclaircit en gris : c'est délavé au lieu d'être percutant.
   - **Correction :** un flash blanc chaud limité au Polaroid (radial, 2 images), puis retour immédiat au contraste. Pour le logo : coupe franche du kaki au beige sur le temps fort, avec un punch de 1,04 à 1.

5. **Cadrage et écrans vides dans l'application.**
   - De 23,5 à 26,5 s, la barre latérale est coupée en plein mot (« ducation », « hapitre »), le titre colle au bord haut et la moitié droite de l'image est vide.
   - Vides aussi : 28,4-29,3 s (flashcards) et 31,5 s (QCM). À 30,5 s, la carte en rotation n'est plus qu'un bloc vert foncé.
   - **Correction :** garder une marge d'au moins 60 px et cadrer la barre latérale entière ou pas du tout. Faire arriver le contenu en cascade pendant le filé, pas après. Montrer le dos de la carte en beige, avec la réponse.

6. **34,5-38,5 s, frise.** Les bandes de siècles ne suivent pas l'espacement régulier, les portraits alternent au-dessus et en dessous sans être rattachés à leur point, et la moitié droite est vide à 34,5 s. Ce sont les défauts de la v1.
   - **Correction :** supprimer les bandes de siècles, relier chaque photo à son point par une tige, et faire parcourir le trait par la caméra.

7. **13,6-15,2 s, viseur.** L'affichage « 1/60 F2.8 ISO 400 » est celui d'un appareil numérique, incohérent avec le Polaroid.
   - **Correction :** ne garder que les repères de cadrage.

8. **4,5-6 s, question du hook.** « Tu te souviens de *tout* ? » est petit, gris et placé bas : ce n'est pas de la typographie cinétique forte.
   - **Correction :** texte ×2, apparition mot par mot, « tout » en orange brûlé avec un punch.

9. **0-1,6 s.** Un bout de feuille dépasse du bord gauche.

10. **20-27 s.** « 9 textes » à l'écran (`source/scenes/app.js:63`), alors que le chapitre compte 10 textes.

11. **Lisibilité sur téléphone.** « Sans publicité · rien n'est envoyé », « Lycée Notre-Dame · TG1 » et l'adresse sur le Polaroid final sont illisibles. Les passer à au moins 22 px ou les supprimer.

## Ce qui marche (à garder)
- Interface claire en aplats, palette kaki / beige / anthracite cohérente, typographie serif propre.
- Les Polaroids qui se développent sur les noms.
- L'accumulation de feuilles, dense et lisible, avec vignette de tension et mise au point.
- Le passage des feuilles aux cartes (16,5 s).
- Les filés à 19,6 s et 31 s, sans images fantômes.
- La bonne réponse du QCM avec son explication ; l'arc rouge de la frise.
- Le slogan qui s'écrit ; la fin en Polaroid qui répond au début.
- La durée serrée (56,5 s).

## Comparaison avec la v1

**Mieux :**
- Nettement plus d'énergie : poussées de caméra, flashs, filés.
- Le déclic se fait par un éclair et non plus par une image noire.
- Le passage du logo à l'application avance au lieu de revenir en arrière.
- Plus d'images fantômes, rythme plus serré.

**Moins bien, ou pas mieux :**
- Le reflet rectangulaire et les voiles gris ajoutent un côté bon marché.
- L'affichage numérique du viseur et « 9 textes » sont revenus.
- La communauté, le logo et la frise, les points les plus faibles de la v1, sont repris tels quels.

**Bilan :** la v3 fait légèrement mieux que la v1, mais il faut encore des corrections pour atteindre le niveau visé.
