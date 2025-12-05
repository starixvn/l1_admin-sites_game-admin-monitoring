import React, { createContext, useContext } from "react";
import { PlayerColor } from "./enums";

export interface TurnResult {
  raceMap: { [cellNumber: number]: PlayerColor };
  stableMap: { [color in PlayerColor]?: number[] };
  startingAreaMap: { [color in PlayerColor]?: number };
  kickedPlayer?: { position: number };
}

export interface GameStore {
  turnResult?: TurnResult;
}

interface GameContextType {
  gameStore?: GameStore;
}

const GameContext = createContext<GameContextType | undefined>({});

export function GameContextProvider({
  children,
  gameStore,
}: {
  children: React.ReactNode;
  gameStore?: GameStore;
}) {
  return (
    <GameContext.Provider value={{ gameStore }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGameContext() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGameContext must be used within GameContextProvider");
  }
  return context;
}
