"use client";

import moment from "moment";
import { Button } from "@/components/ui/button";
import { useGame } from "@/hooks/use-game";

interface StartProps {
  onPlayDuo: () => void;
}

export const Start = ({ onPlayDuo }: StartProps) => {
  const { startGame, targetResult } = useGame();

  return (
    <div className="flex flex-col gap-6 items-center">
      {/* Arcade header bar */}
      <p className="text-foreground text-[0.45rem] md:text-[0.55rem] tracking-[0.3em] select-none">
        ░░░ ARCADE ░░░
      </p>

      {/* Title with periodic glitch */}
      <h1
        className="text-foreground text-4xl md:text-5xl lg:text-6xl xl:text-7xl italic leading-none tracking-tighter animate-glitch"
        data-cy="title"
      >
        Mathler
      </h1>

      <p
        className="text-foreground text-[0.55rem] md:text-xs text-center"
        data-cy="subtitle"
      >
        Ready to crunch some numbers?
      </p>

      {/* Action buttons */}
      <div className="flex max-md:flex-col gap-3 items-center mt-1">
        <Button
          onClick={startGame}
          variant="pixel"
          size="lg"
          className="text-base md:text-lg lg:text-xl"
          data-cy="start"
        >
          ▶ PLAY SOLO
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

      {/* Footer credits */}
      <p className="text-foreground text-[0.4rem] tracking-[0.2em] select-none mt-2">
        © {moment().year()} · Alan Basilio
      </p>
    </div>
  );
};
