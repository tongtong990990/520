"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useRef, useState } from "react";
import { Puppy } from "@/components/Puppy";
import { sfx, vibrate } from "@/lib/sfx";
import { useGameStore } from "@/store/gameStore";

const TAP_TARGET = 5;
const LONG_PRESS_MS = 900;
const TAP_RESET_MS = 2500;

export function EasterEggScreen() {
  const [longPressMsg, setLongPressMsg] = useState(false);
  const [fiveTapMsg, setFiveTapMsg] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const [pressing, setPressing] = useState(false);

  const tapCountRef = useRef(0);
  const tapResetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressFiredRef = useRef(false);
  const blockClickRef = useRef(false);

  const setScreen = useGameStore((s) => s.setScreen);
  const resetGame = useGameStore((s) => s.resetGame);
  const setPuppyAction = useGameStore((s) => s.setPuppyAction);
  const puppyAction = useGameStore((s) => s.puppyAction);

  const resetTapCount = useCallback(() => {
    tapCountRef.current = 0;
    setTapCount(0);
  }, []);

  const registerTap = useCallback(() => {
    if (fiveTapMsg || longPressMsg) return;

    if (tapResetTimer.current) clearTimeout(tapResetTimer.current);
    tapResetTimer.current = setTimeout(resetTapCount, TAP_RESET_MS);

    tapCountRef.current += 1;
    const next = tapCountRef.current;
    setTapCount(next);
    sfx.pop();
    setPuppyAction("wag");
    setTimeout(() => setPuppyAction("idle"), 200);

    if (next >= TAP_TARGET) {
      setFiveTapMsg(true);
      resetTapCount();
      setPuppyAction("jump");
      sfx.bark();
      vibrate([50, 40, 50]);
      if (tapResetTimer.current) clearTimeout(tapResetTimer.current);
      setTimeout(() => setPuppyAction("idle"), 900);
    }
  }, [fiveTapMsg, longPressMsg, resetTapCount, setPuppyAction]);

  const handleTap = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (blockClickRef.current) return;
      registerTap();
    },
    [registerTap],
  );

  const startLongPress = useCallback(() => {
    if (fiveTapMsg) return;
    longPressFiredRef.current = false;
    setPressing(true);
    longPressTimer.current = setTimeout(() => {
      longPressFiredRef.current = true;
      blockClickRef.current = true;
      setPressing(false);
      setLongPressMsg(true);
      sfx.heartbeat();
      setTimeout(() => {
        blockClickRef.current = false;
      }, 400);
    }, LONG_PRESS_MS);
  }, [fiveTapMsg]);

  const endLongPress = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    setPressing(false);
  }, []);

  return (
    <motion.div className="relative flex h-full flex-col items-center justify-between overflow-hidden bg-gradient-to-b from-[#2a1f3d] to-[#4a3558] px-6 py-8">
      <div className="pointer-events-none absolute right-8 top-16 h-16 w-10 rounded-full bg-amber-200/25 blur-md" />
      <div className="pointer-events-none absolute left-4 top-10 flex gap-1 opacity-60">
        {["🎀", "💕", "✨"].map((e) => (
          <span key={e} className="text-sm">
            {e}
          </span>
        ))}
      </div>

      <p className="relative z-10 mt-2 text-center text-sm text-pink-light/90">晚安，好梦呀 🌙</p>

      {/* 彩蛋提示条 */}
      {!fiveTapMsg && !longPressMsg && (
        <motion.div
          className="relative z-20 mx-2 mt-3 w-full max-w-sm rounded-2xl border border-pink-main/40 bg-cream-white/95 px-4 py-3 shadow-lg"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-center font-display text-sm text-heart-red">🎁 隐藏彩蛋</p>
          <p className="mt-1 text-center text-xs leading-relaxed text-brown-text/80">
            快速连点小狗 <strong className="text-heart-red">5 次</strong>
            <br />
            或 <strong className="text-heart-red">长按</strong> 小狗约 1 秒
          </p>
          <motion.div className="mt-3 flex justify-center gap-2">
            {Array.from({ length: TAP_TARGET }, (_, i) => (
              <motion.span
                key={i}
                className={`h-3 w-3 rounded-full ${
                  i < tapCount ? "bg-heart-red scale-110" : "bg-pink-main/50"
                }`}
                animate={i < tapCount ? { scale: [1, 1.3, 1] } : {}}
              />
            ))}
          </motion.div>
          {tapCount > 0 && (
            <p className="mt-2 text-center text-xs font-medium text-heart-red">
              再点 {TAP_TARGET - tapCount} 下就触发啦 ✨
            </p>
          )}
        </motion.div>
      )}

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center">
        <motion.div className="mb-3 min-h-[4rem] w-full px-2 text-center">
          <AnimatePresence mode="wait">
            {fiveTapMsg ? (
              <motion.div
                key="five-tap"
                className="relative mx-auto max-w-[300px]"
                initial={{ scale: 0.8, opacity: 0, y: 12 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
              >
                <motion.div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 text-2xl"
                  animate={{ y: [0, -6, 0] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                >
                  💬
                </motion.div>
                <p className="rounded-2xl bg-cream-white px-5 py-4 font-display text-xl text-heart-red shadow-lg">
                  不许抛弃小狗 🥺
                </p>
              </motion.div>
            ) : longPressMsg ? (
              <motion.p
                key="long-press"
                className="rounded-2xl bg-cream-white/95 px-5 py-3 font-display text-base text-brown-text shadow-lg"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
              >
                不要丢下小狗好不好 🥺
              </motion.p>
            ) : null}
          </AnimatePresence>
        </motion.div>

        {/* 可点击小狗区域：onClick 兼容微信 / 手机 */}
        <motion.button
          type="button"
          aria-label="点击或长按小狗触发彩蛋"
          className="relative rounded-3xl border-2 border-dashed border-pink-main/50 bg-pink-main/20 p-8 outline-none active:scale-[0.98]"
          onClick={handleTap}
          onTouchStart={() => startLongPress()}
          onTouchEnd={() => endLongPress()}
          onMouseDown={startLongPress}
          onMouseUp={endLongPress}
          onMouseLeave={endLongPress}
          onContextMenu={(e) => e.preventDefault()}
          animate={
            pressing
              ? { scale: 0.97, boxShadow: "0 0 0 4px rgba(255,92,122,0.35)" }
              : { scale: [1, 1.02, 1] }
          }
          transition={
            pressing
              ? { duration: 0.15 }
              : { repeat: Infinity, duration: 2.5, ease: "easeInOut" }
          }
        >
          {pressing && !fiveTapMsg && (
            <motion.div
              className="pointer-events-none absolute inset-2 rounded-2xl border-2 border-heart-red/60"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
            />
          )}
          <Puppy
            size={200}
            eyesClosed={!fiveTapMsg}
            action={fiveTapMsg ? "jump" : puppyAction}
            className="pointer-events-none"
          />
          {!fiveTapMsg && !longPressMsg && (
            <motion.p
              className="pointer-events-none mt-3 text-center text-xs text-white/70"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              👆 点我点我
            </motion.p>
          )}
        </motion.button>

        {!fiveTapMsg && (
          <p className="mt-4 rounded-2xl bg-white/15 px-4 py-2 text-sm text-white/85">
            💭 汪… 好困但好幸福
          </p>
        )}
      </div>

      <motion.div className="relative z-10 w-full pb-2 text-center">
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
      </motion.div>
    </motion.div>
  );
}
