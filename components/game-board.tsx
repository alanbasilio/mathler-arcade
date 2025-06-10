"use client";

import { useGame } from "@/hooks/use-game";
import { cn } from "@/utils/cn";
import { FeedbackColor, getFeedbackColor } from "@/utils/feedback";

interface GameBoardTileProps {
  value: string;
  color: FeedbackColor;
  index: number;
}

export interface Guess {
  tiles: GameBoardTileProps[];
}

const ROWS = 6;
const COLUMNS = 6;

const GameBoardTile = ({ value, color, index }: GameBoardTileProps) => {
  const feedbackColor = getFeedbackColor(color);
  const { mode } = useGame();

  return (
    <div
      className={cn(
        "w-8 md:w-10 aspect-square flex items-center justify-center text-sm md:text-base lg:text-lg xl:text-2xl font-bold border-foreground border-4 shadow-lg",
        mode === "normal" && {
          "bg-success": feedbackColor === "success",
          "bg-warning": feedbackColor === "warning",
          "bg-accent": feedbackColor === "accent",
        }
      )}
      data-cy={`tile-${index}`}
    >
      {value}
    </div>
  );
};

const GameBoardRow = ({ rowIndex }: { rowIndex: number }) => {
  const { guesses, currentGuess } = useGame();

  const isCurrentRow = rowIndex === guesses.length;
  const isFilled = Boolean(guesses[rowIndex]);

  const tileValue = (rowIndex: number, columnIndex: number) => {
    if (isFilled) {
      return guesses[rowIndex].tiles[columnIndex].value;
    }
    if (isCurrentRow) {
      return currentGuess[columnIndex] || "";
    }
    return "";
  };

  const tileColor = (rowIndex: number, columnIndex: number) => {
    return isFilled ? guesses[rowIndex].tiles[columnIndex].color : "default";
  };

  return (
    <div
      key={rowIndex}
      className={cn("flex gap-2", !isFilled && !isCurrentRow && "opacity-50")}
      data-cy={`row-${rowIndex}`}
    >
      {Array.from({ length: COLUMNS }, (_, columnIndex) => (
        <GameBoardTile
          key={columnIndex}
          value={tileValue(rowIndex, columnIndex)}
          color={tileColor(rowIndex, columnIndex)}
          index={columnIndex}
        />
      ))}
    </div>
  );
};

export const GameBoard = () => {
  return (
    <div
      className="grid grid-rows-6 gap-2 bg-background/20 backdrop-blur-xs border-4 border-foreground p-2"
      data-cy="grid"
    >
      {Array.from({ length: ROWS }, (_, rowIndex) => (
        <GameBoardRow key={rowIndex} rowIndex={rowIndex} />
      ))}
    </div>
  );
};
