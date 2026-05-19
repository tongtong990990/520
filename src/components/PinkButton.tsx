"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { sfx } from "@/lib/sfx";

interface PinkButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export function PinkButton({ children, onClick, className = "", disabled = false }: PinkButtonProps) {
  return (
    <motion.button
      type="button"
      disabled={disabled}
      onClick={() => {
        sfx.pop();
        onClick?.();
      }}
      className={`rounded-full px-8 py-4 font-display text-lg font-bold text-white shadow-cream ${className}`}
      style={{
        background: "linear-gradient(180deg, #FFB6C8 0%, #FF5C7A 100%)",
        boxShadow: "0 6px 24px rgba(255, 92, 122, 0.4), inset 0 2px 8px rgba(255,255,255,0.35)",
      }}
      animate={{
        scale: [1, 1.04, 1],
        boxShadow: [
          "0 6px 24px rgba(255, 92, 122, 0.4)",
          "0 10px 32px rgba(255, 92, 122, 0.5)",
          "0 6px 24px rgba(255, 92, 122, 0.4)",
        ],
      }}
      transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.94 }}
    >
      {children}
    </motion.button>
  );
}
