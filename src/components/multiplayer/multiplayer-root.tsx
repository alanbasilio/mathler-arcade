"use client";

import { useMultiplayer } from "@/hooks/use-multiplayer";
import { Lobby } from "./lobby";
import { MultiplayerGame } from "./multiplayer-game";

interface MultiplayerRootProps {
  sessionId: string | null;
}

export const MultiplayerRoot = ({ sessionId }: MultiplayerRootProps) => {
  const { myPlayer, session } = useMultiplayer();

  const showLobby = !myPlayer || session?.status === "waiting";

  if (showLobby) {
    return <Lobby sessionId={sessionId} />;
  }

  return <MultiplayerGame />;
};
