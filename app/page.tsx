"use client";

import { GameContent } from "@/components/game-content";
import { GameOver } from "@/components/game-over";
import RetroGrid from "@/components/retro-grid";
import { Start } from "@/components/start";
import { useGame } from "@/hooks/use-game";
import { GoogleAnalytics } from "@next/third-parties/google";

export default function Mathler() {
  const { gameStarted, gameOver, startGame } = useGame();

  return (
    <div className="flex min-h-screen justify-center items-center align-center z-0">
      {!gameOver && <RetroGrid />}
      {gameStarted ? (
        gameOver ? (
          <GameOver />
        ) : (
          <GameContent />
        )
      ) : (
        <Start startGame={startGame} />
      )}
      <GoogleAnalytics gaId="G-R20575MFZH" />
    </div>
  );
}
