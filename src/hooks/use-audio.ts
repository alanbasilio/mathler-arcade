import { useContext } from "react";
import { AudioContext } from "@/providers/audio-provider";

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
};
