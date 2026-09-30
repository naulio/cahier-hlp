# Revue 1 : direction artistique (v5)

**Note : 8,5/10** (étalon : v1 = référence, v3 ≈ 2).
Par section : hook 9 · problème 8,5 · solution 8 · expérience 8,5 · communauté 8,5 · fin 8.

La v5 reste fidèle à la v1 : aplats clairs, kaki, beige, ardoise. Il n'y a ni flash, ni secousse, ni reflet, et aucun effet n'a été ajouté. Les défauts restants sont des finitions.

## Problèmes (du plus grave au moins grave)

1. **50,0-50,55 s, naissance du symbole.** Les trois barres blanches apparaissent seules, sans le carré kaki ni la marge rouge. À 50,42-50,55 s, le nom « Cahier d'HLP » entre à côté d'elles et l'ensemble se lit comme un menu « hamburger » suivi d'un titre. C'était 0,2 s en v4, c'est environ 0,5 s ici.
   *Correction* : faire apparaître le carré et la marge rouge dès que les barres ont fini de se resserrer (vers 50,0 s), et retarder le nom de 0,15 s.
2. **50,6-50,75 s et 16,5-16,7 s, fond kaki → crème.** Le fond passe par un gris sans teinte (RVB 124,126,113, saturation 0,05). Le défaut vient de la v1 et n'a pas été corrigé depuis la v4.
   *Correction* : interpoler la couleur en OKLab, ou passer par un beige chaud (#9A9376).
3. **26,3-28,3 s, fiche Rousseau.** La poussée coupe encore la barre latérale au bord gauche (« ccueil », « extes », « ashcards », « ion, transmission »). Le cadrage moins serré n'a pas réglé le problème.
   *Correction* : placer le bord du cadre sur le filet de la barre latérale (≈ x 205), ou garder la barre entière (+40 px).
4. **35,6-35,8 s, QCM → frise.** Les bandes des siècles apparaissent alors que la fenêtre du QCM est encore visible : deux mises en page se superposent pendant 0,2 s.
   *Correction* : faire entrer les bandes seulement quand la fenêtre a disparu (≈ 35,8 s).
5. **Micro-légende « SANS PUBLICITÉ · RIEN N'EST ENVOYÉ » (42-46 s).** Elle est encore à peine lisible à 360 px. « LYCÉE NOTRE-DAME · TG1 · 2026–27 » est désormais lisible.
   *Correction* : opacité +10 %, ou éclaircir le gris vers le beige.
6. **16,5-16,65 s, envol des feuilles.** Quelques feuilles laissent de courtes traînées floues. C'est bref, mais c'est le seul flou encore visible.
   *Correction* : diviser par deux le flou de mouvement sur ce plan.
7. **Typographie.** Dans la barre latérale, « 52 % · » est isolé en fin de ligne, au-dessus de « 12 CARTES À REVOIR » (29-36 s).
   *Correction* : supprimer le point médian quand le texte passe à la ligne.
8. **47-50 s.** Le vert-jaune des places allumées frôle encore le « lime » (défaut hérité de la v1).
   *Correction* : saturation −10 %.

## Ce qui marche (à garder)
- **Hook** : les Polaroids qui se développent sur l'ardoise, les noms manuscrits, « *tout* » en italique.
- **Interface** : crédible et aérée, avec un seul accent kaki. Les textes sont conformes au site (boîtes de Leitner, « QCM · 16 », « Revient dans 1 h »).
- **Écrans de l'application** : les passages entre eux se font sans recouvrement (28,8-29,1 s), et la flashcard qui retombe dans la boîte 3 (qui passe à 8) est une micro-interaction juste.
- **Frise** : l'arc terracotta ne croise plus rien et se pose proprement sur Arendt.
- **Fin** : le carton est centré et hiérarchisé, avec l'apostrophe rouge. Le retour au Polaroid « TG1 — 2026–27 » sur l'ardoise boucle le film avec sobriété.
- **Déclic** : l'assombrissement (56,1 s) est plus doux que l'image noire de la v1.

## Comparaison
**Avec la v4**
- **Mieux** :
  - la traînée du logo a disparu (19,5 s) ;
  - la superposition flashcards → QCM a disparu ;
  - les apostrophes et « 2026–27 » sont unifiés ;
  - la micro-légende du lycée est lisible ;
  - la durée est de 60 s.
- **Pareil** : le passage par le gris et le vert-jaune des places.
- **Moins bien** : les barres seules du symbole restent plus longtemps (≈ 0,5 s contre 0,2 s).

**Avec la v1**
- **Mieux** : la typographie, la conformité au vrai site, l'arc de la frise, le déclic assombri au lieu du noir.
- **Pareil** : l'identité, la palette, les compositions, le rythme d'ensemble, le gris de transition.
- **Moins bien** : rien de notable.

La v5 est la version la plus propre, mais elle n'atteint pas encore 9, surtout à cause des barres seules à 50 s. Toutes les corrections consistent à retirer ou à ajuster ; aucun ajout n'est recommandé.
