"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";
import { LongPressZone } from "@/components/LongPressZone";
import { Puppy } from "@/components/Puppy";
import { sfx, vibrate } from "@/lib/sfx";
import { useGameStore } from "@/store/gameStore";

const TAP_TARGET = 5;

export function EasterEggScreen() {
  const [longPressMsg, setLongPressMsg] = useState(false);
  const [fiveTapMsg, setFiveTapMsg] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const tapResetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setScreen = useGameStore((s) => s.setScreen);
  const resetGame = useGameStore((s) => s.resetGame);
  const setPuppyAction = useGameStore((s) => s.setPuppyAction);
  const puppyAction = useGameStore((s) => s.puppyAction);

  const handleQuickTap = () => {
    if (fiveTapMsg) return;

    if (tapResetTimer.current) clearTimeout(tapResetTimer.current);
    tapResetTimer.current = setTimeout(() => setTapCount(0), 2000);

    const next = tapCount + 1;
    setTapCount(next);
    sfx.pop();

    if (next >= TAP_TARGET) {
      setFiveTapMsg(true);
      setTapCount(0);
      setPuppyAction("jump");
      sfx.bark();
      vibrate([40, 30, 40]);
      if (tapResetTimer.current) clearTimeout(tapResetTimer.current);
      setTimeout(() => setPuppyAction("idle"), 800);
    }
  };

  const topHint = fiveTapMsg
    ? null
    : longPressMsg
      ? "不要丢下小狗好不好 🥺"
      : tapCount > 0
        ? `再点 ${TAP_TARGET - tapCount} 下~`
        : "连点小狗 5 下 · 长按有惊喜";

  return (
    <motion.div className="relative flex h-full flex-col items-center justify-between overflow-hidden bg-gradient-to-b from-[#2a1f3d] to-[#4a3558] px-6 py-10">
      <div className="pointer-events-none absolute right-8 top-16 h-16 w-10 rounded-full bg-amber-200/25 blur-md" />
      <motion.div className="pointer-events-none absolute left-4 top-10 flex gap-1 opacity-60">
        {["🎀", "💕", "✨"].map((e) => (
          <span key={e} className="text-sm">
            {e}
          </span>
        ))}
      </motion.div>

      <p className="relative z-10 mt-2 text-center text-sm text-pink-light/90">晚安，好梦呀 🌙</p>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center">
        <motion.div className="mb-4 min-h-[3rem] w-full text-center">
          <AnimatePresence mode="wait">
            {fiveTapMsg ? (
              <motion.div
                key="five-tap"
                className="relative mx-auto max-w-[280px]"
                initial={{ scale: 0.8, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <div className="absolute -top-2 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 bg-cream-white" />
                <p className="rounded-2xl bg-cream-white px-5 py-4 font-display text-lg text-heart-red shadow-lg">
                  不许抛弃小狗 🥺
                </p>
              </motion.div>
            ) : longPressMsg ? (
              <motion.p
                key="long-press"
                className="rounded-2xl bg-cream-white/95 px-5 py-3 font-display text-base text-brown-text shadow-lg"
                initial={{ scale: 0.9, y: 8 }}
                animate={{ scale: 1, y: 0 }}
              >
                不要丢下小狗好不好 🥺
              </motion.p>
            ) : (
              <motion.p
                key="hint"
                className="text-sm text-pink-light/80"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {topHint}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        <LongPressZone
          className="rounded-3xl bg-pink-main/15 p-8"
          durationMs={800}
          hint="点击或长按小狗"
          onQuickTap={handleQuickTap}
          onLongPress={() => {
            if (fiveTapMsg) return;
            setLongPressMsg(true);
            sfx.heartbeat();
          }}
        >
          <Puppy
            size={200}
            eyesClosed={!fiveTapMsg}
            action={fiveTapMsg ? "jump" : puppyAction}
          />
        </LongPressZone>

        {!fiveTapMsg && (
          <p className="mt-5 rounded-2xl bg-white/15 px-4 py-2 text-sm text-white/85">
            💭 汪… 好困但好幸福
          </p>
        )}
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
