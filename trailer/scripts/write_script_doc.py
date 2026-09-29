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
     "Bureau sombre, flaque de lumière chaude. Quatre Polaroids tombent un par un sur chaque nom et se développent "
     "(Rabelais, Rousseau, Flaubert, Hugo : portraits du domaine public).",
     "Légendes manuscrites des Polaroids", "Room tone ; impact de papier sur chaque nom ; une note de piano par nom (la–do–ré–mi)"),
    ("q_start", "Hook", "2. La question",
     "« Tu te souviens de tout ? » s'écrit mot à mot ; « tout » souligné en terracotta ; grand recul de caméra : "
     "le bureau est couvert de feuilles.", "Tu te souviens de tout ?", "Souffle long sur le recul ; bourdon de ré"),
    ("v3_start", "Problème", "3. L'accumulation",
     "Les feuilles de cours arrivent (textes, plan, procédés), post-it posés d'un geste, surligneur, notes au stylo. "
     "Ostinato de piano qui s'empile.", "Contenu des feuilles (extraits courts du domaine public, notes)",
     "Trois glissés de feuilles, post-it, surligneur, stylo ; percussions de papier dans la musique"),
    ("v5_tout", "Problème", "4. Le viseur",
     "Un viseur de Polaroid cherche : stigmomètre qui se dédouble, deux visées, mise au point verrouillée.",
     "—", "La musique s'arrête sur « Mais où ? » ; note tenue, souffle inversé"),
    ("shutter", "Solution", "5. Déclic",
     "Éclat d'exposition (sans image noire) ; les objets s'envolent ; chaque feuille devient une carte de l'application.",
     "Cartes des textes (auteur, titre, année)", "Déclic + éjection du Polaroid ; accord de fa (add9)"),
    ("v7_start", "Solution", "6. Le nom",
     "Le symbole « c’ » se dessine (réglure Seyès, marge rouge, carré kaki) au-dessus de la grille ; le nom s'écrit ; "
     "le symbole rejoint la barre latérale et la fenêtre se construit autour des cartes.",
     "Cahier d’HLP · Le site de révision d’HLP · Terminale", "Si♭ sur « dans le » ; souffle doux à la construction"),
    ("v8_start", "Expérience", "7. La fiche",
     "Toucher sur la carte Rousseau : elle devient l'en-tête de la fiche ; l'essentiel en 5 points ; citation clé "
     "surlignée ; note manuscrite « noté en cours ».", "Fiche Rousseau (Discours sur l’origine de l’inégalité)",
     "Clic ; surligneur ; crayon ; ostinato du motif en croches"),
    ("v9_start", "Expérience", "8. Flashcards",
     "Carte bristol retournée, « Je savais », la carte file dans la boîte 3 ; tampon « REVIENT DANS 1 HEURE ».",
     "Boîtes : tout de suite · 10 min · 1 h · 6 h · 1 jour", "Retournement de carte, clic, carte qui tombe, tampon"),
    ("v10_start", "Expérience", "9. QCM",
     "Question, quatre réponses ; la bonne s'allume ; l'explication se déplie.", "Question et explication",
     "Clic ; deux notes aiguës pour la bonne réponse"),
    ("v11_start", "Expérience", "10. La frise",
     "Toucher sur « Frise » : l'axe naît du menu ; neuf auteurs s'allument ; les Polaroids du début reviennent, "
     "rangés ; un trait relie Rabelais à Arendt.", "Neuf auteurs, quatre siècles", "Trait de feutre ; une note par auteur"),
    ("v12_start", "Communauté", "11. Gratuit, sans compte",
     "La page s'ouvre en cercle depuis « Arendt » : page Seyès, « Gratuit. » et « Sans compte. » écrits à la main ; "
     "un téléphone glisse sur la page.", "Gratuit. · Sans compte. · TG1 · Lycée Notre-Dame · 2026–27",
     "Écriture au crayon ; accords ouverts (respiration)"),
    ("v13_start", "Communauté", "12. Le plan de classe",
     "Plan de classe au crayon (tableau, 18 tables) ; « TG1 » entouré ; le téléphone rejoint une place ; "
     "une coche, puis toute la classe, stylo par stylo, sans métronome.", "tableau · TG1",
     "Crayon ; coches irrégulières ; arpège qui monte sur « toute la classe »"),
    ("v14_start", "Fin", "13. Carton",
     "Les rangées de tables deviennent la réglure du symbole ; carré kaki, marge, « c’ » ; nom ; « Tout est là. » "
     "surligné ; adresse du site.", "Cahier d’HLP · Tout est là. · naulio.github.io/cahier-hlp",
     "Résolution en fa ; le motif du hook revient et se pose sur « là »"),
    ("capture", "Fin", "14. Dernier déclic",
     "Le carton devient un Polaroid posé sur le bureau du début ; légende et adresse écrites à la main ; fondu.",
     "TG1 · 2026–27 · naulio.github.io/cahier-hlp", "Déclic + éjection ; crayon ; dernier accord"),
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
