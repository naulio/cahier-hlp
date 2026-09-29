/* =====================================================================
   SCÈNE 9 · CARTON DE FIN
   Les rangées de tables deviennent la réglure du symbole ; le carré kaki
   se pose dessous, la marge se trace, le « c’ » s’écrit ; nom, promesse
   (« Tout est là. », en écho à « Mais où ? »), adresse tenue à l’écran.
   Dernier déclic : le carton devient un Polaroid posé sur le bureau
   (rappel du premier plan), légende et adresse écrites à la main.
   ===================================================================== */
(function () {
  "use strict";
  const { E, seg, lerp, clamp, inv, el, put, cue: M, spring } = window.ENG;
  const C = window.CONTENT, B = window.BRAND;
  const S = { name: "end" };
  S.t0 = () => M("v14_start") - 0.3;          // relais image pour image avec la scène « classe »
  S.t1 = () => M("end") + 0.01;

  const SIZE = 150, K = SIZE / 128, MY = 300;
  const RULE_Y = [40, 56, 72, 88], RULE_W = [1.4, 1.4, 2.6, 1.4], RULE_OP = [0.24, 0.24, 0.45, 0.24];
  const ROW_TO_RULE = [0, 0, 1, 2, 3, 3];
  let root, desk, frame, cap1, cap2, card, paper, seyes, bars = [], mark, word, sub, tag, tagHl, url;
  let MX = 280, WORD_W = 690;

  S.build = function (stage) {
    root = el("div", "layer", stage);
    desk = el("div", "layer", root);
    desk.style.background = "#22231F url(../assets/textures/desk_dark.png) center/cover";
    const pool = el("div", "layer", desk);
    pool.style.background = "radial-gradient(ellipse 60% 55% at 50% 46%, rgba(255,238,205,.10), rgba(255,238,205,0) 70%)";
    frame = el("div", "abs", root);
    frame.style.cssText += ";background:#F4F1EA url(../assets/textures/paper_sheet.png) center/600px;box-shadow:0 1px 1px rgba(0,0,0,.3),0 16px 36px rgba(0,0,0,.4),0 40px 90px rgba(0,0,0,.25)";
    cap1 = el("div", "abs", root, "TG1 · 2026–27");
    cap1.style.cssText += ";font:600 52px/1 Hand;color:#2F3B63;white-space:nowrap";
    cap2 = el("div", "abs", root, C.brand.url);
    cap2.style.cssText += ";font:500 40px/1 Hand;color:#4A4A45;white-space:nowrap";
    card = el("div", "layer", root);
    card.style.transformOrigin = "0 0";
    paper = el("div", "layer", card);
    paper.style.background = "#F4F0E6 url(../assets/textures/paper_offwhite.png) center/1440px";
    seyes = el("div", "layer", card);                       // la même page Seyès que la scène précédente
    seyes.style.background = [
      "linear-gradient(to right, transparent 149px, rgba(196,103,78,.55) 149px, rgba(196,103,78,.55) 151px, transparent 151px)",
      "repeating-linear-gradient(to bottom, transparent 0 63px, rgba(122,146,172,.30) 63px 64px)",
      "repeating-linear-gradient(to bottom, transparent 0 15px, rgba(122,146,172,.13) 15px 16px)",
      "repeating-linear-gradient(to right, transparent 0 63px, rgba(122,146,172,.16) 63px 64px)"].join(",");
    mark = el("div", "abs", card, B.markSVG(SIZE, "endmark"));
    mark.svg = mark.querySelector("svg");
    for (let r = 0; r < 6; r++) {
      const b = el("div", "abs", card);
      b.style.cssText += ";left:0;top:0;height:54px;border-radius:2px;box-sizing:border-box";
      bars.push(b);
    }
    word = el("div", "abs", card, `<span class="mask" style="padding-bottom:.22em"><span class="word">${B.wordmark(118)}</span></span>`);
    word.inner = word.querySelector(".word");
    sub = el("div", "abs mono", card, "Le site de révision d’HLP · Terminale");
    sub.style.cssText += ";left:0;width:1440px;text-align:center;font:500 18px/1 Mono;letter-spacing:.22em;color:#5F6443;white-space:nowrap";
    tag = el("div", "abs", card);
    tag.style.cssText += ";left:0;width:1440px;text-align:center;font:italic 400 76px/1 News;letter-spacing:-.02em;color:#1D1E1A";
    tag.innerHTML = `<span style="position:relative;display:inline-block;padding:0 14px"><span class="hl" style="position:absolute;left:0;right:0;top:34%;bottom:4%;background:#DCD48A;opacity:.85;border-radius:3px;transform-origin:0 50%"></span><span class="tx" style="position:relative">Tout est là.</span></span>`;
    tagHl = tag.querySelector(".hl"); tag.tx = tag.querySelector(".tx");
    url = el("div", "abs", card, `<span style="display:inline-flex;align-items:center;gap:14px;height:60px;padding:0 28px;border-radius:30px;background:#1D1E1A;color:#F2EDE3;font:500 22px/1 Mono;letter-spacing:.03em">${C.brand.url}${window.icon("arrow", 22, 'style="stroke:#DCD48A;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round"')}</span>`);
    url.style.cssText += ";left:0;width:1440px;text-align:center";
  };

  S.update = function (t) {
    const t0 = S.t0(), v14 = M("v14_start"), nm = M("v14_cahier"), tt = M("v14_tout"), ve = M("v14_end"), capT = M("capture");
    if (!S.measured && word.inner.offsetWidth > 0) {        // centrer le bloc symbole + nom
      WORD_W = word.inner.getBoundingClientRect().width;
      MX = 720 - (SIZE * 124 / 128 + 40 + WORD_W) / 2;
      S.measured = true;
    }
    put(root, { op: 1 });
    // ---- les rangées deviennent la réglure du symbole
    const G = window.SCENES.find(s => s.name === "classe").geometry();
    const x0 = G.COLS[0] - G.TW / 2, x1 = G.COLS[2] + G.TW / 2;
    const cv = seg(t, t0 + 0.02, 1.0, E.emph);
    const col = seg(t, t0 + 0.35, 0.5, E.inOut);
    bars.forEach((b, r) => {
      const k = ROW_TO_RULE[r];
      const ty = MY + (RULE_Y[k] + 10) * K - RULE_W[k] * K / 2, th = RULE_W[k] * K;
      const tx0 = MX + 4 * K, tx1 = MX + 124 * K;
      const y = lerp(G.ROWS[r] - G.TH / 2, ty, cv), h = lerp(G.TH, th, cv);
      const xa = lerp(x0, tx0, cv), xb = lerp(x1, tx1, cv);
      b.style.width = (xb - xa).toFixed(2) + "px"; b.style.height = Math.max(0.8, h).toFixed(2) + "px";
      put(b, { x: xa, y, op: 1 - seg(t, t0 + 0.95, 0.15, E.linear) });
      b.style.border = `${lerp(2, 0, col).toFixed(2)}px solid rgba(91,90,85,${(0.8 * (1 - col)).toFixed(3)})`;
      b.style.background = `rgba(${Math.round(lerp(91, 242, col))},${Math.round(lerp(90, 237, col))},${Math.round(lerp(85, 227, col))},${lerp(0.1, RULE_OP[k] + 0.2, col).toFixed(3)})`;
    });
    put(seyes, { op: 1 - seg(t, t0 + 0.15, 0.55, E.inOut) });
    // ---- le symbole : carré kaki dessous, réglure, marge, puis la lettre
    put(mark, { x: MX, y: MY - 10 * K, op: 1 });
    B.animateMark(mark.svg, {
      bg: t < v14 + 0.2 ? 0 : clamp(spring(t - (v14 + 0.2), 17, 0.72), 0, 1.06),
      rules: t < t0 + 0.95 ? 0 : 1,
      margin: seg(t, v14 + 0.45, 0.45, E.out),
      letter: seg(t, nm - 0.2, 0.55, E.out),
    });
    // ---- nom, sous-titre, promesse, adresse
    const wIn = seg(t, nm - 0.12, 0.7, E.out);
    put(word.inner, { y: (1 - wIn) * 160 });
    put(word, { x: MX + SIZE * 124 / 128 + 40, y: MY + 6 });
    put(sub, { y: MY + SIZE + 34, op: seg(t, nm + 0.55, 0.6), });
    const hl = seg(t, tt - 0.1, 0.55, E.inOut);
    tagHl.style.transform = `scaleX(${hl.toFixed(3)})`;
    tag.tx.style.clipPath = `inset(-20% ${((1 - seg(t, tt - 0.05, 0.5, E.inOut)) * 100).toFixed(1)}% -30% 0)`;
    put(tag, { y: MY + SIZE + 108 });
    const uIn = seg(t, ve + 0.1, 0.6, E.emph);
    put(url, { y: MY + SIZE + 244 + (1 - uIn) * 16, op: uIn });

    // ---- déclic final : le carton devient un Polaroid posé sur le bureau
    const sh = seg(t, capT + 0.08, 1.25, E.emph);
    const s = lerp(1, 0.47, sh), rot = lerp(0, -2.4, sh);
    const cw = 1440 * s, ch = 1080 * s, pad = 30, bottom = 176;
    const cx0 = 720, cy0 = lerp(540, 430, sh);
    const fx = cx0 - cw / 2, fy = cy0 - ch / 2;
    const a = rot * Math.PI / 180;
    const R = (x, y) => [cx0 + (x - cx0) * Math.cos(a) - (y - cy0) * Math.sin(a), cy0 + (x - cx0) * Math.sin(a) + (y - cy0) * Math.cos(a)];
    const [px, py] = R(fx, fy);
    card.style.transform = `translate(${px.toFixed(2)}px,${py.toFixed(2)}px) rotate(${rot.toFixed(3)}deg) scale(${s.toFixed(4)})`;
    frame.style.transformOrigin = "0 0";
    frame.style.width = (cw + pad * 2).toFixed(1) + "px";
    frame.style.height = (ch + pad + bottom).toFixed(1) + "px";
    const [qx, qy] = R(fx - pad, fy - pad);
    frame.style.transform = `translate(${qx.toFixed(2)}px,${qy.toFixed(2)}px) rotate(${rot.toFixed(3)}deg)`;
    const fo = seg(t, capT + 0.15, 0.35);
    frame.style.opacity = fo.toFixed(3);
    frame.style.visibility = fo > 0 ? "visible" : "hidden";
    [[cap1, fy + ch + 62, capT + 1.1, 1.0], [cap2, fy + ch + 124, capT + 1.95, 1.1]].forEach(([c, yy, ts, d]) => {
      const [kx, ky] = R(cx0, yy);
      const w = c.offsetWidth || 400;
      c.style.transformOrigin = "0 0";
      c.style.transform = `translate(${(kx - w / 2).toFixed(2)}px,${(ky - 26).toFixed(2)}px) rotate(${(rot - 1.2).toFixed(3)}deg)`;
      c.style.clipPath = `inset(-40% ${((1 - seg(t, ts, d, E.inOut)) * 100).toFixed(1)}% -40% 0)`;
      c.style.opacity = t > ts - 0.02 ? 1 : 0;
    });
    put(desk, { op: t > capT + 0.1 ? 1 : 0 });
    // fondu final
    root.style.filter = t > capT + 3.3 ? `brightness(${(1 - seg(t, capT + 3.3, M("end") - capT - 3.35, E.inOut)).toFixed(3)})` : "none";
    root.style.background = "#000";
    // exposition au déclic (sans image noire)
    const pulse = t >= capT ? Math.exp(-(t - capT) / 0.09) : 0;
    if (pulse > 0.02 && t < capT + 0.5) root.style.filter = `brightness(${(1 + 0.2 * pulse).toFixed(3)})`;
  };
  S.blur = t => { const c = M("capture"); const t0 = S.t0(); return (t > c && t < c + 1.35) || (t > t0 && t < t0 + 1.05) ? 8 : 1; };
  S.sounds = function () {
    const v14 = M("v14_start"), capT = M("capture");
    const add = (t, sfx, g, p = 0, o = {}) => Object.assign({ t, sfx, g, p, scene: "end" }, o);
    return [
      add(v14 + 0.2, "paper_down", -21),                               // le carré kaki se pose
      add(M("v14_cahier") - 0.18, "pen_stroke_2", -25),                // le « c’ »
      add(M("v14_tout") - 0.1, "marker_2", -21),                       // surligneur sur « Tout est là. »
      add(capT - 0.03, "shutter_k1000", -8),                           // même Polaroid qu’au début
      add(capT + 0.12, "polaroid_eject", -14, 0, { len: 1.0, fade: 0.3 }),
      add(capT + 1.1, "pencil_caption", -17, -0.05),                   // légende écrite à la main
      add(capT + 1.95, "write_b", -18, 0.05, { len: 1.1, fade: 0.2 }),
    ];
  };

  (window.SCENES = window.SCENES || []).push(S);
})();
