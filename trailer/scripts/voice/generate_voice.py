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
GEMINI_VOICE = os.environ.get("GEMINI_TTS_VOICE", "Iapetus")
CLOUD_VOICE = os.environ.get("GOOGLE_TTS_VOICE", "fr-FR-Chirp3-HD-Iapetus")


# ---------------------------------------------------------------- providers
def tts_gemini(text, style, seed):
    key = os.environ["GEMINI_API_KEY"]
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent"
    body = {
        "contents": [{"parts": [{"text": f"{style}\n\nTexte à lire :\n{text}"}]}],
        "generationConfig": {
            "responseModalities": ["AUDIO"],
            "speechConfig": {"voiceConfig": {"prebuiltVoiceConfig": {"voiceName": GEMINI_VOICE}}},
        },
    }
    req = urllib.request.Request(url, data=json.dumps(body).encode(),
                                 headers={"Content-Type": "application/json", "x-goog-api-key": key})
    with urllib.request.urlopen(req, timeout=120) as r:
        d = json.load(r)
    part = d["candidates"][0]["content"]["parts"][0]["inlineData"]
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
        "audioConfig": {"audioEncoding": "LINEAR16", "sampleRateHertz": 24000, "speakingRate": 0.96},
    }
    req = urllib.request.Request(url, data=json.dumps(body).encode(),
                                 headers={"Content-Type": "application/json", "X-Goog-Api-Key": key})
    with urllib.request.urlopen(req, timeout=120) as r:
        d = json.load(r)
    raw = base64.b64decode(d["audioContent"])
    pcm = np.frombuffer(raw[44:], dtype="<i2").astype(np.float32) / 32768  # skip WAV header
    return pcm, 24000


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
def trim(y, sr, pad_start=0.03, pad_end=0.12):
    """Trim leading/trailing silence (keeps natural breath tails)."""
    frame = int(sr * 0.01)
    rms = np.sqrt(np.convolve(y ** 2, np.ones(frame) / frame, mode="same"))
    thr = max(1e-4, np.percentile(rms, 98) * 0.02)
    idx = np.where(rms > thr)[0]
    if len(idx) == 0:
        return y
    a = max(0, idx[0] - int(pad_start * sr))
    b = min(len(y), idx[-1] + int(pad_end * sr))
    return y[a:b]


def score(m):
    """Lower is better. Intelligibility first, then naturalness proxies."""
    s = m["wer"] * 10
    s += (1 - (m.get("mean_word_prob") or 0)) * 4
    f0 = m.get("f0_std_st", 0)
    s += max(0, 2.2 - f0) * 0.8           # too flat = robotic
    s += max(0, f0 - 5.0) * 0.5           # too wild = over-acted
    wpm = m.get("words_per_min_speech", 170)
    s += max(0, wpm - 205) / 40           # rushed
    s += max(0, 130 - wpm) / 40           # dragging
    return round(s, 3)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--provider", default=os.environ.get("VOICE_PROVIDER", "auto"))
    ap.add_argument("--takes", type=int, default=3)
    ap.add_argument("--only", nargs="*", help="line ids")
    ap.add_argument("--whisper", default="small")
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
        for k in range(a.takes):
            seed = 1000 + k * 7919
            h = hashlib.sha1(f"{prov}|{voice_id}|{line['tts']}|{seed}".encode()).hexdigest()[:10]
            path = TAKES / f"{line['id']}_{prov}_{h}.wav"
            if not path.exists():
                t0 = time.time()
                y, sr = fn(line["tts"], spec["style_prompt"], seed)
                y = trim(y, sr)
                sf.write(path, y, sr, subtype="PCM_24")
                print(f"  {line['id']} take {k} {len(y)/sr:.2f}s audio in {time.time()-t0:.0f}s")
            m, words = analyse(str(path), line["text"], a.whisper)
            m["score"] = score(m)
            m["seed"] = seed
            m["words"] = words
            results.append(m)
            print(f"  {line['id']} take {k}: score {m['score']} wer {m['wer']} p {m['mean_word_prob']} "
                  f"f0sd {m.get('f0_std_st')} wpm {m['words_per_min_speech']} | {m['transcript']}")
        best = min(results, key=lambda r: r["score"])
        y, sr = sf.read(best["file"])
        sf.write(BEST / f"{line['id']}.wav", y, sr, subtype="PCM_24")
        log[line["id"]] = {"provider": prov, "voice": voice_id, "text": line["text"], "best": best["file"],
                           "takes": results}
        LOG.parent.mkdir(parents=True, exist_ok=True)
        LOG.write_text(json.dumps(log, ensure_ascii=False, indent=1))
        print(f"{line['id']} -> {Path(best['file']).name} (score {best['score']})")


if __name__ == "__main__":
    main()
