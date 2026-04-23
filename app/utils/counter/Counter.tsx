"use client";

import { useEffect, useId, useRef, useState } from "react";

const COUNTER_STORAGE_KEY = "trackmyday:counter:value";
const COUNTER_VOLUME_STORAGE_KEY = "trackmyday:counter:volume";
const COUNTER_THEME_STORAGE_KEY = "trackmyday:counter:theme";
const COUNTER_MUTE_STORAGE_KEY = "trackmyday:counter:muted";
const COUNTER_GOAL_STORAGE_KEY = "trackmyday:counter:goal";
const DEFAULT_TAP_VOLUME = 70;
const MIN_TAP_VOLUME = 0;
const MAX_TAP_VOLUME = 100;
const DEFAULT_GOAL = 108;
const TAP_THEMES = ["click", "pop", "wood"] as const;

type TapTheme = (typeof TAP_THEMES)[number];

export default function Counter() {
  const [count, setCount] = useState(0);
  const [goal, setGoal] = useState(DEFAULT_GOAL);
  const [tapVolume, setTapVolume] = useState(DEFAULT_TAP_VOLUME);
  const [tapTheme, setTapTheme] = useState<TapTheme>("click");
  const [isMuted, setIsMuted] = useState(false);
  const [isTapped, setIsTapped] = useState(false);
  const [isStorageReady, setIsStorageReady] = useState(false);
  const tapTimeoutRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const hapticInputRef = useRef<HTMLInputElement | null>(null);
  const hapticLabelRef = useRef<HTMLLabelElement | null>(null);
  const hapticInputId = useId();
  const touchStartYRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (tapTimeoutRef.current) {
        window.clearTimeout(tapTimeoutRef.current);
      }
      if (audioContextRef.current) {
        void audioContextRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    if (hapticInputRef.current) {
      hapticInputRef.current.setAttribute("switch", "");
    }
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
    const storedVolume = window.localStorage.getItem(COUNTER_VOLUME_STORAGE_KEY);
    if (storedVolume !== null) {
      const parsedVolume = Number.parseInt(storedVolume, 10);
      if (!Number.isNaN(parsedVolume)) {
        setTapVolume(Math.min(MAX_TAP_VOLUME, Math.max(MIN_TAP_VOLUME, parsedVolume)));
      }
    }
    const storedTheme = window.localStorage.getItem(COUNTER_THEME_STORAGE_KEY);
    if (storedTheme && TAP_THEMES.includes(storedTheme as TapTheme)) {
      setTapTheme(storedTheme as TapTheme);
    }
    const storedMute = window.localStorage.getItem(COUNTER_MUTE_STORAGE_KEY);
    if (storedMute !== null) {
      setIsMuted(storedMute === "true");
    }
    const storedGoal = window.localStorage.getItem(COUNTER_GOAL_STORAGE_KEY);
    if (storedGoal !== null) {
      const parsedGoal = Number.parseInt(storedGoal, 10);
      if (!Number.isNaN(parsedGoal) && parsedGoal > 0) {
        setGoal(parsedGoal);
      }
    }
    setIsStorageReady(true);

    const handleStorageChange = (event: StorageEvent) => {
      if (event.newValue === null) {
        return;
      }

      if (event.key === COUNTER_STORAGE_KEY) {
        const parsed = Number.parseInt(event.newValue, 10);
        if (!Number.isNaN(parsed)) {
          setCount(parsed);
        }
      }

      if (event.key === COUNTER_VOLUME_STORAGE_KEY) {
        const parsedVolume = Number.parseInt(event.newValue, 10);
        if (!Number.isNaN(parsedVolume)) {
          setTapVolume(Math.min(MAX_TAP_VOLUME, Math.max(MIN_TAP_VOLUME, parsedVolume)));
        }
      }

      if (event.key === COUNTER_THEME_STORAGE_KEY && TAP_THEMES.includes(event.newValue as TapTheme)) {
        setTapTheme(event.newValue as TapTheme);
      }

      if (event.key === COUNTER_MUTE_STORAGE_KEY) {
        setIsMuted(event.newValue === "true");
      }

      if (event.key === COUNTER_GOAL_STORAGE_KEY) {
        const parsedGoal = Number.parseInt(event.newValue, 10);
        if (!Number.isNaN(parsedGoal) && parsedGoal > 0) {
          setGoal(parsedGoal);
        }
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

  useEffect(() => {
    if (!isStorageReady || typeof window === "undefined") {
      return;
    }
    window.localStorage.setItem(COUNTER_VOLUME_STORAGE_KEY, String(tapVolume));
  }, [tapVolume, isStorageReady]);

  useEffect(() => {
    if (!isStorageReady || typeof window === "undefined") {
      return;
    }
    window.localStorage.setItem(COUNTER_THEME_STORAGE_KEY, tapTheme);
  }, [tapTheme, isStorageReady]);

  useEffect(() => {
    if (!isStorageReady || typeof window === "undefined") {
      return;
    }
    window.localStorage.setItem(COUNTER_MUTE_STORAGE_KEY, String(isMuted));
  }, [isMuted, isStorageReady]);

  useEffect(() => {
    if (!isStorageReady || typeof window === "undefined") {
      return;
    }
    window.localStorage.setItem(COUNTER_GOAL_STORAGE_KEY, String(goal));
  }, [goal, isStorageReady]);

  const playTapSound = (volume: number = tapVolume, theme: TapTheme = tapTheme) => {
    if (isMuted || volume <= 0) {
      return;
    }
    if (typeof window === "undefined") {
      return;
    }

    const ContextConstructor =
      window.AudioContext ||
      (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!ContextConstructor) {
      return;
    }

    if (!audioContextRef.current) {
      audioContextRef.current = new ContextConstructor();
    }

    const context = audioContextRef.current;
    if (context.state === "suspended") {
      void context.resume();
    }

    const now = context.currentTime;
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    if (theme === "click") {
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(720, now);
      oscillator.frequency.exponentialRampToValueAtTime(520, now + 0.06);
    } else if (theme === "pop") {
      oscillator.type = "triangle";
      oscillator.frequency.setValueAtTime(520, now);
      oscillator.frequency.exponentialRampToValueAtTime(280, now + 0.075);
    } else {
      oscillator.type = "triangle";
      oscillator.frequency.setValueAtTime(240, now);
      oscillator.frequency.exponentialRampToValueAtTime(140, now + 0.09);
    }

    gainNode.gain.setValueAtTime(0.0001, now);
    const volumeNormalized = volume / 100;
    const themeMultiplier = theme === "click" ? 1 : theme === "pop" ? 1 : 1.15;
    const targetGain = (0.00003 + Math.pow(volumeNormalized, 1.35) * 6) * themeMultiplier;
    gainNode.gain.exponentialRampToValueAtTime(targetGain, now + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + (theme === "click" ? 0.08 : 0.1));

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);
    oscillator.start(now);
    oscillator.stop(now + (theme === "click" ? 0.09 : theme === "pop" ? 0.09 : 0.11));
  };

  const updateVolume =
    (delta: number) => (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      setTapVolume((prev) => {
        const next = prev + delta;
        const bounded = Math.min(MAX_TAP_VOLUME, Math.max(MIN_TAP_VOLUME, next));
        playTapSound(bounded);
        return bounded;
      });
    };

  const selectTheme =
    (theme: TapTheme) => (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      setTapTheme(theme);
      playTapSound(tapVolume, theme);
    };

  const toggleMute = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setIsMuted((prev) => !prev);
  };

  const triggerTapHaptic = () => {
    if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
      navigator.vibrate(12);
      return;
    }

    hapticLabelRef.current?.click();
  };

  const increment = () => {
    setCount((prev) => prev + 1);

    setIsTapped(true);
    if (tapTimeoutRef.current) {
      window.clearTimeout(tapTimeoutRef.current);
    }
    tapTimeoutRef.current = window.setTimeout(() => {
      setIsTapped(false);
    }, 120);

    triggerTapHaptic();

    playTapSound();
  };

  const resetCount = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setCount(0);
    setIsTapped(false);
  };

  const progress = Math.min(count / Math.max(goal, 1), 1);
  const waveHeight = Math.max(progress * 100, 6);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={increment}
      onTouchStart={(e) => {
        touchStartYRef.current = e.touches[0].clientY;
      }}
      onTouchEnd={(e) => {
        if (touchStartYRef.current === null) return;
        const deltaY = e.changedTouches[0].clientY - touchStartYRef.current;
        if (deltaY < -50) {
          increment();
        }
        touchStartYRef.current = null;
      }}
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
      <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center">
        <div className="flex items-center gap-3 rounded-full border border-slate-300/70 bg-white/65 px-3 py-2 shadow-sm backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/65">
          <button
            type="button"
            onClick={updateVolume(-5)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-lg font-light text-slate-600 transition-colors hover:bg-slate-200/70 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100"
            aria-label="Decrease tap volume"
          >
            -
          </button>
          <p className="w-14 text-center text-xs font-medium tracking-[0.16em] text-slate-600 dark:text-slate-300">
            {tapVolume}%
          </p>
          <button
            type="button"
            onClick={updateVolume(5)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-lg font-light text-slate-600 transition-colors hover:bg-slate-200/70 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100"
            aria-label="Increase tap volume"
          >
            +
          </button>
        </div>
        <p className="mt-2 text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500/80 dark:text-slate-400/80">
          Volume
        </p>
        <div className="mt-2 flex items-center gap-2 rounded-full border border-slate-300/60 bg-white/60 px-2 py-1.5 shadow-sm backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/60">
          {TAP_THEMES.map((theme) => (
            <button
              key={theme}
              type="button"
              onClick={selectTheme(theme)}
              className={`rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-[0.12em] transition-colors ${
                tapTheme === theme
                  ? "bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900"
                  : "text-slate-600 hover:bg-slate-200/70 dark:text-slate-300 dark:hover:bg-slate-800"
              }`}
              aria-label={`Use ${theme} tap sound`}
            >
              {theme}
            </button>
          ))}
          <button
            type="button"
            onClick={toggleMute}
            className={`rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-[0.12em] transition-colors ${
              isMuted
                ? "bg-rose-600 text-white dark:bg-rose-500"
                : "text-slate-600 hover:bg-slate-200/70 dark:text-slate-300 dark:hover:bg-slate-800"
            }`}
            aria-label={isMuted ? "Unmute tap sound" : "Mute tap sound"}
          >
            {isMuted ? "Unmute" : "Mute"}
          </button>
        </div>
      </div>

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 pb-40 pt-10 text-center">
        <div className="relative h-[320px] w-[320px] max-w-[88vw] rounded-full border border-white/20 bg-slate-900/15 shadow-[0_20px_60px_rgba(15,23,42,0.25)] backdrop-blur-sm dark:bg-slate-900/30">
          <div className="absolute inset-0 overflow-hidden rounded-full">
            <div className="absolute inset-0 bg-slate-900/10 dark:bg-slate-900/25" />
            <div
              className="absolute inset-x-0 bottom-0 transition-[height] duration-300"
              style={{ height: `${waveHeight}%`, width: `110%`, rotate: `-6deg` }}
            >
              <svg
                className="absolute -top-9 left-0 h-10 w-full"
                viewBox="0 0 320 48"
                preserveAspectRatio="none"
                aria-hidden
              >
                <path
                  d="M0 30 C32 4, 84 54, 130 30 C176 6, 232 50, 276 28 C298 18, 310 18, 320 24 L320 48 L0 48 Z"
                  className="fill-emerald-300/85"
                />
                <path
                  d="M0 36 C44 10, 102 56, 150 34 C202 10, 252 52, 320 28 L320 48 L0 48 Z"
                  className="fill-emerald-400/90"
                />
              </svg>
              <div className="absolute inset-0 bg-emerald-400/88" />
            </div>
          </div>

          <div
            className="absolute left-1/2 top-9 z-20 -translate-x-1/2"
            onClick={(event) => {
              event.stopPropagation();
            }}
          >
            <label className="text-center">
              <input
                type="number"
                min={1}
                step={1}
                value={goal}
                onChange={(event) => {
                  const nextGoal = Number.parseInt(event.target.value, 10);
                  if (!Number.isNaN(nextGoal) && nextGoal > 0) {
                    setGoal(nextGoal);
                  }
                }}
                onClick={(event) => {
                  event.stopPropagation();
                }}
                className="w-[6ch] appearance-none bg-transparent px-0 py-0 text-center text-[12px] font-medium tracking-[0.2em] text-white/80 outline-none [text-shadow:0_2px_8px_rgba(15,23,42,0.22)]"
                aria-label="Goal value"
              />
            </label>
          </div>

          <div className="absolute inset-0 z-10 flex items-center justify-center pt-4">
            <p
              className={`text-[6.1rem] leading-none font-semibold tracking-tight text-white drop-shadow-[0_8px_26px_rgba(15,23,42,0.48)] transition-transform duration-100 sm:text-[7rem] md:text-[7.8rem] ${isTapped ? "scale-105" : "scale-100"}`}
            >
              {count}
            </p>
          </div>
        </div>
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute h-0 w-0 overflow-hidden opacity-0"
        onClickCapture={(event) => {
          event.stopPropagation();
        }}
      >
        <input
          ref={hapticInputRef}
          id={hapticInputId}
          type="checkbox"
          onClick={(event) => {
            event.stopPropagation();
          }}
        />
        <label
          ref={hapticLabelRef}
          htmlFor={hapticInputId}
          onClick={(event) => {
            event.stopPropagation();
          }}
        >
          haptic fallback
        </label>
      </div>
    </div>
  );
}
