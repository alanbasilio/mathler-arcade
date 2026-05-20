"use client";

import { useEffect, useRef, useState } from "react";
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
  isRevealing: boolean;
  revealDelay: number;
  isBouncing: boolean;
  bounceDelay: number;
  isActiveCursor: boolean;
}

export interface Guess {
  tiles: Tile[];
  playerName?: string;
}

const ROWS = EQUATION_LENGTH;
const COLUMNS = EQUATION_LENGTH;

const GameBoardTile = ({
  value,
  color,
  index,
  mode,
  isRevealing,
  revealDelay,
  isBouncing,
  bounceDelay,
  isActiveCursor,
}: GameBoardTileProps) => {
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
        isActiveCursor && "animate-blink-border",
        isRevealing && "animate-tile-flip",
        isBouncing && "animate-tile-bounce",
      )}
      style={{
        animationDelay: isRevealing
          ? `${revealDelay}ms`
          : isBouncing
            ? `${bounceDelay}ms`
            : undefined,
      }}
      data-cy={`tile-${index}`}
    >
      {value}
    </div>
  );
};

interface GameBoardRowProps {
  rowIndex: number;
  revealingRow: number | null;
}

const GameBoardRow = ({ rowIndex, revealingRow }: GameBoardRowProps) => {
  const { guesses, currentGuess, mode, gameWon } = useGame();

  const isCurrentRow = rowIndex === guesses.length;
  const isFilled = Boolean(guesses[rowIndex]);
  const isRevealingRow = revealingRow === rowIndex;
  const isWinningRow = gameWon && rowIndex === guesses.length - 1;

  const tileValue = (col: number) => {
    if (isFilled) return guesses[rowIndex].tiles[col].value;
    if (isCurrentRow) return currentGuess[col] ?? "";
    return "";
  };

  const tileColor = (col: number): FeedbackColor =>
    isFilled ? guesses[rowIndex].tiles[col].color : "default";

  return (
    <div
      className={cn("flex gap-2", !isFilled && !isCurrentRow && "opacity-50")}
      style={{ perspective: "400px" }}
      data-cy={`row-${rowIndex}`}
    >
      {Array.from({ length: COLUMNS }, (_, col) => {
        const val = tileValue(col);
        const isActiveCursor =
          isCurrentRow && col === currentGuess.length && !gameWon;

        return (
          <GameBoardTile
            // Re-key on value change so tile-pop animation re-fires on each keystroke
            key={`col-${col}-${isCurrentRow ? val : "filled"}`}
            value={val}
            color={tileColor(col)}
            index={col}
            mode={mode}
            isRevealing={isRevealingRow}
            revealDelay={col * 120}
            isBouncing={isWinningRow}
            bounceDelay={col * 80}
            isActiveCursor={isActiveCursor}
          />
        );
      })}
    </div>
  );
};

export const GameBoard = () => {
  const { guesses } = useGame();
  const [revealingRow, setRevealingRow] = useState<number | null>(null);
  const prevGuessesLenRef = useRef(0);

  useEffect(() => {
    const prev = prevGuessesLenRef.current;
    const curr = guesses.length;

    if (curr > prev) {
      setRevealingRow(curr - 1);
      const timeout = setTimeout(
        () => setRevealingRow(null),
        COLUMNS * 120 + 300,
      );
      prevGuessesLenRef.current = curr;
      return () => clearTimeout(timeout);
    }

    prevGuessesLenRef.current = curr;
  }, [guesses.length]);

  return (
    <div
      className="grid grid-rows-6 gap-2 bg-background/20 backdrop-blur-sm border-4 border-foreground p-2"
      data-cy="grid"
    >
      {Array.from({ length: ROWS }, (_, rowIndex) => (
        <GameBoardRow
          key={`row-${rowIndex}`}
          rowIndex={rowIndex}
          revealingRow={revealingRow}
        />
      ))}
    </div>
  );
};
