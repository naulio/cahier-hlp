/* =====================================================================
   Assemblage : chaque scène expose build(stage) et update(t).
   window.renderFrame(t) est appelé par le moteur de rendu (Playwright)
   pour chaque image ; window.subframes(t) indique où ajouter du flou
   de mouvement (moyenne de sous-images).
   ===================================================================== */
(function () {
  "use strict";
  const stage = document.getElementById("stage");
  const scenes = window.SCENES || [];
  scenes.forEach(s => { s.build(stage); s.root = s.root || stage.lastElementChild; s.root.style.display = "none"; });

  window.DURATION = (window.CUES && window.CUES.duration) || 60;
  window.FPS = 30;

  window.renderFrame = function (t) {
    for (const s of scenes) {
      const on = t >= s.t0() - 1e-6 && t < s.t1();
      if (s.root) s.root.style.display = on ? "" : "none";
      if (on) s.update(t);
    }
  };

  /* Nombre de sous-images pour le flou de mouvement à l'instant t. */
  window.subframes = function (t) {
    let n = 1;
    for (const s of scenes) if (s.blur && t >= s.t0() && t < s.t1()) n = Math.max(n, s.blur(t) || 1);
    return n;
  };

  /* Attendre que polices et images soient prêtes (rendu déterministe). */
  window.ready = (async function () {
    await document.fonts.ready;
    const imgs = Array.from(document.images);
    await Promise.all(imgs.map(i => (i.complete ? Promise.resolve() : i.decode().catch(() => {}))));
    window.renderFrame(0);
    return true;
  })();

  /* Aperçu dans un navigateur : ?t=12.5 ou ?play */
  const q = new URLSearchParams(location.search);
  if (q.has("t")) window.ready.then(() => window.renderFrame(parseFloat(q.get("t"))));
  if (q.has("play")) {
    window.ready.then(() => {
      const start = performance.now() - (parseFloat(q.get("play")) || 0) * 1000;
      const loop = () => { const t = (performance.now() - start) / 1000; window.renderFrame(t % window.DURATION); requestAnimationFrame(loop); };
      loop();
    });
  }
})();
