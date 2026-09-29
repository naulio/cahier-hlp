# Évaluateur 6 : orthographe, typographie, exactitude (v4)

## Note : 7,5/10

Je n'ai trouvé aucune faute d'orthographe ni d'accord, et le fond littéraire est exact. Ce qui retient la note : des libellés inventés dans l'écran des flashcards, qui contredisent le vrai site, et une typographie inégale entre `onscreen_content.js` (soignée) et les chaînes écrites en dur dans `app.js` et `classe.js`.

## Fautes, de la plus grave à la moins grave

1. **Intervalles de Leitner inventés (28,5-31 s).** L'écran affiche « chaque jour / tous les 2 j / tous les 4 j / chaque semaine / acquises » et le message « Revient dans 4 jours ». Le vrai site (`app/moteur.js`, l. 117 et 622) affiche « chaque tour / 10 min / 1 h / 6 h / 24 h ». Un élève qui ouvre le site verra autre chose que dans le trailer.
   **Correction :** `["1","chaque tour"],["2","10 min"],["3","1 h"],["4","6 h"],["5","24 h"]` et le message « Revient dans 1 h » (la carte passe de la boîte 3 à la boîte 4).

2. **Apostrophes droites dans les chaînes écrites en dur** (22 dans `app.js`, 5 dans `classe.js`), alors que le wordmark et le contenu utilisent l'apostrophe courbe ’. C'est visible sur le grand titre en serif « 12 cartes à revoir aujourd'hui » (28,5-31 s), dans l'explication du QCM où « l'ignorance » est droite sous « L’ignorance » courbe (33,5 s), et dans « L'ESSENTIEL EN 5 POINTS » (25-28 s), « AUJOURD'HUI » et « RIEN N'EST ENVOYÉ » (41-44 s).
   **Correction :** remplacer `'` par `’` dans tous les textes affichés.

3. **Pourcentages incohérents.** Les cartes affichent « 100% », « 10% », « 0% » sans espace (17-23 s), alors que la barre latérale et le téléphone affichent « 52 % ». En français, le signe % est précédé d'une espace insécable.
   **Correction :** dans `lib/ui.js`, écrire `${p} %`.

4. **Nombres inexacts.** La fiche indique « QCM · 14 » (27,5 s), mais le chapitre contient 15 QCM sur Rousseau. L'écran de QCM indique « QUESTION 4 / 15 » (31,5-34,5 s), mais il y en a 16 sur Hugo.
   **Correction :** « QCM · 15 » et « QUESTION 4 / 16 ».

5. **Mauvaise coupure dans la barre latérale (20-35 s)** : « 52 % · 12 CARTES À » puis « REVOIR » seul à la ligne suivante.
   **Correction :** mettre une espace insécable (« À REVOIR ») ou raccourcir en « 52 % · 12 À REVOIR ».

6. **« Pensé en TG1 » est ambigu à l'oral (V13).** Whisper a transcrit « Pensez en TG1 », ce qui donne un impératif au vouvoiement, contraire au tutoiement du reste. Un auditeur peut faire la même erreur.
   **Correction (facultative, même voix B) :** « Conçu en TG1, pour toute la classe. »

7. **Tirets incohérents.** On lit « 2026–27 » avec un demi-cadratin (46,5 s), puis « TG1 — 2026-27 » avec un trait d'union (53,5-56 s, écrit en dur dans `end.js`).
   **Correction :** « TG1 — 2026–27 » partout, en le tirant de `C.brand.annee`.

8. **Le curseur cache un mot à 27,5 s** : on lit « rien n'e▸t fixé ».
   **Correction :** déplacer le curseur sous la ligne.

9. **Espaces ordinaires dans `app.js`** : « Métaphore : », « « comme » ». Il faut des espaces insécables, comme dans le reste du contenu : ` :` et `« comme »`.

10. **Détail.** Les titres des cartes sont simplifiés par rapport à la leçon. Hugo « Chaque enfant qu’on enseigne » s'appelle « Éduquer pour intégrer l'homme à la société » dans la leçon, et Ferry « Lettre aux instituteurs » s'appelle « L'éducation morale de la nation, une priorité ». De plus, Rabelais ch. 11 est absent : il y a 9 cartes pour 10 textes. On peut le défendre, mais ce n'est pas tout à fait « rien d'inventé ».

## Ce qui est correct (à garder)

- **Orthographe** : aucune faute, à l'écran comme dans la voix off. « Émancipe-t-elle », « XVIe siècle » (en exposant) et « 1re partie » sont bien écrits.
- **Typographie de `onscreen_content.js`** : espaces fines insécables avant ? ! et à l'intérieur des guillemets « », apostrophes courbes, points de suspension en un seul caractère. Le rendu dans les images est propre.
- **Faits vérifiés** : auteurs, œuvres et dates (1534, 1755, 1832, 1857, 1881, 1883, 1913, 1957, 1958) ; dates de Rousseau (1712-1778) ; titre complet du *Discours*.
- **Fidélité aux sources** : les extraits (Rabelais ch. 23, Rousseau, Flaubert, Hugo, Ferry, Péguy) sont conformes aux textes, et les citations de Balzac et de Camus sont conformes à la leçon.
- **Fidélité à la leçon** : la flashcard, la question de QCM et son explication sont reprises mot pour mot de `lecons/education.js`.
- **Conformité au site** :
  - « Examen blanc · 20 questions · 20 min » ;
  - « Semestre 1 · La recherche de soi » ;
  - « Neuf auteurs, quatre siècles » ;
  - « Ta progression reste sur ton appareil », ce qui est exact puisque la progression est stockée dans le `localStorage` du navigateur.
- **Voix off** : le texte est correct, avec un WER de 0 sur toutes les répliques.
