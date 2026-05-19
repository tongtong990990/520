"use client";

import { useEffect } from "react";
import { unlockAudio } from "@/lib/sfx";

/** 首次触摸解锁微信 / iOS 音频 */
export function AudioUnlock() {
  useEffect(() => {
    const unlock = () => {
      unlockAudio();
    };
    window.addEventListener("touchstart", unlock, { passive: true, once: false });
    window.addEventListener("click", unlock, { once: false });
    return () => {
      window.removeEventListener("touchstart", unlock);
      window.removeEventListener("click", unlock);
    };
  }, []);

  return null;
}
