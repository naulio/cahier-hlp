/* =====================================================================
   VFX — couche d'effets au-dessus des scènes (v3).
   Chaque scène déclare ses effets avec S.vfx() → [{ type, t, … }] ; les
   mêmes instants servent aux bruitages (S.sounds()), donc l'image et le
   son frappent ensemble. Tout reste une fonction pure du temps.

   Types :
     flash   { t, a=1, d=0.35, color }        éclair plein cadre (additif)
     punch   { t, a=0.035, d=0.45 }           poussée de caméra (zoom) sur un temps fort
     shake   { t, a=6, d=0.35 }               secousse d'impact (px, amortie)
     whip    { t, d=0.3, dir=1 }              filé horizontal (flou directionnel + glissement)
     leak    { t, d=1.6, a=0.5, x, y, color } halo chaud qui traverse l'image
     sweep   { t, d=0.7, x, y, w, h, r }      reflet lumineux qui balaie une zone (logo, carte)
     rgb     { t, a=3, d=0.25 }               légère séparation des couleurs (impacts)
     vignette{ t, a=0.35, d=0.6 }             assombrissement des bords (tension)
   ===================================================================== */
(function () {
  "use strict";
  const { E, clamp, lerp, el, noise1 } = window.ENG;

  let stage, layer, flashEl, leakEl, vigEl, sweepEl, svg;
  const W = 1440, H = 1080;

  function build() {
    stage = document.getElementById("stage");
    layer = el("div", "", stage.parentNode);
    layer.id = "vfx";
    layer.style.cssText = "position:absolute;left:0;top:0;width:1440px;height:1080px;pointer-events:none;overflow:hidden;z-index:100";
    leakEl = el("div", "", layer);
    leakEl.style.cssText = "position:absolute;inset:-20%;mix-blend-mode:screen;opacity:0";
    sweepEl = el("div", "", layer);
    sweepEl.style.cssText = "position:absolute;left:0;top:0;mix-blend-mode:overlay;opacity:0;overflow:hidden";
    sweepEl.bar = el("div", "", sweepEl);
    sweepEl.bar.style.cssText = "position:absolute;top:-50%;height:200%;width:34%;background:linear-gradient(100deg,rgba(255,255,255,0) 0%,rgba(255,255,255,.95) 50%,rgba(255,255,255,0) 100%)";
    vigEl = el("div", "", layer);
    vigEl.style.cssText = "position:absolute;inset:0;background:radial-gradient(ellipse 75% 70% at 50% 50%,rgba(0,0,0,0) 55%,rgba(0,0,0,.85) 100%);opacity:0";
    flashEl = el("div", "", layer);
    flashEl.style.cssText = "position:absolute;inset:0;mix-blend-mode:screen;opacity:0";
    // filtres SVG : flou directionnel (filé) et séparation des couleurs
    svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "0"); svg.setAttribute("height", "0");
    svg.style.position = "absolute";
    svg.innerHTML = `<defs>
      <filter id="fx-whip" x="-10%" y="0" width="120%" height="100%" color-interpolation-filters="sRGB"><feGaussianBlur id="fx-whip-b" stdDeviation="0 0"/></filter>
      <filter id="fx-rgb" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
        <feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="r"/>
        <feOffset id="fx-rgb-r" in="r" dx="0" dy="0" result="ro"/>
        <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0" result="gb"/>
        <feOffset id="fx-rgb-b" in="gb" dx="0" dy="0" result="gbo"/>
        <feBlend in="ro" in2="gbo" mode="screen"/>
      </filter></defs>`;
    layer.appendChild(svg);
  }

  // enveloppe d'un événement : attaque très courte, décroissance exponentielle
  const env = (t, t0, d, att = 0.02) => (t < t0 - att || t > t0 + d * 4 ? 0 : t < t0 ? (t - (t0 - att)) / att : Math.exp(-(t - t0) / (d / 3)));

  function apply(t, events) {
    let flash = 0, flashCol = "255,250,240", punch = 0, sx = 0, sy = 0, whip = 0, whipX = 0, rgb = 0, vig = 0;
    let leak = null, sweep = null;
    for (const e of events) {
      const d = e.d;
      switch (e.type) {
        case "flash": {
          const v = env(t, e.t, d || 0.35) * (e.a ?? 1);
          if (v > flash) { flash = v; flashCol = e.color || flashCol; }
          break;
        }
        case "punch": {
          const u = (t - e.t) / (d || 0.45);
          if (u >= 0 && u <= 1) punch += (e.a ?? 0.035) * Math.sin(Math.PI * Math.min(1, u * 2.2)) * (1 - u) * 1.6;
          break;
        }
        case "shake": {
          const v = env(t, e.t, d || 0.35, 0.005) * (e.a ?? 6);
          sx += noise1(t * 38 + e.t) * v; sy += noise1(t * 41 + e.t * 3 + 7) * v;
          break;
        }
        case "whip": {
          const u = (t - e.t) / (d || 0.3);
          if (u >= 0 && u <= 1) { const s = Math.sin(Math.PI * u); whip = Math.max(whip, s); whipX += (e.dir || 1) * s * 40; }
          break;
        }
        case "rgb": rgb = Math.max(rgb, env(t, e.t, d || 0.25) * (e.a ?? 3)); break;
        case "vignette": {
          const u = (t - e.t) / (d || 0.6);
          if (u >= 0 && u <= 1.4) vig = Math.max(vig, (e.a ?? 0.35) * Math.sin(Math.PI * Math.min(1, u)));
          break;
        }
        case "leak": {
          const u = (t - e.t) / (d || 1.6);
          if (u >= 0 && u <= 1) leak = { e, u };
          break;
        }
        case "sweep": {
          const u = (t - e.t) / (d || 0.7);
          if (u >= 0 && u <= 1) sweep = { e, u };
          break;
        }
      }
    }
    // caméra globale : poussée + secousse + filé
    // léger zoom de compensation : un décalage (filé, secousse) ne doit jamais découvrir le bord de l'image
    const tx = sx + whipX;
    const cover = Math.max((Math.abs(tx) + whip * 38 * 2.5) * 2 / W, Math.abs(sy) * 2 / H) * 1.1;   // + traîne du flou du filé
    const s = 1 + punch + cover;
    stage.style.transformOrigin = "720px 540px";
    stage.style.transform = (s !== 1 || tx || sy)
      ? `translate(${tx.toFixed(2)}px,${sy.toFixed(2)}px) scale(${s.toFixed(4)})` : "none";
    const filters = [];
    if (whip > 0.02) {
      document.getElementById("fx-whip-b").setAttribute("stdDeviation", `${(whip * 38).toFixed(1)} 0`);
      filters.push("url(#fx-whip)");
    }
    if (rgb > 0.15) {
      document.getElementById("fx-rgb-r").setAttribute("dx", rgb.toFixed(2));
      document.getElementById("fx-rgb-b").setAttribute("dx", (-rgb).toFixed(2));
      filters.push("url(#fx-rgb)");
    }
    stage.style.filter = filters.length ? filters.join(" ") : "";
    // éclair
    flashEl.style.background = `rgb(${flashCol})`;
    flashEl.style.opacity = clamp(flash).toFixed(3);
    // vignette de tension
    vigEl.style.opacity = clamp(vig).toFixed(3);
    // halo chaud (fuite de lumière) qui traverse l'image
    if (leak) {
      const { e, u } = leak;
      const x = lerp(e.x0 ?? -20, e.x1 ?? 120, E.inOut(u)), y = e.y ?? 40;
      const a = (e.a ?? 0.5) * Math.sin(Math.PI * u);
      leakEl.style.background = `radial-gradient(ellipse 45% 60% at ${x}% ${y}%, rgba(${e.color || "255,170,90"},.9), rgba(${e.color || "255,170,90"},0) 70%)`;
      leakEl.style.opacity = a.toFixed(3);
    } else leakEl.style.opacity = "0";
    // reflet qui balaie une zone
    if (sweep) {
      const { e, u } = sweep;
      Object.assign(sweepEl.style, { left: e.x + "px", top: e.y + "px", width: e.w + "px", height: e.h + "px",
        borderRadius: (e.r || 0) + "px", opacity: ((e.a ?? 0.85) * Math.sin(Math.PI * Math.min(1, u * 1.2))).toFixed(3) });
      sweepEl.bar.style.left = lerp(-40, 110, E.inOut(u)).toFixed(1) + "%";
    } else sweepEl.style.opacity = "0";
  }

  window.VFX = { build, apply };
})();
