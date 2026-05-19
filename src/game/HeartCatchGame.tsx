"use client";

import { motion } from "framer-motion";
import { useCallback, useEffect, useRef } from "react";
import { sfx } from "@/lib/sfx";
import { useGameStore } from "@/store/gameStore";

type GameControls = { left: boolean; right: boolean };

export function HeartCatchGame() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);
  const controlsRef = useRef<GameControls>({ left: false, right: false });
  const incrementHeartsRef = useRef(useGameStore.getState().incrementHearts);
  const setSpeedBoostRef = useRef(useGameStore.getState().setSpeedBoost);
  const speedBoostRef = useRef(false);

  const heartsCollected = useGameStore((s) => s.heartsCollected);
  const targetHearts = useGameStore((s) => s.targetHearts);
  const speedBoost = useGameStore((s) => s.speedBoost);

  useEffect(() => {
    speedBoostRef.current = speedBoost;
  }, [speedBoost]);

  useEffect(() => {
    const s = useGameStore.getState();
    incrementHeartsRef.current = s.incrementHearts;
    setSpeedBoostRef.current = s.setSpeedBoost;
  });

  const setLeft = useCallback((v: boolean) => {
    controlsRef.current.left = v;
  }, []);
  const setRight = useCallback((v: boolean) => {
    controlsRef.current.right = v;
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") controlsRef.current.left = true;
      if (e.key === "ArrowRight") controlsRef.current.right = true;
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") controlsRef.current.left = false;
      if (e.key === "ArrowRight") controlsRef.current.right = false;
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    let destroyed = false;
    const parent = containerRef.current;

    const init = async () => {
      const Phaser = (await import("phaser")).default;
      if (destroyed || !containerRef.current) return;

      class MainScene extends Phaser.Scene {
        puppy!: Phaser.GameObjects.Rectangle;
        face!: Phaser.GameObjects.Text;
        boostTimer: Phaser.Time.TimerEvent | null = null;

        create() {
          const { width, height } = this.scale;

          this.time.addEvent({ delay: 700, loop: true, callback: () => this.spawn("heart") });
          this.time.addEvent({ delay: 1100, loop: true, callback: () => this.spawn("flower") });
          this.time.addEvent({ delay: 1500, loop: true, callback: () => this.spawn("bone") });

          this.puppy = this.add
            .rectangle(width / 2, height - 48, 56, 40, 0xfff7ef)
            .setStrokeStyle(3, 0xffb6c8)
            .setDepth(10);

          this.face = this.add.text(this.puppy.x, this.puppy.y - 8, "🐶", { fontSize: "28px" }).setOrigin(0.5).setDepth(11);

          this.physics.add.existing(this.puppy);
          const body = this.puppy.body as Phaser.Physics.Arcade.Body;
          body.setAllowGravity(false);
          body.setCollideWorldBounds(true);
          body.setSize(52, 36);
          this.physics.world.setBounds(0, 0, width, height);
        }

        spawn(type: "heart" | "flower" | "bone") {
          const { width } = this.scale;
          const x = Phaser.Math.Between(36, width - 36);
          const emoji = type === "heart" ? "❤️" : type === "flower" ? "🌸" : "🦴";
          const item = this.add.text(x, -20, emoji, { fontSize: "24px" }).setOrigin(0.5);
          this.physics.add.existing(item);
          const body = item.body as Phaser.Physics.Arcade.Body;
          const baseSpeed = speedBoostRef.current ? 200 : 140;
          body.setVelocityY(Phaser.Math.Between(baseSpeed, baseSpeed + 50));
          body.setAllowGravity(false);
          body.setSize(28, 28);

          this.physics.add.overlap(this.puppy, item, () => {
            if (!item.active) return;
            if (type === "heart") {
              incrementHeartsRef.current();
              sfx.ding();
            } else if (type === "bone") {
              speedBoostRef.current = true;
              setSpeedBoostRef.current(true);
              sfx.pop();
              this.boostTimer?.remove();
              this.boostTimer = this.time.delayedCall(3000, () => {
                speedBoostRef.current = false;
                setSpeedBoostRef.current(false);
              });
            } else {
              sfx.pop();
            }
            item.destroy();
          });

          this.time.delayedCall(5000, () => item.active && item.destroy());
        }

        update() {
          const body = this.puppy.body as Phaser.Physics.Arcade.Body;
          const speed = speedBoostRef.current ? 360 : 280;
          const c = controlsRef.current;
          if (c.left) body.setVelocityX(-speed);
          else if (c.right) body.setVelocityX(speed);
          else body.setVelocityX(0);
          this.face.setPosition(this.puppy.x, this.puppy.y - 8);
        }
      }

      gameRef.current = new Phaser.Game({
        type: Phaser.AUTO,
        parent,
        width: Math.max(parent.clientWidth, 280),
        height: Math.max(parent.clientHeight, 200),
        transparent: true,
        physics: { default: "arcade", arcade: { debug: false } },
        scale: {
          mode: Phaser.Scale.RESIZE,
          autoCenter: Phaser.Scale.CENTER_BOTH,
          width: Math.max(parent.clientWidth, 280),
          height: Math.max(parent.clientHeight, 200),
        },
        scene: MainScene,
      });

      const onResize = () => {
        if (gameRef.current && parent) {
          gameRef.current.scale.resize(parent.clientWidth, parent.clientHeight);
        }
      };
      window.addEventListener("resize", onResize);
      const ro = new ResizeObserver(onResize);
      ro.observe(parent);
      (gameRef.current as Phaser.Game & { __cleanup?: () => void }).__cleanup = () => {
        window.removeEventListener("resize", onResize);
        ro.disconnect();
      };
    };

    init();
    return () => {
      destroyed = true;
      controlsRef.current = { left: false, right: false };
      const g = gameRef.current as Phaser.Game & { __cleanup?: () => void };
      g?.__cleanup?.();
      g?.destroy(true);
      gameRef.current = null;
    };
  }, []);

  const progress = Math.min(heartsCollected / targetHearts, 1);

  return (
    <div className="relative flex h-full min-h-0 flex-col">
      <div className="relative z-10 shrink-0 px-4 pt-4 text-center">
        <h2 className="hand-drawn-text text-base">帮小狗收集 5 颗爱心！</h2>
        <p className="mt-1 text-xs text-brown-text/60">左右滑动 / 按住 ◀ ▶ 控制小狗</p>
        <motion.div className="cream-card mx-auto mt-3 max-w-[220px] px-4 py-2">
          <p className="text-sm font-medium text-heart-red">
            已收集：❤️ {heartsCollected}/{targetHearts}
            {speedBoost && <span className="ml-2 text-xs">⚡加速中</span>}
          </p>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-pink-light">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-pink-main to-heart-red"
              style={{ width: `${progress * 100}%` }}
              layout
            />
          </div>
        </motion.div>
      </div>

      <div
        ref={containerRef}
        className="relative mx-2 min-h-[180px] flex-1 touch-none overflow-hidden rounded-2xl border-2 border-white/50"
        style={{
          background:
            "linear-gradient(180deg, #B8E8FF 0%, #E8F8FF 35%, #D4F5D0 70%, #A8E0A0 100%)",
        }}
        onTouchStart={(e) => {
          const t = e.touches[0];
          (containerRef.current as HTMLDivElement & { _tx?: number })._tx = t.clientX;
        }}
        onTouchMove={(e) => {
          const el = containerRef.current as HTMLDivElement & { _tx?: number };
          if (el?._tx == null) return;
          const dx = e.touches[0].clientX - el._tx;
          if (dx < -12) {
            controlsRef.current.left = true;
            controlsRef.current.right = false;
          } else if (dx > 12) {
            controlsRef.current.right = true;
            controlsRef.current.left = false;
          }
        }}
        onTouchEnd={() => {
          controlsRef.current = { left: false, right: false };
        }}
      />

      <GameControlPad onLeft={setLeft} onRight={setRight} />
    </div>
  );
}

function GameControlPad({
  onLeft,
  onRight,
}: {
  onLeft: (v: boolean) => void;
  onRight: (v: boolean) => void;
}) {
  const bind = (set: (v: boolean) => void) => ({
    onPointerDown: (e: React.PointerEvent) => {
      e.preventDefault();
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
      set(true);
    },
    onPointerUp: (e: React.PointerEvent) => {
      set(false);
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
    },
    onPointerCancel: () => set(false),
    onLostPointerCapture: () => set(false),
  });

  return (
    <div className="relative z-20 flex shrink-0 justify-between px-4 pb-6 pt-2">
      <button
        type="button"
        className="flex h-16 w-16 touch-none items-center justify-center rounded-full bg-pink-main text-2xl text-white shadow-cream active:scale-95"
        aria-label="向左"
        {...bind(onLeft)}
      >
        ◀
      </button>
      <button
        type="button"
        className="flex h-16 w-16 touch-none items-center justify-center rounded-full bg-pink-main text-2xl text-white shadow-cream active:scale-95"
        aria-label="向右"
        {...bind(onRight)}
      >
        ▶
      </button>
    </div>
  );
}
