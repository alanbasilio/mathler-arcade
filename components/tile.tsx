"use client";

import { useGameMode } from "@/providers/game-mode";
import { cn } from "@/utils/cn";
import { getFeedbackColor } from "@/utils/feedback";
import { FeedbackColor } from "@/utils/types";

export interface TileProps {
  value: string;
  color?: FeedbackColor;
  index: number;
}

export const Tile: React.FC<TileProps> = ({ value, color, index }) => {
  const feedbackColor = getFeedbackColor(color);
  const { mode } = useGameMode();

  return (
    <div
      className={cn(
        "w-8 md:w-10 aspect-square flex items-center justify-center text-sm md:text-base lg:text-lg xl:text-2xl font-bold border-foreground border-4 shadow-lg",
        {
          "bg-success": mode === "normal" && feedbackColor === "success",
          "bg-warning": mode === "normal" && feedbackColor === "warning",
          "bg-accent": mode === "normal" && feedbackColor === "accent",
        }
      )}
      data-cy={`tile-${index}`}
    >
      {value}
    </div>
  );
};
