"use client";

import { Button } from "@/components/ui/button";
import { useGame } from "@/hooks/use-game";
import { cn } from "@/lib/utils";
import { EQUATION_LENGTH } from "@/utils/constants";
import { getFeedbackColor } from "@/utils/feedback";

const NUMBER_KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
const OPERATORS_AND_ACTION_KEYS = ["Backspace", "+", "-", "*", "/", "Enter"];

interface KeyboardRowProps {
  keys: string[];
}

const KeyboardRow = ({ keys }: KeyboardRowProps) => {
  const { mode, handleKeyPress, keyboardFeedback, activeKey, currentGuess } =
    useGame();
  const highlightEnter = currentGuess.length === EQUATION_LENGTH;
  return (
    <div className="flex gap-2 flex-wrap justify-center">
      {keys.map((key) => {
        const feedback =
          mode === "hard" ? "default" : getFeedbackColor(keyboardFeedback[key]);
        return (
          <Button
            key={key}
            onClick={() => handleKeyPress(key)}
            variant={feedback === "default" ? "pixel-key" : feedback}
            data-cy={`key-${key}`}
            className={cn(
              "min-h-10 min-w-10 font-heading text-xs rounded-none border-2 border-foreground shadow-[2px_2px_0px_var(--color-foreground)] active:shadow-none active:translate-x-0.5 active:translate-y-0.5",
              {
                "scale-95": activeKey === key,
                "animate-blink-border": highlightEnter && key === "Enter",
              },
            )}
          >
            {key === "Backspace" ? "Delete" : key}
          </Button>
        );
      })}
    </div>
  );
};

export const Keyboard = () => (
  <div className="flex flex-col gap-2 items-center">
    <KeyboardRow keys={NUMBER_KEYS} />
    <KeyboardRow keys={OPERATORS_AND_ACTION_KEYS} />
  </div>
);
