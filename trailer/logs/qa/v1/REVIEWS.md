# v1 — retours des évaluateurs indépendants (résumé fidèle)

Vidéo évaluée : `renders/trailer_v1.mp4` (62,4 s). Les évaluateurs n'ont vu que des images et des mesures
(pas de lecture vidéo ni d'écoute) : voir `logs/qa/BRIEF.md`.
Note : 5 agents sur 7 ont été interrompus une première fois par une limite d'usage ; ils ont été relancés
sur le même matériel v1.

| Agent | Note | Par section (hook / problème / révélation-solution / expérience / communauté / fin) |
|---|---|---|
| 1. Direction artistique | **6/10** | 6 / 6,5 / 5,5 / 6 / 4,5 / 6,5 |
| 2. Motion design | **6/10** | 6,5 / 5,5 / 5 / 6 / 6,5 / 7 |
| 3. Sound design / mix | **6,5/10** (mix 7/10) | 7 / 5 / 7 / 7 / 6 / 5 |
| 4. Voix off | **6/10** | noms du hook 6 / question 6,5 / problème 5,5 / révélation 6,5 / fonctions 6 / fin 6,5 |
| 5. Montage / storytelling | **6,5/10** | 7 / 7 / 7,5 / 6 / 4,5 / 7 |
| 6. Orthographe / français | **7/10** | — |
| 7. « AI slop detector » | **6/10** | 7 / 7,5 / 5,5 / 7 / 3,5 / 5,5 |

Verdict v1 : **insuffisant (5 à < 8)** sur tous les axes → corrections structurelles.

## Problèmes convergents (cités par plusieurs agents)
- **Communauté (43-52 s)** : grille symétrique de rectangles « qui s'allument » (vert acide, cliché SaaS),
  sans trace humaine, trop courte ; « Gratuit / Sans compte » + iPhone = page d'atterrissage type (1, 5, 7).
- **Frise** : bandes de siècles contredisant l'espacement régulier, portraits mal alignés sur les nœuds,
  arc rouge qui passe sous les photos, écrans vides avant les nœuds (1, 2, 5, 6, 7).
- **Logo** : lu comme une icône « hamburger » (1).
- **Images fantômes** (flou de mouvement à 2-3 sous-images) : logo en double à 21,4 s, curseur, feuilles (1, 2).
- **Déclic** : image noire lue comme un glitch ; saut de caméra d'une image avant ; viseur « AF · RECHERCHE /
  1/60 F2.8 ISO 400 » = preset d'appareil numérique incohérent avec l'argentique (1, 2, 7).
- **Retour en arrière 18-22 s** : cartes → logo seul (grille floutée) → cartes à nouveau (2, 5).
- **Caméra de l'app** trop mobile (8 cibles, zoom 1,34, haut de fiche coupé) ; bug de recentrage (1, 2, 5).
- **Deux films collés** : 0-17 s en matière, 22-53 s « SaaS générique » (fenêtre flottante, curseur macOS) (1, 7).
- **Flashcards / QCM** trop rapides pour prouver la promesse (5).
- **Adresse** du site pas assez longtemps lisible ; illisible sur le Polaroid final (1, 2, 5).
- **Sons** : un effet par animation dans le problème (masque des sibilantes), `air_soft` répété 8-9 fois,
  trois appareils photo différents (Sony, Pentax, Canon + Polaroid), fin creuse (3, 7).
- **Musique** : groove « tech corporate » (I-iii-vi-IV en boucle, arpège plat, charleston, shaker) (3, 7).
- **Typographie** : apostrophes droites, orphelins (« REVOIR », « 8 », « procédé ? », « » »), espaces
  insécables manquantes, 5 familles de polices, texte qui sort du flou (1, 6, 7).
- **Exactitude** : « 9 textes » (le chapitre en compte 10, deux de Rabelais) ; durées de Leitner inventées ;
  titre de Rousseau tronqué ; ponctuation de Rousseau altérée ; Camus/Arendt : œuvres/dates à préciser (6).
- **Crédits** : piano Salamander (CC BY 3.0) à créditer (3).

- **Voix** (4) : les quatre noms du hook se chevauchent et retombent tous de la même façon ; saut de registre
  sur « Mais où ? » (voix plus aiguë, autre personne) ; répliques du milieu trop pressées ; attaques coupées
  (« Des photocopies ») ; la question ne monte pas assez ; chemin Google TTS à documenter (variables d'environnement).

## Idées retenues pour la v2
- Plan de classe **dessiné au crayon sur une page Seyès**, chaque place cochée par un stylo différent,
  à un rythme irrégulier ; pas de lueur (7).
- **Un seul appareil, un Polaroid** : déclic + éjection aux deux moments (7).
- **Percussions de papier et de crayon** tirées des enregistrements CC0 ; harmonie modale en ré ;
  ostinato de piano tiré du motif du hook ; plus d'arpège ni de charleston (3, 7).
- Script : « Des photocopies, des notes, des post-it… » ; « Fait en TG1, par l'un d'entre nous. Pour toute
  la classe. » ; fin en écho « Le Cahier d'HLP. Tout est là. » ; sous-titre « Le site de révision d'HLP » (5).
- Matière dans l'interface : fiche bristol lignée, boîtes kraft, tampon encreur « Revient dans… » (1).
- Logo « c’ » sur réglure Seyès avec marge rouge qui déborde (1).
