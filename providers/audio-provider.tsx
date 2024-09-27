"use client";

import { createContext, ReactNode, useCallback, useState } from "react";
import useSound from "use-sound";

type Sound = "click" | "warning" | "success" | "mc-plus" | "back";

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

  const [playBack] = useSound("/mp3/back.mp3", { volume: audioVolume });
  const [playClick] = useSound("/mp3/click.mp3", { volume: audioVolume });
  const [playWarning] = useSound("/mp3/warning.mp3", { volume: audioVolume });
  const [playSuccess] = useSound("/mp3/success.mp3", { volume: audioVolume });
  const [playMcPlus] = useSound("/mp3/mc-plus.mp3", {
    volume: mcPlusAudioVolume,
    loop: true,
  });

  const playSound = useCallback(
    (sound: Sound) => {
      switch (sound) {
        case "click":
          playClick();
          break;
        case "back":
          playBack();
          break;
        case "warning":
          playWarning();
          break;
        case "success":
          playSuccess();
          break;
        case "mc-plus":
          playMcPlus();
          break;
      }
    },
    [playClick, playWarning, playSuccess, playMcPlus, playBack]
  );

  const toggleAudio = () => {
    playSound("click");
    setStopAudio(!stopAudio);
  };

  return (
    <AudioContext.Provider value={{ stopAudio, toggleAudio, playSound }}>
      {children}
    </AudioContext.Provider>
  );
};
