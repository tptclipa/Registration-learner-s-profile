"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";

const SEQUENCE = [
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "a",
  "d",
  "v",
  "Enter"
] as const;

const IDLE_RESET_MS = 3000;
const WORDMARK = "antDev";
const PARTICLE_COUNT = 14;

function matchesStep(event: KeyboardEvent, expected: string): boolean {
  if (expected.length === 1 && /[a-z]/.test(expected)) {
    return event.key.toLowerCase() === expected;
  }
  return event.key === expected;
}

function isTypingContext(): boolean {
  const el = document.activeElement as HTMLElement | null;
  if (!el) return false;
  const tag = el.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  if (el.isContentEditable) return true;
  return false;
}

export function DeveloperEasterEgg() {
  const [open, setOpen] = useState(false);
  const [wiggleKey, setWiggleKey] = useState(0);
  const close = useCallback(() => setOpen(false), []);

  const particles = useMemo(
    () =>
      Array.from({ length: PARTICLE_COUNT }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 2 + Math.random() * 4,
        delay: Math.random() * 4,
        duration: 6 + Math.random() * 6,
        drift: (Math.random() - 0.5) * 40
      })),
    []
  );

  useEffect(() => {
    let step = 0;
    let resetTimer: ReturnType<typeof setTimeout> | null = null;

    const clearResetTimer = () => {
      if (resetTimer) {
        clearTimeout(resetTimer);
        resetTimer = null;
      }
    };

    const armResetTimer = () => {
      clearResetTimer();
      resetTimer = setTimeout(() => {
        step = 0;
      }, IDLE_RESET_MS);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (isTypingContext()) return;

      const expected = SEQUENCE[step];
      if (matchesStep(event, expected)) {
        step += 1;
        if (step === SEQUENCE.length) {
          step = 0;
          clearResetTimer();
          setOpen(true);
          return;
        }
        armResetTimer();
        return;
      }

      step = matchesStep(event, SEQUENCE[0]) ? 1 : 0;
      if (step === 1) armResetTimer();
      else clearResetTimer();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      clearResetTimer();
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", handleEsc);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, close]);

  if (!open) return null;

  return (
    <div
      className="antdev-easter-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="antdev-easter-title"
      onClick={close}
    >
      <div
        className="antdev-easter-particles"
        aria-hidden="true"
      >
        {particles.map((p) => (
          <span
            key={p.id}
            className="antdev-easter-particle"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              ["--drift" as string]: `${p.drift}px`
            }}
          />
        ))}
      </div>

      <div
        className="antdev-easter-card"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="antdev-easter-close"
          aria-label="Close"
          onClick={close}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path
              d="M6 6l12 12M18 6L6 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <div className="antdev-easter-logo-stage">
          <span className="antdev-easter-glow" aria-hidden="true" />
          <button
            type="button"
            className="antdev-easter-logo-button"
            aria-label="Wiggle the ant"
            onClick={() => setWiggleKey((k) => k + 1)}
          >
            <span
              key={wiggleKey}
              className="antdev-easter-logo-wiggle"
            >
              <Image
                src="/antlogo.png"
                alt=""
                width={180}
                height={180}
                className="antdev-easter-logo"
                priority={false}
              />
            </span>
          </button>
        </div>

        <h2 id="antdev-easter-title" className="antdev-easter-wordmark">
          {WORDMARK.split("").map((char, i) => (
            <span
              key={`${char}-${i}`}
              className={
                i < 3
                  ? "antdev-easter-letter antdev-easter-letter--ant"
                  : "antdev-easter-letter antdev-easter-letter--dev"
              }
              style={{ animationDelay: `${0.15 + i * 0.07}s` }}
            >
              {char}
            </span>
          ))}
        </h2>

        <p className="antdev-easter-tagline">Crafted behind the scenes with Ken :P</p>

        <div className="antdev-easter-hint">
          <span className="antdev-easter-hint-dot" />
          you found the secret
        </div>
      </div>
    </div>
  );
}
