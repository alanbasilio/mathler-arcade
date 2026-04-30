"use client";

import { Button } from "@/components/ui/button";
import { useGame } from "@/hooks/use-game";

interface StartProps {
  onPlayDuo: () => void;
}

export const Start = ({ onPlayDuo }: StartProps) => {
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
      <div className="flex max-md:flex-col gap-3 items-center mt-2">
        <Button
          onClick={startGame}
          variant="pixel"
          size="lg"
          className="text-base md:text-lg lg:text-xl animate-pulse"
          data-cy="start"
        >
          PLAY SOLO
        </Button>
        <Button
          onClick={onPlayDuo}
          variant="pixel"
          size="lg"
          className="text-base md:text-lg lg:text-xl"
          data-cy="start-duo"
        >
          PLAY DUO
        </Button>
      </div>
    </div>
  );
};
