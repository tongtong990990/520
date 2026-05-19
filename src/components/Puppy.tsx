"use client";

import { motion } from "framer-motion";
import type { PuppyAction } from "@/store/gameStore";

interface PuppyProps {
  action?: PuppyAction;
  size?: number;
  className?: string;
  holdingEnvelope?: boolean;
  holdingHeart?: boolean;
  eyesClosed?: boolean;
  tongueOut?: boolean;
  inGiftBox?: boolean;
}

export function Puppy({
  action = "idle",
  size = 200,
  className = "",
  holdingEnvelope = false,
  holdingHeart = false,
  eyesClosed = false,
  tongueOut = false,
  inGiftBox = false,
}: PuppyProps) {
  const isWag =
    action === "wag" || action === "spin" || action === "idle" || action === "tongue";
  const isJump = action === "jump" || action === "happy";
  const isLunge = action === "lunge" || action === "hug";
  const isSpin = action === "spin";
  const showTongue = tongueOut || action === "tongue";

  return (
    <motion.div
      className={`relative inline-block ${className}`}
      style={{ width: size, height: size }}
      animate={
        isLunge
          ? { scale: 1.4, y: -24, zIndex: 50 }
          : isJump
            ? { y: [0, -32, 0], scale: [1, 1.1, 1] }
            : isSpin
              ? { rotate: [0, 360], scale: [1, 1.12, 1] }
              : { y: [0, -6, 0], scale: [1, 1.03, 1] }
      }
      transition={
        isLunge
          ? { duration: 0.55, ease: "easeOut" }
          : isJump
            ? { duration: 0.55, ease: "easeOut" }
            : isSpin
              ? { duration: 0.85, ease: "easeInOut" }
              : { repeat: Infinity, duration: 2.8, ease: "easeInOut" }
      }
    >
      <svg viewBox="0 0 200 200" width={size} height={size} className="drop-shadow-lg" aria-hidden>
        <motion.g
          style={{ transformOrigin: "155px 130px" }}
          animate={isWag ? { rotate: [-18, 18, -18] } : { rotate: 0 }}
          transition={
            isWag
              ? { repeat: Infinity, duration: 0.32, ease: "easeInOut" }
              : { duration: 0.2 }
          }
        >
          <ellipse cx="168" cy="125" rx="18" ry="28" fill="#E8C9A0" />
          <ellipse cx="175" cy="110" rx="12" ry="16" fill="#F5D9B8" />
        </motion.g>

        <ellipse cx="100" cy="145" rx="52" ry="42" fill="#F5E0C4" />
        <ellipse cx="100" cy="150" rx="45" ry="35" fill="#FFECD6" />
        <circle cx="100" cy="88" r="48" fill="#F5E0C4" />
        <circle cx="100" cy="92" r="42" fill="#FFECD6" />

        <ellipse cx="62" cy="72" rx="22" ry="30" fill="#E8C9A0" transform="rotate(-20 62 72)" />
        <ellipse cx="138" cy="72" rx="22" ry="30" fill="#E8C9A0" transform="rotate(20 138 72)" />
        <ellipse cx="65" cy="75" rx="16" ry="22" fill="#F5D9B8" transform="rotate(-20 65 75)" />
        <ellipse cx="135" cy="75" rx="16" ry="22" fill="#F5D9B8" transform="rotate(20 135 75)" />

        <path d="M88 118 Q100 108 112 118 Q100 128 88 118" fill="#FFB6C8" />
        <circle cx="100" cy="118" r="5" fill="#FF5C7A" />

        {eyesClosed ? (
          <>
            <path d="M78 82 Q88 90 98 82" stroke="#5A3A36" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M102 82 Q112 90 122 82" stroke="#5A3A36" strokeWidth="3" fill="none" strokeLinecap="round" />
          </>
        ) : (
          <>
            <motion.g
              style={{ transformOrigin: "85px 85px" }}
              animate={{ scaleY: [1, 1, 0.08, 1, 1] }}
              transition={{
                repeat: Infinity,
                duration: 4.2,
                times: [0, 0.86, 0.9, 0.94, 1],
              }}
            >
              <ellipse cx="85" cy="85" rx="10" ry="12" fill="#2D1F14" />
              <circle cx="88" cy="82" r="4" fill="white" />
            </motion.g>
            <motion.g
              style={{ transformOrigin: "115px 85px" }}
              animate={{ scaleY: [1, 1, 0.08, 1, 1] }}
              transition={{
                repeat: Infinity,
                duration: 4.2,
                times: [0, 0.86, 0.9, 0.94, 1],
              }}
            >
              <ellipse cx="115" cy="85" rx="10" ry="12" fill="#2D1F14" />
              <circle cx="118" cy="82" r="4" fill="white" />
            </motion.g>
          </>
        )}

        <ellipse cx="100" cy="98" rx="8" ry="6" fill="#5A3A36" />
        {showTongue ? (
          <ellipse cx="100" cy="112" rx="10" ry="8" fill="#FF9BB5" />
        ) : (
          <path
            d="M92 105 Q100 112 108 105"
            stroke="#5A3A36"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        )}

        <ellipse cx="72" cy="98" rx="10" ry="6" fill="#FFB6C8" opacity="0.55" />
        <ellipse cx="128" cy="98" rx="10" ry="6" fill="#FFB6C8" opacity="0.55" />
        <ellipse cx="72" cy="168" rx="14" ry="10" fill="#F5E0C4" />
        <ellipse cx="128" cy="168" rx="14" ry="10" fill="#F5E0C4" />

        {holdingEnvelope && (
          <g transform="translate(88, 100)">
            <rect x="0" y="0" width="24" height="16" rx="2" fill="white" stroke="#FFB6C8" strokeWidth="1" />
            <path d="M0 0 L12 8 L24 0" fill="#FFE5EE" />
            <circle cx="12" cy="10" r="4" fill="#FF5C7A" />
          </g>
        )}
        {holdingHeart && (
          <path
            d="M155 95 C155 80 175 75 175 90 C175 75 195 80 195 95 C195 115 175 125 175 125 C175 125 155 115 155 95"
            fill="#FF5C7A"
            transform="scale(0.5) translate(180, 80)"
          />
        )}
      </svg>

      {inGiftBox && (
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2">
          <svg width={size * 1.2} height={size * 0.4} viewBox="0 0 240 80">
            <rect x="20" y="20" width="200" height="50" rx="8" fill="#FFB6C8" />
            <rect x="20" y="20" width="200" height="15" rx="4" fill="#FF9BB5" />
            <rect x="110" y="10" width="20" height="60" fill="#FF5C7A" />
            <ellipse cx="120" cy="15" rx="35" ry="12" fill="#FF9BB5" />
            <text x="155" y="55" fontSize="10" fill="#5A3A36" fontFamily="sans-serif">
              For You
            </text>
          </svg>
        </div>
      )}
    </motion.div>
  );
}
