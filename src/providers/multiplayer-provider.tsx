"use client";

import PartySocket from "partysocket";
import {
  createContext,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import type {
  ClientMessage,
  GameSession,
  ServerMessage,
  SessionPlayer,
} from "@/types/multiplayer";
import { EQUATION_LENGTH, VALID_KEYS } from "@/utils/constants";
import { computeKeyboardFeedback, type FeedbackColor } from "@/utils/feedback";

interface MultiplayerContextProps {
  session: GameSession | null;
  myPlayer: SessionPlayer | null;
  isMyTurn: boolean;
  opponentCursor: { x: number; y: number; name: string } | null;
  currentGuess: string;
  keyboardFeedback: Record<string, FeedbackColor>;
  createSession: (name: string) => string;
  joinSession: (sessionId: string, name: string) => void;
  handleKeyPress: (key: string) => void;
  sendMessage: (text: string) => void;
}

export const MultiplayerContext = createContext<
  MultiplayerContextProps | undefined
>(undefined);

export const MultiplayerProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<GameSession | null>(null);
  const [myPlayer, setMyPlayer] = useState<SessionPlayer | null>(null);
  const [opponentCursor, setOpponentCursor] = useState<{
    x: number;
    y: number;
    name: string;
  } | null>(null);
  const [currentGuess, setCurrentGuess] = useState("");
  const [keyboardFeedback, setKeyboardFeedback] = useState<
    Record<string, FeedbackColor>
  >({});

  const socketRef = useRef<PartySocket | null>(null);
  const myPlayerIdRef = useRef<string>("");
  const rafRef = useRef<number | null>(null);

  const send = useCallback((msg: ClientMessage) => {
    socketRef.current?.send(JSON.stringify(msg));
  }, []);

  const connectToSession = useCallback((sessionId: string, name: string) => {
    if (socketRef.current) {
      socketRef.current.close();
    }

    const playerId = myPlayerIdRef.current || uuidv4();
    myPlayerIdRef.current = playerId;

    const host = process.env.NEXT_PUBLIC_PARTYKIT_HOST ?? "localhost:1999";
    const socket = new PartySocket({ host, room: sessionId });
    socketRef.current = socket;

    socket.addEventListener("open", () => {
      socket.send(
        JSON.stringify({
          type: "join",
          name,
          playerId,
        } satisfies ClientMessage),
      );
      setMyPlayer({ id: playerId, name });
    });

    socket.addEventListener("message", (event: MessageEvent) => {
      const msg: ServerMessage = JSON.parse(event.data);

      switch (msg.type) {
        case "session-updated": {
          setSession(msg.session);
          let feedback: Record<string, FeedbackColor> = {};
          for (const guess of msg.session.guesses) {
            const guessStr = guess.tiles.map((t) => t.value).join("");
            const colors = guess.tiles.map((t) => t.color);
            feedback = computeKeyboardFeedback(feedback, guessStr, colors);
          }
          setKeyboardFeedback(feedback);
          break;
        }
        case "opponent-cursor":
          setOpponentCursor({ x: msg.x, y: msg.y, name: msg.name });
          break;
        case "new-message":
          setSession((prev) =>
            prev
              ? { ...prev, messages: [...prev.messages, msg.message] }
              : prev,
          );
          break;
        case "error":
          toast.error(msg.message, { position: "top-center" });
          break;
      }
    });
  }, []);

  const createSession = useCallback(
    (name: string): string => {
      const sessionId = Math.random().toString(36).slice(2, 10);
      if (typeof window !== "undefined") {
        const url = new URL(window.location.href);
        url.searchParams.set("session", sessionId);
        window.history.pushState({}, "", url);
      }
      connectToSession(sessionId, name);
      return sessionId;
    },
    [connectToSession],
  );

  const joinSession = useCallback(
    (sessionId: string, name: string) => {
      connectToSession(sessionId, name);
    },
    [connectToSession],
  );

  const isMyTurn = Boolean(
    session && myPlayer && session.currentTurn === myPlayer.id,
  );

  const handleKeyPress = useCallback(
    (key: string) => {
      if (!isMyTurn || session?.status !== "playing") return;

      if (key === "Enter") {
        send({ type: "submit-guess", guess: currentGuess });
        setCurrentGuess("");
      } else if (key === "Backspace") {
        setCurrentGuess((prev) => prev.slice(0, -1));
      } else if (currentGuess.length < EQUATION_LENGTH) {
        setCurrentGuess((prev) => prev + key);
      }
    },
    [currentGuess, isMyTurn, send, session?.status],
  );

  const sendMessage = useCallback(
    (text: string) => {
      send({ type: "send-message", text });
    },
    [send],
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Skip if a button or form element has focus — they handle their own events.
      // Prevents Enter from double-firing when a keyboard button is focused.
      const active = document.activeElement;
      if (
        active instanceof HTMLButtonElement ||
        active instanceof HTMLInputElement ||
        active instanceof HTMLTextAreaElement
      ) {
        return;
      }
      if (VALID_KEYS.includes(event.key)) {
        handleKeyPress(event.key);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyPress]);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        send({
          type: "cursor-move",
          x: event.clientX / window.innerWidth,
          y: event.clientY / window.innerHeight,
        });
      });
    };
    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, [send]);

  useEffect(() => {
    return () => {
      socketRef.current?.close();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <MultiplayerContext.Provider
      value={{
        session,
        myPlayer,
        isMyTurn,
        opponentCursor,
        currentGuess,
        keyboardFeedback,
        createSession,
        joinSession,
        handleKeyPress,
        sendMessage,
      }}
    >
      {children}
    </MultiplayerContext.Provider>
  );
};
