# Évaluateur n°7 : AI slop detector (v3)

**Note : 6,5/10** (v1 : 6). Par section : hook 7,5 · problème 7 · solution 7 · expérience 7 · communauté 4 · fin 6.

## Symptômes, du plus grave au moins grave

1. **44,5-47,4 s, grille TG1** : 36 places qui s'allument en carrés vert-jaune acide, en vague uniforme, avec un flash vert plein cadre à 46,1 s. C'est la séquence classée « cliché SaaS » en v1 (3,5/10), reprise telle quelle. → Faire recevoir aux places de vraies micro-cartes de l'app (anneau %, coche QCM, flashcard), dans un ordre irrégulier et en kaki/beige ; supprimer le flash.
2. **47,4-48,0 s** : les rangées deviennent six barres blanches centrées. On voit une icône « menu » parfaite, puis le logo. Le fondu enchaîné renforce la lecture « hamburger » signalée en v1. → Converger directement vers les 3 lignes et la marge rouge du logo, marge visible dès 47,4 s.
3. **18,75 s et 49,0 s, reflet sur le logo** : un rectangle blanc translucide à bords nets, plus grand que l'icône, qui déborde sur le sous-titre (49,0 s). C'est un « logo shine » de modèle, utilisé deux fois. → Une seule bande diagonale en dégradé, masquée par la forme de l'icône, en fin de film seulement.
4. **SFX** (`sfx_cues.json`) : 146 repères en 56,8 s, bien calés. Mais tout le vocabulaire d'interface repose sur un « pop » synthétique : environ 40 pops, dont cinq `pop_1` identiques (même gain, même pan) toutes les 0,13 s à 25,07-25,59 s, et neuf à 34,2-35,1 s. S'y ajoutent des rafales de `ui_tick` toutes les 50 ms (19,92-20,22 s et 41,56-42,66 s). Cet effet mitraillette est typique du son généré. → Utiliser 3-4 clics enregistrés, varier la hauteur de ±80 cents et le gain de ±2 dB, accentuer seulement le premier et le dernier son de chaque rafale.
5. **Musique** (`music.py`) : la grille F-Am7-Dm7-Bbmaj7 (I-iii-vi-IV) avec un arpège pincé 0-1-2-3-2-1-2-3 en doubles croches est la progression « tech corporate » déjà reprochée en v1. Le stem musique reste à plat vers -25 dB de 16 à 52 s : aucun drop ni relance visible (déduit des courbes, non écouté). → Un temps de silence avant le déclic (15,3 s) puis un vrai drop ; un break à 39 s avec reprise sur « Gratuit » ; une autre progression ; un ducking sous la voix plutôt qu'un niveau bas constant.
6. **39,3-39,9 s** : écran vide, une tache ocre floue sur fond kaki avec quelques pixels parasites. On dirait une fuite de lumière bon marché. → Couper, et passer de la frise à « Gratuit. » par un filé direct avec un slam typographique.
7. **Écrans vides à l'arrivée des filés** : centre vide à 28,4-29,0 s (flashcards), QCM sans réponses à 31,1-31,9 s, fiche blanche après un fondu à 22,9-23,5 s. → La carte doit déjà être en place à l'arrivée. Pour la fiche, faire grandir la carte Rousseau jusqu'à la fiche au lieu du fondu.
8. **20,0-20,5 s** : le texte de l'app sort du flou (déjà signalé en v1). Puis, de 20,5 à 22,5 s, le tableau de bord reste figé et seul le curseur macOS bouge. → Construire l'écran par cartes décalées ; réduire le curseur ou le supprimer.
9. **14,6-15,1 s** : le viseur affiche « 1/60 F2.8 ISO 400 » (`source/scenes/desk.js:184`). Ce préréglage d'appareil numérique jure avec l'argentique et n'a pas bougé depuis la v1. → Supprimer la ligne.
10. **37,3-38,5 s** : l'arc rouge Rabelais→Arendt passe toujours sous les Polaroid de Rousseau et de Flaubert. → Placer l'arc au-dessus des photos, ou le tracer au-dessus de la ligne du temps.
11. **0,5-1,6 s** : le bord d'une feuille dépasse sur le côté gauche de l'ouverture noire. → Sortir l'élément du cadre.
12. **Téléphone (360 px)** : « SANS PUBLICITÉ · RIEN N'EST ENVOYÉ », « LYCÉE NOTRE-DAME » et l'adresse sur le Polaroid final sont illisibles. → Grossir le texte de 60 % ou le supprimer.
13. **Voix** (non écoutée) : V07 « dans le Cahier d'HLP » a la plus faible confiance (0,80) ; V13 est la plus plate (écart de F0 de 2,5 demi-tons, étendue de 7,6) alors que c'est la réplique « humaine ». La synthèse risque de s'entendre sur le nom du produit. → Générer plus de prises et garder celles dont l'étendue dépasse 10 demi-tons.

## Ce qui est vraiment maîtrisé
- De vrais portraits gravés, aucune image IA ; le développement des Polaroid et le flash du hook.
- Des notes manuscrites crédibles qui s'accumulent.
- **Le déclic, le flash blanc puis les feuilles qui se rangent en cartes (15,3-17,1 s)** : le vrai moment « wow ».
- Des filés directionnels motivés (19,5 s, 28,1 s, 33,9 s).
- La flashcard retournée en 3D puis rangée dans la boîte 3 (30,0-30,7 s) ; la coche du QCM avec son explication.
- Une fin qui répond au hook : Polaroid et légende manuscrite « TG1 — 2026-27 ».
- 56,8 s ; un taux d'erreur de transcription (WER) de 0 partout ; des sons déclarés par les scènes, donc synchrones.

## Comparaison avec la v1
Environ 90 % des plans et le squelette sont les mêmes (planches contact comparées).
- **Mieux** : plus court et plus nerveux (filés, flash à la place de l'image noire, flip de la flashcard) ; « Neuf auteurs » corrigé ; bande-son plus dense et bien calée.
- **Inchangé** : grille TG1, logo « hamburger », viseur, arc sous les photos, curseur, texte qui sort du flou, musique.
- **Nouveaux signes de slop** : reflets rectangulaires, tache ocre, rafales de pops identiques.

**Verdict** : plus d'énergie que la v1, mais pas plus propre. Trois défauts suffisent à faire « template » : la séquence communauté, la morph du logo et les pops.
