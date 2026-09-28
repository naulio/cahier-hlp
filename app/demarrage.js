/* Démarrage : chargé en dernier, après toutes les leçons. */
(function () {
  "use strict";
  var C = window.CAHIER, view = document.getElementById("view");
  if (!C || !C.demarrer || !C._) { view.innerHTML = "<p style='padding:20px'>Erreur de chargement du cahier. Recharge la page.</p>"; return; }
  try { C.demarrer(); }
  catch (e) { view.innerHTML = "<p style='padding:20px'>Erreur au démarrage du cahier : " + String((e && e.message) || e).replace(/</g, "&lt;") + "</p>"; if (window.console) console.error(e); }
})();
