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
  const { session, currentGuess, myPlayer } = useMultiplayer();
  const guesses = session?.guesses ?? [];

  return (
    <div
      className="grid grid-rows-6 gap-2 bg-background/20 backdrop-blur-sm border-4 border-foreground p-2"
      data-cy="grid"
    >
      {Array.from({ length: ROWS }, (_, rowIndex) => {
        const guess: MultiplayerGuess | undefined = guesses[rowIndex];
        const isCurrentRow = rowIndex === guesses.length;
        const isFilled = Boolean(guess);

        return (
          <div
            key={rowIndex}
            className={cn(
              "relative flex gap-2",
              !isFilled && !isCurrentRow && "opacity-50",
            )}
          >
            {isFilled && (
              <span
                className={cn(
                  "hidden md:block absolute right-full top-1/2 -translate-y-1/2 pr-2 text-[9px] font-bold whitespace-nowrap max-w-[96px] truncate text-right",
                  guess.playerName === myPlayer?.name
                    ? "text-success"
                    : "text-warning",
                )}
              >
                {guess.playerName}
              </span>
            )}
            {Array.from({ length: COLUMNS }, (_, colIndex) => {
              const value = isFilled
                ? guess.tiles[colIndex].value
                : isCurrentRow
                  ? (currentGuess[colIndex] ?? "")
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
