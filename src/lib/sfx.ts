"use client";

import { Howl } from "howler";

let muted = false;
let audioCtx: AudioContext | null = null;
let unlocked = false;

/** 微信 / 手机必须在用户点击时同步调用 */
export function unlockAudio(): boolean {
  if (muted || typeof window === "undefined") return false;
  try {
    if (!audioCtx) audioCtx = new AudioContext();
    if (audioCtx.state === "suspended") {
      void audioCtx.resume();
    }
    unlocked = true;
    return true;
  } catch {
    return false;
  }
}

function getCtx(): AudioContext | null {
  if (muted || typeof window === "undefined") return null;
  if (!unlocked) unlockAudio();
  try {
    if (!audioCtx) audioCtx = new AudioContext();
    if (audioCtx.state === "suspended") void audioCtx.resume();
    return audioCtx;
  } catch {
    return null;
  }
}

function tone(
  freq: number,
  duration: number,
  type: OscillatorType = "sine",
  vol = 0.2,
  when = 0,
  pitchEnd?: number,
) {
  const ctx = getCtx();
  if (!ctx) return;
  const t = ctx.currentTime + when;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  if (pitchEnd != null) {
    osc.frequency.exponentialRampToValueAtTime(Math.max(pitchEnd, 40), t + duration);
  }
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(vol, t + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(t);
  osc.stop(t + duration + 0.05);
}

function noiseBurst(duration: number, vol = 0.1, when = 0) {
  const ctx = getCtx();
  if (!ctx) return;
  const t = ctx.currentTime + when;
  const bufferSize = Math.max(1, Math.floor(ctx.sampleRate * duration));
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
  }
  const src = ctx.createBufferSource();
  src.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 900;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(vol, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
  src.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  src.start(t);
  src.stop(t + duration);
}

/** 可爱「汪汪」 */
function playWang(variant: "short" | "happy" | "loud" = "short") {
  unlockAudio();
  const vol = variant === "loud" ? 0.32 : variant === "happy" ? 0.26 : 0.22;

  tone(300, 0.11, "sawtooth", vol * 0.75, 0, 160);
  noiseBurst(0.07, vol * 0.4, 0);

  tone(260, 0.13, "triangle", vol * 0.9, 0.1, 190);
  noiseBurst(0.06, vol * 0.3, 0.1);

  if (variant !== "short") {
    tone(340, 0.15, "sine", vol * 0.65, 0.22, 230);
    noiseBurst(0.05, vol * 0.22, 0.22);
  }
}

function tryHowl(src: string, opts?: { volume?: number }) {
  if (muted) return;
  try {
    const base = typeof window !== "undefined" ? window.location.pathname.replace(/\/$/, "") : "";
    const prefix = base.endsWith("/520") || base === "/520" ? "/520" : "";
    const h = new Howl({
      src: [`${prefix}${src}`],
      volume: opts?.volume ?? 0.5,
      html5: true,
    });
    h.play();
  } catch {
    /* 合成音兜底 */
  }
}

export const sfx = {
  setMuted: (m: boolean) => {
    muted = m;
  },

  pop: () => {
    unlockAudio();
    playWang("short");
  },

  ding: () => {
    unlockAudio();
    tone(880, 0.08, "sine", 0.14);
    tone(1320, 0.1, "sine", 0.1, 0.07);
    playWang("short");
  },

  bark: () => {
    unlockAudio();
    playWang("happy");
  },

  heartBurst: () => {
    unlockAudio();
    playWang("happy");
    tone(520, 0.06, "sine", 0.1, 0.12);
  },

  heartbeat: () => {
    unlockAudio();
    playWang("short");
    tone(72, 0.12, "sine", 0.24, 0.08);
    tone(72, 0.1, "sine", 0.2, 0.32);
  },

  wang: () => {
    unlockAudio();
    playWang("loud");
  },

  bgm: null as Howl | null,

  playBgm: () => {
    if (muted) return;
    unlockAudio();
    try {
      const base = typeof window !== "undefined" ? window.location.pathname.replace(/\/$/, "") : "";
      const prefix = base.endsWith("/520") || base === "/520" ? "/520" : "";
      if (!sfx.bgm) {
        sfx.bgm = new Howl({
          src: [`${prefix}/sounds/bgm.mp3`],
          loop: true,
          volume: 0.18,
          html5: true,
        });
      }
      if (!sfx.bgm.playing()) void sfx.bgm.play();
    } catch {
      /* ignore */
    }
  },

  stopBgm: () => {
    sfx.bgm?.stop();
  },
};

export function vibrate(pattern: number | number[] = 40) {
  if (typeof navigator !== "undefined" && navigator.vibrate) {
    navigator.vibrate(pattern);
  }
}
