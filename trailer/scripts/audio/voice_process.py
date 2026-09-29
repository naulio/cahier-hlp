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
                        PeakFilter, time_stretch)

import lib

ROOT = lib.ROOT
SRC = ROOT / "audio" / "voice" / "lines"
OUT = ROOT / "audio" / "voice" / "processed"
OUT.mkdir(parents=True, exist_ok=True)
LINES = json.loads((ROOT / "scripts" / "voice" / "lines.json").read_text())
TAKES_LOG = json.loads((ROOT / "logs" / "voice_takes.json").read_text())

SPEED = {"default": 0.95, "V01": 0.97}
TARGET_RMS_DB = -20.0

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


def insert_pause(y, word, dur):
    """Insert `dur` s of silence right after `word` (found with Whisper word timestamps)."""
    import sys, tempfile
    sys.path.insert(0, str(ROOT / "scripts"))
    from voice_metrics import transcribe, norm_words
    with tempfile.NamedTemporaryFile(suffix=".wav") as tmp:
        sf.write(tmp.name, y, lib.SR)
        _, words = transcribe(tmp.name, "medium")
    hit = next((w for w in words if norm_words(w["w"]) and norm_words(w["w"])[0] == norm_words(word)[0]), None)
    if not hit:
        print("  pause: mot introuvable", word)
        return y
    k = int((hit["t1"] + 0.03) * lib.SR)
    sil = np.zeros((int(dur * lib.SR), 2), np.float32)
    return np.concatenate([y[:k], sil, y[k:]])


def main():
    meta = {}
    for line in LINES["lines"]:
        lid = line["id"]
        y = lib.load(SRC / f"{lid}.wav")
        sp = SPEED.get(lid, SPEED["default"])
        if abs(sp - 1) > 1e-3:
            y = time_stretch(y.T.copy(), lib.SR, stretch_factor=sp, high_quality=True,
                             transient_mode="smooth", preserve_formants=True).T
        y = chain(y.T.copy(), lib.SR).T
        y = y * lib.db(TARGET_RMS_DB - speech_rms_db(y))
        peak = np.max(np.abs(y))
        if peak > 0.89:
            y *= 0.89 / peak
        y = lib.fade(y.astype(np.float32), 0.01, 0.04)
        for word, dur in line.get("pauses", []):
            y = insert_pause(y, word, dur)
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
                sf.write(OUT / f"{lid}_{k}.wav", part.astype(np.float32), lib.SR, subtype="PCM_24")
            info["cuts_s"] = [round(c / lib.SR, 4) for c in cuts]
            print(lid, "coupée en", len(edges) - 1, "à", info["cuts_s"])
        meta[lid] = info
        print(lid, f"x{sp}", info["dur"], "s")
    (OUT / "processing.json").write_text(json.dumps(meta, indent=1))


if __name__ == "__main__":
    main()
