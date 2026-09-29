/* =====================================================================
   Géométrie et composants partagés de l'interface (application fictive
   mais fidèle aux vraies fonctions du Cahier d'HLP).
   ===================================================================== */
(function () {
  "use strict";
  const APP = { x: 96, y: 84, w: 1248, h: 912, side: 248 };
  const MAIN = { x: APP.x + APP.side + 44, y: APP.y, w: APP.w - APP.side - 88 };  // 912 px utiles
  const GRID = { cols: 3, cw: 292, ch: 156, gap: 18, y0: APP.y + 190 };

  function slot(i) {
    const c = i % GRID.cols, r = Math.floor(i / GRID.cols);
    return { x: MAIN.x + c * (GRID.cw + GRID.gap), y: GRID.y0 + r * (GRID.ch + GRID.gap), w: GRID.cw, h: GRID.ch };
  }

  /* couleur d'époque (bande à gauche des cartes) */
  const ERA = { 1534: "#C06A2B", 1755: "#C9A24A", 1832: "#8C8F66", 1857: "#8C8F66", 1881: "#5F6443",
                1883: "#6F7D8C", 1913: "#6F7D8C", 1957: "#39402F", 1958: "#39402F" };
  const PROGRESS = { rab: 100, rou: 85, bal: 60, flo: 75, hug: 40, fer: 55, peg: 20, cam: 10, are: 0 };

  function cardHTML(t) {
    const p = PROGRESS[t.id] ?? 0;
    return `<div style="position:absolute;left:0;top:0;bottom:0;width:5px;background:${ERA[t.annee] || "#5F6443"}"></div>
      <div style="position:absolute;left:24px;top:22px;font:500 11.5px/1 Mono;letter-spacing:.14em;color:#6F7159">${t.annee} · ${t.mvt.toUpperCase()}</div>
      <div style="position:absolute;left:23px;top:44px;font:400 31px/1 News;letter-spacing:-.015em;color:#1D1E1A">${t.auteur}</div>
      <div style="position:absolute;left:24px;top:86px;right:20px;font:400 14.5px/1.3 Sans;color:#6B6C61;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${t.titre}</div>
      <div style="position:absolute;left:24px;right:64px;bottom:22px;height:4px;border-radius:4px;background:#ECE7D8"><div style="height:100%;width:${p}%;border-radius:4px;background:#5F6443"></div></div>
      <div style="position:absolute;right:20px;bottom:16px;font:500 12.5px/1 Mono;color:#8A8B7C;white-space:nowrap">${p}\u00a0%</div>`;
  }

  window.UI = { APP, MAIN, GRID, slot, cardHTML, PROGRESS };
})();
