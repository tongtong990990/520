"use client";

export function StatusBar() {
  const now = new Date();
  const time = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

  return (
    <div className="status-bar relative z-20 shrink-0">
      <span>{time}</span>
      <span className="font-display text-heart-red">520</span>
      <span className="flex gap-1">
        <span>📶</span>
        <span>🔋</span>
      </span>
    </div>
  );
}
