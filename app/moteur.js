/* =====================================================================
   CAHIER — MOTEUR (aucun contenu de cours ici)
   Le contenu est dans lecons/*.js : un fichier par chapitre, qui appelle
   CAHIER.lecon({...}). Voir lecons/_modele.js et CLAUDE.md.
   Ordre de chargement : config.js → app/moteur.js → app/activites.js
   → lecons/*.js → app/demarrage.js
   ===================================================================== */
(function () {
"use strict";

const CFG = window.CAHIER_CONFIG || {};
const REG = [];
const CAHIER = window.CAHIER = { lecon(l) { REG.push(l); }, config: CFG };

/* ---------- utilitaires ---------- */
const $ = (s, r) => (r || document).querySelector(s);
const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const strip = s => String(s == null ? "" : s).replace(/<[^>]+>/g, "");
const norm = s => strip(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[’']/g, "'").replace(/œ/g, "oe").replace(/æ/g, "ae").trim();
const PARAMS = new URLSearchParams(location.search);
let rnd = Math.random;
(function () { const s = parseInt(PARAMS.get("seed") || "", 10); if (isNaN(s)) return; let a = s >>> 0; rnd = () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; })();
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const pick = a => a[Math.floor(rnd() * a.length)];
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const hash = s => { let h = 5381; for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0; return (h >>> 0).toString(36); };
const icon = (n, cls) => `<svg class="icon ${cls || ""}" aria-hidden="true"><use href="#i-${n}"/></svg>`;
const wSample = (items, k, wf) => items.map(x => ({ x, key: Math.pow(rnd(), 1 / Math.max(0.001, wf(x))) })).sort((a, b) => b.key - a.key).slice(0, k).map(o => o.x);
const plural = (n, s, p) => n + " " + (n > 1 ? (p || s + "s") : s);
const year = t => (String(t.date).match(/\d{4}/) || [""])[0];
const authorOf = t => t.auteurCourt || String(t.auteur).split(" ").pop();
const tabsHtml = (items, cur) => `<div class="tabs" role="tablist">${items.map(([k, l]) => `<button type="button" role="tab" data-tab2="${esc(k)}" aria-selected="${k === cur}">${l}</button>`).join("")}</div>`;

/* ---------- données dérivées (calculées au démarrage) ---------- */
let LECONS = [], LX = {}, T = [], TX = {}, QS = [], CARDS = [];
const PALETTE = [["#6c2d0a", "#faccb7"], ["#289f9f", "#46efd4"], ["#095717", "#77b154"], ["#4d6777", "#95afc2"], ["#ba0426", "#fc444d"], ["#dc631e", "#fd9320"],
  ["#253496", "#5b8bff"], ["#9a49e0", "#c35cec"], ["#857d0b", "#e3d612"], ["#df4b9d", "#f38abe"], ["#0f6b5c", "#5fe0c8"], ["#8a3b12", "#ffb38a"]];
function prepare() {
  const sorted = REG.slice().sort((a, b) => (a.ordre || 0) - (b.ordre || 0));
  let light = "", dark = "", k = 0;
  sorted.forEach(l => {
    /* une leçon mal formée est ignorée (avec un message dans la console) au lieu de casser tout le cahier */
    try {
      if (!l || !/^[a-z0-9_]+$/.test(l.id || "") || LX[l.id]) throw new Error("identifiant de leçon absent, invalide ou en double : " + (l && l.id));
      ["textes", "questions", "flashcards", "pieges", "frise", "duels", "procedes", "trous", "associations", "exercices", "schemas", "sources"].forEach(key => { if (!Array.isArray(l[key])) l[key] = []; });
      l.libelles = l.libelles || {};
      const ids = {};
      l.textes.forEach(t => { if (!/^[a-z0-9_]+$/.test(t.id || "") || TX[t.id] || LX[t.id] || ids[t.id] || t.id === l.id || t.id === "tout" || t.id === "all") throw new Error("identifiant de texte invalide ou en double : " + t.id); ids[t.id] = 1; });
      const qs = l.questions.map(a => ({ id: "q" + hash(l.id + "|" + a[0] + "|" + a[2]), l: l.id, t: a[0], lvl: a[1], q: a[2], ok: a[3][0], choices: a[3], exp: a[4], sec: a[5] }));
      const cs = l.flashcards.map(a => ({ id: "c" + hash(l.id + "|" + a[0] + "|" + a[1]), l: l.id, t: a[0], f: a[1], b: a[2] }));
      LX[l.id] = l; LECONS.push(l); QS.push(...qs); CARDS.push(...cs);
      const lc = l.couleur || ["#4a2fa8", "#c4b2ff"]; light += `--c-${l.id}:${lc[0]};`; dark += `--c-${l.id}:${lc[1]};`;
      l.textes.forEach(t => {
        t.lecon = l.id; T.push(t); TX[t.id] = t;
        ["essentiel", "anecdotes", "citations", "annotations", "pieges", "photos", "videos"].forEach(key => { if (!Array.isArray(t[key])) t[key] = []; });
        const c = t.couleur || PALETTE[k % PALETTE.length]; k++;
        light += `--c-${t.id}:${c[0]};`; dark += `--c-${t.id}:${c[1]};`;
      });
      if (l.icones) Object.keys(l.icones).forEach(n => { const defs = $("#sprite defs"); if (defs && !document.getElementById("i-" + n)) defs.insertAdjacentHTML("beforeend", `<symbol id="i-${n}" viewBox="0 0 24 24">${l.icones[n]}</symbol>`); });
    } catch (e) { if (window.console) console.error("Leçon ignorée (" + (l && l.id) + ") :", e); }
  });
  const st = document.createElement("style"); st.id = "couleurs";
  st.textContent = `:root{${light}}@media (prefers-color-scheme: dark){:root:not([data-theme="light"]){${dark}}}:root[data-theme="dark"]{${dark}}`;
  document.head.appendChild(st);
}
const lessonOf = id => LX[id] || (TX[id] && LX[TX[id].lecon]) || null;
const tc = id => `--tc:var(--c-${id})`;
function tchip(id, label, lid) {
  const t = TX[id];
  if (t) return `<a class="tchip" style="${tc(id)}" href="#t-${id}">${icon(t.icon)}${esc(label || t.short)}</a>`;
  const l = LX[lid] || LX[id];
  if (l) return `<a class="tchip" style="${tc(l.id)}" href="#l-${l.id}">${icon(l.icon || "book")}${esc(label || "Tout le chapitre")}</a>`;
  return `<span class="chip">${esc(label || "Tout le programme")}</span>`;
}
const LVL = { F: "Fait", C: "Compréhension", A: "Analyse", T: "Transversal" };

/* ---------- portée : tout le programme, un chapitre ou un texte ---------- */
function scope(arg) {
  if (!arg || arg === "tout") return { type: "tout", id: "tout", label: "Tout le programme", texts: T, lecons: LECONS };
  if (LX[arg]) return { type: "lecon", id: arg, lecon: LX[arg], label: LX[arg].titre, texts: LX[arg].textes, lecons: [LX[arg]] };
  if (TX[arg]) { const l = LX[TX[arg].lecon]; return { type: "texte", id: arg, lecon: l, label: TX[arg].short, texts: [TX[arg]], lecons: [l] }; }
  return null;
}
const inScope = (sc, it) => sc.type === "tout" || (sc.type === "lecon" ? it.l === sc.id : it.t === sc.id);
function scopeOptions(withTexts, withAll) {
  let h = withAll === false ? "" : `<option value="tout">Tout le programme</option>`;
  LECONS.forEach(l => { h += `<optgroup label="${esc(l.titre)}"><option value="${l.id}">Tout le chapitre</option>${withTexts ? l.textes.map(t => `<option value="${t.id}">${esc(t.short)}</option>`).join("") : ""}</optgroup>`; });
  return h;
}

/* ---------- stockage local (facultatif, protégé) ---------- */
const NS = (CFG.stockage || "cahier") + ":";
const LS = {
  get(k, d) { try { const v = localStorage.getItem(NS + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(NS + k, JSON.stringify(v)); } catch (e) { /* stockage indisponible : l'appli marche quand même */ } }
};
const S = { leit: LS.get("leit", {}), qs: LS.get("qs", {}), exp: LS.get("exp", {}), set: LS.get("set", {}), sims: LS.get("sims", []), extra: LS.get("extra", {}) };
const save = k => LS.set(k, S[k]);
const curLecon = () => LX[S.set.lecon] || LECONS[0] || null;
const curId = () => (curLecon() || { id: "tout" }).id;

/* ---------- progression ---------- */
function cardMastery(f) { const cs = CARDS.filter(f); if (!cs.length) return 0; return cs.reduce((s, c) => s + (((S.leit[c.id] || {}).b || 1) - 1) / 4, 0) / cs.length; }
function qcmScore(f) { const qs = QS.filter(f); if (!qs.length) return 0; return qs.filter(q => (S.qs[q.id] || {}).last === 1).length / qs.length; }
function textProgress(tid) { return Math.round(50 * cardMastery(c => c.t === tid) + 50 * qcmScore(q => q.t === tid)); }
function lessonProgress(lid) { return Math.round(50 * cardMastery(c => c.l === lid) + 50 * qcmScore(q => q.l === lid)); }
function qWeight(q) {
  const st = S.qs[q.id]; const tw = TX[q.t] ? 1 - textProgress(q.t) / 100 : 0.5;
  let w = 1 + tw * 2;
  if (!st) w += 1.5; else { if (st.last === 0) w += 3; w += Math.max(0, st.n - st.c) * 0.5; if (st.last === 1 && st.c >= 2) w *= 0.6; }
  return w;
}
function recordAnswer(q, ok) { if (!q.id) return; const st = S.qs[q.id] || { n: 0, c: 0 }; st.n++; if (ok) st.c++; st.last = ok ? 1 : 0; st.at = Date.now(); S.qs[q.id] = st; save("qs"); }

/* ---------- Leitner (5 boîtes) ---------- */
const INTERVALS = [0, 0, 10, 60, 360, 1440]; // minutes selon la boîte (1 à 5)
function gradeCard(c, ok) { const st = S.leit[c.id] || { b: 1 }; st.b = ok ? Math.min(5, (st.b || 1) + 1) : 1; st.due = Date.now() + INTERVALS[st.b] * 60000; st.n = (st.n || 0) + 1; S.leit[c.id] = st; save("leit"); }
const isDue = c => { const st = S.leit[c.id]; return !st || (st.due || 0) <= Date.now(); };
function boxCounts(cards) { const n = [0, 0, 0, 0, 0, 0]; cards.forEach(c => { const st = S.leit[c.id]; n[st ? st.b : 0]++; }); return n; }

/* ---------- thème et taille du texte ---------- */
const root = document.documentElement;
const hostTheme = root.getAttribute("data-theme");
function applyTheme() {
  const forced = PARAMS.get("theme"); const t = forced === "light" || forced === "dark" ? forced : (S.set.theme || "auto");
  if (t === "auto") { if (hostTheme) root.setAttribute("data-theme", hostTheme); else root.removeAttribute("data-theme"); } else root.setAttribute("data-theme", t);
  root.setAttribute("data-taille", S.set.taille || "m");
}
$("#themeBtn").addEventListener("click", () => { const order = ["auto", "light", "dark"]; const cur = S.set.theme || "auto"; S.set.theme = order[(order.indexOf(cur) + 1) % 3]; save("set"); applyTheme(); toast("Thème : " + { auto: "automatique", light: "cahier (clair)", dark: "tableau noir (sombre)" }[S.set.theme]); });

/* ---------- toast ---------- */
let toastT;
function toast(msg) { let el = $("#toast"); if (!el) { el = document.createElement("div"); el.id = "toast"; el.className = "toast"; el.setAttribute("role", "status"); document.body.appendChild(el); } el.textContent = msg; el.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => { el.hidden = true; }, 2200); }

/* =====================================================================
   NAVIGATION : #vue-argument.section  (ex. #t-rou.citations, #qcm-education.faibles)
   ===================================================================== */
const main = $("#view");
let keyHandler = null; let cleanup = [];
function onCleanup(fn) { cleanup.push(fn); }
const VIEWS = {};
let current = { view: "", arg: "" };
let sidebarFor = null;
function parseHash() { const h = decodeURIComponent(location.hash.replace(/^#/, "")) || "accueil"; const dot = h.indexOf("."); const path = dot >= 0 ? h.slice(0, dot) : h; const sec = dot >= 0 ? h.slice(dot + 1) : ""; const dash = path.indexOf("-"); return { view: dash >= 0 ? path.slice(0, dash) : path, arg: dash >= 0 ? path.slice(dash + 1) : "", sec }; }
function go(h) { if (location.hash === "#" + h) render(); else location.hash = h; }
function render() {
  const r = parseHash();
  const fn = VIEWS[r.view] || VIEWS.accueil;
  if (r.view === current.view && r.arg === current.arg && r.sec && !fn.modes) { openSection(r.sec); return; }
  cleanup.forEach(f => { try { f(); } catch (e) { } }); cleanup = []; keyHandler = null;
  current = r;
  const l = lessonOf(r.arg); if (l && S.set.lecon !== l.id) { S.set.lecon = l.id; save("set"); }
  if (!["accueil", "reglages", "aide", "plus", ""].includes(r.view)) { S.set.dernier = location.hash; save("set"); }
  if (sidebarFor !== curId()) buildSidebar();
  main.innerHTML = ""; main.className = "fade-in"; main.removeAttribute("style");
  fn(r);
  updateNav(r);
  if (r.sec && !fn.modes) setTimeout(() => openSection(r.sec), 30); else window.scrollTo(0, 0);
  parcoursBanner(r);
}
function openSection(sec) { const el = document.getElementById("s-" + sec); if (!el) return; if (el.tagName === "DETAILS") el.open = true; el.scrollIntoView({ behavior: "smooth", block: "start" }); }
window.addEventListener("hashchange", render);

/* disponibilité d'une activité pour un chapitre (ou pour tout le programme) */
function dispo(view, l) {
  const ls = l ? [l] : LECONS; const any = f => ls.some(f);
  switch (view) {
    case "flash": return CARDS.some(c => !l || c.l === l.id);
    case "qcm": case "examen": return QS.some(q => !l || q.l === l.id);
    case "qui": return !!l && l.textes.filter(t => t.citations.length).length >= 3;
    case "trous": return any(x => x.trous.length);
    case "procedes": return any(x => x.procedes.length >= 4);
    case "assoc": return !!l && l.associations.length > 0;
    case "duels": return !!l && l.duels.length > 0;
    case "frise": return T.length > 1;
    case "carte": return !!l && !!l.carteAxes && l.textes.length > 1 && l.textes.every(t => t.carte);
    case "graphiques": return !!l && ((!!l.radarAxes && l.textes.every(t => t.radar)) || l.schemas.length > 0);
    case "palais": return !!l && l.textes.length >= 3 && l.textes.every(t => t.palais);
    case "oral": return T.length > 0;
    case "pieges": return any(x => x.pieges.length || x.textes.some(t => t.pieges.length));
    case "saviez": return any(x => x.textes.some(t => t.anecdotes.length));
    case "exercices": return !!l && l.exercices.length > 0;
    case "sources": return any(x => x.sources.length);
    default: return true;
  }
}
const NAV_GROUPS = [
  ["Réviser", [["l", "book", "Page du chapitre"], ["essentiels", "flag", "Les essentiels"], ["parcours", "play", "Parcours de révision"]]],
  ["S'entraîner", [["flash", "cards", "Flashcards"], ["qcm", "target", "QCM"], ["examen", "timer", "Examen blanc"], ["entrainement", "pen", "Tous les exercices"]]],
  ["Relier les textes", [["palais", "school", "Palais de mémoire"], ["frise", "link", "Frise chronologique"], ["carte", "map", "Carte des positions"], ["duels", "swords", "Duels"], ["graphiques", "chart", "Graphiques"], ["synoptique", "table", "Tableau synoptique"]]],
  ["Ressources", [["pieges", "alert", "Pièges et confusions"], ["saviez", "bulb", "Le saviez-vous ?"], ["exercices", "book", "Exercices du manuel"], ["sources", "ext", "Sources"]]]
];
function buildSidebar() {
  const L = curLecon(); sidebarFor = curId();
  let h = `<div class="side-group"><a class="side-link" href="#accueil" data-nav="accueil">${icon("home")}<span>Accueil</span></a></div>`;
  if (LECONS.length > 1) h += `<div class="side-group"><p class="side-h">Chapitres</p>` + LECONS.map(l => `<a class="side-link" href="#l-${l.id}" data-nav="l-${l.id}"><span class="dot" style="background:var(--c-${l.id})"></span><span>${esc(l.titre)}</span></a>`).join("") + `</div>`;
  if (L) {
    h += `<div class="side-group"><p class="side-h">${esc(L.titre)}</p>` + L.textes.map(t => `<a class="side-link" href="#t-${t.id}" data-nav="t-${t.id}"><span class="dot" style="background:var(--c-${t.id})"></span><span>${esc(t.short)} <span class="muted small">${year(t)}</span></span></a>`).join("") + `</div>`;
    NAV_GROUPS.forEach(([g, items]) => { const ok = items.filter(([k]) => VIEWS[k] && dispo(k, L)); if (ok.length) h += `<div class="side-group"><p class="side-h">${g}</p>` + ok.map(([k, ic, lab]) => `<a class="side-link" href="#${k}-${L.id}" data-nav="${k}-${L.id}">${icon(ic)}<span>${lab}</span></a>`).join("") + `</div>`; });
  }
  h += `<div class="side-group"><p class="side-h">Cahier</p><a class="side-link" href="#reglages" data-nav="reglages">${icon("gear")}<span>Réglages</span></a><a class="side-link" href="#aide" data-nav="aide">${icon("bulb")}<span>Aide</span></a></div>`;
  $("#sidebar").innerHTML = h;
  const id = curId();
  $$("#tabbar [data-tab]").forEach(a => { const k = a.getAttribute("data-tab"); if (k === "chapitre") a.setAttribute("href", "#l-" + id); if (k === "entrainement") a.setAttribute("href", "#entrainement-" + id); if (k === "relier") a.setAttribute("href", "#relier-" + id); });
  const bs = $("#brandSub"); if (bs) bs.textContent = L && LECONS.length ? L.titre : (CFG.sousTitre || "");
}
function updateNav(r) {
  const key = r.arg ? r.view + "-" + r.arg : r.view;
  $$("[data-nav]").forEach(a => a.getAttribute("data-nav") === key ? a.setAttribute("aria-current", "page") : a.removeAttribute("aria-current"));
  const train = ["entrainement", "flash", "qcm", "examen", "oral", "qui", "trous", "procedes", "assoc", "exercices"];
  const link = ["relier", "palais", "frise", "carte", "duels", "graphiques", "synoptique"];
  const tab = r.view === "accueil" ? "accueil" : ["l", "textes", "t", "essentiels", "parcours"].includes(r.view) ? "chapitre" : train.includes(r.view) ? "entrainement" : link.includes(r.view) ? "relier" : "plus";
  $$("[data-tab]").forEach(a => a.getAttribute("data-tab") === tab ? a.setAttribute("aria-current", "page") : a.removeAttribute("aria-current"));
  const bs = $("#brandSub"), L = lessonOf(r.arg); if (bs) bs.textContent = L ? L.titre : (CFG.sousTitre || "");
}
function head(eyebrow, title, lead, right) { return `<div class="view-h"><div><p class="eyebrow">${eyebrow}</p><h1>${title}</h1>${lead ? `<p class="lead">${lead}</p>` : ""}</div>${right || ""}</div>`; }
/* pour les vues qui ont besoin d'un chapitre : sans argument valable, on redirige vers le chapitre courant */
function needLecon(r, view) { const l = LX[r.arg]; if (l) return l; if (LECONS.length) { location.replace("#" + view + "-" + curId() + (r.sec ? "." + r.sec : "")); } else main.innerHTML = head("Cahier", "Aucun chapitre", "Aucune leçon n'est encore chargée."); return null; }
function needScope(r, view) {
  if (!r.arg) { if (LECONS.length) { location.replace("#" + view + "-" + curId() + (r.sec ? "." + r.sec : "")); return null; } return scope("tout"); }
  const sc = scope(r.arg); if (sc) return sc;
  location.replace("#" + view + "-" + curId()); return null;
}

/* ---------- clavier ---------- */
document.addEventListener("keydown", e => {
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  const tag = (e.target && e.target.tagName) || "";
  if (!$("#viewer").hidden) { viewerKey(e); return; }
  if (keyHandler && keyHandler(e) === true) { e.preventDefault(); return; }
  if (/INPUT|TEXTAREA|SELECT/.test(tag)) return;
  const id = curId();
  const map = { h: "accueil", c: "l-" + id, t: "textes-" + id, e: "entrainement-" + id, f: "flash-" + id, q: "qcm-" + id, s: "examen-" + id, p: "pieges-" + id, m: "palais-" + id };
  if (map[e.key]) { go(map[e.key]); e.preventDefault(); return; }
  if (e.key === "?") { go("aide"); e.preventDefault(); }
});

/* =====================================================================
   LE SAVIEZ-VOUS (anecdotes vérifiées, avec source)
   ===================================================================== */
function facts(sc) { const all = []; (sc || scope("tout")).texts.forEach(t => t.anecdotes.forEach(a => { const p = Array.isArray(a) ? a : [a]; all.push([t.id, p[0], p[1] || ""]); })); return all; }
function randomFact(sc) { const f = facts(sc); return f.length ? pick(f) : null; }
function factCard(f) { if (!f) return ""; const [tid, html, src] = f; return `<div class="fact">${tchip(tid)}<p style="margin-top:8px">${html}</p>${src ? `<span class="src">Source : ${/^https?:/.test(src) ? `<a href="${esc(src)}" target="_blank" rel="noopener">${esc(src.replace(/^https?:\/\/(www\.)?/, "").split("/")[0])}</a>` : esc(src)}</span>` : ""}</div>`; }

/* =====================================================================
   ACCUEIL (tous les chapitres)
   ===================================================================== */
function lessonCard(l) {
  const p = lessonProgress(l.id);
  return `<a class="lcard" style="${tc(l.id)}" href="#l-${l.id}">
    <span class="ticon">${icon(l.icon || "book")}</span>
    <div style="min-width:0;flex:1">
      <p class="eyebrow">${esc(l.partie || "Chapitre")}</p>
      <h3>${esc(l.titre)}</h3>
      ${l.problematique ? `<p class="hand lq">${esc(l.problematique)}</p>` : ""}
      <p class="small muted" style="margin:4px 0 8px">${plural(l.textes.length, "texte")} · ${plural(QS.filter(q => q.l === l.id).length, "question")} · ${plural(CARDS.filter(c => c.l === l.id).length, "flashcard")}</p>
      <div class="row" style="gap:8px;flex-wrap:nowrap"><div class="bar" style="flex:1"><i style="width:${p}%"></i></div><span class="num small muted">${p} %</span></div>
    </div></a>`;
}
VIEWS.accueil = () => {
  const due = CARDS.filter(isDue).length;
  const last = S.set.dernier && S.set.dernier !== "#accueil" ? S.set.dernier : "";
  const VLAB = { l: "Page du chapitre", textes: "Liste des textes", essentiels: "Les essentiels", parcours: "Parcours de révision", flash: "Flashcards", qcm: "QCM", examen: "Examen blanc", entrainement: "Exercices", relier: "Relier les textes", palais: "Palais de mémoire", frise: "Frise chronologique", carte: "Carte des positions", duels: "Duels", graphiques: "Graphiques", synoptique: "Tableau synoptique", pieges: "Pièges et confusions", saviez: "Le saviez-vous ?", exercices: "Exercices du manuel", sources: "Sources", oral: "Mode oral", qui: "Qui a dit ?", trous: "Textes à trous", procedes: "Trouve le procédé", assoc: "Associations" };
  const lastLabel = (() => { if (!last) return ""; const m = decodeURIComponent(last.slice(1)).match(/^([a-z]+)-([^.]+)/); if (!m) return "Là où tu t'étais arrêté"; if (m[1] === "t" && TX[m[2]]) return "Fiche : " + TX[m[2]].short; const sc = scope(m[2]); return (VLAB[m[1]] || "Révision") + (sc ? " · " + sc.label : ""); })();
  const prog = CFG.programme || [];
  const have = {}; LECONS.forEach(l => { if (l.programme) have[l.programme] = l; });
  main.innerHTML = `
  <section class="hero">
    <div class="hero-board">
      <p class="eyebrow">${esc(CFG.matiere || "")}${CFG.niveau ? " · " + esc(CFG.niveau) : ""}</p>
      <p class="hero-q">${esc(CFG.nom || "Cahier")}</p>
      <p class="hero-sub">${esc(CFG.accroche || "")}</p>
      <div class="count-big"><span><b>${LECONS.length}</b><span>${LECONS.length > 1 ? "chapitres" : "chapitre"}</span></span><span><b>${T.length}</b><span>textes</span></span><span><b>${QS.length}</b><span>questions</span></span><span><b>${CARDS.length}</b><span>flashcards</span></span></div>
    </div>
    <div class="card express">
      <div><p class="eyebrow">${last ? "Reprendre" : "Pour commencer"}</p><h2 style="font-size:1.35rem">${last ? esc(lastLabel) : "Choisis un chapitre"}</h2></div>
      <p class="muted" style="margin:0">${last ? "Tu reprends exactement là où tu t'étais arrêté." : "Ouvre un chapitre, lis les essentiels, puis entraîne-toi. Ta progression reste sur cet appareil : pas de compte, rien n'est envoyé."}</p>
      ${last ? `<a class="btn primary" href="${esc(last)}">${icon("play")} Reprendre</a>` : LECONS[0] ? `<a class="btn primary" href="#l-${LECONS[0].id}">${icon("play")} Ouvrir « ${esc(LECONS[0].titre)} »</a>` : ""}
      <a class="btn" href="#flash-tout">${icon("cards")} ${due ? plural(due, "flashcard") + " à revoir" : "Flashcards"}</a>
    </div>
  </section>
  <h2 class="section-title">${LECONS.length > 1 ? "Les chapitres" : "Le chapitre en ligne"}</h2>
  <div class="lgrid">${LECONS.map(lessonCard).join("") || `<p class="muted">Aucun chapitre pour l'instant.</p>`}</div>
  <h2 class="section-title">Réviser tout le programme</h2>
  <div class="hub">
    <a class="hubitem" href="#flash-tout"><span class="ticon">${icon("cards")}</span><div><b>Flashcards</b><span>${due} carte${due > 1 ? "s" : ""} à revoir maintenant</span></div></a>
    <a class="hubitem" href="#qcm-tout"><span class="ticon">${icon("target")}</span><div><b>QCM mélangé</b><span>15 questions entrelacées, tous chapitres</span></div></a>
    <a class="hubitem" href="#examen-tout"><span class="ticon">${icon("timer")}</span><div><b>Examen blanc</b><span>20 questions, 20 minutes, correction détaillée</span></div></a>
    <a class="hubitem" href="#frise-tout"><span class="ticon">${icon("link")}</span><div><b>Frise de tous les textes</b><span>Tous les chapitres sur une seule ligne du temps</span></div></a>
  </div>
  ${prog.length ? `<h2 class="section-title">Le programme de l'année <span class="chip">officiel</span></h2>
  <div class="grid g2">${prog.map(p => `<div class="card"><p class="eyebrow">${esc(p.semestre)}</p><h3 style="font-size:1.2rem;margin-bottom:8px">${esc(p.titre)}</h3><ul class="prog">${p.themes.map(th => { const l = have[th.id]; return `<li class="${l ? "on" : ""}">${l ? `<a href="#l-${l.id}">${esc(th.titre)}</a> <span class="chip pill-good">${icon("check")} en ligne</span>` : `<span>${esc(th.titre)}</span> <span class="chip">à venir</span>`}</li>`; }).join("")}</ul></div>`).join("")}</div>
  <p class="small muted">Les chapitres sont ajoutés au fil de l'année, dans l'ordre choisi en classe.</p>` : ""}
  ${facts().length ? `<h2 class="section-title">Le saviez-vous ?</h2>${factCard(randomFact())}` : ""}
  <p class="muted small" style="margin-top:18px">Gratuit, sans compte, sans publicité. Ta progression est enregistrée dans ce navigateur. Raccourcis clavier : <span class="kbd">?</span></p>`;
};

/* =====================================================================
   PAGE D'UN CHAPITRE + PARCOURS DE RÉVISION
   ===================================================================== */
const EXPRESS = L => [
  ["essentiels", `Lire les ${L.textes.length} « À savoir absolument »`, 15, "essentiels-" + L.id],
  ["flash", "Flashcards : un premier tour (boîtes de Leitner)", 15, "flash-" + L.id],
  ["pieges", "Pièges et confusions", 5, "pieges-" + L.id],
  ["faibles", "QCM ciblé sur tes points faibles", 10, "qcm-" + L.id + ".faibles"],
  ["examen", "Examen blanc (20 questions, 20 min)", 20, "examen-" + L.id],
  ["revoir", "Revoir tes erreurs et les cartes ratées", 10, "flash-" + L.id]
].filter(s => dispo(s[3].split("-")[0], L));
const expOf = L => (S.exp[L.id] = S.exp[L.id] || {});
function expressList(L, compact) {
  const ex = expOf(L); const steps = EXPRESS(L);
  return `<ol class="steps">` + steps.map(([k, lab, m, h], i) => `<li class="${ex[k] ? "done" : ""}"><span class="n">${ex[k] ? "✓" : i + 1}</span><span class="t">${compact ? lab : `<a href="#${h}" data-exp="${k}" data-exp-l="${L.id}">${lab}</a>`}</span><span class="d num">${m} min</span></li>`).join("") + `</ol>`;
}
const nextExpress = L => EXPRESS(L).find(s => !expOf(L)[s[0]]);
const totalMin = L => EXPRESS(L).reduce((s, x) => s + x[2], 0);
VIEWS.l = r => {
  const L = needLecon(r, "l"); if (!L) return;
  const nx = nextExpress(L); const due = CARDS.filter(c => c.l === L.id && isDue(c)).length;
  const links = NAV_GROUPS[2][1].filter(([k]) => VIEWS[k] && dispo(k, L));
  main.innerHTML = `
  <p class="small" style="margin:0 0 10px"><a href="#accueil">${icon("left")} ${LECONS.length > 1 ? "Tous les chapitres" : "Accueil"}</a></p>
  <section class="hero">
    <div class="hero-board">
      <p class="eyebrow">${esc(L.partie || "")}${L.partie ? " · " : ""}${esc(L.titre)}</p>
      <p class="hero-q">${esc(L.problematique || L.titre)}</p>
      <p class="hero-sub">${esc(L.resume || "")}</p>
    </div>
    <div class="card express">
      <div><p class="eyebrow">Une séance complète</p><h2 style="font-size:1.35rem">Parcours de révision · ≈ ${totalMin(L)} min</h2></div>
      ${expressList(L, true)}
      <a class="btn primary" href="#parcours-${L.id}">${icon("play")} ${nx ? (Object.keys(expOf(L)).filter(k => k[0] !== "_").length ? "Continuer : " : "Commencer : ") + nx[1] : "Parcours terminé : refaire un examen blanc"}</a>
    </div>
  </section>
  <h2 class="section-title">Les ${L.textes.length} textes <span class="chip">ordre chronologique</span></h2>
  <div class="tiles">${L.textes.map(t => { const p = textProgress(t.id); return `<a class="tile" style="${tc(t.id)}" href="#t-${t.id}">
      <div class="tile-top"><span class="ticon">${icon(t.icon)}</span><div style="min-width:0"><div class="tile-a">${esc(t.auteur)}</div><div class="tile-t">${esc(t.titre)}</div></div></div>
      <div class="tile-meta"><span>${esc(String(t.date).split(" (")[0])}</span><span class="num">${p} %</span></div>
      <div class="bar"><i style="width:${p}%"></i></div></a>`; }).join("")}</div>
  <h2 class="section-title">S'entraîner</h2>
  <div class="hub">
    ${dispo("flash", L) ? `<a class="hubitem" href="#flash-${L.id}"><span class="ticon">${icon("cards")}</span><div><b>Flashcards</b><span>${due} carte${due > 1 ? "s" : ""} à revoir maintenant</span></div></a>` : ""}
    ${dispo("qcm", L) ? `<a class="hubitem" href="#qcm-${L.id}"><span class="ticon">${icon("target")}</span><div><b>QCM mélangé</b><span>15 questions entrelacées, tous les textes</span></div></a>
    <a class="hubitem" href="#examen-${L.id}"><span class="ticon">${icon("timer")}</span><div><b>Examen blanc</b><span>20 questions, 20 minutes, correction détaillée</span></div></a>` : ""}
    ${dispo("pieges", L) ? `<a class="hubitem" href="#pieges-${L.id}"><span class="ticon">${icon("alert")}</span><div><b>Pièges et confusions</b><span>Dates, noms, fausses citations</span></div></a>` : ""}
    <a class="hubitem" href="#entrainement-${L.id}"><span class="ticon">${icon("pen")}</span><div><b>Tous les exercices</b><span>Glisser-déposer, textes à trous, oral…</span></div></a>
  </div>
  ${links.length ? `<h2 class="section-title">Relier les textes</h2><div class="hub">${links.map(([k, ic, lab]) => `<a class="hubitem" href="#${k}-${L.id}"><span class="ticon">${icon(ic)}</span><div><b>${lab}</b></div></a>`).join("")}</div>` : ""}
  ${facts(scope(L.id)).length ? `<h2 class="section-title">Le saviez-vous ?</h2>${factCard(randomFact(scope(L.id)))}` : ""}`;
};
VIEWS.parcours = r => {
  const L = needLecon(r, "parcours"); if (!L) return;
  const nx = nextExpress(L); const n = EXPRESS(L).length;
  main.innerHTML = head(esc(L.titre), "Parcours de révision", `${n} étapes dans l'ordre, environ ${totalMin(L)} minutes. Chaque étape affiche un bandeau « Étape suivante » en bas de l'écran.`) +
    `<div class="card">${expressList(L, false)}</div>
    <div class="row" style="margin-top:14px">
      ${nx ? `<a class="btn primary" href="#${nx[3]}" data-exp-start="${nx[0]}" data-exp-l="${L.id}">${icon("play")} Lancer l'étape : ${nx[1]}</a>` : `<span class="chip pill-good">${icon("check")} Parcours terminé</span>`}
      <button class="btn" type="button" id="expReset">Recommencer le parcours</button>
    </div>
    <div class="note" style="margin-top:16px"><b>Conseil de mémoire.</b> Le rappel actif (répondre avant de regarder la réponse) et la répétition espacée (revoir juste avant d'oublier) sont les deux méthodes les plus efficaces. Le lendemain, refais un tour de flashcards : les cartes des boîtes 1 à 3 reviendront.</div>`;
  $("#expReset").addEventListener("click", () => { S.exp[L.id] = {}; save("exp"); render(); });
};
document.addEventListener("click", e => { const a = e.target.closest("[data-exp],[data-exp-start]"); if (a) { const L = LX[a.getAttribute("data-exp-l")]; if (L) { expOf(L)._active = a.getAttribute("data-exp") || a.getAttribute("data-exp-start"); save("exp"); } } });
function parcoursBanner(r) {
  const old = $("#expBanner"); if (old) old.remove();
  const L = lessonOf(r.arg); if (!L) return;
  const ex = expOf(L); const act = ex._active; if (!act) return;
  const steps = EXPRESS(L); const idx = steps.findIndex(s => s[0] === act); if (idx < 0) return;
  const step = steps[idx]; const target = step[3].split(".")[0];
  if ((r.view + "-" + r.arg) !== target) return;
  const nxt = steps[idx + 1];
  const b = document.createElement("div"); b.id = "expBanner"; b.className = "card"; b.style.cssText = "margin-top:22px;border-color:var(--accent-line);background:var(--accent-soft)";
  b.innerHTML = `<div class="row" style="justify-content:space-between"><span><b>Parcours de révision</b> · étape ${idx + 1}/${steps.length} : ${step[1]}</span><span class="row"><button class="btn small" type="button" id="expQuit">Quitter le parcours</button><button class="btn primary small" type="button" id="expNext">${nxt ? "Étape faite · suivante" : "Terminer le parcours"} ${icon("right")}</button></span></div>`;
  main.appendChild(b);
  $("#expNext").addEventListener("click", () => { ex[step[0]] = true; ex._active = nxt ? nxt[0] : null; save("exp"); if (nxt) go(nxt[3]); else { toast("Parcours terminé. Bravo !"); go("l-" + L.id); } });
  $("#expQuit").addEventListener("click", () => { ex._active = null; save("exp"); b.remove(); });
}

/* =====================================================================
   LISTE DES TEXTES + LES ESSENTIELS
   ===================================================================== */
function numChips(t) { if (!t.nums) return ""; return `<span class="chip" title="${esc(t.nums.detail || "")}">N° du prof : ${esc(t.nums.prof)}</span><span class="chip" title="${esc(t.nums.detail || "")}">Imprimé : ${esc(t.nums.imprime)}</span>`; }
function textRow(t) { return `<a class="tile" style="${tc(t.id)};flex-direction:row;align-items:center;gap:14px" href="#t-${t.id}">
      <span class="ticon">${icon(t.icon)}</span>
      <div style="flex:1;min-width:0"><div class="tile-a">${esc(t.auteur)} · ${esc(t.date)}</div><div class="tile-t">${esc(t.titre)}</div><div class="row" style="margin-top:6px;gap:6px">${numChips(t)}<span class="chip">${esc(t.mouvement)}</span></div></div>
      <span class="num muted">${textProgress(t.id)} %</span></a>`; }
VIEWS.textes = r => {
  if (r.arg === "tout") { main.innerHTML = head("Programme", "Tous les textes", "Chapitre par chapitre, dans l'ordre chronologique.") + LECONS.map(l => `<h2 class="section-title">${esc(l.titre)}</h2><div class="stack">${l.textes.map(textRow).join("")}</div>`).join(""); return; }
  const L = needLecon(r, "textes"); if (!L) return;
  main.innerHTML = head(esc(L.titre), `Les ${L.textes.length} textes`, "Classés par ordre chronologique (date de publication). Chaque texte garde sa couleur et son pictogramme partout.") +
    (L.numerotation ? `<div class="note" style="margin-bottom:14px">${esc(L.numerotation)}</div>` : "") + `<div class="stack">${L.textes.map(textRow).join("")}</div>`;
};
VIEWS.essentiels = r => {
  const sc = r.arg === "tout" ? scope("tout") : null; const L = sc ? null : needLecon(r, "essentiels"); if (!sc && !L) return;
  const texts = sc ? sc.texts : L.textes;
  main.innerHTML = head("Minimum vital", `Les ${texts.length} « À savoir absolument »`, "Deux minutes par texte. Lis à voix haute, puis cache l'écran et redis les points.") +
    texts.map(t => `<section style="${tc(t.id)};margin-bottom:18px">
      <div class="row" style="margin-bottom:8px">${tchip(t.id, t.auteur + " · " + t.date)}<a class="btn small ghost" href="#t-${t.id}">Fiche complète ${icon("right")}</a></div>
      <div class="seyes"><h3>${esc(t.titre)}</h3><ol>${t.essentiel.map(e => `<li>${e}</li>`).join("")}</ol></div></section>`).join("");
};

/* =====================================================================
   FICHE D'UN TEXTE
   ===================================================================== */
const SEC_BASE = { essentiel: "À savoir absolument", auteur: "L'auteur", epoque: "L'époque", mouvement: "Mouvement", ideologie: "Vision de l'auteur", oeuvre: "L'œuvre", extrait: "L'extrait", problematique: "Problématique", citations: "Citations", annotations: "Notes de cours", pieges: "Pièges", feuille: "Le texte", graphique: "Radar", videos: "Vidéos", quiz: "Mini-quiz" };
const secLabel = (L, s) => (L && L.libelles && L.libelles[s]) || SEC_BASE[s] || s;
function sec(L, id, title, body, open) { return `<details class="sec" id="s-${id}" ${open ? "open" : ""}><summary><span class="sn">${esc(secLabel(L, id))}</span>${title}</summary><div class="sec-body">${body}</div></details>`; }
VIEWS.t = r => {
  const t = TX[r.arg]; if (!t) { go("l-" + curId()); return; }
  const L = LX[t.lecon]; const list = L.textes; const i = list.indexOf(t); const prev = list[i - 1], next = list[i + 1];
  const anec = t.anecdotes.map(a => { const [html, src] = Array.isArray(a) ? a : [a, ""]; return `<li>${html}${src ? ` <span class="muted small">(${/^https?:/.test(src) ? `<a href="${esc(src)}" target="_blank" rel="noopener">source</a>` : esc(src)})</span>` : ""}</li>`; }).join("");
  const base = t.sameAuthorAs ? TX[t.sameAuthorAs] : null;
  const hasRadar = !!L.radarAxes && !!t.radar && VIEWS.graphiques;
  const pool = QS.filter(q => q.t === t.id);
  const has = { essentiel: 1, auteur: 1, epoque: t.epoque, mouvement: t.mouvementHtml, ideologie: t.ideologie, oeuvre: t.oeuvreHtml, extrait: t.extrait, problematique: t.problematique, citations: t.citations.length, annotations: t.annotations.length, pieges: t.pieges.length, feuille: 1, graphique: hasRadar, videos: t.videos.length, quiz: pool.length };
  const secs = Object.keys(has).filter(k => has[k]);
  main.setAttribute("style", tc(t.id));
  main.innerHTML = `
  <header class="fiche-head">
    <div class="fh-top"><span class="fh-icon">${icon(t.icon)}</span><div style="min-width:0">
      <div class="fh-author">${esc(t.auteur)} · ${esc(t.auteurDates)}</div>
      <h1 class="fh-title">${esc(t.titre)}</h1>
      <div class="muted"><em>${esc(t.oeuvre)}</em> · ${esc(t.date)}</div></div></div>
    <div class="fh-meta"><a class="chip" href="#l-${L.id}" style="text-decoration:none">${icon("book")} ${esc(L.titre)}</a>${numChips(t)}<span class="chip">${esc(t.genre)}</span><span class="chip">${esc(t.mouvement)}</span>${t.motcle ? `<span class="chip">Mot-clé : ${esc(t.motcle)}</span>` : ""}</div>
    <div class="fh-actions">
      ${t.photos.length ? `<button class="btn" type="button" data-photo="${t.id}">${icon("photo")} Voir la feuille${t.photos.length > 1 ? " (recto-verso)" : ""}</button>` : ""}
      ${CARDS.some(c => c.t === t.id) ? `<a class="btn primary" href="#flash-${t.id}">${icon("cards")} Flashcards</a>` : ""}
      ${pool.length ? `<a class="btn" href="#qcm-${t.id}">${icon("target")} QCM du texte</a>` : ""}
    </div>
  </header>
  <nav class="secnav" aria-label="Sections de la fiche">${secs.map(s => `<a href="#t-${t.id}.${s}">${esc(secLabel(L, s))}</a>`).join("")}</nav>
  <div class="seyes" id="s-essentiel"><h3>À savoir absolument</h3><ol>${t.essentiel.map(e => `<li>${e}</li>`).join("")}</ol></div>
  ${sec(L, "auteur", `${esc(t.auteur)} (${esc(t.auteurDates)})`, (base ? base.auteurHtml + `<p class="muted small">(Même auteur que le texte « ${esc(base.short)} ».)</p>` : (t.auteurHtml || "")) + (anec ? `<h4>Le saviez-vous ?</h4><ul>${anec}</ul>` : ""))}
  ${t.epoque ? sec(L, "epoque", "Époque et contexte", t.epoque) : ""}
  ${t.mouvementHtml ? sec(L, "mouvement", esc(t.mouvement), t.mouvementHtml) : ""}
  ${t.ideologie ? sec(L, "ideologie", esc(secLabel(L, "ideologie")), t.ideologie) : ""}
  ${t.oeuvreHtml ? sec(L, "oeuvre", "L'œuvre entière et la place de l'extrait", (base && /Voir le texte 1/.test(t.oeuvreHtml) ? base.oeuvreHtml : t.oeuvreHtml) + (t.place ? `<h4>Place de l'extrait</h4>` + t.place : "")) : ""}
  ${t.extrait ? sec(L, "extrait", "L'extrait : résumé, mouvements, procédés", `<p>${t.extrait.resume || ""}</p>${(t.extrait.mouvements || []).length ? `<h4>Mouvements</h4><ol>${t.extrait.mouvements.map(m => `<li>${m}</li>`).join("")}</ol>` : ""}${(t.extrait.procedes || []).length ? `<h4>Procédés clés</h4><div class="proc">${t.extrait.procedes.map(p => `<div><b>${p[0]}</b> · <span class="pq">${p[1]}</span><br><span class="muted">${p[2]}</span></div>`).join("")}</div>` : ""}${t.extrait.ton ? `<h4>Ton</h4><p>${t.extrait.ton}</p>` : ""}`, true) : ""}
  ${t.problematique ? sec(L, "problematique", esc(L.problematique || "Problématique"), t.problematique, true) : ""}
  ${t.citations.length ? sec(L, "citations", "Citations à retenir", t.citations.map(c => `<p class="quote">${c[0]}</p><p class="qc">${c[1]}</p>`).join("") + (VIEWS.trous && L.trous.some(x => x[0] === t.id) ? `<a class="btn small" href="#trous-${t.id}" style="margin-top:6px">${icon("pen")} Textes à trous</a>` : ""), true) : ""}
  ${t.annotations.length ? sec(L, "annotations", "Annotations du cours, expliquées", `<p class="small muted" style="margin-top:0">Ce qui a été noté sur la feuille en classe (les numéros de ligne renvoient à la feuille distribuée).</p>` + t.annotations.map(a => `<div class="annot"><span class="where">${a[0]}</span><span class="hand">${a[1]}</span><span>${a[2]}</span></div>`).join(""), true) : ""}
  ${t.pieges.length ? sec(L, "pieges", "Pièges QCM", t.pieges.map(p => `<div class="trap">${icon("alert")}<span>${p}</span></div>`).join("")) : ""}
  ${sec(L, "feuille", "Le texte", t.photos.length ? `<div class="row">${t.photos.map((p, k) => `<button type="button" class="btn" data-photo="${t.id}" data-idx="${k}" style="padding:6px;flex-direction:column;align-items:center"><img src="${esc(p.src)}" alt="${esc(p.label)}" loading="lazy" style="width:150px;height:auto;border-radius:8px;display:block"><span class="small">${esc(p.label)}</span></button>`).join("")}</div><p class="muted small">Touche une photo pour zoomer.</p>` : `<p>Le texte lui-même n'est pas reproduit dans le cahier (droits d'auteur et pages de manuel) : garde sous la main <b>la feuille distribuée en classe</b>. Les numéros de ligne cités dans la fiche renvoient à cette feuille.</p>`)}
  ${hasRadar ? sec(L, "graphique", "Radar : " + esc(secLabel(L, "ideologie").toLowerCase()), `<div id="radarBox"></div><p class="small muted">${t.radar.why || ""}</p>`) : ""}
  ${t.videos.length ? sec(L, "videos", "Vidéos vérifiées", `<ul>${t.videos.map(v => `<li><a href="${esc(v.url)}" target="_blank" rel="noopener">${esc(v.titre)}</a> <span class="muted small">· ${esc(v.chaine || "")} · ${esc(v.duree || "")}</span>${v.note ? `<br><span class="small muted">${esc(v.note)}</span>` : ""}</li>`).join("")}</ul>`) : ""}
  ${pool.length ? sec(L, "quiz", "Mini-quiz (3 questions)", `<div id="miniQuiz"></div>`, true) : ""}
  <div class="pager">${prev ? `<a class="btn" href="#t-${prev.id}">${icon("left")} ${esc(prev.short)}</a>` : "<span></span>"}${next ? `<a class="btn" href="#t-${next.id}">${esc(next.short)} ${icon("right")}</a>` : "<span></span>"}</div>`;
  if (hasRadar && A.radarBox) A.radarBox($("#radarBox"), L, [t.id]);
  if (pool.length) runQuiz($("#miniQuiz"), { questions: wSample(pool, 3, qWeight), mode: "practice", compact: true, title: "Mini-quiz" });
  keyHandler = e => { if (/INPUT|TEXTAREA/.test(e.target.tagName)) return false; if (e.key === "ArrowLeft" && prev) { go("t-" + prev.id); return true; } if (e.key === "ArrowRight" && next) { go("t-" + next.id); return true; } if (e.key === "v" && t.photos.length) { openViewer(t.id, 0); return true; } return false; };
};
document.addEventListener("click", e => { const b = e.target.closest("[data-photo]"); if (b) { openViewer(b.getAttribute("data-photo"), +(b.getAttribute("data-idx") || 0)); } });

/* =====================================================================
   VISIONNEUSE PHOTO (pincer, glisser, double-tap, molette)
   ===================================================================== */
const V = { photos: [], idx: 0, s: 1, fitS: 1, x: 0, y: 0, ptrs: new Map(), lastDist: 0, lastMid: null, tap: 0, moved: false, returnFocus: null };
const vImg = $("#vImg"), vStage = $("#vStage");
function openViewer(tid, idx) {
  const t = TX[tid]; if (!t || !t.photos.length) return;
  V.photos = t.photos; V.returnFocus = document.activeElement;
  $("#viewer").hidden = false; document.body.style.overflow = "hidden";
  $("#vTabs").innerHTML = V.photos.length > 1 ? V.photos.map((p, k) => `<button type="button" data-vi="${k}">${k === 0 ? "Recto" : "Verso"}</button>`).join("") : "";
  showPhoto(idx || 0); $("#vClose").focus();
}
function showPhoto(k) {
  V.idx = clamp(k, 0, V.photos.length - 1); const p = V.photos[V.idx];
  $("#vTitle").textContent = p.label;
  $$("#vTabs [data-vi]").forEach(b => b.style.background = +b.getAttribute("data-vi") === V.idx ? "rgba(255,255,255,.35)" : "");
  vImg.onload = fitPhoto; vImg.alt = p.label; vImg.src = p.src; if (vImg.complete && vImg.naturalWidth) fitPhoto();
}
function fitPhoto() { const r = vStage.getBoundingClientRect(); const w = vImg.naturalWidth || 1, h = vImg.naturalHeight || 1; V.fitS = Math.min(r.width / w, r.height / h); V.s = V.fitS; V.x = (r.width - w * V.s) / 2; V.y = (r.height - h * V.s) / 2; applyV(); }
function applyV() { vImg.style.transform = `translate(${V.x}px,${V.y}px) scale(${V.s})`; }
function zoomAt(px, py, f) { const ns = clamp(V.s * f, V.fitS * 0.8, V.fitS * 10); const k = ns / V.s; V.x = px - (px - V.x) * k; V.y = py - (py - V.y) * k; V.s = ns; applyV(); }
function closeViewer() { $("#viewer").hidden = true; document.body.style.overflow = ""; V.ptrs.clear(); if (V.returnFocus && V.returnFocus.focus) V.returnFocus.focus(); }
function viewerKey(e) { if (e.key === "Escape") closeViewer(); else if (e.key === "+" || e.key === "=") zoomAt(vStage.clientWidth / 2, vStage.clientHeight / 2, 1.3); else if (e.key === "-") zoomAt(vStage.clientWidth / 2, vStage.clientHeight / 2, 1 / 1.3); else if (e.key === "ArrowRight") showPhoto(V.idx + 1); else if (e.key === "ArrowLeft") showPhoto(V.idx - 1); else if (e.key === "0") fitPhoto(); }
$("#vClose").addEventListener("click", closeViewer);
$("#vFit").addEventListener("click", fitPhoto);
$("#vIn").addEventListener("click", () => zoomAt(vStage.clientWidth / 2, vStage.clientHeight / 2, 1.4));
$("#vOut").addEventListener("click", () => zoomAt(vStage.clientWidth / 2, vStage.clientHeight / 2, 1 / 1.4));
$("#vTabs").addEventListener("click", e => { const b = e.target.closest("[data-vi]"); if (b) showPhoto(+b.getAttribute("data-vi")); });
window.addEventListener("resize", () => { if (!$("#viewer").hidden) fitPhoto(); });
const rel = e => { const r = vStage.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
vStage.addEventListener("pointerdown", e => { vStage.setPointerCapture(e.pointerId); V.ptrs.set(e.pointerId, rel(e)); V.moved = false; if (V.ptrs.size === 2) { const [a, b] = [...V.ptrs.values()]; V.lastDist = Math.hypot(a.x - b.x, a.y - b.y); V.lastMid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }; } });
vStage.addEventListener("pointermove", e => {
  if (!V.ptrs.has(e.pointerId)) return; const prev = V.ptrs.get(e.pointerId); const p = rel(e); V.ptrs.set(e.pointerId, p);
  if (Math.hypot(p.x - prev.x, p.y - prev.y) > 1) V.moved = true;
  if (V.ptrs.size === 1) { V.x += p.x - prev.x; V.y += p.y - prev.y; applyV(); }
  else if (V.ptrs.size === 2) { const [a, b] = [...V.ptrs.values()]; const d = Math.hypot(a.x - b.x, a.y - b.y); const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }; if (V.lastDist) { zoomAt(mid.x, mid.y, d / V.lastDist); V.x += mid.x - V.lastMid.x; V.y += mid.y - V.lastMid.y; applyV(); } V.lastDist = d; V.lastMid = mid; }
});
const endPtr = e => {
  const p = V.ptrs.get(e.pointerId); V.ptrs.delete(e.pointerId); if (V.ptrs.size < 2) V.lastDist = 0;
  if (e.type === "pointerup" && p && !V.moved && V.ptrs.size === 0) { const now = Date.now(); if (now - V.tap < 320) { if (V.s < V.fitS * 1.6) zoomAt(p.x, p.y, 2.6); else fitPhoto(); V.tap = 0; } else V.tap = now; }
};
vStage.addEventListener("pointerup", endPtr); vStage.addEventListener("pointercancel", endPtr);
vStage.addEventListener("wheel", e => { e.preventDefault(); const p = rel(e); zoomAt(p.x, p.y, e.deltaY < 0 ? 1.15 : 1 / 1.15); }, { passive: false });

/* =====================================================================
   MOTEUR DE QUIZ (entraînement, mini-quiz, examen blanc)
   ===================================================================== */
function secLink(q) {
  if (TX[q.t]) return `#t-${q.t}.${q.sec}`;
  const l = q.l || curId(); const m = { frise: "frise", duels: "duels" }; const v = m[q.sec];
  return "#" + (v && VIEWS[v] ? v : "synoptique") + "-" + l;
}
const groupKey = q => TX[q.t] ? q.t : "all:" + q.l;
function runQuiz(box, opt) {
  const qs = opt.questions.filter(Boolean); const sim = opt.mode === "sim";
  const st = { i: 0, ans: [], sel: null, done: false, t0: Date.now(), end: opt.time ? Date.now() + opt.time * 1000 : 0 };
  const order = qs.map(q => shuffle(q.choices));
  let timer = null;
  if (!qs.length) { box.innerHTML = `<p class="muted">Aucune question disponible.</p>`; return; }
  function header() {
    const n = qs.length; const pct = Math.round((st.i) / n * 100);
    return opt.compact ? `<div class="qhead"><span class="lvl">Question ${st.i + 1} / ${n}</span></div>` :
      `<div class="qhead"><div class="qprog"><div class="row" style="justify-content:space-between"><span class="lvl">Question ${st.i + 1} / ${n}</span>${sim ? `<span class="timer num" id="qTimer"></span>` : ""}</div><div class="bar" style="margin-top:6px"><i style="width:${pct}%"></i></div></div></div>`;
  }
  function show() {
    const q = qs[st.i]; const ch = order[st.i]; st.sel = null;
    if (!sim && !opt.compact && st.i > 0 && st.i % 6 === 0 && !st["fact" + st.i] && opt.facts !== false) {
      const f = randomFact(opt.factScope);
      if (f) { st["fact" + st.i] = 1; box.innerHTML = header() + `<div class="interstitial"><p class="eyebrow">Pause mémoire · Le saviez-vous ?</p>${factCard(f)}<button class="btn primary" type="button" id="qGoOn" style="margin-top:12px">Continuer ${icon("right")}</button></div>`; $("#qGoOn", box).addEventListener("click", show); $("#qGoOn", box).focus({ preventScroll: true }); return; }
    }
    box.innerHTML = header() + `<div class="qcard"><div class="row" style="gap:6px">${tchip(q.t, null, q.l)}<span class="lvl">${LVL[q.lvl] || ""}</span></div><p class="qtext">${q.q}</p><div class="choices">${ch.map((c, k) => `<button class="choice" type="button" data-k="${k}"><span class="k">${"ABCD"[k]}</span><span>${c}</span></button>`).join("")}</div>${sim ? `<div class="row" style="margin-top:12px;justify-content:space-between"><button class="btn ghost" type="button" id="qSkip">Passer</button><button class="btn primary" type="button" id="qValid" disabled>Valider ${icon("right")}</button></div>` : `<div id="qFb"></div>`}</div>`;
    $$(".choice", box).forEach(b => b.addEventListener("click", () => choose(+b.getAttribute("data-k"))));
    if (sim) { $("#qSkip", box).addEventListener("click", () => validate(null)); $("#qValid", box).addEventListener("click", () => validate(st.sel)); tick(); }
  }
  function choose(k) {
    const q = qs[st.i]; const ch = order[st.i];
    if (sim) { st.sel = k; $$(".choice", box).forEach((b, j) => b.style.borderColor = j === k ? "var(--accent)" : ""); $("#qValid", box).disabled = false; return; }
    if (st.ans[st.i] !== undefined) return;
    const ok = ch[k] === q.ok; st.ans[st.i] = { k, ok }; recordAnswer(q, ok);
    $$(".choice", box).forEach((b, j) => { b.disabled = true; if (ch[j] === q.ok) b.classList.add("right"); else if (j === k) b.classList.add("wrong"); });
    const last = st.i === qs.length - 1;
    $("#qFb", box).innerHTML = `<div class="feedback ${ok ? "ok" : "ko"}"><b class="v">${ok ? "Bien vu !" : "Raté."}</b> ${ok ? "" : `Bonne réponse : <b>${q.ok}</b>.`}<p style="margin:.4em 0 0">${q.exp || ""}</p><div class="row" style="margin-top:10px">${q.sec ? `<a class="btn small ghost" href="${secLink(q)}">Revoir la fiche ${icon("right")}</a>` : ""}<button class="btn small primary" type="button" id="qNext">${last ? "Voir le bilan" : "Question suivante"} ${icon("right")}</button></div></div>`;
    $("#qNext", box).addEventListener("click", next); $("#qNext", box).focus({ preventScroll: true });
  }
  function validate(k) { const q = qs[st.i]; const ch = order[st.i]; const ok = k !== null && ch[k] === q.ok; st.ans[st.i] = { k, ok, skipped: k === null }; recordAnswer(q, ok); next(); }
  function next() { if (st.i < qs.length - 1) { st.i++; show(); if (!opt.compact) box.scrollIntoView({ behavior: "smooth", block: "start" }); } else finish(); }
  function tick() { const el = $("#qTimer", box); if (!el) return; const left = Math.max(0, st.end - Date.now()); const m = Math.floor(left / 60000), s = Math.floor(left / 1000) % 60; el.textContent = `${m}:${String(s).padStart(2, "0")}`; el.classList.toggle("low", left < 120000); if (left <= 0) { toast("Temps écoulé !"); finish(); } }
  if (sim) { timer = setInterval(tick, 500); onCleanup(() => clearInterval(timer)); }
  function finish() {
    if (st.done) return; st.done = true; clearInterval(timer);
    const score = st.ans.filter(a => a && a.ok).length; const n = qs.length;
    if (opt.onDone) opt.onDone(score, n, st);
    const byT = {}; qs.forEach((q, i) => { const k = groupKey(q); byT[k] = byT[k] || [0, 0, q]; byT[k][1]++; if (st.ans[i] && st.ans[i].ok) byT[k][0]++; });
    const wrong = qs.map((q, i) => [q, st.ans[i]]).filter(([, a]) => !a || !a.ok);
    const dur = Math.round((Date.now() - st.t0) / 1000);
    const back = opt.back || ("#entrainement-" + (qs[0].l || curId()));
    box.innerHTML = `<div class="qcard"><p class="eyebrow">${esc(opt.title || "Bilan")}</p><div class="row" style="align-items:baseline;gap:14px"><span class="result-big num">${score}<span style="font-size:1.4rem;color:var(--muted)">/${n}</span></span><span class="muted">${Math.round(score / n * 100)} % · ${Math.floor(dur / 60)} min ${String(dur % 60).padStart(2, "0")} s</span></div>
      ${opt.compact ? "" : `<h4 style="margin:16px 0 6px">Par texte</h4><div class="stack" style="gap:8px">${Object.keys(byT).map(k => { const [c, m, q] = byT[k]; return `<div style="${tc(TX[q.t] ? q.t : q.l)}"><div class="row" style="justify-content:space-between">${tchip(q.t, null, q.l)}<span class="num small">${c}/${m}</span></div><div class="bar" style="margin-top:4px"><i style="width:${Math.round(c / m * 100)}%"></i></div></div>`; }).join("")}</div>`}
      ${wrong.length ? `<h4 style="margin:18px 0 6px">${sim ? "Correction détaillée" : "À revoir"} (${wrong.length})</h4>` + wrong.map(([q, a]) => `<div class="feedback ko" style="margin-top:8px"><div class="row" style="gap:6px">${tchip(q.t, null, q.l)}<span class="lvl">${LVL[q.lvl] || ""}</span></div><p style="margin:.4em 0"><b>${q.q}</b></p><p style="margin:.2em 0">${a && a.skipped ? "Question passée." : a ? `Ta réponse : ${order[qs.indexOf(q)][a.k]}` : "Sans réponse."}<br>Bonne réponse : <b>${q.ok}</b></p><p class="small" style="margin:.3em 0 0">${q.exp || ""}</p>${q.sec ? `<a class="small" href="${secLink(q)}">Revoir la fiche</a>` : ""}</div>`).join("") : `<p class="chip pill-good" style="margin-top:14px">${icon("check")} Aucune erreur</p>`}
      <div class="row" style="margin-top:16px">${opt.again ? `<button class="btn primary" type="button" id="qAgain">${icon("play")} Recommencer</button>` : ""}${opt.compact ? `<button class="btn" type="button" id="qAgain2">3 autres questions</button>` : `<a class="btn" href="${back}">Autres exercices</a>`}</div></div>`;
    if (opt.again) $("#qAgain", box).addEventListener("click", opt.again);
    const a2 = $("#qAgain2", box); if (a2) a2.addEventListener("click", () => runQuiz(box, Object.assign({}, opt, { questions: wSample(QS.filter(q => q.t === qs[0].t), 3, qWeight) })));
  }
  if (!opt.compact) keyHandler = e => {
    if (st.done) return false;
    const k = { "1": 0, "2": 1, "3": 2, "4": 3, a: 0, b: 1, c: 2, d: 3 }[e.key.toLowerCase()];
    if (k !== undefined && $$(".choice", box)[k] && !$$(".choice", box)[k].disabled) { choose(k); return true; }
    if (e.key === "Enter" || e.key === "ArrowRight") { const n = $("#qNext", box) || $("#qGoOn", box) || (sim && st.sel !== null && $("#qValid", box)); if (n) { n.click(); return true; } }
    return false;
  };
  show();
}

/* ---------- vue QCM : #qcm-<portée>[.faibles|.trans] ---------- */
VIEWS.qcm = r => {
  const sc = needScope(r, "qcm"); if (!sc) return;
  const mode = ["faibles", "trans"].includes(r.sec) ? r.sec : "mix";
  let pool = QS.filter(q => inScope(sc, q)); let n = 15, title;
  if (sc.type === "texte") { title = "QCM · " + sc.label; n = Math.min(12, pool.length); }
  else if (mode === "faibles") title = "QCM ciblé sur tes points faibles";
  else if (mode === "trans") { title = "QCM transversal"; pool = pool.filter(q => q.lvl === "T"); n = Math.min(12, pool.length); }
  else title = "QCM mélangé et entrelacé";
  const pickQs = () => {
    if (sc.type === "texte") return shuffle(wSample(pool, n, qWeight));
    if (mode === "faibles") return wSample(pool, n, q => Math.pow(qWeight(q), 2));
    const sel = wSample(pool, n, qWeight); const out = []; const buckets = {}; sel.forEach(q => (buckets[q.t] = buckets[q.t] || []).push(q));
    const keys = shuffle(Object.keys(buckets)); while (out.length < sel.length) keys.forEach(k => { const b = buckets[k]; if (b.length) out.push(b.shift()); }); return out;
  };
  const lead = sc.type === "texte" ? `Questions du texte, pondérées vers celles que tu rates. <a href="#t-${sc.id}">Revoir la fiche</a>.` : mode === "faibles" ? "Tirage pondéré : questions ratées, jamais vues, et textes où ta progression est faible." : mode === "trans" ? "Des questions qui comparent les textes entre eux." : "Questions de tous les textes, entrelacées : alterner les sujets aide à mieux retenir.";
  main.innerHTML = head("S'entraîner · " + esc(sc.label), title, lead) +
    `<div class="row" style="margin-bottom:12px"><label for="qSel" class="small muted">Paquet :</label><select class="select" id="qSel">${scopeOptions(true)}</select>${sc.type !== "texte" ? `<label for="qMode" class="small muted">Type :</label><select class="select" id="qMode"><option value="mix">Mélangé</option><option value="faibles">Mes points faibles</option><option value="trans">Transversal (comparer)</option></select>` : ""}</div><div class="quiz" id="quizBox"></div>`;
  $("#qSel").value = sc.id; $("#qSel").addEventListener("change", e => go("qcm-" + e.target.value + (mode !== "mix" && !TX[e.target.value] ? "." + mode : "")));
  const qm = $("#qMode"); if (qm) { qm.value = mode; qm.addEventListener("change", e => go("qcm-" + sc.id + (e.target.value === "mix" ? "" : "." + e.target.value))); }
  const start = () => runQuiz($("#quizBox"), { questions: pickQs(), mode: "practice", title, again: start, factScope: sc, back: "#entrainement-" + (sc.lecon ? sc.lecon.id : "tout") });
  start();
};
VIEWS.qcm.modes = true;

/* ---------- examen blanc : #examen-<portée> ---------- */
VIEWS.examen = r => {
  const sc = needScope(r, "examen"); if (!sc) return;
  const pool = QS.filter(q => inScope(sc, q)); const N = Math.min(20, pool.length);
  const hist = S.sims.filter(h => (h.p || "tout") === sc.id).slice(-5).reverse();
  main.innerHTML = head("Conditions réelles · " + esc(sc.label), "Examen blanc", `${N} questions tirées ${sc.type === "tout" ? "dans tout le programme" : sc.type === "lecon" ? "dans tout le chapitre" : "sur ce texte"} (au moins une par texte quand c'est possible, les autres orientées vers tes points faibles), ${N} minutes, sans correction avant la fin. Tu peux changer de réponse avant de valider.`) +
    `<div class="row" style="margin-bottom:12px"><label for="xSel" class="small muted">Sur :</label><select class="select" id="xSel">${scopeOptions(false)}</select></div>
    <div class="card" id="simIntro"><div class="row" style="justify-content:space-between"><div><b>Prêt ?</b> <span class="muted">Coupe les notifications, prends un brouillon.</span></div><button class="btn primary" type="button" id="simGo">${icon("timer")} Lancer le chrono (${N} min)</button></div>
    ${hist.length ? `<h4 style="margin:14px 0 6px">Tes derniers examens blancs</h4><div class="row">${hist.map(h => `<span class="chip num">${new Date(h.at).toLocaleString("fr-FR", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })} · ${h.score}/${h.n}</span>`).join("")}</div>` : ""}</div><div class="quiz" id="simBox"></div>`;
  $("#xSel").value = sc.type === "texte" ? sc.lecon.id : sc.id; $("#xSel").addEventListener("change", e => go("examen-" + e.target.value));
  $("#simGo").addEventListener("click", () => {
    $("#simIntro").hidden = true;
    const per = shuffle(sc.texts).slice(0, N).map(t => wSample(pool.filter(q => q.t === t.id), 1, qWeight)[0]).filter(Boolean);
    const rest = wSample(pool.filter(q => !per.includes(q)), Math.max(0, N - per.length), q => Math.pow(qWeight(q), 1.5));
    const qs = shuffle(per.concat(rest)).slice(0, N);
    runQuiz($("#simBox"), { questions: qs, mode: "sim", time: N * 60, title: "Résultat de l'examen blanc", onDone: (score, n) => { S.sims.push({ at: Date.now(), score, n, p: sc.id }); save("sims"); }, again: () => render(), back: "#entrainement-" + (sc.lecon ? sc.lecon.id : "tout") });
  });
};

/* =====================================================================
   FLASHCARDS (Leitner, 5 boîtes) : #flash-<portée>[.tout]
   ===================================================================== */
VIEWS.flash = r => {
  const sc = needScope(r, "flash"); if (!sc) return;
  const cram = r.sec === "tout";
  const cards = CARDS.filter(c => inScope(sc, c));
  const counts = boxCounts(cards);
  const dueList = cards.filter(isDue);
  main.innerHTML = head("Répétition espacée · " + esc(sc.label), "Flashcards", "Lis la question, réponds dans ta tête (ou à voix haute), retourne la carte, puis sois honnête. « Je savais » fait monter la carte d'une boîte ; « À revoir » la renvoie en boîte 1.") +
    `<div class="row" style="margin-bottom:6px"><label for="fSel" class="small muted">Paquet :</label><select class="select" id="fSel">${scopeOptions(true)}</select><label class="chip" style="cursor:pointer"><input type="checkbox" id="fCram" ${cram ? "checked" : ""}> Tout revoir (même les cartes pas encore dues)</label></div>
    <div class="boxes">${[1, 2, 3, 4, 5].map(b => `<div>Boîte ${b}<b>${b === 1 ? counts[1] + counts[0] : counts[b]}</b>${["", "chaque tour", "10 min", "1 h", "6 h", "24 h"][b]}</div>`).join("")}</div>
    <div id="flashBox"></div>`;
  $("#fSel").value = sc.id; $("#fSel").addEventListener("change", e => go("flash-" + e.target.value + (cram ? ".tout" : "")));
  $("#fCram").addEventListener("change", e => go("flash-" + sc.id + (e.target.checked ? ".tout" : "")));
  let queue = cram ? shuffle(cards) : shuffle(dueList).sort((a, b) => ((S.leit[a.id] || {}).b || 0) - ((S.leit[b.id] || {}).b || 0)).slice(0, 20);
  let done = 0, good = 0; const box = $("#flashBox");
  function show() {
    if (!queue.length) {
      const nextDue = cards.filter(c => S.leit[c.id]).map(c => S.leit[c.id].due).filter(d => d > Date.now()).sort((a, b) => a - b)[0];
      box.innerHTML = `<div class="card"><p class="eyebrow">Tour terminé</p><p style="font-size:1.1rem">${done ? `<b>${good}/${done}</b> cartes sues.` : cards.length ? "Aucune carte à revoir pour l'instant." : "Pas de flashcards dans ce paquet."} ${nextDue ? `Prochaine carte due dans ${Math.max(1, Math.round((nextDue - Date.now()) / 60000))} min.` : ""}</p>
        <div class="row"><button class="btn primary" type="button" id="fMore">${icon("play")} Nouveau tour</button>${cram ? "" : `<a class="btn" href="#flash-${sc.id}.tout">Tout revoir quand même</a>`}</div></div>`;
      $("#fMore").addEventListener("click", () => render()); return;
    }
    const c = queue[0]; const st = S.leit[c.id];
    box.innerHTML = `<div class="flash" id="fCard" style="${tc(TX[c.t] ? c.t : c.l)}"><div class="flash-in" role="button" tabindex="0" aria-label="Retourner la carte"><div class="face"><div class="row" style="justify-content:space-between">${tchip(c.t, null, c.l)}<span class="chip">Boîte ${st ? st.b : 1}</span></div><div class="ftxt">${c.f}</div><div class="fhint">Touche la carte (ou Espace) pour la retourner</div></div><div class="face back"><div class="ftxt">${c.b}</div></div></div></div>
      <div class="grade"><button class="btn no" type="button" id="fNo">${icon("x")} À revoir <span class="kbd">1</span></button><button class="btn yes" type="button" id="fYes">${icon("check")} Je savais <span class="kbd">2</span></button></div>
      <p class="small muted" style="text-align:center;margin-top:10px">${queue.length} carte${queue.length > 1 ? "s" : ""} dans ce tour</p>`;
    const card = $("#fCard"); const flip = () => card.classList.toggle("flipped");
    $(".flash-in", box).addEventListener("click", e => { if (!e.target.closest("a")) flip(); });
    $(".flash-in", box).addEventListener("keydown", e => { if (e.key === "Enter") { flip(); e.preventDefault(); } });
    $("#fNo").addEventListener("click", () => grade(false)); $("#fYes").addEventListener("click", () => grade(true));
  }
  function grade(ok) { const c = queue.shift(); gradeCard(c, ok); done++; if (ok) good++; else if (queue.length) queue.push(c); show(); }
  keyHandler = e => { if (e.key === " ") { const c = $("#fCard"); if (c) { c.classList.toggle("flipped"); return true; } } if (e.key === "1" || e.key === "ArrowLeft") { const b = $("#fNo"); if (b) { b.click(); return true; } } if (e.key === "2" || e.key === "ArrowRight") { const b = $("#fYes"); if (b) { b.click(); return true; } } return false; };
  show();
};
VIEWS.flash.modes = true;

/* =====================================================================
   HUBS : S'ENTRAÎNER, RELIER, PLUS, AIDE
   ===================================================================== */
const HUB = [
  ["flash", "cards", "Flashcards (Leitner)", "Répétition espacée, 5 boîtes, progression enregistrée"],
  ["qcm", "target", "QCM mélangé", "15 questions entrelacées de tous les textes"],
  ["qcm", "flag", "QCM points faibles", "Tirage pondéré vers tes erreurs", "faibles"],
  ["examen", "timer", "Examen blanc", "20 questions, 20 minutes, correction détaillée"],
  ["qcm", "link", "QCM transversal", "Comparer les textes entre eux", "trans"],
  ["qui", "quote", "Qui a dit ?", "Glisse chaque citation vers son auteur"],
  ["trous", "pen", "Textes à trous", "Les citations clés à compléter"],
  ["procedes", "bulb", "Trouve le procédé", "Une phrase → une figure de style"],
  ["assoc", "table", "Associations", "Personnages, auteurs, œuvres, dates"],
  ["oral", "mic", "Mode oral", "Tirage d'une question, chrono, points attendus"],
  ["exercices", "book", "Exercices du manuel", "Les questions des feuilles, avec corrigés"]
];
VIEWS.entrainement = r => {
  const sc = needScope(r, "entrainement"); if (!sc) return;
  const L = sc.type === "tout" ? null : sc.lecon;
  const items = HUB.filter(([k]) => VIEWS[k] && dispo(k, L) && (sc.type !== "tout" || ["flash", "qcm", "examen", "trous", "procedes", "oral"].includes(k)));
  const trans = QS.some(q => inScope(sc, q) && q.lvl === "T");
  main.innerHTML = head("S'entraîner · " + esc(sc.label), "Tous les exercices", "Varie les exercices : alterner les formes de rappel renforce la mémoire.") +
    `<div class="row" style="margin-bottom:12px"><label for="eSel" class="small muted">Sur :</label><select class="select" id="eSel">${scopeOptions(false)}</select></div>
    <div class="hub">${items.filter(it => it[4] !== "trans" || trans).map(([k, ic, t, d, m]) => `<a class="hubitem" href="#${k}-${L ? L.id : "tout"}${m ? "." + m : ""}"><span class="ticon">${icon(ic)}</span><div><b>${t}</b><span>${d}</span></div></a>`).join("")}</div>
    ${L ? `<h2 class="section-title">QCM par texte</h2><div class="row">${L.textes.map(t => `<a class="tchip" style="${tc(t.id)}" href="#qcm-${t.id}">${icon(t.icon)}${esc(t.short)} <span class="num" style="opacity:.8">· ${QS.filter(q => q.t === t.id).length}</span></a>`).join("")}</div>` : ""}
    <p class="muted small" style="margin-top:16px">${plural(QS.filter(q => inScope(sc, q)).length, "question")} et ${plural(CARDS.filter(c => inScope(sc, c)).length, "flashcard")} ${sc.type === "tout" ? "dans tout le programme" : "dans ce chapitre"}.</p>`;
  $("#eSel").value = sc.type === "texte" ? sc.lecon.id : sc.id; $("#eSel").addEventListener("change", e => go("entrainement-" + e.target.value));
};
VIEWS.relier = r => {
  const L = needLecon(r, "relier"); if (!L) return;
  const items = NAV_GROUPS[2][1].filter(([k]) => VIEWS[k] && dispo(k, L));
  const desc = { palais: "Une salle par texte, un objet-symbole par salle", frise: "Les textes et les repères historiques", carte: "Place les textes sur deux axes", duels: "Deux textes face à face", graphiques: "Radars et schémas", synoptique: "Tous les textes en un tableau" };
  main.innerHTML = head(esc(L.titre), "Relier les textes", "Comparer, situer, visualiser : les liens entre textes sont souvent ce qui fait la différence.") +
    `<div class="hub">${items.map(([k, ic, lab]) => `<a class="hubitem" href="#${k}-${L.id}"><span class="ticon">${icon(ic)}</span><div><b>${lab}</b><span>${desc[k] || ""}</span></div></a>`).join("")}</div>`;
};
VIEWS.plus = () => {
  const L = curLecon();
  main.innerHTML = head("Menu", "Tout le cahier", "") +
    (LECONS.length ? `<h2 class="section-title">Chapitres</h2><div class="lgrid">${LECONS.map(lessonCard).join("")}</div>` : "") +
    (L ? NAV_GROUPS.map(([g, items]) => { const ok = items.filter(([k]) => VIEWS[k] && dispo(k, L)); return ok.length ? `<h2 class="section-title">${g}</h2><div class="hub">${ok.map(([k, ic, lab]) => `<a class="hubitem" href="#${k}-${L.id}"><span class="ticon">${icon(ic)}</span><div><b>${lab}</b></div></a>`).join("")}</div>` : ""; }).join("") +
      `<h2 class="section-title">Textes · ${esc(L.titre)}</h2><div class="row">${L.textes.map(t => tchip(t.id)).join("")}</div>` : "") +
    `<h2 class="section-title">Cahier</h2><div class="hub"><a class="hubitem" href="#reglages"><span class="ticon">${icon("gear")}</span><div><b>Réglages</b><span>Thème, taille du texte, progression</span></div></a><a class="hubitem" href="#aide"><span class="ticon">${icon("bulb")}</span><div><b>Aide</b><span>Comment ça marche, raccourcis</span></div></a></div>`;
};
VIEWS.aide = () => {
  main.innerHTML = head("Aide", "Comment ça marche", "") +
    `<div class="card stack"><p><b>Un chapitre = un corpus de textes étudiés en classe.</b> Pour chaque texte : une fiche (l'essentiel, l'auteur, l'époque, les procédés, les citations), des flashcards et des QCM corrigés.</p>
    <p><b>Ta progression reste sur ton appareil</b> (dans ce navigateur) : pas de compte, rien n'est envoyé. Si tu changes de téléphone ou de navigateur, tu repars de zéro.</p>
    <p><b>Installer le cahier</b> : dans le menu du navigateur, « Ajouter à l'écran d'accueil ». Il s'ouvre alors comme une appli.</p>
    <p><b>Une erreur dans une fiche ?</b> Signale-la à la personne qui t'a partagé le lien.</p></div>
    <h2 class="section-title">Raccourcis clavier (ordinateur)</h2>
    <div class="card"><dl class="kv">
    <dt><span class="kbd">h</span></dt><dd>Accueil</dd><dt><span class="kbd">c</span></dt><dd>Page du chapitre</dd><dt><span class="kbd">t</span></dt><dd>Liste des textes</dd><dt><span class="kbd">e</span></dt><dd>Exercices</dd><dt><span class="kbd">f</span></dt><dd>Flashcards</dd><dt><span class="kbd">q</span></dt><dd>QCM mélangé</dd><dt><span class="kbd">s</span></dt><dd>Examen blanc</dd><dt><span class="kbd">p</span></dt><dd>Pièges</dd><dt><span class="kbd">m</span></dt><dd>Palais de mémoire</dd>
    <dt><span class="kbd">1</span>-<span class="kbd">4</span> ou <span class="kbd">A</span>-<span class="kbd">D</span></dt><dd>Répondre à un QCM</dd><dt><span class="kbd">Entrée</span></dt><dd>Question suivante</dd>
    <dt><span class="kbd">Espace</span></dt><dd>Retourner une flashcard ; <span class="kbd">1</span> à revoir, <span class="kbd">2</span> je savais</dd>
    <dt><span class="kbd">←</span> <span class="kbd">→</span></dt><dd>Texte précédent / suivant dans une fiche</dd><dt><span class="kbd">Échap</span></dt><dd>Fermer une photo</dd></dl></div>`;
};

/* =====================================================================
   PIÈGES, LE SAVIEZ-VOUS, SYNOPTIQUE, SOURCES, RÉGLAGES
   ===================================================================== */
VIEWS.pieges = r => {
  const sc = needScope(r, "pieges"); if (!sc) return;
  const ls = sc.lecons;
  main.innerHTML = head("Attention · " + esc(sc.label), "Pièges et confusions", "Les erreurs classiques des QCM sur ce corpus. Relis-les juste avant une évaluation.") +
    ls.map(l => (ls.length > 1 ? `<h2 class="section-title">${esc(l.titre)}</h2>` : "") +
      (l.pieges.length ? `<div class="grid g2">${l.pieges.map(([ti, tx, tid]) => `<div class="card" style="${tc(TX[tid] ? tid : l.id)}"><div class="row" style="justify-content:space-between;margin-bottom:6px"><b style="font-family:var(--f-display);font-size:1.1rem">${ti}</b>${tchip(tid, null, l.id)}</div><p style="margin:0">${tx}</p></div>`).join("")}</div>` : "") +
      (l.textes.some(t => t.pieges.length) ? `<h2 class="section-title">Pièges texte par texte</h2>` + l.textes.filter(t => t.pieges.length).map(t => `<details class="sec" style="${tc(t.id)}"><summary>${icon(t.icon)} ${esc(t.short)}</summary><div class="sec-body">${t.pieges.map(p => `<div class="trap">${icon("alert")}<span>${p}</span></div>`).join("")}</div></details>`).join("") : "")).join("");
};
VIEWS.saviez = r => {
  const sc = needScope(r, "saviez"); if (!sc) return;
  main.innerHTML = head("Anecdotes vérifiées · " + esc(sc.label), "Le saviez-vous ?", "Des détails marquants pour ancrer chaque auteur. Ils réapparaissent au hasard pendant les QCM.") + `<div class="grid g2">${facts(sc).map(factCard).join("")}</div>`;
};
VIEWS.synoptique = r => {
  const sc = needScope(r, "synoptique"); if (!sc) return;
  main.innerHTML = head("Vue d'ensemble · " + esc(sc.label), "Tableau synoptique", "Fais défiler horizontalement sur téléphone.") +
    sc.lecons.map(l => (sc.lecons.length > 1 ? `<h2 class="section-title">${esc(l.titre)}</h2>` : "") + `<div class="tablewrap"><table><thead><tr><th>Texte</th><th>Auteur</th><th>Œuvre, date</th><th>Genre</th><th>Mouvement</th><th>${esc(secLabel(l, "ideologie"))}</th><th>Mot-clé</th><th>Symbole</th></tr></thead><tbody>${l.textes.map(t => `<tr style="${tc(t.id)}"><td>${tchip(t.id)}${t.nums ? `<div class="small muted" style="margin-top:4px">prof ${esc(t.nums.prof)} · imprimé ${esc(t.nums.imprime)}</div>` : ""}</td><td><b>${esc(t.auteur)}</b><br><span class="small muted">${esc(t.auteurDates)}</span></td><td><em>${esc(t.oeuvre)}</em><br><span class="small">${esc(t.date)}</span></td><td>${esc(t.genre)}</td><td>${esc(t.mouvement)}</td><td>${strip(t.essentiel[t.essentiel.length - 1] || "").replace(/^Problématique\s*:\s*/, "")}</td><td>${esc(t.motcle || "")}</td><td>${icon(t.icon)} ${esc(t.symbole || "")}</td></tr>`).join("")}</tbody></table></div>`).join("");
};
VIEWS.sources = r => {
  const sc = needScope(r, "sources"); if (!sc) return;
  main.innerHTML = head("Vérifications · " + esc(sc.label), "Sources consultées", "Les pages utilisées pour vérifier les dates, les faits et les anecdotes.") +
    sc.lecons.map(l => { const groups = {}; l.sources.forEach(([g, lab, u]) => (groups[g] = groups[g] || []).push([lab, u])); return (sc.lecons.length > 1 ? `<h2 class="section-title">${esc(l.titre)}</h2>` : "") + Object.keys(groups).map(g => `<h3 class="section-title" style="font-size:1.1rem">${esc(g)}</h3><ul class="srclist">${groups[g].map(([lab, u]) => `<li><a href="${esc(u)}" target="_blank" rel="noopener">${esc(lab)}</a></li>`).join("")}</ul>`).join(""); }).join("");
};
VIEWS.reglages = () => {
  main.innerHTML = head("Réglages", "Réglages", "") +
    `<div class="card stack">
    <label for="thSel"><b>Thème</b></label><select class="select" id="thSel"><option value="auto">Automatique (comme le téléphone)</option><option value="light">Cahier (clair)</option><option value="dark">Tableau noir (sombre)</option></select>
    <label for="szSel"><b>Taille du texte</b></label><select class="select" id="szSel"><option value="m">Normale</option><option value="l">Grande</option><option value="xl">Très grande</option></select>
    <div><b>Progression</b><p class="small muted" style="margin:.2em 0 .6em">${Object.keys(S.leit).length} cartes vues, ${Object.keys(S.qs).length} questions tentées, ${S.sims.length} examen(s) blanc(s). Tout est enregistré dans ce navigateur, sur cet appareil uniquement.</p><button class="btn" type="button" id="resetBtn">Effacer ma progression…</button><div id="resetConfirm" hidden class="warnbox" style="margin-top:10px"><p style="margin-top:0">Effacer définitivement les flashcards, les réponses aux QCM et les examens blancs ?</p><div class="row"><button class="btn" type="button" id="resetYes" style="border-color:var(--bad);color:var(--bad)">Oui, tout effacer</button><button class="btn" type="button" id="resetNo">Annuler</button></div></div></div>
    </div>
    <p class="small muted" style="margin-top:14px">${esc(CFG.nom || "Cahier")} · ${plural(LECONS.length, "chapitre")} · ${plural(T.length, "texte")}${CFG.url ? ` · <a href="${esc(CFG.url)}">${esc(CFG.url.replace(/^https?:\/\//, "").replace(/\/$/, ""))}</a>` : ""}</p>`;
  $("#thSel").value = S.set.theme || "auto"; $("#thSel").addEventListener("change", e => { S.set.theme = e.target.value; save("set"); applyTheme(); });
  $("#szSel").value = S.set.taille || "m"; $("#szSel").addEventListener("change", e => { S.set.taille = e.target.value; save("set"); applyTheme(); });
  $("#resetBtn").addEventListener("click", () => { $("#resetConfirm").hidden = false; });
  $("#resetNo").addEventListener("click", () => { $("#resetConfirm").hidden = true; });
  $("#resetYes").addEventListener("click", () => { ["leit", "qs", "exp", "sims", "extra"].forEach(k => { S[k] = k === "sims" ? [] : {}; save(k); }); toast("Progression effacée"); render(); });
};

/* =====================================================================
   EXERCICES DU MANUEL (blocs génériques : revele, corrige, association, questions)
   ===================================================================== */
function matchGame(box, pairs, opts) {
  opts = opts || {};
  const left = pairs.map((p, i) => ({ i, txt: p[0] })); const right = shuffle(pairs.map((p, i) => ({ i, txt: p[1] })));
  let sel = null, found = 0, errors = 0;
  box.innerHTML = `<p class="drop-hint">Touche un élément à gauche, puis son correspondant à droite.</p><div class="grid" style="grid-template-columns:1fr 1fr;gap:8px">
    <div class="stack" style="gap:8px">${left.map(l => `<button type="button" class="choice" data-l="${l.i}" style="min-height:44px">${l.txt}</button>`).join("")}</div>
    <div class="stack" style="gap:8px">${right.map(r => `<button type="button" class="choice" data-r="${r.i}" style="min-height:44px">${r.txt}</button>`).join("")}</div></div>
    <div class="row" style="margin-top:10px;justify-content:space-between"><span class="small muted mscore">0/${pairs.length} · 0 erreur</span><button class="btn small mreveal" type="button">Tout révéler</button></div>${opts.note ? `<div class="small muted mnote" style="margin-top:8px;min-height:1.4em"></div>` : ""}`;
  const upd = () => { $(".mscore", box).textContent = `${found}/${pairs.length} · ${errors} erreur${errors > 1 ? "s" : ""}`; };
  box.addEventListener("click", e => {
    const b = e.target.closest(".choice"); if (!b || b.disabled) return;
    if (b.hasAttribute("data-l")) { $$("[data-l]", box).forEach(x => x.style.borderColor = ""); sel = +b.getAttribute("data-l"); b.style.borderColor = "var(--accent)"; return; }
    if (sel === null) { toast("Choisis d'abord un élément à gauche"); return; }
    const r = +b.getAttribute("data-r"); const lb = $(`[data-l="${sel}"]`, box);
    if (r === sel) { [lb, b].forEach(x => { x.classList.add("right"); x.disabled = true; x.style.borderColor = ""; }); found++; if (opts.note) $(".mnote", box).innerHTML = `<b>${pairs[r][0]}</b> → ${pairs[r][1]}${pairs[r][2] ? " : " + pairs[r][2] : ""}`; sel = null; if (found === pairs.length) toast("Tout est associé !"); }
    else { errors++; b.classList.add("wrong"); setTimeout(() => b.classList.remove("wrong"), 600); }
    upd();
  });
  $(".mreveal", box).addEventListener("click", () => { $$(".choice", box).forEach(x => { x.classList.add("right"); x.disabled = true; }); const rb = $$("[data-r]", box); rb.sort((a, b) => a.getAttribute("data-r") - b.getAttribute("data-r")).forEach(x => x.parentNode.appendChild(x)); });
}
VIEWS.exercices = r => {
  const L = needLecon(r, "exercices"); if (!L) return;
  main.innerHTML = head(esc(L.titre), "Exercices du manuel, avec corrigés", esc(L.exercicesIntro || "Les questions des feuilles, avec des corrigés.")) + `<div id="exWrap">` +
    L.exercices.map((x, i) => {
      const tid = TX[x.texte] ? x.texte : null; const st = tid ? tc(tid) : "";
      let h = `<h2 class="section-title" style="${st}">${tid ? tchip(tid) + " " : ""}${esc(x.titre)}</h2>` + (x.consigne ? `<p class="muted">${x.consigne}</p>` : "");
      if (x.type === "revele") h += `<div class="stack">${x.items.map(it => `<details class="sec" style="${st}"><summary style="font-size:1rem">« ${esc(strip(it.q))} »</summary><div class="sec-body">${it.r}</div></details>`).join("")}</div>` + (x.qcm ? `<button class="btn small" type="button" data-exq="${i}" style="margin-top:8px">${icon("target")} S'entraîner en QCM</button><div class="quiz" id="exq${i}" style="margin-top:12px"></div>` : "");
      else if (x.type === "corrige") h += `<details class="sec" style="${st}" ${x.ouvert ? "open" : ""}><summary style="font-size:1rem">${esc(x.bouton || "Voir le corrigé")}</summary><div class="sec-body">${x.html}</div></details>`;
      else if (x.type === "association") h += `<div class="card" id="exa${i}"></div>` + (x.suite ? `<details class="sec" style="margin-top:10px"><summary style="font-size:1rem">${esc(x.suite.titre)}</summary><div class="sec-body">${x.suite.html}</div></details>` : "");
      else if (x.type === "questions") h += x.items.map(([q, a]) => `<details class="sec" style="${st}"><summary style="font-size:1rem">${esc(q)}</summary><div class="sec-body">${a}</div></details>`).join("");
      return h;
    }).join("") + `</div>`;
  L.exercices.forEach((x, i) => { if (x.type === "association") matchGame($("#exa" + i), x.paires, { note: true }); });
  $("#exWrap").addEventListener("click", e => {
    const b = e.target.closest("[data-exq]"); if (!b) return;
    const i = +b.getAttribute("data-exq"); const x = L.exercices[i]; const tid = TX[x.texte] ? x.texte : "all";
    const make = () => shuffle(x.items).slice(0, 10).map(it => { const others = shuffle(x.items.filter(y => y !== it)).slice(0, 3).map(y => y.bonne); return { id: "", l: L.id, t: tid, lvl: "A", q: x.qcm.replace("{q}", esc(strip(it.q))), ok: it.bonne, choices: [it.bonne].concat(others), exp: it.exp || "", sec: "" }; });
    const start = () => runQuiz($("#exq" + i), { questions: make(), mode: "practice", title: x.titre, again: start, facts: false, back: "#exercices-" + L.id });
    b.hidden = true; start(); $("#exq" + i).scrollIntoView({ behavior: "smooth", block: "start" });
  });
};

/* ---------- boîte à outils partagée avec app/activites.js et les schémas des leçons ---------- */
const A = CAHIER._ = {
  CFG, $, $$, esc, strip, norm, shuffle, pick, clamp, icon, wSample, plural, year, authorOf, tabsHtml,
  get LECONS() { return LECONS; }, get LX() { return LX; }, get T() { return T; }, get TX() { return TX; }, get QS() { return QS; }, get CARDS() { return CARDS; },
  S, save, tc, tchip, scope, inScope, scopeOptions, curLecon, curId, lessonOf, needLecon, needScope, dispo, head, go, render, toast, onCleanup,
  setKey: f => { keyHandler = f; }, main, VIEWS, runQuiz, matchGame, factCard, randomFact, facts, qWeight, recordAnswer, textProgress, lessonProgress
};
CAHIER.demarrer = function () {
  prepare(); applyTheme(); buildSidebar(); render();
};

})();
