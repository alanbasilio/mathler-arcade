"use client";

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
  PLAZA_STATUS_POLL_MS,
  STANDARD_VOLUME,
} from "@/utils/constants";
import { fetchPlazaStatus } from "@/utils/plaza-radio";

type Sound = "click" | "warning" | "success" | "start" | "back";

interface AudioContextProps {
  stopAudio: boolean;
  toggleAudio: () => void;
  playSound: (sound: Sound) => void;
  ambientActive: boolean;
  nowPlaying: RadioNowPlaying | null;
  nowPlayingPosition: number;
}

export const AudioContext = createContext<AudioContextProps | undefined>(
  undefined,
);

export const AudioProvider = ({ children }: { children: ReactNode }) => {
  const [stopAudio, setStopAudio] = useState<boolean>(false);
  const [ambientActive, setAmbientActive] = useState(false);
  const [nowPlaying, setNowPlaying] = useState<RadioNowPlaying | null>(null);
  const [nowPlayingPosition, setNowPlayingPosition] = useState(0);
  const positionSyncedAtRef = useRef(0);

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

  const syncNowPlaying = useCallback(async () => {
    const status = await fetchPlazaStatus();
    if (!status) return;

    positionSyncedAtRef.current = Date.now();
    setNowPlaying(status);
    setNowPlayingPosition(status.position);
  }, []);

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

  useEffect(() => {
    const audio = radioRef.current;
    if (!audio || !ambientActive) return;

    if (stopAudio) {
      audio.pause();
      return;
    }

    audio.volume = AMBIENT_VOLUME;
    void audio.play();
  }, [ambientActive, stopAudio]);

  useEffect(() => {
    if (!ambientActive) {
      setNowPlaying(null);
      setNowPlayingPosition(0);
      return;
    }

    void syncNowPlaying();
    const pollId = window.setInterval(() => {
      void syncNowPlaying();
    }, PLAZA_STATUS_POLL_MS);

    return () => clearInterval(pollId);
  }, [ambientActive, syncNowPlaying]);

  useEffect(() => {
    if (!ambientActive || !nowPlaying || stopAudio) return;

    const tickId = window.setInterval(() => {
      const elapsed = (Date.now() - positionSyncedAtRef.current) / 1000;
      setNowPlayingPosition(
        Math.min(nowPlaying.length, nowPlaying.position + elapsed),
      );
    }, PLAZA_POSITION_TICK_MS);

    return () => clearInterval(tickId);
  }, [ambientActive, nowPlaying, stopAudio]);

  const playAmbient = useCallback(() => {
    setAmbientActive(true);
    const audio = radioRef.current;
    if (!audio || stopAudio) return;

    audio.volume = AMBIENT_VOLUME;
    void audio.play();
    void syncNowPlaying();
  }, [stopAudio, syncNowPlaying]);

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
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};
