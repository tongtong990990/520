"use client";

import { useEffect, useState } from "react";
import { APP_VERSION } from "@/components/VersionBadge";

const STORAGE_KEY = "kiki-520-version";

export function UpdateChecker() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && saved !== APP_VERSION) {
      setShow(true);
    }
    localStorage.setItem(STORAGE_KEY, APP_VERSION);
  }, []);

  const forceReload = () => {
    const url = new URL(window.location.href);
    url.searchParams.set("v", APP_VERSION.replace(/\./g, ""));
    url.searchParams.set("t", String(Date.now()));
    window.location.replace(url.toString());
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 p-6 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-3xl bg-cream-white p-6 text-center shadow-2xl">
        <p className="text-4xl">🔄</p>
        <h2 className="mt-3 font-display text-xl text-heart-red">发现新版本</h2>
        <p className="mt-2 text-sm text-brown-text">
          你之前打开的是旧缓存，请点击下方按钮加载最新版{" "}
          <strong>v{APP_VERSION}</strong>
        </p>
        <button
          type="button"
          onClick={forceReload}
          className="mt-5 w-full rounded-full bg-gradient-to-r from-pink-main to-heart-red py-3 font-display text-white"
        >
          立即刷新
        </button>
      </div>
    </div>
  );
}
