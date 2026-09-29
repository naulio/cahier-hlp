"""Voice-over generation: SCRIPT -> TTS -> takes -> best take per line.

Providers (choose with --provider or VOICE_PROVIDER):

  gemini        Google Gemini TTS (REST).   needs GEMINI_API_KEY
  google-cloud  Google Cloud Text-to-Speech (Chirp 3 HD). needs GOOGLE_TTS_API_KEY
  kyutai        Kyutai TTS 1.6B en/fr, local on CPU (CC-BY 4.0 model).
  gtts          Google Translate TTS (keyless, unofficial) - baseline only.

"auto" picks gemini, then google-cloud, then kyutai, depending on which
keys are present. Keys are read from the environment only; never commit them.

Every take is scored (Whisper WER, word confidence, F0 spread, pace) and the
best one is copied to audio/voice/lines/<ID>.wav. Scores go to logs/voice_takes.json.
"""
import argparse
import base64
import hashlib
import json
import os
import sys
import time
import urllib.request
from pathlib import Path

import numpy as np
import soundfile as sf

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts"))
from voice_metrics import analyse  # noqa: E402

LINES = ROOT / "scripts" / "voice" / "lines.json"
TAKES = ROOT / "audio" / "voice" / "takes"
BEST = ROOT / "audio" / "voice" / "lines"
LOG = ROOT / "logs" / "voice_takes.json"
REF_DIR = ROOT / "assets" / "voices_ref"

KYUTAI_VOICE = os.environ.get("KYUTAI_VOICE", "unmute-prod-website_fabieng-enhanced-v2.wav")
GEMINI_MODEL = os.environ.get("GEMINI_TTS_MODEL", "gemini-2.5-flash-preview-tts")
GEMINI_VOICE = os.environ.get("GEMINI_TTS_VOICE", "Achird")
CLOUD_VOICE = os.environ.get("GOOGLE_TTS_VOICE", "fr-FR-Chirp3-HD-Achird")
REF_F0 = float(os.environ.get("VOICE_REF_F0", 128.0))   # registre médian de la voix (Hz)


# ---------------------------------------------------------------- providers
def _post(url, body, headers, tries=5):
    """POST JSON with retries on 429/5xx (quota and transient errors)."""
    import urllib.error
    for k in range(tries):
        req = urllib.request.Request(url, data=json.dumps(body).encode(), headers=headers)
        try:
            with urllib.request.urlopen(req, timeout=120) as r:
                return json.load(r)
        except urllib.error.HTTPError as e:
            if e.code in (429, 500, 502, 503, 504) and k < tries - 1:
                time.sleep(2 ** k * 2)
                continue
            raise


def tts_gemini(text, style, seed):
    key = os.environ["GEMINI_API_KEY"]
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent"
    body = {
        "contents": [{"parts": [{"text": f"{style} Lis uniquement le texte entre guillemets : « {text} »"}]}],
        "generationConfig": {
            "responseModalities": ["AUDIO"],
            "speechConfig": {"voiceConfig": {"prebuiltVoiceConfig": {"voiceName": GEMINI_VOICE}}},
        },
    }
    d = _post(url, body, {"Content-Type": "application/json", "x-goog-api-key": key})
    parts = d.get("candidates", [{}])[0].get("content", {}).get("parts", [])
    part = next((p["inlineData"] for p in parts if "inlineData" in p), None)
    if part is None:
        raise RuntimeError(f"Gemini TTS : pas d'audio dans la réponse ({str(d)[:300]})")
    pcm = np.frombuffer(base64.b64decode(part["data"]), dtype="<i2").astype(np.float32) / 32768
    sr = 24000
    mt = part.get("mimeType", "")
    if "rate=" in mt:
        sr = int(mt.split("rate=")[1].split(";")[0])
    return pcm, sr


def tts_google_cloud(text, style, seed):
    key = os.environ["GOOGLE_TTS_API_KEY"]
    url = "https://texttospeech.googleapis.com/v1/text:synthesize"
    body = {
        "input": {"text": text},
        "voice": {"languageCode": "fr-FR", "name": CLOUD_VOICE},
        "audioConfig": {"audioEncoding": "LINEAR16", "sampleRateHertz": 24000},
    }
    import io
    d = _post(url, body, {"Content-Type": "application/json", "X-Goog-Api-Key": key})
    pcm, sr = sf.read(io.BytesIO(base64.b64decode(d["audioContent"])), dtype="float32")
    return pcm, sr


def tts_gtts(text, style, seed):
    import io
    from gtts import gTTS
    import subprocess
    buf = io.BytesIO()
    gTTS(text, lang="fr", tld="fr").write_to_fp(buf)
    out = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", "pipe:0", "-f", "f32le", "-ac", "1",
                          "-ar", "24000", "pipe:1"], input=buf.getvalue(), capture_output=True).stdout
    return np.frombuffer(out, dtype=np.float32), 24000


_kyutai = None


def tts_kyutai(text, style, seed):
    global _kyutai
    import torch
    from moshi.models.loaders import CheckpointInfo
    from moshi.models.tts import DEFAULT_DSM_TTS_REPO, TTSModel
    torch.set_num_threads(os.cpu_count() or 4)
    if _kyutai is None:
        ci = CheckpointInfo.from_hf_repo(DEFAULT_DSM_TTS_REPO)
        _kyutai = TTSModel.from_checkpoint_info(ci, n_q=32, temp=float(os.environ.get("KYUTAI_TEMP", 0.6)),
                                                device=torch.device("cpu"), dtype=torch.float32)
    tts = _kyutai
    torch.manual_seed(seed)
    np.random.seed(seed)
    entries = tts.prepare_script([text], padding_between=1)
    voice = REF_DIR / (KYUTAI_VOICE + ".1e68beda@240.safetensors")
    ca = tts.make_condition_attributes([voice], cfg_coef=float(os.environ.get("KYUTAI_CFG", 2.0)))
    pcms = []

    def on_frame(frame):
        if (frame != -1).all():
            pcm = tts.mimi.decode(frame[:, 1:, :]).cpu().numpy()
            pcms.append(np.clip(pcm[0, 0], -1, 1))

    with tts.mimi.streaming(1), torch.no_grad():
        tts.generate([entries], [ca], on_frame=on_frame)
    return np.concatenate(pcms, axis=-1).astype(np.float32), tts.mimi.sample_rate


PROVIDERS = {"gemini": tts_gemini, "google-cloud": tts_google_cloud, "kyutai": tts_kyutai, "gtts": tts_gtts}


def pick_provider(name):
    if name != "auto":
        return name
    if os.environ.get("GEMINI_API_KEY"):
        return "gemini"
    if os.environ.get("GOOGLE_TTS_API_KEY"):
        return "google-cloud"
    return "kyutai"


# ---------------------------------------------------------------- helpers
def trim(y, sr, pad_start=0.08, pad_end=0.14):
    """Trim leading/trailing silence (keeps natural breath tails)."""
    frame = int(sr * 0.01)
    rms = np.sqrt(np.convolve(y ** 2, np.ones(frame) / frame, mode="same"))
    thr = max(1e-4, np.percentile(rms, 98) * 0.02)
    idx = np.where(rms > thr)[0]
    if len(idx) == 0:
        return y
    a = max(0, idx[0] - int(pad_start * sr))
    b = min(len(y), idx[-1] + int(pad_end * sr))
    y = y[a:b].copy()
    n = int(0.01 * sr)
    y[:n] *= np.linspace(0, 1, n)          # fondu d'entrée de 10 ms : l'attaque reste intacte
    return y


def keep_word(y, sr, words, keep):
    """Keep only the first (or last) word of a carrier sentence, cut in the pause next to it.

    A name spoken alone is badly read by the local TTS (« Brabeulet », « Égout ») and a
    list links the names together; inside a short sentence (« Rabelais, puis tout le
    reste. ») it is read cleanly, with a continuation contour, and a pause follows it.
    Returns (piece, pause_s, depth_db)."""
    frame = int(sr * 0.01)
    rms = np.sqrt(np.convolve(y ** 2, np.ones(frame) / frame, mode="same"))
    lev = 20 * np.log10(rms + 1e-9)
    peak = float(np.percentile(lev, 99))
    if len(words) < 2:
        return y, 0.0, 0.0
    a, b = (words[0]["t1"], words[1]["t0"]) if keep == "first" else (words[-2]["t1"], words[-1]["t0"])
    i0, i1 = int(max(0.0, a - 0.12) * sr), int(min(len(y) / sr, b + 0.12) * sr)
    seg = lev[i0:i1]
    low = seg < peak - 32
    runs, k = [], 0
    while k < len(low):
        if low[k]:
            j = k
            while j < len(low) and low[j]:
                j += 1
            runs.append((k, j))
            k = j
        else:
            k += 1
    if runs:
        r0, r1 = max(runs, key=lambda r: r[1] - r[0])
        cut, pause = i0 + (r0 + r1) // 2, (r1 - r0) / sr
    else:
        cut, pause = i0 + int(np.argmin(seg)), 0.0
    depth = peak - float(seg.min())
    piece = y[:cut] if keep == "first" else y[cut:]
    return trim(piece, sr), pause, depth


def final_rise_st(path):
    """F0 slope over the last voiced 350 ms (semitones): > 0 = rising (question)."""
    import librosa
    y, sr = sf.read(path)
    y = y.mean(1) if y.ndim > 1 else y
    f0, v, _ = librosa.pyin(librosa.resample(y.astype(np.float32), orig_sr=sr, target_sr=16000), fmin=60, fmax=420,
                            sr=16000, frame_length=1024, hop_length=160)
    f = f0[v & ~np.isnan(f0)]
    if len(f) < 12:
        return 0.0
    tail = f[-35:]
    return float(12 * np.log2(np.median(tail[-8:]) / np.median(tail[:8])))


def score(m, line=None):
    """Lower is better. Intelligibility first, then naturalness proxies."""
    s = m["wer"] * 10
    s += (1 - (m.get("mean_word_prob") or 0)) * 4
    f0 = m.get("f0_std_st", 0)
    s += max(0, 2.2 - f0) * 0.8           # too flat = robotic
    s += max(0, f0 - 5.0) * 0.5           # too wild = over-acted
    nwords = len(m.get("transcript", "").split())
    if nwords >= 4 and not (line and line.get("onsets")):   # pas de débit sur deux mots ni sur une liste de noms
        wpm = m.get("words_per_min_speech", 170)
        s += max(0, wpm - 205) / 20       # rushed (la QA v1 a relevé des répliques pressées)
        s += max(0, 130 - wpm) / 40       # dragging
    med = m.get("f0_median_hz")
    if med:                               # pas de saut de registre entre répliques
        s += max(0, abs(12 * np.log2(med / REF_F0)) - 2.0) * 0.8
    if line and line.get("question"):
        rise = m.get("final_rise_st", 0.0)
        s += max(0, 2.0 - rise) * 0.4     # une question doit monter
    return round(s, 3)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--provider", default=os.environ.get("VOICE_PROVIDER", "auto"))
    ap.add_argument("--takes", type=int, default=3)
    ap.add_argument("--only", nargs="*", help="line ids")
    ap.add_argument("--whisper", default="medium")
    a = ap.parse_args()
    prov = pick_provider(a.provider)
    fn = PROVIDERS[prov]
    spec = json.loads(LINES.read_text())
    TAKES.mkdir(parents=True, exist_ok=True)
    BEST.mkdir(parents=True, exist_ok=True)
    log = json.loads(LOG.read_text()) if LOG.exists() else {}
    voice_id = {"kyutai": KYUTAI_VOICE, "gemini": GEMINI_VOICE, "google-cloud": CLOUD_VOICE}.get(prov, "")
    print(f"provider={prov} voice={voice_id}")
    for line in spec["lines"]:
        if a.only and line["id"] not in a.only:
            continue
        results = []
        text = line.get("tts_google", line["text"]) if prov in ("gemini", "google-cloud") else line["tts"]
        n_takes = 1 if prov == "google-cloud" else line.get("takes", a.takes)   # Cloud TTS est déterministe
        for k in range(n_takes):
            seed = 1000 + k * 7919
            h = hashlib.sha1(f"{prov}|{voice_id}|{text}|{seed}|trim2".encode()).hexdigest()[:10]
            path = TAKES / f"{line['id']}_{prov}_{h}.wav"
            if not path.exists():
                t0 = time.time()
                y, sr = fn(text, spec["style_prompt"], seed)
                y = trim(y, sr)
                sf.write(path, y, sr, subtype="PCM_24")
                print(f"  {line['id']} take {k} {len(y)/sr:.2f}s audio in {time.time()-t0:.0f}s")
            m, words = analyse(str(path), text if line.get("keep") else line["text"], a.whisper)
            if line.get("question"):
                m["final_rise_st"] = round(final_rise_st(str(path)), 2)
            m["score"] = score(m, line)
            if line.get("keep"):                 # seul le nom est gardé : il faut une vraie pause à côté
                y0, sr0 = sf.read(str(path))
                piece, pause, depth = keep_word(y0, sr0, words, line["keep"])
                m["keep_pause_s"], m["keep_depth_db"] = round(pause, 3), round(depth, 1)
                m["score"] = round(m["score"] + (4 if pause < 0.035 else 0) + max(0, 28 - depth) * 0.2, 3)
            m["seed"] = seed
            m["words"] = words
            results.append(m)
            print(f"  {line['id']} take {k}: score {m['score']} wer {m['wer']} p {m['mean_word_prob']} "
                  f"f0sd {m.get('f0_std_st')} wpm {m['words_per_min_speech']} | {m['transcript']}")
        best = min(results, key=lambda r: r["score"])
        y, sr = sf.read(best["file"])
        if line.get("keep"):
            y, _, _ = keep_word(y, sr, best["words"], line["keep"])
        sf.write(BEST / f"{line['id']}.wav", y, sr, subtype="PCM_24")
        log = json.loads(LOG.read_text()) if LOG.exists() else {}     # relu : un autre outil a pu l'écrire entre-temps
        log[line["id"]] = {"provider": prov, "voice": voice_id, "text": line["text"], "best": best["file"],
                           "takes": results}
        LOG.parent.mkdir(parents=True, exist_ok=True)
        LOG.write_text(json.dumps(log, ensure_ascii=False, indent=1))
        print(f"{line['id']} -> {Path(best['file']).name} (score {best['score']})")


if __name__ == "__main__":
    main()
