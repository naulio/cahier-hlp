/* =====================================================================
   SCÈNE 1-3 · LE BUREAU
   Hook (Polaroids sur les noms) → le problème (tout s'accumule, « Mais
   où ? ») → déclic (obturateur) → les feuilles se rangent et deviennent
   les cartes de l'application (le fond se « développe » comme un Polaroid).
   ===================================================================== */
(function () {
  "use strict";
  const { E, seg, lerp, clamp, inv, drift, el, svgEl, put, cue: M, spring } = window.ENG;
  const C = window.CONTENT, UI = window.UI;
  const W = 1440, H = 1080, CX = 720, CY = 540;

  const S = { name: "desk", GRID_DX: -124, GRID_DY: 14 };
  S.t0 = () => 0;
  S.t1 = () => M("v7_start") - 0.2;

  /* ---------------- objets du bureau (coordonnées « monde ») ---------------- */
  const SHEET_W = 400, SHEET_H = 566;
  const HOME = {   // x, y, rotation — les feuilles, une par texte
    rab: [-780, -330, -7], rou: [800, -350, 6], hug: [-720, 420, 4],
    flo: [700, 340, 5], fer: [-300, 470, -3.5], peg: [250, -500, 6], bal: [-300, -480, -3], cam: [300, 440, -4.5], are: [-20, 690, 2],
  };
  const PRESENT = ["rab", "rou", "hug"];         // déjà là quand la caméra recule
  const POLA = [                                  // Polaroids du hook
    { id: "rab", img: "rabelais_sq.jpg", cap: "Rabelais", x: -270, y: 16, r: -7, mark: "n1" },
    { id: "rou", img: "rousseau_latour_sq.jpg", cap: "Rousseau", x: -90, y: -20, r: 3.5, mark: "n2" },
    { id: "flo", img: "flaubert_sq.jpg", cap: "Flaubert", x: 90, y: 14, r: -3, mark: "n3" },
    { id: "hug", img: "hugo_carjat_1876_sq.jpg", cap: "Hugo", x: 270, y: -12, r: 6, mark: "n4" },
  ];
  const EXTRAS = [
    { kind: "page", x: -470, y: -40, r: 9, html: "<b>Plan du commentaire</b><br>I. Une éducation…<br>&nbsp;&nbsp;a) le corps<br>&nbsp;&nbsp;b) l’esprit<br>II. …", at: "v3_accum", dt: 0.3 },
    { kind: "page", x: 480, y: -150, r: -8, html: "<b>Procédés</b><br>anaphore<br>antithèse<br>métaphore filée<br>litote ≠ euphémisme", at: "v4_citations", dt: -0.15 },
    { kind: "page", x: 60, y: -700, r: 3, html: "<b>Dissertation</b><br>problématique ?<br>→ l’éducation<br>&nbsp;&nbsp;émancipe-t-elle ?", at: "v4_notes", dt: 0.2 },
    { kind: "sticky", x: 620, y: -40, r: 8, html: "Arendt ??<br>p. 42" },
    { kind: "sticky", x: -640, y: -90, r: -10, html: "citations<br>à revoir !" },
    { kind: "index", x: 660, y: 170, r: -6, html: "perfectibilité<br>≠ perfection !<br>(Rousseau)" },
    { kind: "index", x: -680, y: 150, r: 5, html: "Quos ego → Virgile<br>Charbovari = Charles" },
  ];

  /* annotations au stylo, en coordonnées de feuille (px) : [type, ligne, x0, x1, texte] */
  const NOTES = {
    rou: [["under", 5, 0, 250], ["bracket", 3, 5], ["margin", 5, "déf. !"]],
    hug: [["circle", 4, 205, 285], ["margin", 0, "thèse"]],
    flo: [["under", 1, 18, 150], ["margin", 1, "Charles"]],
    rab: [["under", 0, 208, 330], ["margin", 0, "4 h !"]],
    fer: [["under", 3, 0, 110]],
    peg: [["circle", 1, 0, 120]],
  };
  const HILITE = { rou: [4, 5], hug: [0], peg: [0, 1] };

  let root, bg, pool, develop, khaki, world, screenL, question, vf, flash, dark, vign;
  const sheets = {}, cards = {}, polas = [], extras = [];

  function sheetContent(f) {
    const d = document.createElement("div");
    d.className = "sheet";
    d.style.cssText = `width:${SHEET_W}px;height:${SHEET_H}px;left:0;top:0;position:absolute;`;
    const lines = f.lignes.map(l => `<span class="l">${l}</span>`).join("");
    if (f.type === "print") {
      d.innerHTML = `<div class="hd"><span>${f.entete}</span></div><div class="tx">${lines}</div>`;
    } else {
      d.style.backgroundImage = "linear-gradient(to right, transparent 58px, rgba(181,82,59,.55) 58px, rgba(181,82,59,.55) 60px, transparent 60px), repeating-linear-gradient(to bottom, transparent 0 31px, rgba(122,146,172,.4) 31px 32px), url(../assets/textures/paper_sheet.png)";
      d.style.padding = "30px 26px 30px 76px";
      d.innerHTML = `<div style="font:500 30px/32px Hand;color:#2F3B63">${f.entete}</div><div style="font:500 27px/32px Hand;color:#2F3B63;margin-top:14px">${f.lignes.join("<br>")}</div>`;
    }
    // éclairage : léger dégradé + teinte propre à chaque feuille
    const tone = { rab: "#F6F1E4", rou: "#FAF8F2", bal: "#F4F0E6", flo: "#F8F4EA", hug: "#F3EDDD", fer: "#FAF7EF", peg: "#F5EFE1", cam: "#F7F3EA", are: "#F2EEE4" }[f.id];
    d.style.backgroundColor = tone;
    const lt = el("div", "", d);
    lt.style.cssText = `position:absolute;inset:0;pointer-events:none;mix-blend-mode:multiply;opacity:.75;background:linear-gradient(128deg, rgba(255,255,255,0), rgba(60,50,30,.08) 100%), linear-gradient(${tone}, ${tone})`;
    // date manuscrite
    const dt = el("div", "", d, f.date);
    dt.style.cssText = "position:absolute;right:26px;top:12px;font:500 28px/1 Hand;color:#2F3B63;transform:rotate(-4deg)";
    return d;
  }

  function annotate(sheetEl, f) {
    const svg = svgEl("svg", { width: SHEET_W, height: SHEET_H, style: "position:absolute;left:0;top:0;overflow:visible" }, sheetEl);
    const strokes = [];
    const lineY = i => 34 + 11 + 18 + 10 + i * 26.66;   // padding + en-tête + interligne
    (HILITE[f.id] || []).forEach((li, k) => {
      const r = svgEl("rect", { x: 34, y: lineY(li) - 2, width: 296, height: 21, fill: "#E3C85A", opacity: 0.5, style: "mix-blend-mode:multiply" }, svg);
      r.style.transformOrigin = "34px 0";
      strokes.push({ kind: "hl", node: r, k });
    });
    (NOTES[f.id] || []).forEach((n, k) => {
      const [type, li] = n;
      let node;
      if (type === "under") {
        const y = lineY(li) + 21, x0 = 38 + n[2], x1 = 38 + n[3];
        node = svgEl("path", { d: `M${x0} ${y} C ${x0 + (x1 - x0) * 0.3} ${y + 2.5}, ${x0 + (x1 - x0) * 0.7} ${y - 1.5}, ${x1} ${y + 1}`, fill: "none", stroke: "#2F3B63", "stroke-width": 2.2, "stroke-linecap": "round" }, svg);
      } else if (type === "circle") {
        const y = lineY(li) + 8, x0 = 38 + n[2], x1 = 38 + n[3], cx = (x0 + x1) / 2, rx = (x1 - x0) / 2 + 8;
        node = svgEl("path", { d: `M${cx + rx} ${y} C ${cx + rx} ${y - 17}, ${cx - rx} ${y - 18}, ${cx - rx} ${y} C ${cx - rx} ${y + 17}, ${cx + rx + 4} ${y + 16}, ${cx + rx - 6} ${y - 10}`, fill: "none", stroke: "#2F3B63", "stroke-width": 2.1, "stroke-linecap": "round" }, svg);
      } else if (type === "bracket") {
        const y0 = lineY(li) - 2, y1 = lineY(n[2]) + 22;
        node = svgEl("path", { d: `M24 ${y0} L18 ${y0} L18 ${y1} L24 ${y1}`, fill: "none", stroke: "#2F3B63", "stroke-width": 2.1, "stroke-linecap": "round", "stroke-linejoin": "round" }, svg);
      } else if (type === "margin") {
        const t = el("div", "", sheetEl, n[2]);
        t.style.cssText = `position:absolute;right:8px;width:66px;text-align:center;top:${lineY(li) - 2}px;font:500 23px/1 Hand;color:#2F3B63;transform:rotate(-6deg);clip-path:inset(0 100% 0 0)`;
        strokes.push({ kind: "text", node: t, k });
        return;
      }
      const len = node.getTotalLength ? 400 : 400;
      node.setAttribute("stroke-dasharray", len);
      node.setAttribute("stroke-dashoffset", len);
      strokes.push({ kind: "path", node, len, k });
    });
    return strokes;
  }

  S.build = function (stage) {
    root = el("div", "layer", stage);
    bg = el("div", "layer", root);
    bg.style.background = "#22231F url(../assets/textures/desk_dark.png) center/cover";
    pool = el("div", "layer", root);
    pool.style.background = "radial-gradient(ellipse 60% 55% at 50% 46%, rgba(255,238,205,.10), rgba(255,238,205,0) 70%)";
    // fond qui se développe (sombre → kaki → papier), sous le monde
    develop = el("div", "layer", root);
    develop.style.background = "#F2EDE3 url(../assets/textures/paper_offwhite.png) center/1440px";
    khaki = el("div", "layer", root);
    khaki.style.background = "radial-gradient(ellipse 80% 80% at 50% 50%, #6B6E4C, #4A4E36)";
    world = el("div", "world", root);

    // feuilles (dans le monde) + leur version « écran » pour le morphing
    screenL = el("div", "layer", root);
    C.feuilles.forEach((f, i) => {
      const w = el("div", "abs", world);
      w.style.width = SHEET_W + "px"; w.style.height = SHEET_H + "px";
      const content = sheetContent(f);
      w.appendChild(content);
      const strokes = annotate(content, f);
      sheets[f.id] = { el: w, f, i, strokes, home: HOME[f.id] };
      // carte-écran : boîte qui se transforme (feuille → carte)
      const box = el("div", "abs", screenL);
      box.style.cssText += ";overflow:hidden;background:#FBF8F2;";
      const inner = sheetContent(f);
      inner.style.boxShadow = "none";
      inner.style.transformOrigin = "0 0";
      box.appendChild(inner);
      annotate(inner, f).forEach(s => {       // version finale des annotations
        if (s.kind === "path") s.node.setAttribute("stroke-dashoffset", 0);
        else if (s.kind === "text") s.node.style.clipPath = "inset(0 0 0 0)";
      });
      const card = el("div", "", box, UI.cardHTML(C.textes[i]));
      card.style.cssText = "position:absolute;left:0;top:0;width:292px;height:156px;opacity:0";
      cards[f.id] = { box, inner, card, i };
    });
    EXTRAS.forEach(x => {
      const e = el("div", x.kind === "sticky" ? "sticky" : x.kind === "page" ? "sheet notepage" : "index", world, x.html);
      e.style.left = "0px"; e.style.top = "0px";
      const dims = { sticky: [150, 150], index: [300, 190], page: [SHEET_W, SHEET_H] }[x.kind];
      if (x.kind === "page") { e.style.width = SHEET_W + "px"; e.style.height = SHEET_H + "px"; }
      extras.push({ el: e, ...x, w: dims[0], h: dims[1] });
    });
    POLA.forEach(p => {
      const e = el("div", "polaroid", world);
      e.style.left = "0px"; e.style.top = "0px";
      e.innerHTML = `<div class="ph"><img src="../assets/archive/${p.img}" alt=""><div class="dev"></div></div><div class="cap">${p.cap}</div>`;
      polas.push({ ...p, el: e, img: e.querySelector("img"), dev: e.querySelector(".dev") });
    });

    root.appendChild(screenL);            // les cartes passent au-dessus de tout

    // question du hook
    question = el("div", "abs", root);
    question.style.cssText += ";left:0;top:0;width:1440px;text-align:center;font:400 60px/1 News;letter-spacing:-.018em;color:#F2EDE3";
    const qline = (window.CUES.lines.find(l => l.id === "V02") || { words: [] });
    const qwords = ["Tu", "te", "souviens", "de", "tout", "?"];
    question.innerHTML = qwords.map((w, k) => `<span class="word" data-k="${k}"${w === "tout" ? ' style="font-style:italic"' : ""}>${w}</span>`).join(" ");
    question.words = Array.from(question.querySelectorAll(".word"));
    question.qline = qline;

    // viseur
    vf = el("div", "layer", root);
    vf.corners = [0, 1, 2, 3].map(k => {
      const c = el("div", "vf-corner", vf);
      const sides = [["Top", "Left"], ["Top", "Right"], ["Bottom", "Left"], ["Bottom", "Right"]][k];
      sides.forEach(sd => c.style["border" + sd + "Width"] = "3px");
      return c;
    });
    vf.focus = el("div", "", vf);
    vf.focus.style.cssText = "position:absolute;left:670px;top:500px;width:100px;height:80px;border:2px solid rgba(242,237,227,.85);border-radius:3px";
    vf.rd1 = el("div", "vf-readout", vf, "1/60&nbsp;&nbsp;&nbsp;F2.8&nbsp;&nbsp;&nbsp;ISO 400");
    vf.rd1.style.cssText += ";left:0;width:1440px;text-align:center;top:966px";
    vf.rd2 = el("div", "vf-readout", vf, "AF · RECHERCHE");
    vf.rd2.style.cssText += ";left:150px;top:100px";
    vf.rd3 = el("div", "vf-readout", vf, "24");
    vf.rd3.style.cssText += ";right:150px;top:100px";
    vf.dot = el("div", "", vf);
    vf.dot.style.cssText = "position:absolute;left:1262px;top:98px;width:10px;height:10px;border-radius:50%;background:#C8D48A";

    vign = el("div", "vignette", root);
    dark = el("div", "layer", root); dark.style.background = "#0c0c0a";
    flash = el("div", "flash", root);
  };

  /* ---------------- caméra ---------------- */
  function camera(t) {
    const q0 = M("q_tout"), sh = M("shutter"), mais = M("v5_mais");
    // hook : plan rapproché sur les Polaroids
    let z = lerp(1.42, 1.52, E.sine(inv(0, q0, t)));
    let cx = lerp(-30, 20, E.sine(inv(0, q0, t))), cy = 0, r = 0;
    // recul sur « tout »
    const pb = seg(t, q0 - 0.08, 1.45, E.inOut);
    z = lerp(z, 0.7, pb); cx = lerp(cx, -10, pb); cy = lerp(cy, 60, pb); r = lerp(0, -1.6, pb);
    // accumulation : lente dérive
    const acc = inv(q0 + 1.4, mais, t);
    z *= lerp(1, 1.1, E.sine(acc)); cx += lerp(0, 60, E.sine(acc)); r += lerp(0, 1.8, E.sine(acc));
    // « Mais où ? » : le viseur cherche
    const spots = [[-640, -330, 1.28], [640, 360, 1.3], [-120, 520, 1.22]];
    const dur = 0.42, gap = 0.2;
    let blur = 0;
    let bx = cx, by = cy, bz = z, br = r;
    spots.forEach((sp, k) => {
      const t0 = mais + 0.05 + k * (dur + gap);
      const e = seg(t, t0, dur, E.inOut);
      if (t >= t0) {
        bx = lerp(bx, sp[0], e); by = lerp(by, sp[1], e); bz = lerp(bz, sp[2], e); br = lerp(br, (k - 1) * 1.5, e);
        const mid = inv(t0, t0 + dur, t);
        blur = Math.max(blur, Math.sin(Math.PI * clamp(mid)) * 7);
        // mise au point qui « pompe » pendant le maintien
        const h = inv(t0 + dur, t0 + dur + gap, t);
        if (h > 0 && h < 1) blur = Math.max(blur, Math.sin(Math.PI * h) * 2.2);
      }
    });
    const back0 = mais + 0.05 + spots.length * (dur + gap);
    const back = seg(t, back0, sh - back0 - 0.12, E.inOut);
    bx = lerp(bx, 0, back); by = lerp(by, 60, back); bz = lerp(bz, 0.66, back); br = lerp(br, 0, back);
    if (t >= back0) blur = Math.max(0, blur * (1 - back)) + Math.sin(Math.PI * back) * 3.5;
    if (t >= mais) { cx = bx; cy = by; z = bz; r = br; }
    // main portée : micro-dérive
    const amp = t < mais ? 1 : 0.4;
    cx += drift(t, 0.3, 1) * 6 * amp; cy += drift(t, 0.27, 2) * 5 * amp; r += drift(t, 0.2, 3) * 0.15 * amp;
    if (t >= sh) { const f = camera.frozen || (camera.frozen = null); }
    return { cx, cy, z, r, blur };
  }
  function camAt(t) { return camera(Math.min(t, M("shutter"))); }

  function toScreen(cam, x, y) {
    const a = cam.r * Math.PI / 180, dx = (x - cam.cx) * cam.z, dy = (y - cam.cy) * cam.z;
    return [CX + dx * Math.cos(a) - dy * Math.sin(a), CY + dx * Math.sin(a) + dy * Math.cos(a)];
  }

  /* ---------------- mise à jour ---------------- */
  S.update = function (t) {
    const sh = M("shutter"), q0 = M("q_tout"), mais = M("v5_mais");
    const cam = t < sh ? camera(t) : camAt(sh);
    world.style.transform = `rotate(${cam.r.toFixed(3)}deg) scale(${cam.z.toFixed(4)}) translate(${(-cam.cx).toFixed(2)}px,${(-cam.cy).toFixed(2)}px)`;
    world.style.filter = cam.blur > 0.1 && t < sh ? `blur(${cam.blur.toFixed(2)}px)` : "none";

    // ouverture au noir
    put(dark, { op: 1 - seg(t, 0.05, 0.9, E.outSoft) });
    put(pool, { op: 0.6 + 0.4 * seg(t, 0, 1.2) });

    // ---- Polaroids
    polas.forEach((p, k) => {
      const tl = M(p.mark) - 0.26;                 // l'impact tombe sur la syllabe
      const e = seg(t, tl, 0.3, E.out);
      const st = spring(t - tl - 0.22, 26, 0.55);
      const air = 1 - e;
      put(p.el, { x: p.x - 130 + air * 30, y: p.y - 159 - air * 70, r: p.r + air * 9 + (1 - st) * 1.4 * (t > tl + 0.22 ? 1 : 0), s: 1 + air * 0.22, op: seg(t, tl, 0.08, E.linear) });
      p.el.style.zIndex = 50 + k;
      const sh2 = lerp(0.38, 0.9, air);
      p.el.style.boxShadow = `0 1px 1px rgba(0,0,0,.3), 0 ${(12 + air * 40).toFixed(1)}px ${(28 + air * 50).toFixed(1)}px rgba(0,0,0,${(0.38 * (1 - air * 0.4)).toFixed(3)}), 0 34px 70px rgba(0,0,0,${(0.22 * sh2).toFixed(3)})`;
      // développement de la photo
      const dv = seg(t, tl + 0.2, 1.6, E.outSoft);
      p.dev.style.background = `rgba(${Math.round(lerp(60, 200, 0))},${Math.round(lerp(64, 200, 0))},48,${(1 - dv) * 0.92})`;
      p.dev.style.background = `linear-gradient(rgba(74,78,54,${(1 - dv) * 0.95}), rgba(96,100,70,${(1 - dv) * 0.9}))`;
      p.img.style.filter = `grayscale(1) sepia(${lerp(0.55, 0.22, dv).toFixed(3)}) contrast(${lerp(0.7, 1.06, dv).toFixed(3)}) brightness(${lerp(1.25, 0.98, dv).toFixed(3)})`;
    });

    // ---- question « Tu te souviens de tout ? »
    const words = question.words;
    const ql = question.qline.words || [];
    words.forEach((w, k) => {
      const wt = (ql[Math.min(k, ql.length - 1)] || { t0: M("q_start") + k * 0.2 }).t0 - 0.06;
      const e = seg(t, wt, 0.42, E.out);
      put(w, { op: e, y: (1 - e) * 16, blur: (1 - e) * 5 });
    });
    const qOut = seg(t, q0 + 0.25, 0.6, E.in);
    put(question, { y: 868 - qOut * 30, op: 1 - qOut });

    // ---- feuilles
    const arrivals = { flo: "v3_rentree", fer: "v3_textes", peg: "v3_accum", bal: "v4_feuilles", cam: "v4_feuilles", are: "v4_notes" };
    const offs = { cam: 0.28, are: -0.25 };
    C.feuilles.forEach((f, i) => {
      const s = sheets[f.id], [hx, hy, hr] = s.home;
      let x = hx, y = hy, r = hr, op = 1;
      if (PRESENT.includes(f.id)) op = seg(t, q0 - 0.3, 0.25, E.linear);   // hors champ tant que la caméra est serrée (plus de bord de feuille à l'ouverture)
      if (!PRESENT.includes(f.id)) {
        const ta = M(arrivals[f.id]) + (offs[f.id] || 0) - 0.34;
        const e = seg(t, ta, 0.62, E.out);
        const n = Math.hypot(hx, hy) || 1, dist = 1500;
        x = hx + (hx / n) * dist * (1 - e); y = hy + (hy / n) * dist * (1 - e);
        r = hr + (1 - e) * (i % 2 ? 14 : -14);
        op = t < ta ? 0 : 1;
      }
      // respiration pendant « Tout est quelque part »
      const br = seg(t, M("v5_tout"), 2.5, E.sine);
      x += Math.sin(i * 1.7 + t * 0.9) * 5 * br; y += Math.cos(i * 1.3 + t * 0.8) * 5 * br;
      put(s.el, { x: x - SHEET_W / 2, y: y - SHEET_H / 2, r, op: t < sh ? op : 0 });
      s.el.style.zIndex = 10 + (PRESENT.includes(f.id) ? i : 20 + i);
      // annotations et surlignages
      s.strokes.forEach(st => {
        if (st.kind === "hl") {
          const e = seg(t, M("v4_citations") - 0.05 + st.k * 0.16 + (i % 3) * 0.07, 0.34, E.outSoft);
          st.node.style.transform = `scaleX(${e.toFixed(3)})`;
        } else {
          const e = seg(t, M("v4_notes") - 0.1 + st.k * 0.22 + (i % 4) * 0.09, 0.5, E.inOut);
          if (st.kind === "path") st.node.setAttribute("stroke-dashoffset", (st.len * (1 - e)).toFixed(1));
          else st.node.style.clipPath = `inset(0 ${(100 - e * 100).toFixed(1)}% 0 0)`;
        }
      });
    });

    // ---- post-it, fiches bristol
    extras.forEach((x, k) => {
      let px = x.x, py = x.y, pr = x.r, op = 1;
      if (!x.at) op = seg(t, q0 - 0.3, 0.25, E.linear);  // fiches déjà posées : hors champ tant que la caméra est serrée
      if (x.at) {                                        // pages qui arrivent pendant l'accumulation
        const ta = M(x.at) + (x.dt || 0) - 0.34, e = seg(t, ta, 0.62, E.out);
        const n = Math.hypot(px, py) || 1;
        px += (px / n) * 1500 * (1 - e); py += (py / n) * 1500 * (1 - e); pr += (1 - e) * 12;
        op = t < ta ? 0 : 1;
      }
      if (t > sh) {                                      // balayés hors champ au rangement
        const e = seg(t, sh + 0.2 + k * 0.05, 0.9, E.in);
        const n = Math.hypot(px, py) || 1;
        px += (px / n) * 1600 * e; py += (py / n) * 1600 * e + 200 * e; pr += e * 25;
      }
      put(x.el, { x: px - x.w / 2, y: py - x.h / 2, r: pr, op });
      x.el.style.zIndex = x.kind === "page" ? 25 + k : 40 + k;
    });
    polas.forEach((p, k) => {
      if (t > sh) {
        const e = seg(t, sh + 0.25 + k * 0.06, 0.95, E.in);
        const dx = p.x * 3, dy = 1500;
        put(p.el, { x: p.x - 130 + dx * e, y: p.y - 159 + dy * e, r: p.r + e * (k % 2 ? 30 : -30), op: 1 });
      }
    });

    // ---- viseur
    const vfIn = seg(t, mais - 0.05, 0.35, E.out) * (1 - seg(t, sh + 0.05, 0.25, E.linear));
    put(vf, { op: vfIn });
    if (vfIn > 0) {
      const lock = seg(t, sh - 0.35, 0.2, E.out);
      const inset = lerp(170, 120, E.out(vfIn)) + lock * 14;
      const [c0, c1, c2, c3] = vf.corners;
      put(c0, { x: inset, y: inset * 0.75 }); put(c1, { x: W - inset - 46, y: inset * 0.75 });
      put(c2, { x: inset, y: H - inset * 0.75 - 46 }); put(c3, { x: W - inset - 46, y: H - inset * 0.75 - 46 });
      const hunting = t < sh - 0.35;
      vf.focus.style.borderColor = hunting ? "rgba(242,237,227,.85)" : "#C8D48A";
      put(vf.focus, { s: hunting ? 1 + Math.sin(t * 22) * 0.04 : lerp(1.15, 1, lock) });
      vf.rd2.innerHTML = hunting ? (Math.floor(t * 4) % 2 ? "AF · RECHERCHE" : "AF · RECHERCHE ·") : "AF · OK";
      vf.dot.style.opacity = hunting ? (Math.floor(t * 3) % 2 ? 1 : 0.25) : 1;
    }

    // ---- obturateur : noir du miroir puis éclair doux
    const blk = t >= sh && t < sh + 0.067 ? 0.6 : 0;      // déclic : un assombrissement, pas une image noire
    put(dark, { op: Math.max(1 - seg(t, 0.05, 0.9, E.outSoft), blk) });
    put(flash, { op: t >= sh + 0.067 ? 0.55 * (1 - seg(t, sh + 0.067, 0.45, E.out)) : 0 });

    // ---- développement du fond et rangement
    const dv = seg(t, sh + 0.15, 1.5, E.inOut);
    put(develop, { op: seg(t, sh + 0.3, 1.1, E.inOut) });
    put(khaki, { op: Math.sin(Math.PI * dv) * 0.9 });
    put(vign, { op: 1 - seg(t, sh + 0.4, 1.2) });
    put(bg, { op: t < sh + 1.6 ? 1 : 0 });

    const cam0 = camAt(sh);
    C.feuilles.forEach((f, i) => {
      const c = cards[f.id], s = sheets[f.id];
      if (t < sh) { put(c.box, { op: 0 }); return; }
      const [hx, hy, hr] = s.home;
      const [sx, sy] = toScreen(cam0, hx, hy);
      const slot = UI.slot(i); slot.x += S.GRID_DX; slot.y += S.GRID_DY;
      const t0 = sh + 0.35 + i * 0.075;
      const e = seg(t, t0, 1.25, E.emph);
      const ew = seg(t, t0 + 0.1, 1.1, E.inOut);
      const bw = lerp(SHEET_W * cam0.z, slot.w, ew), bh = lerp(SHEET_H * cam0.z, slot.h, ew);
      const cxs = lerp(sx, slot.x + slot.w / 2, e), cys = lerp(sy, slot.y + slot.h / 2, e);
      const rr = lerp(hr + cam0.r, 0, e);
      c.box.style.width = bw.toFixed(2) + "px"; c.box.style.height = bh.toFixed(2) + "px";
      c.box.style.borderRadius = lerp(0, 16, ew).toFixed(2) + "px";
      put(c.box, { x: cxs - bw / 2, y: cys - bh / 2, r: rr, op: 1 });
      c.box.style.boxShadow = `0 0 0 1px rgba(29,30,26,${lerp(0, 0.08, ew).toFixed(3)}), 0 ${lerp(18, 2, ew).toFixed(1)}px ${lerp(40, 6, ew).toFixed(1)}px rgba(20,20,16,${lerp(0.35, 0.05, ew).toFixed(3)})`;
      c.box.style.background = ew > 0.5 ? "#FFFFFF" : "#FBF8F2";
      // contenu : la feuille s'efface sous la carte
      c.inner.style.transform = `scale(${cam0.z.toFixed(4)})`;
      c.inner.style.opacity = (1 - seg(t, t0 + 0.35, 0.5, E.linear)).toFixed(3);
      c.card.style.opacity = seg(t, t0 + 0.7, 0.45, E.out).toFixed(3);
      c.box.style.zIndex = 5 + i;
    });
  };

  S.blur = t => {
    const q0 = M("q_tout");
    if (t > q0 && t < q0 + 1.3) return 6;                 // grand recul
    const sh = M("shutter");
    if (t > sh + 0.3 && t < sh + 1.6) return 12;          // envol des objets (plus de dédoublement en escalier)
    return 1;
  };

  S.cards = cards;
  (window.SCENES = window.SCENES || []).push(S);
})();
