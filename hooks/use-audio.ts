import { useCallback, useState } from "react";
import useSound from "use-sound";

export const useAudio = () => {
  const [stopAudio, setStopAudio] = useState<boolean>(false);
  const audioVolume = stopAudio ? 0 : 0.25;
  const mcPlusAudioVolume = stopAudio ? 0 : 0.01;

  const [playEnter] = useSound("/mp3/enter.mp3", { volume: audioVolume });
  const [playBack] = useSound("/mp3/back.mp3", { volume: audioVolume });
  const [playClick] = useSound("/mp3/click.mp3", { volume: audioVolume });
  const [playWarning] = useSound("/mp3/warning.mp3", { volume: audioVolume });
  const [playSuccess] = useSound("/mp3/success.mp3", { volume: audioVolume });
  const [playMcPlus] = useSound("/mp3/mc-plus.mp3", {
    volume: mcPlusAudioVolume,
    loop: true,
  });

  const playSound = useCallback(
    (sound: "click" | "warning" | "success" | "mc-plus" | "back" | "enter") => {
      switch (sound) {
        case "click":
          playClick();
          break;
        case "back":
          playBack();
          break;
        case "enter":
          playEnter();
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
    [playClick, playWarning, playSuccess, playMcPlus, playBack, playEnter]
  );

  const toggleAudio = () => {
    setStopAudio(!stopAudio);
  };

  return {
    playSound,
    stopAudio,
    toggleAudio,
  };
};
