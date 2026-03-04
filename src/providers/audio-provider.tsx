"use client";

import { createContext, ReactNode, useCallback, useState } from "react";
import useSound from "use-sound";

type Sound = "click" | "warning" | "success" | "start" | "back";

interface AudioContextProps {
  stopAudio: boolean;
  toggleAudio: () => void;
  playSound: (sound: Sound) => void;
}

export const AudioContext = createContext<AudioContextProps | undefined>(
  undefined
);

export const AudioProvider = ({ children }: { children: ReactNode }) => {
  const [stopAudio, setStopAudio] = useState<boolean>(false);
  const audioVolume = stopAudio ? 0 : 0.4;
  const mcPlusAudioVolume = stopAudio ? 0 : 0.05;

  const soundFiles = {
    click: "/mp3/click.mp3",
    warning: "/mp3/warning.mp3",
    success: "/mp3/success.mp3",
    start: "/mp3/mc-plus.mp3",
    back: "/mp3/back.mp3",
  };

  const [playClick] = useSound(soundFiles.click, { volume: audioVolume });
  const [playWarning] = useSound(soundFiles.warning, { volume: audioVolume });
  const [playSuccess] = useSound(soundFiles.success, { volume: audioVolume });
  const [playMcPlus] = useSound(soundFiles.start, {
    volume: mcPlusAudioVolume,
    loop: true,
  });
  const [playBack] = useSound(soundFiles.back, { volume: audioVolume });

  const playSound = useCallback(
    (sound: Sound) => {
      const soundMap: { [key in Sound]: () => void } = {
        click: playClick,
        warning: playWarning,
        success: playSuccess,
        start: playMcPlus,
        back: playBack,
      };
      soundMap[sound]();
    },
    [playClick, playWarning, playSuccess, playMcPlus, playBack]
  );

  const toggleAudio = useCallback(() => {
    playSound("click");
    setStopAudio((prevStopAudio) => !prevStopAudio);
  }, [playSound]);

  return (
    <AudioContext.Provider value={{ stopAudio, toggleAudio, playSound }}>
      {children}
    </AudioContext.Provider>
  );
};
