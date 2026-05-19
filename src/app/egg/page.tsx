"use client";

import { useEffect } from "react";
import { GameApp } from "@/components/GameApp";
import { useGameStore } from "@/store/gameStore";

/** 直达彩蛋页：/520/egg/ */
export default function EggPage() {
  useEffect(() => {
    useGameStore.setState({ screen: "easter-egg" });
  }, []);

  return <GameApp />;
}
