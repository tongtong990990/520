"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { FloatingHearts } from "@/components/FloatingHearts";
import { PinkButton } from "@/components/PinkButton";
import { Puppy } from "@/components/Puppy";
import { SoftGlow } from "@/components/SoftGlow";
import { TypewriterText } from "@/components/TypewriterText";
import { sfx, vibrate } from "@/lib/sfx";
import { useGameStore } from "@/store/gameStore";

const LINES = [
  "我爱你 ❤️",
  "琪琪520快乐鸭 🦆",
  "我永远在你身边",
  "我一定要好好保护你",
  "天天开心鸭 ✨",
  "汪！🐶",
  "爱你妈妈 ❤️",
  "我永远是你的小狗 🐾",
];

export function ConfessionScreen() {
  const setScreen = useGameStore((s) => s.setScreen);
  const setPuppyAction = useGameStore((s) => s.setPuppyAction);
  const puppyAction = useGameStore((s) => s.puppyAction);
  const [phase, setPhase] = useState<"gift" | "text">("gift");
  const [showSkip, setShowSkip] = useState(true);
  const [showPuppyBubble, setShowPuppyBubble] = useState(false);

  const handleLine = (index: number) => {
    if (LINES[index] === "汪！🐶") {
      sfx.wang();
      vibrate([50, 30, 50]);
      setPuppyAction("jump");
      setShowPuppyBubble(true);
      setTimeout(() => setPuppyAction("idle"), 600);
    }
    if (index === LINES.length - 1) {
      setShowPuppyBubble(true);
    }
  };

  const handleAllComplete = () => {
    setPuppyAction("lunge");
    sfx.heartBurst();
    setTimeout(() => setScreen("hug"), 1200);
  };

  if (phase === "gift") {
    return (
      <motion.div className="relative flex h-full flex-col items-center justify-end overflow-hidden px-6 pb-10">
        <SoftGlow color="rgba(255, 150, 180, 0.55)" />
        <FloatingHearts count={22} />

        {[...Array(5)].map((_, i) => (
          <motion.span
            key={i}
            className="pointer-events-none absolute text-3xl"
            style={{ left: `${12 + i * 16}%`, top: `${8 + (i % 2) * 12}%` }}
            animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.6, 1, 0.6] }}
            transition={{ repeat: Infinity, duration: 2 + i * 0.2, delay: i * 0.15 }}
          >
            🎆
          </motion.span>
        ))}

        <motion.div
          className="relative z-10 flex flex-1 flex-col items-center justify-center"
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <Puppy size={200} holdingHeart inGiftBox action="happy" />
          <motion.p
            className="mt-6 font-display text-2xl text-heart-red"
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ repeat: Infinity, duration: 2.2 }}
          >
            琪琪520快乐鸭 🦆
          </motion.p>
        </motion.div>

        <PinkButton onClick={() => setPhase("text")} className="relative z-10 w-full">
          打开告白信 💌
        </PinkButton>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="relative flex h-full flex-col overflow-hidden bg-paper-scroll"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {showSkip && (
        <button
          type="button"
          className="absolute right-4 top-4 z-30 rounded-full bg-cream-white/80 px-3 py-1 text-xs text-brown-text/70"
          onClick={() => {
            setPuppyAction("lunge");
            setTimeout(() => setScreen("hug"), 800);
          }}
        >
          跳过
        </button>
      )}

      <FloatingHearts count={8} />

      <motion.div
        className="relative z-10 mx-5 mt-14 flex-1 overflow-y-auto rounded-3xl border border-white/80 bg-cream-white/75 p-6 shadow-cream backdrop-blur-sm"
        onScroll={() => setShowSkip(false)}
      >
        <div className="mb-4 text-center text-2xl">📎</div>
        <TypewriterText
          lines={LINES}
          onLineComplete={handleLine}
          onAllComplete={handleAllComplete}
          speedMs={50}
        />
      </motion.div>

      <div className="pointer-events-none relative z-20 flex flex-col items-center justify-end pb-2 pt-2">
        <AnimatePresence>
          {showPuppyBubble && (
            <motion.div
              className="relative mb-2 max-w-[220px]"
              initial={{ opacity: 0, y: 12, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 280, damping: 22 }}
            >
              <motion.div
                className="rounded-2xl border-2 border-pink-main/40 bg-cream-white px-5 py-3 text-center shadow-lg"
                animate={{ scale: [1, 1.03, 1] }}
                transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
              >
                <p className="font-display text-base leading-snug text-heart-red">
                  不许抛弃小狗 🥺
                </p>
              </motion.div>
              <motion.div
                className="absolute -bottom-2 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-b-2 border-r-2 border-pink-main/30 bg-cream-white"
                aria-hidden
              />
            </motion.div>
          )}
        </AnimatePresence>
        <Puppy size={130} className="-mb-6" action={puppyAction} />
      </div>
    </motion.div>
  );
}
