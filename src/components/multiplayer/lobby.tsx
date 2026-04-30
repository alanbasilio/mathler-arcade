"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useMultiplayer } from "@/hooks/use-multiplayer";

interface LobbyProps {
  sessionId: string | null;
}

export const Lobby = ({ sessionId }: LobbyProps) => {
  const [name, setName] = useState("");
  const { createSession, joinSession, session } = useMultiplayer();

  const isJoining = Boolean(sessionId);

  const handleSubmit = () => {
    if (!name.trim()) return;
    if (isJoining && sessionId) {
      joinSession(sessionId, name.trim());
    } else {
      createSession(name.trim());
    }
  };

  const inviteUrl =
    typeof window !== "undefined" && session
      ? `${window.location.origin}/?session=${new URLSearchParams(window.location.search).get("session")}`
      : "";

  if (session?.status === "waiting" && !isJoining) {
    return (
      <div className="flex flex-col gap-6 items-center">
        <h1 className="text-foreground text-4xl md:text-5xl italic leading-none tracking-tighter animate-pulse">
          Mathler Duo
        </h1>
        <p className="text-foreground text-sm text-center">
          Waiting for opponent…
        </p>
        <div className="flex flex-col gap-2 items-center w-full max-w-sm">
          <p className="text-foreground text-xs">
            Share this link with a friend:
          </p>
          <div className="flex gap-2 items-center w-full">
            <code className="flex-1 text-xs border-2 border-foreground px-2 py-1 bg-background truncate">
              {inviteUrl}
            </code>
            <Button
              variant="pixel"
              size="sm"
              onClick={() => navigator.clipboard.writeText(inviteUrl)}
            >
              Copy
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 items-center">
      <h1 className="text-foreground text-4xl md:text-5xl italic leading-none tracking-tighter animate-pulse">
        {isJoining ? "Join Game" : "Mathler Duo"}
      </h1>
      <p className="text-foreground text-sm text-center">
        {isJoining
          ? "Enter your name to join the game"
          : "Start a new multiplayer session"}
      </p>
      <input
        type="text"
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        className="border-4 border-foreground px-3 py-2 bg-background text-foreground w-48 font-mono focus:outline-none"
        maxLength={20}
      />
      <Button
        variant="pixel"
        size="lg"
        onClick={handleSubmit}
        disabled={!name.trim()}
        className="text-base"
      >
        {isJoining ? "JOIN GAME" : "CREATE GAME"}
      </Button>
    </div>
  );
};
