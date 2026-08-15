"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type { Database } from "./types";

const STORAGE_KEY = "vibe-player:v1";

type StoredPrefs = {
  trackIndex: number;
  vibeIndex: number;
  volume: number;
};

type PlayerContextValue = {
  db: Database;
  audioRef: React.RefObject<HTMLAudioElement>;
  trackIndex: number;
  vibeIndex: number;
  isPlaying: boolean;
  hasStarted: boolean;
  progress: number;
  duration: number;
  volume: number;
  isIdle: boolean;
  begin: () => void;
  togglePlay: () => void;
  next: () => void;
  prev: () => void;
  seek: (time: number) => void;
  setVolume: (v: number) => void;
  selectVibe: (index: number) => void;
  registerActivity: () => void;
};

const PlayerContext = createContext<PlayerContextValue | null>(null);

const FADE_MS = 380;

function readPrefs(): StoredPrefs | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredPrefs) : null;
  } catch {
    return null;
  }
}

function writePrefs(prefs: StoredPrefs) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    // localStorage unavailable — non-fatal, prefs just won't persist
  }
}

export function PlayerProvider({
  db,
  children,
}: {
  db: Database;
  children: React.ReactNode;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const fadeHandle = useRef<number | null>(null);

  const initial = readPrefs();
  const [trackIndex, setTrackIndex] = useState(
    Math.min(initial?.trackIndex ?? 0, db.tracks.length - 1)
  );
  const [vibeIndex, setVibeIndex] = useState(
    Math.min(initial?.vibeIndex ?? 0, db.vibes.length - 1)
  );
  const [volume, setVolumeState] = useState(initial?.volume ?? 0.8);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isIdle, setIsIdle] = useState(false);

  const idleTimer = useRef<number | null>(null);

  const registerActivity = useCallback(() => {
    setIsIdle(false);
    if (idleTimer.current) window.clearTimeout(idleTimer.current);
    idleTimer.current = window.setTimeout(() => setIsIdle(true), 3200);
  }, []);

  useEffect(() => {
    registerActivity();
    return () => {
      if (idleTimer.current) window.clearTimeout(idleTimer.current);
    };
  }, [registerActivity]);

  // persist prefs whenever they change
  useEffect(() => {
    writePrefs({ trackIndex, vibeIndex, volume });
  }, [trackIndex, vibeIndex, volume]);

  const fadeTo = useCallback((target: number, onDone?: () => void) => {
    const audio = audioRef.current;
    if (!audio) return;
    if (fadeHandle.current) window.clearInterval(fadeHandle.current);
    const steps = 16;
    const start = audio.volume;
    const delta = (target - start) / steps;
    let i = 0;
    fadeHandle.current = window.setInterval(() => {
      i += 1;
      audio.volume = Math.min(1, Math.max(0, start + delta * i));
      if (i >= steps) {
        if (fadeHandle.current) window.clearInterval(fadeHandle.current);
        onDone?.();
      }
    }, FADE_MS / steps);
  }, []);

  const playTrack = useCallback(
    (index: number, autoplay = true) => {
      const audio = audioRef.current;
      if (!audio) return;
      const track = db.tracks[index];
      if (!track) return;

      const swap = () => {
        audio.src = track.src;
        audio.currentTime = 0;
        if (autoplay) {
          audio.volume = 0;
          audio.play().catch(() => setIsPlaying(false));
          setIsPlaying(true);
          fadeTo(volume);
        }
      };

      if (!audio.src || audio.paused) {
        swap();
      } else {
        fadeTo(0, swap);
      }
      setTrackIndex(index);
    },
    [db.tracks, fadeTo, volume]
  );

  const begin = useCallback(() => {
    setHasStarted(true);
    playTrack(trackIndex, true);
  }, [playTrack, trackIndex]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      fadeTo(0, () => audio.pause());
      setIsPlaying(false);
    } else {
      audio.play().catch(() => {});
      fadeTo(volume);
      setIsPlaying(true);
    }
  }, [isPlaying, fadeTo, volume]);

  const next = useCallback(() => {
    const nextIndex = (trackIndex + 1) % db.tracks.length;
    playTrack(nextIndex, true);
  }, [trackIndex, db.tracks.length, playTrack]);

  const prev = useCallback(() => {
    const prevIndex = (trackIndex - 1 + db.tracks.length) % db.tracks.length;
    playTrack(prevIndex, true);
  }, [trackIndex, db.tracks.length, playTrack]);

  const seek = useCallback((time: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = time;
    setProgress(time);
  }, []);

  const setVolume = useCallback(
    (v: number) => {
      const clamped = Math.min(1, Math.max(0, v));
      setVolumeState(clamped);
      const audio = audioRef.current;
      if (audio && !fadeHandle.current) audio.volume = clamped;
    },
    []
  );

  const selectVibe = useCallback((index: number) => {
    setVibeIndex(index);
  }, []);

  // wire up audio element listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => setProgress(audio.currentTime);
    const onMeta = () => setDuration(audio.duration || 0);
    const onEnd = () => next();
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("ended", onEnd);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("ended", onEnd);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [next]);

  // keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement && e.target.tagName === "SELECT") return;
      if (e.code === "Space") {
        e.preventDefault();
        hasStarted ? togglePlay() : begin();
      } else if (e.code === "ArrowRight") {
        next();
      } else if (e.code === "ArrowLeft") {
        prev();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [togglePlay, next, prev, begin, hasStarted]);

  return (
    <PlayerContext.Provider
      value={{
        db,
        audioRef,
        trackIndex,
        vibeIndex,
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
        selectVibe,
        registerActivity,
      }}
    >
      <audio ref={audioRef} preload="auto" />
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used within PlayerProvider");
  return ctx;
}
