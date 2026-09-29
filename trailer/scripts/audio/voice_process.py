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

SPEED = {"default": 0.95, "V13": 0.88, "V05a": 0.92, "V07": 0.93, "V01": 1.0, "V05b": 0.95, "V08": 1.0}
TARGET_RMS_DB = -20.0

chain = Pedalboard([
    HighpassFilter(cutoff_frequency_hz=80),
    LowShelfFilter(cutoff_frequency_hz=180, gain_db=-1.5),
    PeakFilter(cutoff_frequency_hz=320, gain_db=-1.5, q=1.0),
    PeakFilter(cutoff_frequency_hz=3200, gain_db=1.8, q=0.8),
    HighShelfFilter(cutoff_frequency_hz=9500, gain_db=1.2),
    Compressor(threshold_db=-22, ratio=3.0, attack_ms=6, release_ms=90),
])


def speech_rms_db(y):
    fr = int(lib.SR * 0.03)
    m = y.mean(1) if y.ndim == 2 else y
    r = np.sqrt(np.convolve(m ** 2, np.ones(fr) / fr, "same"))
    act = r[r > np.max(r) * 0.1]
    return 20 * np.log10(np.sqrt(np.mean(act ** 2)) + 1e-9)


def split_on_silence(y, n_parts, min_gap=0.06):
    fr = int(lib.SR * 0.01)
    m = y.mean(1)
    r = np.sqrt(np.convolve(m ** 2, np.ones(fr) / fr, "same"))
    thr = np.max(r) * 0.04
    act = r > thr
    # find gaps (runs of silence)
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
    gaps = sorted(gaps, key=lambda g: g[1] - g[0], reverse=True)[: n_parts - 1]
    gaps.sort()
    cuts = [0] + [(a + b) // 2 for a, b in gaps] + [len(y)]
    parts = []
    for a, b in zip(cuts, cuts[1:]):
        seg = y[a:b]
        on = np.argmax(np.abs(seg.mean(1)) > thr * 0.8)
        seg = seg[max(0, on - int(0.02 * lib.SR)):]
        parts.append(lib.fade(seg, 0.004, 0.03))
    return parts


def main():
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
        y = lib.fade(y.astype(np.float32), 0.003, 0.04)
        sf.write(OUT / f"{lid}.wav", y, lib.SR, subtype="PCM_24")
        if line.get("split"):
            parts = split_on_silence(y, len(line["at"]))
            for k, p in enumerate(parts, 1):
                sf.write(OUT / f"{lid}_{k}.wav", p, lib.SR, subtype="PCM_24")
            print(lid, "split", [round(len(p) / lib.SR, 2) for p in parts])
        print(lid, f"x{sp}", round(len(y) / lib.SR, 2), "s")


if __name__ == "__main__":
    main()
