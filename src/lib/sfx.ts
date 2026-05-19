"use client";

import { Howl } from "howler";

let muted = false;

function beep(freq: number, duration: number, type: OscillatorType = "sine", vol = 0.15) {
  if (muted || typeof window === "undefined") return;
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.value = vol;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
    setTimeout(() => ctx.close(), duration * 1000 + 100);
  } catch {
    /* ignore */
  }
}

function tryHowl(src: string, opts?: { volume?: number; rate?: number }) {
  if (muted) return;
  try {
    const h = new Howl({ src: [src], volume: opts?.volume ?? 0.5, rate: opts?.rate ?? 1 });
    h.play();
  } catch {
    /* fallback below */
  }
}

export const sfx = {
  setMuted: (m: boolean) => {
    muted = m;
  },

  /** 点击按钮 - 啵 */
  pop: () => {
    tryHowl("/sounds/pop.mp3");
    beep(520, 0.08, "sine", 0.12);
  },

  /** 收集爱心 - 叮 */
  ding: () => {
    tryHowl("/sounds/ding.mp3");
    beep(880, 0.12, "sine", 0.14);
    setTimeout(() => beep(1100, 0.1, "sine", 0.1), 80);
  },

  /** 小狗叫 - 汪 */
  bark: () => {
    tryHowl("/sounds/bark.mp3");
    beep(180, 0.15, "square", 0.08);
    setTimeout(() => beep(220, 0.12, "square", 0.06), 100);
  },

  /** 爱心爆炸 */
  heartBurst: () => {
    tryHowl("/sounds/heart-burst.mp3");
    beep(660, 0.06, "triangle", 0.1);
    setTimeout(() => beep(990, 0.08, "triangle", 0.1), 60);
  },

  /** 抱抱 - 心跳 */
  heartbeat: () => {
    tryHowl("/sounds/heartbeat.mp3");
    beep(90, 0.1, "sine", 0.2);
    setTimeout(() => beep(90, 0.1, "sine", 0.18), 280);
  },

  bgm: null as Howl | null,

  playBgm: () => {
    if (muted || typeof window === "undefined") return;
    try {
      if (!sfx.bgm) {
        sfx.bgm = new Howl({
          src: ["/sounds/bgm.mp3"],
          loop: true,
          volume: 0.25,
        });
      }
      if (!sfx.bgm.playing()) sfx.bgm.play();
    } catch {
      /* no bgm file */
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
