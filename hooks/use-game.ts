import { Guess } from "@/components/game-board";
import { useToast } from "@/hooks/use-toast";
import { useAudio } from "@/providers/audio-provider";
import { evaluate } from "@/utils/evaluate";
import { FeedbackColor, getFeedback } from "@/utils/feedback";
import { getNumberOfTheDay } from "@/utils/numbers";
import { useCallback, useState } from "react";

const targetEquation = getNumberOfTheDay();
const targetResult = evaluate(targetEquation);

export const useGame = () => {
  const [playGame, setPlayGame] = useState<boolean>(false);
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [currentGuess, setCurrentGuess] = useState<string>("");
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [winGame, setWinGame] = useState<boolean>(false);
  const [keyboardFeedback, setKeyboardFeedback] = useState<
    Record<string, FeedbackColor>
  >({});
  const { toast } = useToast();
  const { playSound } = useAudio();

  const startGame = () => {
    setPlayGame(true);
    playSound("mc-plus");
  };

  const handleKeyPress = useCallback(
    (key: string) => {
      if (gameOver || winGame) return;

      if (!playGame) {
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
    [currentGuess, gameOver, playSound, playGame]
  );

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

    if (
      guesses.some(
        (guess) =>
          guess.tiles.map((tile) => tile.value).join("") === currentGuess
      )
    ) {
      playSound("warning");
      toast({
        title: "Oh no!",
        description: "You've already tried this guess. Try a different one!",
        variant: "warning",
      });
      return;
    }

    const evaluated = evaluate(currentGuess);
    if (evaluated) {
      if (currentGuess === targetEquation) {
        playSound("success");
        setWinGame(true);
        return;
      }
      if (evaluated !== targetResult) {
        playSound("warning");
        toast({
          title: "Warning",
          description: `Every guess must result in ${targetResult}. Try again!`,
          variant: "warning",
        });
        return;
      }
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
    } else {
      playSound("warning");
      toast({
        title: "Error",
        description: "Try a valid equation!",
        variant: "destructive",
      });
    }
  }, [currentGuess, gameOver, guesses, toast, playSound]);

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

  return {
    playGame,
    guesses,
    currentGuess,
    gameOver,
    winGame,
    keyboardFeedback,
    handleKeyPress,
    startGame,
  };
};
