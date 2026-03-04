"use client";

import { Guess } from "@/components/game-board";
import { useAudio } from "@/hooks/use-audio";
import {
  ACTIVE_KEY_TIMEOUT_MS,
  EQUATION_LENGTH,
  MAX_GUESSES,
  VALID_KEYS,
} from "@/utils/constants";
import { evaluate, isCumulativeSolution } from "@/utils/evaluate";
import { FeedbackColor, getFeedback } from "@/utils/feedback";
import { getNumberOfTheDay } from "@/utils/numbers";
import {
  isDuplicateGuess,
  validateGuessLength,
  validateHasOperator,
} from "@/utils/validation";
import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";
import { toast } from "sonner";

type GameMode = "normal" | "hard";

interface GameContextProps {
  mode: GameMode;
  setMode: (mode: GameMode) => void;
  gameStarted: boolean;
  guesses: Guess[];
  currentGuess: string;
  gameOver: boolean;
  gameWon: boolean;
  keyboardFeedback: Record<string, FeedbackColor>;
  handleKeyPress: (key: string) => void;
  startGame: () => void;
  targetResult: number;
  targetEquation: string;
  activeKey: string;
}

export const GameContext = createContext<GameContextProps | undefined>(
  undefined
);

const targetEquation = getNumberOfTheDay();
const targetResult = evaluate(targetEquation) ?? 0;

const computeKeyboardFeedback = (
  current: Record<string, FeedbackColor>,
  guess: string,
  feedback: FeedbackColor[]
): Record<string, FeedbackColor> => {
  const updated = { ...current };

  guess.split("").forEach((char, index) => {
    const charFeedback = feedback[index];
    const existing = updated[char];

    if (charFeedback === "success") {
      updated[char] = "success";
    } else if (charFeedback === "warning" && existing !== "success") {
      updated[char] = "warning";
    } else if (charFeedback === "accent" && !existing) {
      updated[char] = "accent";
    }
  });

  return updated;
};

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<GameMode>("normal");
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [currentGuess, setCurrentGuess] = useState<string>("");
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [gameWon, setGameWon] = useState<boolean>(false);
  const [keyboardFeedback, setKeyboardFeedback] = useState<
    Record<string, FeedbackColor>
  >({});
  const [activeKey, setActiveKey] = useState<string>("");
  const { playSound } = useAudio();

  useEffect(() => {
    if (!activeKey) return;
    const timer = setTimeout(() => setActiveKey(""), ACTIVE_KEY_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [activeKey]);

  const startGame = useCallback(() => {
    setGameStarted(true);
    playSound("start");
  }, [playSound]);

  const processValidGuessFeedback = useCallback(
    (guess: string, currentGuessCount: number) => {
      const feedback = getFeedback(guess, targetEquation);

      const newGuess: Guess = {
        tiles: guess.split("").map((char, index) => ({
          value: char,
          color: feedback[index],
          index,
        })),
      };

      setGuesses((prev) => [...prev, newGuess]);
      setKeyboardFeedback((prev) =>
        computeKeyboardFeedback(prev, guess, feedback)
      );
      setCurrentGuess("");

      if (currentGuessCount + 1 >= MAX_GUESSES) {
        setGameOver(true);
      }
    },
    []
  );

  const handleSubmitGuess = useCallback(() => {
    if (!validateGuessLength(currentGuess)) {
      playSound("warning");
      toast.error("Error", {
        description: `Fill in all ${EQUATION_LENGTH} spaces of the equation!`,
        position: "top-center",
      });
      return;
    }

    if (guesses.length >= MAX_GUESSES || gameOver) return;

    if (isDuplicateGuess(currentGuess, guesses)) {
      playSound("warning");
      toast.warning("Oh no!", {
        description: "You've already tried this guess. Try a different one!",
        position: "top-center",
      });
      return;
    }

    if (!validateHasOperator(currentGuess)) {
      playSound("warning");
      toast.error("Error", {
        description:
          "The equation must contain at least one operator (+, -, *, /)!",
        position: "top-center",
      });
      return;
    }

    const evaluatedGuess = evaluate(currentGuess);

    if (evaluatedGuess === null) {
      playSound("warning");
      toast.error("Error", {
        description: "Try a valid equation!",
        position: "top-center",
      });
      return;
    }

    if (evaluatedGuess !== targetResult) {
      playSound("warning");
      toast.warning("Warning", {
        description: `Every guess must result in ${targetResult}. Try again!`,
        position: "top-center",
      });
      return;
    }

    if (isCumulativeSolution(currentGuess.split(""), targetEquation.split(""))) {
      playSound("success");
      setGameWon(true);
      return;
    }

    processValidGuessFeedback(currentGuess, guesses.length);
  }, [currentGuess, gameOver, guesses, playSound, processValidGuessFeedback]);

  const handleKeyPress = useCallback(
    (key: string) => {
      if (gameOver || gameWon) return;

      if (!gameStarted) {
        if (key === "Enter") startGame();
        return;
      }

      if (key === "Enter") {
        handleSubmitGuess();
      } else if (key === "Backspace") {
        playSound("back");
        setCurrentGuess((prev) => prev.slice(0, -1));
      } else if (currentGuess.length < EQUATION_LENGTH) {
        playSound("click");
        setCurrentGuess((prev) => prev + key);
      }
    },
    [
      currentGuess,
      gameOver,
      gameStarted,
      gameWon,
      handleSubmitGuess,
      playSound,
      startGame,
    ]
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (VALID_KEYS.includes(event.key)) {
        handleKeyPress(event.key);
        setActiveKey(event.key);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyPress]);

  return (
    <GameContext.Provider
      value={{
        mode,
        setMode,
        gameStarted,
        guesses,
        currentGuess,
        gameOver,
        gameWon,
        keyboardFeedback,
        handleKeyPress,
        startGame,
        targetResult,
        targetEquation,
        activeKey,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
