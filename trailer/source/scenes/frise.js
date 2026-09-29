/* =====================================================================
   SCÈNE 7 · LA FRISE
   « Et une frise, pour relier les œuvres… de Rabelais à Arendt. »
   L’axe naît du toucher sur « Frise » ; les neuf auteurs s’allument au
   passage ; les Polaroids du début reviennent, rangés, au-dessus de
   leur point ; un trait terracotta relie Rabelais à Arendt.
   ===================================================================== */
(function () {
  "use strict";
  const { E, seg, lerp, clamp, inv, el, svgEl, put, cue: M, spring } = window.ENG;
  const C = window.CONTENT;
  const app = () => window.SCENES.find(s => s.name === "app");
  const S = { name: "frise" };
  S.t0 = () => app().T().navFrise + 0.05;
  S.t1 = () => M("v12_start") - 0.1;

  const X0 = 170, X1 = 1270, Y = 610;
  const xs = C.textes.map((t, i) => X0 + (X1 - X0) * i / (C.textes.length - 1));
  const PHOTOS = { rab: "rabelais_sq.jpg", rou: "rousseau_latour_sq.jpg", flo: "flaubert_sq.jpg", hug: "hugo_carjat_1876_sq.jpg" };
  let root, bgp, world, svg, axis, link, nodes = [], title;

  S.build = function (stage) {
    root = el("div", "layer", stage);
    bgp = el("div", "layer", root);
    bgp.style.background = "#F2EDE3 url(../assets/textures/paper_offwhite.png) center/1440px";
    world = el("div", "layer", root);
    world.style.overflow = "visible";
    world.style.transformOrigin = "720px 560px";
    svg = svgEl("svg", { width: 1440, height: 1080, style: "position:absolute;left:0;top:0;overflow:visible" }, world);
    axis = svgEl("line", { stroke: "#39402F", "stroke-width": 2.4, "stroke-linecap": "round" }, svg);
    link = svgEl("line", { x1: xs[0], y1: Y, x2: xs[0], y2: Y, stroke: "#C4674E", "stroke-width": 5, "stroke-linecap": "round" }, svg);
    C.textes.forEach((t, i) => {
      const low = i % 2 === 1;                       // deux rangées d’étiquettes, pour ne rien chevaucher
      const n = el("div", "abs", world);
      n.style.cssText += `;left:${xs[i] - 10}px;top:${Y - 10}px;width:20px;height:20px;border-radius:50%;background:#F2EDE3;box-shadow:inset 0 0 0 3px #39402F`;
      const ring = el("div", "abs", world);
      ring.style.cssText += `;left:${xs[i] - 24}px;top:${Y - 24}px;width:48px;height:48px;border-radius:50%;border:2px solid #C4674E`;
      const stem = el("div", "abs", world);
      stem.style.cssText += `;left:${xs[i] - 0.75}px;top:${Y + 14}px;width:1.5px;height:${low ? 70 : 20}px;background:rgba(57,64,47,.35);transform-origin:50% 0`;
      const lab = el("div", "abs", world, `<div style="font:500 14px/1 Mono;letter-spacing:.1em;color:#5F6443">${t.annee}</div>
        <div style="font:400 31px/1 News;letter-spacing:-.018em;color:#1D1E1A;margin-top:8px;white-space:nowrap">${t.auteur}</div>`);
      lab.style.cssText += `;left:${xs[i] - 90}px;width:180px;text-align:center;top:${Y + (low ? 90 : 40)}px`;
      let ph = null, filet = null;
      if (PHOTOS[t.id]) {
        filet = el("div", "abs", world);
        filet.style.cssText += `;left:${xs[i] - 0.75}px;top:${Y - 58}px;width:1.5px;height:46px;background:rgba(57,64,47,.4);transform-origin:50% 100%`;
        ph = el("div", "abs", world, `<img src="../assets/archive/${PHOTOS[t.id]}" style="width:108px;height:108px;object-fit:cover;display:block;filter:grayscale(1) sepia(.22) contrast(1.05)">`);
        ph.style.cssText += `;left:${xs[i] - 62}px;top:${Y - 212}px;padding:8px 8px 30px;background:#FBF8F2;box-shadow:0 1px 1px rgba(0,0,0,.15),0 8px 20px rgba(40,42,30,.16)`;
      }
      nodes.push({ n, ring, stem, lab, ph, filet, i });
    });
    title = el("div", "abs", root, `<div class="eyebrow" style="font-size:14px">Frise chronologique</div><div style="font:400 44px/1 News;letter-spacing:-.02em;color:#1D1E1A;margin-top:12px">Neuf auteurs, <i>quatre siècles</i></div>`);
    title.style.cssText += ";left:170px;top:150px";
  };

  S.update = function (t) {
    const t0 = S.t0(), fr = M("v11_frise"), rab = M("v11_rabelais"), are = M("v11_arendt");
    put(bgp, { op: seg(t, t0, 0.35, E.linear) });
    // l’axe naît du menu : un point qui s’étire jusqu’à la largeur de la frise
    const [nx, ny] = app().navFriseXY || [150, 400];
    const a1 = seg(t, t0, 0.55, E.emph), a2 = seg(t, t0 + 0.25, 0.9, E.emph);
    const y = lerp(ny, Y, a1);
    axis.setAttribute("x1", lerp(nx, X0 - 70, a1).toFixed(1)); axis.setAttribute("y1", y.toFixed(1));
    axis.setAttribute("x2", lerp(nx + 4, X1 + 70, a2).toFixed(1)); axis.setAttribute("y2", y.toFixed(1));
    const xHead = lerp(nx + 4, X1 + 70, a2);
    nodes.forEach(nd => {
      const tn = t0 + 0.25 + 0.9 * clamp((xs[nd.i] - nx) / (X1 + 70 - nx)) * 0.85 + (nd.i % 3) * 0.02;
      const on = xHead >= xs[nd.i] - 2;
      const sp = spring(t - tn, 24, 0.7);
      put(nd.n, { s: on ? clamp(sp, 0, 1.12) : 0.001, op: on ? 1 : 0 });
      const le = seg(t, tn + 0.08, 0.45, E.out);
      put(nd.lab, { op: le, y: (1 - le) * 10 });
      nd.stem.style.transform = `scaleY(${le.toFixed(3)})`;
      if (nd.ph) {
        const pe = seg(t, Math.max(fr - 0.1, tn) + 0.1, 0.55, E.out);
        put(nd.ph, { op: pe, y: (1 - pe) * -22, r: (1 - pe) * (nd.i % 2 ? 6 : -6) + (nd.i % 2 ? 2 : -2) });
        nd.filet.style.transform = `scaleY(${seg(t, Math.max(fr - 0.1, tn) + 0.4, 0.3, E.out).toFixed(3)})`;
      }
      // Rabelais puis Arendt s’allument sur leur nom
      const hit = nd.i === 0 ? rab : nd.i === 8 ? are : null;
      if (hit !== null) {
        const r = seg(t, hit - 0.05, 0.75, E.out);
        put(nd.ring, { s: 0.5 + r * 0.9, op: t > hit - 0.05 ? (1 - r) * 0.9 : 0 });
        nd.n.style.boxShadow = t > hit - 0.05 ? "inset 0 0 0 10px #C4674E" : "inset 0 0 0 3px #39402F";
      } else put(nd.ring, { op: 0 });
    });
    // « relier » : le trait terracotta court le long de l’axe, de Rabelais à Arendt
    const lk = seg(t, rab - 0.05, are - rab + 0.1, E.inOut);
    link.setAttribute("x2", lerp(xs[0], xs[8], lk).toFixed(1));
    link.setAttribute("opacity", t > rab - 0.05 ? 1 : 0);
    put(title, { op: seg(t, t0 + 0.2, 0.5), y: (1 - seg(t, t0 + 0.2, 0.5)) * 12 });
    const z = 1 + seg(t, t0, S.t1() - t0, E.linear) * 0.04;
    world.style.transform = `scale(${z.toFixed(4)})`;
  };
  S.blur = t => (t > S.t0() && t < S.t0() + 0.6 ? 6 : 1);
  S.nodeXY = i => [xs[i], Y];
  S.sounds = function () {
    const t0 = S.t0(), rab = M("v11_rabelais"), are = M("v11_arendt");
    return [
      { t: t0 + 0.1, sfx: "marker_3", g: -22, p: -0.1, scene: "frise" },          // l’axe se trace
      { t: rab - 0.05, sfx: "write_b", g: -24, p: -0.2, scene: "frise", len: are - rab + 0.3, fade: 0.2 },   // le trait relie Rabelais à Arendt
    ];
  };

  (window.SCENES = window.SCENES || []).push(S);
})();
