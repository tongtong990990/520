"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { Puppy } from "@/components/Puppy";
import { sfx, unlockAudio, vibrate } from "@/lib/sfx";
import { useGameStore } from "@/store/gameStore";

const TAP_TARGET = 5;

export function EasterEggScreen() {
  const [tapCount, setTapCount] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [longPressMsg, setLongPressMsg] = useState(false);
  const lastTapAt = useRef(0);

  const setScreen = useGameStore((s) => s.setScreen);
  const resetGame = useGameStore((s) => s.resetGame);
  const setPuppyAction = useGameStore((s) => s.setPuppyAction);

  useEffect(() => {
    setPuppyAction("idle");
  }, [setPuppyAction]);

  const triggerReveal = useCallback(() => {
    setRevealed(true);
    setShowModal(true);
    setPuppyAction("jump");
    unlockAudio();
    sfx.bark();
    vibrate([60, 40, 60]);
    setTimeout(() => setPuppyAction("idle"), 1000);
  }, [setPuppyAction]);

  const onTapPuppy = useCallback(() => {
    if (revealed) return;

    const now = Date.now();
    if (now - lastTapAt.current < 200) return;
    lastTapAt.current = now;

    unlockAudio();
    sfx.pop();
    setPuppyAction("wag");
    setTimeout(() => setPuppyAction("idle"), 150);

    const next = tapCount + 1;
    setTapCount(next);

    if (next >= TAP_TARGET) {
      triggerReveal();
    }
  }, [revealed, tapCount, setPuppyAction, triggerReveal]);

  const onLongPress = useCallback(() => {
    if (revealed) return;
    unlockAudio();
    setLongPressMsg(true);
    sfx.heartbeat();
  }, [revealed]);

  return (
    <div className="relative flex h-full min-h-0 flex-col overflow-y-auto overflow-x-hidden bg-gradient-to-b from-[#2a1f3d] to-[#5a3a50]">
      {/* 全屏彩蛋结果 */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              className="w-full max-w-sm rounded-3xl bg-cream-white p-8 text-center shadow-2xl"
              initial={{ scale: 0.5, rotate: -5 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
            >
              <motion.p
                className="text-5xl"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1.2 }}
              >
                🐶💕
              </motion.p>
              <h2 className="mt-4 font-display text-2xl leading-relaxed text-heart-red">
                不许抛弃小狗！
              </h2>
              <p className="mt-3 text-base text-brown-text">我会一直一直陪着琪琪的 🥺</p>
              <button
                type="button"
                className="mt-6 w-full rounded-full bg-gradient-to-r from-pink-main to-heart-red py-3 font-display text-white shadow-cream"
                onClick={() => setShowModal(false)}
              >
                好啦好啦，不会丢下你 ❤️
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="shrink-0 pt-6 text-center text-sm text-pink-light">晚安，好梦呀 🌙</p>

      {/* 固定可见的彩蛋说明 — 不会被挤出屏幕 */}
      <motion.div
        className="mx-4 mt-4 shrink-0 rounded-2xl border-2 border-heart-red/60 bg-cream-white p-4 shadow-lg"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <p className="text-center font-display text-lg text-heart-red">🎁 隐藏彩蛋页</p>
        <p className="mt-2 text-center text-sm text-brown-text">
          连点下面大按钮 <span className="font-bold text-heart-red">{TAP_TARGET} 次</span>
        </p>
        <div className="mt-3 flex justify-center gap-2">
          {Array.from({ length: TAP_TARGET }, (_, i) => (
            <span
              key={i}
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                i < tapCount ? "bg-heart-red text-white" : "bg-pink-light text-brown-text/50"
              }`}
            >
              {i + 1}
            </span>
          ))}
        </div>
        {tapCount > 0 && !revealed && (
          <p className="mt-2 text-center text-sm font-bold text-heart-red">
            还差 {TAP_TARGET - tapCount} 下！
          </p>
        )}
      </motion.div>

      <motion.div className="flex shrink-0 flex-col items-center py-6">
        <Puppy size={160} eyesClosed={!revealed} action={revealed ? "happy" : "idle"} />
      </motion.div>

      {/* 超大点击按钮 — 微信最稳 */}
      <div className="shrink-0 space-y-3 px-6 pb-6">
        <button
          type="button"
          disabled={revealed}
          onClick={onTapPuppy}
          className="w-full rounded-3xl border-4 border-heart-red bg-gradient-to-b from-pink-main to-heart-red py-6 font-display text-xl text-white shadow-lg active:scale-95 disabled:opacity-50"
        >
          {revealed ? "彩蛋已解锁 ✨" : `👆 点我 (${tapCount}/${TAP_TARGET})`}
        </button>

        <button
          type="button"
          disabled={revealed}
          onMouseDown={() => {
            const t = setTimeout(onLongPress, 800);
            (window as Window & { __lp?: ReturnType<typeof setTimeout> }).__lp = t;
          }}
          onMouseUp={() => {
            const w = window as Window & { __lp?: ReturnType<typeof setTimeout> };
            if (w.__lp) clearTimeout(w.__lp);
          }}
          onTouchStart={() => {
            const t = setTimeout(onLongPress, 800);
            (window as Window & { __lp?: ReturnType<typeof setTimeout> }).__lp = t;
          }}
          onTouchEnd={() => {
            const w = window as Window & { __lp?: ReturnType<typeof setTimeout> };
            if (w.__lp) clearTimeout(w.__lp);
          }}
          className="w-full rounded-2xl border border-white/30 bg-white/10 py-3 text-sm text-white/90 active:bg-white/20"
        >
          或长按此按钮 0.8 秒 → 另一句悄悄话
        </button>

        {longPressMsg && !revealed && (
          <motion.p
            className="rounded-2xl bg-cream-white px-4 py-3 text-center font-display text-heart-red"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            不要丢下小狗好不好 🥺
          </motion.p>
        )}
      </div>

      <div className="shrink-0 pb-6 text-center">
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
    </div>
  );
}
