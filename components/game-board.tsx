"use client";

import { useGame } from "@/hooks/use-game";
import { cn } from "@/utils/cn";
import { FeedbackColor, getFeedbackColor } from "@/utils/feedback";

interface GameBoardTileProps {
  value: string;
  color?: FeedbackColor;
  index: number;
}

interface GameBoardProps {
  guesses: Guess[];
  currentGuess: string;
}

export interface Guess {
  tiles: GameBoardTileProps[];
}

const GameBoardTile = ({ value, color, index }: GameBoardTileProps) => {
  const feedbackColor = getFeedbackColor(color);
  const { mode } = useGame();

  return (
    <div
      className={cn(
        "w-8 md:w-10 aspect-square flex items-center justify-center text-sm md:text-base lg:text-lg xl:text-2xl font-bold border-foreground border-4 shadow-lg",
        {
          "bg-success": mode === "normal" && feedbackColor === "success",
          "bg-warning": mode === "normal" && feedbackColor === "warning",
          "bg-accent": mode === "normal" && feedbackColor === "accent",
        }
      )}
      data-cy={`tile-${index}`}
    >
      {value}
    </div>
  );
};

const ROWS = 6;
const COLUMNS = 6;

const getTileValue = (
  rowIndex: number,
  columnIndex: number,
  guesses: Guess[],
  currentGuess: string
) => {
  const guess = guesses[rowIndex];
  const isCurrentRow = rowIndex === guesses.length;
  const isFilled = Boolean(guess);

  return isFilled
    ? guess.tiles[columnIndex].value
    : isCurrentRow
    ? currentGuess[columnIndex] || ""
    : "";
};

const getTileColor = (
  rowIndex: number,
  columnIndex: number,
  guesses: Guess[]
) => {
  const guess = guesses[rowIndex];
  return guess ? guess.tiles[columnIndex].color : undefined;
};

const renderTile = (
  rowIndex: number,
  columnIndex: number,
  guesses: Guess[],
  currentGuess: string
) => (
  <GameBoardTile
    key={columnIndex}
    value={getTileValue(rowIndex, columnIndex, guesses, currentGuess)}
    color={getTileColor(rowIndex, columnIndex, guesses)}
    index={columnIndex}
  />
);

const renderRow = (
  rowIndex: number,
  guesses: Guess[],
  currentGuess: string
) => {
  const isCurrentRow = rowIndex === guesses.length;
  const isFilled = Boolean(guesses[rowIndex]);

  return (
    <div
      key={rowIndex}
      className={cn("flex gap-2", !isFilled && !isCurrentRow && "opacity-50")}
      data-cy={`row-${rowIndex}`}
    >
      {Array.from({ length: COLUMNS }, (_, columnIndex) =>
        renderTile(rowIndex, columnIndex, guesses, currentGuess)
      )}
    </div>
  );
};

export const GameBoard = ({ guesses, currentGuess }: GameBoardProps) => (
  <div
    className="grid grid-rows-6 gap-2 bg-background/20 backdrop-blur-sm border-4 border-foreground p-2"
    data-cy="grid"
  >
    {Array.from({ length: ROWS }, (_, rowIndex) =>
      renderRow(rowIndex, guesses, currentGuess)
    )}
  </div>
);
