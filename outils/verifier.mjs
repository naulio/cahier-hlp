#!/usr/bin/env node
/* =====================================================================
   VÉRIFICATEUR DES LEÇONS — à lancer avant chaque publication :
       node outils/verifier.mjs              → vérifie tout
       node outils/verifier.mjs --tamponner  → vérifie puis met à jour les ?v=… de index.html
   Code de sortie 1 s'il y a au moins une ERREUR (les AVERTISSEMENTS ne bloquent pas).
   ===================================================================== */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const errors = [], warns = [];
const E = (where, msg) => errors.push(`✗ ${where} : ${msg}`);
const W = (where, msg) => warns.push(`! ${where} : ${msg}`);
const isStr = v => typeof v === "string" && v.trim() !== "";
const isNum = v => typeof v === "number" && isFinite(v);
const ID = /^[a-z0-9_]+$/;

/* ---------- 1. index.html : leçons chargées, icônes disponibles ---------- */
const indexPath = path.join(ROOT, "index.html");
let index = fs.readFileSync(indexPath, "utf8");
const scripts = [...index.matchAll(/<script src="([^"?]+)(\?v=[^"]*)?"><\/script>/g)].map(m => m[1]);
const lessonFiles = scripts.filter(s => s.startsWith("lecons/"));
const icons = new Set([...index.matchAll(/<symbol id="i-([a-z0-9-]+)"/g)].map(m => m[1]));
const onDisk = fs.readdirSync(path.join(ROOT, "lecons")).filter(f => f.endsWith(".js") && !f.startsWith("_"));
onDisk.forEach(f => { if (!lessonFiles.includes("lecons/" + f)) E("index.html", `lecons/${f} existe mais n'est pas chargé (ajoute <script src="lecons/${f}?v=…"></script> avant app/demarrage.js)`); });
lessonFiles.forEach(f => { if (!fs.existsSync(path.join(ROOT, f))) E("index.html", `${f} est chargé mais n'existe pas`); });
const order = ["config.js", "app/moteur.js", "app/activites.js"];
order.forEach((f, i) => { if (scripts.indexOf(f) !== i) E("index.html", `ordre des scripts : ${f} doit être en position ${i + 1}`); });
if (scripts[scripts.length - 1] !== "app/demarrage.js") E("index.html", "app/demarrage.js doit être le dernier script");

/* ---------- 2. chargement des leçons dans un bac à sable ---------- */
const registered = [];
const sandbox = { window: {}, console: { log() { }, warn() { }, error() { } } };
sandbox.window = sandbox;
sandbox.CAHIER = { lecon: l => registered.push(l) };
vm.createContext(sandbox);
try { vm.runInContext(fs.readFileSync(path.join(ROOT, "config.js"), "utf8"), sandbox, { filename: "config.js" }); } catch (e) { E("config.js", e.message); }
const CFG = sandbox.CAHIER_CONFIG || {};
const progIds = new Set((CFG.programme || []).flatMap(p => (p.themes || []).map(t => t.id)));
const fileOf = [];
for (const f of lessonFiles) {
  const before = registered.length;
  try { vm.runInContext(fs.readFileSync(path.join(ROOT, f), "utf8"), sandbox, { filename: f }); }
  catch (e) { E(f, "erreur JavaScript : " + e.message); continue; }
  const n = registered.length - before;
  if (n !== 1) E(f, `le fichier doit appeler CAHIER.lecon({...}) exactement une fois (trouvé : ${n})`);
  for (let i = before; i < registered.length; i++) fileOf[i] = f;
}

/* ---------- 3. contrôles de contenu ---------- */
const SECTIONS = new Set(["essentiel", "auteur", "epoque", "mouvement", "ideologie", "oeuvre", "extrait", "problematique", "citations", "annotations", "pieges", "feuille", "graphique", "videos", "quiz", "frise", "duels", ""]);
const LVLS = new Set(["F", "C", "A", "T"]);
const allIds = new Map();
function tags(where, html) { // balises <b>, <em>, <i>, <p>, <ul>, <ol>, <li> équilibrées
  if (typeof html !== "string") return;
  for (const t of ["b", "em", "i", "p", "ul", "ol", "li", "strong", "u"]) {
    const o = (html.match(new RegExp(`<${t}(\\s[^>]*)?>`, "g")) || []).length, c = (html.match(new RegExp(`</${t}>`, "g")) || []).length;
    if (o !== c) E(where, `balises <${t}> déséquilibrées (${o} ouvrantes, ${c} fermantes) dans « ${html.replace(/<[^>]+>/g, "").slice(0, 60)}… »`);
  }
  if (/<script|on\w+=/i.test(html)) E(where, "HTML interdit (script ou attribut on…)");
}
function deepTags(where, v) { if (typeof v === "string") tags(where, v); else if (Array.isArray(v)) v.forEach((x, i) => deepTags(where, x)); else if (v && typeof v === "object") Object.keys(v).forEach(k => { if (typeof v[k] !== "function") deepTags(where + "." + k, v[k]); }); }

registered.forEach((L, li) => {
  const F = fileOf[li] || "?"; const at = s => `${F} › ${s}`;
  if (!L || typeof L !== "object") { E(F, "CAHIER.lecon() doit recevoir un objet"); return; }
  if (!ID.test(L.id || "")) E(at("id"), `identifiant invalide « ${L.id} » (minuscules, chiffres, _ uniquement)`);
  else if (allIds.has(L.id)) E(at("id"), `« ${L.id} » déjà utilisé par ${allIds.get(L.id)}`); else allIds.set(L.id, F);
  if (["tout", "all"].includes(L.id)) E(at("id"), "« tout » et « all » sont réservés");
  if (path.basename(F, ".js") !== L.id) W(at("id"), `par convention le fichier devrait s'appeler lecons/${L.id}.js`);
  if (!isStr(L.titre)) E(at("titre"), "titre manquant");
  if (!isNum(L.ordre)) E(at("ordre"), "ordre manquant (nombre qui fixe la position du chapitre)");
  if (!isStr(L.problematique)) W(at("problematique"), "pas de problématique (affichée en grand sur la page du chapitre)");
  if (L.programme && !progIds.has(L.programme)) W(at("programme"), `« ${L.programme} » n'existe pas dans config.js › programme`);
  if (L.icon && !icons.has(L.icon) && !(L.icones || {})[L.icon]) E(at("icon"), `icône « ${L.icon} » inconnue`);
  const T = Array.isArray(L.textes) ? L.textes : []; if (!T.length) E(at("textes"), "aucun texte");
  const TID = new Set();
  const known = new Set([...icons, ...Object.keys(L.icones || {})]);
  T.forEach((t, i) => {
    const w = at(`textes[${i}] (${t && t.id})`);
    if (!ID.test(t.id || "")) E(w, "id invalide"); else if (allIds.has(t.id)) E(w, `id « ${t.id} » déjà utilisé par ${allIds.get(t.id)}`); else { allIds.set(t.id, F); TID.add(t.id); }
    ["short", "auteur", "titre", "oeuvre", "date", "genre", "mouvement", "icon"].forEach(k => { if (!isStr(t[k])) E(w, `champ « ${k} » manquant`); });
    if (!isNum(t.annee)) E(w, "« annee » doit être un nombre (sert à la frise)");
    if (t.icon && !known.has(t.icon)) E(w, `icône « ${t.icon} » inconnue (disponibles : ${[...known].join(", ")})`);
    if (t.couleur && !(Array.isArray(t.couleur) && t.couleur.length === 2 && t.couleur.every(c => /^#[0-9a-fA-F]{6}$/.test(c)))) E(w, "couleur : [\"#clair\", \"#sombre\"] attendu");
    if (!Array.isArray(t.essentiel) || t.essentiel.length < 3) E(w, "« essentiel » : au moins 3 points");
    if (!isStr(t.auteurHtml) && !t.sameAuthorAs) W(w, "« auteurHtml » vide");
    if (t.sameAuthorAs && !T.some(x => x.id === t.sameAuthorAs)) E(w, `sameAuthorAs « ${t.sameAuthorAs} » introuvable dans la leçon`);
    (t.citations || []).forEach((c, k) => { if (!Array.isArray(c) || !isStr(c[0])) E(w + `.citations[${k}]`, "[citation, commentaire] attendu"); });
    (t.annotations || []).forEach((a, k) => { if (!Array.isArray(a) || a.length !== 3) E(w + `.annotations[${k}]`, "[où, texte manuscrit, explication] attendu"); });
    (t.anecdotes || []).forEach((a, k) => { if (!(isStr(a) || (Array.isArray(a) && isStr(a[0])))) E(w + `.anecdotes[${k}]`, "texte ou [texte, source] attendu"); else if (Array.isArray(a) && a[1] && !/^https?:\/\//.test(a[1]) && a[1].length < 4) W(w + `.anecdotes[${k}]`, "source douteuse"); });
    if (t.extrait) { if (!isStr(t.extrait.resume)) W(w, "extrait.resume vide"); (t.extrait.procedes || []).forEach((p, k) => { if (!Array.isArray(p) || p.length !== 3) E(w + `.extrait.procedes[${k}]`, "[procédé, citation, effet] attendu"); }); }
    if (L.radarAxes && t.radar) L.radarAxes.forEach(([k]) => { const v = t.radar[k]; if (!(isNum(v) && v >= 0 && v <= 5)) E(w + ".radar", `valeur « ${k} » manquante ou hors de 0-5`); });
    if (t.carte && !(isNum(t.carte.x) && isNum(t.carte.y) && t.carte.x >= 0 && t.carte.x <= 10 && t.carte.y >= 0 && t.carte.y <= 10)) E(w + ".carte", "x et y entre 0 et 10 attendus");
    if (t.palais && !(isStr(t.palais.salle) && isStr(t.palais.objet) && isStr(t.palais.image))) E(w + ".palais", "salle, objet et image attendus");
    (t.photos || []).forEach((p, k) => { if (!p || !isStr(p.src) || !fs.existsSync(path.join(ROOT, p.src))) E(w + `.photos[${k}]`, `fichier introuvable : ${p && p.src}`); });
    deepTags(w, t);
  });
  const some = k => T.filter(t => t[k]).length; ["radar", "carte", "palais"].forEach(k => { const n = some(k); if (n && n < T.length) W(at("textes"), `« ${k} » présent pour ${n}/${T.length} textes : l'activité correspondante reste masquée tant qu'il manque des textes`); });
  const tOk = (t, allowAll) => TID.has(t) || (allowAll && t === "all");
  const qSeen = new Set();
  (L.questions || []).forEach((q, i) => {
    const w = at(`questions[${i}]`);
    if (!Array.isArray(q) || q.length !== 6) { E(w, "[texte, niveau, question, [BONNE, fausse, fausse, fausse], explication, section] attendu"); return; }
    if (!tOk(q[0], true)) E(w, `texte « ${q[0]} » inconnu`);
    if (!LVLS.has(q[1])) E(w, `niveau « ${q[1]} » (F, C, A ou T)`);
    if (!isStr(q[2])) E(w, "question vide"); else { const kq = q[0] + "|" + q[2]; if (qSeen.has(kq)) W(w, "question en double pour ce texte"); qSeen.add(kq); }
    if (!Array.isArray(q[3]) || q[3].length < 2 || !q[3].every(isStr)) E(w, "réponses : liste de textes, la BONNE en premier");
    else { if (q[3].length !== 4) W(w, `${q[3].length} réponses au lieu de 4`); if (new Set(q[3]).size !== q[3].length) E(w, "deux réponses identiques"); }
    if (!isStr(q[4])) W(w, "pas d'explication");
    if (!SECTIONS.has(q[5])) E(w, `section « ${q[5]} » inconnue`);
    deepTags(w, q);
  });
  (L.flashcards || []).forEach((c, i) => { const w = at(`flashcards[${i}]`); if (!Array.isArray(c) || c.length !== 3 || !isStr(c[1]) || !isStr(c[2])) E(w, "[texte, recto, verso] attendu"); else if (!tOk(c[0], true)) E(w, `texte « ${c[0]} » inconnu`); deepTags(w, c); });
  (L.pieges || []).forEach((p, i) => { const w = at(`pieges[${i}]`); if (!Array.isArray(p) || !isStr(p[0]) || !isStr(p[1])) E(w, "[titre, explication, texte] attendu"); else if (!tOk(p[2], true)) E(w, `texte « ${p[2]} » inconnu`); deepTags(w, p); });
  (L.frise || []).forEach((f, i) => { if (!Array.isArray(f) || !isNum(f[0]) || !isStr(f[1]) || !isStr(f[2])) E(at(`frise[${i}]`), "[année (nombre), libellé, calque] attendu"); });
  (L.duels || []).forEach((d, i) => { const w = at(`duels[${i}]`); if (!tOk(d.a) || !tOk(d.b)) E(w, "a et b doivent être des textes de la leçon"); if (!isStr(d.titre) || !Array.isArray(d.lignes) || !d.lignes.length) E(w, "titre et lignes attendus"); if (d.q && !(isStr(d.q[0]) && Array.isArray(d.q[1]) && d.q[1].length >= 2)) E(w + ".q", "[question, [BONNE, fausses…], explication] attendu"); deepTags(w, d); });
  (L.procedes || []).forEach((p, i) => { const w = at(`procedes[${i}]`); if (!Array.isArray(p) || p.length !== 5 || !tOk(p[0]) || !isStr(p[2]) || !Array.isArray(p[3]) || p[3].length !== 3) E(w, "[texte, phrase, BON procédé, [3 faux], explication] attendu"); else if (p[3].includes(p[2])) E(w, "la bonne réponse figure aussi parmi les fausses"); });
  (L.trous || []).forEach((x, i) => { const w = at(`trous[${i}]`); if (!Array.isArray(x) || !tOk(x[0]) || !isStr(x[1])) E(w, "[texte, phrase] attendu"); else if (!/\{[^}]+\}/.test(x[1])) E(w, "aucun {mot} à trouver"); });
  (L.associations || []).forEach((a, i) => { const w = at(`associations[${i}]`); if (!isStr(a.titre) || !Array.isArray(a.paires) || a.paires.length < 2) E(w, "{ titre, paires: [[a, b], …] } attendu"); });
  if (L.radarAxes && !(Array.isArray(L.radarAxes) && L.radarAxes.every(a => Array.isArray(a) && isStr(a[0]) && isStr(a[1])))) E(at("radarAxes"), "[[clé, libellé], …] attendu");
  if (L.carteAxes && !(Array.isArray(L.carteAxes.x) && Array.isArray(L.carteAxes.y))) E(at("carteAxes"), "{ x: [gauche, droite], y: [bas, haut] } attendu");
  (L.exercices || []).forEach((x, i) => {
    const w = at(`exercices[${i}] (${x.type})`);
    if (!isStr(x.titre)) E(w, "titre manquant");
    if (x.texte && !tOk(x.texte)) E(w, `texte « ${x.texte} » inconnu`);
    if (x.type === "revele") { if (!Array.isArray(x.items) || !x.items.length) E(w, "items attendus"); else if (x.qcm && (x.items.length < 4 || !x.items.every(it => isStr(it.bonne)))) E(w, "qcm : au moins 4 items, chacun avec « bonne »"); }
    else if (x.type === "corrige") { if (!isStr(x.html)) E(w, "html (corrigé) attendu"); }
    else if (x.type === "association") { if (!Array.isArray(x.paires) || x.paires.length < 2) E(w, "paires attendues"); }
    else if (x.type === "questions") { if (!Array.isArray(x.items) || !x.items.every(q => Array.isArray(q) && isStr(q[0]) && isStr(q[1]))) E(w, "items : [[question, réponse], …] attendu"); }
    else E(w, "type inconnu (revele, corrige, association, questions)");
    deepTags(w, x);
  });
  (L.schemas || []).forEach((s, i) => { if (!isStr(s.id) || !isStr(s.titre) || typeof s.render !== "function") E(at(`schemas[${i}]`), "{ id, titre, render(box, api) } attendu"); });
  (L.sources || []).forEach((s, i) => { if (!Array.isArray(s) || !isStr(s[1]) || !/^https?:\/\//.test(s[2] || "")) E(at(`sources[${i}]`), "[groupe, libellé, url http(s)] attendu"); });
  const nq = (L.questions || []).length, nc = (L.flashcards || []).length;
  T.forEach(t => { const q = (L.questions || []).filter(x => x[0] === t.id).length, c = (L.flashcards || []).filter(x => x[0] === t.id).length; if (q < 5) W(at(t.id), `seulement ${q} question(s) QCM`); if (c < 4) W(at(t.id), `seulement ${c} flashcard(s)`); });
  console.log(`• ${F} : « ${L.titre} » — ${T.length} textes, ${nq} questions, ${nc} flashcards, ${(L.exercices || []).length} exercices, ${(L.schemas || []).length} schémas`);
});

/* ---------- 4. bilan (+ tampon de version) ---------- */
warns.forEach(w => console.log(w));
errors.forEach(e => console.log(e));
console.log(`\n${registered.length} leçon(s) · ${errors.length} erreur(s) · ${warns.length} avertissement(s)`);
if (errors.length) { console.log("→ Corrige les erreurs avant de publier."); process.exit(1); }
if (process.argv.includes("--tamponner")) {
  const v = new Date().toISOString().slice(0, 16).replace(/[-:T]/g, "");
  index = index.replace(/\?v=[0-9A-Za-z_-]+/g, "?v=" + v);
  fs.writeFileSync(indexPath, index);
  console.log(`→ index.html tamponné : ?v=${v} (les navigateurs rechargeront les fichiers modifiés)`);
}
console.log("→ OK, prêt à publier.");
