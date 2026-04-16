"use client";

import { useEffect, useRef, useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);
  const [isTapped, setIsTapped] = useState(false);
  const tapTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (tapTimeoutRef.current) {
        window.clearTimeout(tapTimeoutRef.current);
      }
    };
  }, []);

  const increment = () => {
    setCount((prev) => prev + 1);

    setIsTapped(true);
    if (tapTimeoutRef.current) {
      window.clearTimeout(tapTimeoutRef.current);
    }
    tapTimeoutRef.current = window.setTimeout(() => {
      setIsTapped(false);
    }, 120);

    if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
      navigator.vibrate(12);
    }
  };

  return (
    <button
      type="button"
      onClick={increment}
      className={`relative min-h-screen w-full overflow-hidden bg-slate-50 text-slate-900 transition-transform duration-100 active:scale-[0.995] dark:bg-slate-950 dark:text-slate-100 ${isTapped ? "scale-[0.998]" : "scale-100"}`}
      aria-label="Tap anywhere to increment counter"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.18),transparent_55%)] dark:bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.22),transparent_55%)]" />
      <div
        className={`pointer-events-none absolute inset-0 bg-indigo-500/10 transition-opacity duration-150 dark:bg-cyan-400/10 ${isTapped ? "opacity-100" : "opacity-0"}`}
      />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center gap-5 px-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
          Counter
        </p>
        <p
          className={`text-7xl font-bold tracking-tight transition-transform duration-100 md:text-8xl ${isTapped ? "scale-105" : "scale-100"}`}
        >
          {count}
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Tap anywhere to increment
        </p>
      </div>
    </button>
  );
}
