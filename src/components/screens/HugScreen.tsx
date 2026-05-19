"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { FloatingHearts } from "@/components/FloatingHearts";
import { HeartExplosion } from "@/components/HeartExplosion";
import { PinkButton } from "@/components/PinkButton";
import { Puppy } from "@/components/Puppy";
import { sfx } from "@/lib/sfx";
import { useGameStore } from "@/store/gameStore";

export function HugScreen() {
  const setScreen = useGameStore((s) => s.setScreen);
  const [burst, setBurst] = useState(0);
  const [hugging, setHugging] = useState(false);

  const startHug = () => {
    setHugging(true);
    sfx.heartbeat();
    sfx.heartBurst();
    setBurst((b) => b + 1);
    setTimeout(() => setScreen("easter-egg"), 2200);
  };

  return (
    <motion.div className="relative flex h-full flex-col items-center justify-center overflow-hidden bg-pink-light px-6">
      <FloatingHearts count={16} />
      <HeartExplosion trigger={burst} />

      <motion.h2
        className="hand-drawn-text relative z-10 mb-6 text-2xl"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        抱抱小狗 ❤️
      </motion.h2>

      <motion.div className="relative z-10" animate={hugging ? { scale: 1.05 } : {}}>
        <div className="relative flex items-center justify-center">
          <motion.span
            className="absolute -left-10 top-10 text-5xl"
            animate={{ x: hugging ? [0, 12, 8] : [0, 8, 0] }}
            transition={{ repeat: hugging ? 0 : Infinity, duration: 2 }}
          >
            🤲
          </motion.span>
          <Puppy size={220} eyesClosed action={hugging ? "hug" : "idle"} />
          <motion.span
            className="absolute -right-10 top-10 scale-x-[-1] text-5xl"
            animate={{ x: hugging ? [0, -12, -8] : [0, -8, 0] }}
            transition={{ repeat: hugging ? 0 : Infinity, duration: 2 }}
          >
            🤲
          </motion.span>
        </div>
      </motion.div>

      {!hugging ? (
        <motion.div className="relative z-10 mt-10 w-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <PinkButton onClick={startHug} className="w-full">
            抱抱小狗 ❤️
          </PinkButton>
          <p className="mt-4 text-center text-xs leading-relaxed text-brown-text/60">
            点击后小狗会抱紧你喔
            <br />
            <span className="text-heart-red">抱抱完成 → 彩蛋页连点小狗 5 次</span>
          </p>
        </motion.div>
      ) : (
        <motion.p
          className="relative z-10 mt-10 font-display text-xl text-heart-red"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          小狗抱紧你啦 ❤️
        </motion.p>
      )}
    </motion.div>
  );
}
