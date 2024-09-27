"use client";

import { Button } from "@/components/ui/button";
import { useGame } from "@/hooks/use-game";
import { cn } from "@/utils/cn";
import { getFeedbackColor } from "@/utils/feedback";

const NUMBER_KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
const OPERATORS_AND_ACTION_KEYS = ["Backspace", "+", "-", "*", "/", "Enter"];

interface KeyboardRowProps {
  keys: string[];
}

const KeyboardRow = ({ keys }: KeyboardRowProps) => {
  const { mode, handleKeyPress, keyboardFeedback, activeKey, currentGuess } =
    useGame();
  const highlightEnter = currentGuess.length === 6;
  return (
    <div className="flex gap-2 flex-wrap justify-center">
      {keys.map((key) => (
        <Button
          key={key}
          onClick={() => handleKeyPress(key)}
          variant={
            mode === "hard"
              ? "default"
              : getFeedbackColor(keyboardFeedback[key])
          }
          data-cy={`key-${key}`}
          className={cn({
            "scale-95": activeKey === key,
            "animate-pulse": highlightEnter && key === "Enter",
          })}
        >
          {key === "Backspace" ? "Delete" : key}
        </Button>
      ))}
    </div>
  );
};

export const Keyboard = () => (
  <div className="flex flex-col gap-2 items-center">
    <KeyboardRow keys={NUMBER_KEYS} />
    <KeyboardRow keys={OPERATORS_AND_ACTION_KEYS} />
  </div>
);
