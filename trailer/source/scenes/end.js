/* =====================================================================
   SCÈNE 9 · CARTON DE FIN
   Les rangées de tables glissent et deviennent les trois lignes du logo ;
   le fond se « développe » ; nom, promesse, adresse.
   Dernier déclic : le carton devient un Polaroid posé sur le bureau
   (rappel du tout premier plan).
   ===================================================================== */
(function () {
  "use strict";
  const { E, seg, lerp, clamp, inv, el, svgEl, put, cue: M, spring } = window.ENG;
  const C = window.CONTENT;
  const S = { name: "end" };
  S.t0 = () => M("v14_start") - 0.3;   // relais image pour image avec la scène « classe »
  S.t1 = () => M("end") + 0.01;

  let root, desk, frame, cap, card, cardBg, bars = [], markBg, margin, word, sub, tag, url, dark, flash;
  const MARK = 150, MX = 720 - 330, MY = 350;   // position du logo dans le carton

  S.build = function (stage) {
    root = el("div", "layer", stage);
    desk = el("div", "layer", root);
    desk.style.background = "#22231F url(../assets/textures/desk_dark.png) center/cover";
    const pool = el("div", "layer", desk);
    pool.style.background = "radial-gradient(ellipse 60% 55% at 50% 46%, rgba(255,238,205,.10), rgba(255,238,205,0) 70%)";
    frame = el("div", "abs", root);
    frame.style.cssText += ";background:#F4F1EA url(../assets/textures/paper_sheet.png) center/600px;box-shadow:0 1px 1px rgba(0,0,0,.3),0 16px 36px rgba(0,0,0,.4),0 40px 90px rgba(0,0,0,.25)";
    cap = el("div", "abs", root, "TG1 — 2026-27");
    cap.style.cssText += ";font:500 50px/1 Hand;color:#2c2f3a;white-space:nowrap";
    card = el("div", "layer", root);
    card.style.transformOrigin = "0 0";
    cardBg = el("div", "layer", card);
    const green = el("div", "layer", card);
    green.style.background = "radial-gradient(ellipse 90% 80% at 50% 45%, #414936, #2F3527)";
    card.green = green;
    cardBg.style.background = "#F2EDE3 url(../assets/textures/paper_offwhite.png) center/1440px";
    // fond du logo + marge + 3 lignes (issues des rangées de tables)
    markBg = el("div", "abs", card);
    markBg.style.cssText += `;left:${MX}px;top:${MY}px;width:${MARK}px;height:${MARK}px;border-radius:${MARK * 28 / 120}px;background:#5F6443`;
    for (let k = 0; k < 6; k++) {
      const b = el("div", "abs", card);
      b.style.cssText += ";height:6px;border-radius:3px;background:#F2EDE3";
      bars.push(b);
    }
    margin = el("div", "abs", card);
    margin.style.cssText += `;left:${MX + MARK * 22 / 120 - 3}px;top:${MY + MARK * 18 / 120}px;width:6px;height:${MARK * 84 / 120}px;border-radius:3px;background:#D4775C;transform-origin:50% 0`;
    word = el("div", "abs", card, `<span class="mask" style="padding-bottom:.2em"><span class="word">${window.SCENES.find(s => s.name === "app").wordmark(128, "#1D1E1A")}</span></span>`);
    word.style.cssText += `;left:${MX + MARK + 40}px;top:${MY + 6}px`;
    word.inner = word.querySelector(".word");
    sub = el("div", "abs mono", card, "Humanités · Littérature · Philosophie — Terminale");
    sub.style.cssText += `;left:0;width:1440px;text-align:center;top:${MY + MARK + 58}px;font:500 16px/1 Mono;letter-spacing:.2em;color:#5F6443`;
    tag = el("div", "abs", card, ["Tout", "pour", "réviser,", "au", "même", "endroit."].map(w => `<span class="word">${w}</span>`).join(" "));
    tag.style.cssText += `;left:0;width:1440px;text-align:center;top:${MY + MARK + 128}px;font:italic 400 52px/1 News;letter-spacing:-.015em;color:#1D1E1A`;
    tag.words = Array.from(tag.querySelectorAll(".word"));
    url = el("div", "abs", card, `<span style="display:inline-flex;align-items:center;gap:14px;height:54px;padding:0 26px;border-radius:27px;background:#1D1E1A;color:#F2EDE3;font:500 19px/1 Mono;letter-spacing:.04em">${C.brand.url}${window.icon("arrow", 20, 'style="stroke:#C9D07A;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round"')}</span>`);
    url.style.cssText += `;left:0;width:1440px;text-align:center;top:${MY + MARK + 236}px`;
    dark = el("div", "layer", root); dark.style.background = "#0b0b09";
    flash = el("div", "flash", root);
  };

  S.update = function (t) {
    const t0 = S.t0(), nm = M("v14_cahier"), tt = M("v14_tout"), ve = M("v14_end");
    if (!S.centered && word.offsetWidth > 0) {     // centrer le bloc logo + nom (mesuré une fois les polices prêtes)
      const total = MARK + 40 + word.firstElementChild.offsetWidth;
      S.shift = 720 - total / 2 - MX;
      S.centered = true;
    }
    const SH = S.shift || 0;
    const capT = M("capture");                  // déclic final
    put(root, { op: 1 });
    const v14s = M("v14_start");

    // ---- les rangées deviennent les lignes du logo
    const cls = window.SCENES.find(s => s.name === "classe").seatGeometry();
    const mg = seg(t, t0 + 0.02, 1.05, E.emph);
    const rows = [0, 1, 2, 3, 4, 5];
    const lineY = [46, 64, 82].map(v => MY + MARK * v / 120 - 3);
    const lineX0 = MX + MARK * 30 / 120, lineW = [66, 66, 50].map(v => MARK * v / 120);
    bars.forEach((b, k) => {
      const row = rows[k], target = Math.floor(k / 2);
      const y0 = 330 + row * 78 - 20, x0 = 421.5, w0 = 597;
      const y = lerp(y0, lineY[target], mg), x = lerp(x0, lineX0 + SH, mg), w = lerp(w0, lineW[target], mg);
      b.style.width = w.toFixed(2) + "px";
      b.style.height = lerp(40, 6, mg).toFixed(2) + "px";
      b.style.borderRadius = lerp(2, 3, mg).toFixed(2) + "px";
      b.style.background = mg < 0.5 ? `rgba(242,237,227,${lerp(0.22, 1, mg * 2).toFixed(3)})` : "#F2EDE3";
      put(b, { x, y, op: 1 });
    });
    const bgIn = spring(t - (v14s + 0.35), 16, 0.7);
    put(markBg, { x: SH, s: t < v14s + 0.35 ? 0.001 : clamp(bgIn, 0, 1.15), op: t < v14s + 0.35 ? 0 : 1 });
    const mgl = seg(t, v14s + 0.55, 0.4, E.out);
    margin.style.transform = `translateX(${SH.toFixed(1)}px) scaleY(${mgl.toFixed(3)})`;
    // le fond se développe : vert profond → papier
    put(card.green, { op: 1 - seg(t, v14s + 0.1, 0.9, E.inOut) });
    // nom, sous-titre, promesse, adresse
    const wIn = seg(t, nm - 0.1, 0.7, E.out);
    put(word.inner, { y: (1 - wIn) * 150 });
    word.style.transform = `translateX(${SH.toFixed(1)}px)`;
    put(sub, { op: seg(t, nm + 0.5, 0.6), y: (1 - seg(t, nm + 0.5, 0.6)) * 10 });
    const tl = (window.CUES.lines.find(l => l.id === "V14") || { words: [] }).words;
    const tagW = tl.slice(-6);
    tag.words.forEach((w, k) => { const at = tagW[k] ? tagW[k].t0 - 0.08 : tt + k * 0.2; const e = seg(t, at, 0.45, E.out); put(w, { op: e, y: (1 - e) * 16, blur: (1 - e) * 4 }); });
    const uIn = seg(t, ve + 0.05, 0.6, E.emph);
    put(url, { op: uIn, y: (1 - uIn) * 18 });

    // ---- déclic final : le carton devient un Polaroid sur le bureau
    const sh = seg(t, capT + 0.08, 1.25, E.emph);
    const s = lerp(1, 0.47, sh), rot = lerp(0, -2.6, sh);
    const cw = 1440 * s, ch = 1080 * s, pad = 30, bottom = 138;
    const cx0 = 720, cy0 = lerp(540, 452, sh);          // centre de la photo
    const fx = cx0 - cw / 2, fy = cy0 - ch / 2;
    const a = rot * Math.PI / 180;
    const R = (x, y) => [cx0 + (x - cx0) * Math.cos(a) - (y - cy0) * Math.sin(a), cy0 + (x - cx0) * Math.sin(a) + (y - cy0) * Math.cos(a)];
    const [px, py] = R(fx, fy);
    card.style.transformOrigin = "0 0";
    card.style.transform = `translate(${px.toFixed(2)}px,${py.toFixed(2)}px) rotate(${rot.toFixed(3)}deg) scale(${s.toFixed(4)})`;
    frame.style.transformOrigin = "0 0";
    frame.style.width = (cw + pad * 2).toFixed(1) + "px";
    frame.style.height = (ch + pad + bottom).toFixed(1) + "px";
    const [qx, qy] = R(fx - pad, fy - pad);
    frame.style.transform = `translate(${qx.toFixed(2)}px,${qy.toFixed(2)}px) rotate(${rot.toFixed(3)}deg)`;
    const fo = seg(t, capT + 0.2, 0.35);
    frame.style.opacity = fo.toFixed(3);
    frame.style.visibility = fo > 0 ? "visible" : "hidden";
    const [kx, ky] = R(cx0, fy + ch + 70);
    const cw2 = seg(t, capT + 1.05, 1.1, E.inOut);
    cap.style.clipPath = `inset(-30% ${((1 - cw2) * 100).toFixed(1)}% -30% 0)`;
    cap.style.transformOrigin = "0 0";
    cap.style.transform = `translate(${(kx - 150).toFixed(2)}px,${(ky - 22).toFixed(2)}px) rotate(${(rot - 1.5).toFixed(3)}deg)`;
    cap.style.opacity = t > capT + 1.0 ? 1 : 0;
    put(desk, { op: t > capT + 0.1 ? 1 : 0 });
    // noir du miroir + éclair doux, puis fondu final
    const blk = t >= capT && t < capT + 0.067 ? 1 : 0;
    put(dark, { op: Math.max(blk, seg(t, capT + 2.95, M("end") - capT - 3.0, E.inOut)) });
    put(flash, { op: t >= capT + 0.067 ? 0.5 * (1 - seg(t, capT + 0.067, 0.5, E.out)) : 0 });
  };
  S.blur = t => { const c = M("capture"); return t > c && t < c + 1.3 ? 2 : 1; };
  (window.SCENES = window.SCENES || []).push(S);
})();
