/* =======================================================================
   MODÈLE DE LEÇON — à copier en lecons/<id>.js (ce fichier-ci n'est PAS chargé).
   Une leçon = un chapitre = un corpus de textes étudiés en classe.

   Pour la publier :
     1. copier ce fichier en lecons/<id>.js et le remplir ;
     2. ajouter dans index.html, avant app/demarrage.js :
          <script src="lecons/<id>.js?v=1"></script>
     3. node outils/verifier.mjs --tamponner   (0 erreur exigée)
     4. tester en local, puis git commit + git push (voir CLAUDE.md).

   Règles :
   - Identifiants (leçon et textes) : minuscules, chiffres, « _ » ; uniques
     dans TOUT le cahier (un id de texte ne peut pas resservir ailleurs).
   - Le HTML autorisé dans les textes : <b> <em> <i> <p> <ul> <ol> <li> <br>.
   - Textes encore protégés (auteur mort il y a moins de 70 ans, traductions,
     adaptations, pages de manuel) : citations COURTES seulement, pas de photo.
   - Tout ce qui est facultatif peut être omis : l'activité correspondante
     disparaît simplement du menu (ex. pas de « palais » → pas de palais).
   ======================================================================= */
(function () {
"use strict";

/* Schémas propres au chapitre (facultatif) : onglets de la page Graphiques.
   render(box, api) dessine dans box ; api = { esc, icon, tchip, tc, tabsHtml, $, $$, S, save, onCleanup, go, toast }.
   Couleur d'un texte en CSS : var(--c-<idTexte>). */
const SCHEMAS = [
  { id: "exemple", titre: "Schéma d'exemple", texte: "modele1", render(box, api) {
    box.innerHTML = `<div class="card" style="${api.tc("modele1")}">${api.tchip("modele1")}<p>Un schéma simple, en HTML ou en SVG.</p></div>`;
  } }
];

CAHIER.lecon({
  /* ---------- identité du chapitre ---------- */
  id: "modele",                        // = nom du fichier (lecons/modele.js)
  ordre: 99,                           // position dans la liste des chapitres
  programme: "s1-sensibilite",         // id d'un thème de config.js › programme (facultatif)
  titre: "Titre du chapitre",
  partie: "Semestre 1 · La recherche de soi",
  problematique: "La question qui guide le chapitre ?",
  resume: "Une phrase qui présente le corpus (affichée sous la problématique).",
  icon: "book",                        // une icône du sprite de index.html (ou de « icones » ci-dessous)
  couleur: ["#4a2fa8", "#c4b2ff"],     // facultatif : [clair, sombre]
  libelles: { ideologie: "Vision de l'auteur", problematique: "Problématique" }, // noms courts des sections
  numerotation: "",                    // facultatif : note sur la numérotation des feuilles
  friseIntro: "",                      // facultatif : phrase d'introduction de la frise
  palais: { nom: "Le musée-mémoire", intro: "" }, // facultatif : nom du palais de mémoire
  exercicesIntro: "",                  // facultatif
  // icones: { plume: '<path d="M4 20c6-2 11-8 14-16"/>' },  // facultatif : icônes 24×24 en plus

  /* ---------- textes (ordre chronologique) ---------- */
  textes: [
    {
      id: "modele1",                   // court et unique : ex. "hugo_contemplations"
      short: "Auteur, titre court",    // étiquette partout dans l'appli
      auteur: "Prénom Nom", auteurDates: "1802-1885",
      auteurCourt: "Nom",              // facultatif (sinon : dernier mot de « auteur ») — sert au « Qui a dit ? »
      titre: "Titre de l'extrait (celui de la feuille)",
      oeuvre: "Œuvre, chapitre", date: "1856", annee: 1856,   // « annee » : nombre, pour la frise
      genre: "Poésie lyrique", mouvement: "Romantisme",
      nums: { prof: "1", imprime: "TEXTE 1", detail: "" },   // facultatif : numérotation des feuilles
      icon: "lamp", couleur: ["#dc631e", "#fd9320"],          // couleur facultative (sinon palette auto)
      motcle: "Un mot-clé", symbole: "Un objet-symbole",
      essentiel: [                     // 5 points « À savoir absolument » (le 5e = la problématique)
        "<b>Auteur</b> (dates) : qui, quand, quel mouvement.",
        "Ce que dit l'extrait, en une phrase.",
        "Procédés clés : <b>…</b>.",
        "Ton, registre, visée.",
        "Problématique : réponse du texte à la question du chapitre."
      ],
      auteurHtml: "<p>Biographie utile (vie, œuvres, engagements).</p><ul><li>…</li></ul>",
      anecdotes: [["Une anecdote vérifiée.", "https://source-verifiee.fr/page"]],   // [texte, source]
      epoque: "<p>Contexte historique.</p>",
      mouvementHtml: "<p>Le mouvement littéraire.</p>",
      ideologie: "<p>La vision défendue par l'auteur.</p>",
      oeuvreHtml: "<p>L'œuvre entière.</p>", place: "<p>Place de l'extrait dans l'œuvre.</p>",
      extrait: {
        resume: "Résumé de l'extrait.",
        mouvements: ["l. 1-5 · Premier mouvement", "l. 6-12 · Deuxième mouvement"],
        procedes: [["Métaphore", "« citation courte »", "Effet produit."]],
        ton: "Lyrique, élégiaque…"
      },
      problematique: "<p>Réponse argumentée à la problématique du chapitre.</p>",
      citations: [["« Citation à retenir »", "Pourquoi elle compte."]],
      annotations: [["l. 3, souligné", "« mot souligné en classe »", "Explication."]],   // notes de cours
      pieges: ["Confusion classique à éviter."],
      radar: { axe1: 3, axe2: 4, why: "Justification des valeurs (0 à 5)." },       // clés = radarAxes
      carte: { x: 7, y: 6, why: "Justification de la position (0 à 10)." },          // axes = carteAxes
      palais: { court: "Salle courte", salle: "La salle du …", objet: "Un objet", image: "Une image mentale frappante." }
      // photos: [{ src: "img/xxx.jpeg", label: "…" }]  ← UNIQUEMENT pour des documents libres de droits
      // videos: [{ titre: "…", url: "https://…", chaine: "Lumni", duree: "5 min", note: "" }]
      // sameAuthorAs: "idAutreTexte"  ← même auteur qu'un texte précédent (reprend sa biographie)
    }
  ],

  /* ---------- entraînement ---------- */
  // [texte ("all" = transversal), niveau F/C/A/T, question, [BONNE, fausse, fausse, fausse], explication, section de la fiche]
  questions: [
    ["modele1", "F", "Question factuelle ?", ["Bonne réponse", "Fausse 1", "Fausse 2", "Fausse 3"], "Explication courte.", "essentiel"]
  ],
  flashcards: [["modele1", "Recto : une question", "Verso : la réponse"]],     // [texte, recto, verso]
  pieges: [["Titre du piège", "Explication.", "modele1"]],                        // [titre, explication, texte ou "all"]
  frise: [[1848, "Révolution de 1848", "Histoire"]],                              // [année, libellé, calque]
  duels: [],                          // { a, b, titre, lignes: [[gauche, droite]], synthese, q: [question, [BONNE, …], explication] }
  procedes: [],                       // [texte, phrase, BON procédé, [3 faux], explication]
  trous: [["modele1", "Une phrase avec des {mots} à {retrouver}."]],
  associations: [],                   // { titre, paires: [[a, b, note?]], n: 8 }
  radarAxes: [["axe1", "Premier axe"], ["axe2", "Deuxième axe"]],
  carteAxes: { x: ["Gauche", "Droite"], y: ["Bas", "Haut"] },
  exercices: [
    // { type: "revele", texte, titre, consigne, qcm: "Question avec {q}", items: [{ q, r (html), bonne, exp }] }
    // { type: "corrige", texte, titre, consigne, bouton, html, ouvert }
    // { type: "association", texte, titre, consigne, paires: [[a, b, note]], suite: { titre, html } }
    // { type: "questions", texte, titre, items: [[question, réponse html]] }
  ],
  schemas: SCHEMAS,
  sources: [["Auteur", "Libellé de la source", "https://source-verifiee.fr/page"]]
});

})();
