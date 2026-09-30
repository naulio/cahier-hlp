# Revue 4 : voix off (v12)

**Note : 8,8/10** (v11 : 8,0). J'ai mesuré les fichiers `processed/` et `stem_voice.wav`, et passé Whisper medium sur chaque côté des pauses insérées. Je n'ai rien écouté.

## Réglé
- **V08, 24,76 s** : 80 ms ajoutés au milieu d'un vrai silence de 122 ms, soit 203 ms au total. Avant la coupe, Whisper entend « …claire l'auteur », après, « L'époque ». Plus de « l'au…teur ».
- **V14, 51,69 s (« HLP »)** : 300 ms, pour un trou de 353 ms au total. La queue commence par « Tout », sans perte.
- **V14, 53,39 s (« réviser »)** : 100 ms, pour 290 ms au total, avec −79 et −91 dB autour de la coupe. La queue commence par « au même endroit ».
- WER 0 partout, et aucun décalage de hauteur.

## Reste (mineur)
1. **24,24 s** : le deux-points après « claire » ne s'entend pas. Il n'y a aucun silence, et la hauteur tombe sur « claire » puis repart au même niveau sur « l'… ». Whisper n'y met pas de virgule. *Correction facultative* : ne pas insérer de pause à cet endroit. Il faudrait plutôt régénérer V08 avec « claire… l'auteur » et ne garder qu'une prise qui a naturellement au moins 120 ms de silence à cet endroit, avec la même intonation.
2. **Dans le pipeline** : `insert_pause` ne revérifie toujours pas les deux côtés de la coupe avec Whisper. Il faut ajouter ce contrôle.

## Invérifiable sans écoute
Je ne sais pas si les 300 ms de silence numérique après « HLP » sonnent collées, ni si « claire l'auteur » se comprend bien.

## Verdict
**Cette version peut être livrée.**
