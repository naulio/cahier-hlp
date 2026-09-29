"""Audio toolkit for the trailer: sampler, small synths, effects, placement.

Everything is float32 stereo at 48 kHz, arrays shaped (n, 2).
"""
import functools
import re
from pathlib import Path

import numpy as np
import soundfile as sf
from scipy.signal import butter, sosfilt, resample_poly

SR = 48000
ROOT = Path(__file__).resolve().parents[2]
rng = np.random.default_rng(1234)


# ---------------------------------------------------------------- basics
def st(x):
    """mono -> stereo"""
    x = np.asarray(x, np.float32)
    return np.stack([x, x], 1) if x.ndim == 1 else x


def load(path, sr=SR):
    y, s = sf.read(str(path), always_2d=True, dtype="float32")
    if s != sr:
        g = np.gcd(int(s), sr)
        y = resample_poly(y, sr // g, int(s) // g, axis=0).astype(np.float32)
    if y.shape[1] == 1:
        y = np.repeat(y, 2, 1)
    return y[:, :2]


def seconds(n):
    return int(round(n * SR))


def pan(x, p):
    """equal-power pan, p in [-1, 1]"""
    x = st(x)
    a = (p + 1) * np.pi / 4
    return np.stack([x[:, 0] * np.cos(a) * 1.414, x[:, 1] * np.sin(a) * 1.414], 1)


def db(g):
    return 10 ** (g / 20)


def env_adsr(n, a=0.005, d=0.1, s=0.7, r=0.2, total=None):
    total = total or n / SR
    t = np.arange(n) / SR
    e = np.where(t < a, t / max(a, 1e-6), np.where(t < a + d, 1 - (1 - s) * (t - a) / max(d, 1e-6), s))
    rel0 = max(0, total - r)
    e = np.where(t > rel0, e * np.clip(1 - (t - rel0) / max(r, 1e-6), 0, 1), e)
    return e.astype(np.float32)


def exp_env(n, tau):
    return np.exp(-np.arange(n) / SR / tau).astype(np.float32)


def filt(x, kind, f, order=2):
    f = np.atleast_1d(f)
    sos = butter(order, f / (SR / 2), btype=kind, output="sos")
    return sosfilt(sos, x, axis=0).astype(np.float32)


def fade(x, fin=0.005, fout=0.02):
    x = x.copy()
    a, b = seconds(fin), seconds(fout)
    if a:
        x[:a] *= np.linspace(0, 1, a)[:, None] if x.ndim == 2 else np.linspace(0, 1, a)
    if b:
        x[-b:] *= np.linspace(1, 0, b)[:, None] if x.ndim == 2 else np.linspace(1, 0, b)
    return x


def mtof(m):
    return 440.0 * 2 ** ((m - 69) / 12)


NOTE = {"C": 0, "C#": 1, "Db": 1, "D": 2, "D#": 3, "Eb": 3, "E": 4, "F": 5, "F#": 6, "Gb": 6, "G": 7,
        "G#": 8, "Ab": 8, "A": 9, "A#": 10, "Bb": 10, "B": 11}


def n2m(name):
    m = re.match(r"([A-G][#b]?)(-?\d)", name)
    return NOTE[m.group(1)] + 12 * (int(m.group(2)) + 1)


# ---------------------------------------------------------------- effects (pedalboard)
def fx(x, *plugins):
    from pedalboard import Pedalboard
    return Pedalboard(list(plugins))(st(x).T.copy(), SR).T.astype(np.float32)


def reverb(x, room=0.6, wet=0.3, damp=0.5, width=1.0, tail=2.0):
    from pedalboard import Reverb
    x = np.concatenate([st(x), np.zeros((seconds(tail), 2), np.float32)])
    return fx(x, Reverb(room_size=room, damping=damp, wet_level=wet, dry_level=1 - wet * 0.5, width=width))


def saturate(x, drive=1.5):
    return (np.tanh(x * drive) / np.tanh(drive)).astype(np.float32)


# ---------------------------------------------------------------- Salamander piano sampler
class Piano:
    """Salamander Grand Piano V3 (Alexander Holm, CC-BY 3.0).
    Samples every minor third (A, C, D#, F#), 16 velocity layers."""

    def __init__(self, folder):
        self.dir = Path(folder)
        self.idx = {}
        for f in self.dir.glob("*v*.wav"):
            m = re.match(r"([A-G]#?)(\d)v(\d+)\.wav", f.name)
            if m:
                midi = NOTE[m.group(1)] + 12 * (int(m.group(2)) + 1)
                self.idx.setdefault(midi, {})[int(m.group(3))] = f
        self.keys = np.array(sorted(self.idx))

    @functools.lru_cache(maxsize=512)
    def _sample(self, midi, layer):
        return load(self.idx[midi][layer], SR)

    def note(self, m, vel=64, dur=2.0, release=0.6, max_len=8.0):
        base = int(self.keys[np.argmin(np.abs(self.keys - m))])
        layers = sorted(self.idx[base])
        layer = layers[int(np.clip(round((vel / 127) * (len(layers) - 1)), 0, len(layers) - 1))]
        y = self._sample(base, layer)
        shift = m - base
        if shift:
            ratio = 2 ** (shift / 12)          # resample: higher pitch = fewer samples
            up, down = int(round(1000 / ratio)), 1000
            y = resample_poly(y, up, down, axis=0).astype(np.float32)
        n = min(len(y), seconds(min(max_len, dur + release + 0.05)))
        y = y[:n].copy()
        # damper: release after `dur`
        k0 = seconds(dur)
        if k0 < n:
            r = np.exp(-np.arange(n - k0) / SR / (release / 4))[:, None]
            y[k0:] *= r
        return fade(y, 0.0, 0.01)


# ---------------------------------------------------------------- synth voices
def osc_saw(f, n, phase=0.0):
    t = np.arange(n) / SR
    # band-limited-ish saw via summed harmonics (clean, a bit soft)
    out = np.zeros(n, np.float32)
    k = 1
    while k * f < 9000 and k < 40:
        out += np.sin(2 * np.pi * k * f * t + phase * k) / k
        k += 1
    return out * 0.55


def pad(freqs, dur, attack=1.2, release=1.8, cutoff=1800, detune=0.08, level=0.18, bright_lfo=0.12):
    n = seconds(dur + release)
    L = np.zeros(n, np.float32)
    R = np.zeros(n, np.float32)
    for i, f in enumerate(freqs):
        for d, side in ((-detune, 0), (detune, 1), (0.0, 2)):
            ff = f * 2 ** (d / 12)
            s = osc_saw(ff, n, phase=rng.uniform(0, 6.28))
            if side == 0:
                L += s
            elif side == 1:
                R += s
            else:
                L += s * 0.6
                R += s * 0.6
    x = np.stack([L, R], 1) / max(1, len(freqs) * 2)
    x = filt(x, "lowpass", cutoff, 2)
    x = filt(x, "highpass", 60, 2)
    t = np.arange(n) / SR
    trem = (1 - bright_lfo / 2 + bright_lfo / 2 * np.sin(2 * np.pi * 0.13 * t))[:, None]
    e = env_adsr(n, attack, 0.5, 0.85, release, dur + release)[:, None]
    return (x * e * trem * level).astype(np.float32)


def sub(f, dur, level=0.35, attack=0.02, release=0.4):
    n = seconds(dur + release)
    t = np.arange(n) / SR
    x = np.sin(2 * np.pi * f * t) + 0.12 * np.sin(2 * np.pi * 2 * f * t)
    e = env_adsr(n, attack, 0.2, 0.8, release, dur + release)
    return st(saturate(x * e * level, 1.2))


def pluck(f, level=0.2, decay=0.35, bright=2600):
    n = seconds(decay * 5)
    t = np.arange(n) / SR
    x = (np.sin(2 * np.pi * f * t) + 0.35 * np.sin(2 * np.pi * 2 * f * t + 0.3) + 0.12 * np.sin(2 * np.pi * 3 * f * t))
    x *= exp_env(n, decay) * np.clip(t / 0.003, 0, 1)
    x = filt(x, "lowpass", bright, 2)
    return st(x * level)


def kick(level=0.8, f0=110, f1=44, tau=0.32):
    n = seconds(0.6)
    t = np.arange(n) / SR
    f = f1 + (f0 - f1) * np.exp(-t / 0.035)
    ph = 2 * np.pi * np.cumsum(f) / SR
    x = np.sin(ph) * exp_env(n, tau)
    click = filt(rng.standard_normal(n).astype(np.float32), "bandpass", [900, 4000]) * exp_env(n, 0.004) * 0.25
    return st(saturate((x + click) * level, 1.4))


def rim(level=0.25, f=1750):
    n = seconds(0.25)
    t = np.arange(n) / SR
    tone = np.sin(2 * np.pi * f * t) * exp_env(n, 0.018) + 0.6 * np.sin(2 * np.pi * f * 1.48 * t) * exp_env(n, 0.012)
    nz = filt(rng.standard_normal(n).astype(np.float32), "bandpass", [1500, 6000]) * exp_env(n, 0.02)
    return st((tone * 0.6 + nz * 0.7) * level)


def shaker(level=0.06, length=0.09):
    n = seconds(length)
    x = filt(rng.standard_normal(n).astype(np.float32), "highpass", 6000, 2)
    e = np.sin(np.pi * np.linspace(0, 1, n)) ** 2
    return st(x * e * level)


def noise_swell(dur, lo=300, hi=6000, level=0.1, curve=2.0):
    n = seconds(dur)
    x = rng.standard_normal((n, 2)).astype(np.float32)
    x = filt(x, "bandpass", [lo, hi])
    e = (np.linspace(0, 1, n) ** curve)[:, None]
    return x * e * level


def tone(f, dur, level=0.15, attack=0.004, decay=0.25, harm=(1, 0.3, 0.1)):
    n = seconds(dur)
    t = np.arange(n) / SR
    x = sum(a * np.sin(2 * np.pi * f * (k + 1) * t) for k, a in enumerate(harm))
    return st(x * exp_env(n, decay) * np.clip(t / attack, 0, 1) * level)


# ---------------------------------------------------------------- timeline buffer
class Track:
    def __init__(self, duration):
        self.buf = np.zeros((seconds(duration), 2), np.float32)

    def add(self, sig, at, gain_db=0.0, p=0.0):
        sig = st(sig)
        if p:
            sig = pan(sig, p)
        i = seconds(at)
        if i < 0:
            sig = sig[-i:]
            i = 0
        j = min(len(self.buf), i + len(sig))
        if j > i:
            self.buf[i:j] += sig[: j - i] * db(gain_db)
        return self

    def write(self, path):
        sf.write(str(path), self.buf, SR, subtype="PCM_24")


# ---------------------------------------------------------------- mastering
def true_peak_db(x):
    up = resample_poly(st(x), 4, 1, axis=0)
    return float(20 * np.log10(np.max(np.abs(up)) + 1e-12))


def limiter(x, ceiling_db=-1.2, lookahead=0.005, release=0.08):
    """Transparent look-ahead peak limiter (no make-up, no pre-compression)."""
    from scipy.ndimage import minimum_filter1d
    x = st(x)
    c = db(ceiling_db)
    peak = np.max(np.abs(x), 1)
    g = np.minimum(1.0, c / np.maximum(peak, 1e-9))
    L = max(1, int(lookahead * SR))
    g = minimum_filter1d(g, size=2 * L + 1, mode="nearest")       # la réduction commence avant le pic
    a = np.exp(-1.0 / (release * SR))
    out = np.empty_like(g)
    v = 1.0
    for i in range(len(g)):
        v = g[i] if g[i] < v else a * v + (1 - a) * g[i]
        out[i] = v
    y = x * out[:, None]
    return y.astype(np.float32), float(20 * np.log10(out.min()))
