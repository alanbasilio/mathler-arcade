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

const ROWS = 6;
const COLUMNS = 6;

const renderTile = (
  rowIndex: number,
  columnIndex: number,
  guesses: Guess[],
  currentGuess: string
) => {
  const guess = guesses[rowIndex];
  const isCurrentRow = rowIndex === guesses.length;
  const isFilled = Boolean(guess);

  const tileValue = isFilled
    ? guess.tiles[columnIndex].value
    : isCurrentRow
    ? currentGuess[columnIndex] || ""
    : "";

  const tileColor = isFilled ? guess.tiles[columnIndex].color : undefined;

  return (
    <Tile
      key={columnIndex}
      value={tileValue}
      color={tileColor}
      index={columnIndex}
    />
  );
};

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
