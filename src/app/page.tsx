"use client";

import { PlayerProvider, usePlayer } from "@/lib/PlayerProvider";
import { BackgroundVideo } from "@/components/BackgroundVideo";
import { VibeSelector } from "@/components/VibeSelector";
import { MusicPlayer } from "@/components/MusicPlayer";
import { StartGate } from "@/components/StartGate";
import db from "@/data/database.json";

function Stage() {
  const { registerActivity } = usePlayer();
  return (
    <main
      onMouseMove={registerActivity}
      onTouchStart={registerActivity}
      className="relative h-screen w-screen"
    >
      <BackgroundVideo />
      <VibeSelector />
      <MusicPlayer />
      <StartGate />
    </main>
  );
}

export default function Home() {
  return (
    <PlayerProvider db={db}>
      <Stage />
    </PlayerProvider>
  );
}
