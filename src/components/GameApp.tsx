"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { AudioPlayer } from "@/components/AudioPlayer";
import { AudioUnlock } from "@/components/AudioUnlock";
import { VersionBadge } from "@/components/VersionBadge";
import { ConfessionScreen } from "@/components/screens/ConfessionScreen";
import { EasterEggScreen } from "@/components/screens/EasterEggScreen";
import { GameScreen } from "@/components/screens/GameScreen";
import { GameSuccessScreen } from "@/components/screens/GameSuccessScreen";
import { HugScreen } from "@/components/screens/HugScreen";
import { InteractionScreen } from "@/components/screens/InteractionScreen";
import { OpeningScreen } from "@/components/screens/OpeningScreen";
import { heartPageTransition } from "@/lib/animations";
import { useGameStore, type ScreenId } from "@/store/gameStore";

const screens: Record<ScreenId, React.ComponentType> = {
  opening: OpeningScreen,
  interaction: InteractionScreen,
  game: GameScreen,
  "game-success": GameSuccessScreen,
  confession: ConfessionScreen,
  hug: HugScreen,
  "easter-egg": EasterEggScreen,
};

export function GameApp() {
  const screen = useGameStore((s) => s.screen);
  const setScreen = useGameStore((s) => s.setScreen);
  const Screen = screens[screen];

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("egg") === "1") {
      setScreen("easter-egg");
    }
  }, [setScreen]);

  return (
    <div className="phone-frame relative">
      <AudioUnlock />
      <AudioPlayer />
      <VersionBadge />
      <AnimatePresence mode="wait">
        <motion.div
          key={screen}
          className="absolute inset-0 flex flex-col"
          {...heartPageTransition}
        >
          <Screen />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
