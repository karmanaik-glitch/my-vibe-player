"use client";

import { usePlayer } from "@/lib/PlayerProvider";

export function BackgroundVideo() {
  const { db, vibeIndex } = usePlayer();

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-void">
      {db.vibes.map((vibe, i) => (
        <video
          key={vibe.id}
          src={vibe.src}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-[1200ms] ease-glass"
          style={{ opacity: i === vibeIndex ? 1 : 0 }}
        />
      ))}
      {/* legibility gradient so dock text stays readable over bright footage */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/40 to-transparent" />
    </div>
  );
}
