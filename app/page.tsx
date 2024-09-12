"use client";

import { Button } from "@/components/ui/button";
import React, { useState } from "react";

type FeedbackColor = "gray" | "yellow" | "green" | "default";

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
        variant={getButtonVariant(feedback[key])}
      >
        {key === "Backspace" ? "Delete" : key}
      </Button>
    ));

  return (
    <div className="flex flex-col gap-2 mt-4 items-center">
      <div className="flex gap-2">{renderKeys(numberKeys)}</div>
      <div className="flex gap-2">{renderKeys(operatorAndActionKeys)}</div>
    </div>
  );
};

const getButtonVariant = (
  color?: FeedbackColor
): "default" | "gray" | "yellow" | "green" => {
  return color ?? "default";
};

const targetEquation = "55+5*2";
const targetResult = 65;

const Mathler: React.FC = () => {
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [currentGuess, setCurrentGuess] = useState<string>("");
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [keyboardFeedback, setKeyboardFeedback] = useState<
    Record<string, FeedbackColor>
  >({});

  const handleKeyPress = (key: string) => {
    if (gameOver) return;

    if (key === "Enter") {
      handleSubmitGuess();
    } else if (key === "Backspace") {
      setCurrentGuess((prev) => prev.slice(0, -1));
    } else if (currentGuess.length < 6) {
      setCurrentGuess((prev) => prev + key);
    }
  };

  const handleSubmitGuess = () => {
    if (guesses.length >= 6 || gameOver || currentGuess.length < 6) return;

    const guessResult = evaluateEquation(currentGuess);
    if (guessResult === targetResult) {
      setGameOver(true);
    }

    const feedback = getFeedback(currentGuess, targetEquation);

    const newGuess: Guess = {
      tiles: currentGuess.split("").map((char, index) => ({
        value: char,
        color: feedback[index],
      })),
    };

    setGuesses([...guesses, newGuess]);
    updateKeyboardFeedback(currentGuess, feedback);
    setCurrentGuess("");
  };

  const updateKeyboardFeedback = (guess: string, feedback: FeedbackColor[]) => {
    const updatedFeedback = { ...keyboardFeedback };

    guess.split("").forEach((char, index) => {
      if (feedback[index] === "green") {
        updatedFeedback[char] = "green";
      } else if (
        feedback[index] === "yellow" &&
        updatedFeedback[char] !== "green"
      ) {
        updatedFeedback[char] = "yellow";
      } else if (feedback[index] === "gray" && !updatedFeedback[char]) {
        updatedFeedback[char] = "gray";
      }
    });

    setKeyboardFeedback(updatedFeedback);
  };

  const getFeedback = (guess: string, target: string): FeedbackColor[] => {
    const feedback = Array(guess.length).fill<FeedbackColor>("gray");

    guess.split("").forEach((char, index) => {
      if (char === target[index]) {
        feedback[index] = "green";
      } else if (target.includes(char)) {
        feedback[index] = "yellow";
      }
    });

    return feedback;
  };

  const evaluateEquation = (equation: string) => {
    try {
      return eval(equation);
    } catch (error) {
      return null;
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Mathler</h1>
      <div className="grid grid-rows-6 gap-2">
        {guesses.map((guess, i) => (
          <div key={i} className="flex gap-2">
            {guess.tiles.map((tile, j) => (
              <div
                key={j}
                className={`w-12 h-12 flex items-center justify-center text-2xl font-bold border-2 bg-${getButtonVariant(
                  tile.color
                )}-600`}
              >
                {tile.value}
              </div>
            ))}
          </div>
        ))}
        {!gameOver && guesses.length < 6 && (
          <div className="flex gap-2">
            {Array(6)
              .fill("")
              .map((_, i) => (
                <div
                  key={i}
                  className="w-12 h-12 flex items-center justify-center text-2xl font-bold border-2"
                >
                  {currentGuess[i] || ""}
                </div>
              ))}
          </div>
        )}
      </div>
      <Keyboard onKeyPress={handleKeyPress} feedback={keyboardFeedback} />
      {gameOver && (
        <p className="mt-4 text-green-500">You found the correct equation!</p>
      )}
    </div>
  );
};

export default Mathler;
