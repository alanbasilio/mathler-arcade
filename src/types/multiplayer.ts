import type { FeedbackColor } from "@/utils/feedback";

export interface SessionPlayer {
  id: string;
  name: string;
}

export interface MultiplayerTile {
  value: string;
  color: FeedbackColor;
  index: number;
}

export interface MultiplayerGuess {
  tiles: MultiplayerTile[];
  playerName: string;
}

export interface ChatMessage {
  playerName: string;
  text: string;
  timestamp: number;
}

export interface GameSession {
  players: SessionPlayer[];
  currentTurn: string;
  targetEquation: string;
  targetResult: number;
  guesses: MultiplayerGuess[];
  status: "waiting" | "playing" | "finished";
  winner: string | null;
  messages: ChatMessage[];
}

export type ClientMessage =
  | { type: "join"; name: string; playerId: string }
  | { type: "submit-guess"; guess: string }
  | { type: "cursor-move"; x: number; y: number }
  | { type: "send-message"; text: string };

export type ServerMessage =
  | { type: "session-updated"; session: GameSession }
  | { type: "opponent-cursor"; x: number; y: number; name: string }
  | { type: "new-message"; message: ChatMessage }
  | { type: "error"; message: string };
