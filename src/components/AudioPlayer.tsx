"use client";

import { useEffect } from "react";
import { sfx } from "@/lib/sfx";
import { useGameStore } from "@/store/gameStore";

/** 全局音效与背景音乐管理 */
export function AudioPlayer() {
  const screen = useGameStore((s) => s.screen);

  useEffect(() => {
    if (screen === "opening" || screen === "confession" || screen === "hug") {
      sfx.playBgm();
    }
    return () => {
      if (screen === "easter-egg") sfx.stopBgm();
    };
  }, [screen]);

  return null;
}
