"""Build the master timeline from the voice-over.

- places every chosen line (audio/voice/lines/<ID>.wav) at its slot;
- aligns script words with Whisper word timestamps (difflib), interpolating
  the rare unmatched words;
- exports named sync marks used by the animation, the SFX and the music:
  source/data/cues.js  and  logs/timeline.json

Slots come from scripts/voice/lines.json ('at'), optionally overridden by
scripts/timeline_edit.json (the editor's fine-tuning).
"""
import difflib
import json
import re
import sys
import unicodedata
from pathlib import Path

import soundfile as sf

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
from voice_metrics import transcribe  # noqa: E402

LINES = ROOT / "scripts" / "voice" / "lines.json"
EDIT = ROOT / "scripts" / "timeline_edit.json"
OUT_JS = ROOT / "source" / "data" / "cues.js"
OUT_JSON = ROOT / "logs" / "timeline.json"
VO_DIR = ROOT / "audio" / "voice" / "processed"

SHUTTER_AFTER = 1.85  # s entre « Mais où ? » et le déclic (v6 : +0,35 s pour que le viseur recule avant le déclic, au lieu d’un saut)
CAPTURE_AFTER = 2.4   # s entre la fin de la dernière réplique et le déclic final (adresse lisible ~2 s)
END_TAIL = 6.35       # s après la dernière réplique (Polaroid final + fondu : 3,95 s après le déclic, comme en v1)

# alias -> (line, word of the script, occurrence)  | "start"/"end" of a line
ALIASES = {
    "n1": ("V01", "@part", 0), "n2": ("V01", "@part", 1), "n3": ("V01", "@part", 2), "n4": ("V01", "@part", 3),
    "q_start": ("V02", "start", 0), "q_souviens": ("V02", "souviens", 0), "q_tout": ("V02", "tout", 0), "q_end": ("V02", "end", 0),
    "v3_start": ("V03", "start", 0), "v3_rentree": ("V03", "rentrée", 0), "v3_textes": ("V03", "textes", 0),
    "v3_accum": ("V03", "accumulent", 0), "v3_end": ("V03", "end", 0),
    "v4_feuilles": ("V04", "feuilles", 0), "v4_notes": ("V04", "notes", 0), "v4_citations": ("V04", "citations", 0), "v4_end": ("V04", "end", 0),
    "v5_tout": ("V05a", "tout", 0), "v5_part": ("V05a", "part", 0), "v5_mais": ("V05b", "mais", 0), "v5_ou": ("V05b", "où", 0), "v5_end": ("V05b", "end", 0),
    "v6_start": ("V06", "start", 0), "v6_tout": ("V06", "tout", 0), "v6_rassemble": ("V06", "rassemblé", 0), "v6_end": ("V06", "end", 0),
    "v7_start": ("V07", "start", 0), "v7_cahier": ("V07", "cahier", 0), "v7_hlp": ("V07", "hlp", 0), "v7_end": ("V07", "end", 0),
    "v8_start": ("V08", "start", 0), "v8_texte": ("V08", "texte", 0), "v8_classe": ("V08", "classe", 0), "v8_fiche": ("V08", "fiche", 0),
    "v8_auteur": ("V08", "auteur", 0), "v8_epoque": ("V08", "époque", 0), "v8_essentiel": ("V08", "essentiel", 0),
    "v8_cinq": ("V08", "cinq", 0), "v8_citations": ("V08", "citations", 0), "v8_retenir": ("V08", "retenir", 0), "v8_end": ("V08", "end", 0),
    "v9_start": ("V09", "start", 0), "v9_flash": ("V09", "flashcards", 0), "v9_reviennent": ("V09", "reviennent", 0),
    "v9_moment": ("V09", "moment", 0), "v9_end": ("V09", "end", 0),
    "v10_start": ("V10", "start", 0), "v10_qcm": ("V10", "qcm", 0), "v10_corriges": ("V10", "corrigés", 0),
    "v10_expliques": ("V10", "expliqués", 0), "v10_end": ("V10", "end", 0),
    "v11_start": ("V11", "start", 0), "v11_frise": ("V11", "frise", 0), "v11_relier": ("V11", "relier", 0),
    "v11_oeuvres": ("V11", "œuvres", 0), "v11_rabelais": ("V11", "rabelais", 0), "v11_arendt": ("V11", "arendt", 0), "v11_end": ("V11", "end", 0),
    "v12_start": ("V12", "start", 0), "v12_gratuit": ("V12", "gratuit", 0), "v12_compte": ("V12", "compte", 0),
    "v12_progression": ("V12", "progression", 0), "v12_appareil": ("V12", "appareil", 0), "v12_end": ("V12", "end", 0),
    "v13_start": ("V13", "start", 0), "v13_tg1": ("V13", "tg1", 0), "v13_classe": ("V13", "classe", 0), "v13_end": ("V13", "end", 0),
    "v14_start": ("V14", "start", 0), "v14_cahier": ("V14", "cahier", 0), "v14_tout": ("V14", "tout", 0),
    "v14_reviser": ("V14", "réviser", 0), "v14_endroit": ("V14", "endroit", 0), "v14_end": ("V14", "end", 0),
}


def norm(w):
    w = w.lower().replace("’", "'")
    w = unicodedata.normalize("NFC", w)
    w = re.sub(r"[«»\"“”…\.,;:!\?\(\)–—]", "", w)
    return w.strip("-' ")


NUM = {"5": "cinq", "1": "un"}


def tokens(text):
    out = []
    for raw in text.replace("’", "'").split():
        for part in re.split(r"(?<=')", raw):   # l'auteur -> l' + auteur
            n = norm(part)
            if n:
                out.append(n)
    return out


def hyp_tokens(words):
    out = []
    for w in words:
        parts = [p for p in re.split(r"(?<=')", w["w"].replace("’", "'")) if norm(p)]
        n = max(1, len(parts))
        for k, p in enumerate(parts or [w["w"]]):
            t0 = w["t0"] + (w["t1"] - w["t0"]) * k / n
            t1 = w["t0"] + (w["t1"] - w["t0"]) * (k + 1) / n
            tok = norm(p)
            tok = NUM.get(tok, tok)
            if tok in ("q", "c", "m") or tok == "qcm":
                tok = "qcm"
            if tok == "dqcm":                  # v7 : Whisper colle « Des » à « QCM »
                cut = t0 + (t1 - t0) * 0.3
                out.append({"tok": "des", "t0": t0, "t1": cut})
                t0, tok = cut, "qcm"
            out.append({"tok": tok, "t0": t0, "t1": t1})
    # merge "q c m" split
    merged = []
    for h in out:
        if merged and h["tok"] == "qcm" and merged[-1]["tok"] == "qcm":
            merged[-1]["t1"] = h["t1"]
        else:
            merged.append(h)
    return merged


def key(w):
    """Clé insensible aux homophones que Whisper confond (« corrigés »/« corrigé », « pensé »/« pensez »)."""
    w = unicodedata.normalize("NFD", w)
    w = "".join(c for c in w if unicodedata.category(c) != "Mn")
    w = re.sub(r"(ez|er)$", "e", w)
    return w[:-1] if len(w) > 3 and w.endswith("s") else w


def align(ref, hyp):
    """Return [(t0,t1)] per ref token."""
    ref_n = [key(r) for r in ref]
    sm = difflib.SequenceMatcher(a=ref_n, b=[key(h["tok"]) for h in hyp], autojunk=False)
    times = [None] * len(ref)
    for tag, i1, i2, j1, j2 in sm.get_opcodes():
        if tag == "equal" or (tag == "replace" and (i2 - i1) == (j2 - j1)):
            for k in range(i2 - i1):
                times[i1 + k] = (hyp[j1 + k]["t0"], hyp[j1 + k]["t1"])
        elif tag == "replace" and j2 > j1:
            a, b = hyp[j1]["t0"], hyp[j2 - 1]["t1"]
            n = i2 - i1
            for k in range(n):
                times[i1 + k] = (a + (b - a) * k / n, a + (b - a) * (k + 1) / n)
    # interpolate holes
    for i in range(len(times)):
        if times[i] is None:
            prev = next((times[j][1] for j in range(i - 1, -1, -1) if times[j]), 0.0)
            nxt = next((times[j][0] for j in range(i + 1, len(times)) if times[j]), prev + 0.3)
            times[i] = (prev, max(prev + 0.05, nxt))
    return times


def main(model="small"):
    global DURATION
    spec = json.loads(LINES.read_text())
    edit = json.loads(EDIT.read_text()) if EDIT.exists() else {}
    placed, marks = [], {}
    marks_tmp = {}
    prev_end = 0.0
    proc = json.loads((VO_DIR / "processing.json").read_text()) if (VO_DIR / "processing.json").exists() else {}
    for line in spec["lines"]:
        lid = line["id"]
        at = edit.get(lid, line["at"])
        ref = tokens(line["text"])
        wav = VO_DIR / f"{lid}.wav"
        info = sf.info(str(wav))
        dur = info.frames / info.samplerate
        if isinstance(at, str) and at.startswith("+"):
            at = prev_end + float(at[1:])
        elif isinstance(at, str) and at.startswith("@shutter"):
            at = marks_tmp["v5_end"] + SHUTTER_AFTER + float(at[len("@shutter"):] or 0)
        at = float(at)
        if line.get("onset"):                          # l'attaque du mot tombe pile sur « at »
            y, sr = sf.read(str(wav), always_2d=True)
            env = abs(y.mean(1))
            at -= float((env > env.max() * 0.08).argmax()) / sr
        _, words = transcribe(str(wav), model=model)
        hyp = hyp_tokens(words)
        for h in hyp:
            if h["tok"] in ("tg1", "tgi", "tg"):
                h["tok"] = "tg1"
            h["tok"] = h["tok"].replace("oe", "œ") if h["tok"].startswith("oeuvre") else h["tok"]
        tt = align(ref, hyp)
        if line.get("split"):
            # segments placés l'un après l'autre avec les écarts demandés ; les mots suivent leur segment
            cuts = proc[lid]["cuts_s"]
            edges = [0.0] + cuts + [dur]
            gaps = line.get("gaps", [0.0] * len(cuts))
            onsets = line.get("onsets")                # attaque de chaque segment à un instant donné (les noms du hook)
            segs, starts, t = [], [], at
            for k in range(len(edges) - 1):
                f = VO_DIR / f"{lid}_{k + 1}.wav"
                d = sf.info(str(f)).frames / sf.info(str(f)).samplerate
                if onsets:
                    y, sr = sf.read(str(f), always_2d=True)
                    env = abs(y.mean(1))
                    t = onsets[k] - float((env > env.max() * 0.08).argmax()) / sr
                segs.append({"file": str(f.relative_to(ROOT)), "at": round(t, 3), "dur": round(d, 3)})
                starts.append(t)
                t += d + (gaps[k] if k < len(gaps) else 0.0)
            def place(x):
                k = max(i for i in range(len(edges) - 1) if x >= edges[i] - 1e-6)
                return starts[k] + (x - edges[k])
            wl = [{"w": r, "t0": round(place(a), 3), "t1": round(place(b), 3)} for r, (a, b) in zip(ref, tt)]
            end = segs[-1]["at"] + segs[-1]["dur"]
        else:
            segs = [{"file": str(wav.relative_to(ROOT)), "at": round(at, 3), "dur": round(dur, 3)}]
            end = at + dur
            # mots bornés au fichier (Whisper étire parfois le dernier mot d'une réplique courte)
            wl = [{"w": r, "t0": round(min(at + a, end), 3), "t1": round(min(at + b, end), 3)} for r, (a, b) in zip(ref, tt)]
        placed.append({"id": lid, "text": line["text"], "onsets": line.get("onsets") or ([float(line["at"])] if line.get("onset") else None), "at": round(segs[0]["at"], 3), "dur": round(end - segs[0]["at"], 3),
                       "end": round(end, 3), "words": wl, "segments": segs})
        prev_end = wl[-1]["t1"]
        if lid in ("V05", "V05b"):     # fin de « Mais où ? »
            marks_tmp["v5_end"] = wl[-1]["t1"]
    by = {p["id"]: p for p in placed}
    # speech start/end = first/last word (not file edges)
    for alias, (lid, word, occ) in ALIASES.items():
        p = by[lid]
        if word == "@part":
            marks[alias] = p["onsets"][occ]
        elif word == "start":
            marks[alias] = p["words"][0]["t0"]
        elif word == "end":
            marks[alias] = p["words"][-1]["t1"]
        else:
            hits = [w for w in p["words"] if w["w"] == norm(word)]
            if len(hits) <= occ:
                raise SystemExit(f"alias {alias}: '{word}' introuvable dans {lid}: {[w['w'] for w in p['words']]}")
            marks[alias] = hits[occ]["t0"]
    # derived marks
    marks["shutter"] = round(marks["v5_end"] + SHUTTER_AFTER, 3)   # le déclic, après la recherche du viseur
    DURATION = round(marks["v14_end"] + END_TAIL, 2)
    marks["capture"] = round(marks["v14_end"] + CAPTURE_AFTER, 3)
    marks["end"] = DURATION
    # overlaps check (entre répliques, et entre segments d'une même réplique découpée)
    for p in placed:
        for a, b in zip(p["segments"], p["segments"][1:]):
            if b["at"] < a["at"] + a["dur"] - 0.03:
                print(f"ATTENTION segments de {p['id']} qui se chevauchent : {a['at'] + a['dur']:.2f} > {b['at']:.2f}")
    for a, b in zip(placed, placed[1:]):
        if b["at"] < a["end"] - 0.05:
            print(f"ATTENTION chevauchement {a['id']} ({a['end']:.2f}) / {b['id']} ({b['at']:.2f})")
    data = {"duration": DURATION, "lines": placed, "marks": {k: round(v, 3) for k, v in marks.items()}}
    OUT_JSON.parent.mkdir(parents=True, exist_ok=True)
    OUT_JSON.write_text(json.dumps(data, ensure_ascii=False, indent=1))
    OUT_JS.write_text("/* Généré par scripts/build_timeline.py : ne pas éditer à la main. */\nwindow.CUES = "
                      + json.dumps({"duration": DURATION, "marks": data["marks"],
                                    "lines": [{k: p[k] for k in ("id", "text", "at", "end", "words")} for p in placed]},
                                   ensure_ascii=False) + ";\n")
    for p in placed:
        print(f"{p['id']} {p['at']:6.2f} -> {p['end']:6.2f}  {p['text']}")
    print(json.dumps(data["marks"], ensure_ascii=False))


if __name__ == "__main__":
    main(*(sys.argv[1:2] or []))
