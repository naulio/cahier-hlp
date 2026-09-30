# Revue 1 : direction artistique (v6)

**Note : 8,5/10** (étalon : v1 = référence, v3 ≈ 2).
Par section : hook 9 · problème 8,5 · solution 8,5 · expérience 7,5 · communauté 8,5 · fin 9.

La v6 reste fidèle à la v1 : aplats, kaki, beige, ardoise, sans effet ajouté. Trois défauts de la v5 sont corrigés. En revanche, une correction a créé un défaut nouveau et visible dans la partie « expérience ».

## Problèmes (du plus grave au moins grave)

1. **36,15-36,55 s, QCM → frise : l'image passe par le gris.** Le QCM s'efface avant que la frise soit opaque, et le fond sombre de la scène apparaît. La luminance moyenne descend de 237 à 165 (RVB ≈ 165,163,154, saturation 0,05). Pendant ce creux, on voit encore le fantôme de la barre latérale sous les bandes des siècles (36,33 s). Le passage ressemble donc à un fondu par le gris façon PowerPoint, au milieu d'une séquence crème, et les deux mises en page se superposent toujours. Ni la v5 ni la v1 n'avaient ce creux : la luminance y restait à 237-240.
   *Correction* (`scenes/frise.js`, l. 69) : rendre le fond papier de la frise opaque dès le début de la sortie du QCM, et ne faire apparaître en fondu que son contenu.
2. **50,35-50,65 s, symbole de fin.** Les six lignes blanches restent encore environ 0,3 s sans le carré, qui n'apparaît qu'à 50,7 s. Comme le nom n'entre plus à côté (il arrive à 51,0 s), l'effet « menu hamburger » est bien moindre, mais il n'a pas tout à fait disparu.
   *Correction* : avancer le fondu du carré et de la marge de 0,3 s, pour qu'il commence quand les lignes deviennent blanches.
3. **40,9-41,0 s, frise → vert.** Le fond passe par un gris sans teinte (RVB 102,103,93, saturation 0,05). C'est le défaut corrigé à 50,8 s, mais sur une autre transition.
   *Correction* : appliquer ici la même interpolation par le beige chaud.
4. **Micro-légende « SANS PUBLICITÉ · RIEN N'EST ENVOYÉ » (42-46 s).** Elle est un peu plus lisible, mais reste la ligne la plus faible à 360 px.
   *Correction* : éclaircir encore le texte vers #CFC8B0, sans changer sa taille.
5. **15,58-15,68 s, recul du viseur.** La plus grande partie du recul se fait en environ 0,1 s : on saute encore du plan serré au plan large.
   *Correction* : adoucir la courbe, avec une vitesse plus régulière sur les 0,35 s.
6. **16,5-16,7 s.** Les feuilles qui s'envolent laissent toujours de légères traînées floues.
   *Correction* : diviser leur flou de mouvement par deux.

## Ce qui marche (à garder)
- **Hook** : les Polaroids qui se développent, puis « Tu te souviens de *tout* ? » qui reste immobile avant le recul.
- **Fiche** (24-29 s) : la barre latérale est enfin entière, le cadrage est calme et le retrait du « Piège » l'allège.
- **Flashcard, QCM et frise** : le comportement est juste et l'arc ne frôle plus Hugo.
- **Fin** : le passage du vert au papier se fait par un beige chaud (RVB 145,142,120 à 50,9 s). Le nom entre sur fond clair.
- **Déclic** (56,65 s) : un seul assombrissement sur deux images, sans voile clair ni noirs relevés. C'est sobre et plus fin que le noir de la v1. Le Polaroid final est net, sans texte dédoublé.

## Comparaison
**Avec la v5**
- **Mieux** :
  - la fin du symbole et du nom ;
  - le gris kaki → crème ;
  - la fiche coupée ;
  - le chevauchement QCM/frise ;
  - les déclics.
- **Pareil** : la micro-légende, le flou des feuilles, le vert-jaune des places (légèrement adouci, désormais acceptable).
- **Moins bien** : le creux gris de 36,2 s.

**Avec la v1**
- **Mieux** : la typographie, la conformité au site, la frise, le déclic et la fin.
- **Pareil** : l'identité, la palette, le rythme.
- **Moins bien** : le creux gris de 36,2 s, absent de la v1.

Aucun effet n'a été ajouté, ce qui est conforme au goût du commanditaire. Si le problème 1 est corrigé, la v6 atteint 9.
