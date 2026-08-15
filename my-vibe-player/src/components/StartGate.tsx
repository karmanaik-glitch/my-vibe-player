"use client";

import { usePlayer } from "@/lib/PlayerProvider";

export function StartGate() {
  const { hasStarted, begin } = usePlayer();

  if (hasStarted) return null;

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-void/70 backdrop-blur-md">
      <button
        onClick={begin}
        className="glass group flex flex-col items-center gap-4 rounded-full px-12 py-12 transition hover:border-ember/50"
      >
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-ember text-void transition group-hover:scale-105">
          <svg width="18" height="18" viewBox="0 0 14 14" fill="currentColor">
            <path d="M2.5 1.2v11.6a1 1 0 0 0 1.53.85l9.1-5.8a1 1 0 0 0 0-1.7l-9.1-5.8a1 1 0 0 0-1.53.85z" />
          </svg>
        </span>
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-ink-dim">
          Tap to begin
        </span>
      </button>
    </div>
  );
}
