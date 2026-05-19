"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { APP_VERSION } from "@/components/VersionBadge";
import { FloatingHearts } from "@/components/FloatingHearts";
import { HeartExplosion } from "@/components/HeartExplosion";
import { PinkButton } from "@/components/PinkButton";
import { Puppy } from "@/components/Puppy";
import { SoftGlow } from "@/components/SoftGlow";
import { StatusBar } from "@/components/StatusBar";
import { sfx, unlockAudio } from "@/lib/sfx";
import { useGameStore } from "@/store/gameStore";

export function OpeningScreen() {
  const setScreen = useGameStore((s) => s.setScreen);
  const [burst, setBurst] = useState(0);
  const [soundOk, setSoundOk] = useState(false);

  const testSound = () => {
    unlockAudio();
    sfx.wang();
    setSoundOk(true);
  };

  const openLetter = () => {
    unlockAudio();
    sfx.heartBurst();
    setBurst((b) => b + 1);
    setTimeout(() => setScreen("interaction"), 900);
  };

  return (
    <motion.div className="relative flex h-full flex-col overflow-hidden bg-pink-light">
      <StatusBar />
      <SoftGlow />
      <FloatingHearts count={14} />

      <motion.span
        className="absolute left-3 top-12 z-20 rounded-full bg-heart-red px-2 py-0.5 text-[10px] font-bold text-white"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        最新 v{APP_VERSION}
      </motion.span>

      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="pointer-events-none absolute rounded-full bg-white/50 blur-sm"
          style={{
            width: 80 + i * 30,
            height: 40 + i * 10,
            top: `${20 + i * 12}%`,
            left: i === 1 ? "60%" : "10%",
          }}
          animate={{ x: [0, 20, 0] }}
          transition={{ repeat: Infinity, duration: 8 + i * 2, ease: "easeInOut" }}
        />
      ))}

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-cream-white/80 to-transparent" />

      <motion.div
        className="relative z-10 px-6 pt-2 text-center"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="text-xs text-brown-text/60">一只永远陪着琪琪的小狗 ❤️</p>
        <h1 className="hand-drawn-text mt-3 text-xl leading-relaxed">
          有一只小狗，
          <br />
          偷偷给你送来了一封信。
        </h1>
        <p className="mt-3 inline-block rounded-full bg-cream-white/70 px-4 py-1 text-sm text-heart-red">
          它已经等你好久啦 🐶
        </p>
      </motion.div>

      <motion.div
        className="relative z-10 flex flex-1 flex-col items-center justify-center"
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.25 }}
      >
        <HeartExplosion trigger={burst} />
        <Puppy size={240} holdingEnvelope action="idle" tongueOut />
      </motion.div>

      <motion.div
        className="relative z-10 w-full space-y-3 px-6 pb-8"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <button
          type="button"
          onClick={testSound}
          className="w-full rounded-full border-2 border-dashed border-heart-red/50 bg-cream-white/90 py-2.5 text-sm font-medium text-heart-red active:scale-95"
        >
          {soundOk ? "🔊 汪汪！听到了吗~" : "🔊 先点这里试听音乐（微信必点）"}
        </button>
        <PinkButton onClick={openLetter} className="w-full">
          点我拆开 ✨
        </PinkButton>
      </motion.div>
    </motion.div>
  );
}
