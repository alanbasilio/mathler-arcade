"use client";

import { GoogleAnalytics } from "@next/third-parties/google";
import { useEffect, useState } from "react";
import { GameContent } from "@/components/game-content";
import { GameOver } from "@/components/game-over";
import { MultiplayerRoot } from "@/components/multiplayer/multiplayer-root";
import { Start } from "@/components/start";
import { RetroGrid } from "@/components/ui/retro-grid";
import { useGame } from "@/hooks/use-game";
import { MultiplayerProvider } from "@/providers/multiplayer-provider";

export default function Mathler() {
  const { gameStarted, gameOver } = useGame();
  const [multiplayerMode, setMultiplayerMode] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sid = params.get("session");
    if (sid) {
      setSessionId(sid);
      setMultiplayerMode(true);
    }
    setReady(true);
  }, []);

  if (!ready) return null;

  if (multiplayerMode) {
    return (
      <div className="flex min-h-screen justify-center items-center align-center z-0 dark:bg-background/80">
        <RetroGrid />
        <MultiplayerProvider>
          <MultiplayerRoot sessionId={sessionId} />
        </MultiplayerProvider>
        <GoogleAnalytics gaId="G-R20575MFZH" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen justify-center items-center align-center z-0 dark:bg-background/80">
      {!gameOver && <RetroGrid />}
      {gameStarted ? (
        gameOver ? (
          <GameOver />
        ) : (
          <GameContent />
        )
      ) : (
        <Start onPlayDuo={() => setMultiplayerMode(true)} />
      )}
      <GoogleAnalytics gaId="G-R20575MFZH" />
    </div>
  );
}
