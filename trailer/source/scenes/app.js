/* =====================================================================
   SCÈNE 4-6 · L'APPLICATION
   Logo → l'interface se construit autour des cartes → fiche (Rousseau)
   → flashcards (Leitner) → QCM corrigé et expliqué.
   Chaque apparition est calée sur un mot de la voix off.
   ===================================================================== */
(function () {
  "use strict";
  const { E, seg, lerp, clamp, inv, el, svgEl, put, cue: M, spring, drift } = window.ENG;
  const C = window.CONTENT, UI = window.UI, A = UI.APP, MN = UI.MAIN;

  const S = { name: "app" };
  S.t0 = () => M("v7_start") - 0.25;
  S.t1 = () => M("v11_start") + 1.6;

  let root, cam, win, side, brand, lock, main, home, cardsEls = [], hub, fiche, flash, qcm, cursor, ripple, navs = [];
  const NAV = [["home", "Accueil"], ["book", "Textes"], ["cards", "Flashcards"], ["target", "QCM"], ["frise", "Frise"], ["timer", "Examen blanc"], ["mic", "Oral"]];

  /* Marque « Seyès » : carré kaki, marge rouge, trois lignes. */
  function markSVG(size) {
    return `<svg viewBox="0 0 120 120" width="${size}" height="${size}" style="display:block;overflow:visible">
      <rect class="m-bg" x="0" y="0" width="120" height="120" rx="28" fill="#5F6443"/>
      <line class="m-l1" x1="30" y1="46" x2="96" y2="46" stroke="#F2EDE3" stroke-width="5" stroke-linecap="round"/>
      <line class="m-l2" x1="30" y1="64" x2="96" y2="64" stroke="#F2EDE3" stroke-width="5" stroke-linecap="round"/>
      <line class="m-l3" x1="30" y1="82" x2="80" y2="82" stroke="#F2EDE3" stroke-width="5" stroke-linecap="round"/>
      <line class="m-mg" x1="22" y1="18" x2="22" y2="102" stroke="#D4775C" stroke-width="5" stroke-linecap="round"/>
    </svg>`;
  }
  function wordmark(size, color) {
    return `<span style="font:400 ${size}px/1 News;letter-spacing:-.022em;color:${color};white-space:nowrap">Cahier d<span style="color:#C4674E">’</span>HLP</span>`;
  }
  S.markSVG = markSVG; S.wordmark = wordmark;

  S.build = function (stage) {
    root = el("div", "layer", stage);
    root.style.background = "#F2EDE3 url(../assets/textures/paper_offwhite.png) center/1440px";
    cam = el("div", "layer", root);
    cam.style.overflow = "visible";
    cam.style.transformOrigin = "720px 540px";

    // fenêtre de l'application
    win = el("div", "app", cam);
    win.style.cssText += `;left:${A.x}px;top:${A.y}px;width:${A.w}px;height:${A.h}px`;
    side = el("div", "side", win);
    NAV.forEach(([ic, lab], k) => {
      const n = el("div", "nav-i" + (k === 0 ? " on" : ""), side, `${window.icon(ic, 19)}<span>${lab}</span>`);
      n.style.top = (118 + k * 46) + "px";
      navs.push(n);
    });
    const sideH = el("div", "", side, `<div class="eyebrow" style="color:#8A8B7C">Chapitre</div><div style="font:500 14px/1.35 Sans;color:#3a3b33;margin-top:8px">Éducation, transmission<br>et émancipation</div>`);
    sideH.style.cssText = "position:absolute;left:34px;top:470px";
    const prog = el("div", "", side, `<div class="eyebrow" style="color:#8A8B7C">Ta progression</div>
      <div style="margin-top:12px;height:6px;border-radius:6px;background:#E0DACA"><div class="pfill" style="height:100%;width:52%;border-radius:6px;background:#5F6443"></div></div>
      <div style="font:500 12px/1 Mono;color:#6F7159;margin-top:10px;letter-spacing:.06em;line-height:1.55">52 %<br><span class="side-n">12</span> CARTES À REVOIR</div>`);
    prog.style.cssText = "position:absolute;left:34px;right:30px;bottom:34px";

    // accueil du chapitre
    home = el("div", "abs", win);
    home.style.cssText += ";left:0;top:0;width:100%;height:100%";
    const hx = MN.x - A.x;
    const hdr = el("div", "", home, `<div class="eyebrow">Semestre 1 · La recherche de soi</div>
      <div style="font:400 42px/1.05 News;letter-spacing:-.02em;margin-top:14px;color:#1D1E1A">Éducation, transmission et émancipation</div>
      <div style="font:400 15px/1 Sans;color:#6B6C61;margin-top:14px">Neuf auteurs · de Rabelais à Arendt</div>`);
    hdr.style.cssText = `position:absolute;left:${hx}px;top:48px`;
    home.hdr = hdr;
    C.textes.forEach((t, i) => {
      const s = UI.slot(i);
      const c = el("div", "card", home, UI.cardHTML(t));
      c.style.cssText += `;left:${s.x - A.x}px;top:${s.y - A.y}px;width:${s.w}px;height:${s.h}px`;
      cardsEls.push(c);
    });
    hub = el("div", "abs", home);
    hub.style.cssText += `;left:${hx}px;top:${UI.GRID.y0 - A.y + 3 * (UI.GRID.ch + UI.GRID.gap) + 14}px;width:${MN.w}px;height:120px`;
    const HUB = [["cards", "Flashcards", "12 cartes à revoir"], ["target", "QCM mélangé", "15 questions entrelacées"], ["frise", "Frise", "1534 → 1958"]];
    hub.items = HUB.map(([ic, a, b], k) => {
      const h = el("div", "abs", hub, `<div style="width:44px;height:44px;border-radius:12px;background:#ECE7D8;display:flex;align-items:center;justify-content:center;color:#39402F">${window.icon(ic, 22, 'style="stroke:currentColor;fill:none;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round"')}</div>
        <div><div style="font:600 16px/1 Sans;color:#1D1E1A">${a}</div><div style="font:400 13.5px/1 Sans;color:#7A7B6F;margin-top:7px">${b}</div></div>`);
      h.style.cssText += `;left:${k * (UI.GRID.cw + UI.GRID.gap)}px;top:0;width:${UI.GRID.cw}px;height:78px;display:flex;align-items:center;gap:14px;padding:0 18px;border-radius:16px;background:#F4F0E6`;
      return h;
    });

    // ---------------- fiche Rousseau ----------------
    fiche = el("div", "abs", win);
    fiche.style.cssText += ";left:0;top:0;width:100%;height:100%";
    const F = C.fiche, fx = hx;
    fiche.innerHTML = `
      <div class="f-back" style="position:absolute;left:${fx}px;top:44px;font:500 12.5px/1 Mono;letter-spacing:.12em;color:#7A7B6F">← ÉDUCATION, TRANSMISSION ET ÉMANCIPATION</div>
      <div class="f-auth" style="position:absolute;left:${fx}px;top:84px;font:400 56px/1 News;letter-spacing:-.025em;color:#1D1E1A;white-space:nowrap">${F.auteur}<span style="font:400 15px/1 Mono;letter-spacing:.08em;color:#8A8B7C;margin-left:18px;vertical-align:middle">${F.dates}</span></div>
      <div class="f-ul" style="position:absolute;left:${fx}px;top:152px;width:560px;height:5px;border-radius:5px;background:#C9D07A;transform-origin:0 50%"></div>
      <div class="f-title" style="position:absolute;left:${fx}px;top:176px;font:italic 400 27px/1.1 News;color:#3E3F36">${F.titre}</div>
      <div class="f-oeuvre" style="position:absolute;left:${fx}px;top:216px;font:400 15px/1 Sans;color:#7A7B6F"><i>${F.oeuvre}</i> (1<sup style="font-size:.7em">re</sup> partie)</div>
      <div class="f-chips" style="position:absolute;left:${fx}px;top:252px">${F.chips.map((c, k) => `<span class="chip${k === 0 ? " k" : ""}" data-k="${k}" style="display:inline-flex">${c}</span>`).join("")}</div>
      <div style="position:absolute;left:${fx}px;right:44px;top:310px;height:1px;background:rgba(29,30,26,.1)"></div>
      <div class="f-ess-h eyebrow" style="position:absolute;left:${fx}px;top:340px">L’essentiel en 5 points</div>
      <div class="f-ess" style="position:absolute;left:${fx}px;top:374px;width:500px">${F.essentiel.map((p, k) => `
        <div class="f-pt" style="display:flex;gap:16px;align-items:flex-start;margin-bottom:17px">
          <div style="flex:none;width:30px;height:30px;border-radius:50%;background:#5F6443;color:#F2EDE3;font:500 14px/30px Mono;text-align:center">${k + 1}</div>
          <div style="font:400 17.5px/1.38 Sans;color:#2B2C27;padding-top:4px">${p}</div></div>`).join("")}</div>
      <div class="f-quote" style="position:absolute;left:${fx + 540}px;top:340px;width:372px;padding:28px 28px 26px;border-radius:18px;background:#F1ECE0">
        <div class="eyebrow">Citation à retenir</div>
        <div style="margin-top:18px;font:italic 400 30px/1.22 News;color:#1D1E1A;position:relative">
          <span class="f-hl" style="position:absolute;left:-6px;right:-4px;top:4px;bottom:0;background:#DCE08E;opacity:.75;transform-origin:0 50%;border-radius:4px"></span>
          <span style="position:relative">« ${F.citation} »</span></div>
        <div style="margin-top:18px;font:500 12px/1 Mono;letter-spacing:.1em;color:#7A7B6F">${F.citationNote.toUpperCase()}</div>
      </div>
      <div class="f-piege" style="position:absolute;left:${fx + 540}px;top:620px;width:372px;padding:20px 24px;border-radius:16px;border:1.5px solid rgba(181,82,59,.35);background:#FBF3EE">
        <div class="eyebrow" style="color:#B5523B">Piège</div>
        <div style="margin-top:10px;font:400 16px/1.35 Sans;color:#3E3F36">« Perfectibilité » ≠ perfection : une <b style="font-weight:600">capacité</b>, qui peut aussi mener à la régression.</div>
      </div>
      <div class="f-btns" style="position:absolute;left:${fx}px;top:760px;display:flex;gap:12px">
        <div class="btn" style="background:#39402F;color:#F2EDE3">${window.icon("cards", 18, 'style="stroke:currentColor;fill:none;stroke-width:1.8;margin-right:10px"')}Flashcards · 9</div>
        <div class="btn" style="background:#ECE7D8;color:#2B2C27">${window.icon("target", 18, 'style="stroke:currentColor;fill:none;stroke-width:1.8;margin-right:10px"')}QCM · 16</div>
        <div class="btn" style="background:#ECE7D8;color:#2B2C27">${window.icon("mic", 18, 'style="stroke:currentColor;fill:none;stroke-width:1.8;margin-right:10px"')}Mode oral</div>
      </div>`;
    const q = s => fiche.querySelector(s);
    Object.assign(fiche, { back: q(".f-back"), auth: q(".f-auth"), ul: q(".f-ul"), ftitle: q(".f-title"), oeuvre: q(".f-oeuvre"),
      chips: Array.from(fiche.querySelectorAll(".chip")), essH: q(".f-ess-h"), pts: Array.from(fiche.querySelectorAll(".f-pt")),
      quote: q(".f-quote"), hl: q(".f-hl"), piege: q(".f-piege"), btns: q(".f-btns") });
    [fiche.back, fiche.auth, fiche.ftitle, fiche.oeuvre, fiche.essH, fiche.quote, fiche.piege, fiche.btns].forEach(e => e.style.willChange = "transform,opacity");
    fiche.pts.forEach(e => { e.style.willChange = "transform,opacity"; e.style.position = "relative"; });
    fiche.chips.forEach(e => { e.style.willChange = "transform,opacity"; });

    // ---------------- flashcards ----------------
    flash = el("div", "abs", win);
    flash.style.cssText += ";left:0;top:0;width:100%;height:100%";
    const FL = C.flash, fcw = 600, fch = 330, fcx = hx + (MN.w - fcw) / 2, fcy = 150;
    flash.innerHTML = `
      <div style="position:absolute;left:${hx}px;top:44px" class="eyebrow">Flashcards · répétition espacée</div>
      <div style="position:absolute;left:${hx}px;top:70px;font:400 36px/1 News;letter-spacing:-.02em;color:#1D1E1A"><span class="fc-n">12</span> cartes à revoir aujourd’hui</div>
      <div class="fc-wrap" style="position:absolute;left:${fcx}px;top:${fcy}px;width:${fcw}px;height:${fch}px;perspective:1600px">
        <div class="fc" style="position:absolute;inset:0;transform-style:preserve-3d">
          <div class="fc-f" style="position:absolute;inset:0;backface-visibility:hidden;border-radius:20px;background:#FFFFFF;box-shadow:0 0 0 1px rgba(29,30,26,.08),0 18px 40px rgba(40,42,30,.12);padding:34px 40px">
            <div class="eyebrow">${FL.source}</div>
            <div style="margin-top:62px;font:400 40px/1.15 News;letter-spacing:-.015em;color:#1D1E1A;text-align:center">${FL.q}</div>
            <div style="position:absolute;left:0;right:0;bottom:28px;text-align:center;font:500 12px/1 Mono;letter-spacing:.14em;color:#9A9B8C">TOUCHE LA CARTE POUR LA RETOURNER</div>
          </div>
          <div class="fc-b" style="position:absolute;inset:0;backface-visibility:hidden;transform:rotateY(180deg);border-radius:20px;background:#39402F;box-shadow:0 18px 40px rgba(40,42,30,.18);padding:34px 40px;color:#F2EDE3">
            <div class="eyebrow" style="color:#C9C8A8">Réponse</div>
            <div style="margin-top:66px;font:italic 400 44px/1.1 News;text-align:center">${FL.a}</div>
          </div>
        </div>
      </div>
      <div class="fc-actions" style="position:absolute;left:${fcx}px;top:${fcy + fch + 26}px;width:${fcw}px;display:flex;gap:14px">
        <div class="btn fc-no" style="flex:1;background:#F4E7E1;color:#8E3F2C">À revoir</div>
        <div class="btn fc-yes" style="flex:1;background:#E4E6C9;color:#39402F">Je savais ✓</div>
      </div>
      <div class="fc-boxes" style="position:absolute;left:${hx + 76}px;top:${fcy + fch + 124}px;display:flex;gap:18px">
        ${[["1", "chaque tour", 5], ["2", "10 min", 4], ["3", "1 h", 7], ["4", "6 h", 3], ["5", "24 h", 11]].map(([n, lab, c], k) => `
        <div class="fc-box" data-k="${k}" style="width:132px;height:112px;border-radius:14px;background:#F4F0E6;box-shadow:inset 0 0 0 1.5px rgba(29,30,26,.08);position:relative;padding:14px 16px">
          <div style="font:500 11px/1 Mono;letter-spacing:.12em;color:#7A7B6F">BOÎTE ${n}</div>
          <div class="fc-count" style="font:400 36px/1 News;color:#1D1E1A;margin-top:12px">${c}</div>
          <div style="font:400 12.5px/1 Sans;color:#7A7B6F;margin-top:10px">${lab}</div>
        </div>`).join("")}
      </div>
      <div class="fc-mini" style="position:absolute;left:0;top:0;width:${fcw}px;height:${fch}px;border-radius:20px;background:#39402F;opacity:0;transform-origin:0 0;padding:34px 40px;color:#F2EDE3;box-sizing:border-box">
        <div class="eyebrow" style="color:#C9C8A8">Réponse</div>
        <div style="margin-top:66px;font:italic 400 44px/1.1 News;text-align:center">${FL.a}</div></div>
      <div class="fc-toast" style="position:absolute;left:${hx + 76 + 2 * 150 - 60}px;top:${fcy + fch + 252}px;width:252px;height:42px;border-radius:21px;background:#1D1E1A;color:#F2EDE3;display:flex;align-items:center;justify-content:center;gap:10px;font:500 14.5px/1 Sans">${window.icon("timer", 17, 'style="stroke:#C9D07A;fill:none;stroke-width:1.9"')}Revient dans 1 h</div>`;
    Object.assign(flash, { wrap: flash.querySelector(".fc-wrap"), card: flash.querySelector(".fc"), actions: flash.querySelector(".fc-actions"),
      yes: flash.querySelector(".fc-yes"), boxes: Array.from(flash.querySelectorAll(".fc-box")), counts: Array.from(flash.querySelectorAll(".fc-count")),
      mini: flash.querySelector(".fc-mini"), toast: flash.querySelector(".fc-toast"), geo: { fcx, fcy, fcw, fch },
      n: flash.querySelector(".fc-n") });

    // ---------------- QCM ----------------
    qcm = el("div", "abs", win);
    qcm.style.cssText += ";left:0;top:0;width:100%;height:100%";
    const Q = C.qcm;
    qcm.innerHTML = `
      <div style="position:absolute;left:${hx}px;top:44px" class="eyebrow">QCM · Victor Hugo</div>
      <div style="position:absolute;right:44px;top:40px;font:500 12.5px/1 Mono;letter-spacing:.1em;color:#7A7B6F">QUESTION 4 / 16</div>
      <div style="position:absolute;left:${hx}px;right:44px;top:66px;height:4px;border-radius:4px;background:#ECE7D8"><div style="width:27%;height:100%;border-radius:4px;background:#5F6443"></div></div>
      <div class="q-q" style="position:absolute;left:${hx}px;top:112px;width:820px;font:400 36px/1.2 News;letter-spacing:-.015em;color:#1D1E1A">${Q.q}</div>
      <div class="q-opts" style="position:absolute;left:${hx}px;top:250px;width:${MN.w}px">
        ${Q.options.map((o, k) => `<div class="q-o" data-k="${k}" style="position:relative;height:64px;margin-bottom:12px;border-radius:14px;background:#FFFFFF;box-shadow:0 0 0 1.5px rgba(29,30,26,.1);display:flex;align-items:center;padding:0 22px;gap:18px;font:400 20px/1 Sans;color:#2B2C27">
          <div class="q-l" style="width:34px;height:34px;border-radius:10px;background:#F1ECE0;font:500 14px/34px Mono;text-align:center;color:#5F6443">${"ABCD"[k]}</div><span>${o}</span>
          <div class="q-ic" style="margin-left:auto;opacity:0"></div></div>`).join("")}
      </div>
      <div class="q-exp" style="position:absolute;left:${hx}px;top:${250 + 4 * 76 + 10}px;width:${MN.w}px;height:0;overflow:hidden;border-radius:16px;background:#F1ECE0">
        <div style="padding:22px 26px">
          <div class="eyebrow">Explication</div>
          <div style="margin-top:12px;font:400 19px/1.4 Sans;color:#2B2C27"><b style="font-weight:600">Métaphore</b> : ${Q.explication.replace("Ignorance", "l’ignorance")} Avec « comme », ce serait une comparaison.</div>
        </div>
      </div>`;
    Object.assign(qcm, { q: qcm.querySelector(".q-q"), opts: Array.from(qcm.querySelectorAll(".q-o")), exp: qcm.querySelector(".q-exp") });

    // ---------------- logo au centre ----------------
    lock = el("div", "abs", cam);
    lock.style.cssText += ";left:0;top:0;width:1440px;height:1080px";
    lock.mark = el("div", "abs", lock, markSVG(132));
    lock.word = el("div", "abs", lock, wordmark(118, "#1D1E1A"));
    lock.sub = el("div", "abs mono", lock, "Humanités · Littérature · Philosophie");
    lock.sub.style.cssText += ";font:500 16px/1 Mono;letter-spacing:.24em;color:#5F6443;white-space:nowrap";
    lock.svg = lock.mark.querySelector("svg");

    // curseur
    cursor = el("div", "abs", cam, `<svg width="30" height="36" viewBox="0 0 30 36"><path d="M3 2.5 L3 28 L9.6 22 L14 32.5 L18.6 30.5 L14.2 20.4 L23.5 20.4 Z" fill="#1D1E1A" stroke="#FBF8F2" stroke-width="2.2" stroke-linejoin="round"/></svg>`);
    cursor.style.zIndex = 50;
    ripple = el("div", "abs", cam);
    ripple.style.cssText += ";width:56px;height:56px;border-radius:50%;border:2px solid rgba(95,100,67,.8);z-index:49";
  };

  /* ---------------- chronologie interne ---------------- */
  function T() {
    const v7s = M("v7_start"), v7e = M("v7_end");
    const build = v7e + 0.35;
    return {
      v7s, v7e, build,
      hover: M("v8_texte") - 0.2, click: M("v8_fiche") - 0.28,
      auteur: M("v8_auteur"), epoque: M("v8_epoque"), ess: M("v8_essentiel"), cit: M("v8_citations"), ret: M("v8_retenir"),
      toFlash: M("v9_start") - 0.55, flashIn: M("v9_flash"), flip: M("v9_flash") + 0.4, yes: M("v9_reviennent") + 0.05, moment: M("v9_moment"),
      toQcm: M("v10_start") - 0.3,   /* v8 : le résultat de la flashcard reste ~0,6 s */ qIn: M("v10_qcm"), qClick: M("v10_corriges") - 0.18, qExp: M("v10_expliques") - 0.25,
      out: M("v11_start") - 0.25,
    };
  }

  S.T = T;

  /* position écran d'un élément de la fenêtre (sans caméra) */
  const winPos = (x, y) => [A.x + x, A.y + y];

  S.update = function (t) {
    const k = T();
    // ---------- logo central ----------
    const lIn = seg(t, k.v7s - 0.12, 0.7, E.out);
    const toSide = seg(t, k.build, 0.85, E.emph);
    const bg = lock.svg.querySelector(".m-bg");
    const mg = lock.svg.querySelector(".m-mg");
    const ls = [".m-l1", ".m-l2", ".m-l3"].map(s => lock.svg.querySelector(s));
    const mScale = spring(t - (k.v7s - 0.12), 18, 0.62);
    bg.setAttribute("transform", `translate(60 60) scale(${clamp(mScale, 0, 1.2).toFixed(4)}) translate(-60 -60)`);
    mg.setAttribute("stroke-dasharray", "84"); mg.setAttribute("stroke-dashoffset", (84 * (1 - seg(t, k.v7s + 0.05, 0.4, E.out))).toFixed(2));
    ls.forEach((l, i) => { const len = i === 2 ? 50 : 66; l.setAttribute("stroke-dasharray", len); l.setAttribute("stroke-dashoffset", (len * (1 - seg(t, k.v7s + 0.18 + i * 0.09, 0.42, E.out))).toFixed(2)); });
    // centre → coin de la barre latérale
    const bigM = 132, smallM = 40, markS = lerp(1, smallM / bigM, toSide);
    const cMx = lerp(720 - 330, A.x + 26, toSide), cMy = lerp(540 - 100, A.y + 34, toSide);
    const winOut = 1 - seg(t, k.out, 0.25, E.linear);          // v7 : le logo de la barre latérale part avec la fenêtre
    put(lock.mark, { x: cMx, y: cMy, s: markS, op: lIn > 0 ? winOut : 0 });
    lock.mark.style.transformOrigin = "0 0";
    const wS = lerp(1, 25 / 118, toSide);
    const wIn = seg(t, k.v7s + 0.4, 0.75, E.out);            // v6 : le nom s'écrit sur « Cahier », pas sur « dans le »
    lock.word.style.transformOrigin = "0 0";
    lock.word.style.clipPath = `inset(0 ${((1 - wIn) * 100).toFixed(2)}% -20% 0)`;
    put(lock.word, { x: lerp(720 - 330 + 160, A.x + 26 + 52, toSide), y: lerp(540 - 100 + 8, A.y + 34 + 6, toSide) + (1 - wIn) * 10, s: wS, op: wIn > 0 ? winOut : 0 });
    put(lock.sub, { x: 720 - 330 + 164, y: 540 - 100 + 156, op: seg(t, k.v7s + 0.45, 0.5, E.out) * (1 - seg(t, k.build - 0.2, 0.2, E.linear)) });

    // ---------- fenêtre ----------
    const wn = seg(t, k.build + 0.05, 1.0, E.emph);
    put(win, { s: lerp(1.035, 1, wn), op: 1 - seg(t, k.out, 0.25, E.linear) });   // v7 : la fenêtre s'efface vers le papier, puis la frise entre
    win.style.transformOrigin = "720px 540px";
    win.style.boxShadow = `0 0 0 1px rgba(29,30,26,${(0.07 * wn).toFixed(3)}), 0 30px 80px rgba(40,42,30,${(0.18 * wn).toFixed(3)}), 0 8px 24px rgba(40,42,30,${(0.08 * wn).toFixed(3)})`;
    win.style.background = wn < 1 ? `rgba(251,248,242,${wn.toFixed(3)})` : "#FBF8F2";
    put(side, { x: 0, op: seg(t, k.build + 0.15, 0.6, E.out) });
    navs.forEach((n, i) => put(n, { op: seg(t, k.build + 0.35 + i * 0.05, 0.4, E.out), x: (1 - seg(t, k.build + 0.35 + i * 0.05, 0.4, E.out)) * -12 }));
    // navigation active
    const navOn = t < k.toFlash + 0.2 ? 1 : t < k.toQcm + 0.2 ? 2 : 3;
    navs.forEach((n, i) => n.classList.toggle("on", i === navOn));

    // cartes : centrées (fin de la scène bureau) → place dans l'application
    const gm = seg(t, k.build + 0.1, 1.0, E.emph);
    const dim = seg(t, k.v7s - 0.2, 0.45, E.outSoft) * (1 - seg(t, k.build + 0.55, 0.55, E.outSoft));
    put(home.hdr, { op: seg(t, k.build + 0.62, 0.45, E.out), y: (1 - seg(t, k.build + 0.62, 0.45, E.out)) * 14 });   // v11 : après le passage du nom
    home.style.filter = "none";                                  // v10 : plus de grille floue à l'entrée de l'app (seulement estompée)
    // les cartes vivent dans la fenêtre : on compense la position centrée du bureau
    const dx = lerp(-124, 0, gm), dy = lerp(14, 0, gm);
    cardsEls.forEach((c, i) => {
      let x = dx, y = dy, sc = 1, op = 1 - dim;                  // v11 : pas de grille fantôme sous le logo en transit
      if (i === 1) {                            // Rousseau : survol puis clic
        const hv = seg(t, k.hover + 0.35, 0.25, E.out) * (1 - seg(t, k.click + 0.1, 0.15, E.linear));
        y -= hv * 4; sc = 1 + hv * 0.012 - Math.sin(Math.PI * seg(t, k.click, 0.18, E.linear)) * 0.025;
        c.style.boxShadow = `0 0 0 1px rgba(29,30,26,.08), 0 ${(2 + hv * 14).toFixed(1)}px ${(6 + hv * 24).toFixed(1)}px rgba(29,30,26,${(0.05 + hv * 0.08).toFixed(3)})`;
      }
      put(c, { x, y, s: sc, op });
    });
    put(hub, { op: seg(t, k.build + 0.6, 0.5, E.out), y: (1 - seg(t, k.build + 0.6, 0.5, E.out)) * 16 });

    // ---------- clic Rousseau : la carte devient la fiche ----------
    const ex = seg(t, k.click + 0.12, 0.62, E.emph);
    const homeOut = seg(t, k.click + 0.1, 0.25, E.out);       // v9 : la grille part avant l'entrée du titre de la fiche
    put(home, { op: 1 - homeOut, y: homeOut * 18, s: 1 - homeOut * 0.015 });
    put(fiche, { op: seg(t, k.click + 0.15, 0.25, E.linear) * (1 - seg(t, k.toFlash, 0.15, E.linear)), x: -seg(t, k.toFlash, 0.45, E.in) * 60 });
    const fIn = (d, dur = 0.5) => seg(t, k.click + 0.22 + d, dur, E.out);
    put(fiche.back, { op: fIn(0.05) });
    put(fiche.auth, { op: fIn(0.1), y: (1 - fIn(0.1)) * 22 });
    fiche.ul.style.transform = `scaleX(${seg(t, k.auteur - 0.05, 0.5, E.inOut).toFixed(3)})`;
    fiche.ul.style.opacity = (1 - seg(t, k.ess, 0.4)).toFixed(3) * 0.85;
    put(fiche.ftitle, { op: fIn(0.08), y: (1 - fIn(0.08)) * 16 });
    put(fiche.oeuvre, { op: fIn(0.14), y: (1 - fIn(0.14)) * 12 });
    fiche.chips.forEach((c, i) => {
      const sp = spring(t - (k.epoque - 0.08 + i * 0.1), 24, 0.55);
      put(c, { s: t < k.epoque - 0.08 + i * 0.1 ? 0.001 : clamp(sp, 0, 1.2), op: t < k.epoque - 0.08 + i * 0.1 ? 0 : 1 });
    });
    put(fiche.essH, { op: seg(t, k.ess - 0.1, 0.4) });
    fiche.pts.forEach((p, i) => { const e = seg(t, k.ess + 0.05 + i * 0.13, 0.5, E.out); put(p, { op: e, x: (1 - e) * 26 }); });
    const qIn = seg(t, k.cit - 0.12, 0.6, E.emph);
    put(fiche.quote, { op: qIn, x: (1 - qIn) * 60 });
    fiche.hl.style.transform = `scaleX(${seg(t, k.ret - 0.05, 0.55, E.inOut).toFixed(3)})`;
    put(fiche.piege, { op: 0 });                                  // v6 : l'encadré « Piège » surgissait juste avant la sortie
    put(fiche.btns, { op: seg(t, k.ess + 0.7, 0.5), y: (1 - seg(t, k.ess + 0.7, 0.5)) * 12 });   // v7 : posés avec les cinq points (ne détournent plus l'œil de la citation)

    // ---------- flashcards ----------
    const flIn = seg(t, k.toFlash + 0.12, 0.55, E.emph);      // entre quand l'écran sortant finit de partir (ni creux, ni double exposition)
    put(flash, { op: flIn * (1 - seg(t, k.toQcm, 0.15, E.linear)), x: (1 - flIn) * 70 - seg(t, k.toQcm, 0.45, E.in) * 60 });
    const cardIn = seg(t, k.flashIn - 0.15, 0.55, E.out);
    const flip = seg(t, k.flip, 0.5, E.inOut);
    const toBox = seg(t, k.yes + 0.3, 0.55, E.emph);          // v7 : la réponse reste ~0,1 s de plus
    const g = flash.geo;
    put(flash.wrap, { op: cardIn * (toBox > 0 ? 0 : 1), y: (1 - cardIn) * 30 });
    flash.card.style.transform = `rotateY(${(flip * 180).toFixed(2)}deg) translateZ(0)`;
    put(flash.actions, { op: seg(t, k.flip + 0.35, 0.4) * (1 - seg(t, k.yes + 0.3, 0.3)) });
    flash.yes.style.transform = `scale(${(1 - Math.sin(Math.PI * seg(t, k.yes - 0.05, 0.16, E.linear)) * 0.04).toFixed(3)})`;
    // la carte file dans la boîte 3
    const box = flash.boxes[2], bx = parseFloat(flash.querySelector(".fc-boxes").style.left) + 2 * 150, by = g.fcy + g.fch + 124;
    if (toBox > 0) {
      const mx = lerp(g.fcx, bx, toBox), my = lerp(g.fcy, by, toBox) - Math.sin(Math.PI * toBox) * 90;
      // v6 : la carte garde sa réponse en rétrécissant, puis disparaît dans la boîte (ne masque plus le compteur)
      const sw = lerp(1, 8 / g.fcw, toBox), sh2 = lerp(1, 5 / g.fch, toBox);
      const bxc = bx + 66 - 4, byc = by + 56 - 2.5;
      const mx2 = lerp(g.fcx, bxc, toBox), my2 = lerp(g.fcy, byc, toBox) - Math.sin(Math.PI * toBox) * 90;
      put(flash.mini, { x: mx2, y: my2, sx: sw, sy: sh2, op: 1 - seg(toBox, 0.8, 0.06, E.linear) });   // v9-v11 : disparaît par l'échelle, puis s'efface avant la boîte
    } else put(flash.mini, { op: 0 });
    flash.boxes.forEach((b, i) => {
      const pulse = i === 2 ? Math.sin(Math.PI * seg(t, k.yes + 0.7, 0.35, E.linear)) : 0;   // la boîte 3 accueille la carte
      b.style.transform = `scale(${(1 + pulse * 0.05).toFixed(3)})`;
      b.style.boxShadow = i === 2 && t > k.yes + 0.7 ? "inset 0 0 0 2px #5F6443" : "inset 0 0 0 1.5px rgba(29,30,26,.08)";
    });
    // v7 : les compteurs changent ensemble, quand la carte se pose dans la boîte 3 (et il reste 11 cartes à revoir)
    const landed = t > k.yes + 0.63;                          // v8 : sur l'image où la carte disparaît dans la boîte
    flash.counts[2].textContent = landed ? "8" : "7";
    flash.counts[1].textContent = landed ? "3" : "4";
    flash.n.textContent = landed ? "11" : "12";
    side.querySelector(".side-n").textContent = landed ? "11" : "12";
    flash.counts[0].textContent = "5";
    const toast = seg(t, Math.max(k.moment - 0.2, k.yes + 0.63), 0.2, E.out);   // v9 : lisible tout de suite   // la bulle arrive avec les compteurs
    put(flash.toast, { op: toast, y: (1 - toast) * 16 });

    // ---------- QCM ----------
    const qcIn = seg(t, k.toQcm + 0.12, 0.55, E.emph);
    put(qcm, { op: qcIn * (1 - seg(t, k.out, 0.2, E.linear)), x: (1 - qcIn) * 70 });
    const qT = Math.min(k.qIn - 0.2, k.toQcm + 0.4);                 // la question est là dès l'arrivée de l'écran
    put(qcm.q, { op: seg(t, qT, 0.5), y: (1 - seg(t, qT, 0.5)) * 14 });
    qcm.opts.forEach((o, i) => {
      const e = seg(t, qT + 0.1 + i * 0.05, 0.35, E.out);          // v6 : réponses posées avant le clic (plus de clic « robot »)
      const picked = t > k.qClick + 0.1;
      const good = i === C.qcm.bonne;
      let op = e;
      if (picked && !good) op *= lerp(1, 0.45, seg(t, k.qClick + 0.1, 0.3));
      put(o, { op, y: (1 - e) * 14, s: good ? 1 - Math.sin(Math.PI * seg(t, k.qClick, 0.16, E.linear)) * 0.015 : 1 });
      if (good) {
        const ok = seg(t, k.qClick + 0.08, 0.3, E.out);
        o.style.background = ok > 0 ? `rgb(${Math.round(lerp(255, 95, ok))},${Math.round(lerp(255, 100, ok))},${Math.round(lerp(255, 67, ok))})` : "#FFFFFF";
        o.style.color = ok > 0.5 ? "#F2EDE3" : "#2B2C27";
        const ic = o.querySelector(".q-ic");
        ic.innerHTML = window.icon("check", 26, 'style="stroke:#F2EDE3;fill:none;stroke-width:2.4;stroke-linecap:round;stroke-linejoin:round"');
        ic.style.opacity = ok;
        ic.style.transform = `scale(${clamp(spring(t - k.qClick - 0.12, 26, 0.5), 0, 1.3).toFixed(3)})`;
        o.querySelector(".q-l").style.background = ok > 0.5 ? "rgba(242,237,227,.18)" : "#F1ECE0";
        o.querySelector(".q-l").style.color = ok > 0.5 ? "#F2EDE3" : "#5F6443";
      }
    });
    const ex2 = seg(t, k.qExp, 0.55, E.emph);
    qcm.exp.style.height = (ex2 * 118).toFixed(1) + "px";

    // ---------- curseur ----------
    const path = [
      [k.hover - 0.6, 1180, 980], [k.hover + 0.25, 700, 360],                  // vers Rousseau
      [k.click + 0.25, 700, 362], [k.click + 1.1, 880, 800], [k.toFlash - 0.55, 880, 800],
      [k.toFlash - 0.12, A.x + 90, A.y + 118 + 2 * 46 + 20],                  // menu Flashcards
      [k.flip - 0.3, 880, 760], [k.yes - 0.12, 1021, 628], [k.yes + 0.3, 1021, 628],   // « Je savais » (centre du bouton), puis un temps
      [k.toQcm - 0.45, 520, 600], [k.toQcm - 0.12, A.x + 80, A.y + 118 + 3 * 46 + 20],   // menu QCM
      [k.qClick - 0.55, 760, 700], [k.qClick - 0.05, 640, A.y + 250 + 76 + 32],        // « Une métaphore »
      [k.out, 700, 1160],
    ];
    let cx = path[0][1], cy = path[0][2];
    for (let i = 1; i < path.length; i++) {
      const [ta, xa, ya] = path[i - 1], [tb, xb, yb] = path[i];
      if (t >= ta) { const e = E.inOut(inv(ta, tb, t)); cx = lerp(xa, xb, e); cy = lerp(ya, yb, e); }
    }
    const clicks = [k.click, k.toFlash - 0.08, k.yes - 0.05, k.toQcm - 0.08, k.qClick];
    let press = 0, rip = 0, ripT = -9;
    clicks.forEach(c => { press = Math.max(press, Math.sin(Math.PI * seg(t, c, 0.16, E.linear))); if (t >= c && t < c + 0.5) { rip = seg(t, c, 0.45, E.out); ripT = c; } });
    const curOn = seg(t, k.hover - 0.6, 0.3) * (1 - seg(t, k.out - 0.2, 0.3));
    put(cursor, { x: cx - 3, y: cy - 2, s: 1 - press * 0.12, op: curOn });
    cursor.style.transformOrigin = "3px 2px";
    put(ripple, { x: cx - 28, y: cy - 28, s: 0.4 + rip * 0.9, op: rip > 0 && rip < 1 ? (1 - rip) * 0.8 * curOn : 0 });

    // ---------- caméra : zooms contrôlés sur la zone commentée ----------
    const focus = [
      [k.build, 1, 720, 540],
      // v6 : chaque clé = début du mouvement vers la suivante ; les doublons tiennent le cadrage
      [k.click + 0.35, 1, 720, 540],
      [k.auteur + 0.1, 1.2, 600, 330],                       // poussée de 0,75 s, une fois la fiche affichée
      [k.ess - 0.5, 1.2, 600, 330],
      [k.ess + 0.3, 1.2, 620, 390],                          // les cinq points (haut de la fenêtre et logo dans le cadre)
      [k.cit - 0.45, 1.2, 620, 390],
      [k.cit + 0.25, 1.14, 800, 520],                        // la citation, barre latérale entière
      [k.toFlash - 0.05, 1.14, 800, 520],
      [k.toFlash + 0.55, 1.1, 760, 520],
      [k.flip + 0.6, 1.1, 760, 520],
      [k.toQcm - 0.2, 1.06, 760, 480],
      [k.qExp - 0.3, 1.14, 760, 560],
      [k.out - 0.05, 1.14, 760, 560],                        // l'explication reste cadrée jusqu'à la sortie
      [k.out + 0.9, 1, 720, 540],
    ];
    let z = 1, fx = 720, fy = 540;
    for (let i = 1; i < focus.length; i++) {
      const [ta, za, xa, ya] = focus[i - 1], [tb, zb, xb, yb] = focus[i];
      if (t >= ta) { const e = E.inOut(inv(ta, ta + Math.min(1.1, tb - ta), t)); z = lerp(za, zb, e); fx = lerp(xa, xb, e); fy = lerp(ya, yb, e); }
    }
    z += drift(t, 0.2, 7) * 0.004;
    cam.style.transform = `translate(${(720 - fx) * (z - 1) / z * z}px, ${(540 - fy) * (z - 1) / z * z}px) scale(${z.toFixed(4)})`;
    cam.style.transformOrigin = `${fx}px ${fy}px`;
    cam.style.transform = `scale(${z.toFixed(4)})`;

    // sortie vers la frise : l'app recule
    const out = seg(t, k.out, 1.2, E.inOut);
    put(root, { op: 1 - seg(t, k.out + 0.62, 0.1, E.linear) });    // v7 : reste opaque sous la frise qui arrive (plus de passage par le gris)
  };

  S.blur = t => {
    const k = T();
    if (t > k.build && t < k.build + 1.0) return 1;             // v5 : logo net vers la barre latérale (plus de traînée)
    return 1;
  };

  (window.SCENES = window.SCENES || []).push(S);
})();
