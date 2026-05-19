"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { LongPressZone } from "@/components/LongPressZone";
import { Puppy } from "@/components/Puppy";
import { sfx } from "@/lib/sfx";
import { useGameStore } from "@/store/gameStore";

export function EasterEggScreen() {
  const [longPressMsg, setLongPressMsg] = useState(false);
  const setScreen = useGameStore((s) => s.setScreen);
  const resetGame = useGameStore((s) => s.resetGame);

  return (
    <motion.div className="relative flex h-full flex-col items-center justify-between overflow-hidden bg-gradient-to-b from-[#2a1f3d] to-[#4a3558] px-6 py-10">
      <div className="pointer-events-none absolute right-8 top-16 h-16 w-10 rounded-full bg-amber-200/25 blur-md" />
      <div className="pointer-events-none absolute left-4 top-10 flex gap-1 opacity-60">
        {["🎀", "💕", "✨"].map((e) => (
          <span key={e} className="text-sm">
            {e}
          </span>
        ))}
      </div>

      <p className="relative z-10 mt-2 text-center text-sm text-pink-light/90">晚安，好梦呀 🌙</p>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center">
        <motion.div
          className="mb-4 min-h-[2.5rem] text-center"
          animate={{ opacity: longPressMsg ? 1 : 0.6 }}
        >
          {longPressMsg ? (
            <motion.p
              className="rounded-2xl bg-cream-white/95 px-5 py-3 font-display text-base text-brown-text shadow-lg"
              initial={{ scale: 0.9, y: 8 }}
              animate={{ scale: 1, y: 0 }}
            >
              不要丢下小狗好不好 🥺
            </motion.p>
          ) : (
            <p className="text-sm text-pink-light/80">长按小狗，可以有惊喜喔~</p>
          )}
        </motion.div>

        <LongPressZone
          className="rounded-3xl bg-pink-main/15 p-8"
          durationMs={800}
          hint="长按小狗"
          onLongPress={() => {
            setLongPressMsg(true);
            sfx.heartbeat();
          }}
        >
          <Puppy size={200} eyesClosed action="idle" />
        </LongPressZone>

        <p className="mt-5 rounded-2xl bg-white/15 px-4 py-2 text-sm text-white/85">
          💭 汪… 好困但好幸福
        </p>
      </div>

      <div className="relative z-10 w-full pb-2 text-center">
        <button
          type="button"
          onClick={() => {
            resetGame();
            setScreen("opening");
          }}
          className="text-xs text-white/50 underline"
        >
          再看一遍
        </button>
      </div>
    </motion.div>
  );
}
