"use client";

import { GameContent } from "@/components/game-content";
import { GameOver } from "@/components/game-over";
import { Start } from "@/components/start";
import { RetroGrid } from "@/components/ui/retro-grid";
import { useGame } from "@/hooks/use-game";
import { GoogleAnalytics } from "@next/third-parties/google";

export default function Mathler() {
  const { gameStarted, gameOver } = useGame();

  return (
    <div className="flex min-h-screen justify-center items-center align-center z-0 dark:bg-background/80">
      {!gameOver && <RetroGrid />}
      {gameStarted ? gameOver ? <GameOver /> : <GameContent /> : <Start />}
      <GoogleAnalytics gaId="G-R20575MFZH" />
    </div>
  );
}
