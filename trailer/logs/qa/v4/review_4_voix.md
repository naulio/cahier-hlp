# Revue 4 : voix off (v4)

**Note : 7,5/10** (cible ≥ 9). Hook (V01-V02) 8,5 · Problème (V03-V05b) 8,5 · Révélation (V06-V07) 6 · Expérience (V08-V11) 7,5 · Fin (V12-V14) 7.

Méthode : j'ai mesuré les fichiers `processed/` réellement placés dans la timeline (enveloppes, silences internes, contour de F0 avec pyin, MFCC). Je n'ai rien écouté.

## Vérifié
- **Pas de décalage de hauteur** : la comparaison trame à trame entre les prises brutes et les fichiers traités donne 0,0 demi-ton. La voix B est intacte.
- WER de 0 sur les 15 répliques, confiance de 0,80 à 0,997. Timbre homogène : aucune valeur aberrante, hormis ce qu'expliquent les voyelles [u]/[o]. Voix à −12,9 LUFS, musique à −23,4.
- Les noms du hook tombent à ±30 ms de la grille de 0,667 s. Chaque nom retombe (−7 à −9 demi-tons), ce qui donne une vraie lecture « point par point ».
- « Tu te souviens de tout ? » monte bien : +8,9 demi-tons en fin de phrase.

## Problèmes
1. **17,69 s : attaque de « dans » probablement rognée.** La prise V07 retenue commence sans silence (−41 dB puis −25 dB en 10 ms), sur le nom du produit. C'est aussi la réplique la moins sûre (confiance 0,799) et l'une des plus rapides (5,4 syll/s). *Correction* : prendre `V07_kyutai_37d7ecc452` (confiance 0,908, attaque propre, 1,78 s). Elle n'a perdu qu'à cause de la pénalité « traînant » du score, qui n'a pas de sens pour un nom de marque de 4 mots.
2. **15,6-17,7 s : suspension déplacée.** Le « … » du script suit « rassemblé », mais la seule vraie pause suit « Alors » (0,43 s). Entre « rassemblé » et « dans », il n'y a que 0,25 s. *Correction* : retirer la virgule du `tts` (« Alors on a tout rassemblé... ») et passer V07 à `"+0.45"`. La durée totale ne change pas.
3. **34,0-38,4 s : V11 hachée.** Trois silences (0,36 / 0,38 / 0,53 s) séparent des morceaux rapides (5,8 syll/s entre les pauses). Le silence de 37,08 s coupe « de Rabelais | à Arendt », ce que le script ne prévoit pas. *Correction* : le réduire à ~0,15 s (coupe dans le silence, fondus de 10 ms) et recaler `v11_arendt`, ou générer de nouvelles prises.
4. **47,7-51,0 s : la phrase finale est pressée.** Elle va à ~5 syll/s, contre 3,6 pour V08. Le point après « HLP » ne dure que ~0,1 s (Whisper entend une virgule). Le ralentissement de fin ne repose que sur les silences entre répliques (1,0 / 0,8 / 1,4 s), pas sur le débit. *Correction* : ajouter `"pauses": [["HLP", 0.3]]` et un étirement léger de 0,94 (Rubber Band, formants préservés, comme pour V02). Pas davantage, pour ne pas retomber dans la voix « longue » de la v2.
5. **13,2 s : « Mais où ? » descend** (−7,9 demi-tons). C'est courant en français pour une question partielle, mais à vérifier à l'oreille. Le drapeau `question` n'existe dans aucune réplique de `lines.json` et `final_rise_st` n'est jamais calculé : la règle du score ne s'applique pas.
6. **44,1-45,3 s : « Pensé en TG1 »** est rapide (5,6 syll/s), mais reste acceptable.

## Invérifiable sans écoute
- Les artefacts de l'étirement (0,88 / 0,9) sur V02 et V05b.
- La netteté de « Rabelais » (confiance 0,75, la plus basse des noms).
- Les souffles entre les phrases.

À noter aussi : `voice_metrics.json` v4 est identique à celui de la v3 et porte sur les prises brutes, pas sur les fichiers traités.

## À garder
- La voix B sans traitement de hauteur et la chaîne d'égalisation légère.
- La grille des noms.
- Les enchaînements serrés du « problème » (0,34 à 0,6 s entre répliques).
- Le calme de V08 (pauses aux virgules) et la montée de V02.
