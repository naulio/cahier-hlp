"""Write SCRIPT.md (voice-over script, shot list, on-screen texts) from the real timeline.

The shot list is keyed on sync marks, so the document stays true after any
change of voice (another TTS take, Google voice...). Run after build_timeline.py.
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
L = json.loads((ROOT / "scripts" / "voice" / "lines.json").read_text())
TL = json.loads((ROOT / "logs" / "timeline.json").read_text())
M = TL["marks"]
by = {l["id"]: l for l in TL["lines"]}

# (repère de début, section, plan, image, texte à l'écran, son)
SHOTS = [
    (0.0, "Hook", "1. Polaroids",
     "Ardoise sombre ; quatre Polaroids se posent un à un, chacun sur son nom ; les portraits se révèlent "
     "(gravures et photos du domaine public).",
     "Rabelais · Rousseau · Flaubert · Hugo (légendes manuscrites)",
     "Un petit impact de papier par Polaroid ; une note de piano par nom ; ambiance de pièce"),
    ("q_start", "Hook", "2. La question",
     "« Tu te souviens de tout ? » s'écrit sous les Polaroids ; très légère poussée de caméra sur « tout », puis recul.",
     "Tu te souviens de tout ?", "Un souffle doux ; nappe"),
    ("v3_start", "Problème", "3. L'accumulation",
     "Le bureau se remplit : feuilles de cours, notes au stylo, citations surlignées, post-it.",
     "Feuilles de cours (textes du chapitre)",
     "Glissés et petits impacts de papier, stylo, surligneur (discrets, adoucis dans les aigus)"),
    ("v5_mais", "Problème", "4. Le viseur",
     "Un viseur d'appareil photo cherche dans le désordre, fait la mise au point ; « Mais où ? ».",
     "—", "Moteur d'autofocus, bip de mise au point"),
    ("shutter", "Solution", "5. Déclic",
     "Déclic : l'image s'assombrit un instant ; le désordre se range, chaque feuille devient une carte.",
     "Cartes des textes", "Déclic d'appareil, avance du film, petits tics des cartes ; accord de fa"),
    ("v7_start", "Solution", "6. Le nom",
     "Le logo « Cahier d'HLP » apparaît (léger reflet) ; l'interface se construit autour.",
     "Cahier d'HLP · Humanités · Littérature · Philosophie", "Deux notes aiguës au piano ; souffle doux"),
    ("v8_start", "Expérience", "7. La fiche",
     "Clic sur Rousseau : la fiche s'ouvre ; l'auteur, l'époque, l'essentiel en 5 points, la citation surlignée.",
     "Fiche Rousseau", "Clic, tics des étiquettes, surligneur ; le groove démarre (piano, basse, arpège, sans batterie)"),
    ("v9_start", "Expérience", "8. Flashcards",
     "Les flashcards : la carte se retourne, clic sur « Je savais », elle passe dans la boîte suivante ; "
     "« Revient dans 1 h ».",
     "Boîtes de Leitner (chaque tour · 10 min · 1 h · 6 h · 24 h)", "Retournement de carte, clic, petit toc"),
    ("v10_start", "Expérience", "9. QCM",
     "Le QCM : la question est là dès l'arrivée ; la bonne réponse s'allume ; l'explication se déplie.",
     "Question 4 / 16 et explication", "Clic ; deux notes de piano sur « corrigés »"),
    ("v11_start", "Expérience", "10. La frise",
     "La ligne se trace, les neuf auteurs apparaissent ; un arc terracotta relie Rabelais à Arendt par-dessus la frise.",
     "Neuf auteurs, quatre siècles", "Une note montante par auteur ; mélodie de piano"),
    ("v12_start", "Communauté", "11. Gratuit, sans compte",
     "Respiration : fond vert profond ; « Gratuit. Sans compte. » ; le téléphone et la progression.",
     "Gratuit. · Sans compte. · Sans publicité · Rien n'est envoyé", "La musique respire (accords ouverts)"),
    ("v13_start", "Communauté", "12. La classe",
     "Le téléphone rejoint sa place dans le plan de classe ; « TG1 » ; toutes les places s'allument.",
     "TG1 · Lycée Notre-Dame · 2026–27", "Arpège montant, une note par rangée"),
    ("v14_start", "Fin", "13. Carton",
     "Les rangées deviennent les lignes du logo ; le nom, la promesse, l'adresse.",
     "Cahier d'HLP · Tout pour réviser, au même endroit. · naulio.github.io/cahier-hlp",
     "Résolution sur fa ; le motif du début revient sur les derniers mots"),
    ("capture", "Fin", "14. Dernier déclic",
     "Déclic : le carton devient un Polaroid posé sur l'ardoise du début ; légende manuscrite.",
     "TG1 — 2026–27", "Déclic, éjection du Polaroid, crayon ; deux dernières notes"),
]


def at(m):
    return m if isinstance(m, float) else M[m]


out = ["# Script, découpage et textes à l'écran", "",
       f"Durée : **{M['end']:.1f} s** · 4:3, 1440×1080, 30 i/s · voix : `{L.get('_voice', 'voir logs/voice_takes.json')}`", "",
       "Généré par `scripts/write_script_doc.py` à partir de la timeline réelle (les temps suivent la voix).", "",
       "## Voix off", "", "| # | Début | Fin | Texte |", "|---|---|---|---|"]
for l in L["lines"]:
    p = by.get(l["id"])
    if p:
        out.append(f"| {l['id']} | {p['at']:.2f} s | {p['end']:.2f} s | {l['text']} |")
out += ["", "Consigne de ton (Google TTS) : " + L["style_prompt"], "",
        "## Découpage", "", "| Début | Section | Plan | Image | Texte à l'écran | Son |", "|---|---|---|---|---|---|"]
for m, sec, name, img, txt, snd in SHOTS:
    out.append(f"| {at(m):.1f} s | {sec} | {name} | {img} | {txt} | {snd} |")
out += ["", "## Repères de synchro", "", "Tous les repères (`logs/timeline.json › marks`) :", "", "```"]
out += [f"{k:16s} {v:7.3f}" for k, v in sorted(M.items(), key=lambda kv: kv[1])]
out += ["```", ""]
(ROOT / "SCRIPT.md").write_text("\n".join(out))
print("SCRIPT.md", len(out), "lignes")
