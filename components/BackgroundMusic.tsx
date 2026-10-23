"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/contexts/LanguageProvider";

const ENABLED_KEY = "driftcoconut.music.enabled";
const TIME_KEY = "driftcoconut.music.time";

const copy = {
  en: {
    play: "Play music",
    playing: "Music on",
    paused: "Music off",
    playAria: "Play background music",
    pauseAria: "Pause background music",
  },
  th: {
    play: "เล่นเพลง",
    playing: "เปิดเพลง",
    paused: "ปิดเพลง",
    playAria: "เล่นเพลงพื้นหลัง",
    pauseAria: "หยุดเพลงพื้นหลัง",
  },
  zh: {
    play: "播放音乐",
    playing: "音乐开启",
    paused: "音乐关闭",
    playAria: "播放背景音乐",
    pauseAria: "暂停背景音乐",
  },
} as const;

export default function BackgroundMusic() {
  const { locale } = useLanguage();
  const audioRef = useRef<HTMLAudioElement>(null);
  const wantsMusicRef = useRef(true);
  const [wantsMusic, setWantsMusic] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.14;

    try {
      const enabled = window.localStorage.getItem(ENABLED_KEY) !== "false";
      wantsMusicRef.current = enabled;
      setWantsMusic(enabled);

      const savedTime = Number(window.sessionStorage.getItem(TIME_KEY));
      if (Number.isFinite(savedTime) && savedTime > 0) {
        audio.currentTime = savedTime;
      }
    } catch {
      // Storage may be unavailable in private browsing; the control still works.
    }

    const syncPlayingState = () => setIsPlaying(!audio.paused);
    const playWhenAllowed = () => {
      if (!wantsMusicRef.current || !audio.paused) return;
      void audio.play().catch(() => {
        // Browsers can require another direct gesture before starting audio.
      });
    };
    const unlockOnFirstInteraction = (event: Event) => {
      const target = event.target;
      if (target instanceof Element && target.closest("[data-music-control]")) return;
      playWhenAllowed();
    };
    const savePosition = () => {
      try {
        window.sessionStorage.setItem(TIME_KEY, String(audio.currentTime || 0));
      } catch {
        // Navigation should continue normally when storage is unavailable.
      }
    };

    audio.addEventListener("play", syncPlayingState);
    audio.addEventListener("pause", syncPlayingState);
    document.addEventListener("pointerdown", unlockOnFirstInteraction, {
      once: true,
      passive: true,
    });
    document.addEventListener("keydown", unlockOnFirstInteraction, { once: true });
    window.addEventListener("pagehide", savePosition);

    syncPlayingState();

    return () => {
      audio.removeEventListener("play", syncPlayingState);
      audio.removeEventListener("pause", syncPlayingState);
      document.removeEventListener("pointerdown", unlockOnFirstInteraction);
      document.removeEventListener("keydown", unlockOnFirstInteraction);
      window.removeEventListener("pagehide", savePosition);
    };
  }, []);

  const toggleMusic = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!audio.paused) {
      wantsMusicRef.current = false;
      setWantsMusic(false);
      audio.pause();
    } else {
      wantsMusicRef.current = true;
      setWantsMusic(true);
      try {
        await audio.play();
      } catch {
        setIsPlaying(false);
      }
    }

    try {
      window.localStorage.setItem(ENABLED_KEY, String(wantsMusicRef.current));
    } catch {
      // The current-session toggle still works when storage is unavailable.
    }
  };

  const labels = copy[locale];
  const label = isPlaying ? labels.playing : wantsMusic ? labels.play : labels.paused;

  return (
    <>
      <audio ref={audioRef} src="/audio/melody.mp3" preload="metadata" loop playsInline />
      <button
        type="button"
        className="drift-music-control"
        aria-label={isPlaying ? labels.pauseAria : labels.playAria}
        aria-pressed={isPlaying}
        data-music-control
        onClick={toggleMusic}
      >
        <span className="drift-music-bars" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span>{label}</span>
      </button>
    </>
  );
}
