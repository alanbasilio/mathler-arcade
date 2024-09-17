"use client";

import { Tile, TileProps } from "@/components/tile";
import { cn } from "@/utils/cn";

export interface Guess {
  tiles: TileProps[];
}

interface GameBoardProps {
  guesses: Guess[];
  currentGuess: string;
}

export const GameBoard = ({ guesses, currentGuess }: GameBoardProps) => {
  return (
    <div
      className="grid grid-rows-6 gap-2 bg-background/20 backdrop-blur-sm border-4 border-foreground p-2"
      data-cy="grid"
    >
      {Array(6)
        .fill("")
        .map((_, rowIndex) => {
          const guess = guesses[rowIndex];
          const isCurrentRow = rowIndex === guesses.length;
          const isFilled = Boolean(guess);

          return (
            <div
              key={rowIndex}
              className={cn(
                "flex gap-2",
                !isFilled && !isCurrentRow && "opacity-50"
              )}
              data-cy={`row-${rowIndex}`}
            >
              {Array(6)
                .fill("")
                .map((_, index) => (
                  <Tile
                    key={index}
                    value={
                      isFilled
                        ? guess.tiles[index].value
                        : isCurrentRow
                        ? currentGuess[index] || ""
                        : ""
                    }
                    color={isFilled ? guess.tiles[index].color : undefined}
                    index={index}
                  />
                ))}
            </div>
          );
        })}
    </div>
  );
};
