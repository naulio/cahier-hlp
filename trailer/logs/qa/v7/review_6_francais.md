# Évaluateur 6 : orthographe, typographie, exactitude (v7)

## Note : 8/10 (v6 : 8,5)

La voix off et les textes ne contiennent toujours aucune faute d'orthographe ni d'accord, et les faits sont exacts. En revanche, la correction des titres a créé un défaut visible, et le hook coupe encore un nom.

## Fautes, de la plus grave à la moins grave

1. **Deux titres tronqués par des points de suspension (≈ 20,5-24 s, accueil).** À l'écran, on lit « Éduquer pour intégrer l'homme à la… » et « L'éducation morale de la nation, un… ». Ces titres repris du site sont trop longs pour la carte, dont le style impose `nowrap` et `ellipsis` (`lib/ui.js`, l. 26). Le « un… » donne l'impression d'un mot coupé.
   **Correction :** laisser le titre passer sur deux lignes (`white-space:normal; line-height:1.25`) et descendre la barre de progression d'environ 16 px. Il reste assez de place entre `top:86px` et le bas de la carte.
2. **« Rabelais » a encore le « s » coupé (≈ 2-5 s dans le hook, puis 10-13 s).** Le Polaroid de Rousseau recouvre le bas du « s » (image à 3,5 s). Le correctif appliqué à Flaubert a déplacé le défaut sur le premier nom prononcé.
   **Correction (`desk.js`) :** décaler le Polaroid de Rabelais d'environ 16 px vers la gauche, ou centrer la légende avec une largeur maximale inférieure à celle du cadre.
3. **La bulle arrive avant les compteurs (≈ 31,9 s).** « Revient dans 1 h » s'affiche alors que l'en-tête indique encore « 12 cartes », la boîte 2 « 4 » et la boîte 3 « 7 ».
   **Correction :** faire apparaître la bulle à la même image que le passage 4 → 3 et 7 → 8.
4. **Détails mineurs :**
   - « ESSAI ENGAGÉ » (Péguy) désigne un genre, pas un mouvement. Le site indique « Écrivain engagé de la Belle Époque » : mettre « BELLE ÉPOQUE ».
   - La note manuscrite « Arendt · La crise de l'éducation » n'a pas de guillemets, alors que le reste du trailer et le site en mettent. Écrire « Arendt · « La crise de l'éducation » ».
   - Dans l'explication du QCM (≈ 35,5-37 s), le mot « comparaison. » reste seul sur la dernière ligne. Élargir le bloc de 20 px.
   - L'encadré « Piège », masqué, a encore une espace ordinaire avant « : » (`app.js`, l. 108). Ce défaut est invisible.

## Ce qui est correct

- **Voix off :**
  - le WER est de 0 sur les 15 répliques ;
  - « Pensé en TG1 » est accordé avec « le Cahier » ;
  - Whisper entend « Pensez », mais il ne distingue pas ces homophones : ce n'est pas une faute.
- **Typographie :**
  - espaces fines insécables dans les guillemets et avant « ? » et « : » (« Le « nouveau » », QCM) ;
  - « XVIᵉ siècle » en exposant ;
  - « 1712–1778 », « TG1 — 2026–27 » ;
  - « 10 min » et « 1 h » avec espace insécable.
- **Exactitude :**
  - les extraits de Rabelais, Rousseau, Flaubert, Hugo, Ferry et Péguy sont fidèles ;
  - les dates vont de 1534 à 1958 ;
  - les chiffres sont conformes : « QCM · 16 » et « Flashcards · 9 » (Rousseau), 16 questions pour Hugo, « 15 questions entrelacées », « 20 questions · 20 min » ;
  - Leitner : chaque tour, 10 min, 1 h, 6 h, 24 h ;
  - « Neuf auteurs, quatre siècles » correspond aux quatre bandes de la frise.

## Réglé depuis la v6

| Problème v6 | État |
|---|---|
| « Flauber » tronqué | Réglé |
| Titres Hugo et Ferry différents du site | Réglé sur le fond, mais tronqués à l'image (point 1) |
| Compteur figé à 12 | Réglé : « 11 » dans la barre latérale et sur le téléphone ; la bulle arrive trop tôt (point 3) |
| « 9 auteurs » / « Neuf auteurs » | Réglé |
| Espaces ordinaires dans « 10 min » et « 1 h » | Réglé |
| « s » de « Rabelais » | Persiste, et touche maintenant le hook |
