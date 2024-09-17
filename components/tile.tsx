"use client";

import { cn } from "@/utils/cn";
import { getFeedbackColor } from "@/utils/feedback";
import { FeedbackColor } from "@/utils/types";

export interface TileProps {
  value: string;
  color?: FeedbackColor;
  isCurrentRow?: boolean;
  index: number;
}

export const Tile: React.FC<TileProps> = ({
  value,
  color,
  isCurrentRow,
  index,
}) => (
  <div
    className={cn(
      "w-8 md:w-10 lg:w-12 aspect-square flex items-center justify-center text-sm md:text-base lg:text-lg xl:text-2xl font-bold border-foreground border-4 shadow-lg",
      color ? `bg-${getFeedbackColor(color)}` : "",
      isCurrentRow === false && "opacity-80"
    )}
    data-cy={`tile-${index}`}
  >
    {value}
  </div>
);
