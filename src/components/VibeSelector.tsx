"use client";

import { useState, useRef, useEffect } from "react";
import { usePlayer } from "@/lib/PlayerProvider";

export function VibeSelector() {
  const { db, vibeIndex, selectVibe, isIdle } = usePlayer();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div
      ref={rootRef}
      className={`fixed right-5 top-5 z-20 transition-opacity duration-500 ${
        isIdle ? "opacity-0" : "opacity-100"
      }`}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="glass flex items-center gap-2 rounded-full px-4 py-2 text-xs tracking-wide text-ink transition hover:border-ember/50"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-ember shadow-ember" />
        <span className="font-mono uppercase">{db.vibes[vibeIndex]?.label}</span>
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        >
          <path d="M1 3L5 7L9 3" stroke="currentColor" strokeWidth="1.4" fill="none" />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          className="glass mt-2 w-44 overflow-hidden rounded-2xl py-1 text-xs"
        >
          {db.vibes.map((vibe, i) => (
            <li key={vibe.id}>
              <button
                role="option"
                aria-selected={i === vibeIndex}
                onClick={() => {
                  selectVibe(i);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between px-4 py-2.5 text-left font-mono uppercase tracking-wide transition hover:bg-white/10 ${
                  i === vibeIndex ? "text-ember" : "text-ink-dim"
                }`}
              >
                {vibe.label}
                {i === vibeIndex && <span className="text-ember">●</span>}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
