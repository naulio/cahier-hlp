# Évaluateur 6 : orthographe, typographie, exactitude (v9)

## Note : 9/10 (v8 : 9)

Il n'y a aucune faute d'orthographe, d'accord ni de fait, à l'écran comme dans la voix off. Il reste trois finitions visibles, toutes mineures.

## Fautes restantes

1. **Question du QCM (≈ 33-36 s) : « …l'abîme » : quel / procédé ? ».** Le déterminant reste en fin de ligne, alors que c'est le défaut corrigé dans les titres.
   **Correction (`onscreen_content.js`, `qcm.q`) :** écrire `quel procédé ?`.
2. **Feuille de Hugo sur le bureau (≈ 6-15 s).** Les renvois « qu'on gagne. » et « au bagne » sont alignés à gauche, comme s'ils étaient des vers.
   **Correction :** décaler ces deux lignes vers la droite (par exemple avec `"   qu’on gagne."`).
3. **Fiche (≈ 25-29 s) : le titre de l'œuvre est en romain.** L'œuvre est « Discours sur l'origine… ». L'usage veut les titres d'œuvres en italique.
   **Correction :** `font-style:italic` sur `.f-oeuvre`.
4. **Défauts invisibles, qui persistent :**
   - espaces ordinaires dans les notes de `desk.js` (l. 33-45) ;
   - espace ordinaire dans « perfection : » (`app.js`, l. 108, encadré masqué).

## Ce qui est correct

- **Voix off :**
  - le WER est de 0 sur les 15 répliques ;
  - « Pensé » est juste (Whisper entend « Pensez », c'est un homophone).
- **Typographie :**
  - espaces fines dans les guillemets, devant « ; » et « ? » ;
  - « 1re partie », « XVIᵉ siècle », « 1712–1778 », « 2026–27 ».
- **Exactitude, vérifiée dans `education.js` et `moteur.js` :**
  - la flashcard reprend la l. 1333, le QCM la l. 1221 ;
  - Rousseau : 9 flashcards et 16 QCM ; Hugo : « 4 / 16 » ;
  - boîtes de Leitner : chaque tour, 10 min, 1 h, 6 h, 24 h (tableau `INTERVALS`) ;
  - « 15 questions entrelacées » est le libellé réel du site ;
  - les extraits de Rabelais, Rousseau, Flaubert, Hugo, Ferry et Péguy sont fidèles ;
  - la réplique de Balzac et « Quos ego → Virgile » sont justes ;
  - les compteurs de cartes à revoir passent de 12 à 11 de façon cohérente.

## Réglé depuis la v8

| Problème v8 | État |
|---|---|
| « comparaison. » seul sur sa ligne | Réglé : « …ce serait / une comparaison. » |
| « l'homme à la / société » et « nation, une / priorité » | Réglé |
| Espaces dans les notes du bureau et l'encadré « Piège » | Persistent, invisibles |

Les agrandissements des textes de la carte de fin n'ont créé aucun nouveau défaut.
