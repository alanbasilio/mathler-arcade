import type * as Party from "partykit/server";
import type {
  ChatMessage,
  GameSession,
  MultiplayerGuess,
  SessionPlayer,
} from "../src/types/multiplayer";
import { EQUATION_LENGTH, MAX_GUESSES } from "../src/utils/constants";
import { evaluate, isCumulativeSolution } from "../src/utils/evaluate";
import type { FeedbackColor } from "../src/utils/feedback";
import { getFeedback } from "../src/utils/feedback";
import { getNumberOfTheDay } from "../src/utils/numbers";

const createInitialSession = (): GameSession => {
  const targetEquation = getNumberOfTheDay();
  return {
    players: [],
    currentTurn: "",
    targetEquation,
    targetResult: evaluate(targetEquation) ?? 0,
    guesses: [],
    status: "waiting",
    winner: null,
    messages: [],
  };
};

export default class GameServer implements Party.Server {
  session: GameSession;
  connToPlayer: Map<string, string> = new Map();

  constructor(readonly room: Party.Room) {
    this.session = createInitialSession();
  }

  onConnect(conn: Party.Connection) {
    conn.send(
      JSON.stringify({ type: "session-updated", session: this.session }),
    );
  }

  onMessage(message: string, sender: Party.Connection) {
    const msg = JSON.parse(message as string);
    switch (msg.type) {
      case "join":
        this.handleJoin(sender, msg.name, msg.playerId);
        break;
      case "submit-guess":
        this.handleSubmitGuess(sender, msg.guess);
        break;
      case "cursor-move":
        this.handleCursorMove(sender, msg.x, msg.y);
        break;
      case "send-message":
        this.handleSendMessage(sender, msg.text);
        break;
    }
  }

  onClose(conn: Party.Connection) {
    const playerId = this.connToPlayer.get(conn.id);
    this.connToPlayer.delete(conn.id);

    if (playerId && this.session.status === "playing") {
      this.session.status = "finished";
      const other = this.session.players.find((p) => p.id !== playerId);
      this.session.winner = other?.name ?? null;
      this.broadcast({ type: "session-updated", session: this.session });
    }

    this.session.players = this.session.players.filter(
      (p) => p.id !== playerId,
    );
  }

  private handleJoin(conn: Party.Connection, name: string, playerId: string) {
    if (this.session.players.length >= 2) {
      conn.send(JSON.stringify({ type: "error", message: "Session is full" }));
      return;
    }
    if (this.session.status === "finished") {
      conn.send(
        JSON.stringify({ type: "error", message: "Session has ended" }),
      );
      return;
    }

    this.connToPlayer.set(conn.id, playerId);
    const player: SessionPlayer = { id: playerId, name };
    this.session.players.push(player);

    if (this.session.players.length === 2) {
      const randomIndex = Math.floor(Math.random() * 2);
      this.session.currentTurn = this.session.players[randomIndex].id;
      this.session.status = "playing";
    }

    this.broadcast({ type: "session-updated", session: this.session });
  }

  private handleSubmitGuess(conn: Party.Connection, guess: string) {
    if (this.session.status !== "playing") return;

    const playerId = this.connToPlayer.get(conn.id);
    if (!playerId || this.session.currentTurn !== playerId) {
      conn.send(JSON.stringify({ type: "error", message: "Not your turn" }));
      return;
    }

    if (guess.length !== EQUATION_LENGTH) {
      conn.send(
        JSON.stringify({
          type: "error",
          message: `Fill in all ${EQUATION_LENGTH} spaces!`,
        }),
      );
      return;
    }
    if (!/[+\-*/]/.test(guess)) {
      conn.send(
        JSON.stringify({ type: "error", message: "Must contain an operator!" }),
      );
      return;
    }

    const isDuplicate = this.session.guesses.some(
      (g) => g.tiles.map((t) => t.value).join("") === guess,
    );
    if (isDuplicate) {
      conn.send(
        JSON.stringify({ type: "error", message: "Already tried this guess!" }),
      );
      return;
    }

    const result = evaluate(guess);
    if (result === null) {
      conn.send(
        JSON.stringify({ type: "error", message: "Invalid equation!" }),
      );
      return;
    }
    if (result !== this.session.targetResult) {
      conn.send(
        JSON.stringify({
          type: "error",
          message: `Must equal ${this.session.targetResult}!`,
        }),
      );
      return;
    }

    const player = this.session.players.find((p) => p.id === playerId);
    if (!player) return;

    if (
      isCumulativeSolution(
        guess.split(""),
        this.session.targetEquation.split(""),
      )
    ) {
      const feedback: FeedbackColor[] = Array(EQUATION_LENGTH).fill("success");
      const newGuess: MultiplayerGuess = {
        tiles: guess
          .split("")
          .map((char, i) => ({ value: char, color: feedback[i], index: i })),
        playerName: player.name,
      };
      this.session.guesses.push(newGuess);
      this.session.status = "finished";
      this.session.winner = player.name;
      this.broadcast({ type: "session-updated", session: this.session });
      return;
    }

    const rawFeedback = getFeedback(guess, this.session.targetEquation);
    const feedback: FeedbackColor[] = rawFeedback.map((c) =>
      c === "outline" ? "destructive" : c,
    );

    const newGuess: MultiplayerGuess = {
      tiles: guess
        .split("")
        .map((char, i) => ({ value: char, color: feedback[i], index: i })),
      playerName: player.name,
    };
    this.session.guesses.push(newGuess);

    const other = this.session.players.find((p) => p.id !== playerId);
    if (other) this.session.currentTurn = other.id;

    if (this.session.guesses.length >= MAX_GUESSES) {
      this.session.status = "finished";
    }

    this.broadcast({ type: "session-updated", session: this.session });
  }

  private handleCursorMove(conn: Party.Connection, x: number, y: number) {
    const playerId = this.connToPlayer.get(conn.id);
    const player = this.session.players.find((p) => p.id === playerId);
    if (!player) return;

    for (const connection of this.room.getConnections()) {
      if (connection.id !== conn.id) {
        connection.send(
          JSON.stringify({ type: "opponent-cursor", x, y, name: player.name }),
        );
      }
    }
  }

  private handleSendMessage(conn: Party.Connection, text: string) {
    const playerId = this.connToPlayer.get(conn.id);
    const player = this.session.players.find((p) => p.id === playerId);
    if (!player || !text.trim()) return;

    const message: ChatMessage = {
      playerName: player.name,
      text: text.trim(),
      timestamp: Date.now(),
    };

    this.session.messages.push(message);
    if (this.session.messages.length > 100) this.session.messages.shift();

    this.broadcast({ type: "new-message", message });
  }

  private broadcast(data: object) {
    this.room.broadcast(JSON.stringify(data));
  }
}
