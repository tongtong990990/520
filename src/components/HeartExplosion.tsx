"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface HeartExplosionProps {
  trigger: number;
  className?: string;
}

export function HeartExplosion({ trigger, className = "" }: HeartExplosionProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (trigger <= 0) return;
    setShow(true);
    const t = setTimeout(() => setShow(false), 1200);
    return () => clearTimeout(t);
  }, [trigger]);

  const hearts = Array.from({ length: 16 }, (_, i) => ({
    id: i,
    angle: (i / 16) * Math.PI * 2,
    dist: 60 + Math.random() * 80,
    emoji: ["❤️", "💕", "✨", "💖"][i % 4],
  }));

  return (
    <div className={`pointer-events-none absolute inset-0 z-50 flex items-center justify-center ${className}`}>
      <AnimatePresence>
        {show &&
          hearts.map((h) => (
            <motion.span
              key={`${trigger}-${h.id}`}
              className="absolute text-2xl"
              initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
              animate={{
                scale: [0, 1.2, 0.8],
                x: Math.cos(h.angle) * h.dist,
                y: Math.sin(h.angle) * h.dist,
                opacity: [1, 1, 0],
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
            >
              {h.emoji}
            </motion.span>
          ))}
      </AnimatePresence>
    </div>
  );
}
