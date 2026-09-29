/* =====================================================================
   FEUILLE DE CUES VFX (v4 : « minuscules détails »)
   Retour du commanditaire sur la v3 : beaucoup trop d'effets visuels et sonores ;
   il parlait de minuscules détails. On garde la v1 telle quelle et on n'ajoute que
   quelques touches presque invisibles : un reflet de lumière sur le logo, deux
   poussées de caméra de moins de 1,5 %. Aucun bruitage ici : le son est celui de la v1
   (scripts/audio/mix.py).
   ===================================================================== */
(function () {
  "use strict";
  const { cue: M } = window.ENG;

  function build() {
    const V = [];
    const fx = (t, type, o = {}) => V.push(Object.assign({ t, type }, o));
    fx(M("q_tout") - 0.05, "punch", { a: 0.008, d: 0.4 });                      // « tout » : à peine une respiration
    fx(M("shutter") + 0.02, "punch", { a: 0.012, d: 0.45 });                    // le déclic
    fx(M("v7_cahier") + 0.2, "sweep", { d: 0.9, a: 0.3, x: 360, y: 420, w: 720, h: 240, r: 30 });   // reflet sur le nom
    fx(M("v14_cahier") + 0.6, "sweep", { d: 0.9, a: 0.3, x: 280, y: 420, w: 880, h: 200, r: 24 }); // reflet sur le carton
    return { vfx: V.sort((a, b) => a.t - b.t), sfx: [] };
  }

  let cache = null;
  window.FXTRACK = () => (cache = cache || build());
})();
