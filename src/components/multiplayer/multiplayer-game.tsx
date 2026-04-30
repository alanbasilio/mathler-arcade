"use client";

import { useMediaQuery } from "usehooks-ts";
import { Button } from "@/components/ui/button";
import { useMultiplayer } from "@/hooks/use-multiplayer";
import { cn } from "@/lib/utils";
import type { MultiplayerGuess } from "@/types/multiplayer";
import { EQUATION_LENGTH, MAX_GUESSES } from "@/utils/constants";
import { getFeedbackColor } from "@/utils/feedback";
import { ChatBottomBar, ChatSidebar } from "./chat";
import { CursorOverlay } from "./cursor-overlay";

const ROWS = MAX_GUESSES;
const COLUMNS = EQUATION_LENGTH;
const NUMBER_KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
const OPERATOR_KEYS = ["Backspace", "+", "-", "*", "/", "Enter"];

const MultiplayerTile = ({
  value,
  color,
  index,
}: {
  value: string;
  color: string;
  index: number;
}) => {
  const feedbackColor = getFeedbackColor(
    color as Parameters<typeof getFeedbackColor>[0],
  );
  return (
    <div
      className={cn(
        "text-foreground w-10 md:w-12 aspect-square flex items-center justify-center text-base md:text-lg font-bold border-foreground border-4 shadow-lg transition-colors duration-300",
        {
          "bg-success text-success-foreground": feedbackColor === "success",
          "bg-warning text-warning-foreground": feedbackColor === "warning",
          "bg-accent": feedbackColor === "outline",
          "bg-destructive text-white": feedbackColor === "destructive",
        },
      )}
      data-cy={`tile-${index}`}
    >
      {value}
    </div>
  );
};

const PlayerBar = () => {
  const { session, myPlayer, isMyTurn } = useMultiplayer();
  if (!session || session.players.length < 2) return null;

  const me = session.players.find((p) => p.id === myPlayer?.id);
  const opponent = session.players.find((p) => p.id !== myPlayer?.id);

  return (
    <div className="flex items-center gap-3 text-[10px] font-bold tracking-wide">
      <span
        className={cn(
          "text-success transition-opacity",
          !isMyTurn && "opacity-40",
        )}
      >
        {isMyTurn && "▶ "}
        {me?.name}
      </span>
      <span className="text-foreground/30 text-[8px]">VS</span>
      <span
        className={cn(
          "text-warning transition-opacity",
          isMyTurn && "opacity-40",
        )}
      >
        {opponent?.name}
        {!isMyTurn && " ◀"}
      </span>
    </div>
  );
};

const MultiplayerBoard = () => {
  const { session, currentGuess, opponentCurrentGuess, myPlayer, isMyTurn } =
    useMultiplayer();
  const guesses = session?.guesses ?? [];
  const currentPlayer = session?.players.find(
    (p) => p.id === session?.currentTurn,
  );

  return (
    <div
      className="grid grid-rows-6 gap-2 bg-background/20 backdrop-blur-sm border-4 border-foreground p-2"
      data-cy="grid"
    >
      {Array.from({ length: ROWS }, (_, rowIndex) => {
        const guess: MultiplayerGuess | undefined = guesses[rowIndex];
        const isCurrentRow = rowIndex === guesses.length;
        const isFilled = Boolean(guess);
        const isMe = isFilled && guess.playerName === myPlayer?.name;

        return (
          <div
            key={rowIndex}
            className={cn(
              "relative flex gap-2 items-center",
              !isFilled && !isCurrentRow && "opacity-50",
            )}
          >
            {/* Desktop: editorial label column to the left of the grid */}
            {isFilled && (
              <div
                className={cn(
                  "hidden md:flex absolute right-full top-1/2 -translate-y-1/2",
                  "items-center pr-2",
                  isMe ? "text-success" : "text-warning",
                )}
              >
                <span className="text-[8px] font-bold uppercase tracking-[0.2em] whitespace-nowrap max-w-[72px] truncate opacity-60">
                  {guess.playerName}
                </span>
                <span className="mx-1.5 h-px w-4 shrink-0 bg-current opacity-30" />
                <span className="text-[8px] opacity-50">▶</span>
              </div>
            )}
            {isCurrentRow && session?.status === "playing" && (
              <div
                className={cn(
                  "hidden md:flex absolute right-full top-1/2 -translate-y-1/2",
                  "items-center pr-2 animate-pulse",
                  isMyTurn ? "text-success" : "text-warning",
                )}
              >
                <span className="text-[8px] font-bold uppercase tracking-[0.2em] whitespace-nowrap">
                  {isMyTurn ? "you" : (currentPlayer?.name ?? "").slice(0, 9)}
                </span>
                <span className="mx-1.5 h-px w-4 shrink-0 bg-current" />
                <span className="text-[8px]">▶</span>
              </div>
            )}

            {/* Tiles */}
            {Array.from({ length: COLUMNS }, (_, colIndex) => {
              const activeGuess = isMyTurn
                ? currentGuess
                : opponentCurrentGuess;
              const value = isFilled
                ? guess.tiles[colIndex].value
                : isCurrentRow
                  ? (activeGuess[colIndex] ?? "")
                  : "";
              const color = isFilled ? guess.tiles[colIndex].color : "default";
              return (
                <MultiplayerTile
                  key={colIndex}
                  value={value}
                  color={color}
                  index={colIndex}
                />
              );
            })}

            {/* Mobile: compact pill badge to the right of tiles */}
            {isFilled && (
              <span
                className={cn(
                  "md:hidden ml-1 px-1 py-0.5 text-[7px] font-bold uppercase tracking-wide whitespace-nowrap max-w-[36px] truncate border",
                  isMe
                    ? "border-success/40 text-success/70"
                    : "border-warning/40 text-warning/70",
                )}
              >
                {guess.playerName}
              </span>
            )}
            {isCurrentRow && session?.status === "playing" && (
              <span
                className={cn(
                  "md:hidden ml-1 px-1 py-0.5 text-[7px] font-bold uppercase tracking-wide whitespace-nowrap border animate-pulse",
                  isMyTurn
                    ? "border-success bg-success/10 text-success"
                    : "border-warning bg-warning/10 text-warning",
                )}
              >
                {isMyTurn ? "you" : (currentPlayer?.name ?? "").slice(0, 6)}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};

const MultiplayerKeyboard = () => {
  const { handleKeyPress, keyboardFeedback, isMyTurn, currentGuess } =
    useMultiplayer();
  const highlightEnter = currentGuess.length === EQUATION_LENGTH;

  const renderKey = (key: string) => (
    <Button
      key={key}
      onClick={() => handleKeyPress(key)}
      // Prevent the button from receiving focus on mouse click so that
      // subsequent Enter key presses don't re-trigger the button click.
      onMouseDown={(e) => e.preventDefault()}
      variant={getFeedbackColor(keyboardFeedback[key])}
      disabled={!isMyTurn}
      className={cn("min-h-10 min-w-10 transition-opacity", {
        "animate-pulse": highlightEnter && key === "Enter",
        "opacity-30": !isMyTurn,
      })}
      data-cy={`key-${key}`}
    >
      {key === "Backspace" ? "Del" : key}
    </Button>
  );

  return (
    <div className="flex flex-col gap-2 items-center">
      <div className="flex gap-1.5 flex-wrap justify-center">
        {NUMBER_KEYS.map(renderKey)}
      </div>
      <div className="flex gap-1.5 flex-wrap justify-center">
        {OPERATOR_KEYS.map(renderKey)}
      </div>
    </div>
  );
};

const GameOverBanner = () => {
  const { session, myPlayer } = useMultiplayer();
  if (session?.status !== "finished") return null;

  const won = session.winner === myPlayer?.name;
  const abandoned = session.winner && !session.guesses.length;

  return (
    <div
      className={cn(
        "w-full px-4 py-3 border-4 font-bold text-center text-xs md:text-sm",
        won
          ? "border-success bg-success/10 text-success"
          : "border-destructive bg-destructive/10 text-destructive",
      )}
    >
      {abandoned ? (
        <>Opponent disconnected. You win!</>
      ) : won ? (
        <>You solved it! Well done, {myPlayer?.name}!</>
      ) : session.winner ? (
        <>{session.winner} solved it first. Better luck next time!</>
      ) : (
        <>No more guesses. Game over!</>
      )}
    </div>
  );
};

export const MultiplayerGame = () => {
  const { session } = useMultiplayer();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const targetResult = session?.targetResult ?? 0;

  return (
    <div className="flex flex-col gap-4 p-4 z-10 items-center pb-20 md:pb-4">
      <div className="text-center space-y-2">
        <h1 className="text-foreground text-3xl md:text-4xl lg:text-5xl italic leading-none tracking-tighter">
          Mathler Duo
        </h1>
        {session?.status === "playing" && (
          <div className="flex flex-col gap-2 items-center">
            <PlayerBar />
            <h2 className="text-foreground text-xs lg:text-sm leading-none tracking-tighter">
              {isDesktop ? (
                <>
                  Solve the hidden equation{" "}
                  <span className="bg-foreground text-background p-1">
                    that results in {targetResult}
                  </span>
                </>
              ) : (
                <>
                  Find the equation{" "}
                  <span className="bg-foreground text-background p-1">
                    = {targetResult}
                  </span>
                </>
              )}
            </h2>
          </div>
        )}
        {session?.status === "waiting" && (
          <p className="text-foreground text-sm">
            {session.players.length === 1
              ? "Waiting for opponent…"
              : "Starting…"}
          </p>
        )}
      </div>

      {session?.status !== "waiting" && (
        <div className="flex gap-6 items-start">
          <div className="flex flex-col gap-3 items-center">
            <MultiplayerBoard />
            <MultiplayerKeyboard />
            <GameOverBanner />
          </div>
          <ChatSidebar />
        </div>
      )}

      <CursorOverlay />
      <ChatBottomBar />
    </div>
  );
};
