/* =====================================================================
   CAHIER — ACTIVITÉS : qui a dit ?, textes à trous, procédés, associations,
   duels, frise, carte des positions, graphiques, palais de mémoire, oral.
   Tout est générique : les données viennent des leçons (lecons/*.js).
   ===================================================================== */
(function () {
"use strict";
const A = window.CAHIER && window.CAHIER._; if (!A) return;
const { $, $$, esc, strip, norm, shuffle, pick, clamp, icon, authorOf, tabsHtml, S, save, tc, tchip, scope, needLecon, needScope, head, go, render, toast, onCleanup, setKey, main, VIEWS, runQuiz, matchGame } = A;
const TX = () => A.TX;
const bolds = html => (String(html).match(/<b>(.*?)<\/b>/g) || []).map(s => strip(s)).filter(s => s.length > 2);
const shake = el => { el.classList.remove("shake"); void el.offsetWidth; el.classList.add("shake"); };

/* ---------- glisser-déposer au doigt et à la souris (+ repli : toucher puis toucher, + clavier) ---------- */
function dragKit(root, { chipSel, zoneSel, onDrop }) {
  let selected = null;
  const clearOver = () => $$(zoneSel, root).forEach(z => z.classList.remove("over"));
  root.addEventListener("pointerdown", e => {
    const chip = e.target.closest(chipSel); if (!chip || chip.disabled || chip.classList.contains("ok") || e.button > 0) return;
    const r = chip.getBoundingClientRect(); const ox = e.clientX - r.left, oy = e.clientY - r.top; const sx = e.clientX, sy = e.clientY;
    let ghost = null, moved = false;
    const move = ev => {
      if (!moved && Math.hypot(ev.clientX - sx, ev.clientY - sy) < 6) return;
      if (!moved) { moved = true; ghost = chip.cloneNode(true); ghost.classList.add("drag-ghost"); ghost.style.width = r.width + "px"; document.body.appendChild(ghost); chip.classList.add("dragging"); }
      ev.preventDefault(); ghost.style.left = (ev.clientX - ox) + "px"; ghost.style.top = (ev.clientY - oy) + "px";
      clearOver(); const under = document.elementFromPoint(ev.clientX, ev.clientY); const z = under && under.closest(zoneSel); if (z && root.contains(z)) z.classList.add("over");
    };
    const up = ev => {
      window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); window.removeEventListener("pointercancel", up);
      clearOver(); chip.classList.remove("dragging");
      if (ghost) ghost.remove();
      if (!moved) { if (selected === chip) { chip.classList.remove("sel"); selected = null; } else { if (selected) selected.classList.remove("sel"); selected = chip; chip.classList.add("sel"); } return; }
      if (ev.type === "pointercancel") return;
      const under = document.elementFromPoint(ev.clientX, ev.clientY); const z = under && under.closest(zoneSel);
      if (z && root.contains(z)) { if (selected) { selected.classList.remove("sel"); selected = null; } onDrop(chip, z); }
    };
    window.addEventListener("pointermove", move, { passive: false }); window.addEventListener("pointerup", up); window.addEventListener("pointercancel", up);
  });
  root.addEventListener("click", e => {
    const z = e.target.closest(zoneSel); if (!z || !selected || e.target.closest(chipSel)) return;
    const c = selected; c.classList.remove("sel"); selected = null; onDrop(c, z);
  });
  root.addEventListener("keydown", e => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const chip = e.target.closest(chipSel); const z = e.target.closest(zoneSel);
    if (chip && !chip.classList.contains("ok")) { e.preventDefault(); if (selected) selected.classList.remove("sel"); selected = chip; chip.classList.add("sel"); toast("Carte choisie : choisis maintenant sa place"); }
    else if (z && selected) { e.preventDefault(); const c = selected; c.classList.remove("sel"); selected = null; onDrop(c, z); }
  });
}

/* =====================================================================
   QUI A DIT ?  (#qui-<chapitre>)
   ===================================================================== */
VIEWS.qui = r => {
  const L = needLecon(r, "qui"); if (!L) return;
  const withC = L.textes.filter(t => t.citations.length); const N = Math.min(8, withC.length);
  main.innerHTML = head(esc(L.titre), "Qui a dit ?", "Fais glisser chaque citation vers son auteur (ou touche la citation, puis l'auteur).") + `<div id="quiBox"></div>`;
  const box = $("#quiBox"); const st = { ok: 0, err: 0 };
  const upd = () => { $("#quiScore").textContent = `${st.ok}/${N} · ${st.err} erreur${st.err > 1 ? "s" : ""}`; if (st.ok === N) toast(st.err ? `Terminé avec ${st.err} erreur${st.err > 1 ? "s" : ""}` : "Parfait !"); };
  dragKit(box, { chipSel: ".dchip", zoneSel: ".zone", onDrop: (chip, z) => {
    if (chip.getAttribute("data-a") === z.getAttribute("data-a")) { chip.classList.add("ok"); chip.setAttribute("aria-disabled", "true"); chip.innerHTML += ` <span class="small muted">· ${esc(TX()[chip.getAttribute("data-id")].short)}</span>`; z.appendChild(chip); st.ok++; }
    else { st.err++; shake(chip); }
    upd();
  } });
  box.addEventListener("click", e => {
    if (e.target.closest("#quiNew")) round();
    if (e.target.closest("#quiSol")) $$(".dchip:not(.ok)", box).forEach(c => { const z = $(`.zone[data-a="${c.getAttribute("data-a")}"]`, box); c.classList.add("ok"); z.appendChild(c); });
  });
  function round() {
    st.ok = 0; st.err = 0;
    const items = shuffle(withC).slice(0, N).map(t => ({ id: t.id, a: authorOf(t), q: pick(t.citations)[0] }));
    const authors = Array.from(new Set(L.textes.map(authorOf)));
    box.innerHTML = `<div class="row" style="justify-content:space-between;margin-bottom:10px"><span class="chip num" id="quiScore">0/${N} · 0 erreur</span><span class="row"><button class="btn small" type="button" id="quiSol">Solution</button><button class="btn small primary" type="button" id="quiNew">${icon("play")} Nouvelle partie</button></span></div>
      <div class="stack" id="quiPool" style="gap:8px;margin-bottom:14px">${items.map(it => `<button type="button" class="dchip" data-a="${esc(it.a)}" data-id="${it.id}">${it.q}</button>`).join("")}</div>
      <div class="grid g3" id="quiZones">${authors.map(a => { const t = L.textes.find(x => authorOf(x) === a); return `<div class="zone" data-a="${esc(a)}" tabindex="0" style="${tc(t.id)}"><h4>${icon(t.icon)} ${esc(a)}</h4></div>`; }).join("")}</div>`;
  }
  round();
};

/* =====================================================================
   TEXTES À TROUS  (#trous-<portée>)
   ===================================================================== */
const gapHtml = s => String(s).split(/(\{[^}]+\})/).map(p => /^\{[^}]+\}$/.test(p) ? `<input class="gap" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Mot manquant" data-w="${esc(p.slice(1, -1))}" style="width:${Math.max(4, p.length)}ch">` : esc(p)).join("");
VIEWS.trous = r => {
  const sc = needScope(r, "trous"); if (!sc) return;
  const items = []; sc.lecons.forEach(l => l.trous.forEach(x => { if (sc.type !== "texte" || x[0] === sc.id) items.push({ t: x[0], s: x[1], l: l.id }); }));
  const opts = `<option value="tout">Tout le programme</option>` + A.LECONS.filter(l => l.trous.length).map(l => `<optgroup label="${esc(l.titre)}"><option value="${l.id}">Tout le chapitre</option>${l.textes.filter(t => l.trous.some(x => x[0] === t.id)).map(t => `<option value="${t.id}">${esc(t.short)}</option>`).join("")}</optgroup>`).join("");
  main.innerHTML = head("Citations clés · " + esc(sc.label), "Textes à trous", "Complète les mots manquants (accents et majuscules non exigés). Entrée pour vérifier une ligne.") +
    `<div class="row" style="margin-bottom:12px"><label class="small muted" for="trSel">Paquet :</label><select class="select" id="trSel">${opts}</select><button class="btn small" type="button" id="trAll">Tout vérifier</button></div>
    <div class="stack" id="trList">${items.length ? items.map((it, i) => `<div class="card" data-i="${i}" style="${tc(TX()[it.t] ? it.t : it.l)}"><div class="row" style="justify-content:space-between;margin-bottom:6px">${tchip(it.t, null, it.l)}<span class="row" style="gap:6px"><button class="btn small ghost" type="button" data-hint>Indice</button><button class="btn small ghost" type="button" data-sol>Solution</button><button class="btn small" type="button" data-check>Vérifier</button></span></div><p class="quote" style="font-style:normal;line-height:2">${gapHtml(it.s)}</p></div>`).join("") : `<p class="muted">Pas de texte à trous dans ce paquet.</p>`}</div>`;
  $("#trSel").value = sc.id; $("#trSel").addEventListener("change", e => go("trous-" + e.target.value));
  const check = card => { let good = 0; const gaps = $$(".gap", card); gaps.forEach(g => { const ok = norm(g.value) === norm(g.getAttribute("data-w")); g.classList.toggle("ok", ok); g.classList.toggle("ko", !ok && g.value.trim() !== ""); if (ok) good++; }); return [good, gaps.length]; };
  $("#trList").addEventListener("click", e => {
    const card = e.target.closest(".card"); if (!card) return;
    if (e.target.closest("[data-check]")) { const [g, n] = check(card); toast(`${g}/${n} mot${n > 1 ? "s" : ""} juste${g > 1 ? "s" : ""}`); }
    if (e.target.closest("[data-hint]")) $$(".gap", card).forEach(g => { if (norm(g.value) !== norm(g.getAttribute("data-w"))) g.placeholder = g.getAttribute("data-w").slice(0, 1) + "…"; });
    if (e.target.closest("[data-sol]")) $$(".gap", card).forEach(g => { g.value = g.getAttribute("data-w"); g.classList.add("ok"); g.classList.remove("ko"); });
  });
  $("#trList").addEventListener("keydown", e => { if (e.key === "Enter" && e.target.classList.contains("gap")) { e.preventDefault(); check(e.target.closest(".card")); const all = $$(".gap"); const nx = all[all.indexOf(e.target) + 1]; if (nx) nx.focus(); } });
  $("#trAll").addEventListener("click", () => { let g = 0, n = 0; $$("#trList .card").forEach(c => { const [a, b] = check(c); g += a; n += b; }); toast(`${g}/${n} mots justes`); });
};

/* =====================================================================
   TROUVE LE PROCÉDÉ  (#procedes-<portée>)
   ===================================================================== */
VIEWS.procedes = r => {
  const sc = needScope(r, "procedes"); if (!sc) return;
  const pool = []; sc.lecons.forEach(l => l.procedes.forEach(p => { if (sc.type !== "texte" || p[0] === sc.id) pool.push({ p, l: l.id }); }));
  main.innerHTML = head("Analyse · " + esc(sc.label), "Trouve le procédé", "Une phrase du corpus, une figure de style à reconnaître.") + `<div class="quiz" id="prBox"></div>`;
  const make = () => shuffle(pool).slice(0, 12).map(({ p, l }) => ({ id: "", l, t: p[0], lvl: "A", q: `Quel procédé dans ${p[1]} ?`, ok: p[2], choices: [p[2]].concat(p[3]), exp: p[4], sec: "extrait" }));
  const start = () => runQuiz($("#prBox"), { questions: make(), mode: "practice", title: "Trouve le procédé", again: start, factScope: sc });
  start();
};

/* =====================================================================
   ASSOCIATIONS  (#assoc-<chapitre>.<n° de partie>)
   ===================================================================== */
VIEWS.assoc = r => {
  const L = needLecon(r, "assoc"); if (!L) return;
  const i = clamp(parseInt(r.sec || "0", 10) || 0, 0, L.associations.length - 1); const a = L.associations[i];
  main.innerHTML = head(esc(L.titre), "Associations", "Relie chaque nom à ce qui lui correspond.") +
    (L.associations.length > 1 ? tabsHtml(L.associations.map((x, k) => [String(k), esc(x.titre)]), String(i)) : "") +
    `<div class="card" id="asBox"></div><div class="row" style="margin-top:12px"><button class="btn" type="button" id="asNew">${icon("play")} Nouvelle partie</button></div>`;
  $$("[data-tab2]").forEach(b => b.addEventListener("click", () => go("assoc-" + L.id + "." + b.getAttribute("data-tab2"))));
  matchGame($("#asBox"), shuffle(a.paires).slice(0, a.n || 8));
  $("#asNew").addEventListener("click", () => render());
};
VIEWS.assoc.modes = true;

/* =====================================================================
   DUELS  (#duels-<chapitre>)
   ===================================================================== */
VIEWS.duels = r => {
  const L = needLecon(r, "duels"); if (!L) return;
  main.innerHTML = head(esc(L.titre), "Duels", `${L.duels.length} confrontations entre deux textes. Lis les deux colonnes, puis réponds à la question.`) +
    L.duels.map((d, i) => `<section class="card" style="margin-bottom:14px"><p class="eyebrow">Duel ${i + 1}</p><h2 style="font-size:1.35rem;margin-bottom:10px">${esc(d.titre)}</h2>
      <div class="duel"><div class="dh" style="${tc(d.a)}">${tchip(d.a)}</div><div class="dh" style="${tc(d.b)}">${tchip(d.b)}</div>${d.lignes.map(l => `<div class="l">${l[0]}</div><div class="r">${l[1]}</div>`).join("")}</div>
      <p style="margin-top:10px"><b>Synthèse.</b> ${d.synthese}</p><div id="duelQ${i}"></div></section>`).join("");
  L.duels.forEach((d, i) => { if (d.q) runQuiz($("#duelQ" + i), { questions: [{ id: "", l: L.id, t: "all", lvl: "T", q: d.q[0], ok: d.q[1][0], choices: d.q[1], exp: d.q[2], sec: "" }], mode: "practice", compact: true, more: false, title: "Question du duel" }); });
};

/* =====================================================================
   FRISE : explorer + reconstituer  (#frise-<portée>[.exercice])
   ===================================================================== */
const SIECLES = ["", "Ier", "IIe", "IIIe", "IVe", "Ve", "VIe", "VIIe", "VIIIe", "IXe", "Xe", "XIe", "XIIe", "XIIIe", "XIVe", "XVe", "XVIe", "XVIIe", "XVIIIe", "XIXe", "XXe", "XXIe"];
VIEWS.frise = r => {
  const sc = needScope(r, "frise"); if (!sc) return;
  const mode = r.sec === "exercice" ? "exercice" : "explorer";
  const L = sc.type === "tout" ? null : sc.lecon;
  const texts = sc.type === "tout" ? A.T : L.textes;
  const events = []; const seen = {}; (L ? [L] : A.LECONS).forEach(l => l.frise.forEach(f => { const k = f[0] + "|" + f[1]; if (!seen[k]) { seen[k] = 1; events.push(f); } }));
  main.innerHTML = head("Chronologie · " + esc(L ? L.titre : "Tout le programme"), "Frise chronologique", esc((L && L.friseIntro) || "Les textes et les repères historiques, du plus ancien au plus récent.")) +
    `<div class="row" style="margin-bottom:12px"><label class="small muted" for="frSel">Frise :</label><select class="select" id="frSel">${A.scopeOptions(false)}</select></div>` +
    tabsHtml([["explorer", "Explorer la frise"], ["exercice", "Reconstituer la frise"]], mode) + `<div id="frBox"></div>`;
  $("#frSel").value = L ? L.id : "tout"; $("#frSel").addEventListener("change", e => go("frise-" + e.target.value + (mode === "exercice" ? ".exercice" : "")));
  $$("[data-tab2]").forEach(b => b.addEventListener("click", () => go("frise-" + (L ? L.id : "tout") + (b.getAttribute("data-tab2") === "exercice" ? ".exercice" : ""))));
  const box = $("#frBox");
  if (mode === "explorer") {
    const layers = Array.from(new Set(events.map(f => f[2])));
    const off = S.extra.friseOff || {};
    const draw = () => {
      const items = texts.map(t => ({ y: Math.floor(t.annee), t })).concat(events.filter(f => !off[f[2]]).map(f => ({ y: f[0], h: f }))).sort((a, b) => a.y - b.y || (a.t ? 1 : -1));
      let html = "", lastC = null, lastY = null;
      items.forEach(it => {
        const c = Math.floor((it.y - 1) / 100) + 1; if (c !== lastC) { html += `<div class="tl-cent">${SIECLES[c] || c + "e"} siècle</div>`; lastC = c; }
        else if (lastY !== null && it.y - lastY > 40) html += `<div class="tl-gap">… ${it.y - lastY} ans plus tard</div>`;
        lastY = it.y;
        if (it.t) html += `<div class="tl-item tl-text" style="${tc(it.t.id)}"><span class="tl-year">${it.y}</span><span class="tl-dot"></span><a class="tile" style="${tc(it.t.id)};flex-direction:row;align-items:center;gap:10px;padding:10px 12px 10px 14px" href="#t-${it.t.id}"><span class="ticon">${icon(it.t.icon)}</span><div style="min-width:0"><div class="tile-a">${esc(it.t.auteur)}</div><div class="tile-t">${esc(it.t.titre)}</div></div></a></div>`;
        else html += `<div class="tl-item"><span class="tl-year">${it.h[0]}</span><span class="tl-dot"></span><div class="tl-hist">${esc(it.h[1])}</div></div>`;
      });
      $("#tl").innerHTML = html;
    };
    box.innerHTML = (layers.length ? `<div class="row" style="margin-bottom:12px;gap:6px"><span class="small muted">Calques :</span>${layers.map(l => `<label class="chip" style="cursor:pointer"><input type="checkbox" data-layer="${esc(l)}" ${off[l] ? "" : "checked"}> ${esc(l)}</label>`).join("")}</div>` : "") + `<div class="tl" id="tl"></div>`;
    $$("[data-layer]", box).forEach(c => c.addEventListener("change", () => { off[c.getAttribute("data-layer")] = !c.checked; S.extra.friseOff = off; save("extra"); draw(); }));
    draw();
  } else {
    const order = (texts.length > 10 ? shuffle(texts).slice(0, 10) : texts.slice()).sort((a, b) => a.annee - b.annee).map(t => t.id);
    const yearOf = id => Math.floor(TX()[id].annee);
    const dateOf = id => String(TX()[id].date).split(" (")[0];
    box.innerHTML = `<p class="muted">Glisse chaque texte dans la bonne case (du plus ancien au plus récent), ou touche un texte puis une case.</p>
      <div class="row" id="frPool" style="gap:8px;margin:10px 0 14px">${shuffle(order).map(id => `<button type="button" class="dchip" data-id="${id}" style="${tc(id)}">${icon(TX()[id].icon)} ${esc(TX()[id].short)}</button>`).join("")}</div>
      <ol class="stack" id="frSlots" style="gap:8px;padding:0;list-style:none">${order.map((id, i) => `<li class="zone" data-slot="${i}" tabindex="0" style="flex-direction:row;align-items:center;min-height:54px"><b class="num" style="width:28px">${i + 1}.</b><div class="slotbody" style="flex:1"></div><span class="small muted num" data-date></span></li>`).join("")}</ol>
      <div class="row" style="margin-top:12px"><button class="btn primary" type="button" id="frCheck">Vérifier</button><button class="btn" type="button" id="frSol">Solution</button><button class="btn ghost" type="button" id="frReset">Recommencer</button></div>`;
    dragKit(box, { chipSel: ".dchip", zoneSel: ".zone", onDrop: (chip, z) => { const body = $(".slotbody", z); const prev = $(".dchip", body); if (prev && prev !== chip) $("#frPool").appendChild(prev); body.appendChild(chip); $$(".zone", box).forEach(x => x.classList.remove("okz", "koz")); } });
    $("#frCheck").addEventListener("click", () => { let good = 0; $$(".zone", box).forEach((z, i) => { const c = $(".dchip", z); const ok = !!c && yearOf(c.getAttribute("data-id")) === yearOf(order[i]); z.classList.toggle("okz", ok); z.classList.toggle("koz", !ok); $("[data-date]", z).textContent = c ? dateOf(c.getAttribute("data-id")) : ""; if (ok) good++; }); toast(`${good}/${order.length} bien placé${good > 1 ? "s" : ""}`); });
    $("#frSol").addEventListener("click", () => { $$(".zone", box).forEach((z, i) => { const c = $(`.dchip[data-id="${order[i]}"]`, box); $(".slotbody", z).appendChild(c); z.classList.add("okz"); z.classList.remove("koz"); $("[data-date]", z).textContent = dateOf(order[i]); }); });
    $("#frReset").addEventListener("click", () => render());
  }
};
VIEWS.frise.modes = true;

/* =====================================================================
   CARTE DES POSITIONS  (#carte-<chapitre>)
   ===================================================================== */
VIEWS.carte = r => {
  const L = needLecon(r, "carte"); if (!L) return;
  const KEY = "carte:" + L.id; const pos = S.extra[KEY] || {}; const N = L.textes.length;
  main.innerHTML = head(esc(L.titre), "Carte des positions", "Place d'abord chaque texte toi-même sur les deux axes (glisse les jetons, ou sélectionne-les au clavier et déplace-les avec les flèches), puis compare avec la position de référence : une interprétation argumentée, pas une vérité unique.") +
    `<div class="board" id="board"><svg class="boardlines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><line x1="50" y1="0" x2="50" y2="100"/><line x1="0" y1="50" x2="100" y2="50"/></svg>
      <span class="ax ax-l">${esc(L.carteAxes.x[0])}</span><span class="ax ax-r">${esc(L.carteAxes.x[1])} →</span><span class="ax ax-t">↑ ${esc(L.carteAxes.y[1])}</span><span class="ax ax-b">${esc(L.carteAxes.y[0])}</span><svg class="reflines" id="refLines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"></svg></div>
    <div class="tray" id="tray"></div>
    <div class="row" style="justify-content:center;margin-top:12px"><button class="btn primary" type="button" id="cmpBtn">Comparer avec la référence</button><button class="btn" type="button" id="cmpReset">Réinitialiser</button></div>
    <div id="cmpOut" style="margin-top:14px"></div>`;
  const board = $("#board"), tray = $("#tray");
  const place = (tok, x, y) => { tok.style.position = ""; tok.style.left = x + "%"; tok.style.top = y + "%"; if (tok.parentNode !== board) board.appendChild(tok); };
  const store = () => { S.extra[KEY] = pos; save("extra"); };
  L.textes.forEach(t => { const tk = document.createElement("button"); tk.type = "button"; tk.className = "token"; tk.setAttribute("data-id", t.id); tk.style.cssText = tc(t.id); tk.title = t.short; tk.setAttribute("aria-label", t.short); tk.innerHTML = icon(t.icon); if (pos[t.id]) place(tk, pos[t.id][0], pos[t.id][1]); else tray.appendChild(tk); });
  let drag = null;
  const onDown = e => { const tk = e.target.closest(".token"); if (!tk || e.button > 0) return; e.preventDefault(); drag = { tk, moved: false }; try { tk.setPointerCapture(e.pointerId); } catch (x) { } tk.classList.add("lift"); };
  const onMove = e => {
    if (!drag) return; drag.moved = true; const b = board.getBoundingClientRect();
    const inside = e.clientX >= b.left && e.clientX <= b.right && e.clientY >= b.top && e.clientY <= b.bottom; drag.inside = inside;
    if (inside) { drag.x = clamp((e.clientX - b.left) / b.width * 100, 3, 97); drag.y = clamp((e.clientY - b.top) / b.height * 100, 3, 97); place(drag.tk, drag.x, drag.y); }
    else { drag.tk.style.position = "fixed"; drag.tk.style.left = e.clientX + "px"; drag.tk.style.top = e.clientY + "px"; }
  };
  const onUp = () => {
    if (!drag) return; const { tk, inside, x, y, moved } = drag; drag = null; tk.classList.remove("lift"); tk.style.position = "";
    if (!moved) { tk.focus(); return; }
    const id = tk.getAttribute("data-id");
    if (inside) pos[id] = [Math.round(x * 10) / 10, Math.round(y * 10) / 10]; else { delete pos[id]; tk.style.left = ""; tk.style.top = ""; tray.appendChild(tk); }
    store();
  };
  const onKey = e => {
    const tk = e.target.closest && e.target.closest(".token"); if (!tk) return; const id = tk.getAttribute("data-id");
    if (tk.parentNode === tray) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pos[id] = [50, 50]; place(tk, 50, 50); store(); tk.focus(); toast("Jeton posé au centre : déplace-le avec les flèches"); } return; }
    const d = e.shiftKey ? 10 : 2; const p = pos[id] || [50, 50];
    const mv = { ArrowLeft: [-d, 0], ArrowRight: [d, 0], ArrowUp: [0, -d], ArrowDown: [0, d] }[e.key];
    if (mv) { e.preventDefault(); pos[id] = [clamp(p[0] + mv[0], 3, 97), clamp(p[1] + mv[1], 3, 97)]; place(tk, pos[id][0], pos[id][1]); store(); tk.focus(); }
    else if (e.key === "Delete" || e.key === "Backspace") { e.preventDefault(); delete pos[id]; tk.style.left = ""; tk.style.top = ""; tray.appendChild(tk); store(); tk.focus(); }
  };
  main.addEventListener("pointerdown", onDown); window.addEventListener("pointermove", onMove); window.addEventListener("pointerup", onUp); main.addEventListener("keydown", onKey);
  onCleanup(() => { main.removeEventListener("pointerdown", onDown); window.removeEventListener("pointermove", onMove); window.removeEventListener("pointerup", onUp); main.removeEventListener("keydown", onKey); });
  $("#cmpReset").addEventListener("click", () => { S.extra[KEY] = {}; save("extra"); render(); });
  $("#cmpBtn").addEventListener("click", () => {
    $$(".ref", board).forEach(x => x.remove()); let lines = "";
    const rows = L.textes.map(t => {
      const rx = t.carte.x * 10, ry = 100 - t.carte.y * 10; const ref = document.createElement("span"); ref.className = "ref"; ref.style.cssText = tc(t.id) + `;left:${rx}%;top:${ry}%`; ref.innerHTML = icon(t.icon); board.appendChild(ref);
      const p = pos[t.id]; let d = null; if (p) { d = Math.hypot(p[0] - rx, p[1] - ry) / 10; lines += `<line x1="${p[0]}" y1="${p[1]}" x2="${rx}" y2="${ry}" style="stroke:var(--c-${t.id})"/>`; }
      return { t, d };
    });
    $("#refLines").innerHTML = lines;
    rows.sort((a, b) => (b.d == null ? -1 : b.d) - (a.d == null ? -1 : a.d));
    const placed = rows.filter(x => x.d != null); const avg = placed.length ? placed.reduce((s, x) => s + x.d, 0) / placed.length : null;
    $("#cmpOut").innerHTML = `<div class="card"><p><b>${placed.length}/${N} textes placés.</b> ${avg != null ? `Écart moyen avec la référence : <b class="num">${avg.toFixed(1)}</b> (sur une échelle de 0 à 10). ` : ""}Les cercles en pointillé montrent la position de référence ; les traits relient ta position à la référence.</p>
      <div class="stack" style="gap:8px;margin-top:10px">${rows.map(x => `<div style="${tc(x.t.id)}"><div class="row" style="justify-content:space-between">${tchip(x.t.id)}<span class="small muted num">${x.d == null ? "non placé" : "écart " + x.d.toFixed(1)}</span></div><p class="small" style="margin:.3em 0 0">${x.t.carte.why || ""}</p></div>`).join("")}</div></div>`;
  });
};

/* =====================================================================
   GRAPHIQUES : radars (génériques) + schémas propres au chapitre
   (#graphiques-<chapitre>.<onglet>)
   ===================================================================== */
function radarSVG(L, ids, size, mini) {
  const ax = L.radarAxes, n = ax.length, pad = mini ? 18 : 78, c = size / 2, R = c - pad;
  const pt = (i, v) => { const a = -Math.PI / 2 + i * 2 * Math.PI / n; return [c + Math.cos(a) * R * v / 5, c + Math.sin(a) * R * v / 5]; };
  let g = "";
  for (let lv = 1; lv <= 5; lv++) g += `<polygon points="${ax.map((_, i) => pt(i, lv).join(",")).join(" ")}" class="rgrid"/>`;
  ax.forEach((a, i) => { const [x, y] = pt(i, 5); g += `<line x1="${c}" y1="${c}" x2="${x}" y2="${y}" class="rgrid"/>`; if (!mini) { const [lx, ly] = pt(i, 5.9); const anchor = Math.abs(lx - c) < 8 ? "middle" : lx > c ? "start" : "end"; g += `<text x="${lx}" y="${ly + 4}" text-anchor="${anchor}" class="rlab">${esc(a[1])}</text>`; } });
  if (!mini) for (let lv = 1; lv <= 5; lv++) { const [x, y] = pt(0, lv); g += `<text x="${x + 5}" y="${y + 4}" class="rtick">${lv}</text>`; }
  ids.forEach((id, k) => { const t = TX()[id]; const pts = ax.map((a, i) => pt(i, t.radar[a[0]] || 0)); g += `<polygon points="${pts.map(p => p.join(",")).join(" ")}" style="fill:var(--c-${id});fill-opacity:${mini ? 0.22 : 0.14};stroke:var(--c-${id});stroke-width:2;${k ? "stroke-dasharray:6 4" : ""}"/>`; if (!mini) pts.forEach(p => { g += `<circle cx="${p[0]}" cy="${p[1]}" r="3.5" style="fill:var(--c-${id})"/>`; }); });
  const ex = mini ? 0 : 92;
  return `<svg viewBox="${-ex} 0 ${size + 2 * ex} ${size}" role="img" aria-label="Radar ${esc(ids.map(id => TX()[id].short).join(" et "))}" style="width:100%;max-width:${size + 2 * ex}px;height:auto;display:block;margin:0 auto">${g}</svg>`;
}
function radarTable(L, ids) { return `<div class="tablewrap" style="margin-top:10px"><table style="min-width:0"><thead><tr><th>Axe</th>${ids.map(id => `<th>${esc(TX()[id].short)}</th>`).join("")}</tr></thead><tbody>${L.radarAxes.map(a => `<tr><td>${esc(a[1])}</td>${ids.map(id => `<td class="num">${TX()[id].radar[a[0]]} / 5</td>`).join("")}</tr>`).join("")}</tbody></table></div>`; }
A.radarBox = (box, L, ids) => { if (box) box.innerHTML = radarSVG(L, ids, 420, false) + radarTable(L, ids); };
VIEWS.graphiques = r => {
  const L = needLecon(r, "graphiques"); if (!L) return;
  const hasR = !!L.radarAxes && L.textes.every(t => t.radar);
  const tabs = (hasR ? [["radar", "Radars"]] : []).concat(L.schemas.map(s => [s.id, esc(s.titre)]));
  if (!tabs.length) { main.innerHTML = head(esc(L.titre), "Graphiques", "Pas de graphique pour ce chapitre."); return; }
  const cur = tabs.some(t => t[0] === r.sec) ? r.sec : tabs[0][0];
  main.innerHTML = head(esc(L.titre), "Graphiques", "Des schémas pour ancrer les idées. Ce sont des représentations interprétatives, pas des mesures.") + tabsHtml(tabs, cur) + `<div id="grBox"></div>`;
  $$("[data-tab2]").forEach(b => b.addEventListener("click", () => go("graphiques-" + L.id + "." + b.getAttribute("data-tab2"))));
  const box = $("#grBox");
  if (cur === "radar") {
    const KEY = "radar:" + L.id; const sel = S.extra[KEY] || [L.textes[0].id, (L.textes[1] || L.textes[0]).id];
    const opts = L.textes.map(t => `<option value="${t.id}">${esc(t.short)}</option>`).join("");
    box.innerHTML = `<div class="card"><div class="row" style="margin-bottom:8px"><label class="small muted" for="rA">Comparer</label><select class="select" id="rA">${opts}</select><label class="small muted" for="rB">avec</label><select class="select" id="rB"><option value="">(aucun)</option>${opts}</select></div>
      <div class="row" id="rLeg" style="gap:8px;margin-bottom:6px"></div><div id="rChart"></div><div id="rWhy"></div></div>
      <h2 class="section-title">Les ${L.textes.length} radars côte à côte</h2><p class="muted small">Axes (dans le sens des aiguilles d'une montre, à partir du haut) : ${L.radarAxes.map(a => esc(a[1])).join(" · ")}. Valeurs de 0 à 5.</p>
      <div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px">${L.textes.map(t => `<a class="card" style="${tc(t.id)};padding:10px;text-decoration:none;color:var(--ink)" href="#t-${t.id}.graphique">${radarSVG(L, [t.id], 160, true)}<div class="small" style="text-align:center;font-weight:700;margin-top:4px">${esc(t.short)}</div></a>`).join("")}</div>`;
    const drawR = () => { const ids = [$("#rA").value, $("#rB").value].filter((v, i, a) => v && a.indexOf(v) === i); S.extra[KEY] = ids; save("extra"); $("#rChart").innerHTML = radarSVG(L, ids, 440, false) + radarTable(L, ids); $("#rLeg").innerHTML = ids.map((id, k) => `<span class="chip"><svg width="26" height="10" aria-hidden="true"><line x1="1" y1="5" x2="25" y2="5" style="stroke:var(--c-${id});stroke-width:3;${k ? "stroke-dasharray:6 4" : ""}"/></svg>${icon(TX()[id].icon)} ${esc(TX()[id].short)}</span>`).join(""); $("#rWhy").innerHTML = ids.map(id => `<p class="small"><b>${esc(TX()[id].short)}.</b> ${TX()[id].radar.why || ""}</p>`).join(""); };
    $("#rA").value = sel[0] || L.textes[0].id; $("#rB").value = sel[1] || ""; $("#rA").addEventListener("change", drawR); $("#rB").addEventListener("change", drawR); drawR();
  } else {
    const s = L.schemas.find(x => x.id === cur);
    const api = { esc, icon, tchip, tc, tabsHtml, $, $$, S, save, onCleanup, go, toast };
    try { s.render(box, api); } catch (e) { box.innerHTML = `<p class="warnbox">Ce schéma n'a pas pu s'afficher.</p>`; if (window.console) console.error(e); }
  }
};
VIEWS.graphiques.modes = true;

/* =====================================================================
   PALAIS DE MÉMOIRE (une salle par texte, N salles)  (#palais-<chapitre>[.visite|.test])
   ===================================================================== */
const ROOM = { w: 224, h: 184, gap: 196, y0: 64 };
function wrap2(txt, max) { const w = String(txt).split(" "); const lines = [""]; w.forEach(x => { const cur = lines[lines.length - 1]; if ((cur + " " + x).trim().length > max && cur) lines.push(x); else lines[lines.length - 1] = (cur + " " + x).trim(); }); return lines.slice(0, 2); }
function planSVG(L) {
  const T = L.textes, N = T.length, half = Math.ceil(N / 2), H = ROOM.y0 + (half - 1) * ROOM.gap + ROOM.h + 18;
  const roomPos = k => { const left = k < half; const j = left ? k : N - 1 - k; return { x: left ? 18 : 358, y: ROOM.y0 + j * ROOM.gap }; };
  let g = `<defs><marker id="arrP" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--accent)"/></marker></defs>`;
  g += `<rect x="8" y="44" width="584" height="${H - 56}" rx="18" style="fill:var(--surface-2);stroke:var(--rule);stroke-width:2"/>`;
  g += `<rect x="252" y="44" width="96" height="${H - 56}" style="fill:var(--bg);stroke:none"/>`;
  g += `<text x="300" y="30" text-anchor="middle" class="ctitle">Entrée</text>`;
  g += `<path d="M300,48 L282,78 L282,${H - 50} Q300,${H - 20} 318,${H - 50} L318,78" style="fill:none;stroke:var(--accent);stroke-width:2.5;stroke-dasharray:7 7"/>`;
  for (let yy = 170; yy < H - 70; yy += 196) g += `<path d="M282,${yy} l-6,-9 M282,${yy} l6,-9" style="stroke:var(--accent);stroke-width:2.5;fill:none"/><path d="M318,${yy} l-6,9 M318,${yy} l6,9" style="stroke:var(--accent);stroke-width:2.5;fill:none"/>`;
  T.forEach((t, k) => {
    const { x, y } = roomPos(k); const doorX = k < half ? x + ROOM.w : x; const cy = y + ROOM.h / 2;
    g += `<g class="room" data-k="${k}" tabindex="0" role="button" aria-label="Salle ${k + 1} : ${esc(t.palais.salle)}, ${esc(t.auteur)}">
      <rect class="box" x="${x}" y="${y}" width="${ROOM.w}" height="${ROOM.h}" rx="12" style="fill:var(--c-${t.id});fill-opacity:.13;stroke:var(--c-${t.id});stroke-width:2"/>
      <rect x="${doorX - 5}" y="${cy - 22}" width="10" height="44" rx="3" style="fill:var(--bg);stroke:var(--c-${t.id});stroke-width:1.5"/>
      <circle cx="${x + 24}" cy="${y + 24}" r="15" style="fill:var(--c-${t.id})"/><text x="${x + 24}" y="${y + 30}" text-anchor="middle" class="rnum">${k + 1}</text>
      <g class="ico" style="color:var(--c-${t.id})"><use href="#i-${t.icon}" x="${x + ROOM.w - 76}" y="${y + 12}" width="62" height="62"/></g>
      ${wrap2(t.palais.court || t.palais.salle, 17).map((ln, i, arr) => `<text x="${x + 14}" y="${y + ROOM.h - (arr.length > 1 ? 80 : 58) + i * 22}" class="rname">${esc(ln)}</text>`).join("")}
      <text x="${x + 14}" y="${y + ROOM.h - 38}" class="rauth">${esc(t.auteur)}</text>
      <text x="${x + 14}" y="${y + ROOM.h - 16}" class="rdate">${esc((String(t.date).match(/\d{4}/) || [""])[0])}</text></g>`;
  });
  return `<svg viewBox="0 0 600 ${H}" role="group" aria-label="Plan du palais : ${N} salles dans l'ordre chronologique">${g}</svg>`;
}
VIEWS.palais = r => {
  const L = needLecon(r, "palais"); if (!L) return;
  const T = L.textes, N = T.length; const mode = ["visite", "test"].includes(r.sec) ? r.sec : "explorer";
  const P = L.palais || {};
  main.innerHTML = head("Mémoire spatiale · " + esc(L.titre), P.nom ? `Le palais « ${esc(P.nom)} »` : "Palais de mémoire", esc(P.intro || `Un bâtiment de ${N} salles, une par texte, dans l'ordre chronologique : on entre en haut à gauche, on descend, puis on remonte à droite. Chaque salle cache un objet-symbole. Visualise-le vraiment : c'est ce qui fixe le souvenir.`)) +
    tabsHtml([["explorer", "Explorer"], ["visite", "Visite guidée"], ["test", "Test"]], mode) + `<div class="palais"><div class="plan card" id="plan" style="padding:10px"></div><div class="card panel" id="ppanel"></div></div>`;
  $$("[data-tab2]").forEach(b => b.addEventListener("click", () => go("palais-" + L.id + (b.getAttribute("data-tab2") === "explorer" ? "" : "." + b.getAttribute("data-tab2")))));
  $("#plan").innerHTML = planSVG(L);
  const panel = $("#ppanel"); let cur = 0;
  const hl = k => $$(".room").forEach(g => g.classList.toggle("cur", +g.getAttribute("data-k") === k));
  const roomCard = (k, nav) => { const t = T[k]; return `<div style="${tc(t.id)}"><p class="eyebrow">Salle ${k + 1} / ${N} · ${esc(t.palais.salle)}</p><div class="row" style="gap:12px;align-items:center;margin:6px 0 10px"><span class="fh-icon" style="width:48px;height:48px;border-radius:13px">${icon(t.icon)}</span><div><b>Objet :</b> ${esc(t.palais.objet)}</div></div>
    <p class="hand" style="font-size:1.35rem">${esc(t.palais.image)}</p><div class="row" style="margin:8px 0">${tchip(t.id, t.auteur + " · " + t.date)}</div><p class="small">${t.essentiel[1] || t.essentiel[0] || ""}</p>
    ${nav ? `<div class="row" style="justify-content:space-between;margin-top:10px"><button class="btn small" type="button" data-pv ${k === 0 ? "disabled" : ""}>${icon("left")} Salle précédente</button><button class="btn small primary" type="button" data-nx>${k === N - 1 ? "Passer au test" : "Salle suivante"} ${icon("right")}</button></div>` : ""}</div>`; };
  if (mode === "explorer") {
    panel.innerHTML = `<p class="eyebrow">Mode d'emploi</p><p>Touche une salle du plan pour y entrer. Puis passe à la <b>visite guidée</b> (dans l'ordre), et enfin au <b>test</b>.</p>`;
    const open = k => { cur = k; hl(k); panel.innerHTML = roomCard(k, false); if (window.innerWidth < 1100) panel.scrollIntoView({ behavior: "smooth", block: "start" }); };
    $("#plan").addEventListener("click", e => { const g = e.target.closest(".room"); if (g) open(+g.getAttribute("data-k")); });
    $("#plan").addEventListener("keydown", e => { const g = e.target.closest(".room"); if (g && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); open(+g.getAttribute("data-k")); } });
  } else if (mode === "visite") {
    const show = k => { cur = clamp(k, 0, N - 1); hl(cur); panel.innerHTML = roomCard(cur, true); };
    panel.addEventListener("click", e => { if (e.target.closest("[data-pv]")) show(cur - 1); if (e.target.closest("[data-nx]")) { if (cur === N - 1) { toast("Visite terminée : passe au test !"); go("palais-" + L.id + ".test"); } else show(cur + 1); } });
    $("#plan").addEventListener("click", e => { const g = e.target.closest(".room"); if (g) show(+g.getAttribute("data-k")); });
    setKey(e => { if (e.key === "ArrowRight") { if (cur < N - 1) show(cur + 1); return true; } if (e.key === "ArrowLeft") { show(cur - 1); return true; } return false; });
    show(0);
  } else {
    let score = 0, n = 0, q = null;
    const choices = (o, lab) => `<div class="choices" style="margin-top:10px">${o.map(i => `<button class="choice" type="button" data-a="${i}"><span>${esc(lab(i))}</span></button>`).join("")}</div>`;
    const newQ = () => {
      hl(-1); const k = Math.floor(Math.random() * N); const t = T[k]; const type = pick(["salle", "objet", "auteur"]); q = { k, type };
      const opts = f => shuffle([k].concat(shuffle(T.map((_, i) => i).filter(i => i !== k && f(i))).slice(0, 3)));
      const top = `<p class="eyebrow">Question ${n + 1} · score ${score}/${n}</p>`;
      if (type === "salle") panel.innerHTML = top + `<p style="font-size:1.1rem"><b>Dans quelle salle trouve-t-on cet objet ?</b></p><p class="hand" style="font-size:1.35rem">${esc(t.palais.objet)}</p><p class="small muted">Touche la bonne salle sur le plan.</p>`;
      else if (type === "objet") { hl(k); const o = opts(i => T[i].palais.objet !== t.palais.objet); panel.innerHTML = top + `<p style="font-size:1.1rem"><b>Quel objet se trouve dans la salle surlignée (salle ${k + 1}) ?</b></p>` + choices(o, i => T[i].palais.objet); }
      else { const o = opts(i => authorOf(T[i]) !== authorOf(t)); panel.innerHTML = top + `<p style="font-size:1.1rem"><b>Quel auteur associes-tu à cet objet ?</b></p><p class="hand" style="font-size:1.35rem">${esc(t.palais.objet)}</p>` + choices(o, i => T[i].auteur); }
    };
    const answer = k => {
      if (!q || q.done) return; q.done = true; n++; const ok = k === q.k; if (ok) score++; hl(q.k); const t = T[q.k];
      $$(".choice[data-a]", panel).forEach(b => { b.disabled = true; if (+b.getAttribute("data-a") === q.k) b.classList.add("right"); else if (+b.getAttribute("data-a") === k) b.classList.add("wrong"); });
      panel.insertAdjacentHTML("beforeend", `<div class="feedback ${ok ? "ok" : "ko"}"><b class="v">${ok ? "Bien vu !" : "Raté."}</b> Salle ${q.k + 1}, ${esc(t.palais.salle)} : ${esc(t.palais.objet)} → ${tchip(t.id)}<div class="row" style="margin-top:10px"><button class="btn small primary" type="button" id="pNext">Question suivante ${icon("right")}</button></div></div>`);
      $("#pNext").addEventListener("click", newQ);
    };
    $("#plan").addEventListener("click", e => { const g = e.target.closest(".room"); if (g && q && q.type === "salle") answer(+g.getAttribute("data-k")); });
    panel.addEventListener("click", e => { const b = e.target.closest(".choice[data-a]"); if (b) answer(+b.getAttribute("data-a")); });
    setKey(e => { if (e.key === "Enter") { const b = $("#pNext"); if (b) { b.click(); return true; } } return false; });
    newQ();
  }
};
VIEWS.palais.modes = true;

/* =====================================================================
   MODE ORAL  (#oral-<portée>)
   ===================================================================== */
function htmlItems(html, sel) { return $$(sel, Object.assign(document.createElement("div"), { innerHTML: html || "" })).map(x => x.textContent.trim()).filter(Boolean); }
function oralPrompts(sc) {
  const out = [];
  sc.texts.forEach(t => {
    const L = A.LX[t.lecon]; const base = t.sameAuthorAs ? TX()[t.sameAuthorAs] : t;
    const liA = htmlItems(base.auteurHtml, "li"); const pA = liA.length ? liA : htmlItems(base.auteurHtml, "p");
    out.push({ type: "auteur", t: t.id, prompt: `Présente ${t.auteur} : vie, époque, œuvres, engagements.`, points: [strip(t.essentiel[0] || "")].concat(pA.slice(0, 4)).filter(Boolean), kw: [authorOf(t)].concat(bolds(t.essentiel[0]), String(t.auteurDates).match(/\d{4}/g) || []) });
    if (t.extrait) out.push({ type: "extrait", t: t.id, prompt: `Résume l'extrait de ${t.short} (${strip(t.oeuvre)}) et cite deux procédés.`, points: (t.extrait.mouvements || []).map(strip).concat((t.extrait.procedes || []).slice(0, 3).map(p => p[0] + " : " + strip(p[1]))), kw: (t.extrait.procedes || []).map(p => p[0]).concat(bolds(t.extrait.resume)) });
    if (t.problematique) { const li = htmlItems(t.problematique, "li"); out.push({ type: "problematique", t: t.id, prompt: `« ${L.problematique || L.titre} » Que répond ${t.short} ? Justifie avec le texte.`, points: htmlItems(t.problematique, "p").concat(li), kw: bolds(t.problematique) }); }
  });
  sc.lecons.forEach(l => l.duels.forEach(d => { if (sc.type === "texte" && d.a !== sc.id && d.b !== sc.id) return; out.push({ type: "comparer", t: d.a, t2: d.b, prompt: `Compare ${TX()[d.a].short} et ${TX()[d.b].short} : « ${d.titre} ».`, points: d.lignes.map(x => strip(x[0]) + " / " + strip(x[1])).concat([strip(d.synthese)]), kw: [authorOf(TX()[d.a]), authorOf(TX()[d.b])].concat(bolds(d.synthese)) }); }));
  return out;
}
VIEWS.oral = r => {
  const sc = needScope(r, "oral"); if (!sc) return;
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const P = oralPrompts(sc); let dur = S.extra.oralDur || 60, type = "tout", cur = null, timer = null, end = 0, rec = null, transcript = "";
  main.innerHTML = head("À voix haute · " + esc(sc.label), "Mode oral", "Tire une question, parle pendant 1 ou 2 minutes, puis coche les points que tu as cités. Parler à voix haute force le rappel actif.") +
    `<div class="card stack"><div class="row"><label class="small muted" for="orSc">Sur :</label><select class="select" id="orSc">${A.scopeOptions(true)}</select></div>
      <div class="row"><label class="small muted" for="orType">Type :</label><select class="select" id="orType"><option value="tout">Au hasard</option><option value="auteur">Présenter un auteur</option><option value="extrait">Résumer un extrait</option><option value="problematique">Répondre à la problématique</option>${P.some(p => p.type === "comparer") ? `<option value="comparer">Comparer deux textes</option>` : ""}</select>
      <label class="small muted" for="orDur">Durée :</label><select class="select" id="orDur"><option value="60">1 minute</option><option value="120">2 minutes</option></select><button class="btn primary" type="button" id="orDraw">${icon("play")} Tirer une question</button></div>
      <p class="small muted" id="orMic">${SR ? "Reconnaissance vocale disponible : active-la pendant l'oral pour repérer tes mots-clés (Chrome ou Edge ; le micro doit être autorisé). Rien n'est enregistré par le cahier." : "Reconnaissance vocale indisponible dans ce navigateur : tu coches toi-même les points cités."}</p></div>
    <div id="orBox" style="margin-top:14px"></div>`;
  $("#orSc").value = sc.id; $("#orSc").addEventListener("change", e => go("oral-" + e.target.value));
  $("#orDur").value = String(dur);
  $("#orType").addEventListener("change", e => { type = e.target.value; });
  $("#orDur").addEventListener("change", e => { dur = +e.target.value; S.extra.oralDur = dur; save("extra"); });
  const stopAll = () => { clearInterval(timer); timer = null; if (rec) { try { rec.onend = null; rec.stop(); } catch (e) { } rec = null; } };
  onCleanup(stopAll);
  const kwHtml = () => cur.kw.filter((v, i, a) => v && a.indexOf(v) === i).map(k => { const hit = transcript && norm(k).split(/\s+/).filter(w => w.length > 2).every(w => norm(transcript).includes(w)); return `<span class="kw ${hit ? "hit" : ""}">${esc(k)}</span>`; }).join("");
  const fmtT = ms => `${Math.floor(ms / 60000)}:${String(Math.floor(ms / 1000) % 60).padStart(2, "0")}`;
  const draw = () => {
    stopAll(); transcript = "";
    const pool = P.filter(p => type === "tout" || p.type === type); if (!pool.length) { $("#orBox").innerHTML = `<p class="muted">Aucune question de ce type ici.</p>`; return; } cur = pick(pool);
    const lab = { auteur: "Présenter un auteur", extrait: "Résumer un extrait", problematique: "Problématique", comparer: "Comparer deux textes" }[cur.type];
    $("#orBox").innerHTML = `<div class="card" style="${tc(cur.t)}"><div class="row" style="gap:6px">${tchip(cur.t)}${cur.t2 ? tchip(cur.t2) : ""}<span class="chip">${lab}</span></div>
      <p class="qtext">${esc(cur.prompt)}</p><div class="row" style="align-items:center;gap:16px"><span class="bigtimer" id="orT">${fmtT(dur * 1000)}</span><button class="btn primary" type="button" id="orGo">${icon("timer")} Lancer le chrono</button>${SR ? `<button class="btn" type="button" id="orRec">${icon("mic")} Activer le micro</button>` : ""}<button class="btn" type="button" id="orDone">J'ai fini</button></div>
      <div id="orLive" class="small muted" style="margin-top:8px"></div><div id="orEval"></div></div>`;
    $("#orGo").addEventListener("click", () => { if (timer) return; end = Date.now() + dur * 1000; timer = setInterval(() => { const left = Math.max(0, end - Date.now()); $("#orT").textContent = fmtT(left); if (left <= 0) { toast("Temps écoulé !"); finish(); } }, 250); });
    $("#orDone").addEventListener("click", finish);
    const rb = $("#orRec"); if (rb) rb.addEventListener("click", () => {
      if (rec) { try { rec.onend = null; rec.stop(); } catch (e) { } rec = null; rb.innerHTML = `${icon("mic")} Activer le micro`; return; }
      try {
        rec = new SR(); rec.lang = "fr-FR"; rec.continuous = true; rec.interimResults = true;
        rec.onresult = ev => { let txt = ""; for (let i = 0; i < ev.results.length; i++) txt += ev.results[i][0].transcript + " "; transcript = txt; $("#orLive").innerHTML = `<b>Transcription :</b> ${esc(txt)}<div style="margin-top:6px">${kwHtml()}</div>`; };
        rec.onerror = ev => { $("#orLive").textContent = ev.error === "not-allowed" || ev.error === "service-not-allowed" ? "Micro refusé ou indisponible : continue sans, en cochant toi-même les points." : "Reconnaissance vocale interrompue."; };
        rec.onend = () => { if (rec && timer) { try { rec.start(); } catch (e) { } } };
        rec.start(); rb.innerHTML = `${icon("mic")} Couper le micro`; $("#orLive").textContent = "J'écoute…";
      } catch (e) { $("#orLive").textContent = "Impossible de démarrer la reconnaissance vocale ici."; rec = null; }
    });
  };
  const finish = () => {
    if (!cur) return; stopAll();
    $("#orEval").innerHTML = `<h4 style="margin:14px 0 6px">Points attendus : coche ceux que tu as dits</h4><div class="stack" style="gap:6px">${cur.points.map((p, i) => `<label class="annot" style="grid-template-columns:auto 1fr;align-items:start"><input type="checkbox" data-pt="${i}" style="margin-top:4px"><span>${esc(p)}</span></label>`).join("")}</div>
      <h4 style="margin:12px 0 6px">Mots-clés ${transcript ? "(en vert : repérés dans ta transcription)" : "à placer"}</h4><div>${kwHtml()}</div><div class="row" style="margin-top:12px;justify-content:space-between"><span class="chip num" id="orScore">0/${cur.points.length}</span><button class="btn primary" type="button" id="orNext">${icon("play")} Question suivante</button></div>`;
    $("#orEval").addEventListener("change", () => { $("#orScore").textContent = `${$$("[data-pt]:checked").length}/${cur.points.length}`; });
    $("#orNext").addEventListener("click", draw);
  };
  $("#orDraw").addEventListener("click", draw);
};

})();
