"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

interface FloatingHeartsProps {
  count?: number;
  className?: string;
  variant?: "heart" | "sparkle" | "mixed";
}

export function FloatingHearts({
  count = 12,
  className = "",
  variant = "mixed",
}: FloatingHeartsProps) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 4,
        duration: 4 + Math.random() * 5,
        size: 8 + Math.random() * 14,
        opacity: 0.25 + Math.random() * 0.5,
        char:
          variant === "heart"
            ? "❤️"
            : variant === "sparkle"
              ? "✨"
              : ["❤️", "✨", "💕", "🌸"][i % 4],
      })),
    [count, variant],
  );

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute"
          style={{ left: `${p.x}%`, fontSize: p.size, opacity: p.opacity }}
          initial={{ y: "110%", rotate: 0 }}
          animate={{
            y: "-15%",
            rotate: [0, 12, -8, 0],
            opacity: [0, p.opacity, p.opacity, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: p.duration,
            delay: p.delay,
            ease: "easeInOut",
          }}
        >
          {p.char}
        </motion.span>
      ))}
    </div>
  );
}
