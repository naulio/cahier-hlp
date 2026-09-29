# Revue 1 : direction artistique (v4)

**Note : 8/10** (étalon : v1 = référence, v3 ≈ 2).
Par section : hook 8,5 · problème 8 · solution 7,5 · expérience 8 · communauté 8 · fin 8,5.

La v4 retrouve l'identité de la v1 (aplats clairs, kaki, beige, ardoise) sans flash, secousse, halo ni reflet visible. Rien n'est densifié ; restent des finitions.

## Problèmes (du plus grave au moins grave)

1. **19,5-19,6 s, logo → application.** « Cahier d'HLP » part en traînée horizontale (flou de mouvement à sous-images) : sur 1-2 images, on lit un filé, exactement ce qui a été rejeté. *Correction* : obturateur réduit sur ce plan (180° → 90°, ou 3 sous-images), ou déplacement allongé de 0,1-0,15 s.
2. **30,9-31,1 s, flashcards → QCM.** Les deux écrans se superposent : « FLASHCARDS · RÉPÉTITION ESPACÉE » et « QCM · VICTOR HUGO » l'un sur l'autre, « 12 cartes à revoir… » en fantôme. *Correction* : l'ancien contenu sort avant que le nouveau n'entre (4-5 images chacun, sans recouvrement) ; la barre latérale reste fixe.
3. **16,1-16,4 s et 48,2-48,4 s, passages sombre → crème.** Le fond traverse un gris-kaki terne (interpolation RVB). *Correction* : interpoler en OKLab ou passer par un beige chaud.
4. **Micro-légendes illisibles au téléphone** : « SANS PUBLICITÉ · RIEN N'EST ENVOYÉ » (40-44 s), « LYCÉE NOTRE-DAME · TG1 · 2026–27 » (46-47 s). À 360 px, gris sur kaki, elles disparaissent. *Correction* : corps +25 %, opacité ~75 %.
5. **47,9-48,1 s, symbole.** Les trois barres blanches naissent seules, sans carré ni marge rouge : icône « menu » générique pendant ~0,2 s. *Correction* : tracer la marge rouge en même temps que les barres.
6. **23,5-26,5 s, fiche Rousseau.** La poussée coupe la barre latérale au bord gauche (« ducation, transmission », « sion »). *Correction* : décaler le cadre de ~40 px ou estomper la barre latérale.
7. **Typographie.** Apostrophe droite dans « aujourd'hui » (28-31 s, `source/scenes/app.js:129`) alors que tout le reste est courbe ; « 2026-27 » (trait d'union) sur le Polaroid final contre « 2026–27 » ailleurs ; « 52 % · 12 CARTES À / REVOIR » laisse un mot seul à la ligne.
8. **38,9-39,5 s** : ~0,6 s de kaki vide avant « Gratuit. » (v1) ; respiration acceptable, au plus −0,2 s.
9. Le vert-jaune des coches (46 s) frôle le « lime » : hérité de la v1, à peine désaturer.

## Ce qui marche (à garder)
- Hook : Polaroids qui se développent sur l'ardoise, noms manuscrits, « *tout* » en italique ; sobre et net.
- Interface crédible : hiérarchie, espace, un seul accent kaki ; frise « Neuf auteurs, *quatre siècles* » et son arc terracotta.
- Carton (51,5 s) : composition centrée, hiérarchie nette, apostrophe rouge ; retour au Polaroid sur l'ardoise du début, légendé « TG1 — 2026-27 » : bouclage élégant et discret.
- Les poussées (0,8 %, 1,2 %) et le reflet sur le nom sont imperceptibles, comme voulu.

## Comparaison avec la v1
- **Mieux** : typographie (apostrophes, insécables, « L'homme : l'être… », « 9 auteurs »), rythme plus serré (56 s).
- **Pareil** : identité, palette, compositions, image noire du déclic, respiration kaki.
- **Moins bien** : la double image du logo de la v1 devient une traînée qui évoque un filé (19,5 s) ; la fiche Rousseau est tenue moins longtemps (surlignage et encart « Pièges » non visibles sur les planches), à peine perceptible.

Aucun ajout recommandé : tout se règle en retirant ou en ajustant.
