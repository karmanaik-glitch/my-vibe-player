"use client";

import { usePlayer } from "@/lib/PlayerProvider";

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

export function MusicPlayer() {
  const {
    db,
    trackIndex,
    isPlaying,
    hasStarted,
    progress,
    duration,
    volume,
    isIdle,
    begin,
    togglePlay,
    next,
    prev,
    seek,
    setVolume,
  } = usePlayer();

  const track = db.tracks[trackIndex];
  const pct = duration ? (progress / duration) * 100 : 0;

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = (Number(e.target.value) / 100) * duration;
    seek(time);
  };

  return (
    <div
      className={`fixed inset-x-0 bottom-6 z-20 flex justify-center px-4 transition-all duration-500 ${
        isIdle ? "translate-y-2 opacity-0" : "translate-y-0 opacity-100"
      }`}
    >
      <div className="glass flex w-full max-w-xl items-center gap-4 rounded-3xl px-4 py-3 sm:gap-5 sm:px-6 sm:py-4">
        {/* album art */}
        <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl bg-white/10 sm:h-14 sm:w-14">
          {track && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={track.cover}
              alt=""
              className="h-full w-full object-cover"
            />
          )}
        </div>

        {/* title, progress, controls */}
        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex items-baseline justify-between gap-2">
            <p className="truncate text-sm font-medium text-ink">
              {track?.title ?? "—"}
            </p>
            <p className="flex-shrink-0 font-mono text-[10px] text-ink-dim">
              {formatTime(progress)} / {formatTime(duration)}
            </p>
          </div>
          <p className="mb-2 truncate text-[11px] text-ink-dim">
            {track?.artist}
          </p>

          <div className="group relative flex h-3 items-center">
            <div className="h-[3px] w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-ember shadow-ember"
                style={{ width: `${pct}%` }}
              />
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={pct}
              onChange={handleSeek}
              aria-label="Seek"
              className="absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-ember [&::-webkit-slider-thumb]:opacity-0 group-hover:[&::-webkit-slider-thumb]:opacity-100"
            />
          </div>
        </div>

        {/* transport controls */}
        <div className="flex flex-shrink-0 items-center gap-1 sm:gap-2">
          <button
            onClick={prev}
            aria-label="Previous track"
            className="rounded-full p-2 text-ink-dim transition hover:text-ink"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M4 3v10h1.5V9.2l6 3.8V3l-6 3.8V3H4z" />
            </svg>
          </button>

          <button
            onClick={hasStarted ? togglePlay : begin}
            aria-label={isPlaying ? "Pause" : "Play"}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-ember text-void transition hover:scale-105 sm:h-10 sm:w-10"
          >
            {isPlaying ? (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                <rect x="2" y="1" width="3.5" height="12" rx="1" />
                <rect x="8.5" y="1" width="3.5" height="12" rx="1" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                <path d="M2.5 1.2v11.6a1 1 0 0 0 1.53.85l9.1-5.8a1 1 0 0 0 0-1.7l-9.1-5.8a1 1 0 0 0-1.53.85z" />
              </svg>
            )}
          </button>

          <button
            onClick={next}
            aria-label="Next track"
            className="rounded-full p-2 text-ink-dim transition hover:text-ink"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M12 3v10h-1.5V9.2l-6 3.8V3l6 3.8V3H12z" />
            </svg>
          </button>

          <input
            type="range"
            min={0}
            max={100}
            value={volume * 100}
            onChange={(e) => setVolume(Number(e.target.value) / 100)}
            aria-label="Volume"
            className="ml-1 hidden w-16 accent-ember sm:block"
          />
        </div>
      </div>
    </div>
  );
}
