"use client";

import { motion } from "framer-motion";

export function SoftGlow({ color = "rgba(255, 182, 200, 0.45)" }: { color?: string }) {
  return (
    <motion.div
      className="pointer-events-none absolute inset-0"
      aria-hidden
      animate={{ opacity: [0.35, 0.65, 0.35] }}
      transition={{ repeat: Infinity, duration: 3.2, ease: "easeInOut" }}
    >
      <motion.div
        className="absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        style={{ background: `radial-gradient(circle, ${color} 0%, transparent 70%)` }}
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
      />
    </motion.div>
  );
}
