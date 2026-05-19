"use client";

import { motion } from "framer-motion";
import { useCallback, useRef, useState, type ReactNode } from "react";

interface LongPressZoneProps {
  children: ReactNode;
  durationMs?: number;
  onLongPress: () => void;
  /** 短按/快速点击（未达到长按时长） */
  onQuickTap?: () => void;
  className?: string;
  hint?: string;
}

export function LongPressZone({
  children,
  durationMs = 800,
  onLongPress,
  onQuickTap,
  className = "",
  hint,
}: LongPressZoneProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pressingRef = useRef(false);
  const pressStartRef = useRef(0);
  const longPressFiredRef = useRef(false);
  const [pressing, setPressing] = useState(false);
  const [progress, setProgress] = useState(0);

  const clear = useCallback(() => {
    pressingRef.current = false;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setPressing(false);
    setProgress(0);
  }, []);

  const startPress = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      clear();
      pressingRef.current = true;
      longPressFiredRef.current = false;
      pressStartRef.current = Date.now();
      setPressing(true);
      const start = pressStartRef.current;
      const tick = () => {
        if (!pressingRef.current) return;
        setProgress(Math.min((Date.now() - start) / durationMs, 1));
        if ((Date.now() - start) / durationMs < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      timerRef.current = setTimeout(() => {
        if (!pressingRef.current) return;
        longPressFiredRef.current = true;
        onLongPress();
        clear();
      }, durationMs);
    },
    [clear, durationMs, onLongPress],
  );

  return (
    <motion.div
      role="button"
      tabIndex={0}
      aria-label={hint ?? "长按"}
      className={`relative touch-none select-none ${className}`}
      onPointerDown={(e) => {
        try {
          e.currentTarget.setPointerCapture(e.pointerId);
        } catch {
          /* ignore */
        }
        startPress(e);
      }}
      onPointerUp={(e) => {
        try {
          e.currentTarget.releasePointerCapture(e.pointerId);
        } catch {
          /* ignore */
        }
        const elapsed = Date.now() - pressStartRef.current;
        if (!longPressFiredRef.current && elapsed < durationMs) {
          onQuickTap?.();
        }
        clear();
      }}
      onPointerCancel={clear}
      onLostPointerCapture={clear}
      onContextMenu={(e) => e.preventDefault()}
    >
      {pressing && (
        <svg
          className="pointer-events-none absolute inset-0 z-20 m-auto h-full w-full max-h-[200px] max-w-[200px]"
          viewBox="0 0 100 100"
          aria-hidden
        >
          <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="4" />
          <circle
            cx="50"
            cy="50"
            r="46"
            fill="none"
            stroke="#FF5C7A"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={`${progress * 289} 289`}
            transform="rotate(-90 50 50)"
          />
        </svg>
      )}
      <motion.div className="pointer-events-none">{children}</motion.div>
    </motion.div>
  );
}
