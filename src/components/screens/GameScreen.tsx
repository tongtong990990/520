"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { FloatingHearts } from "@/components/FloatingHearts";

const HeartCatchGame = dynamic(
  () => import("@/game/HeartCatchGame").then((m) => m.HeartCatchGame),
  {
    ssr: false,
    loading: () => (
      <div className="flex flex-1 items-center justify-center font-display text-heart-red">
        游戏加载中…
      </div>
    ),
  },
);

export function GameScreen() {
  return (
    <motion.div className="relative flex h-full flex-col overflow-hidden bg-pink-light">
      <FloatingHearts count={5} variant="sparkle" />
      <div className="pointer-events-none absolute bottom-24 left-0 right-0 z-0 h-6 border-t-4 border-white/90" />
      <HeartCatchGame />
    </motion.div>
  );
}
