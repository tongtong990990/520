"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface TypewriterTextProps {
  lines: string[];
  onLineComplete?: (index: number) => void;
  onAllComplete?: () => void;
  className?: string;
  speedMs?: number;
}

export function TypewriterText({
  lines,
  onLineComplete,
  onAllComplete,
  className = "",
  speedMs = 55,
}: TypewriterTextProps) {
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [done, setDone] = useState(false);

  const currentLine = lines[lineIndex] ?? "";
  const displayed = lines
    .slice(0, lineIndex)
    .concat(lineIndex < lines.length ? [currentLine.slice(0, charIndex)] : [])
    .filter(Boolean);

  useEffect(() => {
    if (done) return;

    if (lineIndex >= lines.length) {
      setDone(true);
      onAllComplete?.();
      return;
    }

    if (charIndex < currentLine.length) {
      const t = setTimeout(() => setCharIndex((c) => c + 1), speedMs);
      return () => clearTimeout(t);
    }

    onLineComplete?.(lineIndex);
    const isLast = lineIndex === lines.length - 1;
    const t = setTimeout(() => {
      if (isLast) {
        setDone(true);
        onAllComplete?.();
      } else {
        setLineIndex((i) => i + 1);
        setCharIndex(0);
      }
    }, 600);
    return () => clearTimeout(t);
  }, [charIndex, currentLine.length, done, lineIndex, lines.length, onAllComplete, onLineComplete, speedMs]);

  return (
    <div className={`space-y-4 ${className}`}>
      {displayed.map((line, i) => (
        <motion.p
          key={`${i}-${line}`}
          className="text-center font-display text-lg leading-relaxed text-brown-text"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {line}
          {i === displayed.length - 1 && !done && (
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
            >
              |
            </motion.span>
          )}
        </motion.p>
      ))}
    </div>
  );
}
