# Évaluation n°7 : AI SLOP DETECTOR (v4)

## Note : 7,5/10
Hook 8 · Problème 8 · Solution 7 · Expérience 6,5 · Communauté 7,5 · Fin 8

La v4 ne sent plus la « bande-annonce générée » de la v3 : aucun flash, secousse ni filé visible sur les planches. Les 62 bruitages sont **exactement ceux de la v1** (même son, même gain, seulement recalés). Il reste quelques « tells » de rendu automatique, presque tous hérités de la v1. Ils sont petits, mais un œil attentif les voit.

## Symptômes, du plus grave au moins grave

1. **30,0-30,2 s : l'interface se contredit.** L'anneau de clic tombe sur **« À revoir »** (f_030.150), pourtant la carte part en boîte 3 avec « Revient dans 4 jours », ce qui est le résultat de « Je savais ». La cible du curseur (`app.js`, `[k.yes-0.12, 900, 690]`) est environ 45 px sous le bouton, et le curseur repart avant le clic. **Correction :** viser le centre de « Je savais », tenir 0,2 s après le clic, puis repartir.
2. **30,40-30,50 s : le curseur devient une traînée en escalier** (8 copies près d'« Examen blanc », f_030.450). On voit un saut de plus de 300 px en 0,1 s, un geste de robot. **Correction :** donner au moins 0,5 s au trajet vers « QCM » et couper le flou de mouvement sur le curseur.
3. **16,1-16,5 s : les portraits se dédoublent en escalier** pendant le morphing (copies discrètes en moiré, f_016.330 en bas à gauche et f_016.430). C'est l'artefact typique d'un flou par accumulation sous-échantillonné. On le retrouve à **52,67 s** (le texte du carton est dédoublé et le cadre gris est épais). **Correction :** plus d'échantillons (×2 à ×3) ou un angle d'obturation deux fois plus petit, seulement sur ces deux plans.
4. **28,06-28,36 s : un fondu enchaîné façon diaporama** à l'intérieur de l'app. « Jean-Jacques Rousseau » et « 12 cartes à revoir » se superposent. Une vraie app ne fait pas ça. **Correction :** fondu sortant de 0,12 s, puis fondu entrant ; la barre latérale reste fixe.
5. **19,56-19,86 s : dédoublement du logo** quand il glisse vers la barre latérale, puis un panneau d'app vide pendant environ 0,3 s (effet de gabarit). **Correction :** moins de flou sur le logo ; laisser les cartes déjà visibles en transparence (le 20,06 s de la v1 le faisait mieux).
6. **9 cartes à 16,36-16,96 s :** les tics tombent tous les 75 ms pile, avec un panoramique linéaire. C'est un chapelet mécanique (déjà présent dans la v1). **Correction :** varier le moment de ±15 ms et le gain de ±2 dB, sans ajouter aucun son.
7. **36,5-38,5 s, frise :** le portrait de Hugo est posé contre l'étiquette « Flaubert », et celui de Flaubert près de « Balzac / Hugo ». On risque de confondre les visages. **Correction :** mettre chaque portrait du même côté que son nom.
8. **39,5-41 s :** un point clair d'environ 2 px sous « Gratuit. » (vers x 177, y 537), d'origine inconnue. À vérifier et à supprimer.

## Voix et musique (d'après les données, sans écoute possible)
- WER nul sur les 15 répliques et aucun décalage de hauteur (F0 entre 93 et 132 Hz, dispersion naturelle). Le mot le moins sûr est le nom du site, « dans le Cahier d'HLP » (confiance 0,80, puis QCM à 0,81) : à réécouter.
- « Tu te souviens de tout ? » dure 1,16 s, contre 2,0 s dans la v1. La question du hook risque de sonner pressée. Si une prise plus posée existe, la préférer.
- Au mixage, la voix est à -12,9 LUFS et la musique à -23,4 LUFS, crête vraie -1,25 dBTP : la hiérarchie est saine. L'absence de batterie ne peut pas être vérifiée sans écoute.

## Ce qui paraît maîtrisé (à garder)
- La typographie réelle et lisible : le vrai texte de Rabelais, l'écriture manuscrite cohérente, les accents et guillemets français justes. Aucun texte généré illisible, aucune image IA.
- Les Polaroids qui se développent sur les noms (2,5-3,5 s), le téléphone qui retrouve sa place dans la classe (44,5 s), la capture Polaroid finale « TG1 — 2026-27 ».
- La sobriété : un seul mouvement signifiant à la fois, le masque sous « Gratuit. », la palette kaki et beige tenue d'un bout à l'autre.

## Comparaison avec la v1
La v4 est la v1 resserrée (62,7 s → 56,7 s) avec la voix B. Elle garde les mêmes qualités et les mêmes petits tells (symptômes 2, 3, 5 et 6 déjà visibles dans les planches de la v1). Elle n'ajoute aucun effet de la v3.

Le resserrage a abîmé le passage flashcards → QCM : la même trajectoire de curseur, sur une durée plus courte, crée la traînée et le clic sur le mauvais bouton. En corrigeant les symptômes 1 à 4, qui ne demandent que des finitions invisibles, la v4 peut dépasser la v1 (8,5).
