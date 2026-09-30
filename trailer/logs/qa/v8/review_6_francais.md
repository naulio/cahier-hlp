# Évaluateur 6 : orthographe, typographie, exactitude (v8)

## Note : 9/10 (v7 : 8)

Il n'y a aucune faute d'orthographe, d'accord ni d'exactitude, à l'écran comme dans la voix off. Les défauts visibles de la v7 sont presque tous corrigés. Il reste une coquille de mise en page visible et quelques détails invisibles.

## Fautes restantes

1. **Mot seul en fin de paragraphe (≈ 35,5-37 s, explication du QCM).** « comparaison. » reste seul sur la deuxième ligne. Ce défaut était déjà signalé en v7.
   **Correction (`app.js`, l. 181) :** élargir le bloc d'environ 30 px, ou écrire `ce serait une comparaison.`
2. **Coupures des titres sur deux lignes (≈ 21-24 s).** On lit « …l'homme à la / société » et « …de la nation, une / priorité ». L'article reste en fin de ligne et le dernier mot est seul.
   **Correction :** écrire `l’homme à la société` et `une priorité`.
3. **Espaces ordinaires dans les notes manuscrites du bureau (`desk.js`, l. 33-45).** Cela concerne « problématique ? », « émancipe-t-elle ? », « Arendt ?? », « à revoir ! », « perfection ! », « déf. ! » et « 4 h ! ». Les `<br>` empêchent toute coupure, donc le défaut ne se voit pas.
   **Correction :** remplacer ces espaces par ` `, comme dans `onscreen_content.js`.
4. **Encadré « Piège » (`app.js`, l. 108).** Il y a encore une espace ordinaire dans « perfection : ». L'encadré est masqué, donc c'est invisible.

## Ce qui est correct

- **Voix off :**
  - le WER est de 0 sur les 15 répliques ;
  - « Pensé » s'accorde bien avec « le Cahier ». Whisper entend « Pensez », mais c'est un homophone.
- **Typographie :**
  - espaces fines dans « Le « nouveau » », « l'être « perfectible » » et le QCM ;
  - « XVIᵉ », « 1re partie » ;
  - « 1712–1778 », « 2026–27 », « 10 min » et « 1 h ».
- **Exactitude :**
  - les extraits de Rabelais, Rousseau, Flaubert, Hugo, Ferry et Péguy sont fidèles au texte ;
  - les dates vont de 1534 à 1958 ;
  - le QCM et la flashcard correspondent mot pour mot à `education.js` ;
  - les compteurs sont cohérents : 5 + 4 + 7 + 3 + 11 = 30 cartes, puis 5 + 3 + 8 + 3 + 11 = 30, et le nombre de cartes à revoir passe de 12 à 11 partout ;
  - « Neuf auteurs, quatre siècles » est juste.

## Réglé depuis la v7

| Problème v7 | État |
|---|---|
| Titres tronqués par « … » | Réglé : ils passent sur deux lignes (point 2 : finition) |
| « s » de « Rabelais » caché | Réglé (image à 5,5 s) |
| Bulle affichée avant les compteurs | Réglé : à 32,05 s, tout est ancien ; à 32,5 s, tout est à jour |
| « ESSAI ENGAGÉ » | Réglé : « BELLE ÉPOQUE » |
| Guillemets absents dans la note sur Arendt | Réglé |
| Mot « comparaison. » seul sur sa ligne | **Persiste** (point 1) |
| Espace dans l'encadré « Piège » | Persiste, invisible |

Les corrections n'ont créé aucun nouveau défaut.
