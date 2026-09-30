# Évaluateur 6 : orthographe, typographie, exactitude (v10)

## Note : 9,5/10 (v9 : 9)

Je n'ai trouvé aucune faute d'orthographe, d'accord ni de fait, à l'écran comme dans la voix off. Les trois défauts visibles de la v9 sont corrigés, et je n'en ai pas trouvé de nouveau.

## Fautes restantes (invisibles à l'écran)

1. **Notes du bureau (`desk.js`, l. 33-36 et 45).** On a une espace ordinaire devant « ? » et « ! » : « problématique ? », « Arendt ?? », « à revoir ! », « 4 h ! ». Les retours à la ligne sont forcés, donc aucune coupure n'est possible.
   **Correction :** remplacer ces espaces par `&#8239;`.
2. **Encadré « Piège », masqué (`app.js`, l. 108).** On a « perfection : » avec une espace ordinaire.
   **Correction :** « perfection&nbsp;: ».

## Ce qui est correct

- **Voix off :**
  - le WER est de 0 sur les 15 répliques ;
  - « Pensé » est juste (Whisper entend « Pensez », c'est un homophone).
- **Typographie :**
  - espaces fines dans les guillemets ;
  - espace insécable dans « 52 % » ;
  - « 1re partie », « XVIIIᵉ siècle », « 1712–1778 », « 2026–27 ».
- **Exactitude, vérifiée dans `education.js` et `moteur.js` :**
  - boîtes de Leitner : 10 min, 1 h, 6 h, 24 h (tableau `INTERVALS`) ;
  - examen blanc : « 20 questions · 20 min » ;
  - la réplique « Vous ne faites rien, Lambert ! » et « régime pénitentiaire » sont justes ;
  - le vers de Hugo et « la faculté de se perfectionner » sont exacts ;
  - les compteurs passent de 12 à 11 de façon cohérente ;
  - « quatre siècles » (1534-1958) tient.

## Réglé depuis la v9 (vérifié sur les images)

| Problème v9 | État |
|---|---|
| « quel / procédé ? » coupé | Réglé : « quel procédé ? » sur une seule ligne (35,5 s) |
| Titre de l'œuvre en romain | Réglé : *Discours sur l'origine…* est en italique (26,5 s) |
| Renvois de Hugo alignés à gauche | Réglé : retrait par espaces cadratins, conservé malgré `nowrap` |

Ces corrections n'ont rien abîmé.
