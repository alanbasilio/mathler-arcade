"use client";

import { Guess } from "@/components/game-board";
import { useAudio } from "@/hooks/use-audio";
import { useToast } from "@/hooks/use-toast";
import {
  evaluate,
  isCumulativeSolution,
  isValidEquationWithoutZero,
} from "@/utils/evaluate";
import { FeedbackColor, getFeedback } from "@/utils/feedback";
import { getNumberOfTheDay } from "@/utils/numbers";
import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";

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
  activeKey: string;
}

export const GameContext = createContext<GameContextProps | undefined>(
  undefined
);

const targetEquation = getNumberOfTheDay();
const targetResult = evaluate(targetEquation);

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
  const { toast } = useToast();
  const { playSound } = useAudio();
  const [activeKey, setActiveKey] = useState<string>("");

  useEffect(() => {
    if (activeKey) {
      const timer = setTimeout(() => setActiveKey(""), 100);
      return () => clearTimeout(timer);
    }
  }, [activeKey]);

  const startGame = useCallback(() => {
    setGameStarted(true);
    playSound("start");
  }, [playSound]);

  const handleKeyPress = useCallback(
    (key: string) => {
      if (gameOver || gameWon) return;

      if (!gameStarted) {
        if (key === "Enter") {
          startGame();
        }
        return;
      }

      if (key === "Enter") {
        handleSubmitGuess();
      } else if (key === "Backspace") {
        playSound("back");
        setCurrentGuess((prev) => prev.slice(0, -1));
      } else if (currentGuess.length < 6) {
        playSound("click");
        setCurrentGuess((prev) => prev + key);
      }
    },
    [currentGuess, gameOver, playSound, gameStarted, gameWon, startGame]
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const validKeys = ["Enter", "Backspace", ...Array.from("0123456789+-*/")];
      if (validKeys.includes(event.key)) {
        handleKeyPress(event.key);
        setActiveKey(event.key);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyPress]);

  const handleSubmitGuess = useCallback(() => {
    if (currentGuess.length < 6) {
      playSound("warning");
      toast({
        title: "Error",
        description: "Fill in all 6 spaces of the equation!",
        variant: "destructive",
      });
      return;
    }

    if (guesses.length >= 6 || gameOver) return;

    if (isDuplicateGuess()) {
      playSound("warning");
      toast({
        title: "Oh no!",
        description: "You've already tried this guess. Try a different one!",
        variant: "warning",
      });
      return;
    }

    if (!containsOperator()) {
      playSound("warning");
      toast({
        title: "Error",
        description:
          "The equation must contain at least one operator (+, -, *, /)!",
        variant: "destructive",
      });
      return;
    }

    const evaluatedGuess = evaluate(currentGuess);
    const isValidEquation =
      evaluatedGuess !== 0 && isValidEquationWithoutZero(currentGuess);
    if (isValidEquation) {
      if (
        targetResult === evaluatedGuess &&
        isCumulativeSolution(currentGuess.split(""), targetEquation.split(""))
      ) {
        playSound("success");
        setGameWon(true);
        return;
      }
      if (evaluatedGuess !== targetResult) {
        playSound("warning");
        toast({
          title: "Warning",
          description: `Every guess must result in ${targetResult}. Try again!`,
          variant: "warning",
        });
        return;
      }
      processValidGuessFeedback();
    } else {
      playSound("warning");
      toast({
        title: "Error",
        description: "Try a valid equation!",
        variant: "destructive",
      });
    }
  }, [currentGuess, gameOver, guesses, toast, playSound]);

  const containsOperator = useCallback(() => {
    return /[+\-*/]/.test(currentGuess);
  }, [currentGuess]);

  const isDuplicateGuess = useCallback(() => {
    return guesses.some(
      (guess) => guess.tiles.map((tile) => tile.value).join("") === currentGuess
    );
  }, [currentGuess, guesses]);

  const processValidGuessFeedback = useCallback(() => {
    const feedback = getFeedback(currentGuess, targetEquation);

    const newGuess: Guess = {
      tiles: currentGuess.split("").map((char, index) => ({
        value: char,
        color: feedback[index],
        index,
      })),
    };

    setGuesses((prevGuesses) => [...prevGuesses, newGuess]);
    updateKeyboardFeedback(currentGuess, feedback);
    setCurrentGuess("");
    if (guesses.length + 1 >= 6) {
      setGameOver(true);
    }
  }, [currentGuess, guesses]);

  const updateKeyboardFeedback = useCallback(
    (guess: string, feedback: FeedbackColor[]) => {
      const updatedFeedback = { ...keyboardFeedback };

      guess.split("").forEach((char, index) => {
        const currentFeedback = feedback[index];
        const existingFeedback = updatedFeedback[char];

        if (currentFeedback === "success") {
          updatedFeedback[char] = "success";
        } else if (
          currentFeedback === "warning" &&
          existingFeedback !== "success"
        ) {
          updatedFeedback[char] = "warning";
        } else if (currentFeedback === "accent" && !existingFeedback) {
          updatedFeedback[char] = "accent";
        }
      });

      setKeyboardFeedback(updatedFeedback);
    },
    [keyboardFeedback]
  );

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
        activeKey,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
