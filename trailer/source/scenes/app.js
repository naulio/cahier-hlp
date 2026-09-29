/* =====================================================================
   SCÈNE 4-6 · L’APPLICATION
   Le logo s’écrit au-dessus des cartes rangées → l’interface se construit
   autour d’elles → la carte Rousseau s’ouvre en fiche → flashcards
   (fiche bristol, boîtes kraft, tampon) → QCM corrigé et expliqué →
   un toucher sur « Frise » fait naître la frise.
   Contenus et fonctions réels du Cahier d’HLP ; chaque geste est calé
   sur un mot de la voix off.
   ===================================================================== */
(function () {
  "use strict";
  const { E, seg, lerp, clamp, inv, el, put, cue: M, spring, drift } = window.ENG;
  const C = window.CONTENT, UI = window.UI, A = UI.APP, MN = UI.MAIN, B = window.BRAND;
  const desk = () => window.SCENES.find(s => s.name === "desk");

  const S = { name: "app" };
  S.t0 = () => M("v7_start") - 0.2;
  S.t1 = () => T().navFrise + 0.55;

  let root, cam, win, side, brandMark, brandWord, lock, home, cardsEls = [], hub, expander, fiche, flash, qcm, touch, ripple, navs = [];
  const NAV = [["home", "Accueil"], ["book", "Textes"], ["cards", "Flashcards"], ["target", "QCM"], ["frise", "Frise"], ["timer", "Examen blanc"], ["mic", "Oral"]];
  const hx = MN.x - A.x;                     // marge gauche du contenu, en coordonnées de fenêtre
  const HEAD = { x: hx - 26, y: 30, w: MN.w + 52, h: 262 };   // en-tête de fiche (la carte Rousseau s’y étire)
  const TGT = {};                            // cibles du doigt, mesurées une fois la mise en page faite

  function T() {
    const yes = M("v9_reviennent") + 0.1;      // « Je savais » : la carte file dans sa boîte sur « reviennent »
    return {
      v7s: M("v7_start"), v7c: M("v7_cahier"), v7e: M("v7_end"),
      build: M("v7_end") + 0.3,
      tapCard: M("v8_fiche") - 0.3,
      ess: M("v8_essentiel"), cit: M("v8_citations"), cles: M("v8_retenir"),
      navFlash: M("v9_start") - 0.55,
      flip: M("v9_flash") + 0.25, yes, stamp: Math.max(M("v9_moment") + 0.05, yes + 0.8),   // tampon après l’arrivée de la carte
      navQcm: M("v10_start") - 0.55, qIn: Math.min(M("v10_qcm"), M("v10_start") - 0.55 + 0.5),   // la question est là dès l’arrivée
      qTap: M("v10_corriges") - 0.2, qExp: M("v10_expliques") - 0.05,
      navFrise: M("v11_start") - 0.5,
    };
  }
  S.T = T;

  S.build = function (stage) {
    root = el("div", "layer", stage);
    root.style.background = "#F2EDE3 url(../assets/textures/paper_offwhite.png) center/1440px";
    cam = el("div", "layer", root);
    cam.style.overflow = "visible";
    cam.style.transformOrigin = "0 0";

    // ---------------- fenêtre : une feuille posée, pas une maquette flottante
    win = el("div", "app", cam);
    win.style.cssText += `;left:${A.x}px;top:${A.y}px;width:${A.w}px;height:${A.h}px;border-radius:16px;transform-origin:720px 540px`;
    const grain = el("div", "layer", win);
    grain.style.cssText += ";width:100%;height:100%;background:url(../assets/textures/paper_sheet.png) center/700px;opacity:.55;mix-blend-mode:multiply";
    side = el("div", "side", win);
    side.style.background = "#EEE8DA url(../assets/textures/paper_sheet.png) center/600px";
    side.style.backgroundBlendMode = "multiply";
    NAV.forEach(([ic, lab], k) => {
      const n = el("div", "nav-i", side, `${window.icon(ic, 20)}<span>${lab}</span>`);
      n.style.top = (122 + k * 48) + "px";
      n.style.font = "500 16.5px/1 Sans";
      navs.push(n);
    });
    const sideH = el("div", "", side, `<div class="eyebrow" style="color:#8A8B7C;font-size:13px">Chapitre</div><div style="font:500 15px/1.35 Sans;color:#3a3b33;margin-top:8px">Éducation, transmission<br>et émancipation</div>`);
    sideH.style.cssText = "position:absolute;left:34px;top:486px";
    const prog = el("div", "", side, `<div class="eyebrow" style="color:#8A8B7C;font-size:13px">Ta progression</div>
      <div style="margin-top:12px;height:6px;border-radius:6px;background:#E0DACA"><div style="height:100%;width:52%;border-radius:6px;background:#5F6443"></div></div>
      <div style="font:500 14px/1.3 Sans;color:#4A4B40;margin-top:10px;white-space:nowrap">52 % · 12 cartes à revoir</div>`);
    prog.style.cssText = "position:absolute;left:34px;right:30px;bottom:34px";

    // ---------------- accueil du chapitre
    home = el("div", "abs", win);
    home.style.cssText += ";left:0;top:0;width:100%;height:100%";
    const hdr = el("div", "", home, `<div class="eyebrow" style="font-size:13px">Semestre 1 · La recherche de soi</div>
      <div style="font:400 44px/1.05 News;letter-spacing:-.02em;margin-top:14px;color:#1D1E1A">Éducation, transmission et émancipation</div>
      <div style="font:400 16px/1 Sans;color:#6B6C61;margin-top:14px">10 textes · 9 auteurs, de Rabelais à Arendt</div>`);
    hdr.style.cssText = `position:absolute;left:${hx}px;top:44px`;
    home.hdr = hdr;
    C.textes.forEach((t, i) => {
      const s = UI.slot(i);
      const c = el("div", "card", home, UI.cardHTML(t));
      c.style.cssText += `;left:${s.x - A.x}px;top:${s.y - A.y}px;width:${s.w}px;height:${s.h}px;background:#FFFDF8`;
      cardsEls.push(c);
    });
    hub = el("div", "abs", home);
    hub.style.cssText += `;left:${hx}px;top:${UI.GRID.y0 - A.y + 3 * (UI.GRID.ch + UI.GRID.gap) + 14}px;width:${MN.w}px;height:120px`;
    [["cards", "Flashcards", "12 cartes à revoir"], ["target", "QCM mélangé", "15 questions corrigées"], ["frise", "Frise", "1534 → 1958"]].forEach(([ic, a, b], k) => {
      const h = el("div", "abs", hub, `<div style="width:44px;height:44px;border-radius:12px;background:#E9E2D1;display:flex;align-items:center;justify-content:center;color:#39402F">${window.icon(ic, 22, 'style="stroke:currentColor;fill:none;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round"')}</div>
        <div><div style="font:600 16.5px/1 Sans;color:#1D1E1A">${a}</div><div style="font:400 14px/1 Sans;color:#6F7063;margin-top:7px">${b}</div></div>`);
      h.style.cssText += `;left:${k * (UI.GRID.cw + UI.GRID.gap)}px;top:0;width:${UI.GRID.cw}px;height:78px;display:flex;align-items:center;gap:14px;padding:0 18px;border-radius:14px;background:#F1EBDD`;
    });

    // ---------------- la carte Rousseau qui s’étire en en-tête de fiche
    expander = el("div", "abs", win);
    expander.style.cssText += ";background:#FFFDF8;overflow:hidden;box-shadow:0 0 0 1px rgba(29,30,26,.08),0 2px 6px rgba(29,30,26,.05)";
    expander.card = el("div", "", expander, UI.cardHTML(C.textes[1]));
    expander.card.style.cssText = "position:absolute;left:0;top:0;width:292px;height:156px";

    // ---------------- fiche Rousseau
    fiche = el("div", "abs", win);
    fiche.style.cssText += ";left:0;top:0;width:100%;height:100%";
    const F = C.fiche;
    fiche.innerHTML = `
      <div class="f-head" style="position:absolute;left:${HEAD.x}px;top:${HEAD.y}px;width:${HEAD.w}px;height:${HEAD.h}px;padding:26px 26px">
        <div style="position:absolute;left:0;top:0;bottom:0;width:6px;background:#C9A24A"></div>
        <div class="f-back" style="font:500 13px/1 Mono;letter-spacing:.12em;color:#7A7B6F;padding-left:4px">← ÉDUCATION, TRANSMISSION ET ÉMANCIPATION</div>
        <div class="f-auth" style="margin-top:22px;padding-left:2px;font:400 58px/1 News;letter-spacing:-.025em;color:#1D1E1A;white-space:nowrap">${F.auteur}<span style="font:400 16px/1 Mono;letter-spacing:.06em;color:#8A8B7C;margin-left:18px;vertical-align:middle">${F.dates}</span></div>
        <div class="f-title" style="margin-top:16px;padding-left:4px;font:italic 400 28px/1.1 News;color:#3E3F36">${F.titre}</div>
        <div class="f-oeuvre" style="margin-top:12px;padding-left:4px;font:400 16px/1.2 Sans;color:#6F7063"><i>${F.oeuvre}</i> (1<sup style="font-size:.7em">re</sup> partie)</div>
        <div class="f-chips" style="margin-top:16px;padding-left:4px">${F.chips.map((c, k) => `<span class="chip${k === 0 ? " k" : ""}" style="font-size:14.5px">${c}</span>`).join("")}</div>
      </div>
      <div class="f-ess-h eyebrow" style="position:absolute;left:${hx}px;top:330px;font-size:13.5px">L’essentiel en 5 points</div>
      <div class="f-ess" style="position:absolute;left:${hx}px;top:366px;width:520px">${F.essentiel.map((p, k) => `
        <div class="f-pt" style="display:flex;gap:16px;align-items:flex-start;margin-bottom:16px;position:relative">
          <div style="flex:none;width:32px;height:32px;border-radius:50%;background:#5F6443;color:#F2EDE3;font:500 15px/32px Mono;text-align:center">${k + 1}</div>
          <div style="font:400 19.5px/1.36 Sans;color:#2B2C27;padding-top:3px">${p}</div></div>`).join("")}</div>
      <div class="f-quote" style="position:absolute;left:${hx + 556}px;top:330px;width:356px;padding:28px 28px 26px;border-radius:16px;background:#EFE8D8">
        <div class="eyebrow" style="font-size:13px">Citation clé</div>
        <div style="margin-top:18px;font:italic 400 31px/1.22 News;color:#1D1E1A;position:relative">
          <span class="f-hl" style="position:absolute;left:-6px;right:-4px;top:5px;bottom:-1px;background:#DCD48A;opacity:.8;transform-origin:0 50%;border-radius:3px"></span>
          <span style="position:relative">« ${F.citation} »</span></div>
        <div style="margin-top:18px;font:500 13px/1 Mono;letter-spacing:.1em;color:#6F7063">${F.citationNote.toUpperCase()}</div>
      </div>
      <div class="f-note" style="position:absolute;left:${hx + 572}px;top:612px;font:500 30px/1.05 Hand;color:#2F3B63;transform:rotate(-3deg);white-space:nowrap">noté en cours :<br>« la Bête » entourée</div>`;
    const q = s => fiche.querySelector(s);
    Object.assign(fiche, { head: q(".f-head"), back: q(".f-back"), auth: q(".f-auth"), ftitle: q(".f-title"), oeuvre: q(".f-oeuvre"),
      chips: Array.from(fiche.querySelectorAll(".chip")), essH: q(".f-ess-h"), pts: Array.from(fiche.querySelectorAll(".f-pt")),
      quote: q(".f-quote"), hl: q(".f-hl"), note: q(".f-note") });
    [fiche.back, fiche.auth, fiche.ftitle, fiche.oeuvre].forEach(e => { e.style.willChange = "transform,opacity"; e.style.position = "relative"; });
    fiche.chips.forEach(e => { e.style.display = "inline-flex"; });

    // ---------------- flashcards : fiche bristol, boîtes kraft, tampon
    flash = el("div", "abs", win);
    flash.style.cssText += ";left:0;top:0;width:100%;height:100%";
    const FL = C.flash, fcw = 620, fch = 340, fcx = hx + (MN.w - fcw) / 2, fcy = 150;
    const bristol = `background-color:#FBF8F0;background-image:linear-gradient(to bottom, transparent 70px, rgba(196,103,78,.55) 70px, rgba(196,103,78,.55) 72px, transparent 72px), repeating-linear-gradient(to bottom, transparent 0 103px, rgba(122,146,172,.35) 103px 104px, transparent 104px 136px);box-shadow:0 1px 1px rgba(0,0,0,.08),0 14px 34px rgba(40,42,30,.14)`;
    const INT = [["1", "tout de suite", 5], ["2", "10 min", 4], ["3", "1 h", 7], ["4", "6 h", 3], ["5", "1 jour", 11]];
    flash.innerHTML = `
      <div style="position:absolute;left:${hx}px;top:44px;font-size:13.5px" class="eyebrow">Flashcards · boîtes de Leitner</div>
      <div style="position:absolute;left:${hx}px;top:70px;font:400 38px/1 News;letter-spacing:-.02em;color:#1D1E1A">12 cartes à revoir aujourd’hui</div>
      <div class="fc-wrap" style="position:absolute;left:${fcx}px;top:${fcy}px;width:${fcw}px;height:${fch}px;perspective:1800px;perspective-origin:50% 50%">
        <div class="fc" style="position:absolute;inset:0;transform-style:preserve-3d;transform-origin:50% 50%">
          <div style="position:absolute;inset:0;backface-visibility:hidden;border-radius:6px;${bristol};padding:26px 36px">
            <div class="eyebrow" style="font-size:13px;color:#7A6A55">${FL.source}</div>
            <div style="margin-top:78px;font:400 42px/1.15 News;letter-spacing:-.015em;color:#1D1E1A;text-align:center">${FL.q}</div>
          </div>
          <div style="position:absolute;inset:0;backface-visibility:hidden;transform:rotateY(180deg);border-radius:6px;${bristol};padding:26px 36px">
            <div class="eyebrow" style="font-size:13px;color:#7A6A55">Réponse</div>
            <div style="margin-top:74px;font:500 58px/1.05 Hand;color:#2F3B63;text-align:center">${FL.a}</div>
          </div>
        </div>
      </div>
      <div class="fc-actions" style="position:absolute;left:${fcx}px;top:${fcy + fch + 26}px;width:${fcw}px;display:flex;gap:14px">
        <div class="btn fc-no" style="flex:1;height:52px;font-size:16.5px;background:#F1E3DC;color:#8E3F2C">À revoir</div>
        <div class="btn fc-yes" style="flex:1;height:52px;font-size:16.5px;background:#E2E3C6;color:#39402F">Je savais</div>
      </div>
      <div class="fc-boxes" style="position:absolute;left:${hx + 50}px;top:${fcy + fch + 124}px;display:flex;gap:20px">
        ${INT.map(([n, lab, c], k) => `
        <div class="fc-box" style="width:146px;height:118px;border-radius:6px;background:#D6C19C url(../assets/textures/paper_sheet.png) center/400px;background-blend-mode:multiply;box-shadow:inset 0 -10px 0 rgba(120,90,50,.18), inset 0 0 0 1.5px rgba(90,65,35,.25);position:relative;padding:14px 16px">
          <div style="font:500 12.5px/1 Mono;letter-spacing:.12em;color:#5E4B33">BOÎTE ${n}</div>
          <div class="fc-count" style="font:400 38px/1 News;color:#2E2518;margin-top:10px">${c}</div>
          <div style="font:500 13.5px/1 Sans;color:#5E4B33;margin-top:10px;white-space:nowrap">${lab}</div>
        </div>`).join("")}
      </div>
      <div class="fc-mini" style="position:absolute;left:0;top:0;width:${fcw}px;height:${fch}px;border-radius:6px;${bristol};opacity:0;transform-origin:0 0"></div>
      <div class="fc-stamp" style="position:absolute;left:${hx + 50 + 2 * 166 - 70}px;top:${fcy + fch + 262}px;padding:12px 20px;border:3px solid #A8432F;border-radius:6px;color:#A8432F;font:500 19px/1 Mono;letter-spacing:.16em;white-space:nowrap;mix-blend-mode:multiply;-webkit-mask:url(../assets/textures/ink_mask.png) center/cover;mask:url(../assets/textures/ink_mask.png) center/cover">REVIENT DANS 1 HEURE</div>`;
    Object.assign(flash, { wrap: flash.querySelector(".fc-wrap"), card: flash.querySelector(".fc"), actions: flash.querySelector(".fc-actions"),
      yes: flash.querySelector(".fc-yes"), boxes: Array.from(flash.querySelectorAll(".fc-box")), counts: Array.from(flash.querySelectorAll(".fc-count")),
      mini: flash.querySelector(".fc-mini"), stamp: flash.querySelector(".fc-stamp"), geo: { fcx, fcy, fcw, fch } });

    // ---------------- QCM
    qcm = el("div", "abs", win);
    qcm.style.cssText += ";left:0;top:0;width:100%;height:100%";
    const Q = C.qcm;
    qcm.innerHTML = `
      <div style="position:absolute;left:${hx}px;top:44px;font-size:13.5px" class="eyebrow">QCM · Victor Hugo</div>
      <div style="position:absolute;right:44px;top:40px;font:500 13.5px/1 Mono;letter-spacing:.1em;color:#6F7063">QUESTION 4 / 15</div>
      <div style="position:absolute;left:${hx}px;right:44px;top:68px;height:4px;border-radius:4px;background:#E6DFCD"><div style="width:27%;height:100%;border-radius:4px;background:#5F6443"></div></div>
      <div class="q-q" style="position:absolute;left:${hx}px;top:112px;width:880px;font:400 38px/1.2 News;letter-spacing:-.015em;color:#1D1E1A">${Q.q.replace(" : quel procédé ?", " :<br>quel procédé ?")}</div>
      <div class="q-opts" style="position:absolute;left:${hx}px;top:262px;width:${MN.w}px">
        ${Q.options.map((o, k) => `<div class="q-o" style="position:relative;height:66px;margin-bottom:12px;border-radius:12px;background:#FFFDF8;box-shadow:0 0 0 1.5px rgba(29,30,26,.1);display:flex;align-items:center;padding:0 22px;gap:18px;font:400 21px/1 Sans;color:#2B2C27">
          <div class="q-l" style="width:36px;height:36px;border-radius:9px;background:#EFE8D8;font:500 15px/36px Mono;text-align:center;color:#5F6443">${"ABCD"[k]}</div><span>${o}</span>
          <div class="q-ic" style="margin-left:auto;opacity:0"></div></div>`).join("")}
      </div>
      <div class="q-exp" style="position:absolute;left:${hx}px;top:${262 + 4 * 78 + 8}px;width:${MN.w}px;height:0;overflow:hidden;border-radius:14px;background:#EFE8D8">
        <div style="padding:22px 26px">
          <div class="eyebrow" style="font-size:13.5px">Explication</div>
          <div style="margin-top:12px;font:400 20.5px/1.4 Sans;color:#2B2C27"><b style="font-weight:600">Une métaphore</b> : l’ignorance est la nuit, sans outil de comparaison. Avec « comme », ce serait une comparaison.</div>
        </div>
      </div>`;
    Object.assign(qcm, { q: qcm.querySelector(".q-q"), opts: Array.from(qcm.querySelectorAll(".q-o")), exp: qcm.querySelector(".q-exp") });

    // ---------------- logo, écrit au-dessus des cartes rangées
    lock = el("div", "abs", cam);
    lock.style.cssText += ";left:0;top:0;width:1440px;height:1080px";
    lock.mark = el("div", "abs", lock, B.markSVG(92, "lockmark"));
    lock.mark.style.transformOrigin = "0 0";
    lock.word = el("div", "abs", lock, `<span class="mask" style="padding-bottom:.25em"><span class="word">${B.wordmark(80)}</span></span>`);
    lock.word.style.transformOrigin = "0 0";
    lock.word.inner = lock.word.querySelector(".word");
    lock.sub = el("div", "abs mono", lock, "Le site de révision d’HLP · Terminale");
    lock.sub.style.cssText += ";left:0;width:1440px;text-align:center;font:500 16px/1 Mono;letter-spacing:.22em;color:#5F6443;white-space:nowrap";
    lock.svg = lock.mark.querySelector("svg");

    // ---------------- doigt (point de toucher), pas de curseur de bureau
    touch = el("div", "abs", cam);
    touch.style.cssText += ";width:46px;height:46px;border-radius:50%;background:rgba(95,100,67,.16);box-shadow:inset 0 0 0 2px rgba(57,64,47,.55);z-index:50";
    el("div", "", touch).style.cssText = "position:absolute;left:18px;top:18px;width:10px;height:10px;border-radius:50%;background:rgba(57,64,47,.75)";
    ripple = el("div", "abs", cam);
    ripple.style.cssText += ";width:56px;height:56px;border-radius:50%;border:2px solid rgba(95,100,67,.8);z-index:49";
  };

  /* centre d’un élément, en coordonnées écran sans caméra (mesuré une fois, fenêtre au repos) */
  function measure() {
    if (TGT.ok) return;
    const saved = win.style.transform;
    win.style.transform = "none";
    [home, fiche, flash, qcm].forEach(e => { e.style.visibility = "visible"; e.style.transform = "none"; });
    const c = e => { const r = e.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; };
    const camT = cam.style.transform; cam.style.transform = "none";
    TGT.rousseau = c(cardsEls[1]);
    TGT.navFlash = c(navs[2]); TGT.navQcm = c(navs[3]); TGT.navFrise = c(navs[4]);
    TGT.yes = c(flash.yes);
    TGT.good = c(qcm.opts[C.qcm.bonne]);
    TGT.wordW = lock.word.inner.getBoundingClientRect().width;
    cam.style.transform = camT; win.style.transform = saved;
    TGT.ok = true;
    S.navFriseXY = TGT.navFrise;
  }
  S.navFriseXY = [A.x + 60, A.y + 122 + 4 * 48 + 20];

  S.update = function (t) {
    const k = T();
    measure();
    const dk = desk();
    // ---------- logo au-dessus de la grille
    const lockY = 150;
    const mIn = seg(t, k.v7s - 0.1, 0.9, E.out);
    const toSide = seg(t, k.build, 0.8, E.inOut);
    B.animateMark(lock.svg, {
      bg: t < k.v7s - 0.1 ? 0 : clamp(spring(t - (k.v7s - 0.1), 16, 0.72), 0, 1.08),
      rules: seg(t, k.v7s + 0.05, 0.6, E.out), margin: seg(t, k.v7s + 0.15, 0.45, E.out),
      letter: seg(t, k.v7c - 0.15, 0.55, E.out),
    });
    const W0 = 92 + 24 + (TGT.wordW || 470), x0 = 720 - W0 / 2;
    const sideMark = [A.x + 24, A.y + 30], sideScale = 36 / 92;
    put(lock.mark, { x: lerp(x0, sideMark[0], toSide), y: lerp(lockY, sideMark[1], toSide), s: lerp(1, sideScale, toSide), op: t >= k.v7s - 0.1 ? 1 : 0 });
    const wIn = seg(t, k.v7c - 0.1, 0.6, E.out);
    put(lock.word.inner, { y: (1 - wIn) * 110 });
    put(lock.word, { x: lerp(x0 + 92 + 24, sideMark[0] + 36 + 12, toSide), y: lerp(lockY + 10, sideMark[1] + 4, toSide), s: lerp(1, 24 / 80, toSide), op: 1 });
    put(lock.sub, { y: lockY + 128, op: seg(t, k.v7e - 0.1, 0.5) * (1 - seg(t, k.build - 0.05, 0.25, E.linear)) });

    // ---------- fenêtre qui se construit autour des cartes
    const wn = seg(t, k.build + 0.15, 0.9, E.emph);
    put(win, { s: lerp(1.03, 1, wn) });
    win.style.boxShadow = `0 0 0 1px rgba(29,30,26,${(0.07 * wn).toFixed(3)}), 0 26px 70px rgba(40,42,30,${(0.16 * wn).toFixed(3)}), 0 6px 18px rgba(40,42,30,${(0.07 * wn).toFixed(3)})`;
    win.style.background = `rgba(250,247,240,${wn.toFixed(3)})`;
    win.firstChild.style.opacity = (0.55 * wn).toFixed(3);
    put(side, { x: lerp(-A.side, 0, seg(t, k.build + 0.3, 0.8, E.emph)) });
    navs.forEach((n, i) => { const e = seg(t, k.build + 0.5 + i * 0.045 + (i % 3) * 0.013, 0.4, E.out); put(n, { op: e, x: (1 - e) * -10 }); });
    const navOn = t < k.navFlash + 0.1 ? 1 : t < k.navQcm + 0.1 ? 2 : t < k.navFrise + 0.1 ? 3 : 4;
    navs.forEach((n, i) => n.classList.toggle("on", i === navOn));

    // cartes : centrées (fin du bureau) → à leur place dans l’application ; légère mise en retrait sous le logo
    const gm = seg(t, k.build + 0.35, 0.95, E.emph);
    const dim = seg(t, k.v7s - 0.1, 0.4) * (1 - seg(t, k.build + 0.2, 0.4));
    const dx = lerp(dk.GRID_DX, 0, gm), dy = lerp(dk.GRID_DY, 0, gm);
    const hIn = seg(t, k.build + 0.75, 0.5, E.out);
    put(home.hdr, { op: hIn, y: (1 - hIn) * 12 });
    const opened = seg(t, k.tapCard + 0.08, 0.2, E.linear);
    cardsEls.forEach((c, i) => {
      let y = dy, sc = 1;
      if (i === 1) {
        const pr = Math.sin(Math.PI * seg(t, k.tapCard, 0.16, E.linear));
        sc = 1 - pr * 0.02;
      }
      put(c, { x: dx, y, s: sc, op: (1 - dim * 0.35) * (i === 1 ? (t < k.tapCard + 0.08 ? 1 : 0) : 1 - opened) });
    });
    put(hub, { op: seg(t, k.build + 0.85, 0.5, E.out) * (1 - opened), y: (1 - seg(t, k.build + 0.85, 0.5, E.out)) * 14 });
    put(home.hdr, { op: hIn * (1 - opened) });

    // ---------- la carte Rousseau devient l’en-tête de la fiche
    const ex = seg(t, k.tapCard + 0.08, 0.6, E.emph);
    const s1 = UI.slot(1);
    const r0 = { x: s1.x - A.x, y: s1.y - A.y, w: s1.w, h: s1.h };
    const exOn = t >= k.tapCard + 0.08 && t < k.navFlash + 0.5;
    if (exOn) {
      put(expander, { op: 1 - seg(t, k.navFlash, 0.2, E.linear), x: -seg(t, k.navFlash, 0.45, E.in) * 60 });
      expander.style.left = lerp(r0.x, HEAD.x, ex).toFixed(2) + "px"; expander.style.top = lerp(r0.y, HEAD.y, ex).toFixed(2) + "px";
      expander.style.width = lerp(r0.w, HEAD.w, ex).toFixed(2) + "px"; expander.style.height = lerp(r0.h, HEAD.h, ex).toFixed(2) + "px";
      expander.style.borderRadius = lerp(16, 14, ex).toFixed(2) + "px";
      expander.card.style.opacity = (1 - seg(t, k.tapCard + 0.1, 0.22, E.linear)).toFixed(3);
    } else put(expander, { op: 0 });
    const fo = (1 - seg(t, k.navFlash, 0.2, E.linear));     // un écran part avant que l’autre arrive (pas de fondu enchaîné)
    put(fiche, { op: (t >= k.tapCard + 0.3 ? 1 : 0) * fo, x: -seg(t, k.navFlash, 0.45, E.in) * 60 });
    const fIn = d => seg(t, k.tapCard + 0.42 + d, 0.45, E.out);
    [[fiche.back, 0], [fiche.auth, 0.03], [fiche.ftitle, 0.09], [fiche.oeuvre, 0.14]].forEach(([e, d]) => put(e, { op: fIn(d), y: (1 - fIn(d)) * 14 }));
    fiche.chips.forEach((c, i) => { const e = seg(t, k.tapCard + 0.62 + i * 0.07, 0.35, E.out); put(c, { op: e, y: (1 - e) * 8 }); });
    put(fiche.essH, { op: seg(t, k.ess - 0.2, 0.4) });
    const jit = [0, 0.05, -0.03, 0.04, 0.0];
    fiche.pts.forEach((p, i) => { const e = seg(t, k.ess - 0.05 + i * 0.16 + jit[i], 0.5, E.out); put(p, { op: e, y: (1 - e) * 12 }); });
    const qIn = seg(t, k.cit - 0.15, 0.6, E.emph);
    put(fiche.quote, { op: qIn, y: (1 - qIn) * 26 });
    fiche.hl.style.transform = `scaleX(${seg(t, k.cles - 0.05, 0.5, E.inOut).toFixed(3)})`;
    const nIn = seg(t, k.cles + 0.25, 0.7, E.inOut);
    fiche.note.style.clipPath = `inset(-10% ${((1 - nIn) * 100).toFixed(1)}% -10% 0)`;

    // ---------- flashcards
    const flIn = seg(t, k.navFlash + 0.2, 0.55, E.emph);
    put(flash, { op: flIn * (1 - seg(t, k.navQcm, 0.2, E.linear)), x: (1 - flIn) * 70 - seg(t, k.navQcm, 0.45, E.in) * 60 });
    const cardIn = seg(t, k.navFlash + 0.3, 0.55, E.out);
    const flip = seg(t, k.flip, 0.6, E.inOut);
    const toBox = seg(t, k.yes + 0.1, 0.62, E.emph);
    const g = flash.geo;
    put(flash.wrap, { op: cardIn * (toBox > 0 ? 0 : 1), y: (1 - cardIn) * 30 });
    flash.card.style.transform = `rotateY(${(flip * 180).toFixed(2)}deg)`;
    put(flash.actions, { op: seg(t, k.flip + 0.3, 0.4) * (1 - seg(t, k.yes + 0.3, 0.3)) });
    flash.yes.style.transform = `scale(${(1 - Math.sin(Math.PI * seg(t, k.yes - 0.05, 0.16, E.linear)) * 0.04).toFixed(3)})`;
    const bx = parseFloat(flash.querySelector(".fc-boxes").style.left) + 2 * 166, by = g.fcy + g.fch + 124;
    if (toBox > 0) {
      const mx = lerp(g.fcx, bx, toBox), my = lerp(g.fcy, by, toBox) - Math.sin(Math.PI * toBox) * 80;
      put(flash.mini, { x: mx, y: my, sx: lerp(1, 146 / g.fcw, toBox), sy: lerp(1, 118 / g.fch, toBox), op: 1 - seg(t, k.yes + 0.64, 0.12, E.linear) });
    } else put(flash.mini, { op: 0 });
    flash.boxes.forEach((b, i) => {
      const pulse = i === 2 ? Math.sin(Math.PI * seg(t, k.yes + 0.7, 0.3, E.linear)) : 0;
      b.style.transform = `translateY(${(pulse * 4).toFixed(2)}px)`;
    });
    flash.counts[2].textContent = t > k.yes + 0.72 ? "8" : "7";
    // tampon encreur : posé d’un coup, légèrement de travers
    const st = t - k.stamp;
    put(flash.stamp, { op: st > 0 ? 0.92 : 0, s: st > 0 ? 1 + 0.35 * Math.exp(-st / 0.035) : 1.35, r: -5 });

    // ---------- QCM
    const qcIn = seg(t, k.navQcm + 0.2, 0.55, E.emph);
    put(qcm, { op: qcIn, x: (1 - qcIn) * 70 });
    put(qcm.q, { op: seg(t, k.qIn - 0.25, 0.5), y: (1 - seg(t, k.qIn - 0.25, 0.5)) * 12 });
    const ojit = [0, 0.1, 0.17, 0.3];
    qcm.opts.forEach((o, i) => {
      const e = seg(t, k.qIn + 0.05 + ojit[i], 0.45, E.out);
      const good = i === C.qcm.bonne, picked = t > k.qTap + 0.1;
      let op = e;
      if (picked && !good) op *= lerp(1, 0.4, seg(t, k.qTap + 0.1, 0.3));
      put(o, { op, y: (1 - e) * 12, s: good ? 1 - Math.sin(Math.PI * seg(t, k.qTap, 0.16, E.linear)) * 0.012 : 1 });
      if (good) {
        const ok = seg(t, k.qTap + 0.08, 0.3, E.out);
        o.style.background = ok > 0 ? `rgb(${Math.round(lerp(255, 95, ok))},${Math.round(lerp(253, 100, ok))},${Math.round(lerp(248, 67, ok))})` : "#FFFDF8";
        o.style.color = ok > 0.5 ? "#F2EDE3" : "#2B2C27";
        const ic = o.querySelector(".q-ic");
        ic.innerHTML = window.icon("check", 26, 'style="stroke:#F2EDE3;fill:none;stroke-width:2.4;stroke-linecap:round;stroke-linejoin:round"');
        ic.style.opacity = ok;
        const l = o.querySelector(".q-l");
        l.style.background = ok > 0.5 ? "rgba(242,237,227,.18)" : "#EFE8D8";
        l.style.color = ok > 0.5 ? "#F2EDE3" : "#5F6443";
      }
    });
    qcm.exp.style.height = (seg(t, k.qExp, 0.55, E.emph) * 122).toFixed(1) + "px";

    // ---------- le doigt
    const path = [
      [k.tapCard - 0.9, 900, 1160], [k.tapCard - 0.05, ...TGT.rousseau],
      [k.tapCard + 0.35, TGT.rousseau[0] + 30, TGT.rousseau[1] + 40],
      [k.navFlash - 0.7, 700, 820], [k.navFlash - 0.05, ...TGT.navFlash],
      [k.flip - 0.1, 820, 760], [k.yes - 0.1, ...TGT.yes],
      [k.navQcm - 0.7, 640, 820], [k.navQcm - 0.05, ...TGT.navQcm],
      [k.qTap - 0.55, 820, 760], [k.qTap - 0.03, ...TGT.good],
      [k.navFrise - 0.6, 520, 700], [k.navFrise - 0.04, ...TGT.navFrise],
    ];
    let px = path[0][1], py = path[0][2];
    for (let i = 1; i < path.length; i++) {
      const [ta, xa, ya] = path[i - 1], [tb, xb, yb] = path[i];
      if (t >= ta) { const e = E.inOut(inv(ta, tb, t)); px = lerp(xa, xb, e); py = lerp(ya, yb, e); }
    }
    const taps = [k.tapCard, k.navFlash, k.yes, k.navQcm, k.qTap, k.navFrise];
    let press = 0, rip = 0;
    taps.forEach(c => { press = Math.max(press, Math.sin(Math.PI * seg(t, c, 0.18, E.linear))); if (t >= c && t < c + 0.5) rip = seg(t, c, 0.45, E.out); });
    const tOn = seg(t, k.tapCard - 0.9, 0.3) * (1 - seg(t, k.navFrise + 0.15, 0.2));
    put(touch, { x: px - 23, y: py - 23, s: 1 - press * 0.18, op: tOn });
    put(ripple, { x: px - 28, y: py - 28, s: 0.5 + rip * 0.9, op: rip > 0 && rip < 1 ? (1 - rip) * 0.7 * tOn : 0 });

    // ---------- caméra : trois cadres, recentrés, tenus
    const shots = [
      [k.build, 1, 720, 540],
      [k.tapCard + 0.35, 1, 720, 540],
      [k.tapCard + 0.35 + 1.1, 1.1, 740, 480],
      [k.navFlash - 0.2, 1.1, 740, 480],
      [k.navFlash + 0.5, 1, 720, 540],
      [k.navQcm + 0.3, 1, 720, 540],
      [k.navQcm + 0.3 + 1.1, 1.08, 770, 520],
      [k.navFrise - 0.4, 1.08, 770, 520],
      [k.navFrise + 0.2, 1, 720, 540],
    ];
    let z = 1, fx = 720, fy = 540;
    for (let i = 1; i < shots.length; i++) {
      const [ta, za, xa, ya] = shots[i - 1], [tb, zb, xb, yb] = shots[i];
      if (t >= ta) { const e = E.inOut(inv(ta, tb, t)); z = lerp(za, zb, e); fx = lerp(xa, xb, e); fy = lerp(ya, yb, e); }
    }
    z += drift(t, 0.18, 7) * 0.003;
    // le point visé va vers le centre de l’image : écran = C + (p − F)·z
    cam.style.transform = `translate(${(720 - fx * z).toFixed(2)}px, ${(540 - fy * z).toFixed(2)}px) scale(${z.toFixed(4)})`;

    // sortie : la frise naît du toucher sur « Frise »
    put(root, { op: 1 });      // la frise se pose par-dessus (deux calques à demi transparents assombriraient l’image)
  };

  S.blur = t => {
    const k = T();
    if (t > k.build && t < k.build + 1.3) return 8;           // le logo rejoint la barre latérale, les cartes glissent
    if (t > k.tapCard + 0.05 && t < k.tapCard + 0.7) return 6;  // la carte s’ouvre
    if (t > k.yes + 0.05 && t < k.yes + 0.8) return 8;          // la carte file dans la boîte
    if ((t > k.navFlash && t < k.navFlash + 0.7) || (t > k.navQcm && t < k.navQcm + 0.7)) return 6;
    return 1;
  };

  /* bruitages : un toucher = un clic ; le papier et l’encre pour le reste */
  S.sounds = function () {
    const k = T(), out = [];
    const add = (t, sfx, g, p = 0, o = {}) => out.push(Object.assign({ t, sfx, g, p, scene: "app" }, o));
    const pan = xy => clamp(((xy ? xy[0] : 720) - 720) / 1500, -0.4, 0.4);
    add(k.v7c - 0.12, "pen_stroke_2", -25);                           // le « c’ » s’écrit
    add(k.build + 0.05, "air_soft", -23);                              // la fenêtre se construit
    [[k.tapCard, TGT.rousseau], [k.navFlash, TGT.navFlash], [k.yes, TGT.yes], [k.navQcm, TGT.navQcm], [k.qTap, TGT.good], [k.navFrise, TGT.navFrise]]
      .forEach(([t, xy], i) => add(t, "ui_click", i === 4 ? -16 : -17.5, pan(xy)));
    add(k.tapCard + 0.1, "paper_slide_6", -27);                        // la carte devient une page
    add(k.cles - 0.05, "marker_2", -23, 0.1);                          // surligneur sur « clés »
    add(k.cles + 0.25, "write_a", -24, 0.15);                          // « noté en cours »
    add(k.flip, "card_flip", -15);
    add(k.yes + 0.7, "wood_tock", -19, 0.1);                           // la carte tombe dans la boîte 3
    add(k.stamp, "stamp", -14, 0.1);                                   // tampon « revient dans 1 heure »
    return out;
  };

  (window.SCENES = window.SCENES || []).push(S);
})();
