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
     "Bureau sombre ; quatre Polaroids tombent chacun sur son nom, avec un flash d'appareil et un impact de caméra ; "
     "les photos se développent (portraits du domaine public).",
     "Rabelais · Rousseau · Flaubert · Hugo (légendes manuscrites)",
     "Souffle inversé vers le premier nom ; déclic + flash + impact par nom ; une note de piano par nom (90 BPM)"),
    ("q_start", "Hook", "2. La question",
     "« Tu te souviens de tout ? » s'écrit mot à mot ; poussée de caméra sur « tout », grand recul, halo chaud.",
     "Tu te souviens de tout ?", "Grand souffle sur le recul, chute grave"),
    ("v3_start", "Problème", "3. L'accumulation",
     "Les feuilles arrivent de tous côtés, secousses légères à chaque impact ; surligneur, notes ; vignette qui se resserre.",
     "Feuilles de cours, post-it, fiches bristol",
     "Souffle + impact de papier par feuille ; surligneur ; montée de 4 s jusqu'au déclic ; pulsation et caisse claire"),
    ("v5_mais", "Problème", "4. Le viseur",
     "Le viseur cherche (trois visées, mise au point), la musique s'arrête sur « Mais où ? ».",
     "—", "Trois souffles de visée, déclic de mise au point"),
    ("shutter", "Solution", "5. Déclic",
     "Éclair blanc, séparation des couleurs, secousse ; les objets s'envolent ; chaque feuille devient une carte.",
     "Cartes des textes", "Déclic + impact + chute grave + flash ; deux souffles ; pops des cartes ; accord de fa"),
    ("v7_start", "Solution", "6. Le nom",
     "Le logo apparaît avec un éclat ; reflet lumineux sur « Cahier d'HLP » ; filé horizontal vers l'interface qui se construit.",
     "Cahier d'HLP · Humanités · Littérature · Philosophie", "Impact sur le nom, scintillement, souffle du filé, clics du menu"),
    ("v8_start", "Expérience", "7. La fiche",
     "Clic sur Rousseau : la carte devient la fiche ; zooms sur l'auteur, l'essentiel, la citation surlignée (reflet).",
     "Fiche Rousseau", "Clic, souffles des zooms, pops des étiquettes et des 5 points, surligneur, groove"),
    ("v9_start", "Expérience", "8. Flashcards",
     "Filé vers les flashcards ; la carte se retourne, file dans la boîte 3 ; « Revient dans 4 jours ».",
     "Boîtes de Leitner", "Filé, retournement, carte qui tombe, pop"),
    ("v10_start", "Expérience", "9. QCM",
     "Filé vers le QCM ; la bonne réponse s'allume (éclat vert) ; l'explication se déplie.",
     "Question et explication", "Clic, scintillement de bonne réponse, deux notes de piano"),
    ("v11_start", "Expérience", "10. La frise",
     "Grand filé vers la frise ; la ligne se trace, les neuf auteurs apparaissent ; arc terracotta de Rabelais à Arendt.",
     "Neuf auteurs, quatre siècles", "Grand souffle, un pop par auteur, impacts sur Rabelais et Arendt, mélodie de piano"),
    ("v12_start", "Communauté", "11. Gratuit, sans compte",
     "Fond vert profond, halo chaud ; « Gratuit. Sans compte. » claquent ; le téléphone et la progression.",
     "Gratuit. · Sans compte. · Sans publicité · rien n'est envoyé", "Impacts sur les mots, tics de la progression"),
    ("v13_start", "Communauté", "12. La classe",
     "Le téléphone rejoint sa place dans le plan de classe ; « TG1 » ; toutes les places s'allument en vague.",
     "TG1 · Lycée Notre-Dame · 2026-27", "Impact sur TG1, vague de pops, scintillement, roulement et montée vers le nom"),
    ("v14_start", "Fin", "13. Carton",
     "Les rangées deviennent les lignes du logo ; éclat et secousse ; reflet sur le nom ; promesse ; adresse.",
     "Cahier d'HLP · Tout pour réviser, au même endroit. · naulio.github.io/cahier-hlp",
     "Impact + chute grave, scintillement ; le motif du début revient et se pose sur fa"),
    ("capture", "Fin", "14. Dernier déclic",
     "Éclair : le carton devient un Polaroid posé sur le bureau ; légende manuscrite ; fondu au noir.",
     "TG1 · 2026-27", "Déclic + impact + éjection du Polaroid, crayon"),
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
