"use client";

import { useGame } from "@/hooks/use-game";

export const Start = () => {
  const { startGame } = useGame();
  return (
    <div className="flex flex-col gap-6 items-center">
      <h1
        className="text-foreground text-4xl md:text-5xl lg:text-6xl xl:text-7xl italic leading-none tracking-tighter animate-pulse"
        data-cy="title"
      >
        Mathler
      </h1>
      <p
        className="text-foreground text-sm md:text-base lg:text-lg text-center"
        data-cy="subtitle"
      >
        Ready to crunch some numbers?
      </p>
      <button
        onClick={startGame}
        className="nes-btn is-primary text-base md:text-lg lg:text-xl animate-pulse mt-2"
        data-cy="start"
      >
        PRESS TO START
      </button>
    </div>
  );
};
