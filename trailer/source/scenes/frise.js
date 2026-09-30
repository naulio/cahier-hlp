/* =====================================================================
   SCÈNE 7 · LA FRISE
   « Et une frise, pour relier les œuvres… de Rabelais à Arendt. »
   La ligne se trace, les neuf textes s'allument, des arcs les relient.
   Les Polaroids du début reviennent, rangés dans l'ordre (rappel du hook).
   ===================================================================== */
(function () {
  "use strict";
  const { E, seg, lerp, clamp, inv, el, svgEl, put, cue: M, spring, drift } = window.ENG;
  const C = window.CONTENT;
  const S = { name: "frise" };
  S.t0 = () => M("v11_start") - 0.3;
  S.t1 = () => M("v12_start") + 0.02;   // v7 : reste opaque jusqu'à ce que la classe le recouvre (plus de gris)

  const X0 = 150, X1 = 1290, Y = 600;
  const xs = C.textes.map((t, i) => X0 + (X1 - X0) * i / (C.textes.length - 1));
  const PHOTOS = { rab: "rabelais_sq.jpg", rou: "rousseau_latour_sq.jpg", flo: "flaubert_sq.jpg", hug: "hugo_carjat_1876_sq.jpg" };
  let root, world, back, line, nodes = [], arcs = [], bigArc, title, cents = [];

  S.build = function (stage) {
    root = el("div", "layer", stage);
    root.style.background = "#F2EDE3 url(../assets/textures/paper_offwhite.png) center/1440px";
    back = el("div", "layer", root);          // bandes des siècles (parallaxe)
    const mid = (i, j) => (xs[i] + xs[j]) / 2, half = (xs[1] - xs[0]) / 2;
    [["XVI", 0, 0], ["XVIII", 1, 1], ["XIX", 2, 5], ["XX", 6, 8]].forEach(([c, i, j], k) => {
      const x0 = xs[i] - half, x1 = xs[j] + half;
      const band = el("div", "abs", back);
      band.style.cssText += `;left:${x0}px;top:300px;width:${x1 - x0}px;height:560px;background:${k % 2 ? "rgba(95,100,67,.035)" : "rgba(95,100,67,.0)"};border-left:1px dashed rgba(95,100,67,.18)`;
      const lab = el("div", "abs", band, `${c}<sup style="font-size:.62em;vertical-align:.5em">e</sup> siècle`);
      lab.style.cssText += ";left:14px;top:14px;font:400 17px/1 News;font-style:italic;color:rgba(57,64,47,.55);white-space:nowrap";
      cents.push(band);
    });
    world = el("div", "layer", root);
    world.style.overflow = "visible";
    const svg = svgEl("svg", { width: 1440, height: 1080, style: "position:absolute;left:0;top:0;overflow:visible" }, world);
    line = svgEl("line", { x1: X0 - 70, y1: Y, x2: X1 + 70, y2: Y, stroke: "#39402F", "stroke-width": 2.2, "stroke-linecap": "round" }, svg);
    for (let i = 0; i < xs.length - 1; i++) {
      const a = xs[i], b = xs[i + 1], h = 34 + (i % 2) * 10;
      const p = svgEl("path", { d: `M${a} ${Y - 10} C ${a + 30} ${Y - h - 12}, ${b - 30} ${Y - h - 12}, ${b} ${Y - 10}`, fill: "none", stroke: "#8C8F66", "stroke-width": 1.8, "stroke-dasharray": "300", "stroke-dashoffset": "300", "stroke-linecap": "round" }, svg);
      arcs.push(p);
    }
    // v5 : l'arc « de Rabelais à Arendt » passe au-dessus de la frise (sort de derrière le Polaroid de Rabelais,
    // passe au-dessus de Hugo) : il ne croise plus aucun nom ni aucune photo
    bigArc = svgEl("path", { d: `M${xs[0]} ${Y - 12} C ${xs[0] + 40} ${Y - 337}, ${xs[8] - 40} ${Y - 337}, ${xs[8]} ${Y - 12}`, fill: "none", stroke: "#C4674E", "stroke-width": 2.4, "stroke-dasharray": "1400", "stroke-dashoffset": "1400", "stroke-linecap": "round" }, svg);
    C.textes.forEach((t, i) => {
      const up = i % 2 === 0;
      const n = el("div", "abs", world);
      n.style.cssText += `;left:${xs[i] - 9}px;top:${Y - 9}px;width:18px;height:18px;border-radius:50%;background:#F2EDE3;box-shadow:inset 0 0 0 3px #39402F`;
      const ring = el("div", "abs", world);
      ring.style.cssText += `;left:${xs[i] - 22}px;top:${Y - 22}px;width:44px;height:44px;border-radius:50%;border:2px solid #C4674E`;
      const lab = el("div", "abs", world, `<div style="font:500 14px/1 Mono;letter-spacing:.12em;color:#6F7159">${t.annee}</div>
        <div style="font:400 33px/1 News;letter-spacing:-.018em;color:#1D1E1A;margin-top:9px">${t.auteur}</div>`);
      lab.style.cssText += `;left:${xs[i] - 90}px;width:180px;text-align:center;top:${up ? Y + 34 : Y - 102}px`;
      let ph = null;
      if (PHOTOS[t.id]) {
        ph = el("div", "abs", world, `<img src="../assets/archive/${PHOTOS[t.id]}" style="width:112px;height:112px;object-fit:cover;display:block;filter:grayscale(1) sepia(.22) contrast(1.05)">`);
        ph.style.cssText += `;left:${xs[i] - 64}px;top:${up ? Y - 210 : Y + 104}px;padding:8px 8px 26px;background:#FBF8F2;box-shadow:0 1px 1px rgba(0,0,0,.15),0 8px 20px rgba(40,42,30,.16)`;
        // fine tige qui rattache la photo à son point (on ne confond plus les visages avec les noms voisins)
        ph.stem = svgEl("line", { x1: xs[i], y1: up ? Y - 64 : Y + 12, x2: xs[i], y2: up ? Y - 12 : Y + 104, stroke: "#8C8F66", "stroke-width": 1.2, opacity: 0 }, svg);
      }
      nodes.push({ n, ring, lab, ph, up, i });
    });
    title = el("div", "abs", root, `<div class="eyebrow">Frise chronologique</div><div style="font:400 40px/1 News;letter-spacing:-.02em;color:#1D1E1A;margin-top:12px">Neuf auteurs, <i>quatre siècles</i></div>`);
    title.style.cssText += ";left:150px;top:150px";
  };

  S.update = function (t) {
    const t0 = M("v11_start") - 0.3, fr = M("v11_frise"), rel = M("v11_relier"), rab = M("v11_rabelais"), are = M("v11_arendt");
    put(root, { op: seg(t, M("v11_start") - 0.05, 0.4, E.linear) });   // v6 : entre une fois le QCM parti ; v7 : ne s'efface plus (la classe le recouvre)
    // la ligne se trace sur « frise »
    const ln = seg(t, fr - 0.25, 0.9, E.inOut);
    const L = (X1 - X0 + 140);
    line.setAttribute("stroke-dasharray", L); line.setAttribute("stroke-dashoffset", (L * (1 - ln)).toFixed(1));
    nodes.forEach(nd => {
      const tn = fr - 0.25 + 0.9 * E.inOut(clamp((xs[nd.i] - X0 + 70) / L)) * 0.95;
      const sp = spring(t - tn, 26, 0.55);
      put(nd.n, { s: t < tn ? 0.001 : clamp(sp, 0, 1.3), op: t < tn ? 0 : 1 });
      const le = seg(t, tn + 0.05, 0.5, E.out);
      put(nd.lab, { op: le, y: (1 - le) * (nd.up ? 10 : -10) });
      if (nd.ph) nd.ph.stem.setAttribute("opacity", (0.7 * seg(t, tn + 0.3, 0.4)).toFixed(3));
      if (nd.ph) { const pe = seg(t, tn + 0.1, 0.55, E.out); put(nd.ph, { op: pe, y: (1 - pe) * (nd.up ? -26 : 26), r: (1 - pe) * (nd.i % 4 === 0 ? -8 : 7) + (nd.i % 4 === 0 ? -3 : 3) }); }
      // pulsation sur « Rabelais » et « Arendt »
      const hit = nd.i === 0 ? rab : nd.i === 8 ? are : null;
      if (hit !== null) {
        const r = seg(t, hit - 0.05, 0.7, E.out);
        put(nd.ring, { s: 0.5 + r * 0.9, op: t > hit - 0.05 ? (1 - r) * 0.9 + (t > hit + 0.6 ? 0 : 0) : 0 });
        nd.n.style.boxShadow = t > hit - 0.05 ? "inset 0 0 0 9px #C4674E" : "inset 0 0 0 3px #39402F";
      } else put(nd.ring, { op: 0 });
    });
    // « relier » : les arcs se tracent
    arcs.forEach((a, i) => a.setAttribute("stroke-dashoffset", (300 * (1 - seg(t, rel - 0.1 + i * 0.07, 0.5, E.inOut))).toFixed(1)));
    bigArc.setAttribute("stroke-dashoffset", (1400 * (1 - seg(t, rab + 0.05, (are - rab) * 0.85, E.inOut))).toFixed(1));   // se pose sur Arendt, puis tient ~1 s
    put(title, { op: seg(t, fr - 0.1, 0.5), y: (1 - seg(t, fr - 0.1, 0.5)) * 12 });
    // caméra : léger travelling gauche → droite, parallaxe des siècles
    const pan = E.inOut(inv(fr - 0.3, are + 0.8, t));
    const z = lerp(1.12, 1.03, seg(t, t0, 1.2, E.out)) + (t > rab ? 0.03 * Math.sin(Math.PI * inv(rab, are + 0.6, t)) : 0);
    const cx = lerp(40, -40, pan);
    world.style.transformOrigin = "720px 590px";
    world.style.transform = `translate(${cx.toFixed(2)}px, 0) scale(${z.toFixed(4)})`;
    back.style.transform = `translate(${(cx * 0.35).toFixed(2)}px, 0)`;
  };
  S.blur = () => 1;
  /* instants d'apparition des neuf points (même formule que update) */
  S.nodeTimes = () => {
    const fr = M("v11_frise"), L = (X1 - X0 + 140);
    return xs.map(x => fr - 0.25 + 0.9 * E.inOut(clamp((x - X0 + 70) / L)) * 0.95);
  };
  (window.SCENES = window.SCENES || []).push(S);
})();
