"use client";

import { Button } from "@/components/ui/button";
import { useGame } from "@/hooks/use-game";
import { cn } from "@/utils/cn";
import { FeedbackColor, getFeedbackColor } from "@/utils/feedback";

const NUMBER_KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
const OPERATORS_AND_ACTION_KEYS = ["Backspace", "+", "-", "*", "/", "Enter"];

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  feedback: Record<string, FeedbackColor>;
  activeKey: string | null;
  highlightEnter: boolean;
}

interface KeyboardRowProps extends KeyboardProps {
  keys: string[];
}

const useKeyVariant = (
  key: string,
  mode: string,
  feedback: Record<string, FeedbackColor>
) => {
  return mode === "hard" ? "default" : getFeedbackColor(feedback[key]);
};

const KeyboardRow = ({
  keys,
  onKeyPress,
  feedback,
  activeKey,
  highlightEnter,
}: KeyboardRowProps) => {
  const { mode } = useGame();
  return (
    <div className="flex gap-2 flex-wrap justify-center">
      {keys.map((key) => (
        <Button
          key={key}
          onClick={() => onKeyPress(key)}
          variant={useKeyVariant(key, mode, feedback)}
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

export const Keyboard = (props: KeyboardProps) => (
  <div className="flex flex-col gap-2 items-center">
    <KeyboardRow keys={NUMBER_KEYS} {...props} />
    <KeyboardRow keys={OPERATORS_AND_ACTION_KEYS} {...props} />
  </div>
);
