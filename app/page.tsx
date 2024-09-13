"use client";

import RetroGrid from "@/components/magicui/retro-grid";
import { Button } from "@/components/ui/button";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/utils/cn";
import { evaluate } from "@/utils/evaluate";
import { useCallback, useEffect, useState } from "react";
import useSound from "use-sound";

type FeedbackColor = "accent" | "warning" | "success" | "default";

interface Tile {
  value: string;
  color: FeedbackColor;
}

interface Guess {
  tiles: Tile[];
}

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  feedback: Record<string, FeedbackColor>;
}

const Keyboard = ({ onKeyPress, feedback }: KeyboardProps) => {
  const numberKeys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
  const operatorAndActionKeys = ["Enter", "+", "-", "*", "/", "Backspace"];

  const renderKeys = (keys: string[]) =>
    keys.map((key) => (
      <Button
        key={key}
        onClick={() => onKeyPress(key)}
        variant={getFeedbackColor(feedback[key])}
      >
        {key === "Backspace" ? "Delete" : key}
      </Button>
    ));

  return (
    <div className="flex flex-col gap-2 items-center">
      <div className="flex gap-2 flex-wrap justify-center">
        {renderKeys(numberKeys)}
      </div>
      <div className="flex gap-2 flex-wrap justify-center">
        {renderKeys(operatorAndActionKeys)}
      </div>
    </div>
  );
};

const getFeedbackColor = (color?: FeedbackColor): FeedbackColor => {
  return color ?? "default";
};

// Função para renderizar as tiles de uma linha preenchida
const renderTiles = (tiles: Tile[]) => {
  return tiles.map((tile, tileIndex) => (
    <div
      key={tileIndex}
      className={cn(
        "w-8 md:w-10 lg:w-12 aspect-square flex items-center justify-center text-2xl font-bold border rounded-md shadow-lg",
        `bg-${getFeedbackColor(tile.color)}`
      )}
    >
      {tile.value}
    </div>
  ));
};

// Função para renderizar uma linha vazia ou a linha atual
const renderEmptyOrCurrentRow = (
  isCurrentRow: boolean,
  currentGuess: string
) => {
  return Array(6)
    .fill("")
    .map((_, tileIndex) => (
      <div
        key={tileIndex}
        className={cn(
          "w-8 md:w-10 lg:w-12 aspect-square flex items-center justify-center text-2xl font-bold border rounded-md shadow-lg bg-white border-gray ",
          !isCurrentRow && "opacity-80"
        )}
      >
        {isCurrentRow ? currentGuess[tileIndex] || "" : ""}
      </div>
    ));
};

const targetEquation = "55+5*2";
const targetResult = 65;

export default function Mathler() {
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [currentGuess, setCurrentGuess] = useState<string>("");
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [keyboardFeedback, setKeyboardFeedback] = useState<
    Record<string, FeedbackColor>
  >({});
  const { toast } = useToast();

  const [playClick] = useSound("/click.mp3", { volume: 0.25 });
  const [playWarning] = useSound("/warning.mp3", { volume: 0.25 });
  const [playSuccess] = useSound("/success.mp3", { volume: 0.25 });

  // Função para tocar som baseado no evento
  const playSound = useCallback(
    (sound: "click" | "warning" | "success") => {
      if (sound === "click") playClick();
      if (sound === "warning") playWarning();
      if (sound === "success") playSuccess();
    },
    [playClick, playWarning, playSuccess]
  );

  // Gerencia a entrada do teclado físico
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const validKeys = ["Enter", "Backspace", ...Array.from("0123456789+-*/")];

      if (validKeys.includes(event.key)) {
        handleKeyPress(event.key);
        playSound("click");
      } else {
        //playSound("warning");
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentGuess, gameOver, playSound]);

  // Função de captura de teclas
  const handleKeyPress = useCallback(
    (key: string) => {
      if (gameOver) return;

      if (key === "Enter") {
        handleSubmitGuess();
      } else if (key === "Backspace") {
        setCurrentGuess((prev) => prev.slice(0, -1));
      } else if (currentGuess.length < 6) {
        setCurrentGuess((prev) => prev + key);
      }
    },
    [currentGuess, gameOver]
  );

  // Submissão do palpite
  const handleSubmitGuess = useCallback(() => {
    if (guesses.length >= 6 || gameOver || currentGuess.length < 6) return;

    const evaluated = evaluate(currentGuess);
    if (evaluated) {
      if (currentGuess === targetEquation) {
        playSound("success");
        setGameOver(true);
        return;
      }
      if (evaluated !== targetResult) {
        //playSound("warning");
        toast({
          title: "Warning",
          description: `Every guess must result in ${targetResult}. Try again!`,
          variant: "warning",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
        return;
      }
      const feedback = getFeedback(currentGuess, targetEquation);

      const newGuess: Guess = {
        tiles: currentGuess.split("").map((char, index) => ({
          value: char,
          color: feedback[index],
        })),
      };

      setGuesses((prevGuesses) => [...prevGuesses, newGuess]);
      updateKeyboardFeedback(currentGuess, feedback);
      setCurrentGuess("");
    } else {
      toast({
        title: "Error",
        description: "Try a valid equation!",
        variant: "destructive",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    }
  }, [currentGuess, gameOver, guesses, toast, playSound]);

  // Atualiza o feedback do teclado
  const updateKeyboardFeedback = useCallback(
    (guess: string, feedback: FeedbackColor[]) => {
      const updatedFeedback = { ...keyboardFeedback };

      guess.split("").forEach((char, index) => {
        if (feedback[index] === "success") {
          updatedFeedback[char] = "success";
        } else if (
          feedback[index] === "warning" &&
          updatedFeedback[char] !== "success"
        ) {
          updatedFeedback[char] = "warning";
        } else if (feedback[index] === "accent" && !updatedFeedback[char]) {
          updatedFeedback[char] = "accent";
        }
      });

      setKeyboardFeedback(updatedFeedback);
    },
    [keyboardFeedback]
  );

  // Gera feedback com base no palpite
  const getFeedback = (guess: string, target: string): FeedbackColor[] => {
    return guess.split("").map((char, index) => {
      if (char === target[index]) {
        return "success";
      } else if (target.includes(char)) {
        return "warning";
      }
      return "accent";
    });
  };

  return (
    <div className="flex h-screen min-h-[640px] justify-center items-center align-center z-0">
      <RetroGrid />
      <div className="flex flex-col gap-8 	 p-8 z-10 rounded-xl">
        <div className="flex flex-col gap-4 items-center">
          <h1 className="text-2xl font-bold leading-none">Mathler</h1>
          <h2 className="text-md leading-none">
            Solve the hidden equation{" "}
            <span className="bg-warning p-1">
              that results in {targetResult}
            </span>
          </h2>
          <div className="grid grid-rows-6 gap-2">
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
                  >
                    {isFilled
                      ? renderTiles(guess.tiles)
                      : renderEmptyOrCurrentRow(isCurrentRow, currentGuess)}
                  </div>
                );
              })}
          </div>
        </div>
        <Keyboard onKeyPress={handleKeyPress} feedback={keyboardFeedback} />
        {gameOver && (
          <p className="mt-4 text-success font-bold">
            You found the correct equation!
          </p>
        )}
      </div>
    </div>
  );
}
