"use client";

import { Button } from "@/components/ui/button";
import { useGame } from "@/hooks/use-game";

export const GameOver = () => {
  const { targetEquation, targetResult, resetGame } = useGame();

  return (
    <>
      <div className="fixed inset-0 bg-[url('/images/static.gif')] bg-cover z-0" />
      <div className="flex flex-col items-center gap-6 z-10">
        <h1
          className="text-foreground text-3xl md:text-4xl lg:text-5xl xl:text-6xl italic leading-none tracking-tighter animate-flash-title"
          data-cy="title"
        >
          Game Over
        </h1>
        <div className="flex flex-col items-center gap-2 text-center animate-pop">
          <p className="text-foreground text-xs md:text-sm">The answer was:</p>
          <p className="text-foreground text-lg md:text-xl lg:text-2xl font-bold tracking-widest border-4 border-foreground px-4 py-2">
            {targetEquation} = {targetResult}
          </p>
        </div>
        <Button variant="pixel" size="lg" onClick={resetGame}>
          Play Again
        </Button>
      </div>
    </>
  );
};
