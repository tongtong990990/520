"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { FloatingHearts } from "@/components/FloatingHearts";
import { Puppy } from "@/components/Puppy";
import { SoftGlow } from "@/components/SoftGlow";
import { sfx } from "@/lib/sfx";
import { useGameStore } from "@/store/gameStore";

const menuItems = [
  {
    id: "pat",
    icon: "🤚",
    title: "摸摸头",
    desc: "被你摸摸头，它开心得想转圈圈。",
    action: "spin" as const,
    eyesClosed: true,
    next: null,
  },
  {
    id: "feed",
    icon: "🍪",
    title: "喂小零食",
    desc: "这是专门送给你的甜 ❤️",
    action: "jump" as const,
    eyesClosed: false,
    next: null,
  },
  {
    id: "envelope",
    icon: "💌",
    title: "打开信封",
    desc: "看看它想对你说什么吧",
    action: "lunge" as const,
    eyesClosed: false,
    next: "game" as const,
  },
];

export function InteractionScreen() {
  const { setScreen, setPuppyAction, puppyAction, tapPuppy, kissEasterEggShown, setKissEasterEggShown } =
    useGameStore();
  const [kissToast, setKissToast] = useState(false);

  const handlePuppyTap = () => {
    const count = tapPuppy();
    if (count >= 5 && !kissEasterEggShown) {
      setKissEasterEggShown();
      setKissToast(true);
      sfx.pop();
      setTimeout(() => setKissToast(false), 2500);
    }
  };

  const handleMenu = (item: (typeof menuItems)[0]) => {
    sfx.pop();
    setPuppyAction(item.action);
    if (item.next) {
      setTimeout(() => {
        setPuppyAction("idle");
        setScreen(item.next!);
      }, item.action === "lunge" ? 650 : 950);
    } else {
      setTimeout(() => setPuppyAction("tongue"), 950);
    }
  };

  return (
    <motion.div className="relative flex h-full flex-col overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-cream-white via-pink-light to-pink-main/40">
        <div className="absolute right-6 top-20 h-28 w-14 rounded-full bg-amber-100/70 blur-[2px]" />
        <motion.div
          className="absolute right-10 top-16 h-3 w-3 rounded-full bg-amber-200"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 2 }}
        />
        <motion.div className="absolute left-6 top-24 h-16 w-14 rounded-xl border-4 border-white/80 bg-pink-light/80" />
        <div className="absolute bottom-28 left-4 text-2xl opacity-70">🦴</div>
        <div className="absolute bottom-32 right-8 text-2xl opacity-70">💕</div>
        <div className="absolute bottom-20 left-0 right-0 h-20 bg-gradient-to-t from-pink-main/30 to-transparent" />
      </div>

      <SoftGlow color="rgba(255, 200, 190, 0.4)" />
      <FloatingHearts count={6} variant="mixed" />

      <motion.h2
        className="hand-drawn-text relative z-10 px-6 pt-8 text-center text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        它有好多话想对你说…
      </motion.h2>

      <motion.div
        className="relative z-10 flex flex-1 flex-col items-center justify-end pb-2"
        onClick={handlePuppyTap}
      >
        <AnimatePresence>
          {kissToast && (
            <motion.p
              className="absolute top-8 z-20 rounded-2xl bg-cream-white px-4 py-2 font-display text-heart-red shadow-cream"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              小狗偷偷亲了你一下 🐶❤️
            </motion.p>
          )}
        </AnimatePresence>
        <Puppy
          size={200}
          action={puppyAction}
          tongueOut={puppyAction === "tongue" || puppyAction === "idle"}
          eyesClosed={puppyAction === "spin"}
        />
      </motion.div>

      <motion.div className="relative z-10 space-y-3 px-5 pb-8">
        {menuItems.map((item, i) => (
          <motion.button
            key={item.id}
            type="button"
            className="cream-card flex w-full items-center gap-4 p-4 text-left"
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + i * 0.08 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleMenu(item)}
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-light text-2xl">
              {item.icon}
            </span>
            <span>
              <span className="block font-bold text-brown-text">{item.title}</span>
              <span className="text-xs text-brown-text/70">{item.desc}</span>
            </span>
          </motion.button>
        ))}
      </motion.div>
    </motion.div>
  );
}
