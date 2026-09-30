# Évaluation n°3 : son, musique, mixage (v11)

**Note : 9,2/10** (mix : 9,1). **Livrable : oui.**

Rien n'a été écouté. J'ai recalculé le limiteur à partir des stems : l'écart avec le master est de −76 dB.
Invérifiables : le timbre, le naturel des pauses, la perception des tics.

## Ce qui marche
- **Fidèle à la v1.** Aucun stem de batterie (piano, nappe, basse, arpège). 53 bruitages. La voix est 11,4 LU au-dessus de la musique. −14,05 LUFS, −1,06 dBTP.
- **« -lais à » (39,5 s) : enfin réglé.** La limitation passe de 1,71 à 0,73 dB. Le maximum du film, 1,72 dB, tombe sur le déclic de 16,02 s et non sur la voix.
- **Tics.** Trois sons différents, entre −21 et −25 dB : discrets.
- **Pauses.** Les quatre (« claire », « auteur », « HLP », « réviser ») tombent dans un vrai silence, entre −50 et −77 dB, sans clic mesurable.
- **« endroit ».** La voix a 14 à 17 dB d'avance, et 4 à 7 dB sur « -oit », ce qui est normal. Un creux de −2 dB suffit.

## Problèmes
1. **37,32-37,50 s, « pour (relier) ».** Une note de piano (+9 dB) attaque juste quand la voix reprend après la pause de « frise ». Entre 1 et 4 kHz, la voix n'a que 0 ± 3 dB d'avance, contre 17,7 dB en médiane. C'est le passage le plus masqué du film.
   *Correction :* ajouter un creux de −3 dB de `M["v11_relier"] - 0.24` à `+ 0.02`, ou baisser cette seule note de 4 dB.
2. **48,4 s, « classe ».** L'écart vient de la sifflante. Ne rien toucher.
3. **Optionnel, 61,4 s.** Le son s'arrête à −54 dB sans fondu. Ajouter un fondu de 50 ms.

## v10 → v11
Le pic, les tics et les pauses sont réglés. Rien d'abîmé de mesurable.
