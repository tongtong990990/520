"use client";

import { motion } from "framer-motion";
import { FloatingHearts } from "@/components/FloatingHearts";
import { PinkButton } from "@/components/PinkButton";
import { Puppy } from "@/components/Puppy";
import { useGameStore } from "@/store/gameStore";

export function GameSuccessScreen() {
  const setScreen = useGameStore((s) => s.setScreen);

  return (
    <motion.div
      className="relative flex h-full flex-col items-center justify-between overflow-hidden bg-night-magic px-6 py-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <FloatingHearts count={18} />
      <motion.div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,120,160,0.45)_0%,transparent_55%)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 1 }}
      />

      <motion.div
        className="relative z-10 mt-8 rounded-2xl border-4 border-amber-800/30 bg-cream-white/95 px-6 py-3 shadow-lg"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", delay: 0.2 }}
      >
        <p className="font-display text-lg text-brown-text">秘密就是…</p>
      </motion.div>

      <motion.div
        className="relative z-10 flex flex-1 flex-col items-center justify-center"
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
      >
        <Puppy size={240} action="jump" />
        <motion.div
          className="mt-4 flex gap-3 text-3xl"
          animate={{ y: [0, -12, 0] }}
          transition={{ repeat: Infinity, duration: 1.2 }}
        >
          ❤️ 🌸 🦴
        </motion.div>
      </motion.div>

      <motion.div
        className="relative z-10 w-full space-y-4 pb-4"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <motion.div className="rounded-2xl border-4 border-amber-800/30 bg-cream-white/95 px-4 py-4 text-center shadow-lg">
          <p className="font-display text-base text-heart-red">
            它真的超级超级喜欢你 ❤️
          </p>
        </motion.div>
        <PinkButton onClick={() => setScreen("confession")} className="w-full">
          继续 💕
        </PinkButton>
      </motion.div>
    </motion.div>
  );
}
