"use client";

import { GoogleAnalytics } from "@next/third-parties/google";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { GameContent } from "@/components/game-content";
import { GameOver } from "@/components/game-over";
import { MultiplayerRoot } from "@/components/multiplayer/multiplayer-root";
import { RadioNowPlaying } from "@/components/radio-now-playing";
import { Start } from "@/components/start";
import { RetroGrid } from "@/components/ui/retro-grid";
import { useGame } from "@/hooks/use-game";
import { MultiplayerProvider } from "@/providers/multiplayer-provider";

export default function Mathler() {
  const { gameStarted, gameOver } = useGame();
  const [multiplayerMode, setMultiplayerMode] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sid = params.get("session");
    if (sid) {
      setSessionId(sid);
      setMultiplayerMode(true);
    }
    setReady(true);
  }, []);

  if (!ready) return null;

  if (multiplayerMode) {
    return (
      <div className="flex min-h-screen justify-center items-center align-center z-0 dark:bg-background/80">
        <RetroGrid />
        <MultiplayerProvider>
          <MultiplayerRoot sessionId={sessionId} />
        </MultiplayerProvider>
        <GoogleAnalytics gaId="G-R20575MFZH" />
      </div>
    );
  }

  const screen = gameStarted ? (gameOver ? "game-over" : "game") : "start";

  return (
    <div className="flex min-h-screen justify-center items-center align-center z-0 dark:bg-background/80">
      {!gameOver && <RetroGrid />}
      <AnimatePresence mode="wait">
        {/* Fade only — translating this wrapper would re-anchor fixed children (GameOver backdrop) */}
        <motion.div
          key={screen}
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduceMotion ? undefined : { opacity: 0 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="flex justify-center"
        >
          {screen === "game-over" ? (
            <GameOver />
          ) : screen === "game" ? (
            <GameContent />
          ) : (
            <Start onPlayDuo={() => setMultiplayerMode(true)} />
          )}
        </motion.div>
      </AnimatePresence>
      {screen === "game" && <RadioNowPlaying />}
      <GoogleAnalytics gaId="G-R20575MFZH" />
    </div>
  );
}
