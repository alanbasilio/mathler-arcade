import { useContext } from "react";
import { MultiplayerContext } from "@/providers/multiplayer-provider";

export const useMultiplayer = () => {
  const context = useContext(MultiplayerContext);
  if (!context) {
    throw new Error("useMultiplayer must be used within a MultiplayerProvider");
  }
  return context;
};
