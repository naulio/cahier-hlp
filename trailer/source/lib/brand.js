/* =====================================================================
   Marque « Cahier d’HLP »
   Symbole : un « c » italique et son apostrophe terracotta, posés sur la
   réglure Seyès d’une page, avec la marge rouge qui déborde du carré.
   (Une page de cahier, pas une icône de menu.)
   ===================================================================== */
(function () {
  "use strict";
  const KAKI = "#5F6443", CREME = "#F2EDE3", MARGE = "#C4674E", APOS = "#D97A5E";

  /* Symbole en SVG ; les parties portent des classes pour être animées :
     .m-bg (fond), .m-rule (réglure), .m-margin (marge), .m-c (lettre), .m-apos (apostrophe). */
  function markSVG(size, id = "m" + Math.round(Math.random() * 1e6)) {
    const rules = [40, 56, 72, 88].map((y, i) =>
      `<line class="m-rule" data-i="${i}" x1="0" y1="${y}" x2="120" y2="${y}" stroke="${CREME}" stroke-width="${i === 2 ? 2.6 : 1.4}" opacity="${i === 2 ? 0.45 : 0.24}"/>`).join("");
    return `<svg viewBox="-4 -10 128 140" width="${size}" height="${(size * 140 / 128).toFixed(1)}" style="display:block;overflow:visible">
      <defs><clipPath id="${id}"><rect x="0" y="0" width="120" height="120" rx="28"/></clipPath></defs>
      <rect class="m-bg" x="0" y="0" width="120" height="120" rx="28" fill="${KAKI}"/>
      <g clip-path="url(#${id})">${rules}</g>
      <line class="m-margin" x1="27" y1="-8" x2="27" y2="128" stroke="${MARGE}" stroke-width="3.6" stroke-linecap="round"/>
      <text class="m-c" x="41" y="72" font-family="News" font-style="italic" font-weight="500" font-size="86" fill="${CREME}">c</text>
      <text class="m-apos" x="84" y="58" font-family="News" font-weight="500" font-size="72" fill="${APOS}">’</text>
    </svg>`;
  }

  function wordmark(size, color = "#1D1E1A") {
    return `<span style="font:400 ${size}px/1 News;letter-spacing:-.022em;color:${color};white-space:nowrap">Cahier d<span style="color:${MARGE}">’</span>HLP</span>`;
  }

  /* Anime un symbole déjà dans le DOM. p = { bg, rules, margin, letter } dans [0,1]. */
  function animateMark(svg, p) {
    const q = s => svg.querySelector(s);
    const bg = q(".m-bg");
    const sb = Math.max(0.001, p.bg);
    bg.setAttribute("transform", `translate(60 60) scale(${sb.toFixed(4)}) translate(-60 -60)`);
    svg.querySelectorAll(".m-rule").forEach((l, i) => {
      const e = Math.min(1, Math.max(0, p.rules * 1.3 - i * 0.1));
      l.setAttribute("stroke-dasharray", "120");
      l.setAttribute("stroke-dashoffset", (120 * (1 - e)).toFixed(2));
    });
    const m = q(".m-margin");
    m.setAttribute("stroke-dasharray", "136");
    m.setAttribute("stroke-dashoffset", (136 * (1 - p.margin)).toFixed(2));
    const c = q(".m-c"), a = q(".m-apos");
    const lc = Math.min(1, p.letter * 1.4), la = Math.max(0, Math.min(1, p.letter * 1.6 - 0.6));
    c.setAttribute("opacity", lc.toFixed(3));
    c.setAttribute("transform", `translate(0 ${((1 - lc) * 8).toFixed(2)})`);
    a.setAttribute("opacity", la.toFixed(3));
    a.setAttribute("transform", `translate(0 ${((1 - la) * -6).toFixed(2)})`);
  }

  window.BRAND = { markSVG, wordmark, animateMark, KAKI, CREME, MARGE };
})();
