/* =====================================================================
   SCÈNE 8 · POUR TOUTE LA CLASSE
   Respiration : fond vert profond, typographie éditoriale.
   « C'est gratuit, sans compte. Ta progression reste sur ton appareil. »
   puis « Pensé en TG1, pour toute la classe. » : le téléphone rejoint
   sa place dans le plan de classe ; toutes les tables s'allument.
   ===================================================================== */
(function () {
  "use strict";
  const { E, seg, lerp, clamp, inv, el, svgEl, put, cue: M, spring, drift } = window.ENG;
  const C = window.CONTENT;
  const S = { name: "classe" };
  S.t0 = () => M("v12_start") - 0.45;
  S.t1 = () => M("v14_start") - 0.29;

  // plan de classe : 6 rangées × 3 paires de tables (36 places)
  const ROWS = 6, PAIRS = 3, DW = 64, DH = 40, GAPX = 150, GAPY = 78;
  const PX = 720 - ((PAIRS - 1) * GAPX * 1.55) / 2, PY = 330;
  const seats = [];
  for (let r = 0; r < ROWS; r++) for (let p = 0; p < PAIRS; p++) for (let s = 0; s < 2; s++) {
    seats.push({ r, x: PX + p * GAPX * 1.55 + (s ? DW / 2 + 2 : -DW / 2 - 2), y: PY + r * GAPY });
  }
  const MINE = 2 * PAIRS * 2 + 1 * 2 + 1;     // rangée 3, 2e paire, place de droite

  let root, bgk, words = [], caption, phone, plan, desks = [], board, planCap;

  S.build = function (stage) {
    root = el("div", "layer", stage);
    bgk = el("div", "layer", root);
    bgk.style.background = "radial-gradient(ellipse 90% 80% at 50% 45%, #414936, #2F3527)";
    // typographie
    const txt = [["Gratuit.", 0], ["Sans compte.", 1]];
    txt.forEach(([w, k]) => {
      const m = el("div", "abs", root, `<span class="mask"><span class="word">${w}</span></span>`);
      m.style.cssText += `;left:130px;top:${300 + k * 118}px;font:400 104px/1.05 News;letter-spacing:-.03em;color:#F2EDE3;white-space:nowrap`;
      m.inner = m.querySelector(".word");
      words.push(m);
    });
    caption = el("div", "abs mono", root, "Sans publicité · Rien n'est envoyé");
    caption.style.cssText += ";left:134px;top:580px;font:500 15px/1 Mono;letter-spacing:.2em;color:#C9C8A8";
    // téléphone
    phone = el("div", "abs", root);
    phone.style.cssText += ";left:930px;top:210px;width:300px;height:610px;border-radius:44px;background:#1D1E1A;padding:12px;box-shadow:0 30px 80px rgba(0,0,0,.35)";
    phone.innerHTML = `<div style="width:100%;height:100%;border-radius:34px;background:#FBF8F2;overflow:hidden;position:relative">
      <div style="position:absolute;left:50%;top:10px;width:84px;height:24px;margin-left:-42px;border-radius:12px;background:#1D1E1A"></div>
      <div style="position:absolute;left:22px;top:58px;display:flex;align-items:center;gap:10px">${window.SCENES.find(s => s.name === "app").markSVG(28)}<span style="font:400 19px/1 News;letter-spacing:-.02em;color:#1D1E1A">Cahier d<span style="color:#C4674E">’</span>HLP</span></div>
      <div class="eyebrow" style="position:absolute;left:22px;top:118px;font-size:10.5px">Ta progression</div>
      <svg class="ring" viewBox="0 0 120 120" width="150" height="150" style="position:absolute;left:63px;top:146px">
        <circle cx="60" cy="60" r="50" fill="none" stroke="#ECE7D8" stroke-width="10"/>
        <circle class="ringc" cx="60" cy="60" r="50" fill="none" stroke="#5F6443" stroke-width="10" stroke-linecap="round" stroke-dasharray="314.16" stroke-dashoffset="314.16" transform="rotate(-90 60 60)"/>
      </svg>
      <div class="pct" style="position:absolute;left:0;right:0;top:200px;text-align:center;font:400 38px/1 News;color:#1D1E1A">0 %</div>
      <div style="position:absolute;left:22px;right:22px;top:326px;padding:14px 16px;border-radius:14px;background:#F1ECE0;font:500 13.5px/1.3 Sans;color:#2B2C27">12 cartes à revoir<div style="font:400 12px/1 Mono;color:#7A7B6F;margin-top:6px;letter-spacing:.06em">AUJOURD'HUI</div></div>
      <div style="position:absolute;left:22px;right:22px;top:410px;padding:14px 16px;border-radius:14px;background:#F1ECE0;font:500 13.5px/1.3 Sans;color:#2B2C27">Examen blanc<div style="font:400 12px/1 Mono;color:#7A7B6F;margin-top:6px;letter-spacing:.06em">20 QUESTIONS · 20 MIN</div></div>
      <div style="position:absolute;left:22px;right:22px;bottom:24px;height:44px;border-radius:12px;background:#39402F;color:#F2EDE3;font:600 14px/44px Sans;text-align:center">Reprendre</div>
    </div>`;
    phone.ring = phone.querySelector(".ringc"); phone.pct = phone.querySelector(".pct");
    // plan de classe
    plan = el("div", "layer", root);
    board = el("div", "abs", plan, `<span style="font:italic 400 38px/1 News;letter-spacing:.02em;color:#E9E4D6">TG1</span>`);
    board.style.cssText += ";left:520px;top:188px;width:400px;height:62px;border-radius:8px;background:#23281E;box-shadow:inset 0 0 0 2px rgba(242,237,227,.14);display:flex;align-items:center;justify-content:center";
    seats.forEach((s, i) => {
      const d = el("div", "abs", plan);
      d.style.cssText += `;left:${s.x - DW / 2}px;top:${s.y - DH / 2}px;width:${DW}px;height:${DH}px;border-radius:7px;background:rgba(242,237,227,.1);box-shadow:inset 0 0 0 1.5px rgba(242,237,227,.22)`;
      const scr = el("div", "abs", d);
      scr.style.cssText += ";left:22px;top:9px;width:20px;height:22px;border-radius:4px;background:#C9D07A;opacity:0";
      desks.push({ d, scr, ...s, i });
    });
    planCap = el("div", "abs mono", plan, `${C.brand.lycee} · ${C.brand.classe} · ${C.brand.annee}`);
    planCap.style.cssText += ";left:0;width:1440px;text-align:center;top:846px;font:500 15px/1 Mono;letter-spacing:.22em;color:#C9C8A8;text-transform:uppercase";
  };

  S.update = function (t) {
    const t0 = S.t0(), gr = M("v12_gratuit"), co = M("v12_compte"), pr = M("v12_progression"), ap = M("v12_appareil");
    const pe = M("v13_start"), tg = M("v13_tg1"), cl = M("v13_classe"), end = S.t1();
    put(root, { op: seg(t, t0, 0.45, E.linear) });
    // mots
    [gr, co].forEach((tw, k) => {
      const e = seg(t, tw - 0.12, 0.6, E.out);
      put(words[k].inner, { y: (1 - e) * 120 });
      const out = seg(t, pe - 0.35, 0.5, E.in);
      put(words[k], { op: 1 - out, y: -out * 30 });
    });
    put(caption, { op: seg(t, co + 0.45, 0.5) * (1 - seg(t, pe - 0.35, 0.4)) });
    // téléphone
    const phIn = seg(t, pr - 0.35, 0.7, E.emph);
    const ring = seg(t, pr + 0.1, 1.4, E.inOut);
    phone.ring.setAttribute("stroke-dashoffset", (314.16 * (1 - 0.52 * ring)).toFixed(2));
    phone.pct.textContent = Math.round(52 * ring) + " %";
    // le téléphone rejoint sa place dans le plan
    const me = desks[MINE];
    const toSeat = seg(t, pe - 0.15, 1.05, E.emph);
    const px = lerp(930, me.x - 150, toSeat), py = lerp(210, me.y - 305, toSeat);
    const ps = lerp(1, 0.07, toSeat);
    phone.style.transformOrigin = "150px 305px";
    put(phone, { x: lerp(40, 0, phIn) + (px - 930), y: py - 210, s: ps, op: phIn * (1 - seg(t, pe + 0.75, 0.25, E.linear)) });
    // plan de classe
    const plIn = seg(t, pe + 0.1, 0.8, E.out);
    put(plan, { op: plIn });
    desks.forEach(d => {
      const di = seg(t, pe + 0.15 + d.r * 0.05, 0.5, E.out);
      put(d.d, { op: di, y: (1 - di) * 10 });
      // vague : les écrans s'allument depuis le tableau vers le fond, sur « toute la classe »
      const wave = d.i === MINE ? seg(t, pe + 0.8, 0.3) : seg(t, cl - 0.35 + d.r * 0.075 + (d.i % 6) * 0.012, 0.35, E.out);
      d.scr.style.opacity = wave.toFixed(3);
      d.d.style.background = `rgba(242,237,227,${(0.1 + wave * 0.08).toFixed(3)})`;
      d.scr.style.boxShadow = `0 0 ${(14 * wave).toFixed(1)}px rgba(201,208,122,${(0.55 * wave).toFixed(3)})`;
    });
    // les tables de chaque rangée se rejoignent : elles deviendront les lignes du logo
    const v14s = M("v14_start");
    const mm = seg(t, v14s - 0.8, 0.5, E.inOut);
    if (mm > 0) {
      const x0 = 421.5, x1 = 1018.5, cw = (x1 - x0) / (PAIRS * 2);
      desks.forEach(d => {
        const j = d.i % (PAIRS * 2);
        const tx = x0 + j * cw;
        d.d.style.left = lerp(d.x - DW / 2, tx, mm).toFixed(2) + "px";
        d.d.style.width = lerp(DW, cw, mm).toFixed(2) + "px";
        d.d.style.borderRadius = lerp(7, j === 0 ? 4 : 0, mm) + "px";
        d.scr.style.opacity = (parseFloat(d.scr.style.opacity) * (1 - mm)).toFixed(3);
        d.d.style.boxShadow = mm > 0.5 ? "none" : d.d.style.boxShadow;
        d.d.style.background = `rgba(242,237,227,${lerp(0.18, 0.22, mm).toFixed(3)})`;
      });
    }
    put(board, { op: seg(t, tg - 0.2, 0.5) * (1 - seg(t, v14s - 0.85, 0.35)), y: (1 - seg(t, tg - 0.2, 0.5)) * -10 });
    put(planCap, { op: seg(t, cl + 0.2, 0.6) * (1 - seg(t, v14s - 0.85, 0.35)) });
    // légère dérive de caméra (revient à 1 avant la fusion avec le logo)
    const z = 1 + Math.sin(Math.PI * inv(pe, v14s - 0.8, t)) * 0.03;
    plan.style.transformOrigin = "720px 520px";
    plan.style.transform = `scale(${z.toFixed(4)})`;
  };
  S.blur = t => (t > M("v13_start") - 0.15 && t < M("v13_start") + 0.9 ? 6 : 1);
  S.seatGeometry = () => ({ seats, ROWS, PAIRS, DW, DH });
  (window.SCENES = window.SCENES || []).push(S);
})();
