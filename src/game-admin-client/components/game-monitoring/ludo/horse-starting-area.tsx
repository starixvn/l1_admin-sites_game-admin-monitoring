import React, { useMemo } from "react";
import { PlayerColor } from "./enums";
import { useGameContext } from "./GameContext";
import styles from "./horse-starting-area.module.scss";
import { Horse } from "./horse";

const colorClassMap = {
  [PlayerColor.ZERO]: styles.areaYellow,
  [PlayerColor.ONE]: styles.areaBlue,
  [PlayerColor.TWO]: styles.areaRed,
  [PlayerColor.THREE]: styles.areaGreen,
};

export function HorseStartingArea({ color }: { color: PlayerColor }) {
  const { gameStore } = useGameContext();
  const counts = useMemo(
    () => gameStore?.turnResult?.startingAreaMap[color] ?? 0,
    [gameStore, color]
  );
  return (
    <div className={`${styles.startingArea} ${colorClassMap[color]}`}>
      {Array(counts)
        .fill(0)
        .map((_, i) => (
          <Horse key={i} color={color} inStable={true} isKicked={false} />
        ))}
    </div>
  );
}
