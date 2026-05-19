"use client";

/** 用于确认线上是否加载到最新版 */
export const APP_VERSION = "2.5.0";

export function VersionBadge() {
  return (
    <span className="pointer-events-none absolute bottom-2 right-2 z-[100] rounded-full bg-black/20 px-2 py-0.5 text-[9px] text-white/70">
      v{APP_VERSION}
    </span>
  );
}
