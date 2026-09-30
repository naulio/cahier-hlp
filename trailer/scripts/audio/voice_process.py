"""Voice-over processing: chosen takes -> broadcast-ready lines.

Chain per line: resample 48 kHz -> gentle Rubber Band time-stretch (calmer
pace, formants preserved) -> high-pass 80 Hz -> small EQ (less boom, a bit
of presence and air) -> compressor 3:1 -> level match on speech RMS.
Split lines (the names of the hook) are cut at their silences.

Output: audio/voice/processed/<ID>.wav  (+ <ID>_1..n.wav for split lines)
"""
import json
from pathlib import Path

import numpy as np
import soundfile as sf
from pedalboard import (Compressor, HighpassFilter, HighShelfFilter, LowShelfFilter, Pedalboard,
                        PeakFilter, PitchShift, time_stretch)

import lib

ROOT = lib.ROOT
SRC = ROOT / "audio" / "voice" / "lines"
OUT = ROOT / "audio" / "voice" / "processed"
OUT.mkdir(parents=True, exist_ok=True)
LINES = json.loads((ROOT / "scripts" / "voice" / "lines.json").read_text())
TAKES_LOG = json.loads((ROOT / "logs" / "voice_takes.json").read_text())

SPEED = {"default": 1.0, "V02": 0.88, "V05b": 0.9, "V14": 0.9}   # v6 : phrase finale un peu moins pressée   # v3 : débit naturel du narrateur, sans ralentissement (retour du commanditaire : « longue »)
TARGET_RMS_DB = -20.0

# v4 : voix B d'origine (sans demi-ton) — le décalage reste réglable par VOICE_SHIFT_ST ; égalisation légère (v1)
VOICE_SHIFT_ST = float(__import__("os").environ.get("VOICE_SHIFT_ST", 0.0))
chain = Pedalboard([
    HighpassFilter(cutoff_frequency_hz=80),
    LowShelfFilter(cutoff_frequency_hz=180, gain_db=-1.5),
    PeakFilter(cutoff_frequency_hz=320, gain_db=-1.5, q=1.0),
    PeakFilter(cutoff_frequency_hz=3200, gain_db=1.8, q=0.8),
    PeakFilter(cutoff_frequency_hz=7000, gain_db=-2.5, q=1.2),     # dé-essage doux (sibilantes)
    HighShelfFilter(cutoff_frequency_hz=9500, gain_db=1.2),
    Compressor(threshold_db=-22, ratio=3.0, attack_ms=6, release_ms=90),
])


def speech_rms_db(y):
    fr = int(lib.SR * 0.03)
    m = y.mean(1) if y.ndim == 2 else y
    r = np.sqrt(np.convolve(m ** 2, np.ones(fr) / fr, "same"))
    act = r[r > np.max(r) * 0.1]
    return 20 * np.log10(np.sqrt(np.mean(act ** 2)) + 1e-9)


def cut_points(y, n_parts, min_gap=0.06):
    """Sample indices where to cut a line into n parts: middle of its longest internal silences."""
    fr = int(lib.SR * 0.01)
    m = y.mean(1)
    r = np.sqrt(np.convolve(m ** 2, np.ones(fr) / fr, "same"))
    act = r > np.max(r) * 0.04
    gaps, i = [], 0
    while i < len(act):
        if not act[i]:
            j = i
            while j < len(act) and not act[j]:
                j += 1
            if (j - i) / lib.SR >= min_gap and i > 0 and j < len(act):
                gaps.append((i, j))
            i = j
        else:
            i += 1
    gaps = sorted(sorted(gaps, key=lambda g: g[1] - g[0], reverse=True)[: n_parts - 1])
    return [(a + b) // 2 for a, b in gaps]


def cut_points_words(y, n_parts, parts=None):
    """Cut between words (Whisper timestamps), at the quietest 10 ms inside each gap.
    parts: texts of the pieces (default: one word per piece). For lines read without
    real silences (the four names of the hook)."""
    import sys, tempfile
    sys.path.insert(0, str(ROOT / "scripts"))
    from voice_metrics import transcribe, norm_words
    with tempfile.NamedTemporaryFile(suffix=".wav") as tmp:
        sf.write(tmp.name, y, lib.SR)
        _, words = transcribe(tmp.name, "medium")
    fr = int(lib.SR * 0.01)
    m = y.mean(1)
    r = np.sqrt(np.convolve(m ** 2, np.ones(fr) / fr, "same"))
    if parts:
        lasts = [norm_words(p)[-1] for p in parts[:-1]]
    else:
        lasts = [None] * (n_parts - 1)
    cuts, j = [], 0
    for k, last in enumerate(lasts):
        if last is None:
            i = k
        else:
            i = next((q for q in range(j, len(words) - 1) if last in norm_words(words[q]["w"])), None)
            if i is None:
                raise SystemExit(f"découpe : « {last} » introuvable")
        if i + 1 >= len(words):
            raise SystemExit("découpe : pas assez de mots")
        a, b = words[i], words[i + 1]
        i0, i1 = int((a["t1"] - 0.04) * lib.SR), int((b["t0"] + 0.04) * lib.SR)
        i0, i1 = max(0, i0), min(len(r) - 1, max(i1, i0 + fr))
        cuts.append(i0 + int(np.argmin(r[i0:i1])))
        j = i + 1
    return cuts


def cap_pause(y, word, max_dur):
    """Shorten the silence after `word` to at most `max_dur` s (cut in the middle, 10 ms crossfade)."""
    import sys, tempfile
    sys.path.insert(0, str(ROOT / "scripts"))
    from voice_metrics import transcribe, norm_words
    with tempfile.NamedTemporaryFile(suffix=".wav") as tmp:
        sf.write(tmp.name, y, lib.SR)
        _, words = transcribe(tmp.name, "medium")
    k = next((i for i, w in enumerate(words[:-1]) if norm_words(word)[0] in norm_words(w["w"])), None)
    if k is None:
        print("  pause plafonnée : mot introuvable", word)
        return y
    fr = int(lib.SR * 0.01)
    m = y.mean(1)
    r = np.sqrt(np.convolve(m ** 2, np.ones(fr) / fr, "same"))
    # v6 : Whisper étire souvent la fin du mot sur le silence ; on cherche donc le plus long silence (niveau
    # d'énergie) entre le début du mot et la fin du mot suivant, au lieu de se fier à leurs bornes
    a, b = int((words[k]["t0"] + 0.1) * lib.SR), int(words[k + 1]["t1"] * lib.SR)
    q = np.concatenate([[0], (r[a:b] < r.max() * 0.03).astype(np.int8), [0]])
    edges = np.flatnonzero(np.diff(q))
    runs = list(zip(edges[::2], edges[1::2]))
    if not runs:
        print("  pause plafonnée : aucun silence trouvé après", word)
        return y
    r0, r1 = max(runs, key=lambda ab: ab[1] - ab[0])
    s0, s1 = a + r0, a + r1
    gap = (s1 - s0) / lib.SR
    if gap <= max_dur:
        print(f"  pause après « {word} » : {gap:.2f} s, déjà sous {max_dur:.2f} s")
        return y
    keep = int(max_dur * lib.SR)
    cut0, cut1 = s0 + keep // 2, s1 - keep // 2
    xf = fr
    head, tail = y[:cut0 + xf].copy(), y[cut1:].copy()
    ramp = np.linspace(1, 0, xf)[:, None]
    head[-xf:] = head[-xf:] * ramp + tail[:xf] * (1 - ramp)
    print(f"  pause après « {word} » : {gap:.2f} s → {max_dur:.2f} s")
    return np.concatenate([head, tail[xf:]])


def word_gain(y, word, gain_db):
    """v7 : remonte un mot qui s'éteint en fin de phrase (gain seul, fondus de 20 ms ; la hauteur ne change pas)."""
    import sys, tempfile
    sys.path.insert(0, str(ROOT / "scripts"))
    from voice_metrics import transcribe, norm_words
    with tempfile.NamedTemporaryFile(suffix=".wav") as tmp:
        sf.write(tmp.name, y, lib.SR)
        _, words = transcribe(tmp.name, "medium")
    hits = [w for w in words if norm_words(word)[0] in norm_words(w["w"])]
    if not hits:
        print("  gain de mot : mot introuvable", word)
        return y
    w = hits[-1]
    a, b = max(0, int((w["t0"] - 0.02) * lib.SR)), min(len(y), int((w["t1"] + 0.06) * lib.SR))
    g = np.ones(len(y), np.float32)
    r = int(0.02 * lib.SR)
    g[a:b] = lib.db(gain_db)
    g[a:a + r] = np.linspace(1, lib.db(gain_db), r)
    g[b - r:b] = np.linspace(lib.db(gain_db), 1, r)
    print(f"  « {word} » {gain_db:+.1f} dB ({w['t0']:.2f}-{w['t1']:.2f} s)")
    return (y * g[:, None]).astype(np.float32)


def span_gain(y, w0, w1, gain_db):
    """v8 : gain sur une suite de mots (du début de w0 à la fin de w1), fondus de 20 ms."""
    import sys, tempfile
    sys.path.insert(0, str(ROOT / "scripts"))
    from voice_metrics import transcribe, norm_words
    with tempfile.NamedTemporaryFile(suffix=".wav") as tmp:
        sf.write(tmp.name, y, lib.SR)
        _, words = transcribe(tmp.name, "medium")
    i0 = next((i for i, w in enumerate(words) if norm_words(w0)[0] in norm_words(w["w"])), None)
    i1 = next((i for i in range(len(words) - 1, -1, -1) if norm_words(w1)[0] in norm_words(words[i]["w"])), None)
    if i0 is None or i1 is None or i1 < i0:
        print("  gain de plage : mots introuvables", w0, w1)
        return y
    a, b = max(0, int((words[i0]["t0"] - 0.02) * lib.SR)), min(len(y), int((words[i1]["t1"] + 0.06) * lib.SR))
    g = np.ones(len(y), np.float32)
    r = int(0.02 * lib.SR)
    g[a:b] = lib.db(gain_db)
    g[a:a + r] = np.linspace(1, lib.db(gain_db), r)
    g[b - r:b] = np.linspace(lib.db(gain_db), 1, r)
    print(f"  « {w0} … {w1} » {gain_db:+.1f} dB")
    return (y * g[:, None]).astype(np.float32)


def insert_pause(y, word, dur):
    """Insert `dur` s of silence right after `word` (found with Whisper word timestamps)."""
    import sys, tempfile
    sys.path.insert(0, str(ROOT / "scripts"))
    from voice_metrics import transcribe, norm_words
    with tempfile.NamedTemporaryFile(suffix=".wav") as tmp:
        sf.write(tmp.name, y, lib.SR)
        _, words = transcribe(tmp.name, "medium")
    hit = next((w for w in words if norm_words(word)[0] in norm_words(w["w"])), None)
    if not hit:
        print("  pause: mot introuvable", word)
        return y
    # v9 : on insère au creux d'énergie du vrai silence qui suit le mot (Whisper rogne souvent la fin du mot),
    # avec des fondus de 10 ms : plus de mot coupé ni de clic
    i = words.index(hit)
    nxt = words[i + 1]["t0"] if i + 1 < len(words) else hit["t1"] + 0.3
    # v11 : on cherche le creux tout près de la fin du mot (−40 ms / +80 ms) : plus loin, on tombait dans
    # l'occlusion d'une consonne du mot suivant (« l'é…poque »)
    # on prend le plus long silence (seuil relatif : 30 dB sous le p90 de la réplique) entre −40 ms et +120 ms
    # autour de la fin du mot, et on insère en son milieu
    a, b = int(max(hit["t0"], hit["t1"] - 0.2) * lib.SR), int((hit["t1"] + 0.12) * lib.SR)   # v12 : Whisper finit parfois le mot après le silence
    fr = int(lib.SR * 0.01)
    r = np.sqrt(np.convolve(y.mean(1) ** 2, np.ones(fr) / fr, "same"))
    rdb = 20 * np.log10(r + 1e-9)
    thr = np.percentile(rdb[rdb > -80], 90) - 30
    q = np.concatenate([[0], (rdb[a:b] < thr).astype(np.int8), [0]])
    ed = np.flatnonzero(np.diff(q))
    runs = list(zip(ed[::2], ed[1::2]))
    runs = [ab for ab in runs if ab[1] - ab[0] >= int(0.04 * lib.SR)]   # v12 : un vrai silence, pas un creux de 10 ms
    if not runs:
        print(f"  pause après « {word} » refusée : aucun vrai silence après le mot")
        return y
    r0, r1 = max(runs, key=lambda ab: ab[1] - ab[0])
    k = a + (r0 + r1) // 2
    print(f"    niveau au point d'insertion : {rdb[k]:.0f} dB (seuil {thr:.0f} dB)")
    # v12 : contrôle — la suite, réentendue seule, doit commencer par le mot suivant (sinon on a coupé dans un mot)
    if i + 1 < len(words):
        with tempfile.NamedTemporaryFile(suffix=".wav") as tmp:
            sf.write(tmp.name, y[k:k + int(1.2 * lib.SR)], lib.SR)
            _, after = transcribe(tmp.name, "medium")
        expect = norm_words(words[i + 1]["w"])
        got = norm_words(after[0]["w"]) if after else []
        ok = bool(expect and got and (expect[0] in got or got[0] in expect))
        print(f"    contrôle de coupe : {'OK' if ok else 'ATTENTION'} (attendu « {words[i + 1]['w']} », entendu « {after[0]['w'] if after else '—'} »)")
    head, tail = y[:k].copy(), y[k:].copy()
    head[-fr:] *= np.linspace(1, 0, fr)[:, None]
    tail[:fr] *= np.linspace(0, 1, fr)[:, None]
    sil = np.zeros((int(dur * lib.SR), 2), np.float32)
    print(f"  pause après « {word} » : +{dur:.2f} s à {k / lib.SR:.2f} s")
    return np.concatenate([head, sil, tail])


def main():
    meta = {}
    for line in LINES["lines"]:
        lid = line["id"]
        y = lib.load(SRC / f"{lid}.wav")
        sp = SPEED.get(lid, SPEED["default"])
        if abs(sp - 1) > 1e-3:
            y = time_stretch(y.T.copy(), lib.SR, stretch_factor=sp, high_quality=True,
                             transient_mode="smooth", preserve_formants=True).T
        if abs(VOICE_SHIFT_ST) > 1e-3:
            y = Pedalboard([PitchShift(semitones=VOICE_SHIFT_ST)])(y.T.copy(), lib.SR).T
        y = chain(y.T.copy(), lib.SR).T
        y = y * lib.db(TARGET_RMS_DB - speech_rms_db(y))
        peak = np.max(np.abs(y))
        if peak > 0.89:
            y *= 0.89 / peak
        y = lib.fade(y.astype(np.float32), 0.01, 0.04)
        for word, dur in line.get("cap_pauses", []):
            y = cap_pause(y, word, dur)
        for word, dur in line.get("pauses", []):
            y = insert_pause(y, word, dur)
        for word, g in line.get("word_gain", []):
            y = word_gain(y, word, g)
        for w0, w1, g in line.get("span_gain", []):          # v8 : toute une fin de phrase
            y = span_gain(y, w0, w1, g)
        sf.write(OUT / f"{lid}.wav", y, lib.SR, subtype="PCM_24")
        info = {"dur": round(len(y) / lib.SR, 3), "speed": sp}
        if line.get("split"):
            chk = TAKES_LOG.get(lid, {}).get("split_check")
            win = next((c for c in chk or [] if c["file"] == TAKES_LOG[lid]["best"]), None)
            if win:      # découpe validée par scripts/voice/pick_split_take.py (chaque morceau réentendu seul)
                cuts = [int(c / sp * lib.SR) for c in win["cuts_s"]]
            else:
                cuts = (cut_points_words(y, int(line["split"]), line.get("parts")) if line.get("split_by") == "words"
                        else cut_points(y, int(line["split"])))
            edges = [0] + cuts + [len(y)]
            for k, (a, b) in enumerate(zip(edges, edges[1:]), 1):
                part = lib.fade(y[a:b], 0.004, 0.03)
                part = part * lib.db(TARGET_RMS_DB - speech_rms_db(part))   # niveau égal entre segments
                pg = line.get("part_gain")
                if pg:                                                        # correction fine après QA (niveau perçu)
                    part = part * lib.db(pg[k - 1])
                sf.write(OUT / f"{lid}_{k}.wav", part.astype(np.float32), lib.SR, subtype="PCM_24")
            info["cuts_s"] = [round(c / lib.SR, 4) for c in cuts]
            print(lid, "coupée en", len(edges) - 1, "à", info["cuts_s"])
        meta[lid] = info
        print(lid, f"x{sp}", info["dur"], "s")
    (OUT / "processing.json").write_text(json.dumps(meta, indent=1))


if __name__ == "__main__":
    main()
