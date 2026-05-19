"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { FloatingHearts } from "@/components/FloatingHearts";
import { HeartExplosion } from "@/components/HeartExplosion";
import { PinkButton } from "@/components/PinkButton";
import { Puppy } from "@/components/Puppy";
import { sfx, unlockAudio } from "@/lib/sfx";
import { useGameStore } from "@/store/gameStore";

export function HugScreen() {
  const setScreen = useGameStore((s) => s.setScreen);
  const [burst, setBurst] = useState(0);
  const [hugging, setHugging] = useState(false);

  const goEasterEgg = () => {
    unlockAudio();
    setScreen("easter-egg");
  };

  const startHug = () => {
    setHugging(true);
    unlockAudio();
    sfx.heartbeat();
    sfx.heartBurst();
    setBurst((b) => b + 1);
    setTimeout(() => setScreen("easter-egg"), 1800);
  };

  return (
    <motion.div className="relative flex h-full flex-col items-center justify-center overflow-hidden bg-pink-light px-6">
      <FloatingHearts count={16} />
      <HeartExplosion trigger={burst} />

      <motion.h2
        className="hand-drawn-text relative z-10 mb-4 text-2xl"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        抱抱小狗 ❤️
      </motion.h2>

      <motion.div className="relative z-10" animate={hugging ? { scale: 1.05 } : {}}>
        <motion.div className="relative flex items-center justify-center">
          <span className="absolute -left-10 top-10 text-5xl">🤲</span>
          <Puppy size={200} eyesClosed action={hugging ? "hug" : "idle"} />
          <span className="absolute -right-10 top-10 scale-x-[-1] text-5xl">🤲</span>
        </motion.div>
      </motion.div>

      {!hugging ? (
        <motion.div className="relative z-10 mt-8 w-full space-y-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <PinkButton onClick={startHug} className="w-full">
            抱抱小狗 ❤️
          </PinkButton>

          <button
            type="button"
            onClick={goEasterEgg}
            className="w-full rounded-2xl border-2 border-dashed border-heart-red bg-cream-white py-3 font-display text-base text-heart-red shadow-cream active:scale-95"
          >
            🎁 直接进入隐藏彩蛋
          </button>

          <p className="text-center text-xs leading-relaxed text-brown-text/60">
            抱抱后会自动进入彩蛋页
            <br />
            也可点上方按钮直接去玩彩蛋
          </p>
        </motion.div>
      ) : (
        <motion.div className="relative z-10 mt-8 text-center">
          <motion.p
            className="font-display text-xl text-heart-red"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            小狗抱紧你啦 ❤️
          </motion.p>
          <motion.p
            className="mt-3 text-sm text-brown-text/70"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            正在带你去彩蛋页…
          </motion.p>
        </motion.div>
      )}
    </motion.div>
  );
}
