"use client";

import { useGame } from "@/hooks/use-game";

export const Start = () => {
  const { startGame } = useGame();
  return (
    <div className="flex flex-col gap-4 items-center">
      <h1
        className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl italic leading-none tracking-tighter animate-pulse"
        data-cy="title"
      >
        Mathler
      </h1>
      <p
        className="text-lg md:text-xl lg:text-2xl text-center mb-2"
        data-cy="subtitle"
      >
        Ready to crunch some numbers?
      </p>
      <button
        onClick={startGame}
        className="nes-btn is-primary text-lg md:text-xl lg:text-2xl animate-pulse"
        data-cy="start"
      >
        PRESS TO START
      </button>
    </div>
  );
};
