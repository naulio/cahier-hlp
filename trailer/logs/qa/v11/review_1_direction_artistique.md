# Revue 1 : direction artistique (v11)

**Note : 9/10** (v1 = référence ; v3 ≈ 2).
Hook 9,5 · problème 9 · solution 9 · expérience 9 · communauté 9 · fin 9,5.

On retrouve le film de la v1, en plus propre. Rien n'a été ajouté. Il reste deux accrocs, visibles seulement image par image.

## Problèmes restants
1. **17,28-17,38 s, cascade des cartes.** La carte « Flaubert » cache le « H » de « Hugo » et sa date. Le titre « Péguy » est coupé à moitié, et des feuilles vierges dépassent encore sous la 3e rangée.
   *Correction* : poser chaque rangée par-dessus la précédente (z-index croissant) et masquer chaque feuille (opacité 0) dès que sa carte est posée.
2. **50,80 s (1 à 2 images), passage du vert au papier.** Le fondu donne un gris-kaki terne derrière le symbole.
   *Correction* : raccourcir ce fondu à 0,15 s, sans rien ajouter.

## Réglé depuis la v10
- L'encre des feuilles est éteinte à 17,08 s.
- Plus de grille fantôme sous le nom en transit (20,38-20,68 s).
- À 50,60 s, les trois lignes du symbole tiennent dans le carré.
- « SANS PUBLICITÉ · RIEN N'EST ENVOYÉ » est crème et se lit bien (43,5 s).
- Le déclic final assombrit moins l'image que dans la v1 (luminance moyenne 152 contre 10, sur 255). Il reste discret.

La correction n'a rien abîmé.

## À garder
- Les Polaroids, puis « Tu te souviens de *tout* ? ».
- L'enchaînement papiers → cartes → app.
- Des interfaces calmes, la classe TG1.
- La fin aérée et le Polaroid « TG1 — 2026-27 ».

## Verdict
**Livrable.** Les deux points ci-dessus sont des finitions facultatives, invisibles en lecture normale.
