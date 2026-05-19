"use client";

import { Howl } from "howler";

let muted = false;
let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (muted || typeof window === "undefined") return null;
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
  gain.gain.linearRampToValueAtTime(vol, t + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(t);
  osc.stop(t + duration + 0.05);
}

function noiseBurst(duration: number, vol = 0.08, when = 0) {
  const ctx = getCtx();
  if (!ctx) return;
  const t = ctx.currentTime + when;
  const bufferSize = Math.floor(ctx.sampleRate * duration);
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
  }
  const src = ctx.createBufferSource();
  src.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 800;
  filter.Q.value = 0.8;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(vol, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
  src.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  src.start(t);
  src.stop(t + duration);
}

/** 可爱小狗「汪」— 三音节 woof */
function playWang(variant: "short" | "happy" | "loud" = "short") {
  const ctx = getCtx();
  if (!ctx) return;

  const vol = variant === "loud" ? 0.28 : variant === "happy" ? 0.24 : 0.2;

  // 汪 — 第一声（低沉起音）
  tone(320, 0.1, "sawtooth", vol * 0.7, 0, 180);
  noiseBurst(0.06, vol * 0.35, 0);

  // 汪 — 第二声
  tone(280, 0.12, "triangle", vol * 0.85, 0.09, 200);
  noiseBurst(0.05, vol * 0.25, 0.09);

  // 第三声（happy/loud 才有尾音，更像「汪汪~」）
  if (variant !== "short") {
    tone(360, 0.14, "sine", vol * 0.6, 0.2, 240);
    noiseBurst(0.04, vol * 0.2, 0.2);
  }

  tryHowl("/sounds/bark.mp3", { volume: vol });
}

function tryHowl(src: string, opts?: { volume?: number }) {
  if (muted) return;
  try {
    const h = new Howl({ src: [src], volume: opts?.volume ?? 0.45, html5: true });
    h.play();
  } catch {
    /* 使用合成音 */
  }
}

export const sfx = {
  setMuted: (m: boolean) => {
    muted = m;
  },

  /** 轻触反馈 — 短汪 */
  pop: () => playWang("short"),

  /** 收集爱心 — 叮 + 短汪 */
  ding: () => {
    tone(880, 0.08, "sine", 0.12);
    setTimeout(() => tone(1320, 0.1, "sine", 0.1), 60);
    setTimeout(() => playWang("short"), 100);
  },

  /** 小狗叫 — 汪汪 */
  bark: () => playWang("happy"),

  /** 爱心爆炸 — 汪 + 啵 */
  heartBurst: () => {
    playWang("happy");
    tone(520, 0.06, "sine", 0.1, 0.15);
    tone(780, 0.08, "sine", 0.08, 0.22);
  },

  /** 抱抱 — 轻柔汪 + 心跳 */
  heartbeat: () => {
    playWang("short");
    tone(72, 0.12, "sine", 0.22, 0.1);
    setTimeout(() => tone(72, 0.1, "sine", 0.18, 0.35), 280);
  },

  /** 告白「汪！」— 响亮汪 */
  wang: () => playWang("loud"),

  bgm: null as Howl | null,

  playBgm: () => {
    if (muted || typeof window === "undefined") return;
    try {
      if (!sfx.bgm) {
        sfx.bgm = new Howl({
          src: ["/sounds/bgm.mp3"],
          loop: true,
          volume: 0.2,
          html5: true,
        });
      }
      if (!sfx.bgm.playing()) void sfx.bgm.play();
    } catch {
      /* 无 BGM 文件时静默 */
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
