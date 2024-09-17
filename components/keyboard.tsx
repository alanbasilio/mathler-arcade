"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";
import { getFeedbackColor } from "@/utils/feedback";
import { FeedbackColor } from "@/utils/types";

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  feedback: Record<string, FeedbackColor>;
  activeKey: string | null;
  highlightEnter: boolean;
}

export const Keyboard = ({
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
