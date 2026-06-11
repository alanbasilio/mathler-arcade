"use client";

import { Button } from "@/components/ui/button";
import { useGame } from "@/hooks/use-game";

export const GameOver = () => {
  const { targetEquation, targetResult, resetGame } = useGame();

  return (
    <>
      <div className="fixed inset-0 bg-[url('/images/static.gif')] bg-cover z-0 motion-reduce:hidden" />
      <div className="fixed inset-0 bg-background/70 z-0" />
      <div className="flex flex-col items-center gap-6 z-10">
        <h1
          className="text-foreground font-heading text-3xl md:text-4xl lg:text-5xl xl:text-6xl leading-none animate-flash-title"
          data-cy="title"
        >
          Game Over
        </h1>
        <div className="flex flex-col items-center gap-2 text-center animate-pop">
          <p className="text-foreground text-base md:text-lg">
            The answer was:
          </p>
          <p className="text-foreground font-heading text-lg md:text-xl lg:text-2xl tracking-wider border-4 border-neon-magenta shadow-[4px_4px_0px_color-mix(in_oklch,var(--color-neon-magenta)_45%,transparent)] px-4 py-2">
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
