# Évaluateur 6 : orthographe, typographie, exactitude (v5)

## Note : 8/10 (v4 : 7,5)

Je n'ai trouvé aucune faute d'orthographe ni d'accord, et les faits sont exacts. Il reste deux défauts visibles à l'image (le curseur et une coupure de ligne) et quelques libellés qui s'écartent du vrai site.

## Fautes, de la plus grave à la moins grave

1. **Le curseur cache un mot (26,5-27,5 s)** : on lit « rien n’es▸fixé ». Ce problème était déjà signalé en v4 et n'est pas corrigé. À 26,5 s, le curseur couvre aussi « la source ». **Correction :** garer le curseur dans la marge vide entre la liste et l'encadré « Citation » (x ≈ 1000 px), ou sous la liste (y ≈ 800 px).
2. **Coupure de la barre latérale (20-35 s)** : on lit « 52 % · » puis « 12 CARTES À REVOIR » à la ligne suivante, ce qui laisse un point médian en fin de ligne. **Correction :** mettre `white-space:nowrap` et un interlettrage de 0,02em, ou faire deux lignes voulues, sans point médian : « 52 % », puis « 12 cartes à revoir ».
3. **« TOUCHER POUR RETOURNER » (29,5-31 s)** : l'infinitif rompt le tutoiement, et le site écrit « Touche la carte (ou Espace) pour la retourner » (`moteur.js`). **Correction :** « TOUCHE LA CARTE POUR LA RETOURNER ».
4. **« QCM mélangé · 15 questions corrigées » (21-23 s)** : le site affiche « 15 questions entrelacées, tous les textes ». **Correction :** « 15 questions entrelacées ».
5. **L'explication du QCM est lisible environ 1 s seulement (34,9-35,9 s)** pour 17 mots. À 34,5 s, la deuxième ligne, « comparaison. », est encore coupée à mi-hauteur. **Correction :** ouvrir l'encadré vers 33,9 s (`qExp` = `v10_corriges` + 0,4) ou retarder la frise de 0,5 s.
6. **« 1712 – 1778 » (24-29 s)** : un demi-cadratin entouré d'espaces. En police mono, il ressemble à un trait d'union espacé. Le site écrit « 1712-1778 ». **Correction :** `dates: "1712-1778"`.
7. **Pensé en TG1 (45,9-48,1 s)** : le problème persiste. Whisper transcrit toujours « Pensez en TG1 ». **Correction (facultative, même voix B) :** « Conçu en TG1, pour toute la classe. »
8. **Logique des boîtes (30,5-31,5 s)** : la carte passe de la boîte 2 à la boîte 3 (7 → 8), mais la boîte 2 reste à 4. **Correction :** `counts[1]` = « 3 » au même instant.
9. **Espaces ordinaires** là où le reste du trailer utilise l'espace fine insécable. Rien de visible à l'image, mais il faut les harmoniser :
   - `« ${F.citation} »` et « Perfectibilité » (`app.js`, l. 103 et 108) ;
   - `" %"` du téléphone (`classe.js`).
10. **Détail qui persiste** : les titres des cartes Hugo et Ferry sont simplifiés par rapport à la leçon, et Rabelais ch. 11 est absent (9 cartes pour 10 textes). On lit aussi « 9 auteurs » sur l'accueil et « Neuf auteurs » sur la frise.

## Ce qui est correct

- **Orthographe irréprochable** : « émancipe-t-elle », « XVIe siècle », « 1re partie » en exposant. Le WER est de 0 sur toutes les répliques.
- **Typographie de `onscreen_content.js`** : espaces fines insécables avant ; : ? ! et à l'intérieur des guillemets, apostrophes courbes, points de suspension en un seul caractère. Aucune apostrophe droite ne reste dans les chaînes affichées des scènes.
- **Nombres vérifiés dans `lecons/education.js`** :
  - Rousseau : « QCM · 16 » et « Flashcards · 9 » ;
  - Hugo : « Question 4 / 16 ».
- **Boîtes de Leitner** : « chaque tour · 10 min · 1 h · 6 h · 24 h » est conforme à `moteur.js` (l. 117 et 622). « Revient dans 1 h » est cohérent, puisque la carte entre dans la boîte 3, dont l'intervalle est de 60 min.
- **Faits exacts** :
  - les dates (1534 à 1958) ;
  - les bandes de siècles de la frise ;
  - « Quos ego → Virgile » et « Charbovari » ;
  - « Sans publicité · Rien n’est envoyé » et « 20 questions · 20 min », conformes au site.
- **Reprise mot pour mot** de la flashcard, de la question du QCM et de son explication.

## Réglé depuis la v4

| Problème signalé en v4 | État en v5 |
|---|---|
| Intervalles de Leitner | Réglé |
| Apostrophes droites | Réglé |
| « 100 % » | Réglé |
| QCM · 16 / Question 4 / 16 | Réglé |
| « 2026–27 » partout | Réglé |
| Espaces insécables dans l'explication du QCM | Réglé |
| Coupure de la barre latérale | Déplacée, pas réglée |
| Curseur sur le texte | Persiste |
| « Pensé » / « Pensez » | Persiste |
| Titres simplifiés | Persiste |

Correction de la v4 elle-même : elle comptait 15 QCM sur Rousseau, mais le site en compte 16. Le « 16 » de la v5 est donc juste.
