/* =====================================================================
   Contenu affiché dans le trailer.
   Tout vient du vrai chapitre du Cahier d'HLP (lecons/education.js) :
   auteurs, dates, questions de QCM, flashcards. Rien d'inventé.
   Extraits littéraires : uniquement des textes du domaine public.
   ===================================================================== */
window.CONTENT = {
  brand: {
    name: "Cahier d’HLP",
    discipline: "Humanités, littérature et philosophie",
    level: "Terminale",
    tagline: "Tout pour réviser, au même endroit.",
    url: "naulio.github.io/cahier-hlp",
    classe: "TG1",
    lycee: "Lycée Notre-Dame",
    annee: "2026–27",
  },

  chapter: {
    titre: "Éducation, transmission et émancipation",
    semestre: "Semestre 1 · La recherche de soi",
  },

  /* ordre chronologique, comme dans l'application */
  textes: [
    { id: "rab", auteur: "Rabelais", nom: "François Rabelais", titre: "L’emploi du temps humaniste", oeuvre: "Gargantua", annee: 1534, mvt: "Humanisme" },
    { id: "rou", auteur: "Rousseau", nom: "Jean-Jacques Rousseau", titre: "L’homme : l’être « perfectible »", oeuvre: "Discours sur l’inégalité", annee: 1755, mvt: "Lumières" },
    { id: "bal", auteur: "Balzac", nom: "Honoré de Balzac", titre: "Une discipline excessive", oeuvre: "Louis Lambert", annee: 1832, mvt: "Réalisme" },
    { id: "flo", auteur: "Flaubert", nom: "Gustave Flaubert", titre: "Le « nouveau »", oeuvre: "Madame Bovary", annee: 1857, mvt: "Réalisme" },
    { id: "hug", auteur: "Hugo", nom: "Victor Hugo", titre: "Éduquer pour intégrer l’homme à la société", oeuvre: "Les Quatre Vents de l’esprit", annee: 1881, mvt: "Romantisme" },
    { id: "fer", auteur: "Ferry", nom: "Jules Ferry", titre: "L’éducation morale de la nation, une priorité", oeuvre: "Circulaire", annee: 1883, mvt: "École républicaine" },
    { id: "peg", auteur: "Péguy", nom: "Charles Péguy", titre: "Le mythe républicain", oeuvre: "L’Argent", annee: 1913, mvt: "Belle Époque" },
    { id: "cam", auteur: "Camus", nom: "Albert Camus", titre: "Hommage au maître", oeuvre: "Lettre à Louis Germain", annee: 1957, mvt: "Absurde et révolte" },
    { id: "are", auteur: "Arendt", nom: "Hannah Arendt", titre: "Préparer l’enfant au monde", oeuvre: "« La crise de l’éducation »", annee: 1958, mvt: "Philosophie politique" },
  ],

  /* feuilles sur le bureau, une par texte (ordre chronologique).
     type "print" : extrait du domaine public, tel que distribué en classe ;
     type "notes" : notes manuscrites (auteurs encore protégés : rien n'est reproduit). */
  feuilles: [
    { id: "rab", type: "print", entete: "Texte · Rabelais, Gargantua, ch. 23", date: "03.09",
      lignes: ["S’éveillait donc Gargantua environ quatre heures", "du matin. Cependant qu’on le frottait, lui était", "lue quelque pagine de la divine Écriture haute-", "ment et clairement, avec prononciation compé-", "tente à la matière, et à ce était commis un jeune", "page natif de Basché, nommé Anagnostes."] },
    { id: "rou", type: "print", entete: "Texte · Rousseau, Discours (1755)", date: "08.09",
      lignes: ["La Nature commande à tout animal, et la Bête", "obéit. L’homme éprouve la même impression,", "mais il se reconnaît libre d’acquiescer, ou de", "résister ; […] il y a une autre qualité très", "spécifique qui les distingue, […] c’est la", "faculté de se perfectionner ;"] },
    { id: "bal", type: "notes", entete: "Balzac · Louis Lambert (1832)", date: "10.09",
      lignes: ["« Vous ne faites rien, Lambert\u00a0! »", "→ pensums, récréations perdues", "→ le collège = « régime pénitentiaire »", "→ les livres les sauvent"] },
    { id: "flo", type: "print", entete: "Texte · Flaubert, Madame Bovary", date: "15.09",
      lignes: ["Nous étions à l’Étude, quand le Proviseur entra,", "suivi d’un nouveau habillé en bourgeois et d’un", "garçon de classe qui portait un grand pupitre.", "Ceux qui dormaient se réveillèrent, et chacun", "se leva comme surpris dans son travail."] },
    { id: "hug", type: "print", entete: "Texte · Hugo, Les Quatre Vents de l’esprit", date: "17.09",
      lignes: ["Chaque enfant qu’on enseigne est un homme", "qu’on gagne.", "Quatre-vingt-dix voleurs sur cent qui sont", "au bagne", "Ne sont jamais allés à l’école une fois,", "Et ne savent pas lire, et signent d’une croix."] },
    { id: "fer", type: "print", entete: "Texte · Ferry, Lettre aux instituteurs", date: "22.09",
      lignes: ["Monsieur l’Instituteur,", "L’année scolaire qui vient de s’ouvrir sera la", "seconde année d’application de la loi du", "28 mars 1882."] },
    { id: "peg", type: "print", entete: "Texte · Péguy, L’Argent (1913)", date: "22.09",
      lignes: ["Nos jeunes maîtres étaient beaux comme des", "hussards noirs. Sveltes ; sévères ; sanglés.", "Sérieux, et un peu tremblants de leur précoce,", "de leur soudaine omnipotence."] },
    { id: "cam", type: "notes", entete: "Camus · lettre à L. Germain (1957)", date: "24.09",
      lignes: ["1re pensée, après sa mère :", "→ son instituteur", "→ reconnaissance de l’élève", "cf. Le Premier Homme"] },
    { id: "are", type: "notes", entete: "Arendt · « La crise de l’éducation »", date: "29.09",
      lignes: ["autorité + tradition", "→ préparer l’enfant au monde", "→ l’école ≠ la politique", "à revoir !!"] },
  ],

  fiche: {
    id: "rou",
    auteur: "Jean-Jacques Rousseau",
    dates: "1712–1778",
    titre: "L’homme : l’être « perfectible »",
    oeuvre: "Discours sur l’origine et les fondements de l’inégalité parmi les hommes",
    chips: ["1755", "Lumières", "Discours"],
    essentiel: [
      "Philosophe des Lumières, mais critique du progrès.",
      "Deux différences avec l’animal : la liberté et la perfectibilité.",
      "L’animal est fixé ; l’homme progresse… et peut régresser.",
      "Conclusion pessimiste : « la source de tous les malheurs ».",
      "Pour l’éducation : rien n’est fixé à la naissance.",
    ],
    citation: "c’est la faculté de se perfectionner",
    citationNote: "Définition · ligne\u00a08",
  },

  flash: {
    q: "Heure du lever de Gargantua ?",
    a: "Vers 4 heures du matin.",
    source: "Rabelais · Gargantua, ch. 23",
  },

  qcm: {
    source: "Hugo · procédés",
    q: "« L’ignorance est la nuit qui commence l’abîme » : quel procédé ?",
    options: ["Une comparaison", "Une métaphore", "Une litote", "Un oxymore"],
    bonne: 1,
    explication: "Ignorance = nuit, sans outil de comparaison.",
  },
};
