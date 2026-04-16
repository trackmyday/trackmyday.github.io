"use client";

import { useEffect, useRef, useState } from "react";

const COUNTER_STORAGE_KEY = "trackmyday:counter:value";

export default function Counter() {
  const [count, setCount] = useState(0);
  const [isTapped, setIsTapped] = useState(false);
  const [isStorageReady, setIsStorageReady] = useState(false);
  const tapTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (tapTimeoutRef.current) {
        window.clearTimeout(tapTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const storedValue = window.localStorage.getItem(COUNTER_STORAGE_KEY);
    if (storedValue !== null) {
      const parsed = Number.parseInt(storedValue, 10);
      if (!Number.isNaN(parsed)) {
        setCount(parsed);
      }
    }
    setIsStorageReady(true);

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key !== COUNTER_STORAGE_KEY || event.newValue === null) {
        return;
      }

      const parsed = Number.parseInt(event.newValue, 10);
      if (!Number.isNaN(parsed)) {
        setCount(parsed);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    if (!isStorageReady || typeof window === "undefined") {
      return;
    }
    window.localStorage.setItem(COUNTER_STORAGE_KEY, String(count));
  }, [count, isStorageReady]);

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

  const resetCount = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setCount(0);
    setIsTapped(false);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={increment}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          increment();
        }
      }}
      className={`relative min-h-screen w-full overflow-hidden bg-slate-50 text-slate-900 transition-transform duration-100 active:scale-[0.995] dark:bg-slate-950 dark:text-slate-100 ${isTapped ? "scale-[0.998]" : "scale-100"}`}
      aria-label="Tap anywhere to increment counter"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.18),transparent_55%)] dark:bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.22),transparent_55%)]" />
      <div
        className={`pointer-events-none absolute inset-0 bg-indigo-500/10 transition-opacity duration-150 dark:bg-cyan-400/10 ${isTapped ? "opacity-100" : "opacity-0"}`}
      />
      <button
        type="button"
        onClick={resetCount}
        className="absolute right-4 top-4 z-20 rounded-full border border-slate-300/80 bg-white/70 px-5 py-2.5 text-sm font-medium tracking-wide text-slate-600 shadow-sm backdrop-blur-sm transition-colors hover:bg-white hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-slate-100"
        aria-label="Reset counter"
      >
        Reset
      </button>

      <div className="relative z-10 flex min-h-screen -translate-y-24 flex-col items-center justify-center px-2 text-center md:-translate-y-32">
        <p
          className={`text-[12rem] leading-none font-light tracking-tight transition-transform duration-100 sm:text-[14rem] md:text-[18rem] ${isTapped ? "scale-105" : "scale-100"}`}
        >
          {count}
        </p>
      </div>
    </div>
  );
}
