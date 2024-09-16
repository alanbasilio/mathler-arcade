"use client";

import RetroGrid from "@/components/retro-grid";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { equations } from "@/data/equations";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/utils/cn";
import { evaluate } from "@/utils/evaluate";
import { Info, Moon, Settings, Sun, Volume2, VolumeOff } from "lucide-react";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useState } from "react";
import useSound from "use-sound";

export function getEquationOfTheDay() {
  const now = new Date();
  const start = new Date(2022, 0, 0);
  const diff = Number(now) - Number(start);
  let day = Math.floor(diff / (1000 * 60 * 60 * 24));
  while (day > equations.length) {
    day -= equations.length;
  }
  return equations[day];
}

const calculateResult = (equation: string): number => {
  return evaluate(equation);
};

const targetEquation = getEquationOfTheDay();
const targetResult = calculateResult(targetEquation);

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
  activeKey: string | null;
  highlightEnter: boolean;
}

const Keyboard = ({
  onKeyPress,
  feedback,
  activeKey,
  highlightEnter,
}: KeyboardProps) => {
  const numberKeys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
  const operatorAndActionKeys = ["Backspace", "+", "-", "*", "/", "Enter"];

  const renderKeys = (keys: string[]) =>
    keys.map((key) => (
      <Button
        key={key}
        onClick={() => onKeyPress(key)}
        variant={getFeedbackColor(feedback[key])}
        data-cy={`key-${key}`}
        className={cn({
          "scale-95": activeKey === key,
          "animate-pulse": highlightEnter && key === "Enter",
        })}
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

const renderTiles = (tiles: Tile[]) => {
  return tiles.map((tile, tileIndex) => (
    <div
      key={tileIndex}
      className={cn(
        "w-8 md:w-10 lg:w-12 aspect-square flex items-center justify-center text-sm md:text-base lg:text-lg xl:text-2xl font-bold border-foreground border-4 shadow-lg",
        `bg-${getFeedbackColor(tile.color)}`
      )}
      data-cy={`tile-${tileIndex}`}
    >
      {tile.value}
    </div>
  ));
};

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
          "w-8 md:w-10 lg:w-12 aspect-square flex items-center justify-center text-sm md:text-base lg:text-lg xl:text-2xl font-bold border-foreground border-4 shadow-lg",
          !isCurrentRow && "opacity-80"
        )}
        data-cy={`tile-${tileIndex}`}
      >
        {isCurrentRow ? currentGuess[tileIndex] || "" : ""}
      </div>
    ));
};

export default function Mathler() {
  const { theme, setTheme } = useTheme();
  const [playGame, setPlayGame] = useState<boolean>(false);
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [currentGuess, setCurrentGuess] = useState<string>("");
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [winGame, setWinGame] = useState<boolean>(false);
  const [stopAudio, setStopAudio] = useState<boolean>(false);
  const [keyboardFeedback, setKeyboardFeedback] = useState<
    Record<string, FeedbackColor>
  >({});
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [highlightEnter, setHighlightEnter] = useState<boolean>(false);
  const { toast } = useToast();
  const audioVolume = stopAudio ? 0 : 0.25;
  const mcPlusAudioVolume = stopAudio ? 0 : 0.01;
  const [playEnter] = useSound("/mp3/enter.mp3", {
    volume: audioVolume,
  });
  const [playBack] = useSound("/mp3/back.mp3", {
    volume: audioVolume,
  });
  const [playClick] = useSound("/mp3/click.mp3", {
    volume: audioVolume,
  });
  const [playWarning] = useSound("/mp3/warning.mp3", {
    volume: audioVolume,
  });
  const [playSuccess] = useSound("/mp3/success.mp3", {
    volume: audioVolume,
  });
  const [playMcPlus] = useSound("/mp3/mc-plus.mp3", {
    volume: mcPlusAudioVolume,
    loop: true,
  });

  const playSound = useCallback(
    (sound: "click" | "warning" | "success" | "mc-plus" | "back" | "enter") => {
      switch (sound) {
        case "click":
          playClick();
          break;
        case "back":
          playBack();
          break;
        case "enter":
          playEnter();
          break;
        case "warning":
          playWarning();
          break;
        case "success":
          playSuccess();
          break;
        case "mc-plus":
          playMcPlus();
          break;
      }
    },
    [playClick, playWarning, playSuccess, playMcPlus, playBack, playEnter]
  );

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

      if (currentGuess.length < 5) {
        setHighlightEnter(false);
        setActiveKey(key);
        setTimeout(() => setActiveKey(null), 100);
      } else {
        setHighlightEnter(true);
      }

      if (key === "Enter") {
        handleSubmitGuess();
        setHighlightEnter(false);
      } else if (key === "Backspace") {
        setHighlightEnter(false);
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

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const validKeys = ["Enter", "Backspace", ...Array.from("0123456789+-*/")];

      if (validKeys.includes(event.key)) {
        handleKeyPress(event.key);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyPress]);

  const handleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
    playSound("click");
  };

  const handleStopAudio = () => {
    setStopAudio(!stopAudio);
  };

  return (
    <div className="flex min-h-screen justify-center items-center align-center z-0">
      <div className="fixed inset-0 bg-[url('/images/noise.gif')] bg-cover z-0 opacity-40" />
      {!gameOver && !winGame && <RetroGrid />}
      {playGame ? (
        gameOver ? (
          <div className="flex flex-col items-center">
            <h1
              className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-extrabold italic leading-none z-10"
              data-cy="title"
            >
              Game Over
            </h1>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-8 p-8 z-10 items-center">
              <div className="text-center space-y-2">
                <h1
                  className="text-2xl tracking-tighter md:text-3xl lg:text-4xl xl:text-5xl italic leading-none"
                  data-cy="title"
                >
                  Mathler
                </h1>

                <h2 className="text-xs leading-none" data-cy="subtitle">
                  Solve the hidden equation{" "}
                  <span className="bg-foreground text-background p-1 max-lg:block max-lg:mt-2">
                    that results in {targetResult}
                  </span>
                </h2>
                <div className="flex flex-row justify-center gap-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="lg:absolute lg:left-5 lg:top-5">
                        <Info />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>How to Play Mathler</DialogTitle>
                      </DialogHeader>
                      <div className="prose space-y-2 text-sm">
                        <p>Try to find the hidden calculation in 6 guesses!</p>
                        <p>
                          After each guess, the color of the tiles will change
                          to show how close you are to the solution.
                        </p>

                        <p className="flex gap-2">
                          <Button variant="success">5</Button>
                          <Button variant="accent">0</Button>
                          <Button variant="success">/</Button>
                          <Button variant="warning">5</Button>
                          <Button variant="accent">-</Button>
                          <Button variant="accent">2</Button>
                        </p>

                        <ul className="list-disc pl-4">
                          <li>Green are in the correct place.</li>
                          <li>
                            Orange are in the solution, but in a different
                            place.
                          </li>
                          <li>Gray are not in the solution.</li>
                        </ul>

                        <p className="font-bold">Additional Rules</p>

                        <ul className="list-disc pl-4">
                          <li>
                            Numbers and operators can appear multiple times.
                          </li>
                          <li>
                            Calculate / or * before - or + (order of
                            operations).
                          </li>
                          <li>
                            Commutative solutions are accepted, for example
                            20+7+3 and 3+7+20.
                          </li>
                          <li>
                            Commutative solutions will be automatically
                            rearranged to the exact solution.
                          </li>
                        </ul>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button className="lg:absolute lg:right-5 lg:top-5">
                    <Settings />
                  </Button>
                  <Button
                    className="lg:absolute lg:right-5 lg:bottom-5"
                    onClick={handleTheme}
                  >
                    {theme === "dark" ? <Moon /> : <Sun />}
                  </Button>
                  <Button
                    className="lg:absolute lg:left-5 lg:bottom-5"
                    onClick={handleStopAudio}
                  >
                    {stopAudio ? <VolumeOff /> : <Volume2 />}
                  </Button>
                </div>
              </div>
              <div
                className="grid grid-rows-6 gap-2 bg-background/20 backdrop-blur-sm border-4 border-foreground p-2"
                data-cy="grid"
              >
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
                        data-cy={`row-${rowIndex}`}
                      >
                        {isFilled
                          ? renderTiles(guess.tiles)
                          : renderEmptyOrCurrentRow(isCurrentRow, currentGuess)}
                      </div>
                    );
                  })}
              </div>
              <Keyboard
                onKeyPress={handleKeyPress}
                feedback={keyboardFeedback}
                activeKey={activeKey}
                highlightEnter={highlightEnter}
              />
              {winGame && (
                <p
                  className="mt-4 text-success font-bold text-center"
                  data-cy="success-message"
                >
                  You&apos;ve solved today&apos;s equation! <br />
                  Come back tomorrow for a new challenge!
                </p>
              )}
            </div>
          </>
        )
      ) : (
        <div className="flex flex-col gap-4 items-center">
          <h1
            className="tracking-tighter text-2xl md:text-3xl lg:text-4xl xl:text-5xl italic leading-none"
            data-cy="title"
          >
            Mathler
          </h1>
          <button
            onClick={startGame}
            className="animate-pulse nes-btn is-primary"
          >
            PRESS TO START
          </button>
        </div>
      )}
    </div>
  );
}
