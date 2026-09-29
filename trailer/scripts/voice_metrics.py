"""Objective voice-over metrics.

Nobody in this pipeline can "listen", so every take is judged with numbers
that correlate with what an ear would notice:

- intelligibility: Whisper transcription compared with the script (WER);
- prosody: F0 median, spread and range in semitones (flat = robotic);
- pace: words per minute, pauses;
- a spectrogram + pitch contour image for visual inspection.

Usage:
  python voice_metrics.py take.wav "texte de référence" [--png out.png] [--model small]
"""
import argparse
import json
import re
import sys
import unicodedata

import numpy as np
import soundfile as sf


def norm_words(s):
    s = s.lower().replace("’", "'").replace("œ", "oe").replace("æ", "ae")
    s = s.replace("pensez", "pensé").replace("essentielle", "essentiel").replace("imaginez", "imaginé")  # homophones
    s = re.sub(r"\b5\b", "cinq", s)
    s = re.sub(r"\bugo\b", "hugo", s)      # le h de Hugo est muet
    s = unicodedata.normalize("NFC", s)
    s = re.sub(r"[«»\"“”…\.,;:!\?\(\)\-–—]", " ", s)
    s = s.replace("'", "' ")
    return [w for w in s.split() if w]


def wer(ref, hyp):
    r, h = norm_words(ref), norm_words(hyp)
    d = np.zeros((len(r) + 1, len(h) + 1), dtype=int)
    d[:, 0] = np.arange(len(r) + 1)
    d[0, :] = np.arange(len(h) + 1)
    for i in range(1, len(r) + 1):
        for j in range(1, len(h) + 1):
            d[i, j] = min(d[i - 1, j] + 1, d[i, j - 1] + 1,
                          d[i - 1, j - 1] + (r[i - 1] != h[j - 1]))
    return d[len(r), len(h)] / max(1, len(r))


_models = {}


PAD = 0.6  # s of silence added around the clip: Whisper drops words at an abrupt start


def transcribe(path, model="small", words=True):
    import tempfile
    from faster_whisper import WhisperModel
    if model not in _models:
        _models[model] = WhisperModel(model, device="cpu", compute_type="int8")
    y, sr = sf.read(path, always_2d=False)
    if y.ndim > 1:
        y = y.mean(axis=1)
    z = np.zeros(int(PAD * sr))
    with tempfile.NamedTemporaryFile(suffix=".wav") as tmp:
        sf.write(tmp.name, np.concatenate([z, y, z]), sr)
        segs, _ = _models[model].transcribe(tmp.name, language="fr", word_timestamps=words,
                                            beam_size=5, vad_filter=False)
        segs = list(segs)
    out, wl = [], []
    for s in segs:
        out.append(s.text.strip())
        if words:
            for w in s.words:
                wl.append({"w": w.word.strip(), "t0": round(max(0.0, w.start - PAD), 3), "t1": round(max(0.0, w.end - PAD), 3),
                           "p": round(w.probability, 3)})
    return " ".join(out), wl


def prosody(y, sr):
    import librosa
    y16 = librosa.resample(y, orig_sr=sr, target_sr=16000) if sr != 16000 else y
    f0, vflag, _ = librosa.pyin(y16, fmin=60, fmax=400, sr=16000, frame_length=1024, hop_length=160)
    f = f0[vflag & ~np.isnan(f0)]
    if len(f) < 10:
        return {}, f0
    st = 12 * np.log2(f / np.median(f))
    # speech / pause segmentation from RMS
    rms = librosa.feature.rms(y=y16, frame_length=800, hop_length=160)[0]
    thr = max(1e-4, np.percentile(rms, 95) * 0.06)
    active = rms > thr
    pauses, run = [], 0
    for a in active:
        if not a:
            run += 1
        else:
            if run * 0.01 >= 0.18:
                pauses.append(run * 0.01)
            run = 0
    return {
        "f0_median_hz": round(float(np.median(f)), 1),
        "f0_std_st": round(float(np.std(st)), 2),
        "f0_range_p5_p95_st": round(float(np.percentile(st, 95) - np.percentile(st, 5)), 2),
        "voiced_ratio": round(float(np.mean(vflag)), 3),
        "speech_time_s": round(float(np.mean(active) * len(y16) / 16000), 2),
        "pauses_ge_180ms": len(pauses),
        "mean_pause_s": round(float(np.mean(pauses)), 3) if pauses else 0.0,
    }, f0


def spectro_png(y, sr, f0, path, title=""):
    import librosa
    import librosa.display  # noqa
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt
    fig, ax = plt.subplots(2, 1, figsize=(12, 5), sharex=True,
                           gridspec_kw={"height_ratios": [3, 1]})
    S = librosa.amplitude_to_db(np.abs(librosa.stft(y, n_fft=2048, hop_length=256)), ref=np.max)
    librosa.display.specshow(S, sr=sr, hop_length=256, x_axis="time", y_axis="log", ax=ax[0], cmap="magma")
    ax[0].set_title(title)
    t = np.arange(len(f0)) * 160 / 16000
    ax[1].plot(t, f0, lw=1.2)
    ax[1].set_ylabel("F0 Hz")
    fig.tight_layout()
    fig.savefig(path, dpi=80)
    plt.close(fig)


def analyse(path, ref, model="small", png=None):
    y, sr = sf.read(path, always_2d=False)
    if y.ndim > 1:
        y = y.mean(axis=1)
    y = y.astype(np.float32)
    hyp, words = transcribe(path, model=model)
    pr, f0 = prosody(y, sr)
    dur = len(y) / sr
    nw = len(norm_words(ref))
    res = {
        "file": path,
        "duration_s": round(dur, 2),
        "transcript": hyp,
        "wer": round(wer(ref, hyp), 3),
        "mean_word_prob": round(float(np.mean([w["p"] for w in words])), 3) if words else None,
        "words_per_min_speech": round(nw / max(0.1, pr.get("speech_time_s", dur)) * 60, 1),
        "peak_dbfs": round(float(20 * np.log10(np.max(np.abs(y)) + 1e-9)), 2),
        **pr,
    }
    if png:
        spectro_png(y, sr, f0, png, title=path.split("/")[-1])
    return res, words


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("wav")
    ap.add_argument("ref")
    ap.add_argument("--png")
    ap.add_argument("--model", default="small")
    a = ap.parse_args()
    r, _ = analyse(a.wav, a.ref, a.model, a.png)
    json.dump(r, sys.stdout, ensure_ascii=False, indent=1)
    print()
