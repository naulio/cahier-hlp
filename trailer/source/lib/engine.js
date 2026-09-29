/* =====================================================================
   Moteur d'animation déterministe.
   Tout l'état visuel est une fonction pure du temps t (en secondes) :
   renderFrame(t) peut être appelé dans n'importe quel ordre, ce qui
   permet un rendu image par image exact (et parallélisable).
   ===================================================================== */
(function () {
  "use strict";

  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const lerp = (a, b, e) => a + (b - a) * e;
  const inv = (a, b, x) => clamp((x - a) / (b - a));

  /* Bézier cubique (comme en CSS), résolue par Newton + bissection. */
  function bezier(x1, y1, x2, y2) {
    const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
    const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
    const sx = t => ((ax * t + bx) * t + cx) * t;
    const sy = t => ((ay * t + by) * t + cy) * t;
    const dx = t => (3 * ax * t + 2 * bx) * t + cx;
    return function (x) {
      if (x <= 0) return 0;
      if (x >= 1) return 1;
      let t = x;
      for (let i = 0; i < 8; i++) {
        const e = sx(t) - x;
        if (Math.abs(e) < 1e-6) return sy(t);
        const d = dx(t);
        if (Math.abs(d) < 1e-6) break;
        t -= e / d;
      }
      let lo = 0, hi = 1; t = x;
      for (let i = 0; i < 30; i++) {
        const v = sx(t);
        if (Math.abs(v - x) < 1e-6) break;
        if (v < x) lo = t; else hi = t;
        t = (lo + hi) / 2;
      }
      return sy(t);
    };
  }

  const E = {
    linear: x => clamp(x),
    inOut: bezier(0.65, 0, 0.35, 1),        // mouvements de caméra
    out: bezier(0.16, 1, 0.3, 1),           // arrivées (expo-out doux)
    outSoft: bezier(0.25, 0.8, 0.25, 1),
    in: bezier(0.7, 0, 0.84, 0),            // départs
    emph: bezier(0.2, 0, 0, 1),             // « emphasized » : interfaces
    snap: bezier(0.5, 0, 0.1, 1),
    sine: x => 0.5 - 0.5 * Math.cos(Math.PI * clamp(x)),
  };

  /* Ressort amorti analytique (réponse à un échelon), pour les micro-interactions.
     z = amortissement (0.6-0.9 : léger dépassement), w = pulsation (rad/s). */
  function spring(tl, w = 22, z = 0.72) {
    if (tl <= 0) return 0;
    const wd = w * Math.sqrt(1 - z * z);
    return 1 - Math.exp(-z * w * tl) * (Math.cos(wd * tl) + (z * w / wd) * Math.sin(wd * tl));
  }

  /* Progression normalisée d'un segment [t0, t0+d] avec easing. */
  const seg = (t, t0, d, ease = E.out) => ease(inv(t0, t0 + d, t));

  /* Bruit lisse déterministe (pour dérives de caméra « à la main »). */
  function hash(n) { const s = Math.sin(n * 127.1) * 43758.5453; return s - Math.floor(s); }
  function noise1(x) {
    const i = Math.floor(x), f = x - i;
    const u = f * f * (3 - 2 * f);
    return lerp(hash(i) * 2 - 1, hash(i + 1) * 2 - 1, u);
  }
  const drift = (t, speed = 0.25, seed = 0) =>
    noise1(t * speed + seed * 17.3) * 0.65 + noise1(t * speed * 2.1 + seed * 5.1 + 3) * 0.35;

  /* DOM */
  function el(tag, cls, parent, html) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    if (parent) parent.appendChild(e);
    return e;
  }
  function svgEl(tag, attrs, parent) {
    const e = document.createElementNS("http://www.w3.org/2000/svg", tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  /* Applique transform + opacité ; masque totalement l'élément invisible
     (display none = pas de coût de rendu). */
  function put(e, o) {
    const s = e.style;
    if (o.op !== undefined) {
      const v = clamp(o.op);
      s.opacity = v.toFixed(4);
      s.visibility = v <= 0.001 ? "hidden" : "visible";
    }
    if (o.x !== undefined || o.y !== undefined || o.s !== undefined || o.r !== undefined || o.sx !== undefined) {
      const x = o.x || 0, y = o.y || 0, sc = o.s === undefined ? 1 : o.s, r = o.r || 0;
      const sx = o.sx === undefined ? 1 : o.sx, sy = o.sy === undefined ? 1 : o.sy;
      s.transform = `translate(${x.toFixed(2)}px,${y.toFixed(2)}px) rotate(${r.toFixed(3)}deg) scale(${(sc * sx).toFixed(4)},${(sc * sy).toFixed(4)})`;
    }
    if (o.blur !== undefined) s.filter = o.blur > 0.05 ? `blur(${o.blur.toFixed(2)}px)` : "none";
    if (o.clip !== undefined) s.clipPath = o.clip;
  }
  function show(e, on) { e.style.display = on ? "" : "none"; }

  /* Cues : horaires des mots de la voix off (générés par le pipeline audio). */
  function cue(name) {
    const c = window.CUES && window.CUES.marks && window.CUES.marks[name];
    if (c === undefined) { console.warn("cue manquant", name); return 0; }
    return c;
  }

  window.ENG = { clamp, lerp, inv, bezier, E, spring, seg, noise1, drift, el, svgEl, put, show, cue };
})();
