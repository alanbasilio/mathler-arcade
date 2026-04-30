"use client";

import { useGame } from "@/hooks/use-game";
import { cn } from "@/lib/utils";
import type { GameMode } from "@/providers/game-provider";
import { EQUATION_LENGTH } from "@/utils/constants";
import { type FeedbackColor, getFeedbackColor } from "@/utils/feedback";

interface Tile {
  value: string;
  color: FeedbackColor;
  index: number;
}

interface GameBoardTileProps extends Tile {
  mode: GameMode;
}

export interface Guess {
  tiles: Tile[];
  playerName?: string;
}

const ROWS = EQUATION_LENGTH;
const COLUMNS = EQUATION_LENGTH;

const GameBoardTile = ({ value, color, index, mode }: GameBoardTileProps) => {
  const feedbackColor = getFeedbackColor(color);

  return (
    <div
      className={cn(
        "text-foreground w-10 md:w-12 aspect-square flex items-center justify-center text-base md:text-lg lg:text-xl xl:text-2xl font-bold border-foreground border-4 shadow-lg transition-colors duration-300",
        mode === "normal" && {
          "bg-success text-success-foreground": feedbackColor === "success",
          "bg-warning text-warning-foreground": feedbackColor === "warning",
          "bg-accent": feedbackColor === "outline",
          "bg-destructive text-white": feedbackColor === "destructive",
        },
      )}
      data-cy={`tile-${index}`}
    >
      {value}
    </div>
  );
};

const GameBoardRow = ({ rowIndex }: { rowIndex: number }) => {
  const { guesses, currentGuess, mode } = useGame();

  const isCurrentRow = rowIndex === guesses.length;
  const isFilled = Boolean(guesses[rowIndex]);

  const tileValue = (rowIndex: number, columnIndex: number) => {
    if (isFilled) return guesses[rowIndex].tiles[columnIndex].value;
    if (isCurrentRow) return currentGuess[columnIndex] || "";
    return "";
  };

  const tileColor = (rowIndex: number, columnIndex: number): FeedbackColor =>
    isFilled ? guesses[rowIndex].tiles[columnIndex].color : "default";

  return (
    <div
      key={rowIndex}
      className={cn("flex gap-2", !isFilled && !isCurrentRow && "opacity-50")}
      data-cy={`row-${rowIndex}`}
    >
      {Array.from({ length: COLUMNS }, (_, columnIndex) => (
        <GameBoardTile
          key={`col-${columnIndex}`}
          value={tileValue(rowIndex, columnIndex)}
          color={tileColor(rowIndex, columnIndex)}
          index={columnIndex}
          mode={mode}
        />
      ))}
    </div>
  );
};

export const GameBoard = () => {
  return (
    <div
      className="grid grid-rows-6 gap-2 bg-background/20 backdrop-blur-sm border-4 border-foreground p-2"
      data-cy="grid"
    >
      {Array.from({ length: ROWS }, (_, rowIndex) => (
        <GameBoardRow key={`row-${rowIndex}`} rowIndex={rowIndex} />
      ))}
    </div>
  );
};
