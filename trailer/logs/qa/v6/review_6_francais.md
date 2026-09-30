# Évaluateur 6 : orthographe, typographie, exactitude (v6)

## Note : 8,5/10 (v5 : 8)

Je n'ai trouvé aucune faute d'orthographe, d'accord ni de ponctuation, ni à l'écran ni dans la voix off. Les faits sont exacts. Il reste un nom coupé à l'image et deux titres qui s'écartent du site.

## Fautes, de la plus grave à la moins grave

1. **« Flaubert » est tronqué (≈ 2,7-5 s, puis 10-16 s).** Le Polaroid de Hugo recouvre le « t » final de la légende manuscrite : on lit « Flauber ». C'est le hook, le moment le plus regardé. Le « s » de « Rabelais » frôle aussi le bord du Polaroid de Rousseau (10-13 s).
   - **Correction (`desk.js`) :** centrer les légendes dans le cadre blanc avec une largeur maximale inférieure à celle du Polaroid, et réduire la police d'environ 8 %. Autre solution : décaler le Polaroid de Hugo d'environ 24 px vers la droite.
2. **Titres des cartes différents de ceux de la leçon (21-24 s)** :
   - Hugo : « Chaque enfant qu'on enseigne » au lieu de « Éduquer pour intégrer l'homme à la société » ;
   - Ferry : « Lettre aux instituteurs » au lieu de « L'éducation morale de la nation, une priorité ».

   **Correction :** reprendre les titres du site, ou au moins mettre des guillemets au titre de l'œuvre : « “Lettre aux instituteurs” », comme dans `education.js`.
3. **Le compteur ne baisse pas (31,5-33 s).** Après « Je savais », l'en-tête affiche encore « 12 cartes à revoir aujourd'hui », et la barre latérale « 12 cartes à revoir ». **Correction :** passer à « 11 » au même instant que la boîte 2, de 4 à 3.
4. **Chiffres et lettres mélangés.** L'accueil affiche « 9 auteurs », la frise « Neuf auteurs ». **Correction :** « Neuf auteurs · de Rabelais à Arendt ».
5. **Détail invisible** : il reste des espaces ordinaires dans les étiquettes des boîtes (« 10 min », « 1 h », `app.js`, l. 148) et dans l'encadré « Piège », qui est masqué. **Correction :** mettre ` ` ou ` ` par cohérence.

## Ce qui est correct

- **Voix off** : le WER est de 0 sur toutes les répliques, et chaque formulation correspond à une vraie fonction du site. « Pensé » ou « Pensez » : Whisper ne distingue pas ces homophones, ce n'est pas une faute.
- **Typographie** :
  - espaces fines insécables avant ? ! ; et à l'intérieur des guillemets, y compris dans la citation de la fiche ;
  - « 52 % », apostrophes courbes, « 1<sup>re</sup> partie » en exposant ;
  - demi-cadratin sans espaces dans « 1712–1778 », « 2026–27 » et « TG1 — 2026–27 ».
- **Exactitude** :
  - « QCM · 16 », « Flashcards · 9 », « Question 4 / 16 » ;
  - Leitner : « chaque tour · 10 min · 1 h · 6 h · 24 h », et « Revient dans 1 h » pour la boîte 3 ;
  - la flashcard, la question du QCM et son explication sont reprises de `education.js` ;
  - les extraits de Rousseau, Flaubert, Hugo, Ferry et Péguy sont fidèles ;
  - les dates vont de 1534 à 1958, et les bandes de siècles sont justes ;
  - « Sans publicité · Rien n'est envoyé » et « 20 questions · 20 min » sont conformes au site.

## Réglé depuis la v5

| Problème | État |
|---|---|
| Curseur sur « n'est fixé » | Réglé : garé sous la liste |
| « 52 % · » coupé | Réglé : deux lignes voulues |
| « Toucher pour retourner » | Réglé : « Touche la carte pour la retourner » |
| « 15 questions corrigées » | Réglé : « entrelacées » |
| Explication du QCM trop brève | Réglé : entière et cadrée de 35,5 à 36 s |
| Tiret espacé « 1712 – 1778 » | Réglé : demi-cadratin sans espaces, choix juste et cohérent avec « 2026–27 » |
| Boîte 2 figée à 4 | Réglé |
| Espaces des guillemets et du « % » du téléphone | Réglé |
| Titres simplifiés, « 9 » / « Neuf » | Persiste |

Aucune correction n'a abîmé le texte. Le défaut « Flaubert » n'avait pas été relevé en v5. Il doit passer en tête, car il touche le hook.
