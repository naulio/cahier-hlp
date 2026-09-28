/* =====================================================================
   CONFIGURATION GÉNÉRALE DU CAHIER
   (nom, matière, adresse, programme officiel affiché sur l'accueil)
   Les chapitres eux-mêmes sont dans lecons/*.js.
   ===================================================================== */
window.CAHIER_CONFIG = {
  nom: "Cahier d'HLP",
  matiere: "Spécialité HLP",
  niveau: "Terminale",
  sousTitre: "Terminale · révisions",
  accroche: "Fiches, flashcards, QCM corrigés et exercices pour réviser les textes étudiés en classe. Gratuit, sans compte : ta progression reste sur ton appareil.",
  url: "https://naulio.github.io/cahier-hlp/",
  stockage: "cahierHLP",

  /* Programme officiel de Terminale (BO spécial n° 8 du 25 juillet 2019).
     Une leçon s'y rattache avec son champ « programme » (ex. "s1-education"). */
  programme: [
    { semestre: "Semestre 1", titre: "La recherche de soi", themes: [
      { id: "s1-education", titre: "Éducation, transmission et émancipation" },
      { id: "s1-sensibilite", titre: "Les expressions de la sensibilité" },
      { id: "s1-metamorphoses", titre: "Les métamorphoses du moi" }
    ] },
    { semestre: "Semestre 2", titre: "L'Humanité en question", themes: [
      { id: "s2-creation", titre: "Création, continuités et ruptures" },
      { id: "s2-histoire", titre: "Histoire et violence" },
      { id: "s2-limites", titre: "L'humain et ses limites" }
    ] }
  ]
};
