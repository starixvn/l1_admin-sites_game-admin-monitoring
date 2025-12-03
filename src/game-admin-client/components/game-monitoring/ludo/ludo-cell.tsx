import React from "react";
import { useMemo } from "react";
import { useGameContext } from "./GameContext";
import styles from "./ludo-cell.module.scss";
import { PlayerColor } from "./enums";
import { Horse } from "./Horse";

export interface LudoCellProps {
  cellNumber: number;
  type: "path" | "stable" | "center";
  stableColor?: PlayerColor;
}

const typeClassMap = {
  path: styles.cellPath,
  stable: styles.cellStable,
  center: styles.cellCenter,
};

const stableColorClassMap = {
  [PlayerColor.ZERO]: styles.stableYellow,
  [PlayerColor.ONE]: styles.stableBlue,
  [PlayerColor.TWO]: styles.stableRed,
  [PlayerColor.THREE]: styles.stableGreen,
};

export function LudoCell({ cellNumber, type, stableColor }: LudoCellProps) {
  const stableClass =
    type === "stable" && stableColor !== undefined
      ? stableColorClassMap[stableColor]
      : "";
  const { gameStore } = useGameContext();
  const cellColor = useMemo(
    () => gameStore?.turnResult?.raceMap?.[cellNumber],
    [gameStore, cellNumber],
  );
  const isKicked = useMemo(
    () => gameStore?.turnResult?.kickedPlayer?.position === cellNumber,
    [gameStore, cellNumber],
  );
  const hasHorseInStable = useMemo(
    () =>
      gameStore?.turnResult?.stableMap?.[stableColor as PlayerColor]?.includes(
        cellNumber,
      ),
    [gameStore, stableColor, cellNumber],
  );
  return (
    <div className={`${styles.cell} ${typeClassMap[type]} ${stableClass}`}>
      {cellNumber !== undefined && type === "path" && (
        <>
          <span className={styles.cellNumber}>{cellNumber}</span>
          {cellColor !== undefined && (
            <Horse color={cellColor} inStable={false} isKicked={isKicked} />
          )}
        </>
      )}

      {type === "stable" && (
        <div className={styles.cellStableInner}>
          <span className={styles.cellNumber}>{cellNumber}</span>
          {hasHorseInStable && (
            <Horse
              color={stableColor as PlayerColor}
              inStable={true}
              isKicked={isKicked}
            />
          )}
        </div>
      )}
    </div>
  );
}
