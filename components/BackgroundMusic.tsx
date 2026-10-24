"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/contexts/LanguageProvider";

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
    audio.currentTime = 0;
    wantsMusicRef.current = true;
    setWantsMusic(true);

    const syncPlayingState = () => setIsPlaying(!audio.paused);
    const interactionEvents = ["pointerdown", "pointerup", "touchstart", "click", "keydown"] as const;
    const playWhenAllowed = () => {
      if (!wantsMusicRef.current || !audio.paused) return;
      void audio.play().catch(() => {
        // The first direct visitor gesture retries playback below.
      });
    };
    const unlockOnFirstInteraction = (event: Event) => {
      const target = event.target;
      if (target instanceof Element && target.closest("[data-music-control]")) return;
      playWhenAllowed();
    };
    const removeInteractionListeners = () => {
      interactionEvents.forEach((eventName) => {
        document.removeEventListener(eventName, unlockOnFirstInteraction, true);
      });
    };
    const handlePlay = () => {
      syncPlayingState();
      removeInteractionListeners();
    };

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", syncPlayingState);
    audio.addEventListener("canplay", playWhenAllowed, { once: true });
    interactionEvents.forEach((eventName) => {
      document.addEventListener(eventName, unlockOnFirstInteraction, {
        capture: true,
        passive: eventName !== "keydown",
      });
    });
    window.addEventListener("pageshow", playWhenAllowed);

    syncPlayingState();
    playWhenAllowed();

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", syncPlayingState);
      audio.removeEventListener("canplay", playWhenAllowed);
      removeInteractionListeners();
      window.removeEventListener("pageshow", playWhenAllowed);
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
  };

  const labels = copy[locale];
  const label = isPlaying ? labels.playing : wantsMusic ? labels.play : labels.paused;

  return (
    <>
      <audio ref={audioRef} src="/audio/melody.mp3" preload="auto" autoPlay loop playsInline />
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
