/* =====================================================================
   SCÈNE 8 · POUR TOUTE LA CLASSE
   Une page Seyès. « Gratuit. Sans compte. » s’écrit à l’encre, le
   téléphone se pose sur la page ; la caméra recule : un plan de classe
   est dessiné au crayon ; le téléphone rejoint sa place, puis chaque
   place est cochée, chacune par un stylo différent, à son rythme.
   ===================================================================== */
(function () {
  "use strict";
  const { E, seg, lerp, clamp, inv, el, svgEl, put, cue: M, spring } = window.ENG;
  const S = { name: "classe" };
  S.t0 = () => M("v12_start") - 0.35;
  S.t1 = () => M("v14_start") - 0.29;

  // plan : 6 rangées × 3 tables de deux (36 places), coordonnées de la page (= écran quand la caméra est à 1)
  const COLS = [560, 820, 1080], ROWS = [480, 570, 660, 750, 840, 930], TW = 176, TH = 54;
  const INKS = ["#2F3B63", "#1D1E1A", "#2F5E3C", "#A8432F", "#4B3F7A", "#5B5A55", "#2F3B63", "#1D1E1A"];
  const MINE = { r: 2, c: 1, s: 0 };
  const rnd = (k => () => (k = (k * 16807) % 2147483647) / 2147483647)(42);

  let root, cam, page, words = [], phone, svg, tables = [], seats = [], board, tg1, caption;

  function wobblyRect(x, y, w, h) {
    const j = () => ((rnd() - 0.5) * 3).toFixed(2);
    return `M${x + +j()} ${y + +j()} L${x + w + +j()} ${y + +j()} L${x + w + +j()} ${y + h + +j()} L${x + +j()} ${y + h + +j()} Z`;
  }

  S.build = function (stage) {
    root = el("div", "layer", stage);
    root.style.background = "#F4F0E6";
    cam = el("div", "layer", root);
    cam.style.overflow = "visible";
    cam.style.transformOrigin = "0 0";
    // la page Seyès (réglure : fines tous les 16 px, fortes tous les 64, verticales, marge rouge)
    page = el("div", "layer", cam);
    page.style.background = [
      "linear-gradient(to right, transparent 149px, rgba(196,103,78,.55) 149px, rgba(196,103,78,.55) 151px, transparent 151px)",
      "repeating-linear-gradient(to bottom, transparent 0 63px, rgba(122,146,172,.30) 63px 64px)",
      "repeating-linear-gradient(to bottom, transparent 0 15px, rgba(122,146,172,.13) 15px 16px)",
      "repeating-linear-gradient(to right, transparent 0 63px, rgba(122,146,172,.16) 63px 64px)",
      "#F4F0E6 url(../assets/textures/paper_offwhite.png) center/1440px"].join(",");
    // « Gratuit. Sans compte. » écrit à la main
    [["Gratuit.", 190, 172], ["Sans compte.", 190, 268]].forEach(([w, x, y]) => {
      const e = el("div", "abs", cam, w);
      e.style.cssText += `;left:${x}px;top:${y}px;font:500 92px/1 Hand;color:#2F3B63;white-space:nowrap`;
      words.push(e);
    });
    caption = el("div", "abs", cam, "TG1 · Lycée Notre-Dame · 2026–27");
    caption.style.cssText += ";left:196px;top:392px;font:500 34px/1 Hand;color:#5B5A55;white-space:nowrap";
    // plan au crayon
    svg = svgEl("svg", { width: 1440, height: 1080, style: "position:absolute;left:0;top:0;overflow:visible" }, cam);
    const brd = svgEl("path", { d: wobblyRect(690, 402, 260, 20), fill: "none", stroke: "#5B5A55", "stroke-width": 2.2, "stroke-linejoin": "round", opacity: 0.8, pathLength: 100, "stroke-dasharray": 100 }, svg);
    board = { path: brd };
    board.label = el("div", "abs", cam, "tableau");
    board.label.style.cssText += ";left:690px;top:370px;width:260px;text-align:center;font:500 26px/1 Hand;color:#5B5A55";
    tg1 = el("div", "abs", cam, "TG1");
    tg1.style.cssText += ";left:990px;top:392px;font:600 40px/1 Hand;color:#A8432F";
    tg1.ring = svgEl("path", { d: "M1066 408 C 1066 382, 986 378, 982 408 C 978 436, 1064 438, 1070 404", fill: "none", stroke: "#A8432F", "stroke-width": 2.4, "stroke-linecap": "round", pathLength: 100, "stroke-dasharray": 100 }, svg);
    ROWS.forEach((y, r) => COLS.forEach((x, c) => {
      const p = svgEl("path", { d: wobblyRect(x - TW / 2, y - TH / 2, TW, TH), fill: "rgba(91,90,85,0)", stroke: "#5B5A55", "stroke-width": 2, "stroke-linejoin": "round", opacity: 0.8, pathLength: 100, "stroke-dasharray": 100 }, svg);
      const mid = svgEl("line", { x1: x, y1: y - TH / 2 + 8, x2: x, y2: y + TH / 2 - 8, stroke: "#5B5A55", "stroke-width": 1.2, opacity: 0 }, svg);
      tables.push({ p, mid, x, y, r, c, d: rnd() * 0.25, d0: p.getAttribute("d") });
      [0, 1].forEach(s => {
        const sx = x + (s ? 1 : -1) * TW / 4, sy = y;
        const tick = svgEl("path", { d: `M${sx - 13} ${sy + 1} L${sx - 4} ${sy + 11} L${sx + 15} ${sy - 12}`, fill: "none",
          stroke: INKS[Math.floor(rnd() * INKS.length)], "stroke-width": (3.2 + rnd() * 1.2).toFixed(2), "stroke-linecap": "round", "stroke-linejoin": "round",
          pathLength: 100, "stroke-dasharray": 100, "stroke-dashoffset": 100 }, svg);
        seats.push({ tick, sx, sy, r, c, s, mine: r === MINE.r && c === MINE.c && s === MINE.s, d: rnd() });
      });
    }));
    // le téléphone posé sur la page (écran de l’application, vue mobile)
    phone = el("div", "abs", cam);
    phone.style.cssText += ";left:0;top:0;width:124px;height:248px;border-radius:20px;background:#1D1E1A;padding:6px;box-shadow:0 2px 3px rgba(0,0,0,.25),0 14px 30px rgba(40,42,30,.28);transform-origin:62px 124px";
    phone.innerHTML = `<div style="width:100%;height:100%;border-radius:15px;background:#FAF7F0;overflow:hidden;position:relative">
      <div style="position:absolute;left:10px;top:16px;display:flex;align-items:center;gap:6px">${window.BRAND.markSVG(15, "phmark")}<span style="font:400 10.5px/1 News;color:#1D1E1A;white-space:nowrap">Cahier d<span style="color:#C4674E">’</span>HLP</span></div>
      <div style="position:absolute;left:10px;right:10px;top:46px;height:84px;border-radius:4px;background:#FBF8F0;box-shadow:0 0 0 1px rgba(0,0,0,.06);background-image:linear-gradient(to bottom, transparent 20px, rgba(196,103,78,.5) 20px, rgba(196,103,78,.5) 21px, transparent 21px)">
        <div style="position:absolute;left:0;right:0;top:36px;text-align:center;font:400 10px/1.2 News;color:#1D1E1A">Heure du lever<br>de Gargantua ?</div></div>
      <div style="position:absolute;left:10px;right:10px;top:140px;display:flex;gap:5px">${[5, 4, 8, 3, 11].map(n => `<div style="flex:1;height:30px;border-radius:3px;background:#D6C19C;font:400 11px/30px News;text-align:center;color:#2E2518">${n}</div>`).join("")}</div>
      <div style="position:absolute;left:10px;right:10px;bottom:12px;height:24px;border-radius:6px;background:#39402F;color:#F2EDE3;font:600 9.5px/24px Sans;text-align:center">Reprendre</div></div>`;
  };

  S.update = function (t) {
    const t0 = S.t0(), gr = M("v12_gratuit"), co = M("v12_compte"), tel = M("v12_telephone");
    const v13 = M("v13_start"), nous = M("v13_nous"), cl = M("v13_classe"), v14 = M("v14_start");
    // la page s’ouvre depuis le point « Arendt » de la frise
    const [ax, ay] = window.SCENES.find(s => s.name === "frise").nodeXY(8);
    const rv = seg(t, t0, 0.65, E.inOut);
    root.style.clipPath = rv < 1 ? `circle(${(rv * 1900).toFixed(1)}px at ${ax}px ${ay}px)` : "none";
    // caméra : plan serré sur le titre, puis recul sur toute la page
    const pb = seg(t, v13 - 0.1, 1.3, E.inOut);
    const z = lerp(1.55, 1.0, pb), fx = lerp(520, 720, pb), fy = lerp(360, 540, pb);   // cadre toujours couvert par la page
    cam.style.transform = `translate(${(720 - fx * z).toFixed(2)}px, ${(540 - fy * z).toFixed(2)}px) scale(${z.toFixed(4)})`;
    const out = seg(t, v14 - 0.85, 0.35);                       // tout s’efface sauf les tables
    [gr, co].forEach((tw, k) => {
      const e = seg(t, tw - 0.08, 0.55 + k * 0.15, E.inOut);
      words[k].style.clipPath = `inset(-20% ${((1 - e) * 100).toFixed(1)}% -30% 0)`;
      put(words[k], { op: 1 - out, r: -1.5 });
    });
    const cap = seg(t, v13 + 0.5, 0.6, E.inOut);
    caption.style.clipPath = `inset(-20% ${((1 - cap) * 100).toFixed(1)}% -30% 0)`;
    put(caption, { op: 1 - out });
    // le téléphone : glisse sur la page, puis rejoint sa place
    const pin = seg(t, tel - 0.4, 0.6, E.emph);
    const mySeat = seats.find(s => s.mine);
    const toSeat = seg(t, nous - 0.45, 0.8, E.emph);
    const px = lerp(lerp(1600, 740, pin), mySeat.sx, toSeat), py = lerp(300, mySeat.sy, toSeat);
    put(phone, { x: px - 62, y: py - 124, s: lerp(1, 0.26, toSeat), r: lerp(lerp(18, 7, pin), -8, toSeat), op: t >= tel - 0.4 ? 1 - out : 0 });
    // plan au crayon : tableau, tables (dans l’ordre, avec un peu d’irrégularité)
    const drawStart = v13 + 0.15, drawDur = Math.max(1.0, nous - v13);
    board.path.setAttribute("stroke-dashoffset", (100 * (1 - seg(t, drawStart, 0.35, E.inOut))).toFixed(1));
    board.path.style.opacity = (0.8 * (1 - out)).toFixed(3);
    put(board.label, { op: seg(t, drawStart + 0.2, 0.3) * (1 - out) });
    tg1.style.clipPath = `inset(-30% ${((1 - seg(t, M("v13_tg1") - 0.05, 0.35, E.inOut)) * 100).toFixed(1)}% -30% 0)`;
    tg1.ring.setAttribute("stroke-dashoffset", (100 * (1 - seg(t, M("v13_tg1") + 0.3, 0.4, E.inOut))).toFixed(1));
    put(tg1, { op: 1 - out });
    tg1.ring.style.opacity = (1 - out).toFixed(3);
    // relais : les trois tables d’une rangée glissent l’une vers l’autre et forment une barre
    const merge = seg(t, v14 - 0.8, 0.5, E.inOut);
    const x0 = COLS[0] - TW / 2, span = (COLS[2] + TW / 2 - x0) / 3;
    tables.forEach(tb => {
      const t1 = drawStart + 0.15 + (tb.r * 3 + tb.c) / 18 * drawDur * 0.8 + tb.d * 0.2;
      if (merge > 0) {
        const nx = lerp(tb.x - TW / 2, x0 + tb.c * span, merge), nw = lerp(TW, span + (tb.c < 2 ? 0.5 : 0), merge);
        tb.p.setAttribute("d", `M${nx.toFixed(2)} ${tb.y - TH / 2} L${(nx + nw).toFixed(2)} ${tb.y - TH / 2} L${(nx + nw).toFixed(2)} ${tb.y + TH / 2} L${nx.toFixed(2)} ${tb.y + TH / 2} Z`);
        tb.p.setAttribute("stroke-dashoffset", 0);
      } else {
        tb.p.setAttribute("d", tb.d0);
        tb.p.setAttribute("stroke-dashoffset", (100 * (1 - seg(t, t1, 0.28, E.inOut))).toFixed(1));
      }
      tb.p.setAttribute("fill", `rgba(91,90,85,${(0.10 * merge).toFixed(3)})`);
      tb.mid.style.opacity = (0.45 * seg(t, t1 + 0.2, 0.2) * (1 - merge)).toFixed(3);
    });
    // les coches : la mienne d’abord, puis toute la classe, stylo par stylo, sans métronome
    seats.forEach(s => {
      const ts = s.mine ? nous + 0.4 : cl - 0.32 + s.d * 1.05 + s.r * 0.03;
      s.tick.setAttribute("stroke-dashoffset", (100 * (1 - seg(t, ts, 0.16 + s.d * 0.08, E.out))).toFixed(1));
      s.tick.style.opacity = (1 - merge).toFixed(3);
    });
    // la réglure s’efface au moment du relais (le carton de fin est sur papier nu)
    page.style.opacity = "1";
  };
  S.blur = t => { const n = M("v13_nous"), tl = M("v12_telephone"); return (t > n - 0.45 && t < n + 0.4) || (t > tl - 0.4 && t < tl + 0.25) ? 6 : 1; };
  S.geometry = () => ({ COLS, ROWS, TW, TH });
  S.seatTimes = () => seats.map(s => ({ t: s.mine ? M("v13_nous") + 0.4 : M("v13_classe") - 0.32 + s.d * 1.05 + s.r * 0.03, x: s.sx }));
  S.sounds = function () {
    const out = [], v13 = M("v13_start"), nous = M("v13_nous");
    const add = (t, sfx, g, p = 0, o = {}) => out.push(Object.assign({ t, sfx, g, p, scene: "classe" }, o));
    add(S.t0(), "air_soft", -22);
    add(M("v12_gratuit") - 0.06, "write_a", -21, -0.15);
    add(M("v12_compte") - 0.06, "write_b", -21, 0.1);
    add(M("v12_telephone") - 0.3, "paper_slide_6", -22, 0.3);
    const drawStart = v13 + 0.15;
    add(drawStart, "pen_stroke_2", -25, 0);                            // le tableau
    add(drawStart + 0.3, "pencil_caption", -25, 0.1);                  // les tables, au crayon
    add(M("v13_tg1") + 0.3, "marker_1", -23, -0.2);                    // « TG1 » entouré
    // les coches : la mienne, puis quelques-unes de la classe (pas toutes : on entend un geste, pas un métronome)
    const st = S.seatTimes().map((s, i) => ({ ...s, i })).sort((a, b) => a.t - b.t);
    const mine = st.find(s => Math.abs(s.t - (nous + 0.4)) < 1e-6);
    if (mine) add(mine.t + 0.02, "pen_stroke_4", -21, clamp((mine.x - 720) / 1400, -0.4, 0.4));
    let last = -1, j = 0;
    st.filter(s => s !== mine).forEach(s => {
      if (s.t - last < 0.13 || j >= 8) return;
      add(s.t + 0.02, ["pen_stroke_1", "pen_stroke_3", "pen_stroke_4"][j % 3], -25 - (j % 3), clamp((s.x - 720) / 1400, -0.4, 0.4));
      last = s.t; j++;
    });
    return out;
  };

  (window.SCENES = window.SCENES || []).push(S);
})();
