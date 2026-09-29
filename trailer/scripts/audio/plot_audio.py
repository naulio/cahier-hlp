"""Plot loudness envelopes (per stem or file) with timeline marks: visual check of the mix."""
import json, sys
from pathlib import Path
import numpy as np, soundfile as sf
import matplotlib; matplotlib.use("Agg"); import matplotlib.pyplot as plt
ROOT = Path(__file__).resolve().parents[2]
M = json.loads((ROOT / "logs" / "timeline.json").read_text())["marks"]
out = sys.argv[1]; files = sys.argv[2:]
fig, axes = plt.subplots(len(files) + 1, 1, figsize=(16, 1.6 * (len(files) + 1) + 1.5), sharex=True)
for ax, f in zip(axes, files):
    y, sr = sf.read(f, always_2d=True); m = y.mean(1)
    hop = sr // 20; n = len(m) // hop
    r = np.sqrt(np.mean(m[: n * hop].reshape(n, hop) ** 2, 1)) + 1e-9
    ax.plot(np.arange(n) / 20, 20 * np.log10(r), lw=0.8); ax.set_ylim(-70, 0); ax.set_ylabel(Path(f).stem[:12], fontsize=7)
    ax.grid(alpha=.3)
y, sr = sf.read(files[0], always_2d=True)
axes[-1].specgram(y.mean(1), NFFT=2048, Fs=sr, noverlap=1024, cmap="magma", vmin=-110); axes[-1].set_ylim(0, 8000)
for k in ("n1", "q_tout", "v3_start", "v5_mais", "shutter", "v7_cahier", "v8_start", "v10_corriges", "v11_start", "v12_start", "v13_classe", "v14_start", "v14_endroit", "capture"):
    for ax in axes: ax.axvline(M[k], color="r", lw=0.6, alpha=.6)
    axes[0].text(M[k], 1, k, fontsize=6, rotation=90, va="bottom")
fig.tight_layout(); fig.savefig(out, dpi=70)
