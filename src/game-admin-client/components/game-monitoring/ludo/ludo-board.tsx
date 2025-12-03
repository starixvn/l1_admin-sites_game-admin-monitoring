import React from "react";
import { LudoCell } from "./ludo-cell";
import { HorseStartingArea } from "./horse-starting-area";
import { PlayerColor } from "./enums";
import styles from "./ludo-board.module.scss";

export function LudoBoard() {
  return (
    <div className={styles.board}>
      <div className={styles.rowBoard}>
        <HorseStartingArea color={PlayerColor.ZERO} />
        <div className={styles.track}>
          <div className="lane">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <LudoCell key={i} cellNumber={i + 1} type="path" />
              ))}
          </div>
          <div className="lane">
            <LudoCell
              cellNumber={56}
              type="path"
              stableColor={PlayerColor.ZERO}
            />
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <LudoCell
                  key={i}
                  cellNumber={i + 57}
                  type="stable"
                  stableColor={PlayerColor.ZERO}
                />
              ))}
          </div>
          <div className="lane">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <LudoCell key={i} cellNumber={55 - i} type="path" />
              ))}
          </div>
        </div>
        <HorseStartingArea color={PlayerColor.THREE} />
      </div>
      <div className={`${styles.rowBoard} ${styles.inline}`}>
        <div className={styles.rowLane}>
          {Array(7)
            .fill(0)
            .map((_, i) => (
              <LudoCell key={i} cellNumber={13 - i} type="path" />
            ))}
          <LudoCell
            cellNumber={62}
            type="stable"
            stableColor={PlayerColor.ZERO}
          />
          {Array(7)
            .fill(0)
            .map((_, i) => (
              <LudoCell key={i} cellNumber={49 - i} type="path" />
            ))}
        </div>
        <div className={styles.rowLane}>
          <LudoCell cellNumber={14} type="path" />
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <LudoCell
                key={i}
                cellNumber={57 + i}
                type="stable"
                stableColor={PlayerColor.ONE}
              />
            ))}
          <LudoCell cellNumber={100} type="center" />
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <LudoCell
                key={i}
                cellNumber={62 - i}
                type="stable"
                stableColor={PlayerColor.THREE}
              />
            ))}
          <LudoCell cellNumber={42} type="path" />
        </div>
        <div className={styles.rowLane}>
          {Array(7)
            .fill(0)
            .map((_, i) => (
              <LudoCell key={i} cellNumber={15 + i} type="path" />
            ))}
          <LudoCell
            cellNumber={62}
            type="stable"
            stableColor={PlayerColor.TWO}
          />
          {Array(7)
            .fill(0)
            .map((_, i) => (
              <LudoCell key={i} cellNumber={35 + i} type="path" />
            ))}
        </div>
      </div>
      <div className={styles.rowBoard}>
        <HorseStartingArea color={PlayerColor.ONE} />
        <div className={styles.track}>
          <div className="lane">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <LudoCell key={i} cellNumber={i + 22} type="path" />
              ))}
          </div>
          <div className="lane">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <LudoCell
                  key={i}
                  cellNumber={61 - i}
                  type="stable"
                  stableColor={PlayerColor.TWO}
                />
              ))}
            <LudoCell cellNumber={28} type="path" />
          </div>
          <div className="lane">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <LudoCell key={i} cellNumber={34 - i} type="path" />
              ))}
          </div>
        </div>
        <HorseStartingArea color={PlayerColor.TWO} />
      </div>
    </div>
  );
}
