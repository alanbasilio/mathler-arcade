"use client";

import { useQuery } from "@tanstack/react-query";
import {
  createContext,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import useSound from "use-sound";
import type { RadioNowPlaying } from "@/types/plaza";
import {
  AMBIENT_VOLUME,
  NIGHTWAVE_PLAZA_STREAM_URL,
  PLAZA_POSITION_TICK_MS,
  STANDARD_VOLUME,
} from "@/utils/constants";
import { fetchPlazaStatus } from "@/utils/plaza-radio";

type Sound = "click" | "warning" | "success" | "start" | "back";

/** Minimum ms between polls — avoids hammering the API on fast songs or errors. */
const MIN_POLL_MS = 3_000;
/** Fallback cap when song data is missing. */
const FALLBACK_POLL_MS = 10_000;

interface AudioContextProps {
  stopAudio: boolean;
  toggleAudio: () => void;
  playSound: (sound: Sound) => void;
  ambientActive: boolean;
  nowPlaying: RadioNowPlaying | null;
  nowPlayingPosition: number;
  /** Controls only the radio stream — independent of game sound effects. */
  radioPlaying: boolean;
  toggleRadio: () => void;
}

export const AudioContext = createContext<AudioContextProps | undefined>(
  undefined,
);

export const AudioProvider = ({ children }: { children: ReactNode }) => {
  const [stopAudio, setStopAudio] = useState<boolean>(false);
  const [radioPlaying, setRadioPlaying] = useState<boolean>(true);
  const [ambientActive, setAmbientActive] = useState(false);
  const [nowPlayingPosition, setNowPlayingPosition] = useState(0);

  const audioVolume = stopAudio ? 0 : STANDARD_VOLUME;

  const radioRef = useRef<HTMLAudioElement | null>(null);
  const hlsRef = useRef<{ destroy: () => void } | null>(null);

  const soundFiles = {
    click: "/mp3/click.mp3",
    warning: "/mp3/warning.mp3",
    success: "/mp3/success.mp3",
    back: "/mp3/back.mp3",
  };

  const [playClick] = useSound(soundFiles.click, { volume: audioVolume });
  const [playWarning] = useSound(soundFiles.warning, { volume: audioVolume });
  const [playSuccess] = useSound(soundFiles.success, { volume: audioVolume });
  const [playBack] = useSound(soundFiles.back, { volume: audioVolume });

  // ─── Plaza radio status polling via React Query ───────────────────────────
  const { data: nowPlaying = null, dataUpdatedAt } = useQuery({
    queryKey: ["plaza-status"],
    queryFn: fetchPlazaStatus,
    enabled: ambientActive,
    // Dynamic refetch interval: wait until the current song ends (+ 1 s buffer).
    // Falls back to FALLBACK_POLL_MS when no song data is available.
    refetchInterval: (query) => {
      if (!ambientActive) return false;

      const song = query.state.data;
      if (!song) return FALLBACK_POLL_MS;

      const elapsedSinceFetch = (Date.now() - query.state.dataUpdatedAt) / 1000;
      const timeRemaining = Math.max(
        0,
        song.length - song.position - elapsedSinceFetch,
      );

      // +1 s buffer so the API has time to reflect the new song
      return Math.max(MIN_POLL_MS, (timeRemaining + 1) * 1000);
    },
  });

  // ─── Sync local position counter when fresh data arrives ─────────────────
  useEffect(() => {
    if (!nowPlaying) {
      setNowPlayingPosition(0);
      return;
    }
    setNowPlayingPosition(nowPlaying.position);
  }, [nowPlaying]);

  // ─── Tick local position every second ────────────────────────────────────
  useEffect(() => {
    if (!ambientActive || !nowPlaying || !radioPlaying) return;

    const tickId = window.setInterval(() => {
      const elapsed = (Date.now() - dataUpdatedAt) / 1000;
      setNowPlayingPosition(
        Math.min(nowPlaying.length, nowPlaying.position + elapsed),
      );
    }, PLAZA_POSITION_TICK_MS);

    return () => clearInterval(tickId);
  }, [ambientActive, nowPlaying, radioPlaying, dataUpdatedAt]);

  // ─── HLS stream setup ─────────────────────────────────────────────────────
  useEffect(() => {
    let mounted = true;
    const audio = new Audio();
    radioRef.current = audio;

    const setupStream = async () => {
      const { default: Hls } = await import("hls.js");
      if (!mounted) return;

      if (Hls.isSupported()) {
        const hls = new Hls();
        hlsRef.current = hls;
        hls.loadSource(NIGHTWAVE_PLAZA_STREAM_URL);
        hls.attachMedia(audio);
        return;
      }

      if (audio.canPlayType("application/vnd.apple.mpegurl")) {
        audio.src = NIGHTWAVE_PLAZA_STREAM_URL;
      }
    };

    void setupStream();

    return () => {
      mounted = false;
      hlsRef.current?.destroy();
      hlsRef.current = null;
      audio.pause();
      audio.removeAttribute("src");
      radioRef.current = null;
    };
  }, []);

  // ─── Play / pause radio stream ────────────────────────────────────────────
  useEffect(() => {
    const audio = radioRef.current;
    if (!audio || !ambientActive) return;

    if (!radioPlaying) {
      audio.pause();
      return;
    }

    audio.volume = AMBIENT_VOLUME;
    void audio.play();
  }, [ambientActive, radioPlaying]);

  const playAmbient = useCallback(() => {
    setAmbientActive(true);
    setRadioPlaying(true);
  }, []);

  const toggleRadio = useCallback(() => {
    setRadioPlaying((prev) => !prev);
  }, []);

  const playSound = useCallback(
    (sound: Sound) => {
      const soundMap: Record<Sound, () => void> = {
        click: playClick,
        warning: playWarning,
        success: playSuccess,
        start: playAmbient,
        back: playBack,
      };
      soundMap[sound]();
    },
    [playClick, playWarning, playSuccess, playAmbient, playBack],
  );

  const toggleAudio = useCallback(() => {
    playSound("click");
    setStopAudio((prevStopAudio) => !prevStopAudio);
  }, [playSound]);

  return (
    <AudioContext.Provider
      value={{
        stopAudio,
        toggleAudio,
        playSound,
        ambientActive,
        nowPlaying,
        nowPlayingPosition,
        radioPlaying,
        toggleRadio,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};
