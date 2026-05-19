"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { PuppyAction } from "@/store/gameStore";
import { assetPath } from "@/lib/assetPath";

const PUPPY_IMG = "/assets/puppy/puppy.png";

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

/** 插画风格小狗（参考用户提供的形象） */
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
  const isWag = action === "wag" || action === "spin" || action === "idle" || action === "tongue";
  const isJump = action === "jump" || action === "happy";
  const isLunge = action === "lunge" || action === "hug";
  const isSpin = action === "spin";

  const imgSrc = assetPath(PUPPY_IMG);

  return (
    <motion.div
      className={`relative inline-flex flex-col items-center ${className}`}
      style={{ width: size, minHeight: size * 1.05 }}
      animate={
        isLunge
          ? { scale: 1.35, y: -24, zIndex: 50 }
          : isJump
            ? { y: [0, -32, 0], scale: [1, 1.1, 1] }
            : isSpin
              ? { rotate: [0, 12, -12, 0], scale: [1, 1.08, 1] }
              : isWag
                ? { y: [0, -6, 0], rotate: [0, -2, 2, 0] }
                : { y: [0, -5, 0], scale: [1, 1.02, 1] }
      }
      transition={
        isLunge
          ? { duration: 0.5, ease: "easeOut" }
          : isJump
            ? { duration: 0.55, ease: "easeOut" }
            : isSpin
              ? { duration: 0.7, ease: "easeInOut" }
              : { repeat: Infinity, duration: isWag ? 2.8 : 3, ease: "easeInOut" }
      }
    >
      <div
        className="relative"
        style={{ width: size, height: size * 1.08 }}
      >
        <Image
          src={imgSrc}
          alt="可爱小狗"
          width={size}
          height={Math.round(size * 1.08)}
          className="h-auto w-full object-contain drop-shadow-[0_8px_20px_rgba(255,150,150,0.35)]"
          priority
          unoptimized
        />

        {/* 闭眼（抱抱/睡觉） */}
        {eyesClosed && (
          <div
            className="pointer-events-none absolute left-[22%] top-[28%] h-[12%] w-[56%] rounded-full bg-cream-white/85"
            style={{ boxShadow: "inset 0 0 8px rgba(255,255,255,0.9)" }}
          >
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 20" aria-hidden>
              <path
                d="M8 12 Q25 4 42 12 M58 12 Q75 4 92 12"
                stroke="#5A3A36"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          </div>
        )}

        {/* 信封 */}
        {holdingEnvelope && (
          <div className="absolute bottom-[18%] left-1/2 z-10 -translate-x-1/2">
            <div className="rounded-md border border-pink-main/50 bg-white px-2 py-1 shadow-md">
              <div className="h-0 w-0 border-x-[14px] border-t-[10px] border-x-transparent border-t-pink-light" />
              <div className="flex h-4 w-7 items-center justify-center rounded-sm bg-cream-white">
                <span className="text-[10px]">❤️</span>
              </div>
            </div>
          </div>
        )}

        {/* 爱心 */}
        {holdingHeart && (
          <motion.span
            className="absolute -right-1 top-[35%] z-10 text-3xl"
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
          >
            ❤️
          </motion.span>
        )}
      </div>

      {inGiftBox && (
        <motion.div
          className="relative -mt-2"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
        >
          <svg width={size * 1.1} height={size * 0.35} viewBox="0 0 240 80" aria-hidden>
            <defs>
              <linearGradient id="boxGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FFD6E5" />
                <stop offset="100%" stopColor="#FFB6C8" />
              </linearGradient>
            </defs>
            <rect x="20" y="22" width="200" height="48" rx="10" fill="url(#boxGrad)" />
            <rect x="20" y="22" width="200" height="14" rx="6" fill="#FF9BB5" />
            <rect x="108" y="12" width="24" height="58" fill="#FF5C7A" />
            <ellipse cx="120" cy="16" rx="38" ry="14" fill="#FFB6C8" />
            <text x="150" y="54" fontSize="11" fill="#5A3A36" fontFamily="sans-serif" fontWeight="bold">
              For You
            </text>
          </svg>
        </motion.div>
      )}
    </motion.div>
  );
}
