# Cahier d'HLP — instructions pour Claude

Outil de révision de la **spécialité HLP (Humanités, littérature et philosophie), Terminale**, partagé avec toute une classe.
Site statique, sans build ni dépendance : HTML + CSS + JavaScript natif.

- **En ligne** : https://naulio.github.io/cahier-hlp/ (GitHub Pages, dépôt `naulio/cahier-hlp`, branche `main`, dossier racine)
- **Dossier local** : `X:\Users\Administrator\Documents\cahier-hlp`
- **Ne jamais** renommer le dépôt, changer de compte ou désactiver Pages : le lien est partagé à la classe et doit rester stable.
- Ancienne version personnelle (orientée vers le contrôle du 28/09/2026, avec les photos des feuilles) :
  `X:\Users\Administrator\Documents\litt revisions\revision_education.html`. Ne pas la publier, ni ses photos.

## Architecture

| Fichier | Rôle |
|---|---|
| `index.html` | Enveloppe, sprite d'icônes (`<symbol id="i-…">`), liste des scripts |
| `style.css` | Styles (thème cahier Seyès clair / tableau noir sombre) |
| `config.js` | Nom du cahier, adresse, programme officiel affiché sur l'accueil |
| `app/moteur.js` | Routeur, accueil, page chapitre, fiches, QCM, examen blanc, flashcards (Leitner), exercices du manuel |
| `app/activites.js` | Qui a dit ?, textes à trous, procédés, associations, duels, frise, carte, graphiques, palais de mémoire, oral |
| `app/demarrage.js` | Démarrage (toujours le dernier script) |
| `lecons/<id>.js` | **Un fichier par chapitre** : appelle `CAHIER.lecon({...})` une seule fois |
| `lecons/_modele.js` | Modèle commenté de leçon (non chargé) : **la référence du format** |
| `outils/verifier.mjs` | Vérificateur obligatoire avant publication |

Routes : `#vue-argument.section`, par exemple `#l-education`, `#t-rou.citations`, `#qcm-education.faibles`, `#flash-tout`, `#palais-education.test`.
Portée des exercices : `tout` (tout le programme), un id de chapitre, ou un id de texte.
Une activité n'apparaît que si la leçon contient les données nécessaires (ex. pas de `palais` dans les textes → pas de palais).

## Ajouter un chapitre à partir des photos envoyées

1. **Lire toutes les photos** avec attention : texte, chapeau, notes de bas de page, questions du manuel, annotations manuscrites. Noter les lectures incertaines au lieu de deviner.
2. **Identifier** pour chaque texte : auteur, œuvre, date, genre, mouvement ; et le thème du programme (`config.js › programme`, ex. `s1-sensibilite`).
3. **Vérifier les faits** (dates, titres, attributions de citations) avec des sources fiables (WebSearch / WebFetch). Ne rien inventer. Toute anecdote a une source. Consigner les URL dans `sources`.
4. **Créer `lecons/<id>.js`** en copiant `lecons/_modele.js` :
   - textes dans l'**ordre chronologique**, ids courts et uniques dans tout le cahier ;
   - par texte : 5 points « essentiel » (le 5e répond à la problématique), fiche complète, citations, notes de cours (`annotations`), pièges ;
   - environ **12-16 QCM par texte** (niveaux F, C, A) + des questions transversales `"all"` (niveau T), **bonne réponse toujours en premier** ;
   - environ **8-10 flashcards par texte** ; frise, duels, procédés, textes à trous, associations ;
   - `radar` / `carte` / `palais` pour **tous** les textes du chapitre ou pour aucun ;
   - exercices du manuel avec corrigés (`exercices`), schémas propres au chapitre si utile (`schemas`).
5. **Ton et contenu** : tutoiement, clair, pour toute la classe. Pas de « ta note » / « ta feuille » : écrire « noté en cours », « la feuille ».
6. **Droits d'auteur** (le dépôt est public) : textes encore protégés (auteur mort depuis moins de 70 ans, traductions, adaptations, pages de manuel) → citations courtes seulement ; **aucune photo** de page de manuel ou de texte protégé dans le dépôt.
7. **Brancher** : ajouter dans `index.html`, juste avant `app/demarrage.js` :
   `<script src="lecons/<id>.js?v=1"></script>`
8. **Vérifier** : `node outils/verifier.mjs --tamponner` → **0 erreur** exigée (le tampon met à jour les `?v=` pour vider le cache des élèves).
9. **Tester en local** : `python -m http.server 8777 --directory .` puis http://localhost:8777/ — page du chapitre, 2-3 fiches, un QCM, les flashcards ; console sans erreur ; largeur 375 px sans défilement horizontal.
10. **Publier** : `git add -A`, `git commit -m "Ajoute le chapitre « … »"`, `git push`. Pages se met à jour en 1 à 2 minutes : vérifier `https://naulio.github.io/cahier-hlp/#l-<id>`.

Ajouter un texte à un chapitre existant : même procédure dans le fichier du chapitre.
Corriger une erreur signalée : modifier la leçon, vérifier, tamponner, commit, push.
Modifier le libellé d'une question réinitialise sa progression chez les élèves (son id est un hachage du texte) : sans gravité.

## Règles

- Pas de dépendance externe (sauf Google Fonts), pas de build, pas de framework.
- Aucune donnée personnelle ; la progression reste dans le navigateur de chaque élève (`localStorage`, préfixe `cahierHLP:`).
- HTML autorisé dans les contenus : `<b> <em> <i> <p> <ul> <ol> <li> <br>` (le vérificateur contrôle l'équilibre des balises).
- Commits signés `naulio <…+naulio@users.noreply.github.com>` (configuration locale du dépôt).
