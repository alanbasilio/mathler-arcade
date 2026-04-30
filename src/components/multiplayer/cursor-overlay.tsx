"use client";

import { useMultiplayer } from "@/hooks/use-multiplayer";

export const CursorOverlay = () => {
  const { opponentCursor } = useMultiplayer();

  if (!opponentCursor) return null;

  const x = opponentCursor.x * window.innerWidth;
  const y = opponentCursor.y * window.innerHeight;

  return (
    <div className="pointer-events-none fixed inset-0 z-50" aria-hidden="true">
      <div
        className="absolute flex items-center gap-1"
        style={{ left: x, top: y, transform: "translate(4px, 4px)" }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          className="text-warning fill-warning stroke-foreground"
          strokeWidth="1"
          role="img"
          aria-label="Opponent cursor"
        >
          <path d="M0 0 L0 12 L4 8 L7 15 L9 14 L6 7 L11 7 Z" />
        </svg>
        <span className="text-xs font-bold bg-warning text-warning-foreground px-1 border border-foreground">
          {opponentCursor.name}
        </span>
      </div>
    </div>
  );
};
