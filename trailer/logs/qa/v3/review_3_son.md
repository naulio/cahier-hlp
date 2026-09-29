# Évaluateur 3 : son, musique, mixage (v3)

**Note : 7/10**, mix : 7,5/10. Par section : hook 7,5 · problème 7 · révélation 8 · expérience 6,5 · communauté 6,5 · fin 7.

Méthode : je n'ai rien écouté. Tout vient des mesures sur les stems (niveaux par fenêtres de 0,4 s, bande 1-4 kHz, détection d'attaques), de `fx_track.js`, de `music.py` et de `mix.py`. Je ne peux pas juger le timbre, c'est-à-dire si les sons procéduraux font « cheap » ou non.

## Problèmes

1. **La musique ne porte pas l'énergie (tout le film).**
   - Niveau : −23,9 LUFS, contre −24,4 en v1 (+0,5 dB seulement). Elle reste 10,6 LU sous la voix et 4,6 LU sous les SFX (−19,3).
   - La voix occupe environ 96 % du temps, donc le ducking de 5 dB s'applique presque en permanence.
   - Sur des fenêtres de 2 s, le niveau plafonne entre −25 et −22 dB de 20 à 39 s. La finale (48-52 s) est moins forte que la frise.
   - Correction : `MUSIC_GAIN` +3 dB. Remplacer le ducking large bande par un creux de 6 dB sur 1-4 kHz, pour que batterie et basse gardent leur punch. Ajouter +4 dB d'automation dans les trous de voix (13,9-15,6 · 19,4-20,5 · 46,6-47,8 · 51,2-fin).

2. **Expérience (20,6-39,6 s) : boucle sans relance.**
   - Toujours F–Am7–Dm7–B♭maj7, avec arpège, charleston et shaker : la critique « tech corporate » de la v1 tient toujours. Seule relance : 34 s.
   - Les filés (28,06 · 30,79 · 33,84) tombent 100 à 170 ms hors de la grille musicale.
   - Correction : caler les whips sur les temps. Couper la batterie un temps et ajouter un souffle inversé avant chaque filé. Changer de basse ou d'accords au passage QCM → frise.

3. **Communauté : le rythme boite.**
   - À 39,56 s (`brk`), la pulsation repart sur une nouvelle grille, décalée de 0,4 temps (270 ms) par rapport au groove.
   - Le roulement (45,13-47,8) part de `v14 − 1 mesure` et se trouve décalé de 240 ms sur la pulsation. Caisses claires mesurées à 45,13 · 45,56 · 45,80 · 46,22 · 46,46 : intervalles irréguliers.
   - Correction : démarrer la respiration sur un temps de `g1` et aligner `roll0` sur la grille de `brk`.

4. **Frise (34,2-35,1 s) : piano et pops ne tombent pas ensemble.**
   - Les 9 notes de piano sont régulièrement espacées. Les 9 pops, comme les nœuds à l'image, suivent l'accélération de `nodeTimes()`. Écarts jusqu'à 137 ms.
   - En plus, whoosh_long (33,84-35,2) et whoosh_3 passent sous « Et une frise ». Dans la bande 1-4 kHz, les SFX ne sont qu'à 3 dB sous la voix.
   - Correction : passer `nodeTimes()` à `music.py`, supprimer whoosh_long, baisser les pops à −24 dB.

5. **Effets posés sur des mots clés.**
   - 15,59-15,67 : whoosh_2 et whoosh_3 sur « Alors ». En large bande, avec la queue de l'impact et le sub, les SFX dépassent la voix de 9 à 14 dB.
   - 18,5 et 48,64 : shimmer sur « d'HLP », donc sur le nom, deux fois.
   - 40,34 : hit_small sur « sans compte », au même niveau que la voix en 1-4 kHz.
   - Correction : whooshes à 15,40 et 15,48, shimmers après le mot (19,2 et 49,1), hit à 40,20. Baisser de 5 dB sous la voix (au lieu de 2 dB) les SFX soutenus : queues d'impact, shimmer, sub.

6. **Répétitions.**
   - pop ×35 (3 sons), whoosh ×28 (5 sons), shimmer ×7, ui_tick ×16.
   - 25,07-25,59 : cinq pop_1 identiques (même gain, même panoramique), effet mitraillette.
   - 6,09-9,63 : six fois le même geste whoosh → papier, espacés de 420 ms.
   - Correction : alterner les échantillons et varier chaque occurrence de ±1-2 demi-tons et ±2 dB. Faire monter l'accumulation d'un demi-ton par feuille. Garder 2 ou 3 shimmers au plus.

7. **Fin sans conclusion musicale.**
   - Le dernier accent musical est à 48,15. Le Polaroid à 52,53 ne repose que sur les SFX, puis tout reste sous −40 dB de 54 à 56,8 s.
   - Correction : placer un accord final pile sur `capture` (fa grave, fa aigu et sub, 3 s de réverbération).

8. **Hook.**
   - La musique est à −33 dB, 16 dB sous la voix. Tout repose sur quatre fois le même groupe déclic, fizz, impact, papier.
   - Correction : faire monter le bourdon de 3 dB à chaque nom et faire du 4e impact un vrai coup grave.

## Ce qui marche (à garder)
- 2,4 fois plus de SFX (62 → 146), calés par construction : ils viennent de la même feuille de cues que les VFX.
- La montée, la coupure sur « Mais où ? », puis riser et souffle inversé jusqu'au déclic de 15,29 (impact, sub, kick, fa add9) : c'est le meilleur moment, synchronisé à 20 ms près.
- À 48,13-48,16, impact, sub, kick et caisse claire forment un seul coup final.
- Dans la bande 1-4 kHz, les SFX restent en général 7 à 10 dB sous la voix. Le passe-bas à 5,5 kHz sous la voix est une bonne idée.
- Mix conforme : −14,09 LUFS, −1,05 dBTP, 4 dB de réduction au plus, pas de saturation.

## Par rapport à la v1
- **Mieux** : les SFX sont enfin audibles et denses, la pulsation tient jusqu'au nom, il y a un coup final.
- **Pas réglé** : grille d'accords et arpège « corporate », musique au même niveau qu'en v1, répétitions (air_soft ×8 devient pop ×35), fin creuse.
- **Abîmé** : les décalages rythmiques (39,6 s et 45-48 s) et les décalages piano/pops de la frise n'existaient pas en v1.

**Non vérifiable sans écoute** : le grain des whooshes procéduraux, le pompage du ducking (relâchement de 450 ms), le masquage réel sur « compte ».
