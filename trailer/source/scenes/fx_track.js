/* =====================================================================
   FEUILLE DE CUES VFX + SFX (v3)
   Un temps fort = un effet visuel ET un bruitage, au même instant, calculé
   avec les mêmes repères que l'animation (voix off → cues.js). Lue par
   main.js (couche VFX) et par scripts/export_cues.py (mixage).
   Gains en dB avant mastering ; p = panoramique (-1 gauche … 1 droite).
   ===================================================================== */
(function () {
  "use strict";
  const { cue: M, clamp, E } = window.ENG;
  const scene = n => window.SCENES.find(s => s.name === n);

  function build() {
    const V = [], S = [];
    const fx = (t, type, o = {}) => V.push(Object.assign({ t, type }, o));
    const sd = (t, sfx, g, p = 0, o = {}) => S.push(Object.assign({ t, sfx, g, p }, o));
    const sh = M("shutter"), q0 = M("q_tout"), mais = M("v5_mais");

    /* ---------------- HOOK : quatre Polaroids, quatre flashs ---------------- */
    sd(0, "reverse_swell", -14, 0, { at_end: M("n1") - 0.26 });          // aspiration jusqu'au premier nom
    ["n1", "n2", "n3", "n4"].forEach((m, k) => {
      const land = M(m) - 0.26 + 0.22;                                     // la photo touche le bureau
      const pan = [-0.35, -0.12, 0.12, 0.35][k];
      fx(M(m) - 0.26, "flash", { a: 0.34 + k * 0.04, d: 0.18, color: "255,246,228" });
      fx(land, "punch", { a: 0.018 + k * 0.004, d: 0.4 });
      fx(land, "shake", { a: 2.5 + k, d: 0.25 });
      sd(M(m) - 0.28, "shutter_k1000", -12 + k * 0.5, pan);
      sd(M(m) - 0.26, "fizz", -18, pan);
      sd(land, k === 3 ? "impact_2" : "hit_small", k === 3 ? -9 : -12, pan);
      sd(land + 0.01, `paper_hit_${k % 3 + 1}`, -16, pan);
    });
    // « Tu te souviens de tout ? » puis grand recul
    fx(q0 - 0.05, "punch", { a: 0.03, d: 0.35 });
    fx(q0 + 0.05, "leak", { d: 1.6, a: 0.35, x0: 90, x1: 10, y: 30 });
    sd(q0 - 0.1, "whoosh_long", -10);
    sd(q0 + 0.1, "sub_drop", -14);

    /* ---------------- PROBLÈME : ça s'empile, la tension monte ---------------- */
    const arr = [["v3_rentree", 0, 0.5], ["v3_textes", 0, -0.4], ["v3_accum", 0, 0.3], ["v4_feuilles", 0, -0.5], ["v4_feuilles", 0.28, 0.45], ["v4_notes", -0.25, 0.1]];
    arr.forEach(([m, off, p], k) => {
      const ta = M(m) + off - 0.34;
      sd(ta, `whoosh_${[1, 4, 1, 4, 3, 1][k]}`, -15 - (k % 2), p);
      sd(ta + 0.42, `paper_hit_${k % 3 + 1}`, -14, p);
      fx(ta + 0.42, "shake", { a: 1.6, d: 0.2 });
    });
    sd(M("v4_notes") - 0.1, "pen_stroke_2", -16, 0.3);
    sd(M("v4_citations") - 0.05, "marker_1", -15, -0.2);
    sd(M("v4_citations") + 0.1, "shimmer", -22, 0.2);
    // montée de tension jusqu'au déclic ; bords qui se resserrent
    const rs = sh - 4.0;
    sd(rs, "riser_4", -12, 0, { len: 4.0 });
    fx(M("v5_tout"), "vignette", { a: 0.45, d: sh - M("v5_tout") + 0.1 });
    // le viseur cherche : trois visées
    [0, 1, 2].forEach(k => {
      const t0 = mais + 0.05 + k * 0.62;
      sd(t0, "whoosh_4", -17, [-0.4, 0.4, -0.1][k]);
      sd(t0 + 0.42, "ui_tick", -16, [-0.4, 0.4, -0.1][k]);
      fx(t0 + 0.42, "punch", { a: 0.012, d: 0.25 });
    });
    sd(sh - 0.35, "ui_click", -12);                                     // mise au point verrouillée

    /* ---------------- DÉCLIC : la révélation ---------------- */
    fx(sh, "flash", { a: 1, d: 0.6 });
    fx(sh, "rgb", { a: 5, d: 0.3 });
    fx(sh, "shake", { a: 11, d: 0.4 });
    fx(sh + 0.02, "punch", { a: 0.06, d: 0.55 });
    sd(sh - 0.02, "shutter_k1000", -3);
    sd(sh, "impact_1", -4);
    sd(sh + 0.02, "fizz", -10);
    sd(sh + 0.05, "sub_drop", -9);
    sd(sh + 0.3, "whoosh_2", -11, -0.5);                                // les objets s'envolent
    sd(sh + 0.38, "whoosh_3", -12, 0.5);
    fx(sh + 0.35, "leak", { d: 1.4, a: 0.3, x0: 10, x1: 90, y: 60 });
    for (let i = 0; i < 9; i += 2) sd(sh + 0.35 + i * 0.075 + 1.0, `pop_${(i / 2) % 3 + 1}`, -20, -0.4 + 0.1 * i);   // les cartes se posent

    /* ---------------- LE NOM ---------------- */
    const app = scene("app"), k = app.T();
    fx(M("v7_start") - 0.05, "flash", { a: 0.25, d: 0.35, color: "255,240,215" });
    sd(M("v7_start") - 0.1, "whoosh_1", -14);
    fx(M("v7_cahier"), "punch", { a: 0.03, d: 0.5 });
    sd(M("v7_cahier") - 0.02, "impact_2", -8);
    fx(M("v7_cahier") + 0.15, "sweep", { d: 0.8, x: 360, y: 420, w: 720, h: 240, r: 30 });
    sd(M("v7_cahier") + 0.15, "shimmer", -15);
    // l'interface se construit
    fx(k.build, "whip", { d: 0.32, dir: -1 });
    sd(k.build - 0.05, "whoosh_3", -12);
    for (let i = 0; i < 7; i++) sd(k.build + 0.4 + i * 0.05, "ui_tick", -22 + (i % 2), -0.6);

    /* ---------------- L'EXPÉRIENCE ---------------- */
    sd(k.click, "ui_click", -11, 0.1);
    sd(k.click + 0.1, "whoosh_4", -15);
    fx(k.click + 0.05, "punch", { a: 0.02, d: 0.35 });
    [k.auteur - 0.3, k.ess - 0.35, k.cit - 0.3].forEach((tz, i) => sd(tz, `whoosh_${[1, 4, 1][i]}`, -18, [-0.3, 0, 0.4][i]));  // la caméra se déplace
    for (let i = 0; i < 3; i++) sd(k.epoque - 0.08 + i * 0.1, `pop_${i + 1}`, -18, 0.1 * i);                                      // étiquettes
    for (let i = 0; i < 5; i++) sd(k.ess + 0.05 + i * 0.13, "pop_1", -22, -0.3);                                                    // les 5 points
    sd(k.cit - 0.12, "whoosh_4", -16, 0.5);
    sd(k.ret - 0.05, "marker_2", -14, 0.4);
    fx(k.ret + 0.1, "sweep", { d: 0.7, x: 880, y: 470, w: 470, h: 150, r: 14 });
    sd(k.ret + 0.1, "shimmer", -18, 0.4);
    // flashcards
    fx(k.toFlash, "whip", { d: 0.34, dir: -1 });
    sd(k.toFlash - 0.08, "ui_click", -12);
    sd(k.toFlash - 0.02, "whoosh_2", -12);
    sd(k.flip - 0.02, "card_flip", -9);
    sd(k.flip, "whoosh_4", -18);
    sd(k.yes - 0.05, "ui_click", -12);
    sd(k.yes + 0.15, "whoosh_1", -16, 0.2);
    sd(k.yes + 0.7, "wood_tock", -12, 0.2);
    fx(k.yes + 0.7, "punch", { a: 0.015, d: 0.3 });
    sd(k.moment - 0.2, "pop_3", -14);
    sd(k.moment - 0.15, "shimmer", -20);
    // QCM
    fx(k.toQcm, "whip", { d: 0.34, dir: -1 });
    sd(k.toQcm - 0.08, "ui_click", -12);
    sd(k.toQcm - 0.02, "whoosh_2", -12);
    for (let i = 0; i < 4; i++) sd(k.qIn + 0.05 + i * 0.08, `pop_${i % 3 + 1}`, -21, 0.2);
    sd(k.qClick, "ui_click", -10);
    sd(k.qClick + 0.1, "shimmer", -14);
    fx(k.qClick + 0.1, "flash", { a: 0.14, d: 0.3, color: "210,220,150" });
    fx(k.qClick + 0.1, "punch", { a: 0.018, d: 0.3 });
    sd(k.qExp, "whoosh_4", -18);

    /* ---------------- LA FRISE ---------------- */
    const fr = M("v11_frise"), rel = M("v11_relier"), rab = M("v11_rabelais"), are = M("v11_arendt");
    fx(k.out, "whip", { d: 0.45, dir: 1 });
    sd(k.out - 0.05, "whoosh_long", -11);
    sd(fr - 0.25, "whoosh_3", -14);                                      // la ligne se trace
    scene("frise").nodeTimes().forEach((tn, i) => sd(tn, `pop_${i % 3 + 1}`, -19, -0.8 + i * 0.2));
    sd(rel - 0.1, "marker_3", -16);
    [rab, are].forEach((th, i) => {
      sd(th - 0.05, "hit_small", -12, i ? 0.7 : -0.7);
      fx(th - 0.05, "flash", { a: 0.16, d: 0.3, color: "255,210,190" });
      fx(th - 0.05, "punch", { a: 0.02, d: 0.35 });
    });
    sd(rab + 0.05, "whoosh_long", -16, 0);                               // le grand arc de Rabelais à Arendt

    /* ---------------- LA CLASSE ---------------- */
    const cl0 = scene("classe").t0(), gr = M("v12_gratuit"), co = M("v12_compte"), pr = M("v12_progression");
    const pe = M("v13_start"), tg = M("v13_tg1"), cl = M("v13_classe"), v14 = M("v14_start");
    fx(cl0, "leak", { d: 1.5, a: 0.35, x0: 100, x1: 0, y: 50, color: "255,190,120" });
    sd(cl0 - 0.05, "whoosh_2", -13);
    [gr, co].forEach((tw, i) => { sd(tw - 0.12, "hit_small", -11, -0.3); fx(tw - 0.02, "punch", { a: 0.025, d: 0.35 }); fx(tw - 0.02, "shake", { a: 2.5, d: 0.2 }); });
    sd(pr - 0.35, "whoosh_1", -13, 0.5);
    sd(pr - 0.05, "pop_2", -15, 0.5);
    for (let i = 0; i < 6; i++) sd(pr + 0.1 + i * 0.22, "ui_tick", -22 + i * 0.5, 0.5);   // la progression se remplit
    sd(pe - 0.15, "whoosh_2", -12, 0.3);                                  // le téléphone rejoint sa place
    fx(pe - 0.1, "whip", { d: 0.3, dir: -1 });
    sd(tg - 0.2, "impact_2", -10);
    fx(tg - 0.15, "punch", { a: 0.03, d: 0.4 });
    for (let r = 0; r < 6; r++) sd(cl - 0.35 + r * 0.075, `pop_${r % 3 + 1}`, -17 + r * 0.4, -0.2 + r * 0.08);   // la vague d'écrans
    sd(cl - 0.3, "shimmer", -14);
    fx(cl - 0.1, "flash", { a: 0.18, d: 0.5, color: "215,225,140" });
    sd(v14 - 2.0, "riser_2", -12, 0, { len: 2.0 });                        // montée vers le nom
    sd(v14 - 0.8, "whoosh_3", -14);

    /* ---------------- FIN ---------------- */
    const nm = M("v14_cahier"), ve = M("v14_end"), cap = M("capture");
    fx(v14 + 0.35, "flash", { a: 0.55, d: 0.5, color: "255,244,225" });
    fx(v14 + 0.35, "punch", { a: 0.045, d: 0.55 });
    fx(v14 + 0.35, "shake", { a: 5, d: 0.3 });
    sd(v14 + 0.33, "impact_1", -6);
    sd(v14 + 0.36, "sub_drop", -11);
    fx(nm + 0.55, "sweep", { d: 0.9, x: 280, y: 420, w: 880, h: 200, r: 24 });
    sd(nm + 0.5, "shimmer", -13);
    sd(ve + 0.05, "pop_3", -14);
    sd(ve + 0.08, "ui_click", -16);
    fx(cap, "flash", { a: 0.95, d: 0.6 });
    fx(cap, "rgb", { a: 3.5, d: 0.25 });
    fx(cap, "shake", { a: 7, d: 0.35 });
    sd(cap - 0.02, "shutter_k1000", -4);
    sd(cap, "impact_2", -8);
    sd(cap + 0.02, "fizz", -11);
    sd(cap + 0.15, "polaroid_eject", -12, 0, { len: 1.2, fade: 0.4 });
    sd(cap + 1.05, "pencil_caption", -15);
    return { vfx: V.sort((a, b) => a.t - b.t), sfx: S.sort((a, b) => a.t - b.t) };
  }

  let cache = null;
  window.FXTRACK = () => (cache = cache || build());
})();
