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

/** 奶油风马尔济斯小狗 — 蓬松手绘感 */
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
      style={{ width: size, height: size, filter: "drop-shadow(0 8px 16px rgba(255, 92, 122, 0.25))" }}
      animate={
        isLunge
          ? { scale: 1.38, y: -28, zIndex: 50 }
          : isJump
            ? { y: [0, -36, 0], scale: [1, 1.12, 1] }
            : isSpin
              ? { rotate: [0, 360], scale: [1, 1.1, 1] }
              : { y: [0, -8, 0], scale: [1, 1.04, 1] }
      }
      transition={
        isLunge
          ? { duration: 0.5, ease: "easeOut" }
          : isJump
            ? { duration: 0.5, ease: "easeOut" }
            : isSpin
              ? { duration: 0.8, ease: "easeInOut" }
              : { repeat: Infinity, duration: 3, ease: "easeInOut" }
      }
    >
      <svg viewBox="0 0 200 220" width={size} height={size} aria-hidden>
        <defs>
          <radialGradient id="furHead" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#FFFCF7" />
            <stop offset="55%" stopColor="#FFF0E0" />
            <stop offset="100%" stopColor="#F5DCC4" />
          </radialGradient>
          <radialGradient id="furBody" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FFF8F0" />
            <stop offset="100%" stopColor="#F0D4BC" />
          </radialGradient>
          <radialGradient id="earGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFF5EB" />
            <stop offset="100%" stopColor="#E8C4A8" />
          </radialGradient>
          <radialGradient id="blushGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFB6C8" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#FFB6C8" stopOpacity="0" />
          </radialGradient>
          <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#E8A090" floodOpacity="0.35" />
          </filter>
        </defs>

        <g filter="url(#softShadow)">
          {/* 尾巴 — 蓬松卷曲 */}
          <motion.g
            style={{ transformOrigin: "158px 138px" }}
            animate={isWag ? { rotate: [-22, 22, -22] } : { rotate: -8 }}
            transition={
              isWag
                ? { repeat: Infinity, duration: 0.28, ease: "easeInOut" }
                : { duration: 0.2 }
            }
          >
            <ellipse cx="172" cy="132" rx="16" ry="26" fill="url(#earGrad)" />
            <ellipse cx="178" cy="118" rx="11" ry="15" fill="#FFF5EB" />
            <ellipse cx="182" cy="108" rx="8" ry="10" fill="#FFFCF7" opacity="0.9" />
          </motion.g>

          {/* 身体 — 圆滚滚 */}
          <ellipse cx="100" cy="158" rx="50" ry="40" fill="url(#furBody)" />
          <ellipse cx="100" cy="162" rx="42" ry="32" fill="#FFFCF7" opacity="0.85" />
          {/* 胸部绒毛高光 */}
          <ellipse cx="100" cy="150" rx="22" ry="14" fill="#FFFFFF" opacity="0.45" />

          {/* 左耳 — 下垂蓬松 */}
          <ellipse cx="58" cy="78" rx="24" ry="32" fill="url(#earGrad)" transform="rotate(-22 58 78)" />
          <ellipse cx="62" cy="82" rx="14" ry="20" fill="#FFF8F2" transform="rotate(-22 62 82)" />
          {/* 右耳 */}
          <ellipse cx="142" cy="78" rx="24" ry="32" fill="url(#earGrad)" transform="rotate(22 142 78)" />
          <ellipse cx="138" cy="82" rx="14" ry="20" fill="#FFF8F2" transform="rotate(22 138 82)" />

          {/* 头部 — 大圆脸 */}
          <circle cx="100" cy="92" r="50" fill="url(#furHead)" />
          <ellipse cx="100" cy="96" rx="44" ry="40" fill="#FFFCF7" opacity="0.6" />
          {/* 头顶呆毛 */}
          <path
            d="M92 48 Q100 32 108 48 Q100 42 92 48"
            fill="#FFF5EB"
            stroke="#F0D4BC"
            strokeWidth="1"
          />

          {/* 蝴蝶结项圈 */}
          <path d="M82 122 Q100 110 118 122 L100 132 Z" fill="#FFB6C8" />
          <ellipse cx="88" cy="120" rx="10" ry="7" fill="#FF9BB5" />
          <ellipse cx="112" cy="120" rx="10" ry="7" fill="#FF9BB5" />
          <circle cx="100" cy="122" r="6" fill="#FF5C7A" />
          <circle cx="100" cy="122" r="3" fill="#FFB6C8" opacity="0.6" />

          {/* 腮红 */}
          <ellipse cx="68" cy="102" rx="14" ry="9" fill="url(#blushGrad)" />
          <ellipse cx="132" cy="102" rx="14" ry="9" fill="url(#blushGrad)" />

          {/* 眼睛 */}
          {eyesClosed ? (
            <>
              <path
                d="M74 88 Q84 96 94 88"
                stroke="#5A3A36"
                strokeWidth="3.5"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M106 88 Q116 96 126 88"
                stroke="#5A3A36"
                strokeWidth="3.5"
                fill="none"
                strokeLinecap="round"
              />
            </>
          ) : (
            <>
              <motion.g
                style={{ transformOrigin: "82px 90px" }}
                animate={{ scaleY: [1, 1, 0.06, 1, 1] }}
                transition={{
                  repeat: Infinity,
                  duration: 4.5,
                  times: [0, 0.84, 0.88, 0.92, 1],
                }}
              >
                <ellipse cx="82" cy="90" rx="13" ry="15" fill="#2A1F18" />
                <ellipse cx="82" cy="90" rx="11" ry="13" fill="#3D2E26" />
                <circle cx="86" cy="85" r="5" fill="white" />
                <circle cx="84" cy="87" r="2" fill="white" opacity="0.8" />
              </motion.g>
              <motion.g
                style={{ transformOrigin: "118px 90px" }}
                animate={{ scaleY: [1, 1, 0.06, 1, 1] }}
                transition={{
                  repeat: Infinity,
                  duration: 4.5,
                  times: [0, 0.84, 0.88, 0.92, 1],
                }}
              >
                <ellipse cx="118" cy="90" rx="13" ry="15" fill="#2A1F18" />
                <ellipse cx="118" cy="90" rx="11" ry="13" fill="#3D2E26" />
                <circle cx="122" cy="85" r="5" fill="white" />
                <circle cx="120" cy="87" r="2" fill="white" opacity="0.8" />
              </motion.g>
            </>
          )}

          {/* 鼻子 */}
          <ellipse cx="100" cy="104" rx="9" ry="7" fill="#5A3A36" />
          <ellipse cx="100" cy="103" rx="5" ry="3" fill="#6B4A42" opacity="0.5" />
          {/* 嘴 / 舌头 */}
          {showTongue ? (
            <g>
              <ellipse cx="100" cy="118" rx="12" ry="10" fill="#FF8FAB" />
              <ellipse cx="100" cy="116" rx="8" ry="5" fill="#FFB6C8" />
              <path
                d="M88 108 Q100 114 112 108"
                stroke="#5A3A36"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
              />
            </g>
          ) : (
            <path
              d="M90 110 Q100 118 110 110"
              stroke="#5A3A36"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
          )}

          {/* 小爪子 */}
          <ellipse cx="68" cy="178" rx="16" ry="11" fill="#FFF0E0" />
          <ellipse cx="132" cy="178" rx="16" ry="11" fill="#FFF0E0" />
          <ellipse cx="65" cy="176" rx="5" ry="4" fill="#F5DCC4" />
          <ellipse cx="73" cy="176" rx="5" ry="4" fill="#F5DCC4" />
          <ellipse cx="127" cy="176" rx="5" ry="4" fill="#F5DCC4" />
          <ellipse cx="135" cy="176" rx="5" ry="4" fill="#F5DCC4" />

          {holdingEnvelope && (
            <g transform="translate(84, 108)">
              <rect x="0" y="0" width="32" height="20" rx="3" fill="white" stroke="#FFB6C8" strokeWidth="1.5" />
              <path d="M0 2 L16 12 L32 2" fill="#FFE5EE" />
              <circle cx="16" cy="12" r="5" fill="#FF5C7A" />
            </g>
          )}

          {holdingHeart && (
            <g transform="translate(138, 88) scale(0.55)">
              <path
                d="M0 20 C0 0 20 -5 20 15 C20 -5 40 0 40 20 C40 45 20 55 20 55 C20 55 0 45 0 20"
                fill="#FF5C7A"
              />
              <path
                d="M8 18 C8 10 16 8 16 16"
                fill="#FF8FAB"
                opacity="0.5"
              />
            </g>
          )}
        </g>
      </svg>

      {inGiftBox && (
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2">
          <svg width={size * 1.15} height={size * 0.38} viewBox="0 0 240 80">
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
        </div>
      )}
    </motion.div>
  );
}
