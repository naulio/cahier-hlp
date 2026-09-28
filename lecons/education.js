/* =======================================================================
   LEÇON « Éducation, transmission et émancipation »
   Spécialité HLP, Terminale · Semestre 1 · La recherche de soi
   Format documenté dans lecons/_modele.js ; procédure d'ajout dans CLAUDE.md.
   - Les photos des feuilles ne sont pas publiées (droits d'auteur : Camus,
     Arendt, adaptation Demerson, pages de manuel) ; citations protégées courtes.
   ======================================================================= */
(function () {
"use strict";

/* ---------------------------------------------------------------------
   SCHÉMAS PROPRES À CE CHAPITRE (onglets de la page « Graphiques »).
   Chaque schéma : { id, titre, texte (id du texte lié), render(box, api) }.
   api = { esc, icon, tchip, tc, tabsHtml, $, $$, S, save, onCleanup, go, toast }
   --------------------------------------------------------------------- */
const DAY23 = [
  ["4 h", "Lever ; l'Écriture sainte lue par le page Anagnostes ; prières", "« S'éveillait donc Gargantua environ quatre heures du matin »"],
  ["Puis", "Aux « lieux secrets » : le précepteur répète et explique la lecture", "« Puis allait aux lieux secrets faire excrétion des digestions naturelles »"],
  ["", "Observation du ciel (soleil, lune), comparée à la veille", "« considéraient l'état du ciel »"],
  ["Ce fait", "Habillage ; répétition des leçons de la veille, « cas pratiques »", "« Ce fait, était habillé, peigné, testonné, accoutré et parfumé »"],
  ["Puis", "Trois heures de lecture", "« Puis par trois bonnes heures lui était fait lecture »"],
  ["Ce fait", "Jeux au Grand Bracque ou aux prés : balle, paume, pile trigone", "« s'exerçant les corps comme ils avaient les âmes auparavant exercé »"],
  ["", "Retour : frictions, chemise changée, récitation de sentences", "« récitaient clairement et éloquemment quelques sentences »"],
  ["Au commencement", "Dîner : lecture de prouesses, puis discussion savante sur les aliments", "« Au commencement du repas était lue quelque histoire plaisante »"],
  ["Après", "Cotignac, cure-dents de lentisque, lavage, cantiques", "« Après devisaient des leçons lues au matin »"],
  ["Ce fait", "Cartes : l'arithmétique en s'amusant", "« Ce fait, on apportait des cartes, non pour jouer »"],
  ["", "Géométrie, astronomie, musique (chant à 4 et 5 parties)", "« comme géométrie, astronomie et musique »"]
];
function clockSVG(esc) {
  const S2 = 380, c = S2 / 2, r1 = 78, r2 = 158, n = DAY23.length; let g = "";
  const P = (r, a) => [c + r * Math.cos(a), c + r * Math.sin(a)];
  DAY23.forEach((d, i) => {
    const a0 = -Math.PI / 2 + i * 2 * Math.PI / n + 0.012, a1 = -Math.PI / 2 + (i + 1) * 2 * Math.PI / n - 0.012;
    const [x0, y0] = P(r2, a0), [x1, y1] = P(r2, a1), [x2, y2] = P(r1, a1), [x3, y3] = P(r1, a0);
    const [lx, ly] = P((r1 + r2) / 2, (a0 + a1) / 2);
    g += `<g class="sector" data-s="${i}" tabindex="0" role="button" aria-label="Étape ${i + 1} : ${esc(d[1])}"><path d="M${x0},${y0} A${r2},${r2} 0 0 1 ${x1},${y1} L${x2},${y2} A${r1},${r1} 0 0 0 ${x3},${y3} Z" style="fill:var(--c-rab23);fill-opacity:${i % 2 ? 0.55 : 0.85};stroke:var(--surface);stroke-width:2"/><text x="${lx}" y="${ly + 5}" text-anchor="middle" class="secnum">${i + 1}</text></g>`;
  });
  const [tx, ty] = P(r2 + 16, -Math.PI / 2);
  g += `<text x="${tx}" y="${ty}" text-anchor="middle" class="rlab">4 h du matin</text><text x="${c}" y="${c - 6}" text-anchor="middle" class="ctitle">Ch. 23</text><text x="${c}" y="${c + 16}" text-anchor="middle" class="rtick">l'emploi du temps</text>`;
  return `<svg viewBox="0 0 ${S2} ${S2}" role="img" aria-label="Horloge de la journée de Gargantua" style="width:100%;max-width:380px;height:auto;display:block;margin:0 auto">${g}</svg>`;
}
function loopSVG() {
  const S2 = 300, c = 150, R = 92, lab = ["boire", "manger", "dormir"]; let g = `<defs><marker id="arr11" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--c-rab11)"/></marker></defs>`;
  const P = a => [c + R * Math.cos(a), c + R * Math.sin(a)];
  const ang = [-Math.PI / 2, Math.PI / 6, 5 * Math.PI / 6];
  ang.forEach((a, i) => { const b = ang[(i + 1) % 3]; const a0 = a + 0.42, a1 = (b < a ? b + 2 * Math.PI : b) - 0.42; const [x0, y0] = P(a0), [x1, y1] = P(a1); g += `<path d="M${x0},${y0} A${R},${R} 0 0 1 ${x1},${y1}" style="fill:none;stroke:var(--c-rab11);stroke-width:2" marker-end="url(#arr11)"/>`; });
  ang.forEach((a, i) => { const [x, y] = P(a); g += `<circle cx="${x}" cy="${y}" r="34" style="fill:var(--surface);stroke:var(--c-rab11);stroke-width:2"/><text x="${x}" y="${y + 5}" text-anchor="middle" class="nodelab">${lab[i]}</text>`; });
  g += `<text x="${c}" y="${c - 4}" text-anchor="middle" class="ctitle">Ch. 11</text><text x="${c}" y="${c + 16}" text-anchor="middle" class="rtick">×3, sans fin</text>`;
  return `<svg viewBox="0 0 ${S2} ${S2}" role="img" aria-label="Boucle boire, manger, dormir" style="width:100%;max-width:300px;height:auto;display:block;margin:0 auto">${g}</svg>`;
}
function smoothPath(pts) { let d = `M${pts[0][0]},${pts[0][1]}`; for (let i = 0; i < pts.length - 1; i++) { const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2; const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6], c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]; d += ` C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0]},${p2[1]}`; } return d; }
function rousseauSVG(mode) {
  const W = 660, H = 340, x0 = 64, x1 = 610, y0 = 290, y1 = 34; const X = v => x0 + v * (x1 - x0), Y = v => y0 - v * (y0 - y1);
  const ind = mode !== "espece";
  const animal = ind ? [[0, .04], [.04, .2], [.09, .32], [.15, .36], [.3, .36], [1, .36]] : [[0, .36], [1, .36]];
  const homme = ind ? [[0, .02], [.18, .2], [.38, .5], [.58, .82], [.72, .9], [.86, .62], [1, .2]] : [[0, .1], [.15, .22], [.28, .17], [.45, .45], [.57, .36], [.72, .7], [.84, .58], [1, .93]];
  const m = pts => pts.map(p => [X(p[0]).toFixed(1), Y(p[1]).toFixed(1)].map(Number));
  let g = `<line x1="${x0}" y1="${y0}" x2="${x1}" y2="${y0}" class="axis"/><line x1="${x0}" y1="${y0}" x2="${x0}" y2="${y1 - 8}" class="axis"/>`;
  g += `<text x="${x1}" y="${y0 + 26}" text-anchor="end" class="rtick">${ind ? "Temps : la vie d'un individu →" : "Temps : « mille ans » de l'espèce →"}</text><text x="${x0 - 10}" y="${y1 - 14}" class="rtick">Facultés acquises ↑</text>`;
  g += `<path d="${smoothPath(m(animal))}" style="fill:none;stroke:var(--faint);stroke-width:2.5"/>`;
  g += `<path d="${smoothPath(m(homme))}" style="fill:none;stroke:var(--c-rou);stroke-width:2.5"/>`;
  const la = m(animal).slice(-1)[0], lh = m(homme).slice(-1)[0];
  g += `<text x="${la[0] - 4}" y="${la[1] - 10}" text-anchor="end" class="rlab">L'animal</text><text x="${lh[0] - 10}" y="${lh[1] - 12}" text-anchor="end" class="rlab">L'homme</text>`;
  if (ind) g += `<text x="${X(.17)}" y="${Y(.36) - 26}" class="note2">« au bout de quelques mois, ce qu'il sera toute sa vie »</text><circle cx="${X(1)}" cy="${Y(.2)}" r="5" style="fill:var(--c-rou);stroke:var(--surface);stroke-width:2"/><text x="${X(.34)}" y="${Y(.06)}" class="note2">« plus bas que la bête même » (vieillesse, accidents) →</text><text x="${X(.44)}" y="${Y(.9) - 6}" class="note2">perfectibilité : progrès</text>`;
  else g += `<text x="${X(.02)}" y="${Y(.36) - 12}" class="note2">l'espèce animale : la même après mille ans</text><text x="${X(.3)}" y="${Y(.62)}" class="note2">« ses lumières et ses erreurs, ses vices et ses vertus »</text>`;
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Schéma de Rousseau : l'animal et l'homme" style="width:100%;height:auto;display:block">${g}</svg>`;
}
function arendtSVG(wall) {
  const W = 660, H = 270; let g = `<defs><marker id="arrA" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--c-are)"/></marker></defs>`;
  g += `<rect x="8" y="20" width="270" height="230" rx="14" style="fill:var(--surface-2);stroke:var(--rule);stroke-width:1.5"/><text x="143" y="52" text-anchor="middle" class="ctitle">Les adultes</text><text x="143" y="74" text-anchor="middle" class="rtick">le monde commun, plus vieux</text><text x="143" y="92" text-anchor="middle" class="rtick">que les enfants</text>`;
  g += `<rect x="382" y="20" width="270" height="230" rx="14" style="fill:${wall ? "var(--bad-soft)" : "var(--surface-2)"};stroke:var(--rule);stroke-width:1.5"/><text x="517" y="52" text-anchor="middle" class="ctitle">Les enfants</text><text x="517" y="74" text-anchor="middle" class="rtick">${wall ? "une enfance « autonome »," : "les nouveaux venus,"}</text><text x="517" y="92" text-anchor="middle" class="rtick">${wall ? "« selon des lois propres »" : "à introduire dans le monde"}</text>`;
  if (!wall) g += `<line x1="330" y1="14" x2="330" y2="256" style="stroke:var(--c-are);stroke-width:3;stroke-dasharray:8 7"/><text x="330" y="268" text-anchor="middle" class="rtick">la ligne</text>`;
  else { for (let r = 0; r < 12; r++) { const off = r % 2 ? 0 : 11; for (let k = -1; k < 2; k++) g += `<rect x="${306 + off + k * 22}" y="${14 + r * 20}" width="22" height="20" style="fill:var(--surface);stroke:var(--c-are);stroke-width:1.5"/>`; } g += `<text x="330" y="268" text-anchor="middle" class="rtick" style="fill:var(--bad)">le mur</text>`; }
  ["ce qu'est le monde", "l'autorité", "le passé"].forEach((l, i) => { const y = 130 + i * 40; if (!wall) g += `<line x1="200" y1="${y}" x2="455" y2="${y}" style="stroke:var(--c-are);stroke-width:2" marker-end="url(#arrA)"/><text x="215" y="${y - 7}" class="note2">${l}</text>`; else g += `<line x1="200" y1="${y}" x2="292" y2="${y}" style="stroke:var(--c-are);stroke-width:2"/><text x="215" y="${y - 7}" class="note2">${l}</text><text x="296" y="${y + 6}" class="xmark">✕</text>`; });
  return `<svg viewBox="0 0 ${W} ${H + 8}" role="img" aria-label="Schéma d'Arendt : la ligne et le mur" style="width:100%;height:auto;display:block">${g}</svg>`;
}

const SCHEMAS = [
  { id: "horloge", titre: "Horloge de Gargantua", texte: "rab23", render(box, api) {
    const { esc, tchip, tc, $, $$ } = api;
    box.innerHTML = `<div class="grid g2" style="align-items:start"><div class="card" style="${tc("rab23")}"><div class="row" style="justify-content:space-between">${tchip("rab23")}<span class="small muted">touche une étape</span></div>${clockSVG(esc)}<p class="small muted">Ordre de la journée d'après l'extrait. Le texte ne donne que deux repères de durée : le lever « environ quatre heures du matin » et « trois bonnes heures » de lecture ; les secteurs sont donc égaux.</p></div>
      <div class="stack"><div class="card" id="dayDetail"><p class="eyebrow">Étape</p><p class="muted">Choisis un secteur de l'horloge.</p></div><div class="card" style="${tc("rab11")}">${tchip("rab11")}${loopSVG()}<p class="small">Au ch. 11, pas d'emploi du temps : une <b>boucle</b> « boire, manger et dormir », répétée trois fois en changeant l'ordre. Le ch. 23 remplace la boucle par une <b>progression</b> rythmée par les connecteurs (Puis, Ce fait, Au commencement, Après), surlignés en cours.</p></div></div></div>
      <ol class="stack" style="margin-top:12px;padding-left:1.4em" id="dayList">${DAY23.map((d, i) => `<li data-li="${i}"><b>${d[0] ? esc(d[0]) + " · " : ""}</b>${esc(d[1])}</li>`).join("")}</ol>`;
    const showStep = i => { const d = DAY23[i]; $("#dayDetail").innerHTML = `<p class="eyebrow">Étape ${i + 1} / ${DAY23.length}${d[0] ? " · connecteur : « " + esc(d[0]) + " »" : ""}</p><p style="font-size:1.1rem"><b>${esc(d[1])}</b></p><p class="quote" style="${tc("rab23")}">${esc(d[2])}</p>`; $$("#dayList li").forEach(li => li.style.fontWeight = +li.getAttribute("data-li") === i ? "700" : ""); $$(".sector").forEach(s => s.classList.toggle("cur", +s.getAttribute("data-s") === i)); };
    box.addEventListener("click", e => { const s = e.target.closest(".sector"); if (s) showStep(+s.getAttribute("data-s")); });
    box.addEventListener("keydown", e => { const s = e.target.closest(".sector"); if (s && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); showStep(+s.getAttribute("data-s")); } });
    showStep(0);
  } },
  { id: "rousseau", titre: "Rousseau : l'animal et l'homme", texte: "rou", render(box, api) {
    const { tchip, tc, tabsHtml, $, $$, S, save } = api;
    const md = S.extra.rouMode || "individu";
    box.innerHTML = `<div class="card" style="${tc("rou")}"><div class="row" style="justify-content:space-between;margin-bottom:6px">${tchip("rou")}${tabsHtml([["individu", "L'individu"], ["espece", "L'espèce"]], md).replace('class="tabs"', 'class="tabs" style="margin:0"').replace(/data-tab2/g, "data-rm")}</div>
      <div class="row small" style="gap:12px;margin-bottom:4px"><span><svg width="26" height="10" aria-hidden="true"><line x1="1" y1="5" x2="25" y2="5" style="stroke:var(--faint);stroke-width:3"/></svg> L'animal</span><span><svg width="26" height="10" aria-hidden="true"><line x1="1" y1="5" x2="25" y2="5" style="stroke:var(--c-rou);stroke-width:3"/></svg> L'homme</span></div>
      <div id="rouChart"></div><p class="small muted">Schéma qualitatif, sans données chiffrées : il illustre l'argument du texte. L'animal atteint vite un plateau (l'instinct) ; l'homme progresse grâce à la perfectibilité… et peut retomber « plus bas que la bête ».</p></div>`;
    const drawRou = m => { $("#rouChart").innerHTML = rousseauSVG(m); $$("[data-rm]").forEach(b => b.setAttribute("aria-selected", b.getAttribute("data-rm") === m)); S.extra.rouMode = m; save("extra"); };
    $$("[data-rm]").forEach(b => b.addEventListener("click", () => drawRou(b.getAttribute("data-rm")))); drawRou(md);
  } },
  { id: "ferry", titre: "Ferry : croyances / connaissances", texte: "fer", render(box, api) {
    const { esc, tchip, tc } = api;
    const lois = [[1833, "Loi Guizot : une école primaire par commune"], [1879, "Loi Paul Bert : une école normale d'instituteurs et d'institutrices par département"], [1881, "16 juin : gratuité de l'école primaire publique"], [1882, "28 mars : obligation (6-13 ans) et laïcité des programmes"], [1883, "17 novembre : Lettre aux instituteurs"], [1886, "30 octobre : loi Goblet, personnel laïque"], [1905, "9 décembre : séparation des Églises et de l'État"]];
    box.innerHTML = `<div class="card" style="${tc("fer")}">${tchip("fer")}<p style="margin-top:8px">La loi du 28 mars 1882 distingue « deux domaines trop longtemps confondus » :</p>
      <div class="grid g2" style="margin-top:10px"><div class="card" style="border-top:5px solid var(--faint)"><p class="eyebrow">Domaine 1</p><h3 style="font-size:1.3rem">Les croyances</h3><p class="quote">« personnelles, libres et variables »</p><p>→ <b>aux familles et à l'Église</b> : l'instruction <b>religieuse</b>.</p></div>
      <div class="card" style="border-top:5px solid var(--c-fer)"><p class="eyebrow">Domaine 2</p><h3 style="font-size:1.3rem">Les connaissances</h3><p class="quote">« communes et indispensables à tous, de l'aveu de tous »</p><p>→ <b>à l'école</b> : l'instruction <b>morale et civique</b> (« le devoir et le droit ») + lire, écrire, compter.</p></div></div>
      <div class="note" style="margin-top:12px"><b>La laïcité scolaire</b> sépare ces deux domaines. Mais la loi n'est pas « purement négative » : l'école garde une morale, présentée comme universelle « comme celles du langage ou du calcul ».</div></div>
      <h2 class="section-title">Les lois scolaires, dans l'ordre</h2>
      <div class="tl" style="margin-top:6px">${lois.map(([y, l]) => `<div class="tl-item ${y === 1883 ? "tl-text" : ""}" style="${tc("fer")}"><span class="tl-year">${y}</span><span class="tl-dot"></span><div class="tl-hist" style="${y === 1883 || y === 1882 || y === 1881 ? "color:var(--ink);font-weight:700" : ""}">${esc(l)}</div></div>`).join("")}</div>`;
  } },
  { id: "arendt", titre: "Arendt : la ligne et le mur", texte: "are", render(box, api) {
    const { tchip, tc, $ } = api;
    let wall = false;
    box.innerHTML = `<div class="card" style="${tc("are")}"><div class="row" style="justify-content:space-between;margin-bottom:8px">${tchip("are")}<button class="btn small" type="button" id="wallBtn">Et si la ligne devenait un mur ?</button></div><div id="arChart"></div><p id="arCap" class="small"></p></div>`;
    const drawA = () => { $("#arChart").innerHTML = arendtSVG(wall); $("#wallBtn").textContent = wall ? "Revenir à la ligne" : "Et si la ligne devenait un mur ?"; $("#arCap").innerHTML = wall ? "<b>Le mur</b> : les enfants seraient isolés « de la communauté des adultes », comme si l'enfance était « une phase autonome », capable de vivre « selon des lois propres ». Arendt refuse ce monde des enfants livré à lui-même." : "<b>La ligne</b> : on ne traite pas les enfants comme de grandes personnes, et on n'« éduque » pas les adultes. Mais la ligne laisse passer ce que les adultes transmettent : ce qu'est le monde, l'autorité, le passé."; };
    $("#wallBtn").addEventListener("click", () => { wall = !wall; drawA(); }); drawA();
  } }
];

CAHIER.lecon({
  id: "education",
  ordre: 1,
  programme: "s1-education",
  titre: "Éducation, transmission et émancipation",
  partie: "Semestre 1 · La recherche de soi",
  problematique: "L'éducation est-elle neutre ?",
  resume: "Dix textes, de Rabelais (1534-1535) à Arendt (1958), pour se demander si l'éducation peut être neutre.",
  icon: "school",
  libelles: { ideologie: "Vision de l'éducation", problematique: "Neutre ?" },
  numerotation: "Deux numérotations se croisent : la suite manuscrite du professeur (1 → 7 : Rabelais ×2, Rousseau, Camus, Flaubert, Balzac, Arendt) et les numéros imprimés conservés par Hugo (4), Ferry (5) et Péguy (6). Chaque fiche affiche les deux.",
  friseIntro: "De Pantagruel (1532) à la BD Paroles d'école (2013), avec les repères historiques.",
  palais: {
    nom: "L'école-mémoire",
    intro: "Une école de 10 salles, une par texte, dans l'ordre chronologique : on entre en haut à gauche, on descend, puis on remonte à droite. Chaque salle cache un objet-symbole. Visualise-le vraiment : c'est ce qui fixe le souvenir."
  },
  exercicesIntro: "Les questions imprimées sur les feuilles de Rabelais (texte 1) et de Péguy (texte 6), avec des corrigés.",

  /* =====================================================================
     TEXTES (ordre chronologique). Chaque texte garde sa couleur ([clair, sombre]) et son pictogramme partout.
     ===================================================================== */
  textes: [

    /* ─── 1. Rabelais, ch. 11 ─── */
    {
      id: "rab11",
      short: "Rabelais, ch. 11",
      auteur: "François Rabelais",
      auteurDates: "v. 1483/1494-1553",
      titre: "De l'adolescence de Gargantua",
      oeuvre: "Gargantua, chapitre 11",
      date: "1534 ou 1535",
      annee: 1535,
      genre: "Chronique comique en prose (roman)",
      mouvement: "Humanisme (Renaissance)",
      nums: { prof: "1", imprime: "TEXTE 1", detail: "Feuille polycopiée « TEXTE 1 »." },
      icon: "basket",
      couleur: ["#6c2d0a", "#faccb7"],
      motcle: "Boire, manger, dormir",
      symbole: "Le panier et la soupe",
      essentiel: [
        "<b>Rabelais</b> (v. 1483/1494-1553), moine devenu médecin, grand <b>humaniste</b> de la Renaissance. <em>Gargantua</em> paraît à Lyon en <b>1534 ou 1535</b>, après <em>Pantagruel</em> (1532), sous le pseudonyme-anagramme <b>Alcofribas Nasier</b>.",
        "De 3 à 5 ans, Gargantua vit « comme <b>tous les petits enfants du pays</b> » : <b>boire, manger, dormir</b>, formule répétée trois fois en changeant l'ordre. Aucun maître, aucune méthode : l'enfant suit ses besoins.",
        "Procédés : <b>énumération</b> interminable à l'<b>imparfait d'habitude</b>, registre bas et <b>scatologique</b>, <b>proverbes pris au pied de la lettre</b> (sens propre / sens figuré : « mettait la charrue avant les bœufs », « battait froid »…).",
        "Ton <b>ironique et satirique</b> (noté en cours) : à la fin, l'enfant mange dans l'écuelle des petits chiens de son père : <b>animalisation</b>. Sans éducation, l'enfant reste une petite bête.",
        "Problématique : cette « non-éducation » n'est <b>pas neutre</b> : laisser faire la nature fabrique un petit animal. Par contraste, elle prépare l'éducation humaniste du ch. 23 (Ponocrates)."
      ],
      auteurHtml: "<p><b>François Rabelais</b> naît vers 1483 ou 1494 (date discutée) à <b>La Devinière</b>, près de Chinon (Touraine), et meurt en <b>1553</b> à Paris.</p><ul><li><b>Moine</b> : d'abord franciscain (Fontenay-le-Comte), où il étudie le grec, puis bénédictin (Maillezais) avec l'autorisation du pape.</li><li><b>Médecin</b> : études à Montpellier (1530), médecin de l'Hôtel-Dieu de Lyon (1532).</li><li><b>Écrivain</b> : <em>Pantagruel</em> (1532, Lyon, Claude Nourry), <em>Gargantua</em> (1534/1535, Lyon, François Juste), <em>Tiers Livre</em> (1546, premier livre signé de son vrai nom), <em>Quart Livre</em> (1552).</li><li><b>Censuré</b> : la faculté de théologie de la Sorbonne dénonce <em>Pantagruel</em> (1533), condamne ses livres (1543) puis le <em>Quart Livre</em> (1552).</li></ul>",
      anecdotes: [
        ["<b>Alcofribas Nasier</b>, le pseudonyme de <em>Pantagruel</em> et de <em>Gargantua</em>, est l'anagramme exacte de « François Rabelais ».", "https://en.wikipedia.org/wiki/Fran%C3%A7ois_Rabelais"],
        ["« <b>Science sans conscience n'est que ruine de l'âme</b> » n'est <b>pas</b> dans <em>Gargantua</em> : c'est dans <em>Pantagruel</em> (ch. 8), dans la lettre que Gargantua écrit à son fils. Piège classique !", "https://renom.univ-tours.fr/fr/index/corpus/francois-rabelais/pantagruel-1542/comment-pantagruel-estant-paris-receut-letres-de-son-pere-gargantua-et-la-copie-d-icelles-chapitre"],
        ["Le nom « Gargantua » vient du cri de son père à sa naissance : « Que grand tu as ! » (sous-entendu : le gosier), parce que le bébé hurlait « À boire ! ».", "feuille (chapeau du texte 1)"]
      ],
      epoque: "<p><b>Renaissance</b> (XVIe siècle), règne de <b>François Ier</b> (1515-1547). L'<b>imprimerie</b> diffuse les livres (Lyon est un grand centre d'édition). On redécouvre les textes antiques en latin, en <b>grec</b> et en hébreu.</p><p><b>Religion</b> : la <b>Réforme</b> protestante (Luther, 1517) divise l'Europe ; les « évangéliques » veulent lire la Bible directement. L'<b>affaire des Placards</b> (octobre 1534) durcit la répression.</p><p><b>École</b> : l'enseignement reste dominé par la <b>scolastique</b> de la Sorbonne (par cœur, commentaires, disputes en latin). Les humanistes (Érasme, Budé) réclament une pédagogie nouvelle.</p>",
      mouvementHtml: "<p><b>L'humanisme</b> :</p><ul><li>confiance en l'homme, en sa raison et en sa capacité à se perfectionner par l'étude ;</li><li>retour aux sources antiques (<em>ad fontes</em>) : lire les Anciens et la Bible dans le texte ;</li><li>critique de la scolastique médiévale (par cœur, gloses sans fin) ;</li><li>idéal d'un savoir <b>encyclopédique</b> et d'une éducation complète : corps, esprit, morale, foi ;</li><li>chez Rabelais : le <b>rire</b> et la satire comme armes critiques.</li></ul>",
      ideologie: "<p>Rabelais oppose <b>trois éducations</b> dans <em>Gargantua</em> :</p><ol><li><b>La nature seule</b> (ch. 11) : l'enfant suit ses besoins, comme un animal.</li><li><b>L'éducation scolastique</b> des « sophistes » (Thubal Holoferne) : par cœur et mécanique, elle rend Gargantua « fat, niais et ignorant ».</li><li><b>L'éducation humaniste</b> de Ponocrates (ch. 23) : encyclopédique, active, équilibrée, pieuse.</li></ol><p>Idée clé : l'homme n'est pas achevé à la naissance ; c'est l'éducation qui le fait sortir de l'animalité.</p>",
      oeuvreHtml: "<p><em>Gargantua</em> est une chronique comique en prose qui parodie les romans de chevalerie (titre de l'édition de 1542 : <em>La Vie très horrifique du grand Gargantua, père de Pantagruel</em>). Étapes : naissance du géant, qui sort par l'oreille de sa mère Gargamelle en criant « À boire ! » ; <b>enfance</b> ; <b>éducations</b> (les sophistes, puis Ponocrates à Paris) ; <b>guerre picrocholine</b> contre le roi colérique Picrochole, née d'une dispute sur des fouaces, avec frère Jean des Entommeures ; enfin l'<b>abbaye de Thélème</b>, dont la seule règle est « Fais ce que voudras ».</p>",
      place: "<p>Le ch. 11 se situe dans l'<b>enfance</b> du géant, avant tout précepteur. Au ch. 13, Gargantua invente un « torche-cul », ce qui révèle son intelligence à son père Grandgousier ; celui-ci le confie alors à un précepteur sophiste (ch. 14), avant de choisir <b>Ponocrates</b> (ch. 23, texte 2).</p>",
      extrait: {
        resume: "De trois à cinq ans, Gargantua est élevé « selon les dispositions prises par son père », c'est-à-dire comme tous les petits enfants du pays : boire, manger, dormir. Suit une énumération interminable de ses occupations, sales et comiques (se vautrer dans la boue, se moucher sur sa manche, boire dans sa pantoufle…), puis d'expressions proverbiales qu'il réalise au pied de la lettre. À la fin, il mange avec les petits chiens de son père.",
        mouvements: [
          "l. 1-5 · Le programme : « boire, manger et dormir », répété en boucle (permutation des trois verbes).",
          "l. 6-12 · Les habitudes d'un petit animal sale : boue, pipi, caca, morve, soupe (registre scatologique).",
          "l. 12-29 · La fantaisie verbale : des dizaines d'expressions proverbiales prises au pied de la lettre.",
          "l. 29-32 · La chute : il partage l'écuelle des petits chiens de son père (animalisation)."
        ],
        procedes: [
          ["Énumération / accumulation", "« se vautrait […], se mâchurait le nez, se barbouillait la figure, éculait ses souliers… »", "Profusion, désordre, démesure du géant : une vie sans ordre ni but."],
          ["Imparfait d'habitude (itératif)", "« Il se vautrait toujours dans la fange »", "Des gestes répétés chaque jour, sans aucun progrès."],
          ["Répétition avec permutation", "« à boire, manger et dormir ; à manger, dormir et boire ; à dormir, boire et manger »", "Cercle vicieux : la vie réduite aux besoins du corps."],
          ["Registre bas, scatologique", "« Il pissait sur ses chaussures, chiait dans sa chemise »", "Comique carnavalesque ; l'enfant réduit à son corps."],
          ["Proverbes pris au pied de la lettre (polysémie)", "« mettait la charrue avant les bœufs », « battait froid »", "Jeu sur le sens propre et le sens figuré : l'enfant fait réellement ce que l'expression dit au figuré. Comique de l'absurde."],
          ["Antithèses et inversions", "« mordait en riant, riait en mordant » ; « se cachait dans l'eau pour éviter la pluie »", "Monde à l'envers : l'enfant fait tout à contresens."],
          ["Animalisation", "« Les petits chiens de son père mangeaient dans son écuelle et lui mangeait avec eux »", "Satire : sans éducation, l'enfant vit comme une bête."]
        ],
        ton: "Comique (burlesque, carnavalesque), ironique et satirique."
      },
      problematique: "<p><b>Neutre ? Non.</b> Ne rien transmettre, c'est déjà éduquer : l'enfant est élevé « comme tous les petits enfants du pays », donc <b>conformé</b> aux habitudes de son milieu et à ses instincts.</p><p><b>Valeurs ?</b> Aucune valeur intellectuelle ou morale : seulement les besoins du corps. Rabelais montre par le rire que l'homme ne naît pas homme : il le devient par l'éducation.</p><p><b>Émancipe ?</b> Non : l'enfant est « libre » de tout, mais cette liberté le laisse esclave de ses instincts. C'est le point de départ qui rend nécessaire l'éducation humaniste (ch. 23).</p>",
      citations: [
        ["« comme tous les petits enfants du pays »", "Souligné en cours : Gargantua n'a rien d'exceptionnel, c'est l'éducation ordinaire, sans méthode."],
        ["« à boire, manger et dormir ; à manger, dormir et boire ; à dormir, boire et manger »", "Répétition circulaire (VO : « à boyre, manger et dormir »)."],
        ["« mettait la charrue avant les bœufs »", "Entouré : au figuré, faire les choses dans le mauvais ordre."],
        ["« revenait à ses moutons »", "Souligné : au figuré, revenir à son sujet."],
        ["« Les petits chiens de son père mangeaient dans son écuelle et lui mangeait avec eux »", "La chute : animalisation de l'enfant."]
      ],
      annotations: [
        ["Près du titre", "Ironique / satirique", "Le ton du texte : Rabelais se moque (ironie) d'une éducation qui n'en est pas une et critique (satire) les enfants élevés sans méthode."],
        ["l. 3, souligné", "« tous les petits enfants du pays »", "Gargantua est élevé comme les autres : la « non-éducation » est la norme de son milieu."],
        ["l. 9-10, barre et parenthèse", "« Il pissait sur ses chaussures… se mouchait sur sa manche »", "Passage isolé : le registre scatologique, le corps sale."],
        ["l. 18-20, soulignés", "« battait froid », « disait la patenôtre du singe », « revenait à ses moutons », « battait le chien devant le lion »", "Proverbes pris au pied de la lettre : les expliquer avec leur sens propre et leur sens figuré (notes 6, 8, 10)."],
        ["l. 20-21, entouré", "« mettait la charrue avant les bœufs »", "Le proverbe le plus connu : au figuré, faire les choses dans le mauvais ordre."],
        ["l. 30-32, accolade et marge droite", "« animal[isation] de l'e[nfant] » (mots partiellement lisibles)", "L'enfant est assimilé aux petits chiens : il partage leur écuelle. Sans éducation, c'est une petite bête."]
      ],
      pieges: [
        "« Adolescence » ne veut pas dire adolescence : ici, c'est la <b>petite enfance</b> (3 à 5 ans, note 1).",
        "Le texte étudié est une <b>adaptation en français moderne</b> (Guy Demerson, Seuil, 1973). L'encadré « Version originale » donne le texte de Rabelais en moyen français.",
        "Gargantua est le <b>père</b> de Pantagruel, mais <em>Gargantua</em> a été publié <b>après</b> <em>Pantagruel</em> (1532).",
        "Grandgousier = le père de Gargantua ; Gargamelle = sa mère. Ni Thubal Holoferne ni Ponocrates n'apparaissent dans ce chapitre.",
        "Date : la feuille indique 1535 ici et 1534 pour le texte 2. La première édition est souvent datée de fin 1534, plus sûrement du début 1535."
      ],
      radar: {
        autorite: 0,
        liberte: 4,
        morale: 0,
        savoir: 0,
        etat: 0,
        critique: 4,
        why: "Aucune règle ni maître (autorité 0) ; l'enfant fait ce qu'il veut, mais par instinct (liberté 4, pas une liberté réfléchie) ; ni morale ni savoir ; aucune institution ; satire forte du laisser-faire (critique 4)."
      },
      carte: {
        x: 2,
        y: 2,
        why: "Aucune valeur transmise en apparence (presque « neutre »)… mais cette neutralité conforme l'enfant à ses instincts et à son milieu : aucune émancipation."
      },
      palais: {
        court: "Réfectoire",
        salle: "Le réfectoire",
        objet: "Un panier et une soupe",
        image: "Un bébé géant renifle dans sa soupe, boit dans sa pantoufle et se frotte le ventre avec un panier, pendant que les petits chiens lèchent son écuelle."
      }
    },

    /* ─── 2. Rabelais, ch. 23 ─── */
    {
      id: "rab23",
      short: "Rabelais, ch. 23",
      auteur: "François Rabelais",
      auteurDates: "v. 1483/1494-1553",
      titre: "L'emploi du temps humaniste de Gargantua",
      oeuvre: "Gargantua, chapitre 23",
      date: "1534 (feuille) · 1534-1535",
      annee: 1535.2,
      genre: "Chronique comique en prose (roman)",
      mouvement: "Humanisme (Renaissance)",
      nums: { prof: "2", imprime: "TEXTE 2", detail: "Feuille polycopiée « TEXTE 2 »." },
      icon: "clock",
      couleur: ["#289f9f", "#46efd4"],
      motcle: "Ne perdre aucune heure du jour",
      symbole: "Une horloge à 4 h du matin",
      sameAuthorAs: "rab11",
      essentiel: [
        "Gargantua, d'abord abruti par le précepteur « sophiste » <b>Thubal Holoferne</b>, est confié au précepteur humaniste <b>Ponocrates</b> (« bourreau de travail »), qui le fait purger par le médecin <b>Séraphin Calobarsy</b> (anagramme de l'auteur) puis éveille sa curiosité.",
        "Emploi du temps encyclopédique dès <b>4 heures du matin</b> : Écriture sainte lue par le page <b>Anagnostes</b>, observation du ciel, répétition des leçons, « trois bonnes heures » de lecture, jeux de balle, repas savants, cartes pour l'arithmétique, géométrie, astronomie, musique.",
        "Procédés : <b>imparfait d'habitude</b>, <b>connecteurs temporels</b> (Puis, Ce fait, Au commencement, Après), <b>énumérations</b> (aliments, auteurs antiques), <b>hyperboles</b>. Titre du chapitre (1542) : Gargantua « ne perdait heure du jour ».",
        "Idéal <b>humaniste</b> : savoir universel, retour aux Anciens (Pline, Galien, Aristote…), équilibre du <b>corps et de l'esprit</b>, foi évangélique (la Bible lue directement), pédagogie active (observer, discuter, apprendre en jouant).",
        "Problématique : éducation <b>non neutre</b> : elle transmet des valeurs (piété, vertu, savoir) et forme un prince ; elle <b>émancipe</b> (curiosité, jugement) mais encadre chaque minute."
      ],
      auteurHtml: "<p>Même auteur que le texte 1 : voir la fiche « Rabelais, ch. 11 ». En bref : moine devenu médecin, humaniste, pseudonyme Alcofribas Nasier, livres censurés par la Sorbonne.</p>",
      anecdotes: [
        ["<b>Séraphin Calobarsy</b>, le médecin qui purge Gargantua, est l'anagramme de « Phrançoys Rabelais » (orthographe de l'époque) : Rabelais, médecin lui-même, se met en scène.", "feuille (chapeau du texte 2) ; anagramme vérifiable lettre à lettre"],
        ["Le nom <b>Ponocrates</b> est formé sur le grec <em>ponos</em> (la peine, le travail) et <em>kratos</em> (la force, le pouvoir) ; <b>Anagnostes</b> signifie « le lecteur ».", "https://lespetitesanalyses.com/litterature/gargantua-francois-rabelais/personnages-principaux/"],
        ["L'abbaye de <b>Thélème</b>, à la fin de <em>Gargantua</em> (ch. 57), n'a qu'une règle : « <b>Fais ce que voudras</b> » (VO : « Fay ce que vouldras »).", "https://fr.wikipedia.org/wiki/Abbaye_de_Th%C3%A9l%C3%A8me"]
      ],
      epoque: "<p>Même contexte que le texte 1 (Renaissance, François Ier, Réforme). Le ch. 23 vise directement la <b>Sorbonne</b> et ses « sophistes » : leur enseignement par cœur et leurs commentaires interminables sont opposés à la pédagogie humaniste.</p>",
      mouvementHtml: "<p><b>Humanisme</b> (voir texte 1). Le ch. 23 en est le programme pédagogique : lire les Anciens dans le texte, tout apprendre (idéal encyclopédique), exercer le corps comme l'esprit, lire directement la Bible (évangélisme), apprendre par l'expérience et la discussion.</p>",
      ideologie: "<p><b>La pédagogie de Ponocrates</b> résume le programme humaniste :</p><ul><li><b>Tout apprendre</b> : Écriture sainte, astronomie, histoire naturelle, arithmétique, géométrie, musique.</li><li><b>Apprendre activement</b> : observer le ciel, répéter, réciter, discuter à table, tirer des « cas pratiques », apprendre en jouant (les cartes pour compter).</li><li><b>Former le corps comme l'âme</b> : jeux de balle et de paume, hygiène (frictions, chemise changée).</li><li><b>Former le chrétien</b> : prière, lecture directe de la Bible, cantiques.</li><li><b>Utiliser chaque instant</b> : même les toilettes et les repas servent à apprendre.</li></ul><p>Limite : ce rythme ne laisse aucun temps libre ; c'est un <b>idéal</b> un peu utopique et gigantesque plus qu'un programme réaliste.</p>",
      oeuvreHtml: "<p>Voir le texte 1 pour l'œuvre entière.</p>",
      place: "<p>Ch. 23 (titre de 1542 : « Comment Gargantua fut institué par Ponocrates en telle discipline qu'il ne perdait heure du jour »). Il suit l'échec des précepteurs sophistes ; les ch. 21-22 montrent, par contraste, la journée paresseuse de l'élève des sophistes (lever tardif, repas énormes, liste interminable de jeux). Le ch. 24 décrit les jours de pluie. Ensuite commence la guerre picrocholine.</p>",
      extrait: {
        resume: "La journée idéale de Gargantua, élève de Ponocrates : lever à 4 heures, lecture de la Bible, répétitions, observation du ciel, trois heures de lecture, jeux au Grand Bracque, dîner savant où l'on discute des aliments avec les auteurs antiques, puis arithmétique par les cartes, géométrie, astronomie et musique.",
        mouvements: [
          "l. 1-15 · Le matin : lever à 4 h, Écriture sainte, répétition aux « lieux secrets », observation du ciel, habillage en révisant, trois heures de lecture, jeux et exercices.",
          "l. 16-30 · Le dîner (repas de midi) : lecture de prouesses, conversation savante sur la nature des aliments, livres apportés à table.",
          "l. 31-45 · Après le repas : cure-dents, cantiques, cartes pour l'arithmétique, puis géométrie, astronomie, musique."
        ],
        procedes: [
          ["Imparfait d'habitude", "« S'éveillait donc Gargantua environ quatre heures du matin »", "Une routine répétée chaque jour (note de cours : « usage de l'imparfait »)."],
          ["Connecteurs temporels", "« Puis », « Ce fait », « Au commencement », « Après »", "Surlignés en vert : un emploi du temps minuté, méthodique, sans temps mort."],
          ["Énumérations", "« du pain, du vin, de l'eau, du sel, des viandes, poissons, fruits… » ; « Pline, Athénée, Dioscorides… »", "Abondance du savoir encyclopédique (note de cours : « énumération »)."],
          ["Métaphore du festin de savoir", "les livres apportés « à table »", "Nourrir le corps = nourrir l'esprit : le repas devient un « buffet intellectuel » (noté en cours)."],
          ["Tournures passives et « on »", "« lui était lue quelque pagine » ; « on lui répétait les leçons »", "Tout est organisé autour de l'élève, entouré de maîtres."],
          ["Parallélisme corps / âme", "« s'exerçant les corps comme ils avaient les âmes auparavant exercé »", "Idéal d'une éducation complète."],
          ["Hyperbole", "« n'était médecin qui en sût à la moitié tant comme il faisait »", "Réussite gigantesque et éloge de la méthode."],
          ["Personnification", "« Monsieur l'Appétit venait »", "Touche d'humour dans un texte didactique."]
        ],
        ton: "Didactique et enthousiaste, avec l'humour rabelaisien (hyperboles, personnification)."
      },
      problematique: "<p><b>Neutre ? Non.</b> Ponocrates transmet une <b>vision du monde</b> : piété évangélique (Bible, prières, cantiques), vertu, admiration des Anciens, maîtrise de soi.</p><p><b>Émancipe ?</b> Oui : la curiosité est « éveillée », Gargantua raisonne (« cas pratiques »), discute, observe ; il devient plus savant que les médecins. Mais c'est une émancipation <b>très encadrée</b> : chaque minute est réglée par le maître.</p><p><b>Lien</b> : ch. 11 = nature sans méthode (l'enfant-animal) → ch. 23 = méthode qui fait un homme complet.</p>",
      citations: [
        ["« S'éveillait donc Gargantua environ quatre heures du matin. »", "Ouverture : imparfait d'habitude, lever très matinal."],
        ["« s'exerçant les corps comme ils avaient les âmes auparavant exercé »", "L'équilibre du corps et de l'esprit."],
        ["« Tout leur jeu n'était qu'en liberté »", "Même le jeu fait partie de l'éducation, sans contrainte."],
        ["« n'était médecin qui en sût à la moitié tant comme il faisait »", "Hyperbole : l'élève dépasse les spécialistes."],
        ["« il ne perdait heure du jour »", "Titre du chapitre (édition de 1542) : pas une minute perdue."]
      ],
      annotations: [
        ["En haut à droite", "USAGE DE L'IMPARFAIT", "Imparfait d'habitude (itératif) : la journée se répète tous les jours ; c'est un emploi du temps, pas un événement unique."],
        ["l. 5 à 31, surlignés en vert", "Puis · Ce fait · Puis · Ce fait · Au commencement · Après", "Les connecteurs temporels rythment la journée : progression méthodique, rien n'est laissé au hasard."],
        ["l. 23, marge gauche", "énumération", "Liste des aliments (pain, vin, eau, sel, viandes…) : on étudie la « nature » de tout ce qui est servi."],
        ["l. 27-30, marge gauche", "« buffet intellectuel » (lecture probable)", "Les livres arrivent à table : le repas nourrit l'esprit autant que le corps."]
      ],
      pieges: [
        "<b>Ponocrates</b> (précepteur humaniste) ≠ <b>Thubal Holoferne</b> (sophiste, mauvais maître). <b>Anagnostes</b> = le page qui lit. <b>Séraphin Calobarsy</b> = le médecin.",
        "« Le dîner » = le repas principal de <b>midi</b> (note 10), pas le repas du soir.",
        "« Science sans conscience… » n'est <b>pas</b> dans ce chapitre (<em>Pantagruel</em>, ch. 8). « Fais ce que voudras » : Thélème, <em>Gargantua</em> ch. 57.",
        "Ponocrates ne supprime pas le jeu : balle, paume, pile trigone font partie du programme.",
        "Date : la feuille dit 1534 (et 1535 pour le texte 1) : première édition fin 1534 ou, plus sûrement, début 1535."
      ],
      radar: {
        autorite: 4,
        liberte: 2,
        morale: 4,
        savoir: 5,
        etat: 1,
        critique: 2,
        why: "Précepteur qui règle chaque minute (autorité 4) ; jeu « en liberté » mais journée entièrement encadrée (liberté 2) ; piété et vertu (morale 4) ; savoir encyclopédique (5) ; éducation privée d'un prince (institution 1) ; critique implicite de la scolastique (2)."
      },
      carte: {
        x: 8,
        y: 9,
        why: "Éducation très chargée de valeurs (humanisme chrétien) et émancipatrice : elle éveille la curiosité et le jugement."
      },
      palais: {
        court: "Salle de l'horloge",
        salle: "La salle de l'horloge",
        objet: "Une horloge qui sonne 4 h du matin",
        image: "Une horloge géante sonne quatre coups ; sur la table du repas, les plats sont remplacés par des livres ouverts (Pline, Galien), et des cartes à jouer couvertes de chiffres."
      }
    },

    /* ─── 3. Rousseau ─── */
    {
      id: "rou",
      short: "Rousseau",
      auteur: "Jean-Jacques Rousseau",
      auteurDates: "1712-1778",
      titre: "L'homme : l'être « perfectible »",
      oeuvre: "Discours sur l'origine et les fondements de l'inégalité parmi les hommes (1re partie)",
      date: "1755",
      annee: 1755,
      genre: "Discours (essai philosophique argumentatif)",
      mouvement: "Lumières (XVIIIe s.)",
      nums: { prof: "3", imprime: "—", detail: "« TEXTE » imprimé, chiffre 3 écrit en rose." },
      icon: "ladder",
      couleur: ["#095717", "#77b154"],
      motcle: "Perfectibilité",
      symbole: "Une bête et une échelle",
      essentiel: [
        "<b>Rousseau</b> (1712-1778), philosophe genevois des <b>Lumières</b> mais critique du progrès. <em>Discours sur l'origine et les fondements de l'inégalité parmi les hommes</em> (<b>1755</b>) ; plus tard <em>Émile ou De l'éducation</em> et <em>Du contrat social</em> (1762).",
        "Deux différences entre l'homme et l'animal : la <b>liberté</b> (« la Bête obéit » à la Nature ; l'homme peut « acquiescer ou résister ») et surtout la <b>perfectibilité</b>, « la faculté de se perfectionner », dans l'individu comme dans l'espèce.",
        "L'animal est fixé : l'individu est complet en quelques mois, l'espèce ne change pas en mille ans. L'homme progresse… mais peut <b>régresser « plus bas que la bête »</b> (vieillesse, accidents).",
        "Conclusion <b>pessimiste</b> : la perfectibilité est « la source de tous les malheurs de l'homme » ; elle l'arrache à l'état de nature et fait de lui « le tyran de lui-même et de la nature ».",
        "Pour l'éducation : l'homme est <b>éducable</b> (rien n'est fixé à la naissance), mais l'éducation n'est pas neutre : elle peut élever ou corrompre. D'où, dans l'<em>Émile</em>, une éducation « négative » qui protège l'enfant."
      ],
      auteurHtml: "<p><b>Jean-Jacques Rousseau</b> naît en <b>1712 à Genève</b> (sa mère meurt quelques jours après sa naissance) et meurt en <b>1778</b> à Ermenonville.</p><ul><li>Autodidacte, longtemps errant (Savoie, Mme de Warens), musicien, il rédige des articles de musique pour l'<em>Encyclopédie</em>.</li><li>Célèbre grâce au <em>Discours sur les sciences et les arts</em>, <b>prix de l'Académie de Dijon en 1750</b> : le progrès des arts n'a pas rendu les hommes meilleurs.</li><li>Œuvres majeures : <em>Discours sur l'inégalité</em> (1755), <em>Julie ou la Nouvelle Héloïse</em> (1761), <em>Du contrat social</em> et <em>Émile ou De l'éducation</em> (1762), <em>Les Confessions</em> (posthumes).</li><li>Persécuté : <em>Émile</em> est condamné et brûlé (Paris et Genève, 1762) ; il se brouille avec Voltaire et les philosophes.</li></ul>",
      anecdotes: [
        ["Rousseau a <b>abandonné ses cinq enfants</b> (nés de Thérèse Levasseur) à l'hospice des Enfants-Trouvés, entre 1746 et 1752. Voltaire le révèle en 1764 (<em>Sentiment des citoyens</em>). Paradoxe pour l'auteur d'<em>Émile ou De l'éducation</em> !", "https://jjrousseau.net/2021/05/29/un-paradoxe-rousseau-et-ses-enfants/"],
        ["Voltaire, qui reçoit le <em>Discours</em>, lui répond le 30 août 1755 : « il prend envie de <b>marcher à quatre pattes</b> quand on lit votre ouvrage ».", "https://www.deslettres.fr/lettre-voltaire-jean-jacques-rousseau-il-prend-envie-marcher-quatre-pattes-on-lit-ouvrage/"],
        ["L'expression « <b>bon sauvage</b> » n'est <b>pas</b> de Rousseau : elle a surtout servi à caricaturer sa pensée.", "https://fr.wikipedia.org/wiki/Bon_sauvage"],
        ["Le <em>Discours sur l'inégalité</em> répond à une question de l'Académie de Dijon mais n'obtient <b>pas</b> le prix (lauréat : l'abbé Talbert). Le prix de 1750 récompensait son premier <em>Discours</em>.", "https://en.wikipedia.org/wiki/Discourse_on_Inequality"],
        ["<em>Émile</em> est condamné par le Parlement de Paris en juin 1762, lacéré et brûlé ; Genève condamne aussi <em>Émile</em> et <em>Du contrat social</em>.", "https://ge.ch/archives/15-condamnation-de-lemile-contrat-social-1761-1762"]
      ],
      epoque: "<p><b>XVIIIe siècle, siècle des Lumières</b> : monarchie absolue (Louis XV), société d'ordres inégalitaire. Les philosophes (Voltaire, Diderot, d'Alembert et l'<em>Encyclopédie</em>, 1751-1772) critiquent l'intolérance et l'arbitraire au nom de la <b>raison</b> et du <b>progrès</b>.</p><p><b>Religion et école</b> : l'Église contrôle l'enseignement (collèges des jésuites, des oratoriens) ; la censure frappe les livres jugés impies.</p><p><b>Débat</b> : l'Académie de Dijon propose (1753-1754) la question « Quelle est la source de l'inégalité parmi les hommes, et si elle est autorisée par la loi naturelle ? ». On discute de l'« état de nature » et des peuples « sauvages » décrits par les voyageurs.</p>",
      mouvementHtml: "<p><b>Les Lumières</b> :</p><ul><li>usage critique de la <b>raison</b> contre les préjugés, la superstition et l'arbitraire ;</li><li>foi dans le <b>progrès</b> des sciences et des arts… que Rousseau, lui, <b>remet en cause</b> : le progrès des connaissances n'a pas rendu l'homme meilleur ;</li><li>réflexion politique sur la liberté, l'égalité, le contrat social ;</li><li>Rousseau annonce aussi le <b>romantisme</b> (sensibilité, nature, moi).</li></ul>",
      ideologie: "<p>Méthode : Rousseau imagine un <b>état de nature</b> hypothétique pour comprendre ce que la société a ajouté à l'homme. L'homme naturel est solitaire, libre, guidé par l'amour de soi et la pitié.</p><p>La <b>perfectibilité</b> est ambivalente : elle rend possibles les lumières, les arts et la vertu, mais aussi les erreurs, les vices, la propriété et les inégalités.</p><p>Éducation : dans <em>Émile</em> (1762), qui commence par « Tout est bien sortant des mains de l'Auteur des choses, tout dégénère entre les mains de l'homme », Rousseau défend une éducation qui suit la nature de l'enfant, par l'expérience plutôt que par les livres, et qui le protège des vices de la société (« éducation négative »).</p>",
      oeuvreHtml: "<p><em>Discours sur l'origine et les fondements de l'inégalité parmi les hommes</em> (1755), dit « second Discours ». <b>Première partie</b> : l'homme à l'état de nature (d'abord physique, puis « métaphysique et moral » : liberté, perfectibilité, pitié). <b>Seconde partie</b> : histoire hypothétique de la société : familles, agriculture et métallurgie, <b>propriété</b>, inégalités, puis lois et gouvernements qui les consacrent. Elle s'ouvre sur une phrase célèbre : « Le premier qui, ayant enclos un terrain, s'avisa de dire : Ceci est à moi… ».</p>",
      place: "<p>L'extrait vient de la <b>première partie</b>, au moment où Rousseau passe du corps de l'homme naturel à ce qui le distingue « métaphysiquement » de l'animal.</p>",
      extrait: {
        resume: "L'animal obéit à la Nature ; l'homme peut acquiescer ou résister : il est libre. Une autre différence est incontestable : la perfectibilité, faculté de se perfectionner qui développe toutes les autres. L'animal est fixé ; l'homme progresse, mais il peut aussi perdre ce qu'il a acquis et tomber plus bas que la bête. Cette faculté est donc la source de ses malheurs : elle le tire de sa condition originaire, tranquille et innocente, et le rend tyran de lui-même et de la nature.",
        mouvements: [
          "l. 1-4 · 1er critère, la liberté : la Bête obéit, l'homme peut « acquiescer ou résister ».",
          "l. 5-13 · 2e critère, incontestable : la perfectibilité (définition entre crochets) ; l'animal, lui, est fixé.",
          "l. 13-18 · Contre-épreuve : seul l'homme peut devenir « imbécile » et retomber « plus bas que la bête ».",
          "l. 18-23 · Conclusion pessimiste : la perfectibilité, « source de tous les malheurs de l'homme »."
        ],
        procedes: [
          ["Comparaison / antithèse homme-animal", "« La Nature commande à tout animal, et la Bête obéit. L'homme éprouve la même impression, mais… »", "L'homme est défini par différence avec l'animal."],
          ["Définition mise en valeur", "« c'est la faculté de se perfectionner »", "Entre crochets en cours : le cœur du texte."],
          ["Parallélisme individu / espèce", "« au bout de quelques mois […] au bout de mille ans »", "L'animal est figé, dans sa vie comme dans l'histoire de son espèce."],
          ["Questions rhétoriques", "« Pourquoi l'homme seul est-il sujet à devenir imbécile ? N'est-ce point… ? »", "Raisonnement qui implique le lecteur."],
          ["Modalisation", "« Il serait triste pour nous d'être forcés de convenir que… »", "La conclusion est présentée comme une vérité pénible."],
          ["Anaphore et antithèses", "« que c'est elle qui… que c'est elle qui… » ; « ses lumières et ses erreurs, ses vices et ses vertus »", "Découpée par les barres tracées en cours : la perfectibilité produit le meilleur et le pire."],
          ["Hyperboles", "« la source de tous les malheurs » ; « le tyran de lui-même et de la nature »", "Force de la critique du progrès."],
          ["Majuscules (allégorie)", "« la Nature », « la Bête »", "« la Bête » entourée : l'animal en général, entièrement soumis à la Nature."]
        ],
        ton: "Argumentatif et philosophique, grave, pessimiste."
      },
      problematique: "<p><b>Neutre ? Non.</b> Si l'homme est perfectible, ce qu'il devient dépend des circonstances, de la société, de l'éducation. L'éducation est donc décisive : elle peut <b>développer</b> ses facultés ou le <b>dénaturer</b>.</p><p><b>Émancipe ?</b> La perfectibilité est la condition de la liberté et du progrès, mais elle peut aussi rendre l'homme malheureux et tyrannique. Éduquer, c'est guider cette faculté ambivalente.</p>",
      citations: [
        ["« la Bête obéit »", "« la Bête » entourée : l'animal est soumis, l'homme est libre."],
        ["« il se reconnaît libre d'acquiescer, ou de résister »", "Premier critère : la liberté."],
        ["« c'est la faculté de se perfectionner »", "Définition de la perfectibilité."],
        ["« retombe ainsi plus bas que la bête même »", "La régression possible de l'homme."],
        ["« le tyran de lui-même et de la nature »", "Conclusion pessimiste."]
      ],
      annotations: [
        ["Numéro", "3 (écrit en rose)", "Numéro du texte dans la suite du professeur."],
        ["l. 1, entouré", "« la Bête »", "Majuscule : l'animal en général, qui obéit sans choisir. S'oppose à l'homme libre."],
        ["l. 8-10, crochets", "[c'est la faculté de se perfectionner … tant dans l'espèce que dans l'individu]", "La définition complète : aidée des circonstances, la perfectibilité développe toutes les autres facultés, chez l'individu comme dans l'espèce."],
        ["l. 18-23, crochet et barres", "[Il serait triste… | que c'est elle qui… | que c'est elle qui… |", "La dernière phrase est découpée en trois : la perfectibilité (1) cause nos malheurs, (2) nous arrache à l'état de nature, (3) fait de nous des tyrans."]
      ],
      pieges: [
        "« Perfectibilité » ≠ perfection : c'est une <b>capacité</b> à se perfectionner, qui peut aussi mener à la régression.",
        "Rousseau n'écrit jamais « bon sauvage ».",
        "Le <em>Discours sur l'inégalité</em> (1755) n'a <b>pas</b> gagné le prix de Dijon : c'est le premier <em>Discours</em> (1750).",
        "« Imbécile » (note 1) = privé de ses facultés intellectuelles (sens ancien), pas une insulte. « Lumières » (note 2) = connaissances (ne pas confondre avec le mouvement).",
        "Rousseau appartient aux Lumières mais critique le progrès : ne pas le confondre avec Voltaire, qui se moque de lui."
      ],
      radar: {
        autorite: 1,
        liberte: 5,
        morale: 3,
        savoir: 2,
        etat: 1,
        critique: 5,
        why: "L'homme se définit par la liberté (5) ; pas d'autorité éducative dans l'extrait (1) ; vices et vertus en jeu (morale 3) ; les « lumières » sont ambivalentes (savoir 2) ; aucune institution (1) ; critique radicale du progrès (5)."
      },
      carte: {
        x: 6,
        y: 6,
        why: "La perfectibilité rend l'émancipation possible, mais le progrès peut aussi aliéner ; rien n'est neutre puisque l'homme devient ce que les circonstances font de lui."
      },
      palais: {
        court: "Sciences naturelles",
        salle: "La salle de sciences naturelles",
        objet: "Une bête et une échelle",
        image: "Un chien reste assis au pied d'une échelle ; un homme grimpe très haut… puis dégringole et atterrit plus bas que le chien."
      }
    },

    /* ─── 4. Balzac ─── */
    {
      id: "bal",
      short: "Balzac",
      auteur: "Honoré de Balzac",
      auteurDates: "1799-1850",
      titre: "Une discipline excessive",
      oeuvre: "Louis Lambert",
      date: "1832",
      annee: 1832,
      genre: "Roman (récit à la 1re personne, d'inspiration autobiographique)",
      mouvement: "Réalisme (avec des traits romantiques)",
      nums: { prof: "6", imprime: "8 (manuel)", detail: "« 6 » écrit en bleu devant le 8 imprimé du manuel." },
      icon: "bars",
      couleur: ["#4d6777", "#95afc2"],
      motcle: "Le collège-prison",
      symbole: "Des lignes de pensum et des barreaux",
      essentiel: [
        "<b>Balzac</b> (1799-1850), géant du roman réaliste, auteur de <em>La Comédie humaine</em>. Enfant, il a été pensionnaire au <b>collège des Oratoriens de Vendôme</b> (1807-1813), d'où il est sorti malade.",
        "<em>Louis Lambert</em> (<b>1832</b>, remanié jusqu'en 1835), roman d'inspiration autobiographique des <b>Études philosophiques</b> : le narrateur raconte son amitié au collège avec Louis Lambert, élève surdoué qui finira fou.",
        "L'extrait dénonce une discipline <b>excessive</b> : humiliation (« Vous ne faites rien, Lambert ! », « un coup d'épingle » au cœur), <b>pensums</b> qui suppriment les récréations, collège comparé à un « <b>régime pénitentiaire</b> » (une prison).",
        "Procédés : champ lexical de la privation et de l'enfermement, opposition nature (air pur, feuillage, nuages) / collège, <b>hyperbole</b> (pas « six jours de liberté » en deux ans), passage du récit au <b>discours critique</b> (« exigera-t-il »).",
        "Problématique : l'école n'est <b>pas neutre</b> : son moule brime le génie et l'imagination ; seuls les <b>livres de la bibliothèque</b> sauvent l'esprit d'un « abrutissement complet »."
      ],
      auteurHtml: "<p><b>Honoré de Balzac</b> naît en <b>1799 à Tours</b> et meurt en <b>1850 à Paris</b>. Il ajoute lui-même la particule « de » à son nom.</p><ul><li>Pensionnaire six ans chez les Oratoriens de <b>Vendôme</b> (1807-1813) ; il en sort malade et affaibli.</li><li>Études de droit, débuts littéraires difficiles, affaires ruineuses (une imprimerie) : il écrit toute sa vie pour payer ses <b>dettes</b>, à un rythme effréné.</li><li>Il rassemble ses romans sous le titre <em>La Comédie humaine</em> (plus de 90 œuvres) : <em>Eugénie Grandet</em> (1833), <em>Le Père Goriot</em> (1835), <em>Illusions perdues</em>… Il fait <b>revenir les personnages</b> d'un roman à l'autre.</li><li>Il épouse Mme Hanska en 1850, quelques mois avant sa mort.</li></ul>",
      anecdotes: [
        ["Balzac a vraiment écrit un <b>Traité de la volonté</b> au collège de Vendôme. Dans le roman, c'est Louis Lambert qui l'écrit, et le <b>Père Haugoult</b> le confisque (il le vend sans doute « à un épicier de Vendôme »).", "https://en.wikipedia.org/wiki/Louis_Lambert_(novel)"],
        ["Balzac avait au collège un camarade nommé <b>Louis-Lambert Tinant</b>, qui a pu lui inspirer le nom de son héros.", "https://en.wikipedia.org/wiki/Louis_Lambert_(novel)"],
        ["Louis Lambert entre au collège grâce à <b>Mme de Staël</b>, qui l'a surpris en train de lire un livre de Swedenborg.", "https://en.wikipedia.org/wiki/Louis_Lambert_(novel)"],
        ["Fin tragique : Lambert sombre dans la folie juste avant son mariage avec Pauline de Villenoix et meurt à 28 ans (1824).", "https://en.wikipedia.org/wiki/Louis_Lambert_(novel)"]
      ],
      epoque: "<p>Balzac est au collège sous le <b>Premier Empire</b> (Napoléon Ier, 1804-1815) ; il publie <em>Louis Lambert</em> sous la <b>monarchie de Juillet</b> (Louis-Philippe, 1830-1848).</p><p><b>École</b> : les collèges sont des internats très stricts, souvent religieux comme celui des Oratoriens de Vendôme : discipline de caserne, punitions (pensums, privations), récitation par cœur, latin. La loi Guizot (1833) organise ensuite l'école primaire dans chaque commune.</p>",
      mouvementHtml: "<p><b>Réalisme</b> (dont Balzac est un fondateur) : peindre la société de son temps avec précision (lieux, objets, argent, milieux sociaux) ; dans l'avant-propos de <em>La Comédie humaine</em>, il veut « faire concurrence à l'état civil ».</p><p>Mais <em>Louis Lambert</em> est un roman <b>philosophique</b>, encore marqué par le <b>romantisme</b> : génie incompris, souffrance de l'âme sensible, rêverie devant la nature, mysticisme, folie.</p>",
      ideologie: "<p>Balzac critique une éducation de collège qui traite tous les élèves de la même façon et ignore la sensibilité et l'intelligence originale (« des penseurs qui ne penseront pas exclusivement à eux »). La discipline y est <b>punitive</b> (pensums, privations) et produit l'« abrutissement » plutôt que la pensée.</p><p>Il interpelle les « autorités de l'enseignement public » pour réformer ce « régime pénitentiaire ». La vraie formation passe par la <b>lecture libre</b> (la bibliothèque) et l'amitié.</p>",
      oeuvreHtml: "<p><em>Louis Lambert</em> (1832 : <em>Notice biographique sur Louis Lambert</em> ; 1833 : <em>Histoire intellectuelle de L. L.</em> ; 1835 : dans <em>Le Livre mystique</em>) : le narrateur, qui se révèle être Balzac, raconte la vie de son ami Louis Lambert, enfant prodige qui dévore les livres. Grâce à Mme de Staël, Lambert entre au collège de Vendôme ; il y souffre de la discipline, se lie avec le narrateur et écrit un <em>Traité de la volonté</em> confisqué par le Père Haugoult. Plus tard, il se fiance à Pauline de Villenoix mais sombre dans la folie (catalepsie) avant le mariage et meurt à 28 ans.</p>",
      place: "<p>L'extrait appartient au récit des années de collège, cœur du roman : il montre comment la discipline écrase Lambert et unit les deux amis.</p>",
      extrait: {
        resume: "Privé de l'air des campagnes, Lambert s'attriste ; il rêve en regardant les arbres et les nuages, et le Régent l'humilie : « Vous ne faites rien, Lambert ! ». Il perd ses récréations et reçoit des pensums (lignes à copier). Les deux amis n'ont pas eu six jours de liberté en deux ans ; seuls les livres de la bibliothèque leur évitent l'abrutissement. Le narrateur dénonce le « régime pénitentiaire » des collèges, puis raconte leur ruse (répéter les leçons après les autres) et l'arbitraire des punitions.",
        mouvements: [
          "l. 1-7 · Lambert, privé de la nature, rêve pendant l'étude et subit l'humiliation du Régent : « Vous ne faites rien, Lambert ! ».",
          "l. 7-13 · L'engrenage des pensums : plus de récréations, pas « six jours de liberté » en deux ans ; les livres évitent l'« abrutissement complet ».",
          "l. 13-15 · Généralisation critique : le « régime pénitentiaire » des collèges doit être réformé.",
          "l. 15-20 · La ruse des deux amis (leur mémoire) et l'arbitraire des punitions."
        ],
        procedes: [
          ["Opposition nature / collège", "« l'air pur et parfumé des campagnes » ; « le feuillage des arbres ou les nuages du ciel »", "Liberté du dehors contre enfermement ; Lambert rêveur (sensibilité romantique)."],
          ["Discours direct et reprise en italique", "« Vous ne faites rien, Lambert ! » ; « Ce : Vous ne faites rien, était… »", "La phrase du maître est répétée et commentée : une humiliation qui blesse."],
          ["Métaphore", "« un coup d'épingle qui blessait Louis au cœur »", "Douleur morale d'un enfant sensible face à un maître qui ne le comprend pas."],
          ["Champ lexical de la prison et de la privation", "« privation », « discipline », « pensums », « régime pénitentiaire »", "Le collège est une prison (note 2 : pénitentiaire = qui concerne les détenus)."],
          ["Hyperbole", "« nous n'avons pas eu six jours de liberté durant nos deux années d'amitié »", "L'excès de la punition dénoncé par l'exagération."],
          ["Passage au futur (généralisation)", "« Aussi le régime pénitentiaire […] exigera-t-il l'attention des autorités »", "Le narrateur quitte le souvenir pour une thèse : la critique devient générale."],
          ["Ironie", "« malgré nos plus habiles excuses »", "Les ruses des élèves répondent à l'absurdité du système."]
        ],
        ton: "Critique et polémique, teinté de mélancolie (souvenir)."
      },
      problematique: "<p><b>Neutre ? Non.</b> Le collège impose l'obéissance et un modèle unique d'élève ; il punit la rêverie et l'originalité. Sa discipline est une <b>idéologie de la contrainte</b>.</p><p><b>Émancipe ?</b> Non : elle mène à l'« abrutissement complet ». L'émancipation vient d'ailleurs : les <b>livres</b> choisis librement et l'amitié. Balzac réclame une réforme de l'enseignement.</p>",
      citations: [
        ["« Vous ne faites rien, Lambert ! »", "La phrase humiliante du Régent."],
        ["« un coup d'épingle qui blessait Louis au cœur »", "La souffrance morale de l'enfant sensible."],
        ["« nous n'avons pas eu six jours de liberté durant nos deux années d'amitié »", "Hyperbole de la privation."],
        ["« ce système d'existence nous eût menés à un abrutissement complet »", "L'école abrutit au lieu d'éduquer."],
        ["« le régime pénitentiaire observé dans les collèges »", "Le collège comparé à une prison."]
      ],
      annotations: [
        ["Numéro", "6 (en bleu) devant le 8 imprimé", "Numéro du texte dans la suite du professeur (8 = numéro du manuel)."],
        ["l. 6-7, barres", "/ Vous ne faites rien … au cœur |", "Découpage du premier mouvement : la phrase du Régent et son effet sur Lambert."]
      ],
      pieges: [
        "Le narrateur n'est pas Louis Lambert : c'est son ami (« Nous fûmes, Lambert et moi… »), double de Balzac.",
        "Le « Régent » (note 1) = le professeur qui dirige une classe, pas un souverain.",
        "« Pénitentiaire » (note 2) = qui concerne les prisonniers : c'est une <b>métaphore</b> de la prison.",
        "Date : 1832 (première version), remanié en 1833 et 1835.",
        "Balzac = réalisme (avec des traits romantiques), pas les Lumières."
      ],
      radar: {
        autorite: 5,
        liberte: 1,
        morale: 1,
        savoir: 2,
        etat: 3,
        critique: 5,
        why: "Régent et pensums (autorité 5) ; « six jours de liberté » en deux ans (liberté 1) ; obéissance plutôt que morale (1) ; savoir par cœur (2) ; le collège et les « autorités de l'enseignement public » (institution 3) ; critique virulente (5)."
      },
      carte: {
        x: 1,
        y: 6,
        why: "Discipline qui contraint et abrutit : elle transmet surtout l'obéissance ; seuls les livres libèrent."
      },
      palais: {
        court: "Salle d'étude",
        salle: "La salle d'étude aux barreaux",
        objet: "Des lignes de pensum derrière des barreaux",
        image: "Un élève colle son front aux barreaux d'une fenêtre et regarde les nuages ; derrière lui, une pile de pages couvertes de lignes copiées s'élève jusqu'au plafond."
      }
    },

    /* ─── 5. Flaubert ─── */
    {
      id: "flo",
      short: "Flaubert",
      auteur: "Gustave Flaubert",
      auteurDates: "1821-1880",
      titre: "Le « nouveau » (incipit)",
      oeuvre: "Madame Bovary",
      date: "1857",
      annee: 1857,
      genre: "Roman (incipit)",
      mouvement: "Réalisme",
      nums: { prof: "5", imprime: "noirci", detail: "Recto-verso : « TEXTE » avec numéro imprimé noirci, « 5 » manuscrit." },
      icon: "cap",
      couleur: ["#ba0426", "#fc444d"],
      motcle: "Charbovari",
      symbole: "La casquette qui tombe",
      essentiel: [
        "<b>Flaubert</b> (1821-1880), romancier <b>réaliste</b> obsédé par le style (le « gueuloir »). <em>Madame Bovary</em> (<b>1857</b>) lui vaut un <b>procès</b> pour atteinte à la morale : il est <b>acquitté</b> le 7 février 1857.",
        "L'incipit raconte, du point de vue d'un « <b>nous</b> » (les élèves), l'arrivée en classe du « nouveau », <b>Charles Bovary</b>, garçon de la campagne maladroit. Ce « nous » disparaît ensuite du roman.",
        "Scène d'<b>humiliation</b> : la casquette grotesque tombe, la classe rit, le professeur ironise (« votre casque »), le nom devient « <b>Charbovari</b> », punition : copier <em><b>ridiculus sum</b></em> (« je suis ridicule »).",
        "Procédés : longue <b>description satirique</b> de la casquette (symbole du personnage), comparaisons dévalorisantes, <b>ironie</b>, gradation du chahut, discours direct des ordres, italiques du jargon des élèves (« le <em>genre</em> »).",
        "Problématique : l'école n'est <b>pas neutre</b> : elle impose la <b>conformité</b> et <b>stigmatise</b> l'élève différent (rural, pauvre) ; le professeur participe à ce « bannissement » symbolique (noté en cours). Charles se soumet sans s'émanciper."
      ],
      auteurHtml: "<p><b>Gustave Flaubert</b> naît en <b>1821 à Rouen</b>, fils d'un chirurgien-chef de l'Hôtel-Dieu, et meurt en <b>1880</b> à Croisset, près de Rouen.</p><ul><li>Il abandonne ses études de droit après une grave crise nerveuse (1844) et se consacre à l'écriture dans sa maison de Croisset.</li><li>Voyage en Orient (1849-1851) avec Maxime Du Camp.</li><li>Œuvres : <em>Madame Bovary</em> (1857), <em>Salammbô</em> (1862), <em>L'Éducation sentimentale</em> (1869), <em>Trois Contes</em> (1877), <em>Bouvard et Pécuchet</em> (posthume).</li><li>Travail acharné du style : près de cinq ans pour <em>Madame Bovary</em> ; il éprouve ses phrases à voix haute dans son « <b>gueuloir</b> ».</li></ul>",
      anecdotes: [
        ["Le <b>procès</b> de janvier-février 1857 : l'avocat impérial Ernest Pinard accuse le roman d'offenser la morale publique et religieuse ; Me Sénard le défend ; Flaubert est acquitté le 7 février. Le scandale fait le succès du livre, publié en volume chez Michel Lévy en avril 1857 (après la <em>Revue de Paris</em>, fin 1856).", "https://flaubert.univ-rouen.fr/qui-%C3%A9tait-flaubert/dossiers-documentaires/une-carri%C3%A8re-d%C3%A9crivain/rapports-de-censure/le-proces-bovary/le-proces-de-madame-bovary-29-janvier-7-fevrier-1857"],
        ["« <b>Madame Bovary, c'est moi</b> » : formule <b>apocryphe</b> ! Elle n'apparaît ni dans ses lettres ni dans ses brouillons ; elle est rapportée en 1909 (thèse de René Descharmes) par deux intermédiaires.", "https://flaubert.univ-rouen.fr/labo-flaubert/ressources-par-%C5%93uvre/madame-bovary/madame-bovary-cest-moi-formule-apocryphe/"],
        ["Le « <b>gueuloir</b> » : Flaubert déclamait ses phrases à pleine voix pour vérifier leur rythme ; une phrase qui ne « résiste » pas à la lecture à voix haute est mauvaise.", "https://books.openedition.org/puv/6041?lang=en"],
        ["<em>Quos ego…</em> (Virgile, <em>Énéide</em>, I, 135) : Neptune menace les vents déchaînés et s'interrompt (aposiopèse). Flaubert compare comiquement le professeur furieux au dieu de la mer.", "https://en.wikipedia.org/wiki/Quos_ego"]
      ],
      epoque: "<p><b>Second Empire</b> (Napoléon III, 1852-1870) : régime autoritaire, censure, morale bourgeoise et catholique. La même année, 1857, Baudelaire est condamné pour <em>Les Fleurs du mal</em>.</p><p><b>École</b> : le collège forme les fils de la bourgeoisie ; enseignement classique centré sur le <b>latin</b>, discipline stricte (proviseur, maître d'études, pensums). Les fils de paysans y arrivent tard et en décalage, comme Charles.</p>",
      mouvementHtml: "<ul><li><b>Réalisme</b> : représenter le réel ordinaire, les milieux modestes et provinciaux, sans idéaliser ; précision des détails (objets, vêtements).</li><li>Chez Flaubert : <b>impersonnalité</b> (le narrateur ne juge pas ouvertement) mais <b>ironie</b> constante ; culte du style.</li><li>Flaubert refusait l'étiquette de « réaliste », mais <em>Madame Bovary</em> est considéré comme un chef-d'œuvre du réalisme.</li></ul>",
      ideologie: "<p>Flaubert ne fait pas un discours sur l'école : il la <b>montre</b>. C'est un lieu de codes (« le <em>genre</em> »), de moqueries et de punitions collectives, où l'enseignement se réduit au latin, au dictionnaire et aux règles.</p><p>La scène annonce le destin de Charles : un être <b>médiocre</b>, appliqué, sans « élégance », qui subit plus qu'il ne choisit. L'institution trie et classe (le « banc de paresse », la menace de descendre dans la classe inférieure) et reproduit les différences sociales.</p>",
      oeuvreHtml: "<p><em>Madame Bovary, mœurs de province</em> (1857). <b>Charles Bovary</b>, devenu officier de santé (médecin sans doctorat), épouse <b>Emma Rouault</b>, fille de fermier élevée au couvent et nourrie de romans. Emma s'ennuie à Tostes puis à Yonville, rêve de passion et de luxe, prend deux amants (Rodolphe, puis Léon) et s'endette auprès du marchand Lheureux. Ruinée, elle s'empoisonne à l'arsenic. Charles meurt de chagrin ; leur fille Berthe finit ouvrière dans une filature ; le pharmacien Homais reçoit la croix d'honneur.</p><p>Lien avec le thème : l'<b>éducation</b> d'Emma au couvent, faite de lectures romanesques, nourrit ses rêves et son malheur.</p>",
      place: "<p>C'est l'<b>incipit</b> (1re partie, ch. 1). Le roman s'ouvre sur Charles et non sur Emma, et il se referme aussi sur Charles et Homais.</p>",
      extrait: {
        resume: "« Nous étions à l'étude » quand le Proviseur amène un « nouveau », recommandé à M. Roger, le maître d'études. C'est un garçon de la campagne, grand, gauche, mal habillé, attentif « comme au sermon ». Il n'ose pas jeter sa casquette sous le banc comme les autres (« c'était là le genre »). Description de cette casquette grotesque. Elle tombe : la classe rit ; le professeur ironise. Interrogé, le nouveau bredouille puis crie « Charbovari » : vacarme, pensums, et vingt fois « ridiculus sum » à copier. Il reste immobile sous les boulettes de papier ; le soir, il travaille avec application, mais sans élégance : ses parents, par économie, l'ont envoyé au collège le plus tard possible.",
        mouvements: [
          "l. 1-6 · Entrée du nouveau avec le Proviseur ; M. Roger, maître d'études.",
          "l. 7-19 · Portrait du « gars de la campagne », maladroit et appliqué ; le rituel des casquettes (« le genre »).",
          "l. 20-29 · Description de la casquette « d'ordre composite ».",
          "l. 30-37 · La casquette tombe : premiers rires ; le « casque » du professeur.",
          "l. 38-60 · « Charbovari » : vacarme, pensums, ridiculus sum.",
          "l. 61-70 · Retour au calme : un élève appliqué mais médiocre, d'origine modeste."
        ],
        procedes: [
          ["Narrateur collectif « nous »", "« Nous étions à l'étude »", "Point de vue des élèves : Charles est vu de l'extérieur, comme un objet de curiosité et de moquerie."],
          ["Description accumulative et satirique", "« une de ces coiffures d'ordre composite, où l'on retrouve les éléments du bonnet à poil, du chapska, du chapeau rond… »", "La casquette ridicule devient le symbole de Charles : disparate, maladroit, sans goût."],
          ["Comparaison dévalorisante", "« sa laideur muette a des profondeurs d'expression comme le visage d'un imbécile »", "L'objet annonce le personnage : laid, muet, un peu bête."],
          ["Comparaisons rurales et religieuses", "« comme un chantre de village » ; « attentif comme au sermon »", "Charles est un naïf de la campagne, docile."],
          ["Ironie du narrateur", "« dit le professeur, qui était un homme d'esprit »", "L'« esprit » du professeur consiste à se moquer d'un élève : il participe au rire."],
          ["Déformation du nom", "« Charbovari »", "Le nom devient un cri de dérision repris par toute la classe (on peut y entendre « charivari », un vacarme moqueur)."],
          ["Gradation et métaphore musicale", "« monta en crescendo » ; « roula en notes isolées »", "Le chahut enfle puis s'éteint comme un morceau de musique."],
          ["Latin scolaire", "« ridiculus sum » ; « Quos ego »", "Punition humiliante (« je suis ridicule ») et comparaison héroï-comique du professeur à Neptune."],
          ["Italiques", "« le nouveau », « le genre »", "Le jargon des élèves, cité avec distance."]
        ],
        ton: "Réaliste, ironique et satirique ; pitié discrète pour Charles."
      },
      problematique: "<p><b>Neutre ? Non.</b> La classe a ses codes (« c'était là le <em>genre</em> ») : qui ne s'y conforme pas est moqué. Le professeur, au lieu de protéger l'élève, rit avec la classe puis le punit (<em>ridiculus sum</em>).</p><p><b>Valeurs transmises</b> : conformité, hiérarchie (banc de paresse, classe « inférieure »), latin et manières d'une élite.</p><p><b>Émancipe ?</b> Non : Charles travaille « en conscience » mais reste sans « élégance » ; l'école le classe et le marque. Noté en cours : l'école devient un <b>lieu de stigmatisation sociale</b> où le professeur participe au « bannissement » symbolique.</p>",
      citations: [
        ["« Nous étions à l'étude, quand le Proviseur entra, suivi d'un nouveau habillé en bourgeois »", "L'incipit et le « nous » des élèves."],
        ["« c'était là le genre »", "La norme du groupe, à laquelle Charles ne se plie pas."],
        ["« Toute la classe se mit à rire. »", "Encadré en cours : « on se moque du mec de campagne »."],
        ["« Charbovari »", "Entouré : le nom déformé devient objet de moquerie."],
        ["« vous me copierez vingt fois le verbe ridiculus sum »", "Entouré : la punition dit elle-même l'humiliation (« je suis ridicule »)."]
      ],
      annotations: [
        ["Recto, l. 31, encadré", "« Toute la classe se mit à rire. » → On se moque du mec de campagne", "La moquerie vise l'origine sociale et rurale de Charles."],
        ["Verso, en haut", "On favorise la conformité → l'école devient un lieu de stigmatisation sociale dans lequel le professeur participe au « bannissement » symbolique", "La thèse à retenir pour la problématique : l'école n'est pas neutre, elle exclut celui qui est différent."],
        ["Verso, l. 44, entouré", "« Charbovari »", "Charles ne sait même pas dire son nom ; la classe s'en empare."],
        ["Verso, l. 48, marge", "« moqueries » (lecture incertaine)", "Résume le passage du vacarme."],
        ["Verso, l. 53-55, marge", "« une sorte de rite de passage » (lecture probable)", "Le bizutage du nouveau : une épreuve d'entrée dans le groupe."],
        ["Verso, l. 58, entouré", "« ridiculus sum »", "« Je suis ridicule » : la punition oblige l'élève à écrire sa propre humiliation."]
      ],
      pieges: [
        "L'incipit ne parle pas d'Emma : il présente <b>Charles</b>, son futur mari.",
        "Le « nous » = les camarades de classe (narrateur collectif), pas Flaubert.",
        "M. Roger = le <b>maître d'études</b> ; celui qui entre avec le nouveau = le <b>Proviseur</b> ; celui qui dit « Levez-vous » et punit = le <b>professeur</b>.",
        "<em>Ridiculus sum</em> = « je suis ridicule », à copier vingt fois ; « Cinq cents vers » = la punition de toute la classe.",
        "Procès en 1857 : Flaubert est <b>acquitté</b>, pas condamné. Flaubert = <b>réalisme</b>, pas romantisme."
      ],
      radar: {
        autorite: 4,
        liberte: 1,
        morale: 1,
        savoir: 2,
        etat: 2,
        critique: 4,
        why: "Proviseur, professeur, pensums (autorité 4) ; conformité imposée (liberté 1) ; aucune morale, du ridicule (1) ; latin et dictionnaire (savoir 2) ; le collège comme institution (2) ; ironie constante (critique 4)."
      },
      carte: { x: 1, y: 7, why: "L'école impose ses codes et stigmatise l'élève différent : conformité, pas émancipation." },
      palais: {
        court: "Vestiaire",
        salle: "Le vestiaire",
        objet: "La casquette composite",
        image: "Une casquette monstrueuse (poils de lapin, boudins, cordon doré) tombe par terre ; au tableau, quelqu'un a écrit « CHARBOVARI » et, dessous, vingt fois « ridiculus sum »."
      }
    },

    /* ─── 6. Hugo ─── */
    {
      id: "hug",
      short: "Hugo",
      auteur: "Victor Hugo",
      auteurDates: "1802-1885",
      titre: "Éduquer pour intégrer l'homme à la société",
      oeuvre: "« Chaque enfant qu'on enseigne », Les Quatre Vents de l'esprit",
      date: "1881 (poème daté de 1853)",
      annee: 1881,
      genre: "Poème argumentatif (alexandrins à rimes plates)",
      mouvement: "Romantisme · poésie engagée",
      nums: { prof: "—", imprime: "TEXTE 4", detail: "Numéro imprimé « TEXTE 4 », non corrigé." },
      icon: "lamp",
      couleur: ["#dc631e", "#fd9320"],
      motcle: "Allumons les esprits",
      symbole: "Une lampe",
      essentiel: [
        "<b>Victor Hugo</b> (1802-1885), chef de file du <b>romantisme</b> et homme politique républicain, exilé sous Napoléon III (1851-1870). En <b>1881</b>, il est <b>sénateur</b> de la Seine (et non député).",
        "Poème argumentatif en alexandrins, publié en 1881 dans <em>Les Quatre Vents de l'esprit</em> sous le titre « <b>Écrit après la visite d'un bagne</b> » (daté de Jersey, 1853). Thèse dès le v. 1 : « Chaque enfant qu'on enseigne est un homme qu'on gagne ».",
        "Argument chiffré : 90 voleurs sur 100 au bagne ne sont jamais allés à l'école. L'<b>ignorance mène au crime</b> ; l'instruction rend raisonnable et honnête.",
        "<b>Métaphore filée</b> lumière / ténèbres (nuit, ombre, abîme / lampe, lueur, « Allumons les esprits ») ; <b>sacralisation</b> de l'école (« sanctuaire autant que la chapelle ») ; <b>impératifs</b> (donnez, Marchez, Allumons, Songeons-y).",
        "Problématique : l'éducation n'est <b>pas neutre</b>, elle est <b>morale et politique</b> : elle « gagne » des hommes à la société et prévient le crime ; c'est une <b>émancipation</b> par le savoir (« qui ne pense pas / Ne vit pas »)."
      ],
      auteurHtml: "<p><b>Victor Hugo</b> naît en <b>1802 à Besançon</b> et meurt en <b>1885 à Paris</b>.</p><ul><li>Chef de file du <b>romantisme</b> : préface de <em>Cromwell</em> (1827), « bataille d'<em>Hernani</em> » (1830), <em>Notre-Dame de Paris</em> (1831).</li><li>Combat contre la <b>peine de mort</b> : <em>Le Dernier Jour d'un condamné</em> (1829), <em>Claude Gueux</em> (1834).</li><li>Homme politique : pair de France (1845), député (1848, 1849, 1871), puis <b>sénateur de la Seine de 1876 à sa mort</b>.</li><li>Opposé au coup d'État de Louis-Napoléon Bonaparte (2 décembre 1851), il vit <b>19 ans en exil</b> (Bruxelles, Jersey, Guernesey) : <em>Les Châtiments</em> (1853), <em>Les Contemplations</em> (1856), <em>Les Misérables</em> (1862).</li><li>Rentré en 1870, il devient une gloire nationale : ses <b>funérailles nationales</b> (1er juin 1885) réunissent plus d'un million de personnes ; il est inhumé au <b>Panthéon</b>.</li></ul>",
      anecdotes: [
        ["« <b>Ouvrir une école, c'est fermer une prison</b> » : phrase célèbre… mais <b>pas de Hugo</b> ! On ne la trouve pas dans ses œuvres ; le Grand Larousse du XIXe siècle l'attribuait au journaliste Louis Jourdan. Elle résume pourtant bien ce poème.", "https://www.guichetdusavoir.org/question/voir/31966"],
        ["Le poème est daté de <b>Jersey, 1853</b>, en plein exil, mais publié seulement en <b>1881</b>.", "https://fr.wikisource.org/wiki/Les_Quatre_Vents_de_l%E2%80%99esprit/Le_Livre_satirique/%C3%89crit_apr%C3%A8s_la_visite_d%E2%80%99un_bagne"],
        ["Dans <em>Les Misérables</em> (1862), Jean Valjean passe 19 ans au <b>bagne</b> de Toulon pour avoir volé un pain (et pour ses tentatives d'évasion).", "https://en.wikipedia.org/wiki/Les_Mis%C3%A9rables"],
        ["Hugo demande à être conduit au Panthéon dans le « <b>corbillard des pauvres</b> » : plus d'un million de personnes suivent le cortège, le 1er juin 1885.", "https://fr.wikipedia.org/wiki/Fun%C3%A9railles_de_Victor_Hugo"]
      ],
      epoque: "<p>Deux moments : le poème est <b>écrit en 1853</b>, pendant l'exil, sous le <b>Second Empire</b> ; il est <b>publié en 1881</b>, sous la <b>IIIe République</b>, l'année de la loi sur la <b>gratuité</b> de l'école primaire (16 juin 1881), juste avant l'obligation et la laïcité (28 mars 1882).</p><p><b>Justice</b> : les bagnes (Brest, Toulon, Rochefort) enferment les condamnés aux travaux forcés, souvent pauvres et illettrés, qui « signent d'une croix ».</p>",
      mouvementHtml: "<ul><li><b>Romantisme</b> : lyrisme, émotions, images fortes (antithèses, métaphores), poète « mage » qui guide le peuple vers la lumière.</li><li><b>Poésie engagée</b> : Hugo met la poésie au service de causes (misère, peine de mort, éducation, liberté).</li><li>« Le Livre satirique » des <em>Quatre Vents de l'esprit</em> : la satire dénonce les injustices sociales.</li></ul>",
      ideologie: "<p>Pour Hugo, le crime n'est pas une fatalité mais une conséquence de l'<b>ignorance</b> et de la misère : la société est responsable. Instruire, c'est <b>prévenir le crime</b>, rendre l'homme raisonnable et moral, et « gagner » un citoyen.</p><p>L'école devient une sorte de religion laïque (« sanctuaire autant que la chapelle ») : Hugo mêle vocabulaire sacré et idéal républicain de progrès, pour une instruction offerte à tous.</p>",
      oeuvreHtml: "<p><em>Les Quatre Vents de l'esprit</em> (1881) : recueil en quatre « livres » (satirique, dramatique, lyrique, épique). Le poème étudié appartient au <b>Livre satirique</b> ; son titre dans le recueil est « Écrit après la visite d'un bagne ». La feuille n'en donne qu'une partie (26 vers, avec des coupes) : le poème complet compte environ 120 vers en deux parties.</p>",
      place: "<p>Le titre de la feuille, « Chaque enfant qu'on enseigne », reprend le premier vers. L'extrait regroupe l'ouverture (thèse et preuve) et le cœur de l'argumentation (appel à éclairer les esprits).</p>",
      extrait: {
        resume: "Instruire un enfant, c'est gagner un homme. Preuve : 90 voleurs sur 100 au bagne ne sont jamais allés à l'école ; l'ignorance est la nuit où naît le crime. L'école est aussi sacrée que la chapelle : chaque lettre de l'alphabet contient une vertu. Il faut donner le livre à l'enfant et le guider, la lampe à la main. Sans enseignement, on jette dans l'État des « hommes animaux ». Notre loi première est d'allumer les esprits : l'école change le cuivre en or, l'ignorance l'or en plomb.",
        mouvements: [
          "v. 1-7 · Thèse et preuve : l'ignorance mène au bagne (« L'ignorance est la nuit qui commence l'abîme »).",
          "v. 8-14 · L'école sacrée et lumineuse ; appel aux éducateurs à l'impératif (« Marchez, la lampe en main »).",
          "v. 15-19 · Sans enseignement : des « hommes animaux, têtes inachevées », aveugles dans le monde moral.",
          "v. 20-26 · Devoir collectif (« Allumons les esprits ») et maxime finale : l'école change le cuivre en or."
        ],
        procedes: [
          ["Vers-thèse (maxime) et parallélisme", "« Chaque enfant qu'on enseigne est un homme qu'on gagne. »", "Formule frappante et facile à retenir : instruire = gagner un homme à la société."],
          ["Argument chiffré", "« Quatre-vingt-dix voleurs sur cent qui sont au bagne / Ne sont jamais allés à l'école une fois »", "Preuve concrète du lien entre ignorance et crime."],
          ["Métaphore filée lumière / ténèbres", "« L'ignorance est la nuit qui commence l'abîme » ; « Allumons les esprits »", "Le savoir éclaire, l'ignorance aveugle : l'opposition structure le poème."],
          ["Sacralisation", "« L'école est sanctuaire autant que la chapelle »", "L'école a la dignité d'un lieu sacré (note de cours : « sacralisation de l'école »)."],
          ["Impératif et « nous »", "« donnez le petit livre » ; « Marchez » ; « Allumons » ; « faisons » ; « Songeons-y »", "Exhortation : visée argumentative, appel à agir (note de cours : « impératif »)."],
          ["Animalisation", "« Des hommes animaux, têtes inachevées »", "Sans instruction, l'homme reste inachevé, guidé par ses instincts."],
          ["Rejet (enjambement)", "« et qui ne pense pas / Ne vit pas »", "Mise en relief : penser, c'est vivre vraiment."],
          ["Antithèse finale (image alchimique)", "« l'école en or change le cuivre, / Tandis que l'ignorance en plomb transforme l'or »", "Chute frappante : l'école élève, l'ignorance dégrade."]
        ],
        ton: "Lyrique, argumentatif et polémique (satire sociale) ; solennel."
      },
      problematique: "<p><b>Neutre ? Non.</b> Pour Hugo, l'instruction est une arme <b>morale</b> (chaque lettre contient « une vertu ») et <b>politique</b> (lutter contre le crime, former des citoyens). Elle est même sacralisée.</p><p><b>Émancipe ?</b> Oui : elle arrache l'homme à la « nuit », à l'instinct et au crime ; penser, c'est vivre. Mais cette émancipation a une visée sociale : « gagner » des hommes à la société.</p>",
      citations: [
        ["« Chaque enfant qu'on enseigne est un homme qu'on gagne. »", "La thèse (v. 1)."],
        ["« L'ignorance est la nuit qui commence l'abîme. »", "Métaphore de l'ignorance."],
        ["« L'école est sanctuaire autant que la chapelle. »", "Sacralisation de l'école."],
        ["« Marchez, la lampe en main, pour qu'il puisse vous suivre. »", "Impératif : le maître guide l'enfant vers la lumière."],
        ["« Allumons les esprits, c'est notre loi première »", "Le devoir collectif d'instruire."],
        ["« l'école en or change le cuivre, / Tandis que l'ignorance en plomb transforme l'or »", "Chute : l'alchimie de l'éducation."]
      ],
      annotations: [
        ["v. 1, surligné en jaune", "→ thèse principale", "Le premier vers annonce toute l'argumentation."],
        ["v. 2-4, accolade", "→ un homme pas instruit = pas raisonnable", "L'argument chiffré : l'ignorance conduit au crime."],
        ["v. 8, « sanctuaire » encadré", "sacralisation de l'école", "L'école est mise au même rang que la chapelle : un lieu sacré."],
        ["v. 9-11, accolade", "opposition entre lumière et ténèbres / entre enfant et animaux", "Métaphore filée (lueur / nuit) et opposition de l'enfant instruit aux « hommes animaux »."],
        ["v. 13, « Marchez » entouré", "visée argumentative", "L'impératif montre que le poème veut convaincre et faire agir."],
        ["Marge gauche", "Impératif (traits vers Marchez, Allumons, faisons, Songeons-y)", "Relevé des verbes à l'impératif : exhortation."],
        ["v. 23-24, entourés", "« qui ne pense pas / Ne vit pas »", "Rejet : l'accent tombe sur « Ne vit pas »."],
        ["Sous la référence", "député, c'est un membre du corps politique", "Hugo est bien un homme politique… mais en 1881 il est sénateur (depuis 1876), pas député."]
      ],
      pieges: [
        "1881 = publication du recueil ; le poème est daté de <b>1853</b> (Jersey, exil).",
        "En 1881, Hugo est <b>sénateur</b> (1876-1885), pas député (il l'a été en 1848-1851 et en 1871).",
        "Titre dans le recueil : « Écrit après la visite d'un bagne » ; « Chaque enfant qu'on enseigne » est le premier vers.",
        "« Ouvrir une école, c'est fermer une prison » n'est <b>pas</b> une citation de Hugo.",
        "Hugo = <b>romantisme</b> ; recueil = <em>Les Quatre Vents de l'esprit</em> (pas <em>Les Contemplations</em>)."
      ],
      radar: {
        autorite: 2,
        liberte: 4,
        morale: 5,
        savoir: 4,
        etat: 4,
        critique: 4,
        why: "Le maître guide « la lampe en main » (autorité 2) ; penser libère (liberté 4) ; chaque lettre porte « une vertu » (morale 5) ; l'alphabet, le livre (savoir 4) ; « on jette dans l'État », « notre loi première » (rôle collectif 4) ; satire sociale du bagne (critique 4)."
      },
      carte: {
        x: 9,
        y: 9,
        why: "Éducation fortement chargée de valeurs (morale, sacré, citoyenneté) et très émancipatrice : elle sauve de la nuit et du crime."
      },
      palais: {
        court: "Chapelle bibliothèque",
        salle: "La chapelle-bibliothèque",
        objet: "Une lampe",
        image: "Au fond d'une chapelle transformée en bibliothèque, un maître tend une lampe allumée à un enfant ; dans l'ombre, des bagnards signent d'une croix ; au sol, du cuivre se change en or."
      }
    },

    /* ─── 7. Ferry ─── */
    {
      id: "fer",
      short: "Ferry",
      auteur: "Jules Ferry",
      auteurDates: "1832-1893",
      titre: "L'éducation morale de la nation, une priorité",
      oeuvre: "« Lettre aux instituteurs »",
      date: "17 novembre 1883",
      annee: 1883,
      genre: "Lettre officielle (circulaire ministérielle), texte argumentatif",
      mouvement: "IIIe République : laïcité et école républicaine",
      nums: { prof: "—", imprime: "TEXTE 5", detail: "Numéro imprimé « TEXTE 5 », non corrigé." },
      icon: "tablet",
      couleur: ["#253496", "#5b8bff"],
      motcle: "Croyances ≠ connaissances",
      symbole: "Le tableau des lois",
      essentiel: [
        "<b>Jules Ferry</b> (1832-1893), républicain, <b>ministre de l'Instruction publique</b> (et président du Conseil en 1883) : lois de <b>1881</b> (gratuité) et <b>1882</b> (obligation de 6 à 13 ans, laïcité des programmes).",
        "« <b>Lettre aux instituteurs</b> » du <b>17 novembre 1883</b> : elle explique la loi du 28 mars 1882 : « L'instruction religieuse appartient aux familles et à l'Église, l'instruction morale à l'école. »",
        "Distinction clé : les <b>croyances</b>, « personnelles, libres et variables », et les <b>connaissances</b>, « communes et indispensables à tous ».",
        "La loi n'est pas « purement négative » : elle fonde une <b>éducation nationale</b> sur « le devoir et le droit », confiée à l'instituteur (« c'est sur vous, Monsieur ») ; la morale fait « la dignité de [sa] profession ».",
        "Problématique : école <b>neutre religieusement</b> (laïque, liberté de conscience) mais <b>pas neutre moralement ni politiquement</b> : elle transmet une morale commune et forme des citoyens républicains."
      ],
      auteurHtml: "<p><b>Jules Ferry</b> naît en <b>1832 à Saint-Dié</b> (Vosges) et meurt en <b>1893</b> à Paris.</p><ul><li>Avocat, journaliste opposant au Second Empire, député républicain (1869), maire de Paris pendant le siège (1870-1871).</li><li><b>Ministre de l'Instruction publique</b> à plusieurs reprises (1879-1883) et <b>président du Conseil</b> (1880-1881, 1883-1885).</li><li><b>Lois scolaires</b> : gratuité (16 juin 1881), obligation et laïcité des programmes (28 mars 1882).</li><li>Partisan de l'<b>expansion coloniale</b> (Tunisie, Tonkin), il est renversé en 1885 (surnommé « Ferry-Tonkin »). Élu président du Sénat en 1893, il meurt quelques semaines plus tard.</li></ul>",
      anecdotes: [
        ["Le test du « <b>père de famille</b> », dans la même lettre : avant d'enseigner une maxime, l'instituteur doit se demander si un seul père de famille honnête, présent dans la classe, pourrait de bonne foi refuser son assentiment. Si oui, qu'il s'abstienne.", "https://clio-texte.clionautes.org/lettre-jules-ferry-aux-instituteurs.html"],
        ["Quand il signe la lettre (17 novembre 1883), Ferry est à la fois <b>président du Conseil et ministre de l'Instruction publique</b> ; trois jours plus tard, il prend les Affaires étrangères.", "https://en.wikipedia.org/wiki/Jules_Ferry"],
        ["Ferry défend aussi la <b>colonisation</b> : à la Chambre, le 28 juillet 1885, il déclare que « les races supérieures ont un droit vis-à-vis des races inférieures ». L'école républicaine n'est donc pas « neutre » idéologiquement.", "https://www2.assemblee-nationale.fr/decouvrir-l-assemblee/histoire/grands-discours-parlementaires/jules-ferry-28-juillet-1885"],
        ["La <b>loi Goblet</b> (30 octobre 1886) complète les lois Ferry : seuls des laïcs enseignent dans les écoles publiques. La <b>loi de 1905</b> sépare ensuite les Églises et l'État.", "https://www.pourquoilalaicite.fr/lois-ferry"]
      ],
      epoque: "<p><b>IIIe République</b> (proclamée le 4 septembre 1870) : après la défaite contre la Prusse, les républicains veulent enraciner la République et former des citoyens. Conflit avec l'Église catholique, qui contrôle une grande partie de l'enseignement.</p><p><b>Lois scolaires</b> : loi Paul Bert (9 août 1879, écoles normales dans chaque département), gratuité (16 juin 1881), obligation de 6 à 13 ans et laïcité des programmes (28 mars 1882), loi Goblet (30 octobre 1886, personnel laïque), puis séparation des Églises et de l'État (9 décembre 1905).</p>",
      mouvementHtml: "<ul><li><b>Républicanisme laïque</b> : l'école doit former des citoyens éclairés et libres, par la raison.</li><li>Héritage des <b>Lumières</b> (Condorcet et l'instruction publique) : confiance dans le savoir et le progrès.</li><li>Influence du <b>positivisme</b> (Auguste Comte, Littré) : une morale fondée sur la raison, indépendante des religions.</li><li>Encadré de la feuille : débat des Lumières entre <b>Helvétius</b> (éduquer d'abord la morale) et <b>Diderot</b> (pas de justice sans lumières, donc instruire).</li></ul>",
      ideologie: "<p>Ferry sépare ce qui relève de la <b>croyance</b> (privée : familles, Églises) et ce qui relève de la <b>connaissance</b> (publique : école). La morale enseignée est présentée comme <b>universelle</b>, acceptée « de l'aveu de tous », comme la grammaire ou le calcul.</p><p>L'instituteur devient un <b>éducateur moral et civique</b>, pas seulement quelqu'un qui apprend à lire. Mais cette morale « commune » est aussi celle de la République : devoir, droit, patrie.</p>",
      oeuvreHtml: "<p>La <b>« Lettre aux instituteurs »</b> est une circulaire que le ministre adresse personnellement à tous les instituteurs, pour la deuxième année d'application de la loi du 28 mars 1882. Elle les guide dans l'enseignement moral et civique et insiste sur la prudence et le respect de la conscience des enfants et des familles (test du « père de famille »).</p>",
      place: "<p>L'extrait correspond au début de la lettre, qui rappelle l'esprit de la loi du 28 mars 1882 avant les conseils pratiques.</p>",
      extrait: {
        resume: "La loi du 28 mars a deux dispositions complémentaires : elle retire du programme tout dogme particulier et place au premier rang l'enseignement moral et civique. L'instruction religieuse revient aux familles et à l'Église, l'instruction morale à l'école. La loi sépare l'école de l'Église, garantit la liberté de conscience et distingue les croyances (personnelles) des connaissances (communes). Elle fonde une éducation nationale sur le devoir et le droit, et compte sur l'instituteur, dont l'enseignement moral fait la dignité.",
        mouvements: [
          "l. 1-4 · Les deux dispositions de la loi du 28 mars : pas de dogme / la morale au premier rang.",
          "l. 5-11 · Séparer l'école de l'Église : croyances (familles, Église) ≠ connaissances (école).",
          "l. 12-15 · Fonder une éducation nationale sur le devoir et le droit.",
          "l. 15-22 · Le rôle de l'instituteur : l'enseignement moral fait la dignité de sa profession."
        ],
        procedes: [
          ["Adresse directe", "« c'est sur vous, Monsieur, que les pouvoirs publics ont compté »", "Lettre officielle qui implique personnellement chaque instituteur."],
          ["Structure logique", "« d'une part… d'autre part » ; « Sans doute… Mais… » ; « Au contraire »", "Argumentation rigoureuse, avec concession puis réfutation."],
          ["Antithèse croyances / connaissances", "« personnelles, libres et variables » / « communes et indispensables à tous »", "Définition de la laïcité scolaire."],
          ["Parallélisme", "« L'instruction religieuse appartient aux familles et à l'Église, l'instruction morale à l'école. »", "Partage clair des rôles."],
          ["Négation réfutée", "« Le législateur n'a donc pas entendu faire une œuvre purement négative »", "Réponse aux adversaires qui voient dans la laïcité une école « sans Dieu » et sans morale."],
          ["Lexique des valeurs", "« devoir », « droit », « dignité », « liberté de conscience », « vérités »", "Une morale républicaine présentée comme universelle."],
          ["Comparaison", "« pas moins universellement acceptées que celles du langage ou du calcul »", "La morale est présentée comme une évidence partagée."]
        ],
        ton: "Didactique, solennel et rassurant ; argumentatif."
      },
      problematique: "<p><b>Neutre ? Oui et non.</b> Neutre <b>religieusement</b> : aucun dogme, respect de la liberté de conscience des maîtres et des élèves. Mais <b>pas neutre moralement ni politiquement</b> : l'école transmet la morale du devoir et du droit, fonde une « éducation nationale » et forme des républicains.</p><p><b>Émancipe ?</b> Oui par le savoir et la liberté de conscience ; mais elle conforme aussi à une morale commune et aux valeurs de la nation (et, à l'époque, à l'idéologie coloniale).</p>",
      citations: [
        ["« L'instruction religieuse appartient aux familles et à l'Église, l'instruction morale à l'école. »", "La formule-clé de la laïcité scolaire."],
        ["« celui des croyances qui sont personnelles, libres et variables »", "Les croyances relèvent du privé."],
        ["« celui des connaissances qui sont communes et indispensables à tous »", "Les connaissances relèvent de l'école."],
        ["« Le législateur n'a donc pas entendu faire une œuvre purement négative. »", "La laïcité n'est pas un vide : elle fonde une morale."],
        ["« c'eût été vous enlever ce qui fait la dignité de votre profession »", "La morale fait la dignité du métier d'instituteur."]
      ],
      annotations: [],
      pieges: [
        "Loi du <b>16 juin 1881</b> (gratuité) ≠ loi du <b>28 mars 1882</b> (obligation + laïcité) ≠ lettre du <b>17 novembre 1883</b>.",
        "Ferry ne supprime pas la morale : il remplace l'instruction <b>religieuse</b> par l'instruction <b>morale et civique</b>.",
        "La laïcité de 1882 concerne les <b>programmes</b> ; celle du <b>personnel</b> vient avec la loi Goblet (1886) ; la séparation des Églises et de l'État date de <b>1905</b>.",
        "Encadré : <b>Helvétius</b> veut une éducation morale ; <b>Diderot</b> répond qu'il n'y a pas de justice sans lumières. Ne pas inverser.",
        "Ferry n'est pas président de la République : il est président du Conseil (chef du gouvernement) et ministre."
      ],
      radar: {
        autorite: 4,
        liberte: 3,
        morale: 5,
        savoir: 4,
        etat: 5,
        critique: 1,
        why: "L'État fixe la loi, l'instituteur applique (autorité 4) ; liberté de conscience garantie (liberté 3) ; morale au premier rang (5) ; lire, écrire, compter (savoir 4) ; éducation nationale, pouvoirs publics (État 5) ; texte officiel, peu critique (1)."
      },
      carte: {
        x: 7,
        y: 8,
        why: "Se veut neutre religieusement, mais transmet une morale et des valeurs républicaines ; émancipe par l'instruction et la liberté de conscience."
      },
      palais: {
        court: "Bureau du ministre",
        salle: "Le bureau du ministre",
        objet: "Le tableau des lois",
        image: "Sur un grand tableau noir à deux colonnes : à gauche « CROYANCES → familles, Église », à droite « CONNAISSANCES + MORALE → école ». En haut, trois dates à la craie : 1881, 1882, 1883."
      }
    },

    /* ─── 8. Péguy ─── */
    {
      id: "peg",
      short: "Péguy",
      auteur: "Charles Péguy",
      auteurDates: "1873-1914",
      titre: "Le mythe républicain",
      oeuvre: "L'Argent",
      date: "1913 (souvenir de 1880)",
      annee: 1913,
      genre: "Essai polémique en prose (souvenir autobiographique)",
      mouvement: "Écrivain engagé de la Belle Époque · mythe de l'école républicaine",
      nums: { prof: "—", imprime: "TEXTE 6", detail: "Numéro imprimé « TEXTE 6 », non corrigé." },
      icon: "palms",
      couleur: ["#9a49e0", "#c35cec"],
      motcle: "Hussards noirs",
      symbole: "L'uniforme noir à palmes violettes",
      essentiel: [
        "<b>Charles Péguy</b> (1873-1914), fils d'une rempailleuse de chaises d'Orléans, <b>boursier</b> devenu normalien, <b>dreyfusard</b>, fondateur des <em>Cahiers de la Quinzaine</em> (1900) ; tué au front le <b>5 septembre 1914</b>, à la veille de la bataille de la Marne.",
        "<em>L'Argent</em> (<b>1913</b>) : souvenir des jeunes maîtres de l'école annexe de l'École normale d'Orléans (vers 1880). Il invente l'image des instituteurs « <b>hussards noirs</b> » de la République.",
        "Procédés : <b>comparaison</b> puis <b>métaphore filée militaire</b> (hussards, uniforme, régiment, dépôt), description de l'<b>uniforme noir à palmes violettes</b>, anaphore « <b>Par ces…</b> » et métaphores filiales (« <b>enfants</b> » et « <b>nourrissons</b> de la République »).",
        "<b>Éloge</b> nostalgique : jeunesse, beauté, <b>sévérité</b>, civisme ; l'École normale est « un régiment inépuisable », « un immense dépôt […] de jeunesse et de civisme ».",
        "Problématique : c'est un <b>mythe républicain</b> : l'école est une institution militante, presque militaire et religieuse, qui diffuse les valeurs de la République. Elle n'est pas neutre… et elle a émancipé le petit Péguy."
      ],
      auteurHtml: "<p><b>Charles Péguy</b> naît le <b>7 janvier 1873 à Orléans</b> dans un milieu modeste : son père meurt quand il est tout petit ; sa mère est <b>rempailleuse de chaises</b>.</p><ul><li>Élève de l'<b>école annexe</b> de l'École normale d'instituteurs d'Orléans (1879-1884), puis <b>boursier</b> au lycée ; il entre à l'<b>École normale supérieure</b> (1894).</li><li><b>Dreyfusard</b> passionné, socialiste (proche de Jaurès avant de rompre avec lui), puis revenu au <b>catholicisme</b> : poète de Jeanne d'Arc (<em>Le Mystère de la charité de Jeanne d'Arc</em>, 1910).</li><li>Fonde et dirige les <em>Cahiers de la Quinzaine</em> (1900-1914) ; <em>Notre jeunesse</em> (1910), <em>L'Argent</em> (1913).</li><li>Lieutenant d'infanterie, il est <b>tué le 5 septembre 1914</b> près de Villeroy (Seine-et-Marne), à la veille de la première bataille de la Marne.</li></ul>",
      anecdotes: [
        ["L'expression « <b>hussards noirs</b> » vient de ce texte de 1913 : elle désigne depuis les instituteurs de la IIIe République.", "https://clio-texte.clionautes.org/hussards-noirs-de-la-republique.html"],
        ["Pourquoi « hussards » ? Au XVe siècle, le hussard est un cavalier hongrois réputé pour son courage ; pendant la Révolution, la jeune République eut des hussards en uniforme noir (encadré de la feuille).", "feuille (encadré « Le saviez-vous ? »)"],
        ["Dans <em>Notre jeunesse</em> (1910), Péguy écrit : « Tout commence en mystique et finit en politique. »", "https://en.wikipedia.org/wiki/Charles_P%C3%A9guy"],
        ["La photo de la feuille montre une promotion de l'École normale de <b>Loches</b> (Indre-et-Loire), vers 1907 : pas celle d'Orléans.", "feuille (légende de la photo)"]
      ],
      epoque: "<p><b>1880</b> (le souvenir) : débuts de la <b>IIIe République</b> et des lois Ferry ; les écoles normales (loi Paul Bert, 1879) forment en nombre des instituteurs laïques, en uniforme.</p><p><b>1913</b> (l'écriture) : Belle Époque, veille de la Grande Guerre. Après l'affaire Dreyfus (1894-1906) et la loi de 1905, Péguy regrette l'idéal républicain de son enfance, qu'il oppose au règne de l'argent et de la politique.</p>",
      mouvementHtml: "<p>Péguy n'appartient pas à un mouvement littéraire précis : c'est un <b>écrivain engagé</b> de la Belle Époque, républicain, socialiste de cœur puis catholique, qui pense en termes de « <b>mystique</b> » (l'idéal) et de « <b>politique</b> » (sa dégradation).</p><p>Le texte relève de l'<b>éloge</b> (registre épidictique) et du souvenir <b>autobiographique</b> : il construit un <b>mythe</b>, celui de l'école républicaine.</p>",
      ideologie: "<p>L'école républicaine est pour Péguy une <b>mystique</b> : ses maîtres, jeunes, pauvres et sévères, sont les soldats d'une mission civique. L'uniforme, « plus militaire » qu'un uniforme militaire parce que « civique », dit que l'instruction est un <b>service de la nation</b>.</p><p>Le violet, couleur des évêques et de l'enseignement primaire, suggère une école qui a pris le relais de l'Église comme <b>autorité morale</b>.</p>",
      oeuvreHtml: "<p><em>L'Argent</em> (1913, dans les <em>Cahiers de la Quinzaine</em>) est un long essai polémique : Péguy y oppose le vieux peuple de France, le travail bien fait et l'école de son enfance au « monde moderne » dominé par l'<b>argent</b>. L'extrait est un souvenir d'enfance au sein de cette méditation.</p>",
      place: "<p>Souvenir personnel « daté de 1880 » (chapeau) : l'enfant Péguy voit chaque semaine un nouvel élève-maître descendre de l'École normale vers l'école annexe où il étudie.</p>",
      extrait: {
        resume: "Les jeunes maîtres de Péguy étaient « beaux comme des hussards noirs » : sveltes, sévères, sanglés, sérieux, un peu tremblants de leur soudaine toute-puissance. Description de leur uniforme noir, relevé de violet (couleur des évêques et de l'enseignement primaire) : un uniforme civil plus sévère qu'un uniforme militaire, parce que civique. Ces jeunes gens étaient les enfants, les hussards, les nourrissons de la République. Chaque semaine, un nouveau venait de l'École normale, « régiment inépuisable », « dépôt » de jeunesse et de civisme.",
        mouvements: [
          "l. 1-3 · Portrait des jeunes maîtres : « beaux comme des hussards noirs ».",
          "l. 3-11 · Description de l'uniforme noir à liseré et palmes violettes : un « uniforme civique ».",
          "l. 11-15 · Éloge de l'uniforme noir ; les maîtres, « enfants », « hussards » et « nourrissons » de la République.",
          "l. 15-22 · L'École normale, « régiment inépuisable », « dépôt » de jeunesse et de civisme."
        ],
        procedes: [
          ["Comparaison puis métaphore filée militaire", "« beaux comme des hussards noirs » ; « régiment inépuisable » ; « dépôt »", "Les instituteurs sont les soldats de la République."],
          ["Phrases nominales, rythme ternaire, allitération en [s]", "« Sveltes ; sévères ; sanglés. »", "Rythme martial, portrait saisissant."],
          ["Description symbolique", "« un long pantalon noir […] avec un liseré violet » ; « deux croisements de palmes violettes »", "Noir = sévérité ; violet = sacré (évêques) et enseignement primaire."],
          ["Paradoxe et gradation", "« uniforme civil […] encore plus militaire, étant un uniforme civique »", "Le civisme est plus exigeant que l'armée."],
          ["Anaphore et métaphores filiales", "« Par ces gamins… Par ces jeunes hussards de la République. Par ces nourrissons de la République. »", "La République personnifiée en mère ; les maîtres, ses enfants (question 3 de la feuille)."],
          ["Hyperbole", "« un immense dépôt, gouvernemental, de jeunesse et de civisme »", "L'École normale, réserve inépuisable de la République."],
          ["Point de vue de l'enfant, nostalgie", "« Nos jeunes maîtres » ; « je pense »", "Souvenir admiratif qui idéalise : construction d'un mythe."]
        ],
        ton: "Éloge lyrique et nostalgique (épidictique) ; mythifiant."
      },
      problematique: "<p><b>Neutre ? Non.</b> Les instituteurs sont des « hussards » au service de la République : l'école est une institution <b>militante</b>, chargée de diffuser et d'enraciner les valeurs républicaines (chapeau).</p><p><b>Émancipe ?</b> Pour Péguy, oui : l'enfant pauvre d'Orléans, boursier, est devenu normalien grâce à cette école. Mais l'image est idéalisée : c'est un <b>mythe</b> (titre de la feuille), qui inspire le respect de l'institution.</p>",
      citations: [
        ["« Nos jeunes maîtres étaient beaux comme des hussards noirs. »", "La comparaison fondatrice."],
        ["« Sveltes ; sévères ; sanglés. »", "Phrase nominale, rythme ternaire, allitération."],
        ["« Le violet n'est pas seulement la couleur des évêques, il est aussi la couleur de l'enseignement primaire. »", "Le sacré passe de l'Église à l'école."],
        ["« Par ces jeunes hussards de la République. Par ces nourrissons de la République. »", "Anaphore et métaphores filiales."],
        ["« un immense dépôt, gouvernemental, de jeunesse et de civisme »", "L'École normale, réserve de la République."]
      ],
      annotations: [],
      pieges: [
        "« Hussards noirs » = les <b>instituteurs</b> (élèves-maîtres des écoles normales), pas des soldats.",
        "Le souvenir date de <b>1880</b> ; le texte de <b>1913</b> (<em>L'Argent</em>).",
        "L'uniforme est <b>civil</b> (« uniforme civique ») : Péguy le compare à un uniforme militaire.",
        "Le violet : couleur des évêques <b>et</b> de l'enseignement primaire.",
        "La photo (École normale de Loches, vers 1907) illustre le texte : ce n'est pas l'école d'Orléans."
      ],
      radar: {
        autorite: 4,
        liberte: 2,
        morale: 4,
        savoir: 3,
        etat: 5,
        critique: 1,
        why: "Maîtres sévères, « omnipotence » (autorité 4) ; peu de place pour l'élève (liberté 2) ; civisme (morale 4) ; « tant d'enseignement » (savoir 3) ; « le gouvernement de la République » fournit les maîtres (État 5) ; éloge, aucune critique de l'école (1)."
      },
      carte: {
        x: 6,
        y: 10,
        why: "Le texte le plus chargé d'idéologie : un mythe républicain. L'école a pourtant émancipé l'enfant pauvre qu'était Péguy."
      },
      palais: {
        court: "Cour d'honneur",
        salle: "La cour d'honneur",
        objet: "L'uniforme noir à palmes violettes",
        image: "Dans la cour, un régiment de jeunes maîtres en redingote noire se tient au garde-à-vous ; sur leurs casquettes plates brillent deux palmes violettes croisées."
      }
    },

    /* ─── 9. Camus ─── */
    {
      id: "cam",
      short: "Camus",
      auteur: "Albert Camus",
      auteurDates: "1913-1960",
      titre: "Hommage au maître",
      oeuvre: "Lettre à Louis Germain + Le Premier Homme (+ BD Paroles d'école)",
      date: "1957 (lettre) · 1994 (roman posthume)",
      annee: 1957,
      genre: "Lettre privée + roman autobiographique inachevé (+ bande dessinée, 2013)",
      mouvement: "Absurde et révolte · humanisme (XXe s.)",
      nums: { prof: "4", imprime: "5 (manuel)", detail: "« 5 » du manuel barré en rose, « 4 » écrit en dessous." },
      icon: "hand",
      couleur: ["#857d0b", "#e3d612"],
      motcle: "La main tendue",
      symbole: "Une main tendue",
      essentiel: [
        "<b>Albert Camus</b> (1913-1960), écrivain et philosophe de l'<b>absurde</b> et de la <b>révolte</b>, né en Algérie dans une famille très pauvre : père tué à la guerre en 1914, mère illettrée et à demi sourde. <b>Prix Nobel de littérature en 1957</b>.",
        "Lettre du <b>19 novembre 1957</b> à son instituteur <b>Louis Germain</b> : sa première pensée, « après [sa] mère », a été pour lui ; sans sa « <b>main affectueuse</b> » tendue « au petit enfant pauvre », rien ne serait arrivé.",
        "<em>Le Premier Homme</em> (roman autobiographique inachevé, publié en <b>1994</b>) : <b>M. Bernard</b> (= Louis Germain) nourrit chez les élèves « la <b>faim de la découverte</b> » ; ailleurs, on les « gave » comme des oies.",
        "Procédés : lettre de <b>gratitude</b> (anaphore « Sans vous, sans… », formule finale « de toutes mes forces »), <b>métaphore de la nourriture</b> (nourrir, faim, gaver), valorisation (« dignes de découvrir le monde »).",
        "Problématique : l'école n'est <b>pas neutre</b> (le maître condamne le vol, la délation…) mais elle <b>émancipe</b> : elle arrache l'enfant pauvre à son destin et lui ouvre le monde."
      ],
      auteurHtml: "<p><b>Albert Camus</b> naît le <b>7 novembre 1913 à Mondovi</b> (Algérie) et meurt le <b>4 janvier 1960</b> dans un accident de voiture à Villeblevin (Yonne).</p><ul><li>Son père, Lucien, est mortellement blessé à la bataille de la Marne (mort en octobre 1914) ; sa mère, d'origine espagnole, est à demi sourde et illettrée ; enfance pauvre dans le quartier de <b>Belcourt</b>, à Alger.</li><li>Son instituteur <b>Louis Germain</b> le prépare au concours des bourses : il peut entrer au lycée (lycée Bugeaud d'Alger), puis étudier la philosophie.</li><li>Journaliste, résistant (journal <em>Combat</em>), romancier et dramaturge : cycle de l'<b>absurde</b> (<em>L'Étranger</em> et <em>Le Mythe de Sisyphe</em>, 1942) et de la <b>révolte</b> (<em>La Peste</em>, 1947 ; <em>L'Homme révolté</em>, 1951).</li><li><b>Prix Nobel de littérature</b> 1957 (annoncé le 17 octobre, discours le 10 décembre).</li></ul>",
      anecdotes: [
        ["Camus a dédié ses <em>Discours de Suède</em> (discours du Nobel, publiés en 1958) <b>à Louis Germain</b>.", "https://actualitte.com/article/20802/radio/le-discours-engage-d-albert-camus-pour-son-prix-nobel"],
        ["Le manuscrit du <em>Premier Homme</em> a été retrouvé dans la <b>sacoche</b> de Camus, sur les lieux de l'accident du 4 janvier 1960 ; sa fille Catherine l'a publié en <b>1994</b>.", "https://en.wikipedia.org/wiki/The_First_Man"],
        ["Louis Germain a répondu à Camus (lettre du 30 avril 1959) ; les deux lettres sont publiées en annexe du <em>Premier Homme</em>.", "https://www.gallimard.fr/actualites-entretiens/echange-autour-d-un-prix-nobel"],
        ["Dans le roman, Camus s'appelle <b>Jacques Cormery</b> et son instituteur <b>M. Bernard</b>.", "https://en.wikipedia.org/wiki/The_First_Man"],
        ["Dans la BD de la feuille, l'instituteur fait réciter « <b>En sortant de l'école</b> » de Jacques Prévert (« tout autour de la terre / dans un wagon doré »).", "https://www.lapoesie.org/jacques-prevert/en-sortant-de-lecole/"]
      ],
      epoque: "<p><b>Algérie française</b> au début du XXe siècle : Camus grandit parmi les « pieds-noirs » pauvres. Son père meurt dès le début de la <b>Première Guerre mondiale</b>.</p><p><b>École</b> : l'école publique, laïque, gratuite et obligatoire de la IIIe République (lois Ferry) permet à quelques enfants pauvres, grâce aux <b>bourses</b>, d'accéder au lycée.</p><p><b>1957</b> : Camus reçoit le Nobel en pleine <b>guerre d'Algérie</b> (1954-1962). <b>1994</b> : publication posthume du <em>Premier Homme</em>.</p>",
      mouvementHtml: "<ul><li>Philosophie de l'<b>absurde</b> : le monde n'a pas de sens donné ; l'homme doit vivre lucidement malgré tout (<em>Le Mythe de Sisyphe</em>).</li><li>Puis de la <b>révolte</b> et de la solidarité : « Je me révolte, donc nous sommes » (<em>L'Homme révolté</em>).</li><li><b>Humanisme</b> lucide : dignité, justice, refus de la violence. Ici : écriture <b>autobiographique</b> et lettre d'hommage.</li></ul>",
      ideologie: "<p>Pour Camus, le bon maître <b>considère</b> l'enfant : il le juge « digne de découvrir le monde », éveille sa curiosité au lieu de le gaver et partage sa vie avec ses élèves. Il reste <b>ferme sur les valeurs</b> (honnêteté, loyauté, propreté).</p><p>L'école publique est pour lui un lieu d'<b>émancipation sociale</b> : elle a permis au « petit enfant pauvre » de devenir un écrivain reconnu.</p>",
      oeuvreHtml: "<p>La <b>lettre</b> (19 novembre 1957) est une correspondance privée écrite juste après l'annonce du Nobel.</p><p><em>Le Premier Homme</em> : roman autobiographique <b>inachevé</b>. Jacques Cormery, à quarante ans, part à la recherche de son père mort en 1914, qu'il n'a pas connu ; il revit son enfance pauvre à Alger, sa mère silencieuse, sa grand-mère autoritaire, l'école de M. Bernard, le lycée.</p><p>La <b>BD</b> <em>Paroles d'école</em> (Soleil, 2013) est un album collectif scénarisé par <b>Jean-Pierre Guéno</b> (et non « Jean-Philippe »), qui adapte des souvenirs d'élèves et de maîtres.</p>",
      place: "<p>L'extrait du <em>Premier Homme</em> appartient aux chapitres consacrés à l'école primaire, où Jacques découvre la classe de M. Bernard.</p>",
      extrait: {
        resume: "Lettre : Camus vient de recevoir un honneur qu'il n'a « ni recherché ni sollicité » ; sa première pensée, après sa mère, a été pour son instituteur, sans qui rien ne serait arrivé ; il lui dit sa reconnaissance d'éternel élève. Roman : dans la classe de M. Bernard, l'école nourrit la faim de la découverte ; ailleurs on gave les élèves comme des oies ; ici ils se sentent exister et considérés ; le maître partage sa vie avec eux mais condamne sans discussion le vol, la délation, l'indélicatesse et la malpropreté.",
        mouvements: [
          "Lettre · 1) L'honneur du Nobel et la « première pensée » pour le maître ; 2) sans vous, rien ; 3) une influence toujours vivante ; 4) « Je vous embrasse, de toutes mes forces. »",
          "Premier Homme · 1) La faim de la découverte, contre le gavage ; 2) être considéré, jugé digne ; 3) un maître proche mais intransigeant sur les valeurs."
        ],
        procedes: [
          ["Anaphore", "« Sans vous, sans cette main affectueuse […], sans votre enseignement »", "Dette totale : tout vient du maître."],
          ["Métonymie et opposition", "« main affectueuse » tendue « au petit enfant pauvre »", "Le geste du maître et la pauvreté de l'enfant (surlignés en cours)."],
          ["Permanence", "« toujours vivants » ; « n'a pas cessé d'être votre reconnaissant élève »", "La reconnaissance dure toute la vie."],
          ["Formule d'affection intense", "« Je vous embrasse, de toutes mes forces. »", "Émotion forte, familiarité rare envers un maître."],
          ["Métaphore filée de la nourriture", "« nourrissait en eux une faim plus essentielle » ; « comme on gave les oies »", "Deux pédagogies : éveiller un appétit / remplir de force."],
          ["Gradation", "« ils existaient » → « l'objet de la plus haute considération » → « dignes de découvrir le monde »", "L'école donne de la valeur aux enfants pauvres."],
          ["Pronoms « on » et « il »", "« on les jugeait dignes… » ; « il la vivait avec eux »", "Entourés en cours : le maître (« on », « il ») face aux élèves (« ils », « eux ») : une relation de considération."]
        ],
        ton: "Lyrique, reconnaissant, émouvant (éloge, hommage)."
      },
      problematique: "<p><b>Neutre ? Non.</b> M. Bernard transmet des valeurs claires : il condamne « le vol, la délation, l'indélicatesse, la malpropreté ». L'école forme moralement.</p><p><b>Émancipe ?</b> Oui : c'est le texte le plus émancipateur du corpus. L'école éveille la curiosité, donne de la dignité et permet l'ascension sociale (bourse, lycée, Nobel). Le maître est une figure paternelle pour un enfant sans père.</p>",
      citations: [
        ["« ma première pensée, après ma mère, a été pour vous »", "Entre crochets en cours : la place du maître dans la vie de Camus."],
        ["« main affectueuse » · « au petit enfant pauvre »", "Surlignés : le geste du maître et la pauvreté de l'enfant."],
        ["« Je vous embrasse, de toutes mes forces. »", "Surligné : la formule finale."],
        ["« la faim de la découverte »", "Le Premier Homme : l'école éveille un appétit de savoir."],
        ["« dignes de découvrir le monde »", "La considération portée aux élèves."]
      ],
      annotations: [
        ["Numéro", "« 5 » barré, « 4 » en rose", "Numéro du texte dans la suite du professeur (5 = numéro du manuel)."],
        ["Lettre, l. 4, crochets", "[ma première pensée, après ma mère, a été pour vous.]", "Le maître vient juste après la mère : une figure presque parentale."],
        ["Lettre, surlignés en bleu", "« main affectueuse », « tendue au petit enfant pauvre », « le cœur généreux », « Je vous embrasse, de toutes mes forces »", "Le vocabulaire de l'affection et de la reconnaissance."],
        ["Premier Homme, près de « M. Bernard »", "« analogie de la classe au temple » (dernier mot peu lisible)", "La classe de M. Bernard serait un lieu presque sacré (considération, respect), comme l'école-« sanctuaire » de Hugo."],
        ["Premier Homme, l. 6 et 9, entourés", "« on » · « il »", "Qui fait quoi : le maître juge les élèves dignes (« on ») et partage sa vie avec eux (« il »)."]
      ],
      pieges: [
        "<b>M. Bernard</b> = personnage du roman ; <b>Louis Germain</b> = l'instituteur réel de Camus.",
        "Lettre écrite en <b>1957</b> ; <em>Le Premier Homme</em> publié en <b>1994</b> (posthume). La feuille indique « Gallimard, 1964 » pour l'annexe : sans doute une coquille pour 1994.",
        "BD : <b>Jean-Pierre Guéno</b> (et non « Jean-Philippe »), <em>Paroles d'école</em>, Soleil, 2013.",
        "Nobel en <b>1957</b> (pas en 1960, année de sa mort).",
        "« après ma mère » : la mère d'abord, puis l'instituteur."
      ],
      radar: {
        autorite: 3,
        liberte: 4,
        morale: 4,
        savoir: 4,
        etat: 2,
        critique: 2,
        why: "Maître ferme sur les valeurs (autorité 3) ; curiosité et découverte (liberté 4) ; vol, délation condamnés (morale 4) ; faim de découverte (savoir 4) ; école publique et bourse (institution 2) ; critique du « gavage » des autres classes (2)."
      },
      carte: {
        x: 10,
        y: 7,
        why: "Le texte le plus émancipateur : l'école ouvre le monde à l'enfant pauvre ; elle transmet aussi des valeurs claires."
      },
      palais: {
        court: "Classe de M. Bernard",
        salle: "La classe de M. Bernard",
        objet: "Une main tendue",
        image: "Une grande main d'instituteur se tend vers un petit garçon pauvre sous le soleil d'Alger ; sur le bureau, une lettre datée du 19 novembre 1957 et une médaille du Nobel."
      }
    },

    /* ─── 10. Arendt ─── */
    {
      id: "are",
      short: "Arendt",
      auteur: "Hannah Arendt",
      auteurDates: "1906-1975",
      titre: "Préparer l'enfant au monde",
      oeuvre: "« La crise de l'éducation », La Crise de la culture",
      date: "1958 (essai) · 1961 (recueil anglais) · 1972 (Gallimard)",
      annee: 1958,
      genre: "Essai de philosophie politique",
      mouvement: "Philosophie politique du XXe siècle",
      nums: { prof: "7", imprime: "12 (manuel)", detail: "« 7 » écrit devant le 12 imprimé (le 1 est barré)." },
      icon: "wall",
      couleur: ["#df4b9d", "#f38abe"],
      motcle: "La ligne, pas le mur",
      symbole: "Une ligne qui ne doit pas devenir un mur",
      essentiel: [
        "<b>Hannah Arendt</b> (1906-1975), philosophe juive allemande exilée en 1933 (internée au camp de Gurs en 1940, réfugiée aux États-Unis en 1941), penseuse du <b>totalitarisme</b> et de la « <b>banalité du mal</b> ».",
        "« La crise de l'éducation » : conférence de <b>1958</b>, recueillie dans <em>Between Past and Future</em> (<b>1961</b>), traduite dans <em>La Crise de la culture</em> (Gallimard, <b>1972</b>). Elle critique l'éducation « progressiste » américaine.",
        "Paradoxe (« <b>cependant</b> ») : l'éducation ne peut se passer d'<b>autorité</b> ni de <b>tradition</b>, alors que le monde moderne n'est plus structuré par elles ; il faut donc les appliquer « <b>au seul domaine de l'éducation</b> ».",
        "Deux conséquences, exprimées par des verbes de <b>modalité</b> (devons, il faudrait, devrait, il ne faudrait jamais) : l'école doit apprendre aux enfants « <b>ce qu'est le monde</b> », pas « l'art de vivre » ; la <b>ligne</b> entre enfants et adultes ne doit jamais devenir un <b>mur</b>.",
        "Problématique : l'éducation n'est <b>pas neutre</b> : elle est « <b>conservatrice</b> » (elle transmet un monde plus vieux que l'enfant), mais pour protéger la <b>nouveauté</b> de chaque enfant, qui renouvellera le monde."
      ],
      auteurHtml: "<p><b>Hannah Arendt</b> naît en <b>1906</b> près de Hanovre (Allemagne), dans une famille juive, et meurt en <b>1975 à New York</b>.</p><ul><li>Étudie la philosophie avec <b>Heidegger</b> et <b>Jaspers</b> (thèse sur le concept d'amour chez saint Augustin, 1929).</li><li><b>1933</b> : brièvement arrêtée par la Gestapo, elle fuit l'Allemagne nazie pour Paris. <b>1940</b> : internée au camp de <b>Gurs</b>, dont elle parvient à sortir. <b>1941</b> : arrive à New York ; apatride jusqu'en 1951, puis citoyenne américaine.</li><li>Œuvres : <em>Les Origines du totalitarisme</em> (1951), <em>Condition de l'homme moderne</em> (1958), <em>La Crise de la culture</em> (1961, trad. fr. 1972), <em>Eichmann à Jérusalem</em> (1963).</li><li>Elle préférait se dire « théoricienne politique » plutôt que « philosophe ».</li></ul>",
      anecdotes: [
        ["« <b>Banalité du mal</b> » : formule d'Arendt après le procès d'Adolf Eichmann à Jérusalem (1961) : un grand criminel peut être un fonctionnaire ordinaire qui ne pense pas.", "https://en.wikipedia.org/wiki/Hannah_Arendt"],
        ["La conférence « Die Krise in der Erziehung » a été prononcée à <b>Brême le 13 mai 1958</b>, avant de paraître en anglais dans la revue <em>Partisan Review</em> (1958).", "https://katalog.ub.uni-heidelberg.de/cgi-bin/titel.cgi?katkey=36115246"],
        ["Arendt parle de <b>natalité</b> : chaque naissance apporte dans le monde la possibilité du nouveau. D'où son paradoxe : l'éducation doit être « conservatrice » pour protéger ce qui est neuf en chaque enfant.", "https://theconversation.com/lecole-selon-hannah-arendt-penser-la-crise-de-leducation-173854"],
        ["Pour elle, « émanciper » les enfants de l'autorité des adultes, c'est les livrer à une autorité pire : la « tyrannie de la majorité » du groupe des enfants.", "https://jochenteuffel.com/2024/09/09/hannah-arendt-die-krise-in-der-erziehung-1958-man-hat-also-die-kinder-als-man-sie-von-der-autoritat-der-erwachsenen-emanzipierte-nicht-befreit-sondern-einer-viel-schrecklicheren-und-wir/"],
        ["L'illustration de la feuille, <em>La Liseuse</em> (d'après Greuze, 1766), montre une jeune fille absorbée par un livre : l'enfant qui entre dans le monde par ce qu'on lui transmet.", "feuille (légende de l'illustration)"]
      ],
      epoque: "<p><b>Années 1950 aux États-Unis</b> : démocratisation massive de l'école et influence de l'éducation <b>progressiste</b> (inspirée de John Dewey) : l'enfant au centre, apprendre en faisant, autonomie du groupe des enfants. Arendt juge que cette pédagogie a abandonné l'autorité des adultes.</p><p>Plus largement, l'après-guerre (après <b>1939-1945</b> et les totalitarismes) est pour elle un temps de <b>crise de l'autorité et de la tradition</b> dans tout le monde moderne.</p>",
      mouvementHtml: "<ul><li><b>Philosophie politique du XXe siècle</b> : penser le totalitarisme, l'action, la liberté, l'autorité.</li><li>Méthode : partir d'une <b>crise</b> pour revenir aux questions fondamentales (qu'est-ce qu'éduquer ?).</li><li>Concepts clés : <b>monde commun</b>, <b>natalité</b>, <b>autorité</b> (qui n'est ni la force ni la persuasion), <b>tradition</b>.</li></ul>",
      ideologie: "<p>Éduquer, c'est <b>introduire les nouveaux venus dans un monde</b> qui existait avant eux et leur survivra. Les adultes en sont <b>responsables</b> : l'autorité du maître repose sur cette responsabilité envers le monde.</p><p>Arendt refuse deux erreurs : traiter l'enfant comme un adulte (l'abandonner à lui-même ou au groupe des enfants) et vouloir « éduquer » les adultes (ce serait de la politique autoritaire). L'éducation est « <b>conservatrice</b> » : elle protège l'enfant contre le monde et le monde contre l'enfant, pour que chaque génération puisse apporter du nouveau.</p>",
      oeuvreHtml: "<p><em>La Crise de la culture</em> (titre français de <em>Between Past and Future</em>) rassemble huit essais dans l'édition traduite en 1972 : la tradition, le concept d'histoire, l'autorité, la liberté, <b>la crise de l'éducation</b>, la crise de la culture, vérité et politique, la conquête de l'espace.</p>",
      place: "<p>L'extrait vient de la partie finale de l'essai, où Arendt tire les conséquences de son analyse : ce que doit être l'éducation dans le monde moderne.</p>",
      extrait: {
        resume: "Le problème moderne : l'éducation ne peut faire fi de l'autorité ni de la tradition, mais elle doit s'exercer dans un monde qui n'est plus structuré par elles. Il revient donc à chacun de nous, pas seulement aux professeurs, d'adopter envers les enfants une attitude différente de celle que les adultes ont entre eux ; autorité et rapport au passé valent au seul domaine de l'éducation. Conséquences : l'école doit apprendre aux enfants ce qu'est le monde, et non leur inculquer l'art de vivre ; la ligne entre enfants et adultes ne doit jamais devenir un mur qui ferait de l'enfance un monde autonome.",
        mouvements: [
          "l. 1-7 · Le paradoxe moderne (« cependant ») et la responsabilité de tous les adultes.",
          "l. 7-11 · Autorité et rapport au passé : valables au seul domaine de l'éducation.",
          "l. 12-17 · Conséquence 1 : apprendre ce qu'est le monde, un monde vieux (donc tourné vers le passé).",
          "l. 17-24 · Conséquence 2 : la ligne entre enfants et adultes ne doit pas devenir un mur."
        ],
        procedes: [
          ["Connecteur d'opposition", "« et qu'elle doit cependant s'exercer dans un monde… »", "« cependant » entouré : le paradoxe central du texte."],
          ["Construction « pas seulement… mais »", "« il n'appartient pas seulement aux professeurs […] mais à chacun de nous »", "Responsabilité collective des adultes (marques rouges en cours)."],
          ["Modalisation (devoir, falloir)", "« devons », « doivent », « il faudrait », « devrait », « il ne faudrait jamais »", "Soulignés : Arendt prescrit avec autorité (note de cours : « autorité de l'autrice »)."],
          ["Énumération ordonnée", "« premièrement », « Deuxièmement »", "Raisonnement clair et rigoureux."],
          ["Antithèses", "« le monde » / « l'art de vivre » ; passé / présent ; enfants / adultes", "L'école transmet un savoir sur le monde, pas une manière de vivre."],
          ["Métaphore spatiale", "« laisser cette ligne devenir un mur »", "Une frontière nécessaire, qui ne doit pas isoler l'enfance."],
          ["Répétition", "« le monde est vieux, toujours plus vieux qu'eux »", "L'antériorité du monde justifie la tradition."]
        ],
        ton: "Argumentatif, philosophique et prescriptif."
      },
      problematique: "<p><b>Neutre ? Non.</b> Éduquer suppose une <b>autorité</b> et un rapport au <b>passé</b> : l'école choisit ce qu'elle transmet du monde. Mais Arendt limite ce rôle : l'école ne doit pas inculquer « l'art de vivre » (une morale ou une politique) ; elle fait connaître le monde.</p><p><b>Émancipe ?</b> Oui, à long terme : en transmettant le monde, elle prépare les enfants à le <b>renouveler</b>. L'autonomie ne se décrète pas : un enfant laissé à lui-même n'est pas libéré, il est abandonné.</p>",
      citations: [
        ["« elle doit cependant s'exercer dans un monde qui n'est pas structuré par l'autorité »", "Le paradoxe."],
        ["« au seul domaine de l'éducation »", "Autorité et tradition n'ont de sens qu'en éducation."],
        ["« apprendre aux enfants ce qu'est le monde »", "Le rôle de l'école."],
        ["« non pas leur inculquer l'art de vivre »", "Ce que l'école ne doit pas faire."],
        ["« il ne faudrait jamais laisser cette ligne devenir un mur »", "La frontière enfants / adultes."]
      ],
      annotations: [
        ["Numéro", "7 devant « 12 » (le 1 barré)", "Numéro du texte dans la suite du professeur (12 = numéro du manuel)."],
        ["Sous la note 1", "[mot raturé] = autorité de l'autrice (lecture incertaine)", "Lecture probable : les verbes de modalité montrent l'autorité avec laquelle Arendt prescrit. (Note 1 : « faire fi » = ne pas tenir compte, rejeter.)"],
        ["l. 2, entouré", "« cependant »", "Le connecteur du paradoxe : l'éducation a besoin d'autorité, le monde n'en a plus."],
        ["l. 4-5, marques rouges", "pas seulement / … mais à chacun de nous", "Responsabilité de tous les adultes, pas seulement des professeurs."],
        ["l. 8-19, soulignés", "devons · doivent · il faudrait · devrait · il ne faudrait jamais", "Modalisation : le texte dit ce qu'il faut faire (texte prescriptif)."],
        ["l. 14-17, parenthèses", "(Étant donné que le monde est vieux … consacrée au présent.)", "La justification de la tradition : on apprend ce qui existe déjà."]
      ],
      pieges: [
        "Dates : essai de <b>1958</b> ; recueil anglais <b>1961</b> ; traduction française Gallimard <b>1972</b>. La feuille indique « Gallimard, 1961 » : elle mélange le recueil anglais et l'édition française.",
        "Arendt ne défend pas l'autorité en politique : autorité et tradition valent <b>au seul domaine de l'éducation</b>.",
        "« Conservatrice » ne veut pas dire réactionnaire : il s'agit de <b>conserver le monde</b> pour protéger la nouveauté des enfants.",
        "L'école doit enseigner <b>le monde</b>, pas « l'art de vivre ». La <b>ligne</b> (nécessaire) ≠ le <b>mur</b> (à éviter).",
        "Arendt critique l'éducation <b>progressiste</b> (centrée sur l'enfant autonome), pas l'école en général."
      ],
      radar: {
        autorite: 5,
        liberte: 2,
        morale: 2,
        savoir: 5,
        etat: 2,
        critique: 4,
        why: "Autorité indispensable en éducation (5) ; l'enfant n'est pas un adulte autonome (liberté 2) ; pas d'« art de vivre » inculqué (morale 2) ; connaître le monde (savoir 5) ; responsabilité de tous les adultes plus que de l'État (2) ; critique de l'éducation moderne (4)."
      },
      carte: {
        x: 7,
        y: 5,
        why: "Pas neutre (autorité, tradition), mais refuse d'inculquer une morale ou une politique ; émancipatrice à long terme, car elle prépare à renouveler le monde."
      },
      palais: {
        court: "Salle des adultes",
        salle: "La salle des adultes",
        objet: "Une ligne à la craie",
        image: "Une ligne tracée à la craie sépare la salle des enfants et celle des adultes ; un maçon commence à y empiler des briques et quelqu'un l'arrête : « la ligne, pas le mur ! ». Dans un coin, une jeune liseuse."
      }
    }
  ],

  /* =====================================================================
     QUESTIONS : [texte, niveau, question, [BONNE réponse, fausse, fausse, fausse], explication, section]
     La bonne réponse est TOUJOURS la première (l'ordre est mélangé à l'affichage).
     Niveaux : F = fait, C = compréhension, A = analyse, T = transversal (texte "all" = tout le chapitre).
     Section = partie de la fiche vers laquelle renvoie la correction.
     ===================================================================== */
  questions: [
    /* --- Rabelais, ch. 11 --- */
    ["rab11", "F", "Qui est l'auteur de Gargantua ?", ["François Rabelais", "Michel de Montaigne", "Pierre de Ronsard", "Jean-Jacques Rousseau"], "Rabelais, humaniste du XVIe siècle, qui signe Alcofribas Nasier.", "auteur"],
    ["rab11", "F", "Quel pseudonyme Rabelais utilise-t-il pour Pantagruel et Gargantua ?", ["Alcofribas Nasier", "Séraphin Calobarsy", "Thubal Holoferne", "Maître Ponocrates"], "Anagramme de « François Rabelais ». Séraphin Calobarsy est le médecin du ch. 23 (autre anagramme).", "auteur"],
    ["rab11", "F", "À quel mouvement appartient Rabelais ?", ["L'humanisme (Renaissance)", "Les Lumières", "Le romantisme", "Le réalisme"], "XVIe siècle : retour aux textes antiques, confiance dans l'éducation.", "mouvement"],
    ["rab11", "F", "Que signifie « adolescence » dans le titre du chapitre 11 ?", ["La petite enfance (de 3 à 5 ans)", "L'âge de 12 à 18 ans", "L'âge adulte", "La vieillesse"], "Note 1 : « Adolescence : ici, petite enfance ».", "pieges"],
    ["rab11", "C", "À quoi Gargantua passe-t-il son temps de 3 à 5 ans ?", ["À boire, manger et dormir", "À lire, écrire et compter", "À prier, chanter et jouer", "À chasser et monter à cheval"], "Formule répétée trois fois en changeant l'ordre des verbes.", "essentiel"],
    ["rab11", "C", "Comment Gargantua est-il élevé selon le texte ?", ["Comme tous les petits enfants du pays", "Par un précepteur humaniste", "Par des moines savants", "À la cour du roi"], "Expression soulignée sur la feuille : une éducation ordinaire, sans méthode.", "citations"],
    ["rab11", "A", "Quel temps domine le texte et quelle valeur a-t-il ?", ["L'imparfait d'habitude : des actions répétées", "Le passé simple : des actions uniques", "Le présent de vérité générale", "Le futur : des projets"], "« se vautrait », « buvait »… : des habitudes quotidiennes, sans progrès.", "extrait"],
    ["rab11", "A", "« mettait la charrue avant les bœufs » : quel procédé ?", ["Un proverbe pris au pied de la lettre (sens propre / sens figuré)", "Une métaphore filée de la lumière", "Une anaphore", "Un euphémisme"], "L'enfant réalise littéralement l'expression ; au figuré : faire les choses dans le mauvais ordre.", "extrait"],
    ["rab11", "A", "Que signifie au figuré « battait froid » (note 6) ?", ["Agir à contretemps", "Être très en colère", "Avoir froid aux mains", "Frapper un animal"], "« Il faut battre le fer quand il est chaud » : battre froid, c'est agir au mauvais moment.", "extrait"],
    ["rab11", "A", "Que signifie au figuré « revenait à ses moutons » ?", ["Revenir à son sujet", "Devenir berger", "Se perdre dans ses pensées", "Retourner chez ses parents"], "Expression soulignée sur la feuille.", "citations"],
    ["rab11", "A", "Quel est l'effet de la fin du texte (les petits chiens de son père) ?", ["Animaliser l'enfant : sans éducation, il vit comme une bête", "Montrer l'amour de Gargantua pour la nature", "Annoncer la guerre picrocholine", "Présenter son futur précepteur"], "Noté en marge en cours : animalisation de l'enfant.", "annotations"],
    ["rab11", "A", "Quel registre domine dans « Il pissait sur ses chaussures, chiait dans sa chemise » ?", ["Le registre bas, scatologique", "Le registre tragique", "Le registre épique", "Le registre lyrique"], "Comique carnavalesque : l'enfant réduit à son corps.", "extrait"],
    ["rab11", "C", "Quel ton la feuille attribue-t-elle au texte ?", ["Ironique et satirique", "Tragique et pathétique", "Lyrique et élégiaque", "Neutre et objectif"], "Note au-dessus du texte : « Ironique / satirique ».", "annotations"],
    ["rab11", "F", "Qui est le père de Gargantua ?", ["Grandgousier", "Pantagruel", "Ponocrates", "Picrochole"], "Pantagruel est le FILS de Gargantua ; Picrochole, le roi ennemi.", "oeuvre"],
    ["rab11", "F", "Le texte 1 de la feuille est…", ["Une adaptation en français moderne (Guy Demerson, 1973)", "Le texte original de Rabelais sans modification", "Une traduction du latin", "Un résumé écrit par le professeur"], "L'encadré « Version originale » donne le texte de Rabelais en moyen français.", "pieges"],
    ["rab11", "C", "Que montre la triple répétition « boire, manger et dormir » dans un ordre différent ?", ["Une vie qui tourne en rond, réduite aux besoins du corps", "Les progrès de l'enfant", "L'emploi du temps humaniste", "La richesse de Grandgousier"], "Cercle vicieux : aucun progrès.", "extrait"],
    /* --- Rabelais, ch. 23 --- */
    ["rab23", "F", "Comment s'appelle le précepteur humaniste de Gargantua ?", ["Ponocrates", "Thubal Holoferne", "Anagnostes", "Grandgousier"], "Ponocrates (« bourreau de travail ») remplace le sophiste Thubal Holoferne.", "essentiel"],
    ["rab23", "F", "Qui est Thubal Holoferne ?", ["Le précepteur « sophiste » qui a rendu Gargantua niais", "Le page qui lit la Bible", "Le médecin qui purge Gargantua", "Un auteur antique cité à table"], "Il l'a rendu « tant fat, niais et ignorant » (chapeau).", "pieges"],
    ["rab23", "F", "Qui est Anagnostes ?", ["Le jeune page qui lit l'Écriture sainte à Gargantua", "Le précepteur sophiste", "Le roi ennemi", "L'évêque de Londres"], "Anagnostes signifie « le lecteur » en grec.", "extrait"],
    ["rab23", "F", "À quelle heure se lève Gargantua ?", ["Vers 4 heures du matin", "À 8 heures", "À midi", "Au coucher du soleil"], "« S'éveillait donc Gargantua environ quatre heures du matin. »", "citations"],
    ["rab23", "F", "Séraphin Calobarsy est…", ["Un médecin, anagramme du nom de l'auteur", "Le père de Gargantua", "Un sophiste de la Sorbonne", "Un joueur de paume"], "Il purge Gargantua de sa « vicieuse manière de vivre ».", "essentiel"],
    ["rab23", "C", "Que fait-on pendant le repas ?", ["On lit et on discute savamment de la nature des aliments", "On mange en silence", "On joue aux cartes pour de l'argent", "On chante des chansons à boire"], "On cite Pline, Galien, Aristote… et on apporte les livres à table.", "extrait"],
    ["rab23", "C", "À quoi servent les cartes dans cet emploi du temps ?", ["À apprendre l'arithmétique", "À jouer de l'argent", "À prédire l'avenir", "À se reposer"], "« non pour jouer, mais pour y apprendre mille petites gentillesses » d'arithmétique.", "extrait"],
    ["rab23", "A", "Quel est le rôle de « Puis », « Ce fait », « Au commencement », « Après » ?", ["Des connecteurs temporels qui rythment un emploi du temps méthodique", "Des connecteurs d'opposition", "Des marques de dialogue", "Des indices de lieu"], "Surlignés en vert sur la feuille.", "annotations"],
    ["rab23", "A", "Pourquoi l'imparfait est-il employé (« usage de l'imparfait ») ?", ["Il exprime une routine répétée chaque jour", "Il raconte un événement unique", "Il exprime un souhait", "Il marque une hypothèse"], "Imparfait d'habitude (itératif).", "annotations"],
    ["rab23", "A", "« du pain, du vin, de l'eau, du sel, des viandes, poissons, fruits… » : quel procédé ?", ["Une énumération", "Une antithèse", "Une litote", "Une prosopopée"], "Noté en cours : « énumération ». Elle montre l'étendue du savoir.", "annotations"],
    ["rab23", "C", "Quel idéal éducatif le texte illustre-t-il ?", ["L'idéal humaniste : savoir encyclopédique, corps et esprit, foi", "L'éducation par le seul jeu", "L'éducation militaire", "L'apprentissage par cœur de la scolastique"], "Ponocrates forme un homme complet.", "ideologie"],
    ["rab23", "A", "« s'exerçant les corps comme ils avaient les âmes auparavant exercé » montre…", ["L'équilibre entre éducation physique et intellectuelle", "Le mépris du corps", "La fatigue de l'élève", "La punition corporelle"], "Idéal humaniste d'une éducation complète.", "extrait"],
    ["rab23", "A", "« n'était médecin qui en sût à la moitié tant comme il faisait » est…", ["Une hyperbole", "Un euphémisme", "Une question rhétorique", "Une anaphore"], "Exagération : l'élève dépasse les spécialistes.", "extrait"],
    ["rab23", "C", "Le « dîner » dans le texte est…", ["Le repas principal de midi", "Le repas du soir", "Le petit-déjeuner", "Un goûter"], "Note 10 : repas principal de la journée.", "pieges"],
    ["rab23", "T", "Quel est le lien entre les chapitres 11 et 23 ?", ["On passe d'une enfance sans méthode (animale) à une éducation méthodique (humaniste)", "Les deux décrivent l'éducation des sophistes", "Les deux se passent à l'abbaye de Thélème", "Le ch. 23 raconte la naissance de Gargantua"], "Rabelais oppose la nature seule à la méthode humaniste.", "problematique"],
    ["rab23", "F", "Où se trouve la célèbre phrase « Science sans conscience n'est que ruine de l'âme » ?", ["Dans Pantagruel, ch. 8 (lettre de Gargantua à son fils)", "Dans Gargantua, ch. 23", "Dans Gargantua, ch. 11", "Dans l'abbaye de Thélème"], "Piège classique : elle n'est pas dans Gargantua.", "pieges"],
    /* --- Rousseau --- */
    ["rou", "F", "De quelle œuvre ce texte est-il extrait ?", ["Discours sur l'origine et les fondements de l'inégalité parmi les hommes", "Émile ou De l'éducation", "Du contrat social", "Les Confessions"], "Première partie du « second Discours ».", "oeuvre"],
    ["rou", "F", "De quand date le Discours sur l'inégalité ?", ["1755", "1762", "1789", "1534"], "1762 = Émile et Du contrat social.", "essentiel"],
    ["rou", "F", "Rousseau appartient au siècle…", ["des Lumières (XVIIIe siècle)", "de la Renaissance (XVIe siècle)", "du romantisme (XIXe siècle)", "de l'humanisme (XVIe siècle)"], "Mais il critique l'idée de progrès.", "mouvement"],
    ["rou", "C", "Selon le chapeau du manuel, quel mot Rousseau invente-t-il ?", ["Perfectibilité", "Humanisme", "Laïcité", "Civilisation"], "La faculté que l'homme seul possède d'acquérir ce que la nature ne lui donne pas.", "essentiel"],
    ["rou", "C", "Qu'est-ce que la perfectibilité ?", ["La faculté de se perfectionner, propre à l'homme", "La perfection morale de l'homme naturel", "L'instinct des animaux", "Le progrès des machines"], "« c'est la faculté de se perfectionner » (entre crochets sur la feuille).", "citations"],
    ["rou", "C", "Quel est le premier critère qui distingue l'homme de l'animal au début du texte ?", ["La liberté : l'homme peut acquiescer ou résister", "La force physique", "La parole", "Le rire"], "« la Bête obéit » ; l'homme « se reconnaît libre ».", "extrait"],
    ["rou", "C", "Que dit Rousseau de l'animal ?", ["Il est au bout de quelques mois ce qu'il sera toute sa vie", "Il progresse de génération en génération", "Il peut devenir imbécile", "Il est plus libre que l'homme"], "Et son espèce est la même après mille ans.", "extrait"],
    ["rou", "C", "Pourquoi l'homme seul peut-il devenir « imbécile » ?", ["Il peut perdre ce que sa perfectibilité lui a fait acquérir et tomber plus bas que la bête", "Il n'a aucun instinct", "Il ne va pas à l'école", "Il mange mal"], "La bête n'a rien acquis, donc rien à perdre.", "extrait"],
    ["rou", "A", "Quelle est la tonalité de la fin du texte ?", ["Pessimiste : la perfectibilité est source de tous ses malheurs", "Optimiste : le progrès rend heureux", "Comique", "Neutre"], "L'homme devient « le tyran de lui-même et de la nature ».", "extrait"],
    ["rou", "A", "« ses lumières et ses erreurs, ses vices et ses vertus » : quel procédé ?", ["Des antithèses", "Une anaphore", "Une métaphore filée", "Une allitération"], "La perfectibilité produit le meilleur et le pire.", "extrait"],
    ["rou", "A", "« Pourquoi l'homme seul est-il sujet à devenir imbécile ? » est…", ["Une question rhétorique", "Un dialogue", "Une exclamation", "Un ordre à l'impératif"], "Rousseau y répond lui-même : il implique le lecteur.", "extrait"],
    ["rou", "F", "Que veut dire « imbécile » (note 1) ?", ["Un être privé de ses facultés intellectuelles", "Une insulte", "Un enfant", "Un animal domestique"], "Sens ancien, pas une insulte.", "pieges"],
    ["rou", "F", "Qui se moque du Discours en disant qu'on a envie de « marcher à quatre pattes » ?", ["Voltaire", "Diderot", "Montesquieu", "Victor Hugo"], "Lettre du 30 août 1755.", "auteur"],
    ["rou", "F", "Quelle expression Rousseau n'a-t-il jamais employée ?", ["Le « bon sauvage »", "La « perfectibilité »", "L'« état de nature »", "La « pitié »"], "Elle a servi à caricaturer sa pensée.", "pieges"],
    ["rou", "F", "Le Discours sur l'inégalité a-t-il gagné le prix de l'Académie de Dijon ?", ["Non : c'est le premier Discours (1750) qui l'avait gagné", "Oui, en 1755", "Oui, en 1762", "Il n'y a jamais eu de concours"], "Le lauréat de ce concours fut l'abbé Talbert.", "pieges"],
    ["rou", "T", "Quel texte du corpus rejoint Rousseau sur l'idée qu'un homme sans éducation reste proche de l'animal ?", ["Hugo (« hommes animaux, têtes inachevées »)", "Ferry", "Péguy", "Arendt"], "Rabelais (ch. 11) aussi montre un enfant-animal.", "problematique"],
    /* --- Balzac --- */
    ["bal", "F", "Quel est le titre du roman de Balzac étudié ?", ["Louis Lambert", "Le Père Goriot", "Eugénie Grandet", "Illusions perdues"], "Roman d'inspiration autobiographique (1832).", "oeuvre"],
    ["bal", "F", "De quand date Louis Lambert ?", ["1832", "1857", "1881", "1755"], "Première version en 1832, remaniée en 1833 et 1835.", "essentiel"],
    ["bal", "F", "Où se passe l'extrait ?", ["Au collège de Vendôme", "Au lycée de Rouen", "À l'école annexe d'Orléans", "À Alger"], "Le pensum « consistait à Vendôme » en lignes à copier.", "extrait"],
    ["bal", "F", "Dans quelle partie de La Comédie humaine Balzac range-t-il Louis Lambert ?", ["Les Études philosophiques", "Les Scènes de la vie parisienne", "Les Scènes de la vie de province", "Les Scènes de la vie militaire"], "Roman philosophique et mystique.", "oeuvre"],
    ["bal", "C", "Qui est le narrateur ?", ["Un camarade de Louis Lambert, double de Balzac", "Louis Lambert lui-même", "Le Régent", "Madame de Staël"], "« Nous fûmes, Lambert et moi… »", "pieges"],
    ["bal", "C", "Que crie le Régent à Lambert ?", ["« Vous ne faites rien, Lambert ! »", "« Levez-vous ! »", "« Ridiculus sum ! »", "« Répétez ! »"], "Phrase reprise en italique : une humiliation.", "citations"],
    ["bal", "C", "Qu'est-ce qu'un pensum à Vendôme ?", ["Des lignes à copier pendant les récréations", "Un séjour au cachot", "Une amende", "Un devoir de mathématiques"], "Punition qui supprime les récréations.", "extrait"],
    ["bal", "A", "« le régime pénitentiaire » des collèges est…", ["Une métaphore : le collège comparé à une prison", "Un terme médical", "Une litote", "Un compliment"], "Note 2 : pénitentiaire = qui concerne les prisonniers.", "extrait"],
    ["bal", "A", "« un coup d'épingle qui blessait Louis au cœur » exprime…", ["La souffrance morale causée par l'humiliation", "Une punition physique réelle", "Une maladie de cœur", "La joie de Lambert"], "Métaphore de la blessure morale.", "extrait"],
    ["bal", "A", "« nous n'avons pas eu six jours de liberté durant nos deux années d'amitié » est…", ["Une hyperbole", "Une litote", "Un euphémisme", "Une antiphrase"], "Exagération qui dénonce l'excès des punitions.", "extrait"],
    ["bal", "C", "Qu'est-ce qui sauve les deux amis de l'« abrutissement complet » ?", ["Les livres de la bibliothèque", "Les récréations", "Les pensums", "Les conseils du Régent"], "La lecture libre émancipe, pas la discipline.", "problematique"],
    ["bal", "C", "À qui s'adresse la critique générale de Balzac ?", ["Aux autorités de l'enseignement public", "Au pape", "Aux parents", "Aux élèves"], "« exigera-t-il l'attention des autorités de l'enseignement public ».", "extrait"],
    ["bal", "F", "Quel écrit de Lambert est confisqué dans le roman ?", ["Le Traité de la volonté", "Le Traité de l'éducation", "Les Pensées", "Le Discours de la méthode"], "Confisqué par le Père Haugoult ; Balzac en avait écrit un lui-même.", "oeuvre"],
    ["bal", "A", "Quelle opposition ouvre l'extrait ?", ["La nature libre (air pur, arbres, nuages) / l'enfermement du collège", "La ville / la campagne riche", "Les riches / les pauvres", "Le passé / le futur"], "Lambert regarde le feuillage et les nuages au lieu de travailler.", "extrait"],
    ["bal", "F", "Balzac a été pensionnaire à Vendôme…", ["de 1807 à 1813", "de 1879 à 1884", "de 1918 à 1923", "de 1830 à 1832"], "Il en est sorti malade.", "auteur"],
    /* --- Flaubert --- */
    ["flo", "F", "De quelle œuvre ce texte est-il l'incipit ?", ["Madame Bovary", "L'Éducation sentimentale", "Salammbô", "Louis Lambert"], "Premier chapitre de Madame Bovary.", "oeuvre"],
    ["flo", "F", "De quand date Madame Bovary ?", ["1857", "1832", "1881", "1869"], "1869 = L'Éducation sentimentale.", "essentiel"],
    ["flo", "F", "À quel mouvement rattache-t-on Madame Bovary ?", ["Au réalisme", "Au romantisme", "À l'humanisme", "Au surréalisme"], "Même si Flaubert refusait l'étiquette.", "mouvement"],
    ["flo", "C", "Qui est « le nouveau » ?", ["Charles Bovary", "Emma Bovary", "Louis Lambert", "M. Roger"], "Le futur mari d'Emma.", "pieges"],
    ["flo", "C", "Qui raconte au début du roman ?", ["Un « nous » collectif : les camarades de classe", "Charles lui-même", "Emma", "Le professeur"], "« Nous étions à l'étude » ; ce « nous » disparaît ensuite.", "extrait"],
    ["flo", "C", "Qui est M. Roger ?", ["Le maître d'études", "Le proviseur", "Le curé du village", "Le père de Charles"], "Le Proviseur lui recommande le nouveau.", "pieges"],
    ["flo", "C", "Que devient le nom du nouveau quand il le crie ?", ["« Charbovari »", "« Ridiculus »", "« Quos ego »", "« Bovarinus »"], "Nom déformé, repris en chœur par la classe.", "citations"],
    ["flo", "F", "Que signifie « ridiculus sum » ?", ["« Je suis ridicule »", "« Tu es ridicule »", "« Silence ! »", "« Assieds-toi »"], "Charles doit copier ce verbe vingt fois.", "citations"],
    ["flo", "A", "Quel est le rôle de la longue description de la casquette ?", ["Symboliser Charles : maladroit, disparate, un peu ridicule", "Montrer la richesse de sa famille", "Décrire la mode de Paris", "Faire l'éloge de l'artisanat"], "Sa « laideur muette » évoque « le visage d'un imbécile ».", "extrait"],
    ["flo", "A", "« dit le professeur, qui était un homme d'esprit » est…", ["Ironique : son « esprit » consiste à se moquer de l'élève", "Un compliment sincère", "Une description neutre", "Une métaphore"], "Le professeur participe à la moquerie.", "extrait"],
    ["flo", "A", "« c'était là le genre » : que marque l'italique ?", ["Le jargon et la norme du groupe d'élèves", "Un mot latin", "Un titre de livre", "Une citation de Virgile"], "Le code que Charles ne respecte pas.", "extrait"],
    ["flo", "C", "Selon la note de cours, que favorise l'école dans cet extrait ?", ["La conformité (et la stigmatisation de celui qui est différent)", "L'émancipation de chacun", "La créativité", "L'égalité parfaite"], "Le professeur participe au « bannissement » symbolique.", "annotations"],
    ["flo", "F", "Comment se termine le procès de 1857 ?", ["Flaubert est acquitté", "Flaubert est condamné à la prison", "Le livre est interdit pour toujours", "Flaubert part en exil"], "Acquitté le 7 février 1857.", "auteur"],
    ["flo", "F", "« Madame Bovary, c'est moi » est…", ["Une phrase apocryphe, absente de ses écrits", "La première phrase du roman", "Une lettre de Flaubert à Louise Colet", "Une réplique d'Emma"], "Rapportée en 1909 par René Descharmes.", "pieges"],
    ["flo", "A", "À quoi renvoie « Quos ego » ?", ["À Virgile (Énéide) : la menace de Neptune aux vents", "À Rabelais", "À une prière", "À un proverbe latin sur la paresse"], "Comparaison héroï-comique du professeur furieux au dieu de la mer.", "auteur"],
    ["flo", "C", "Pourquoi Charles est-il arrivé tard au collège ?", ["Ses parents, par économie, l'y ont envoyé le plus tard possible", "Il était malade", "Il avait été renvoyé d'un autre collège", "Il avait voyagé"], "Le curé de son village lui avait commencé le latin.", "extrait"],
    /* --- Hugo --- */
    ["hug", "F", "Dans quel recueil ce poème a-t-il été publié ?", ["Les Quatre Vents de l'esprit (1881)", "Les Contemplations (1856)", "Les Châtiments (1853)", "Les Misérables (1862)"], "« Le Livre satirique ». Les Misérables est un roman.", "oeuvre"],
    ["hug", "F", "Quel est le titre du poème dans le recueil ?", ["« Écrit après la visite d'un bagne »", "« Chaque enfant qu'on enseigne »", "« Demain, dès l'aube »", "« Melancholia »"], "« Chaque enfant qu'on enseigne » est le premier vers (titre de la feuille).", "pieges"],
    ["hug", "F", "En 1881, Hugo est…", ["Sénateur de la Seine", "Député", "Ministre de l'Instruction publique", "En exil à Guernesey"], "Sénateur de 1876 à sa mort. La note de cours « député » vaut pour 1848-1851 et 1871.", "pieges"],
    ["hug", "F", "À quel mouvement Hugo appartient-il ?", ["Au romantisme", "Au réalisme", "À l'humanisme", "Aux Lumières"], "Il en est le chef de file.", "mouvement"],
    ["hug", "C", "Quelle est la thèse du poème ?", ["Instruire un enfant, c'est gagner un homme à la société", "L'école est inutile aux pauvres", "Les voleurs sont incorrigibles", "La religion suffit à l'éducation"], "Vers 1, surligné : « thèse principale ».", "annotations"],
    ["hug", "C", "Quel argument chiffré Hugo avance-t-il ?", ["90 voleurs sur 100 au bagne ne sont jamais allés à l'école", "La moitié des enfants ne savent pas lire", "Un enfant sur dix va au bagne", "Cent écoles ont été fermées"], "Noté en cours : « un homme pas instruit = pas raisonnable ».", "extrait"],
    ["hug", "A", "« L'ignorance est la nuit qui commence l'abîme » : quel procédé ?", ["Une métaphore", "Une comparaison", "Une litote", "Un oxymore"], "Ignorance = nuit, sans outil de comparaison.", "extrait"],
    ["hug", "A", "Quelle métaphore est filée dans tout le poème ?", ["La lumière (le savoir) contre la nuit (l'ignorance)", "La guerre contre la paix", "La mer et la tempête", "Les saisons"], "Ombre, nuit, abîme / lampe, lueur, lumière.", "extrait"],
    ["hug", "A", "« L'école est sanctuaire autant que la chapelle » exprime…", ["La sacralisation de l'école", "La critique de l'Église", "Le refus de la religion", "L'ennui de l'école"], "Noté en marge en cours : « sacralisation de l'école ».", "annotations"],
    ["hug", "A", "« Marchez », « Allumons », « Songeons-y » sont…", ["Des impératifs : visée argumentative, appel à agir", "Des indicatifs présents", "Des subjonctifs", "Des infinitifs"], "Relevés en marge sur la feuille.", "annotations"],
    ["hug", "A", "« et qui ne pense pas / Ne vit pas » : quel procédé ?", ["Un rejet (enjambement) qui met en relief « Ne vit pas »", "Une rime riche", "Une anaphore", "Une question rhétorique"], "Entouré sur la feuille.", "extrait"],
    ["hug", "A", "« Des hommes animaux, têtes inachevées » : quel procédé et quel sens ?", ["Animalisation : sans instruction, l'homme reste inachevé", "Personnification de l'école", "Éloge des animaux", "Comparaison avec des enfants"], "Opposition enfant instruit / hommes animaux.", "extrait"],
    ["hug", "C", "Que signifient les derniers vers (or, cuivre, plomb) ?", ["L'école élève les hommes, l'ignorance les dégrade", "L'école coûte trop cher", "Il faut payer les instituteurs en or", "Les bagnards travaillent dans les mines"], "Image alchimique : antithèse finale.", "citations"],
    ["hug", "F", "« Ouvrir une école, c'est fermer une prison »…", ["N'est pas une phrase de Hugo (attribution fausse)", "Est le premier vers du poème", "Est tirée des Misérables", "Est de Jules Ferry dans sa lettre"], "Absente de ses œuvres ; le Grand Larousse l'attribuait à Louis Jourdan.", "pieges"],
    ["hug", "F", "Où et quand le poème est-il daté ?", ["Jersey, 1853 (exil)", "Paris, 1881", "Guernesey, 1870", "Besançon, 1802"], "Publié seulement en 1881.", "pieges"],
    ["hug", "F", "Quel est le mètre du poème ?", ["L'alexandrin (12 syllabes)", "L'octosyllabe", "Le décasyllabe", "Le vers libre"], "Alexandrins à rimes plates (suivies).", "extrait"],
    /* --- Ferry --- */
    ["fer", "F", "De quand date la « Lettre aux instituteurs » ?", ["17 novembre 1883", "28 mars 1882", "16 juin 1881", "9 décembre 1905"], "28 mars 1882 : la loi qu'elle explique.", "essentiel"],
    ["fer", "F", "Que décide la loi du 28 mars 1882 ?", ["L'instruction primaire obligatoire (6-13 ans) et la laïcité des programmes", "La gratuité de l'école primaire", "La séparation des Églises et de l'État", "La création des écoles normales"], "Gratuité : 16 juin 1881 ; écoles normales : loi Paul Bert (1879).", "epoque"],
    ["fer", "F", "Quelle loi rend l'école primaire publique gratuite ?", ["La loi du 16 juin 1881", "La loi du 28 mars 1882", "La loi Goblet (1886)", "La loi de 1905"], "Première des grandes lois Ferry.", "epoque"],
    ["fer", "F", "Quelles fonctions Ferry occupe-t-il quand il signe la lettre ?", ["Président du Conseil et ministre de l'Instruction publique", "Président de la République", "Sénateur de la Seine", "Instituteur"], "Du 21 février au 20 novembre 1883.", "pieges"],
    ["fer", "C", "Selon Ferry, à qui appartient l'instruction religieuse ?", ["Aux familles et à l'Église", "À l'école", "À l'État", "Aux instituteurs"], "« l'instruction morale à l'école ».", "citations"],
    ["fer", "C", "Et à qui appartient l'instruction morale ?", ["À l'école", "Aux familles seulement", "À l'Église", "À l'armée"], "La morale est au « premier rang » du programme.", "citations"],
    ["fer", "C", "Comment Ferry qualifie-t-il les croyances ?", ["Personnelles, libres et variables", "Communes et indispensables", "Fausses et dangereuses", "Universelles"], "Elles relèvent du privé.", "citations"],
    ["fer", "C", "Comment qualifie-t-il les connaissances ?", ["Communes et indispensables à tous", "Personnelles et variables", "Réservées aux élites", "Religieuses"], "Elles relèvent de l'école.", "citations"],
    ["fer", "A", "« Le législateur n'a donc pas entendu faire une œuvre purement négative » : Ferry répond…", ["À ceux qui voient dans la laïcité un simple vide (une école sans morale)", "Aux instituteurs paresseux", "Aux élèves", "À l'Allemagne"], "La laïcité fonde une morale commune.", "extrait"],
    ["fer", "A", "Pourquoi comparer la morale au « langage » et au « calcul » ?", ["Pour la présenter comme universelle et évidente", "Pour réduire les heures de morale", "Pour critiquer les mathématiques", "Pour parler de grammaire latine"], "Des règles « universellement acceptées ».", "extrait"],
    ["fer", "A", "Quel est l'effet de l'adresse « c'est sur vous, Monsieur » ?", ["Impliquer personnellement l'instituteur", "Menacer l'instituteur", "S'adresser au président", "Parler d'un élève"], "Chaque instituteur est investi d'une mission.", "extrait"],
    ["fer", "T", "L'école de Ferry est-elle neutre ?", ["Neutre religieusement, mais porteuse d'une morale et de valeurs républicaines", "Totalement neutre sur tous les plans", "Religieuse et catholique", "Sans aucune morale"], "Réponse nuancée attendue.", "problematique"],
    ["fer", "F", "Dans l'encadré, qui affirme qu'il n'y a pas de justice sans lumières ?", ["Diderot", "Helvétius", "Rousseau", "Voltaire"], "Helvétius, lui, voulait une éducation d'abord morale.", "mouvement"],
    ["fer", "F", "Quelle loi confie l'enseignement public à un personnel exclusivement laïque ?", ["La loi Goblet (1886)", "La loi Paul Bert (1879)", "La loi Guizot (1833)", "La loi Falloux (1850)"], "Elle complète les lois Ferry.", "pieges"],
    ["fer", "F", "Quel test Ferry propose-t-il dans cette lettre pour savoir si l'on peut enseigner une maxime ?", ["Se demander si un seul père de famille honnête pourrait la refuser", "Demander l'avis du curé", "Consulter le ministre", "Faire voter les élèves"], "Si oui, l'instituteur doit s'abstenir.", "auteur"],
    /* --- Péguy --- */
    ["peg", "F", "De quelle œuvre ce texte est-il extrait ?", ["L'Argent (1913)", "Notre jeunesse (1910)", "Les Misérables", "Le Premier Homme"], "Publié dans les Cahiers de la Quinzaine.", "oeuvre"],
    ["peg", "F", "Qui sont les « hussards noirs » ?", ["Les jeunes instituteurs sortis de l'École normale", "Des soldats de Napoléon", "Des prêtres", "Des élèves punis"], "Métaphore créée par Péguy.", "essentiel"],
    ["peg", "F", "De quand date le souvenir raconté ?", ["1880", "1913", "1914", "1870"], "Le texte est écrit en 1913.", "pieges"],
    ["peg", "F", "Comment Péguy est-il mort ?", ["Au front, le 5 septembre 1914, à la veille de la bataille de la Marne", "En exil en 1885", "Dans un accident de voiture en 1960", "Dans un camp en 1940"], "Lieutenant d'infanterie, tué près de Villeroy.", "auteur"],
    ["peg", "F", "Quel était le métier de la mère de Péguy ?", ["Rempailleuse de chaises", "Institutrice", "Couturière de la cour", "Fermière"], "Un milieu très modeste : Péguy est un boursier.", "auteur"],
    ["peg", "F", "Quelle revue Péguy a-t-il fondée ?", ["Les Cahiers de la Quinzaine", "Combat", "La Revue de Paris", "Partisan Review"], "Combat = Camus ; Revue de Paris = Madame Bovary ; Partisan Review = Arendt.", "auteur"],
    ["peg", "C", "Quelles sont les couleurs de l'uniforme ?", ["Noir, avec liseré et palmes violets", "Bleu, blanc, rouge", "Tout blanc", "Rouge et or"], "Noir de la sévérité, violet du sacré et du primaire.", "extrait"],
    ["peg", "C", "Que dit Péguy du violet ?", ["C'est la couleur des évêques et de l'enseignement primaire", "C'est la couleur de la royauté", "C'est la couleur du deuil", "C'est la couleur de l'armée"], "Le sacré passe de l'Église à l'école.", "citations"],
    ["peg", "A", "« beaux comme des hussards noirs » : quel procédé ?", ["Une comparaison", "Une métaphore", "Une litote", "Une anaphore"], "Présence de l'outil « comme ».", "extrait"],
    ["peg", "A", "« Par ces jeunes hussards de la République. Par ces nourrissons de la République. » : quel procédé ?", ["Anaphore et métaphores de la filiation (la République comme mère)", "Oxymore", "Euphémisme", "Question rhétorique"], "Réponse à la question 3 de la feuille.", "extrait"],
    ["peg", "A", "« Sveltes ; sévères ; sanglés. » : quel procédé ?", ["Phrase nominale au rythme ternaire, avec allitération en [s]", "Chiasme", "Antithèse", "Hyperbole"], "Rythme martial.", "extrait"],
    ["peg", "A", "Pourquoi Péguy s'attarde-t-il sur l'uniforme ?", ["Il en fait le symbole d'une mission civique, sévère et presque sacrée", "Pour critiquer le coût des vêtements", "Pour se moquer des maîtres", "Pour décrire la mode de 1913"], "Question 2 de la feuille.", "extrait"],
    ["peg", "C", "Quelle est la fonction de la description dans l'extrait ?", ["Faire l'éloge des instituteurs et construire un mythe républicain", "Informer objectivement sur les uniformes", "Critiquer l'école", "Raconter une punition"], "Question 3 : description argumentative (éloge).", "problematique"],
    ["peg", "C", "À quoi l'École normale est-elle comparée ?", ["À un régiment inépuisable et à un dépôt de jeunesse et de civisme", "À une prison", "À un temple païen", "À un marché"], "Métaphore militaire filée.", "citations"],
    ["peg", "C", "Pourquoi l'uniforme « civique » est-il « encore plus militaire » ?", ["Servir la République comme citoyen est encore plus exigeant", "Parce que les maîtres étaient soldats", "Parce qu'il était gris", "Parce qu'il coûtait cher"], "Paradoxe : le civisme dépasse l'armée en sévérité.", "extrait"],
    /* --- Camus --- */
    ["cam", "F", "À qui Camus écrit-il le 19 novembre 1957 ?", ["À son instituteur, Louis Germain", "À sa mère", "Au roi de Suède", "À M. Bernard"], "M. Bernard est le nom de l'instituteur dans le roman.", "essentiel"],
    ["cam", "F", "Pourquoi écrit-il cette lettre ?", ["Il vient de recevoir le prix Nobel de littérature", "Il vient de publier L'Étranger", "Il quitte l'Algérie", "Son instituteur vient de mourir"], "Nobel 1957.", "essentiel"],
    ["cam", "F", "Qui est M. Bernard ?", ["L'instituteur du roman, inspiré de Louis Germain", "Le père de Camus", "Un personnage de Flaubert", "Le proviseur du lycée d'Alger"], "Note 1 de la feuille.", "pieges"],
    ["cam", "F", "Quand Le Premier Homme a-t-il été publié ?", ["En 1994 (posthume)", "En 1957", "En 1960", "En 1942"], "Manuscrit retrouvé après l'accident de 1960.", "pieges"],
    ["cam", "F", "Qu'est-il arrivé au père de Camus ?", ["Il est mort en 1914, blessé à la bataille de la Marne", "Il était instituteur", "C'était un riche colon", "Il est mort en 1960"], "Camus a grandi sans père.", "auteur"],
    ["cam", "C", "« ma première pensée, après ma mère, a été pour vous » montre…", ["Que l'instituteur occupe une place presque parentale", "Que Camus a oublié sa mère", "Que Camus reproche quelque chose au maître", "Que le maître est son père"], "Entre crochets en cours.", "annotations"],
    ["cam", "A", "« main affectueuse » : quel procédé ?", ["Une métonymie (la main pour le geste d'aide du maître)", "Une hyperbole", "Un oxymore", "Une litote"], "Surligné sur la feuille.", "extrait"],
    ["cam", "A", "« Sans vous, sans cette main… sans votre enseignement » : quel procédé ?", ["Une anaphore", "Un chiasme", "Une antithèse", "Une prétérition"], "Répétition en tête de groupe : dette totale.", "extrait"],
    ["cam", "C", "Quelle « faim » l'école de M. Bernard nourrit-elle ?", ["La faim de la découverte", "La faim de richesse", "La faim de pouvoir", "La faim au sens propre"], "Métaphore de la nourriture.", "citations"],
    ["cam", "A", "Que critique la comparaison « comme on gave les oies » ?", ["Un enseignement qui remplit les élèves sans éveiller leur curiosité", "La cantine scolaire", "Les fermiers", "L'école de M. Bernard"], "Les « autres classes », par opposition à celle de M. Bernard.", "extrait"],
    ["cam", "C", "Que condamne M. Bernard sans discussion ?", ["Le vol, la délation, l'indélicatesse, la malpropreté", "Le jeu, la lecture, le rire", "Les bavardages et les retards", "La religion"], "L'école transmet des valeurs : elle n'est pas neutre.", "problematique"],
    ["cam", "C", "Que ressentent les élèves dans la classe de M. Bernard ?", ["Pour la première fois, ils se sentent exister et considérés", "Ils s'ennuient", "Ils ont peur du maître", "Ils sont punis sans cesse"], "On les juge « dignes de découvrir le monde ».", "extrait"],
    ["cam", "F", "Qui a écrit le scénario de la BD Paroles d'école ?", ["Jean-Pierre Guéno", "Jean-Philippe Gueno", "Albert Camus", "Jacques Prévert"], "La feuille se trompe de prénom.", "pieges"],
    ["cam", "F", "À qui Camus dédie-t-il ses Discours de Suède ?", ["À Louis Germain", "À sa mère", "À Jean-Paul Sartre", "À Francine Camus"], "Les discours du Nobel, publiés en 1958.", "auteur"],
    ["cam", "T", "Quel texte s'oppose le plus à Camus sur la figure du maître ?", ["Balzac : le Régent humilie et punit", "Hugo", "Ferry", "Péguy"], "Flaubert aussi montre un professeur qui participe à la moquerie.", "problematique"],
    ["cam", "A", "Que traduit la formule finale « Je vous embrasse, de toutes mes forces » ?", ["Une émotion intense, une affection sans réserve", "Une formule administrative", "De l'ironie", "Un reproche"], "Surlignée sur la feuille.", "annotations"],
    /* --- Arendt --- */
    ["are", "F", "Quel est le titre de l'essai d'Arendt ?", ["« La crise de l'éducation »", "« Qu'est-ce que les Lumières ? »", "« L'Argent »", "« Lettre aux instituteurs »"], "Recueilli dans La Crise de la culture.", "essentiel"],
    ["are", "F", "Dans quel recueil français se trouve l'essai ?", ["La Crise de la culture", "Les Origines du totalitarisme", "Eichmann à Jérusalem", "Condition de l'homme moderne"], "Titre anglais : Between Past and Future.", "oeuvre"],
    ["are", "F", "En quelle année paraît la traduction française chez Gallimard ?", ["1972", "1961", "1958", "1906"], "1961 = recueil anglais ; 1958 = l'essai. La feuille indique 1961.", "pieges"],
    ["are", "F", "De quand date l'essai (conférence et première publication) ?", ["1958", "1933", "1972", "1994"], "Conférence à Brême le 13 mai 1958.", "pieges"],
    ["are", "F", "Quelle formule Arendt forge-t-elle après le procès Eichmann ?", ["La banalité du mal", "Le bon sauvage", "Les hussards noirs", "La perfectibilité"], "Eichmann à Jérusalem (1963).", "auteur"],
    ["are", "F", "Dans quel camp Arendt est-elle internée en 1940 ?", ["Gurs", "Drancy", "Auschwitz", "Dachau"], "Elle s'en échappe, puis gagne New York en 1941.", "auteur"],
    ["are", "C", "Quel paradoxe le texte pose-t-il ?", ["L'éducation a besoin d'autorité et de tradition, mais le monde moderne n'en a plus", "L'école doit être sévère mais amusante", "Les enfants sont plus savants que les adultes", "L'éducation doit être religieuse et laïque"], "Marqué par « cependant ».", "extrait"],
    ["are", "C", "À qui revient la responsabilité d'une attitude différente envers les enfants ?", ["À chacun de nous, pas seulement aux professeurs", "Aux professeurs seulement", "Aux parents seulement", "À l'État seulement"], "Marques rouges en cours : « pas seulement… mais ».", "annotations"],
    ["are", "C", "Où l'autorité et le rapport au passé doivent-ils s'appliquer ?", ["Au seul domaine de l'éducation", "À la politique", "Au monde du travail", "À toutes les relations entre adultes"], "Ils n'ont pas de valeur générale chez les adultes.", "citations"],
    ["are", "C", "Quel est le rôle de l'école selon Arendt ?", ["Apprendre aux enfants ce qu'est le monde", "Leur inculquer l'art de vivre", "Les laisser vivre selon leurs propres lois", "Les préparer à un métier"], "« et non pas leur inculquer l'art de vivre ».", "citations"],
    ["are", "A", "« devons », « il faudrait », « devrait », « il ne faudrait jamais » : quel procédé ?", ["La modalisation (verbes de devoir) : ton prescriptif", "L'imparfait d'habitude", "L'impératif", "Le futur simple"], "Soulignés sur la feuille.", "annotations"],
    ["are", "A", "Que marque « cependant » (entouré) ?", ["Une opposition : le paradoxe du texte", "Une cause", "Une conséquence", "Un ajout"], "Connecteur d'opposition.", "annotations"],
    ["are", "A", "Que représente la « ligne » ?", ["La séparation nécessaire entre enfants et adultes", "Un mur qui isole les enfants", "Une ligne d'écriture", "La frontière d'un pays"], "On ne traite pas les enfants comme de grandes personnes.", "extrait"],
    ["are", "A", "Que refuse Arendt avec l'image du « mur » ?", ["Que l'enfance devienne un monde autonome, coupé des adultes", "Que les enfants aillent à l'école", "Que les adultes enseignent", "Que les enfants lisent"], "« comme s'ils ne vivaient pas dans le même monde ».", "extrait"],
    ["are", "C", "Pourquoi apprendre est-il « tourné vers le passé » ?", ["Parce que le monde est plus vieux que les enfants", "Parce qu'on n'étudie que l'histoire", "Parce que les professeurs sont vieux", "Parce que l'avenir n'existe pas"], "« toujours plus vieux qu'eux ».", "extrait"],
    ["are", "T", "Quel type d'éducation Arendt critique-t-elle ?", ["L'éducation « progressiste » centrée sur l'enfant autonome", "L'éducation humaniste de Ponocrates", "L'école de Jules Ferry", "L'éducation des hussards noirs"], "Contexte américain des années 1950.", "epoque"],
    /* --- Tout le chapitre (transversal) --- */
    ["all", "T", "Quel est le bon ordre chronologique ?", ["Rabelais → Rousseau → Balzac → Flaubert → Ferry → Péguy → Arendt", "Rousseau → Rabelais → Flaubert → Balzac → Ferry → Arendt → Péguy", "Rabelais → Balzac → Rousseau → Ferry → Flaubert → Péguy → Arendt", "Rabelais → Rousseau → Flaubert → Balzac → Péguy → Ferry → Arendt"], "1534-35, 1755, 1832, 1857, 1883, 1913, 1958.", "frise"],
    ["all", "T", "Quel texte relève de l'humanisme de la Renaissance ?", ["Gargantua (Rabelais)", "Le Discours sur l'inégalité (Rousseau)", "Madame Bovary (Flaubert)", "La Crise de la culture (Arendt)"], "XVIe siècle.", "frise"],
    ["all", "T", "Quel texte est une lettre officielle d'un ministre ?", ["La « Lettre aux instituteurs » de Ferry", "La lettre de Camus à Louis Germain", "L'Argent de Péguy", "Le Discours de Rousseau"], "La lettre de Camus est une lettre privée.", "frise"],
    ["all", "T", "Quels textes montrent une école qui humilie ?", ["Balzac et Flaubert", "Camus et Péguy", "Hugo et Ferry", "Rabelais (ch. 23) et Arendt"], "Le Régent de Lambert ; la classe qui rit de Charles.", "duels"],
    ["all", "T", "Quel texte fait l'éloge des instituteurs par une image militaire ?", ["Péguy", "Ferry", "Hugo", "Balzac"], "Les « hussards noirs ».", "duels"],
    ["all", "T", "Quel texte définit l'homme par la perfectibilité ?", ["Rousseau", "Arendt", "Rabelais", "Camus"], "Discours sur l'inégalité (1755).", "duels"],
    ["all", "T", "Quel auteur sacralise l'école (« sanctuaire ») ?", ["Hugo", "Ferry", "Balzac", "Flaubert"], "« L'école est sanctuaire autant que la chapelle ».", "duels"],
    ["all", "T", "Quel texte distingue croyances et connaissances ?", ["Ferry", "Péguy", "Arendt", "Rousseau"], "Croyances personnelles / connaissances communes.", "duels"],
    ["all", "T", "Quel texte parle d'une ligne qui ne doit pas devenir un mur ?", ["Arendt", "Balzac", "Ferry", "Rousseau"], "La séparation enfants / adultes.", "duels"],
    ["all", "T", "Dans quels textes l'homme sans éducation est-il assimilé à un animal ?", ["Rabelais (ch. 11) et Hugo", "Camus et Ferry", "Péguy et Arendt", "Ferry et Péguy"], "L'écuelle des chiens ; les « hommes animaux ».", "duels"],
    ["all", "T", "Quel texte présente le plus nettement l'école comme un lieu d'émancipation sociale ?", ["Camus", "Flaubert", "Balzac", "Rabelais (ch. 11)"], "Le « petit enfant pauvre » devenu prix Nobel.", "duels"],
    ["all", "T", "Quels textes datent de la IIIe République et portent sur l'école laïque ?", ["Ferry et Péguy", "Rabelais et Rousseau", "Balzac et Flaubert", "Arendt et Rousseau"], "1883 et 1913 (souvenir de 1880).", "duels"],
    ["all", "T", "Quel texte est un incipit de roman ?", ["Flaubert, Madame Bovary", "Balzac, Louis Lambert", "Camus, Le Premier Homme", "Rabelais, Gargantua ch. 23"], "Première page du roman.", "frise"],
    ["all", "T", "Quelle œuvre du corpus est posthume ?", ["Le Premier Homme de Camus", "L'Argent de Péguy", "Les Quatre Vents de l'esprit de Hugo", "Madame Bovary de Flaubert"], "Publié en 1994, 34 ans après la mort de Camus.", "frise"],
    ["all", "T", "Rousseau (1755) et Arendt (1958) ont en commun de penser que…", ["L'enfant n'est pas un adulte et que l'éducation décide de ce que l'homme devient", "L'école doit être militaire", "La religion doit diriger l'école", "L'enfant doit vivre selon ses propres lois"], "Perfectibilité chez l'un, transmission d'un monde chez l'autre.", "duels"],
    ["all", "T", "Quel texte critique l'école de manière comique plutôt que polémique ?", ["Rabelais (ch. 11)", "Ferry", "Péguy", "Arendt"], "Satire par le rire et les proverbes.", "duels"]
  ],

  /* =====================================================================
     FLASHCARDS : [texte, recto, verso]
     ===================================================================== */
  flashcards: [
    /* --- Rabelais, ch. 11 --- */
    ["rab11", "Rabelais : dates, statut, mouvement ?", "v. 1483/1494-1553 · moine puis médecin · humanisme (Renaissance)."],
    ["rab11", "Gargantua : date et pseudonyme ?", "1534 ou 1535 (Lyon) · Alcofribas Nasier (anagramme de François Rabelais)."],
    ["rab11", "Ch. 11 : que fait Gargantua de 3 à 5 ans ?", "Il boit, mange et dort « comme tous les petits enfants du pays » (formule répétée en permutant les verbes)."],
    ["rab11", "« Adolescence » dans le titre du ch. 11 ?", "La petite enfance (note 1)."],
    ["rab11", "3 procédés clés du ch. 11 ?", "Énumération à l'imparfait d'habitude · registre scatologique · proverbes pris au pied de la lettre (sens propre / figuré)."],
    ["rab11", "« mettait la charrue avant les bœufs » (sens figuré) ?", "Faire les choses dans le mauvais ordre."],
    ["rab11", "« battait froid » / « revenait à ses moutons » ?", "Agir à contretemps / revenir à son sujet."],
    ["rab11", "Comment finit le ch. 11 et qu'en conclure ?", "Il mange dans l'écuelle des petits chiens de son père → animalisation : sans éducation, l'enfant reste une bête."],
    ["rab11", "Le ton du ch. 11, noté en cours ?", "« Ironique / satirique »."],
    /* --- Rabelais, ch. 23 --- */
    ["rab23", "Précepteur humaniste / précepteur sophiste ?", "Ponocrates (« bourreau de travail ») / Thubal Holoferne."],
    ["rab23", "Anagnostes ? Séraphin Calobarsy ?", "Le page qui lit l'Écriture (« lecteur ») · le médecin qui purge Gargantua (anagramme de l'auteur)."],
    ["rab23", "Heure du lever de Gargantua ?", "Vers 4 heures du matin."],
    ["rab23", "Contenu de la journée humaniste ?", "Bible, observation du ciel, répétitions, 3 h de lecture, jeux de balle, repas savant, cartes pour l'arithmétique, géométrie, astronomie, musique."],
    ["rab23", "Les 3 annotations de cours du ch. 23 ?", "« Usage de l'imparfait » · connecteurs surlignés (Puis, Ce fait, Au commencement, Après) · « énumération » et « buffet intellectuel »."],
    ["rab23", "Idéal humaniste (4 mots) ?", "Savoir encyclopédique · corps + esprit · foi évangélique · pédagogie active."],
    ["rab23", "« Science sans conscience… » : où ?", "Pantagruel, ch. 8 (lettre de Gargantua à son fils). Pas dans Gargantua !"],
    ["rab23", "« Fais ce que voudras » : où ?", "Gargantua, ch. 57 : l'abbaye de Thélème."],
    ["rab23", "« dîner » chez Rabelais ?", "Le repas principal de midi (note 10)."],
    /* --- Rousseau --- */
    ["rou", "Rousseau : dates, origine, mouvement ?", "1712 (Genève) - 1778 · Lumières, mais critique du progrès."],
    ["rou", "Œuvre et date du texte ?", "Discours sur l'origine et les fondements de l'inégalité parmi les hommes, 1755 (1re partie)."],
    ["rou", "Définition de la perfectibilité ?", "« La faculté de se perfectionner » : aidée des circonstances, elle développe toutes les autres, dans l'espèce comme dans l'individu."],
    ["rou", "Les deux critères homme / animal ?", "1) La liberté (l'homme peut acquiescer ou résister) · 2) la perfectibilité."],
    ["rou", "Pourquoi l'homme peut-il devenir « imbécile » ?", "Il peut perdre ce qu'il a acquis (vieillesse, accidents) et retomber « plus bas que la bête même »."],
    ["rou", "Conclusion du texte ?", "Pessimiste : la perfectibilité est « la source de tous les malheurs de l'homme », elle le rend « tyran de lui-même et de la nature »."],
    ["rou", "Anecdote Voltaire / Rousseau ?", "Lettre du 30 août 1755 : « il prend envie de marcher à quatre pattes quand on lit votre ouvrage »."],
    ["rou", "Paradoxe de l'auteur d'Émile ?", "Il a abandonné ses 5 enfants aux Enfants-Trouvés (1746-1752) ; Voltaire le révèle en 1764."],
    ["rou", "Pièges Rousseau ?", "Jamais « bon sauvage » · pas de prix de Dijon pour ce Discours (prix de 1750 pour le premier) · « imbécile » = privé de facultés."],
    /* --- Balzac --- */
    ["bal", "Balzac : dates et collège ?", "1799 (Tours) - 1850 · pensionnaire chez les Oratoriens de Vendôme (1807-1813)."],
    ["bal", "Louis Lambert : date, place dans La Comédie humaine ?", "1832 (remanié jusqu'en 1835) · Études philosophiques."],
    ["bal", "Phrase humiliante du Régent ?", "« Vous ne faites rien, Lambert ! » : « un coup d'épingle qui blessait Louis au cœur »."],
    ["bal", "Pensum à Vendôme ?", "Des lignes à copier pendant les récréations."],
    ["bal", "Métaphore de la prison ?", "« le régime pénitentiaire observé dans les collèges » (pénitentiaire = qui concerne les prisonniers)."],
    ["bal", "Hyperbole de l'extrait ?", "Pas « six jours de liberté durant nos deux années d'amitié »."],
    ["bal", "Qu'est-ce qui sauve les deux amis ?", "Les livres de la bibliothèque, qui évitent « un abrutissement complet »."],
    ["bal", "Traité de la volonté ?", "Écrit par Lambert (et par Balzac enfant), confisqué par le Père Haugoult."],
    ["bal", "Destin de Louis Lambert ?", "Folie avant son mariage avec Pauline de Villenoix ; mort à 28 ans."],
    /* --- Flaubert --- */
    ["flo", "Flaubert : dates, mouvement, surnom de sa méthode ?", "1821 (Rouen) - 1880 · réalisme · le « gueuloir »."],
    ["flo", "Procès de Madame Bovary ?", "Janvier-février 1857 (Pinard accuse, Sénard défend) : acquitté le 7 février 1857."],
    ["flo", "Qui raconte l'incipit ?", "Un « nous » : les camarades de classe (il disparaît ensuite)."],
    ["flo", "Qui est qui : Proviseur, M. Roger, professeur ?", "Le Proviseur amène le nouveau · M. Roger = maître d'études · le professeur interroge et punit."],
    ["flo", "Charbovari ?", "Le nom de Charles Bovary crié et déformé, repris en chœur par la classe."],
    ["flo", "Ridiculus sum ?", "« Je suis ridicule » : à copier vingt fois (punition de Charles)."],
    ["flo", "Fonction de la description de la casquette ?", "Symboliser Charles : disparate, maladroit, sa « laideur muette » comme « le visage d'un imbécile »."],
    ["flo", "La note de cours en haut du verso ?", "On favorise la conformité → l'école devient un lieu de stigmatisation sociale où le professeur participe au « bannissement » symbolique."],
    ["flo", "« Madame Bovary, c'est moi » ?", "Phrase apocryphe : absente des écrits de Flaubert (rapportée en 1909)."],
    ["flo", "Quos ego ?", "Virgile, Énéide I, 135 : menace interrompue de Neptune aux vents ; comparaison héroï-comique du professeur."],
    /* --- Hugo --- */
    ["hug", "Hugo : dates, mouvement, statut en 1881 ?", "1802-1885 · romantisme · sénateur de la Seine (1876-1885), pas député."],
    ["hug", "Titre du poème dans le recueil, date d'écriture ?", "« Écrit après la visite d'un bagne », Les Quatre Vents de l'esprit (1881), daté de Jersey, 1853."],
    ["hug", "Premier vers (thèse) ?", "« Chaque enfant qu'on enseigne est un homme qu'on gagne. »"],
    ["hug", "Argument chiffré ?", "90 voleurs sur 100 au bagne ne sont jamais allés à l'école."],
    ["hug", "Métaphore filée du poème ?", "Lumière (savoir : lampe, lueur, « Allumons les esprits ») / ténèbres (ignorance : nuit, ombre, abîme)."],
    ["hug", "Vers de la sacralisation ?", "« L'école est sanctuaire autant que la chapelle. »"],
    ["hug", "Impératifs relevés ?", "donnez · Marchez · Allumons · faisons · Songeons-y → visée argumentative."],
    ["hug", "Rejet à connaître ?", "« et qui ne pense pas / Ne vit pas »."],
    ["hug", "Chute du poème ?", "L'école change le cuivre en or ; l'ignorance change l'or en plomb."],
    ["hug", "« Ouvrir une école, c'est fermer une prison » ?", "Pas de Hugo (attribution fausse ; le Grand Larousse l'attribuait à Louis Jourdan)."],
    /* --- Ferry --- */
    ["fer", "Ferry : dates, fonctions ?", "1832-1893 · ministre de l'Instruction publique, président du Conseil (1880-1881, 1883-1885)."],
    ["fer", "Date de la Lettre aux instituteurs ?", "17 novembre 1883."],
    ["fer", "Lois de 1881 et 1882 ?", "16 juin 1881 : gratuité · 28 mars 1882 : obligation (6-13 ans) + laïcité des programmes."],
    ["fer", "Formule clé de la lettre ?", "« L'instruction religieuse appartient aux familles et à l'Église, l'instruction morale à l'école. »"],
    ["fer", "Croyances vs connaissances ?", "Croyances : « personnelles, libres et variables » · connaissances : « communes et indispensables à tous »."],
    ["fer", "« œuvre purement négative » ?", "Ce que la loi n'est PAS : elle fonde une éducation nationale sur le devoir et le droit."],
    ["fer", "Test du père de famille ?", "Ne rien enseigner qu'un seul père de famille honnête puisse refuser de bonne foi."],
    ["fer", "Après Ferry ?", "Loi Goblet (1886) : personnel laïque · loi du 9 décembre 1905 : séparation des Églises et de l'État."],
    ["fer", "Encadré Helvétius / Diderot ?", "Helvétius : éducation d'abord morale · Diderot : pas de justice sans lumières (instruire)."],
    /* --- Péguy --- */
    ["peg", "Péguy : dates, origine, mort ?", "1873 (Orléans, mère rempailleuse de chaises) - tué le 5 septembre 1914, veille de la bataille de la Marne."],
    ["peg", "Œuvre, date, souvenir ?", "L'Argent (1913) · souvenir de 1880 (école annexe de l'École normale d'Orléans)."],
    ["peg", "Hussards noirs ?", "Les jeunes instituteurs de la IIIe République (image créée par Péguy)."],
    ["peg", "L'uniforme ?", "Noir (pantalon, gilet, redingote, casquette plate) avec liseré et palmes violets : un « uniforme civique »."],
    ["peg", "Le violet ?", "Couleur des évêques ET de l'enseignement primaire."],
    ["peg", "Anaphore de la filiation ?", "« Par ces gamins… Par ces jeunes hussards de la République. Par ces nourrissons de la République. »"],
    ["peg", "L'École normale est…", "« un régiment inépuisable », « un immense dépôt, gouvernemental, de jeunesse et de civisme »."],
    ["peg", "Revue et engagements ?", "Les Cahiers de la Quinzaine (1900) · dreyfusard, socialiste puis catholique."],
    ["peg", "Fonction de la description (question 3) ?", "Éloge des instituteurs → construction d'un mythe républicain."],
    /* --- Camus --- */
    ["cam", "Camus : dates, Nobel, famille ?", "1913-1960 · Nobel 1957 · père mort en 1914, mère illettrée et à demi sourde."],
    ["cam", "Date et destinataire de la lettre ?", "19 novembre 1957, à son instituteur Louis Germain."],
    ["cam", "M. Bernard ?", "L'instituteur du Premier Homme, inspiré de Louis Germain."],
    ["cam", "Le Premier Homme ?", "Roman autobiographique inachevé, manuscrit retrouvé après l'accident de 1960, publié en 1994."],
    ["cam", "Les surlignages de cours dans la lettre ?", "« main affectueuse » · « tendue au petit enfant pauvre » · « le cœur généreux » · « Je vous embrasse, de toutes mes forces »."],
    ["cam", "Métaphore du Premier Homme ?", "La nourriture : l'école nourrit « la faim de la découverte » ; ailleurs on « gave » les élèves comme des oies."],
    ["cam", "Valeurs de M. Bernard ?", "Il condamne le vol, la délation, l'indélicatesse, la malpropreté."],
    ["cam", "BD : auteur exact ?", "Jean-Pierre Guéno (et non Jean-Philippe), Paroles d'école, Soleil, 2013."],
    ["cam", "Discours de Suède ?", "Les discours du Nobel, dédiés à Louis Germain."],
    /* --- Arendt --- */
    ["are", "Arendt : dates, exil ?", "1906-1975 · fuit l'Allemagne en 1933, internée à Gurs en 1940, New York en 1941."],
    ["are", "Dates de « La crise de l'éducation » ?", "Essai de 1958 · recueil anglais Between Past and Future (1961) · La Crise de la culture, Gallimard (1972)."],
    ["are", "Le paradoxe (« cependant ») ?", "L'éducation ne peut se passer d'autorité ni de tradition, mais le monde moderne n'est plus structuré par elles."],
    ["are", "Où s'applique l'autorité ?", "« au seul domaine de l'éducation », pas dans le monde des adultes."],
    ["are", "Rôle de l'école ?", "Apprendre aux enfants ce qu'est le monde, non leur inculquer l'art de vivre."],
    ["are", "La ligne et le mur ?", "La ligne enfants / adultes est nécessaire ; elle ne doit jamais devenir un mur qui isole l'enfance."],
    ["are", "Verbes soulignés ?", "devons · doivent · il faudrait · devrait · il ne faudrait jamais → modalisation prescriptive."],
    ["are", "Banalité du mal ?", "Formule d'Arendt après le procès Eichmann (Eichmann à Jérusalem, 1963)."],
    ["are", "Éducation « conservatrice » ?", "Conserver le monde pour protéger la nouveauté de chaque enfant (natalité)."]
  ],

  /* =====================================================================
     PIÈGES DU CHAPITRE : [titre, explication, texte]
     ===================================================================== */
  pieges: [
    ["Pantagruel ou Gargantua ?", "<em>Pantagruel</em> (1532) raconte le fils ; <em>Gargantua</em> (1534-1535) raconte le père… mais il est publié <b>après</b>. « Science sans conscience n'est que ruine de l'âme » est dans <em>Pantagruel</em> (ch. 8) ; « Fais ce que voudras » (Thélème) dans <em>Gargantua</em> (ch. 57).", "rab23"],
    ["Les maîtres de Gargantua", "<b>Thubal Holoferne</b> = précepteur sophiste, mauvais maître · <b>Ponocrates</b> = précepteur humaniste (ch. 23) · <b>Anagnostes</b> = le page qui lit · <b>Séraphin Calobarsy</b> = le médecin · <b>Grandgousier</b> = le père.", "rab23"],
    ["1534 ou 1535 ?", "Les feuilles donnent 1535 (texte 1) et 1534 (texte 2). La première édition connue est « souvent datée de la fin de 1534, mais plus sûrement du début de l'année 1535 » (Université de Tours). Les deux dates se rencontrent.", "rab11"],
    ["Charles ou Emma ?", "L'incipit de <em>Madame Bovary</em> présente <b>Charles</b>, le futur mari, pas Emma. Le « nous » = ses camarades. M. Roger = le maître d'études ; le Proviseur amène le nouveau ; le professeur punit.", "flo"],
    ["Louis Germain ou M. Bernard ?", "<b>Louis Germain</b> = l'instituteur réel de Camus (lettre de 1957, <em>Discours de Suède</em>) · <b>M. Bernard</b> = son double dans <em>Le Premier Homme</em> · Camus y s'appelle <b>Jacques Cormery</b>.", "cam"],
    ["1881, 1882, 1883…", "16 juin <b>1881</b> : gratuité · 28 mars <b>1882</b> : obligation (6-13 ans) + laïcité des programmes · 17 novembre <b>1883</b> : Lettre aux instituteurs · <b>1886</b> : loi Goblet (personnel laïque) · 9 décembre <b>1905</b> : séparation des Églises et de l'État.", "fer"],
    ["Les dates d'Arendt", "Conférence à Brême et article en anglais : <b>1958</b> · recueil <em>Between Past and Future</em> : <b>1961</b> · <em>La Crise de la culture</em>, Gallimard : <b>1972</b>. La feuille (« Gallimard, 1961 ») mélange les deux dernières.", "are"],
    ["Hugo : député ou sénateur ?", "En <b>1881</b>, Hugo est <b>sénateur</b> de la Seine (élu en 1876, jusqu'à sa mort en 1885). Il avait été député en 1848-1851 et en 1871. Le poème est daté de <b>1853</b> (Jersey) et publié en 1881.", "hug"],
    ["Fausses citations", "« <b>Bon sauvage</b> » : jamais écrit par Rousseau · « <b>Ouvrir une école, c'est fermer une prison</b> » : pas de Hugo · « <b>Madame Bovary, c'est moi</b> » : apocryphe.", "rou"],
    ["Rousseau et le prix de Dijon", "Prix de l'Académie de Dijon en <b>1750</b> pour le <em>Discours sur les sciences et les arts</em>. Le <em>Discours sur l'inégalité</em> (1755) n'a <b>pas</b> été primé.", "rou"],
    ["La BD de la feuille Camus", "Auteur : <b>Jean-Pierre Guéno</b> (scénario), et non « Jean-Philippe » ; <em>Paroles d'école</em>, Soleil, 2013. Le poème récité est « En sortant de l'école » de Prévert.", "cam"],
    ["Deux numéros « 4 », « 5 », « 6 »", "Texte 4 = <b>Camus</b> (manuscrit) ou <b>Hugo</b> (imprimé) · Texte 5 = <b>Flaubert</b> (manuscrit) ou <b>Ferry</b> (imprimé) · Texte 6 = <b>Balzac</b> (manuscrit) ou <b>Péguy</b> (imprimé). Si le prof dit « texte 5 », demande-toi de quelle liste il parle !", "all"],
    ["Mots au sens ancien", "« adolescence » (Rabelais) = petite enfance · « dîner » (Rabelais) = repas de midi · « imbécile » (Rousseau) = privé de facultés · « lumières » (Rousseau) = connaissances · « Régent » (Balzac) = professeur · « pénitentiaire » = qui concerne les prisonniers · « faire fi » (Arendt) = ne pas tenir compte.", "all"],
    ["Les mouvements", "Rabelais = <b>humanisme</b> (XVIe) · Rousseau = <b>Lumières</b> (XVIIIe, mais critique du progrès) · Balzac = <b>réalisme</b> (traits romantiques) · Flaubert = <b>réalisme</b> · Hugo = <b>romantisme</b> · Ferry et Péguy = <b>IIIe République</b> · Camus = <b>absurde et révolte</b> · Arendt = <b>philosophie politique</b> du XXe.", "all"],
    ["Péguy : deux dates", "Le souvenir date de <b>1880</b> ; le texte (<em>L'Argent</em>) de <b>1913</b>. La photo montre l'École normale de <b>Loches</b> (vers 1907), pas d'Orléans.", "peg"],
    ["Camus : trois dates", "Nobel et lettre : <b>1957</b> · mort : <b>1960</b> · <em>Le Premier Homme</em> : <b>1994</b> (posthume ; la feuille imprime « 1964 » pour l'annexe, sans doute une coquille).", "cam"]
  ],

  /* =====================================================================
     FRISE : repères historiques [année, libellé, calque] (les textes y sont ajoutés automatiquement)
     ===================================================================== */
  frise: [
    [1515, "1515-1547 · Règne de François Ier", "Renaissance et Réforme"],
    [1517, "1517 · Luther : début de la Réforme", "Renaissance et Réforme"],
    [1532, "1532 · Pantagruel (Rabelais)", "Renaissance et Réforme"],
    [1534, "Oct. 1534 · Affaire des Placards", "Renaissance et Réforme"],
    [1751, "1751-1772 · L'Encyclopédie (Diderot, d'Alembert)", "Lumières"],
    [1762, "1762 · Émile et Du contrat social, condamnés", "Lumières"],
    [1789, "1789 · Révolution française", "Révolution et Empire"],
    [1807, "1807-1813 · Balzac au collège de Vendôme (Premier Empire)", "Révolution et Empire"],
    [1833, "1833 · Loi Guizot : une école primaire par commune", "XIXe siècle"],
    [1848, "1848 · IIe République ; Hugo député", "XIXe siècle"],
    [1851, "2 déc. 1851 · Coup d'État ; exil de Hugo", "XIXe siècle"],
    [1853, "1853 · Hugo écrit le poème du bagne (Jersey)", "XIXe siècle"],
    [1870, "4 sept. 1870 · IIIe République", "IIIe République et école"],
    [1879, "1879 · Loi Paul Bert : écoles normales", "IIIe République et école"],
    [1880, "Vers 1880 · Les « hussards noirs » de Péguy", "IIIe République et école"],
    [1881, "16 juin 1881 · Gratuité de l'école primaire", "IIIe République et école"],
    [1882, "28 mars 1882 · Obligation et laïcité", "IIIe République et école"],
    [1885, "1885 · Funérailles de Hugo ; discours colonial de Ferry", "IIIe République et école"],
    [1886, "1886 · Loi Goblet : personnel laïque", "IIIe République et école"],
    [1894, "1894-1906 · Affaire Dreyfus", "IIIe République et école"],
    [1905, "9 déc. 1905 · Séparation des Églises et de l'État", "IIIe République et école"],
    [1914, "1914-1918 · Grande Guerre (mort de Péguy, du père de Camus)", "Guerres mondiales"],
    [1933, "1933 · Hitler au pouvoir ; exil d'Arendt", "Guerres mondiales"],
    [1939, "1939-1945 · Seconde Guerre mondiale (Gurs, 1940)", "Guerres mondiales"],
    [1960, "4 janv. 1960 · Mort de Camus", "Après-guerre"],
    [1961, "1961 · Between Past and Future (Arendt)", "Après-guerre"],
    [1972, "1972 · La Crise de la culture en français", "Après-guerre"],
    [1994, "1994 · Publication du Premier Homme", "Après-guerre"],
    [2013, "2013 · BD Paroles d'école (Guéno)", "Après-guerre"]
  ],

  /* =====================================================================
     DUELS : deux textes face à face + une question [question, [BONNE, fausses…], explication]
     ===================================================================== */
  duels: [
    {
      a: "rab11",
      b: "rab23",
      titre: "La nature ou la méthode",
      lignes: [
        ["Enfance livrée à ses instincts : boire, manger, dormir", "Journée réglée dès 4 h du matin par Ponocrates"],
        ["Énumération désordonnée, registre scatologique", "Énumérations savantes (aliments, auteurs antiques)"],
        ["Imparfait d'habitude : une routine sans progrès", "Imparfait d'habitude : une routine qui fait progresser"],
        ["L'enfant finit avec les chiens (animalisation)", "L'élève dépasse les médecins (humanisation)"]
      ],
      synthese: "Mêmes outils (imparfait, énumération), sens opposé : sans méthode l'enfant reste une bête ; avec la méthode humaniste, il devient un homme complet.",
      q: [
        "Quel procédé les deux chapitres de Rabelais ont-ils en commun ?",
        ["L'imparfait d'habitude et l'énumération", "L'impératif et l'anaphore", "Le discours direct et le dialogue", "L'alexandrin et la rime"],
        "Ils décrivent tous deux des habitudes, mais l'une abrutit et l'autre forme."
      ]
    },
    {
      a: "bal",
      b: "cam",
      titre: "Le maître qui écrase, le maître qui élève",
      lignes: [
        ["Le Régent humilie : « Vous ne faites rien, Lambert ! »", "M. Bernard considère : on juge les élèves « dignes de découvrir le monde »"],
        ["Pensums, récréations supprimées, « régime pénitentiaire »", "« La faim de la découverte » ; le maître partage sa vie"],
        ["Risque d'« abrutissement complet »", "Ascension de l'enfant pauvre jusqu'au Nobel"],
        ["Le salut vient des livres, hors de la classe", "Le salut vient de la classe elle-même"]
      ],
      synthese: "Deux souvenirs autobiographiques d'école : l'un dénonce une discipline qui étouffe le génie, l'autre célèbre un maître qui émancipe.",
      q: [
        "Qu'est-ce qui oppose le Régent de Balzac à M. Bernard ?",
        ["L'humiliation et la punition face à la considération et à la curiosité éveillée", "L'âge des deux maîtres", "La matière enseignée", "Le pays où ils enseignent"],
        "Deux figures du maître : celui qui écrase, celui qui élève."
      ]
    },
    {
      a: "flo",
      b: "cam",
      titre: "L'enfant modeste : moqué ou relevé",
      lignes: [
        ["Charles, garçon de la campagne, moqué pour sa casquette et son nom", "Le « petit enfant pauvre » d'Alger, aidé par la « main affectueuse »"],
        ["Le professeur rit avec la classe et punit (ridiculus sum)", "Le maître tend la main et élève"],
        ["Point de vue du « nous » moqueur", "Point de vue reconnaissant de l'ancien élève"],
        ["Conformité et stigmatisation", "Considération et émancipation"]
      ],
      synthese: "Même point de départ (un enfant modeste arrive à l'école), deux destins : l'école qui exclut, l'école qui intègre.",
      q: [
        "Quel point commun entre Charles Bovary et le jeune Camus ?",
        ["Ce sont des enfants d'origine modeste face à l'école", "Ils ont eu le même instituteur", "Ils deviennent tous deux écrivains", "Ils sont tous deux punis de pensums"],
        "Mais l'un est humilié, l'autre relevé."
      ]
    },
    {
      a: "hug",
      b: "fer",
      titre: "Le poème et la loi",
      lignes: [
        ["Poème lyrique et argumentatif (alexandrins, impératifs)", "Lettre officielle, argumentation administrative"],
        ["L'école « sanctuaire autant que la chapelle » : sacralisation", "L'école séparée de l'Église : laïcité"],
        ["L'instruction prévient le crime", "L'instruction morale fonde une éducation nationale"],
        ["Écrit en exil (1853), publié en 1881", "Signée par le ministre (1883)"]
      ],
      synthese: "Tous deux font de l'école une mission morale et civique ; Hugo l'exalte en poète (sacré, lumière), Ferry l'organise en homme d'État (droit, devoir, laïcité).",
      q: [
        "Quelle différence essentielle entre Hugo et Ferry ?",
        ["Hugo sacralise l'école, Ferry la sépare de l'Église", "Hugo est contre l'école, Ferry pour", "Hugo parle des lycées, Ferry des universités", "Hugo écrit en 1883, Ferry en 1853"],
        "Mais tous deux voient dans l'instruction une mission morale."
      ]
    },
    {
      a: "fer",
      b: "peg",
      titre: "La loi et le mythe",
      lignes: [
        ["La loi : dispositions, croyances / connaissances", "Le mythe : des maîtres « beaux comme des hussards noirs »"],
        ["L'instituteur, éducateur moral chargé par les pouvoirs publics", "L'instituteur, soldat de la République en uniforme"],
        ["Argumentation raisonnée", "Éloge lyrique et nostalgique"],
        ["1883 : le cadre", "1913 : le souvenir idéalisé de 1880"]
      ],
      synthese: "Ferry pose les règles de l'école laïque ; Péguy en fait un mythe qui inspire le respect. Les deux montrent une école au service de la République, donc non neutre.",
      q: [
        "Ferry et Péguy montrent tous deux…",
        ["Une école au service de la République, porteuse de valeurs", "Une école religieuse", "Une école qui humilie les élèves", "Une école sans maîtres"],
        "La loi (Ferry) et le mythe (Péguy)."
      ]
    },
    {
      a: "rou",
      b: "are",
      titre: "Perfectibilité et transmission",
      lignes: [
        ["L'homme se fait par ses facultés : la perfectibilité", "L'enfant est un nouveau venu dans un monde plus vieux que lui"],
        ["Le progrès peut corrompre : méfiance envers la société", "L'école doit transmettre le monde : respect de la tradition"],
        ["La liberté de l'homme face à l'instinct", "L'autorité est nécessaire en éducation"],
        ["1755, Lumières (critique du progrès)", "1958, philosophie politique (crise de l'autorité)"]
      ],
      synthese: "Rousseau pense ce que l'éducation peut faire de l'homme, le meilleur et le pire ; Arendt, ce que les adultes doivent transmettre pour que les enfants puissent renouveler le monde.",
      q: [
        "Quelle idée rapproche Rousseau et Arendt ?",
        ["L'homme n'est pas achevé à la naissance : l'éducation décide beaucoup", "L'enfant doit vivre selon ses propres lois", "L'école doit être militaire", "La religion doit diriger l'éducation"],
        "Perfectibilité (Rousseau) ; natalité et transmission (Arendt)."
      ]
    }
  ],

  /* =====================================================================
     PROCÉDÉS : [texte, phrase, BON procédé, [3 faux], explication]
     ===================================================================== */
  procedes: [
    /* --- Hugo --- */
    ["hug", "« L'ignorance est la nuit qui commence l'abîme »", "Métaphore", ["Comparaison", "Litote", "Hyperbole"], "Ignorance = nuit, sans outil de comparaison."],
    ["hug", "« et qui ne pense pas / Ne vit pas »", "Rejet (enjambement)", ["Rime embrassée", "Anaphore", "Chiasme"], "La phrase déborde sur le vers suivant pour mettre « Ne vit pas » en relief."],
    ["hug", "« L'école est sanctuaire autant que la chapelle »", "Comparaison (sacralisation)", ["Antithèse", "Litote", "Allitération"], "Outil « autant que » : l'école égale la chapelle."],
    ["hug", "« Des hommes animaux, têtes inachevées »", "Animalisation (métaphore)", ["Personnification", "Euphémisme", "Anaphore"], "L'homme sans instruction réduit à l'animal."],
    ["hug", "« Marchez, la lampe en main, pour qu'il puisse vous suivre »", "Impératif (exhortation)", ["Question rhétorique", "Litote", "Prétérition"], "Le poète s'adresse aux éducateurs pour les faire agir."],
    /* --- Péguy --- */
    ["peg", "« beaux comme des hussards noirs »", "Comparaison", ["Métaphore", "Anaphore", "Antithèse"], "Outil « comme »."],
    ["peg", "« Par ces jeunes hussards de la République. Par ces nourrissons de la République. »", "Anaphore", ["Chiasme", "Oxymore", "Litote"], "Reprise de « Par ces » en tête de phrase."],
    ["peg", "« Sveltes ; sévères ; sanglés. »", "Allitération (et rythme ternaire)", ["Assonance en [a]", "Antithèse", "Prétérition"], "Répétition du son [s] dans trois adjectifs."],
    ["peg", "« un immense dépôt, gouvernemental, de jeunesse et de civisme »", "Métaphore (militaire)", ["Comparaison", "Litote", "Chiasme"], "L'École normale est un dépôt de troupes."],
    /* --- Rousseau --- */
    ["rou", "« ses lumières et ses erreurs, ses vices et ses vertus »", "Antithèse", ["Anaphore", "Gradation", "Euphémisme"], "Mots de sens opposés rapprochés."],
    ["rou", "« Pourquoi l'homme seul est-il sujet à devenir imbécile ? »", "Question rhétorique", ["Exclamation", "Impératif", "Discours indirect"], "L'auteur y répond lui-même."],
    ["rou", "« La Nature commande à tout animal, et la Bête obéit »", "Personnification (allégorie)", ["Litote", "Hyperbole", "Oxymore"], "La Nature « commande » : majuscules et verbe humain."],
    /* --- Balzac --- */
    ["bal", "« nous n'avons pas eu six jours de liberté durant nos deux années d'amitié »", "Hyperbole", ["Litote", "Euphémisme", "Comparaison"], "Exagération."],
    ["bal", "« un coup d'épingle qui blessait Louis au cœur »", "Métaphore", ["Comparaison", "Personnification", "Chiasme"], "La phrase du Régent est une piqûre."],
    ["bal", "« le régime pénitentiaire observé dans les collèges »", "Métaphore (le collège = une prison)", ["Litote", "Antiphrase", "Chiasme"], "Pénitentiaire = qui concerne les prisonniers."],
    /* --- Flaubert --- */
    ["flo", "« dit le professeur, qui était un homme d'esprit »", "Ironie", ["Hyperbole", "Litote", "Métaphore"], "Le narrateur pense le contraire : la plaisanterie est lourde."],
    ["flo", "« sa laideur muette a des profondeurs d'expression comme le visage d'un imbécile »", "Comparaison", ["Métaphore", "Anaphore", "Chiasme"], "Outil « comme » : la casquette ressemble à son propriétaire."],
    ["flo", "« Ce fut un vacarme qui s'élança d'un bond, monta en crescendo »", "Métaphore musicale (gradation)", ["Litote", "Chiasme", "Prétérition"], "Le chahut décrit comme un morceau de musique qui enfle."],
    /* --- Rabelais, ch. 11 --- */
    ["rab11", "« mettait la charrue avant les bœufs »", "Proverbe pris au pied de la lettre", ["Métaphore filée", "Oxymore", "Anaphore"], "Jeu sur le sens propre et le sens figuré."],
    ["rab11", "« mordait en riant, riait en mordant »", "Chiasme", ["Anaphore", "Litote", "Euphémisme"], "Structure croisée : mordre / rire / rire / mordre."],
    ["rab11", "« à boire, manger et dormir ; à manger, dormir et boire ; à dormir, boire et manger »", "Répétition avec permutation", ["Gradation", "Antithèse", "Litote"], "Mêmes mots, ordre changé : la vie tourne en rond."],
    /* --- Rabelais, ch. 23 --- */
    ["rab23", "« Monsieur l'Appétit venait »", "Personnification", ["Comparaison", "Hyperbole", "Litote"], "L'appétit devient un personnage."],
    ["rab23", "« n'était médecin qui en sût à la moitié tant comme il faisait »", "Hyperbole", ["Litote", "Euphémisme", "Antithèse"], "Exagération de la réussite de l'élève."],
    ["rab23", "« Puis… Ce fait… Au commencement… Après… »", "Connecteurs temporels (chronologie)", ["Connecteurs d'opposition", "Anaphore", "Gradation"], "Ils rythment l'emploi du temps."],
    /* --- Camus --- */
    ["cam", "« Sans vous, sans cette main affectueuse […], sans votre enseignement »", "Anaphore", ["Chiasme", "Antithèse", "Hyperbole"], "Reprise de « sans » : tout vient du maître."],
    ["cam", "« comme on gave les oies »", "Comparaison", ["Métaphore", "Métonymie", "Litote"], "Outil « comme » : l'élève gavé comme une oie."],
    ["cam", "« main affectueuse »", "Métonymie", ["Métaphore", "Oxymore", "Hyperbole"], "La main désigne l'aide, le geste du maître."],
    /* --- Arendt --- */
    ["are", "« devons », « il faudrait », « il ne faudrait jamais »", "Modalisation (verbes de devoir)", ["Impératif", "Imparfait d'habitude", "Futur simple"], "Le texte prescrit ce qu'il faut faire."],
    ["are", "« il ne faudrait jamais laisser cette ligne devenir un mur »", "Métaphore", ["Comparaison", "Litote", "Chiasme"], "Image spatiale de la séparation entre enfants et adultes."],
    /* --- Ferry --- */
    ["fer", "« L'instruction religieuse appartient aux familles et à l'Église, l'instruction morale à l'école. »", "Parallélisme (et opposition)", ["Chiasme", "Hyperbole", "Métaphore"], "Même construction pour deux domaines opposés."],
    ["fer", "« personnelles, libres et variables »", "Rythme ternaire (énumération)", ["Oxymore", "Litote", "Chiasme"], "Trois adjectifs pour définir les croyances."]
  ],

  /* =====================================================================
     TEXTES À TROUS : [texte, "phrase avec les {mots} à retrouver entre accolades"]
     ===================================================================== */
  trous: [
    /* --- Hugo --- */
    ["hug", "Chaque enfant qu'on {enseigne} est un {homme} qu'on {gagne}."],
    ["hug", "L'école est {sanctuaire} autant que la {chapelle}."],
    ["hug", "L'{ignorance} est la {nuit} qui commence l'abîme."],
    ["hug", "{Allumons} les esprits, c'est notre {loi} première"],
    ["hug", "Songeons-y bien, l'école en {or} change le {cuivre}"],
    /* --- Ferry --- */
    ["fer", "L'instruction {religieuse} appartient aux familles et à l'{Église}, l'instruction {morale} à l'école."],
    ["fer", "celui des {croyances} qui sont personnelles, libres et variables, et celui des {connaissances} qui sont communes et indispensables à tous"],
    ["fer", "Le législateur n'a donc pas entendu faire une œuvre purement {négative}."],
    /* --- Rousseau --- */
    ["rou", "c'est la faculté de se {perfectionner}"],
    ["rou", "La Nature commande à tout animal, et la {Bête} obéit."],
    ["rou", "le rend à la longue le {tyran} de lui-même et de la {nature}"],
    /* --- Péguy --- */
    ["peg", "Nos jeunes maîtres étaient beaux comme des {hussards} {noirs}."],
    ["peg", "Le {violet} n'est pas seulement la couleur des {évêques}"],
    ["peg", "un immense {dépôt}, gouvernemental, de jeunesse et de {civisme}"],
    /* --- Balzac --- */
    ["bal", "Vous ne faites {rien}, Lambert !"],
    ["bal", "le régime {pénitentiaire} observé dans les collèges"],
    /* --- Flaubert --- */
    ["flo", "vous me copierez vingt fois le verbe {ridiculus} {sum}"],
    ["flo", "Nous étions à l'{étude}, quand le {Proviseur} entra"],
    /* --- Rabelais, ch. 11 --- */
    ["rab11", "comme tous les petits {enfants} du {pays}"],
    ["rab11", "mettait la {charrue} avant les {bœufs}"],
    /* --- Rabelais, ch. 23 --- */
    ["rab23", "S'éveillait donc Gargantua environ {quatre} heures du matin."],
    ["rab23", "s'exerçant les {corps} comme ils avaient les {âmes} auparavant exercé"],
    /* --- Camus --- */
    ["cam", "ma première pensée, après ma {mère}, a été pour vous"],
    ["cam", "la {faim} de la {découverte}"],
    /* --- Arendt --- */
    ["are", "apprendre aux enfants ce qu'est le {monde}"],
    ["are", "il ne faudrait jamais laisser cette {ligne} devenir un {mur}"]
  ],

  /* =====================================================================
     ASSOCIATIONS : paires à relier (n = nombre de paires tirées à chaque partie)
     ===================================================================== */
  associations: [
    {
      titre: "Personnages",
      paires: [
        ["Ponocrates", "Précepteur humaniste de Gargantua"],
        ["Thubal Holoferne", "Précepteur sophiste qui abrutit Gargantua"],
        ["Anagnostes", "Page qui lit l'Écriture sainte"],
        ["Séraphin Calobarsy", "Médecin qui purge Gargantua"],
        ["Grandgousier", "Père de Gargantua"],
        ["Charles Bovary", "Le « nouveau » de l'incipit"],
        ["M. Roger", "Maître d'études de Madame Bovary"],
        ["Louis Lambert", "Élève surdoué du collège de Vendôme"],
        ["Le Régent", "Professeur qui dirige la classe de Lambert"],
        ["Louis Germain", "Instituteur réel de Camus"],
        ["M. Bernard", "Instituteur du Premier Homme"],
        ["Les hussards noirs", "Jeunes instituteurs de la IIIe République"]
      ],
      n: 8
    },
    {
      titre: "Auteurs, œuvres, dates",
      paires: [
        ["Rabelais", "Gargantua · 1534-1535 · humanisme"],
        ["Rousseau", "Discours sur l'inégalité · 1755 · Lumières"],
        ["Balzac", "Louis Lambert · 1832 · réalisme"],
        ["Flaubert", "Madame Bovary · 1857 · réalisme"],
        ["Hugo", "Les Quatre Vents de l'esprit · 1881 · romantisme"],
        ["Ferry", "Lettre aux instituteurs · 1883 · IIIe République"],
        ["Péguy", "L'Argent · 1913 · écrivain engagé"],
        ["Camus", "Lettre à Louis Germain · 1957 · absurde et révolte"],
        ["Arendt", "La Crise de la culture · 1961 (fr. 1972) · philosophie politique"]
      ],
      n: 9
    }
  ],

  /* =====================================================================
     GRAPHIQUES : axes du radar (valeurs 0-5 dans chaque texte) et de la carte (0-10)
     ===================================================================== */
  radarAxes: [
    ["autorite", "Autorité"],
    ["liberte", "Liberté de l'élève"],
    ["morale", "Morale, valeurs"],
    ["savoir", "Savoir"],
    ["etat", "État, institution"],
    ["critique", "Ton critique"]
  ],
  carteAxes: { x: ["Contraint, conforme", "Émancipe"], y: ["« Neutre »", "Porteuse de valeurs"] },

  /* =====================================================================
     EXERCICES DU MANUEL (types : revele, corrige, association, questions)
     ===================================================================== */
  exercices: [
    {
      type: "revele",
      texte: "rab11",
      titre: "LIRE 1 : les proverbes pris au pied de la lettre",
      consigne: "« Chacune des activités de l'enfant est évoquée par un proverbe qui a un sens littéral et un sens figuré. » Touche une ligne pour révéler les deux sens.",
      qcm: "Au sens figuré, « {q} » signifie…",
      items: [
        {
          q: "se couvrait d'un sac mouillé",
          r: "<p><b>Sens propre :</b> Il se protégeait (de la pluie) avec un sac trempé, qui ne protège de rien.</p><p><b>Sens figuré :</b> Il se défendait par une piètre excuse (note 3).</p>",
          bonne: "Il se défendait par une piètre excuse (note 3).",
          exp: "Sens propre : Il se protégeait (de la pluie) avec un sac trempé, qui ne protège de rien."
        },
        {
          q: "mordait en riant",
          r: "<p><b>Sens propre :</b> Il mordait tout en riant.</p><p><b>Sens figuré :</b> Il faisait un reproche mordant en plaisantant (note 4).</p>",
          bonne: "Il faisait un reproche mordant en plaisantant (note 4).",
          exp: "Sens propre : Il mordait tout en riant."
        },
        {
          q: "crachait souvent dans la sébile",
          r: "<p><b>Sens propre :</b> Il crachait dans la coupe où l'on met les aumônes.</p><p><b>Sens figuré :</b> Il donnait de l'argent à la quête (note 5).</p>",
          bonne: "Il donnait de l'argent à la quête (note 5).",
          exp: "Sens propre : Il crachait dans la coupe où l'on met les aumônes."
        },
        {
          q: "battait froid",
          r: "<p><b>Sens propre :</b> Il battait le fer froid, comme un mauvais forgeron.</p><p><b>Sens figuré :</b> Il agissait à contretemps : « il faut battre le fer quand il est chaud » (note 6).</p>",
          bonne: "Il agissait à contretemps : « il faut battre le fer quand il est chaud » (note 6).",
          exp: "Sens propre : Il battait le fer froid, comme un mauvais forgeron."
        },
        {
          q: "écorchait le renard",
          r: "<p><b>Sens propre :</b> Il dépouillait un renard de sa peau.</p><p><b>Sens figuré :</b> Il vomissait, car ce travail donne la nausée (note 7).</p>",
          bonne: "Il vomissait, car ce travail donne la nausée (note 7).",
          exp: "Sens propre : Il dépouillait un renard de sa peau."
        },
        {
          q: "disait la patenôtre du singe",
          r: "<p><b>Sens propre :</b> Il récitait le Notre Père comme un singe.</p><p><b>Sens figuré :</b> Il remuait les babines, marmonnait des paroles indistinctes (note 8).</p>",
          bonne: "Il remuait les babines, marmonnait des paroles indistinctes (note 8).",
          exp: "Sens propre : Il récitait le Notre Père comme un singe."
        },
        {
          q: "menait les truies au foin",
          r: "<p><b>Sens propre :</b> Il conduisait les truies au foin, qu'elles ne mangent pas.</p><p><b>Sens figuré :</b> Il changeait de propos (note 9).</p>",
          bonne: "Il changeait de propos (note 9).",
          exp: "Sens propre : Il conduisait les truies au foin, qu'elles ne mangent pas."
        },
        {
          q: "revenait à ses moutons",
          r: "<p><b>Sens propre :</b> Il retournait voir ses moutons.</p><p><b>Sens figuré :</b> Il revenait à son sujet.</p>",
          bonne: "Il revenait à son sujet.",
          exp: "Sens propre : Il retournait voir ses moutons."
        },
        {
          q: "battait le chien devant le lion",
          r: "<p><b>Sens propre :</b> Il frappait le chien sous les yeux du lion.</p><p><b>Sens figuré :</b> Il châtiait un petit devant un puissant, à qui la leçon est destinée (note 10).</p>",
          bonne: "Il châtiait un petit devant un puissant, à qui la leçon est destinée (note 10).",
          exp: "Sens propre : Il frappait le chien sous les yeux du lion."
        },
        {
          q: "mettait la charrue avant les bœufs",
          r: "<p><b>Sens propre :</b> Il attelait la charrue devant les bœufs.</p><p><b>Sens figuré :</b> Il faisait les choses dans le mauvais ordre.</p>",
          bonne: "Il faisait les choses dans le mauvais ordre.",
          exp: "Sens propre : Il attelait la charrue devant les bœufs."
        },
        {
          q: "ferrait les cigales",
          r: "<p><b>Sens propre :</b> Il mettait des fers aux cigales.</p><p><b>Sens figuré :</b> Il tentait l'impossible (note 11).</p>",
          bonne: "Il tentait l'impossible (note 11).",
          exp: "Sens propre : Il mettait des fers aux cigales."
        },
        {
          q: "faisait chanter Magnificat à matines",
          r: "<p><b>Sens propre :</b> Il faisait chanter le Magnificat à l'office du matin.</p><p><b>Sens figuré :</b> Il faisait les choses au mauvais moment : le Magnificat se chante le soir (note 12).</p>",
          bonne: "Il faisait les choses au mauvais moment : le Magnificat se chante le soir (note 12).",
          exp: "Sens propre : Il faisait chanter le Magnificat à l'office du matin."
        },
        {
          q: "ratissait le papier",
          r: "<p><b>Sens propre :</b> Il raclait le papier.</p><p><b>Sens figuré :</b> Il faisait une chose absurde : c'est le parchemin qu'on racle (note 14).</p>",
          bonne: "Il faisait une chose absurde : c'est le parchemin qu'on racle (note 14).",
          exp: "Sens propre : Il raclait le papier."
        },
        {
          q: "comptait sans son hôte",
          r: "<p><b>Sens propre :</b> Il faisait ses comptes sans l'aubergiste.</p><p><b>Sens figuré :</b> Il se trompait dans ses prévisions et s'exposait à une déconvenue (note 15).</p>",
          bonne: "Il se trompait dans ses prévisions et s'exposait à une déconvenue (note 15).",
          exp: "Sens propre : Il faisait ses comptes sans l'aubergiste."
        }
      ]
    },
    {
      type: "corrige",
      texte: "rab11",
      titre: "LIRE 2 : fantaisie verbale et petite enfance",
      consigne: "« Quels rapports établissez-vous entre cette fantaisie verbale et le thème de la petite enfance ? Quel regard Rabelais pose-t-il sur celle-ci ? »",
      bouton: "Voir le corrigé modèle",
      html: "<p><b>Corrigé modèle.</b> La fantaisie verbale imite la manière dont un petit enfant découvre le langage : il prend les mots <b>au pied de la lettre</b>, confond sens propre et sens figuré, et fait réellement ce que les adultes disent en images. Les expressions sont toutes à l'<b>envers</b> ou à contretemps (« se cachait dans l'eau pour éviter la pluie », « mordait en riant, riait en mordant ») : c'est la logique d'un enfant qui n'a pas encore appris l'ordre du monde.</p><p>Le <b>regard de Rabelais</b> est double. Il est <b>amusé et tendre</b> : il célèbre la vitalité du corps, le jeu, le rire. Mais il est aussi <b>ironique et satirique</b> (noté en cours) : cet enfant laissé à ses instincts vit comme un petit animal (il mange avec les chiens). L'accumulation rend visible le besoin d'une éducation méthodique, qui viendra avec Ponocrates.</p>"
    },
    {
      type: "association",
      texte: "rab11",
      titre: "DIRE : version originale et adaptation",
      consigne: "Associe chaque expression du texte original (1535) à sa version modernisée (Guy Demerson, 1973).",
      paires: [
        ["troys", "trois", "Orthographe : y à la place de i"],
        ["feut nourry et institué", "fut élevé et éduqué", "Vocabulaire : « nourrir » = élever, « instituer » = éduquer"],
        ["celluy temps", "ce temps-là", "Orthographe (double l, y) et démonstratif ancien"],
        ["les petitz enfans du pays", "tous les petits enfants du pays", "Orthographe : z du pluriel, « enfans » sans t"],
        ["c'est assavoir", "autrement dit", "Locution disparue"],
        ["se vaultroit par les fanges", "se vautrait dans la fange", "Lettre étymologique (l de « vaultrer ») et imparfait en -oit"],
        ["se mascaroyt le nez", "se mâchurait le nez", "Mot disparu (mascarer = barbouiller de noir)"],
        ["se chauffouroit le visaige", "se barbouillait la figure", "Mot disparu ; « visaige » : orthographe ancienne"],
        ["baisloit souvent au mousches", "bayait souvent aux mouches", "Graphie ancienne et préposition « au » pour « aux »"],
        ["couroit voulentiers après les parpaillons", "aimait à courir après les papillons", "Mot disparu : parpaillon = papillon"],
        ["desquelz son pere tenoit l'empire", "sur lesquels régnait son père", "Tournure et syntaxe anciennes ; pas d'accent sur « pere »"],
        ["Il pissoit sus ses souliers", "Il pissait sur ses chaussures", "Préposition « sus » = sur ; imparfait en -oit"],
        ["il se mouschoyt à ses manches", "se mouchait sur sa manche", "Lettre muette s (mouscher) ; préposition « à »"],
        ["il mourvoit dedans sa souppe", "reniflait dans sa soupe", "Mot disparu (mourver, de « morve ») ; « dedans » = dans"],
        ["beuvoit en sa pantoufle", "buvait dans sa pantoufle", "Préposition « en » = dans ; forme verbale ancienne"],
        ["se frottoit ordinairement le ventre d'un panier", "se frottait couramment le ventre avec un panier", "Préposition « de » = avec"]
      ],
      suite: {
        titre: "Plan de l'exposé (DIRE)",
        html: "<p><b>Pour l'exposé (DIRE)</b>, classe les écarts en trois familles :</p><ol><li><b>Orthographe</b> : <em>y</em> au lieu de <em>i</em> (troys, boyre), <em>z</em> du pluriel (petitz, desquelz), <b>lettres étymologiques</b> (vaultroit, mouscher), imparfaits en <em>-oit</em> (devenus <em>-ait</em>), accents absents (pere).</li><li><b>Vocabulaire disparu ou qui a changé de sens</b> : mascarer, chauffourer, parpaillons, mourver ; nourrir = élever, instituer = éduquer.</li><li><b>Syntaxe et prépositions</b> : « sus » (sur), « en » (dans), « à ses manches », « d'un panier » (avec), ordre des mots (« desquelz son pere tenoit l'empire »).</li></ol><p>Conclusion : le moyen français du XVIe siècle est déjà proche du nôtre, mais son orthographe n'est pas fixée ; l'adaptation de Guy Demerson modernise l'orthographe et remplace les mots disparus, au prix de quelques jeux de sonorités.</p>"
      }
    },
    {
      type: "questions",
      texte: "peg",
      titre: "Les trois questions de la feuille",
      items: [
        ["1. Relevez tous les éléments qui présentent les instituteurs sous un jour positif.", "<ul><li><b>Beauté et allure</b> : « beaux comme des hussards noirs », « Sveltes ; sévères ; sanglés », « la ligne elle-même ».</li><li><b>Qualités morales</b> : « Sérieux », « la sévérité », et même l'humilité : « un peu tremblants de leur précoce, de leur soudaine omnipotence ».</li><li><b>Prestige de l'uniforme</b> : « Rien n'est beau comme un bel uniforme noir parmi les uniformes militaires », palmes violettes (couleur des évêques).</li><li><b>Jeunesse et civisme</b> : « jeunes maîtres », « enfants de la République », « jeunes hussards de la République », « nourrissons de la République », « dépôt […] de jeunesse et de civisme ».</li><li><b>Courage et prestige du hussard</b> (encadré) : le cavalier courageux, défenseur de la patrie.</li></ul>"],
        ["2. Délimitez la partie descriptive consacrée à l'uniforme et expliquez pourquoi Péguy s'y attarde.", "<p><b>Délimitation</b> : de « Un long pantalon noir » (l. 3) à « un uniforme civique » (l. 10).</p><p><b>Pourquoi</b> : l'uniforme est un <b>symbole</b>. Le noir dit la sévérité et la sobriété ; le violet, « couleur des évêques » et « de l'enseignement primaire », fait de l'école une nouvelle autorité morale, presque sacrée ; l'uniforme « civique », plus sévère qu'un uniforme militaire, montre que servir la République par l'instruction est une mission exigeante. La description traduit aussi le regard ébloui de l'enfant de 1880 et fixe le souvenir en <b>image mythique</b>.</p>"],
        ["3. Quelle figure de style est utilisée à plusieurs reprises à partir de la ligne 10 ? Quelle est la fonction de la description ?", "<p><b>Figure</b> : l'<b>anaphore</b> de « Par ces… » (« Par ces gamins… Par ces jeunes hussards de la République. Par ces nourrissons de la République. »), qui porte des <b>métaphores de la filiation</b> : la République est personnifiée en mère, les instituteurs sont ses enfants, ses nourrissons (et ses soldats : « hussards »).</p><p><b>Fonction de la description</b> : elle n'est pas neutre ni seulement informative ; elle est <b>argumentative</b> : c'est un <b>éloge</b> (registre épidictique) qui glorifie les instituteurs et construit le <b>mythe républicain</b> des hussards noirs, pour susciter admiration et respect envers l'école de la République.</p>"]
      ]
    },
    {
      type: "corrige",
      texte: "peg",
      titre: "Vers le bac : plan détaillé",
      bouton: "Quels rôles jouent les mythes dans le respect que nous vouons aux institutions ?",
      ouvert: true,
      html: "<p><b>Sujet</b> : Quels rôles jouent les mythes dans le respect que nous vouons aux institutions ?</p><p><b>Introduction</b> : un <b>mythe</b> est un récit ou une image collective qui donne un sens et une valeur à une réalité (ici, les « hussards noirs »). Une <b>institution</b> (l'école, la justice, la République) n'est qu'une organisation abstraite : pourquoi la respectons-nous ? Problématique : les mythes fondent-ils un respect légitime, ou un respect aveugle ?</p><p><b>I. Les mythes donnent un visage aux institutions</b><br>a) Ils incarnent l'abstraction : la République devient une mère, ses maîtres des soldats en uniforme (Péguy), l'école un « sanctuaire » (Hugo).<br>b) Ils racontent une origine glorieuse et une mission : l'école qui « gagne » des hommes, qui arrache au crime.</p><p><b>II. Ils suscitent l'adhésion et le respect</b><br>a) Par l'émotion et l'admiration : éloge, nostalgie, beauté de l'uniforme ; le respect naît de l'identification.<br>b) Par une forme de sacré laïque : rites, symboles, uniformes ; ils créent une communauté (« nos jeunes maîtres ») et donnent aux maîtres une autorité (Arendt : l'éducation a besoin d'autorité).</p><p><b>III. Mais un respect fondé sur le seul mythe peut être aveugle</b><br>a) Le mythe idéalise et cache la réalité : l'école a aussi humilié (Balzac, Flaubert) ; l'école « neutre » de Ferry transmettait une idéologie (valeurs républicaines, discours colonial de 1885).<br>b) Un respect durable doit aussi reposer sur la raison et la justice : connaître le mythe comme mythe, juger l'institution sur ses actes (esprit critique des Lumières ; Diderot : pas de justice sans lumières).</p><p><b>Conclusion</b> : les mythes jouent un rôle réel (fonder, incarner, unir), mais le respect légitime d'une institution demande aussi un regard lucide ; l'école elle-même doit apprendre à distinguer le mythe de la réalité.</p>"
    }
  ],

  /* =====================================================================
     SCHÉMAS PROPRES À CE CHAPITRE : définis en haut du fichier (SCHEMAS)
     ===================================================================== */
  schemas: SCHEMAS,

  /* =====================================================================
     SOURCES : [groupe, libellé, url]
     ===================================================================== */
  sources: [
    ["Rabelais", "Université de Tours, Renom : Gargantua (1534)", "https://renom.univ-tours.fr/fr/index/corpus/francois-rabelais/gargantua-1534"],
    ["Rabelais", "HAL, M.-L. Demonet, Gargantua, Lyon, F. Juste, 1534", "https://hal.science/halshs-01224990"],
    ["Rabelais", "Wikipédia (en), François Rabelais", "https://en.wikipedia.org/wiki/Fran%C3%A7ois_Rabelais"],
    ["Rabelais", "Archives de Lyon, « Lyon, les années Rabelais »", "https://www.archives-lyon.fr/expos/lyon-les-annees-rabelais"],
    ["Rabelais", "Renom, Pantagruel ch. 8 (lettre de Gargantua)", "https://renom.univ-tours.fr/fr/index/corpus/francois-rabelais/pantagruel-1542/comment-pantagruel-estant-paris-receut-letres-de-son-pere-gargantua-et-la-copie-d-icelles-chapitre"],
    ["Rabelais", "Wikipédia, Abbaye de Thélème", "https://fr.wikipedia.org/wiki/Abbaye_de_Th%C3%A9l%C3%A8me"],
    ["Rousseau", "Des Lettres : lettre de Voltaire à Rousseau (30 août 1755)", "https://www.deslettres.fr/lettre-voltaire-jean-jacques-rousseau-il-prend-envie-marcher-quatre-pattes-on-lit-ouvrage/"],
    ["Rousseau", "Wikipédia (en), Discourse on Inequality", "https://en.wikipedia.org/wiki/Discourse_on_Inequality"],
    ["Rousseau", "Wikipédia, Bon sauvage", "https://fr.wikipedia.org/wiki/Bon_sauvage"],
    ["Rousseau", "Archives d'État de Genève : condamnation de l'Émile (1762)", "https://ge.ch/archives/15-condamnation-de-lemile-contrat-social-1761-1762"],
    ["Rousseau", "SIAM, « Un paradoxe : Rousseau et ses enfants »", "https://jjrousseau.net/2021/05/29/un-paradoxe-rousseau-et-ses-enfants/"],
    ["Balzac", "Wikipédia (en), Louis Lambert (novel)", "https://en.wikipedia.org/wiki/Louis_Lambert_(novel)"],
    ["Balzac", "Wikipédia, Louis Lambert (roman)", "https://fr.wikipedia.org/wiki/Louis_Lambert_(roman)"],
    ["Balzac", "Maison de Balzac, notice Furne de Louis Lambert", "https://www.maisondebalzac.paris.fr/vocabulaire/furne/notices/louis_lambert.htm"],
    ["Flaubert", "Centre Flaubert (Rouen), le procès de Madame Bovary", "https://flaubert.univ-rouen.fr/qui-%C3%A9tait-flaubert/dossiers-documentaires/une-carri%C3%A8re-d%C3%A9crivain/rapports-de-censure/le-proces-bovary/le-proces-de-madame-bovary-29-janvier-7-fevrier-1857"],
    ["Flaubert", "Centre Flaubert, « Madame Bovary, c'est moi », formule apocryphe", "https://flaubert.univ-rouen.fr/labo-flaubert/ressources-par-%C5%93uvre/madame-bovary/madame-bovary-cest-moi-formule-apocryphe/"],
    ["Flaubert", "Gallica, Madame Bovary suivi du réquisitoire et du jugement", "https://gallica.bnf.fr/ark:/12148/bpt6k857104k"],
    ["Flaubert", "BnF Essentiels, Madame Bovary", "https://essentiels.bnf.fr/fr/article/051ace42-93bd-498e-a281-0b8870429c40-madame-bovary"],
    ["Flaubert", "Wikipédia (en), Quos ego", "https://en.wikipedia.org/wiki/Quos_ego"],
    ["Hugo", "Wikisource, « Écrit après la visite d'un bagne »", "https://fr.wikisource.org/wiki/Les_Quatre_Vents_de_l%E2%80%99esprit/Le_Livre_satirique/%C3%89crit_apr%C3%A8s_la_visite_d%E2%80%99un_bagne"],
    ["Hugo", "Sénat, « Le Sénateur 1876-1885 »", "https://www.senat.fr/connaitre-le-senat/lhistoire-du-senat/dossiers-dhistoire/bicentenaire-de-la-naissance-de-victor-hugo/le-senateur-1876-1885.html"],
    ["Hugo", "Guichet du savoir (BM Lyon), « Ouvrir une école… »", "https://www.guichetdusavoir.org/question/voir/31966"],
    ["Hugo", "Wikipédia, Funérailles de Victor Hugo", "https://fr.wikipedia.org/wiki/Fun%C3%A9railles_de_Victor_Hugo"],
    ["Ferry", "Académie de Paris, Lettre aux instituteurs (17 novembre 1883)", "https://pia.ac-paris.fr/portail/jcms/p2_4537443/lettre-aux-instituteurs-jules-ferry-17-novembre-1883"],
    ["Ferry", "Clio Texte, texte intégral de la lettre", "https://clio-texte.clionautes.org/lettre-jules-ferry-aux-instituteurs.html"],
    ["Ferry", "Sénat, Les lois scolaires de Jules Ferry", "https://www.senat.fr/connaitre-le-senat/lhistoire-du-senat/dossiers-dhistoire/les-lois-scolaires-de-jules-ferry/dossier-dhistoire-les-lois-scolaires-de-jules-ferry.html"],
    ["Ferry", "Vie-publique.fr, les lois Ferry de 1881 et 1882", "https://www.vie-publique.fr/fiches/293492-ecole-les-lois-ferry-de-1881-et-1882"],
    ["Ferry", "Assemblée nationale, discours du 28 juillet 1885", "https://www2.assemblee-nationale.fr/decouvrir-l-assemblee/histoire/grands-discours-parlementaires/jules-ferry-28-juillet-1885"],
    ["Péguy", "Wikipédia (en), Charles Péguy", "https://en.wikipedia.org/wiki/Charles_P%C3%A9guy"],
    ["Péguy", "Chemins de mémoire, Charles Péguy", "https://www.cheminsdememoire.gouv.fr/index.php/en/charles-peguy"],
    ["Péguy", "Wikisource, L'Argent", "https://fr.wikisource.org/wiki/L%E2%80%99Argent_(P%C3%A9guy)"],
    ["Péguy", "Clio Texte, Les hussards noirs de la République", "https://clio-texte.clionautes.org/hussards-noirs-de-la-republique.html"],
    ["Camus", "Larousse, Albert Camus", "https://www.larousse.fr/encyclopedie/personnage/Albert_Camus/111047"],
    ["Camus", "Gallimard, « Échange autour d'un prix Nobel »", "https://www.gallimard.fr/actualites-entretiens/echange-autour-d-un-prix-nobel"],
    ["Camus", "Wikipédia (en), The First Man", "https://en.wikipedia.org/wiki/The_First_Man"],
    ["Camus", "Éditions Soleil, Paroles d'école (Jean-Pierre Guéno, 2013)", "https://www.editions-soleil.fr/bd/series/serie-paroles-d-ecole/album-paroles-d-ecole"],
    ["Camus", "Prévert, « En sortant de l'école »", "https://www.lapoesie.org/jacques-prevert/en-sortant-de-lecole/"],
    ["Arendt", "Wikipédia, La Crise de la culture", "https://fr.wikipedia.org/wiki/La_Crise_de_la_culture"],
    ["Arendt", "UB Heidelberg : conférence de Brême, 13 mai 1958", "https://katalog.ub.uni-heidelberg.de/cgi-bin/titel.cgi?katkey=36115246"],
    ["Arendt", "Gallimard, La Crise de la culture (Folio essais)", "https://www.gallimard.fr/catalogue/la-crise-de-la-culture-prepas-scientifiques-2023-2024/9782070325030"],
    ["Arendt", "Gedenkstätte Deutscher Widerstand, biographie", "https://www.gdw-berlin.de/en/recess/biographies/index-of-persons/biographie/view-bio/hannah-arendt/"],
    ["Arendt", "The Conversation, « L'école selon Hannah Arendt »", "https://theconversation.com/lecole-selon-hannah-arendt-penser-la-crise-de-leducation-173854"]
  ]
});

})();
