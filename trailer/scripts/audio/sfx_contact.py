"""Contact sheet (waveform + spectrogram + stats) of candidate sounds, to choose without listening."""
import json, sys
from pathlib import Path
import numpy as np, soundfile as sf
import matplotlib; matplotlib.use("Agg")
import matplotlib.pyplot as plt
ROOT = Path(__file__).resolve().parents[2]
src = ROOT / "audio" / "sfx" / "sources"
meta = json.loads((src / "sources.json").read_text())
keys = [k for k in meta if any(k.startswith(p) for p in sys.argv[2:])] if len(sys.argv) > 2 else list(meta)
fig, axes = plt.subplots(len(keys), 2, figsize=(14, 1.35 * len(keys)), gridspec_kw={"width_ratios": [1, 1.2]})
for ax, k in zip(axes, keys):
    y, sr = sf.read(src / meta[k]["file"]); y = y.mean(1) if y.ndim > 1 else y
    t = np.arange(len(y)) / sr
    peak = 20 * np.log10(np.max(np.abs(y)) + 1e-9)
    fr = int(sr * 0.02); rms = np.sqrt(np.convolve(y ** 2, np.ones(fr) / fr, "same")) + 1e-9
    floor = 20 * np.log10(np.percentile(rms, 10)); clip = np.mean(np.abs(y) > 0.99) * 100
    ax[0].plot(t, y, lw=0.4, color="k"); ax[0].set_xlim(0, t[-1]); ax[0].set_yticks([])
    ax[0].set_title(f"{k} | {meta[k]['title'][:38]} | peak {peak:.1f} floor {floor:.0f} dB clip {clip:.2f}%", fontsize=7, loc="left")
    ax[1].specgram(y, NFFT=1024, Fs=sr, noverlap=768, cmap="magma", vmin=-120); ax[1].set_yticks([]); ax[1].set_ylim(0, 16000)
    for a in ax: a.tick_params(labelsize=6)
fig.tight_layout(); fig.savefig(sys.argv[1], dpi=70)
