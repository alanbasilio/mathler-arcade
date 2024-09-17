"use client";

import React, { createContext, ReactNode, useContext, useState } from "react";

type GameMode = "normal" | "hard";

interface GameModeContextProps {
  mode: GameMode;
  setMode: (mode: GameMode) => void;
}

const GameModeContext = createContext<GameModeContextProps | undefined>(
  undefined
);

export const GameModeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [mode, setMode] = useState<GameMode>("normal");

  return (
    <GameModeContext.Provider value={{ mode, setMode }}>
      {children}
    </GameModeContext.Provider>
  );
};

export const useGameMode = () => {
  const context = useContext(GameModeContext);
  if (!context) {
    throw new Error("useGameMode must be used within a GameModeProvider");
  }
  return context;
};
