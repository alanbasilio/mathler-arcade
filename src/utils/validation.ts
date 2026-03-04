import type { Guess } from "@/components/game-board";
import { EQUATION_LENGTH } from "./constants";

export const validateGuessLength = (guess: string): boolean =>
  guess.length === EQUATION_LENGTH;

export const validateHasOperator = (guess: string): boolean =>
  /[+\-*/]/.test(guess);

export const isDuplicateGuess = (
  guess: string,
  previousGuesses: Guess[]
): boolean =>
  previousGuesses.some(
    (g) => g.tiles.map((tile) => tile.value).join("") === guess
  );
