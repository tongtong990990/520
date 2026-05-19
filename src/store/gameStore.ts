import { create } from "zustand";

export type ScreenId =
  | "opening"
  | "interaction"
  | "game"
  | "game-success"
  | "confession"
  | "hug"
  | "easter-egg";

export type PuppyAction =
  | "idle"
  | "wag"
  | "blink"
  | "jump"
  | "lunge"
  | "spin"
  | "happy"
  | "tongue"
  | "hug";

interface GameState {
  screen: ScreenId;
  heartsCollected: number;
  targetHearts: number;
  puppyAction: PuppyAction;
  speedBoost: boolean;
  puppyTapCount: number;
  kissEasterEggShown: boolean;
  setScreen: (screen: ScreenId) => void;
  setPuppyAction: (action: PuppyAction) => void;
  incrementHearts: () => void;
  setSpeedBoost: (v: boolean) => void;
  tapPuppy: () => number;
  resetPuppyTaps: () => void;
  setKissEasterEggShown: () => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  screen: "opening",
  heartsCollected: 0,
  targetHearts: 5,
  puppyAction: "idle",
  speedBoost: false,
  puppyTapCount: 0,
  kissEasterEggShown: false,

  setScreen: (screen) => set({ screen }),

  setPuppyAction: (puppyAction) => set({ puppyAction }),

  incrementHearts: () => {
    const next = get().heartsCollected + 1;
    set({ heartsCollected: next });
    if (next >= get().targetHearts) {
      setTimeout(() => set({ screen: "game-success" }), 700);
    }
  },

  setSpeedBoost: (speedBoost) => set({ speedBoost }),

  tapPuppy: () => {
    const next = get().puppyTapCount + 1;
    set({ puppyTapCount: next });
    return next;
  },

  resetPuppyTaps: () => set({ puppyTapCount: 0 }),

  setKissEasterEggShown: () => set({ kissEasterEggShown: true }),

  resetGame: () =>
    set({
      heartsCollected: 0,
      puppyAction: "idle",
      speedBoost: false,
      puppyTapCount: 0,
      kissEasterEggShown: false,
    }),
}));
