import BigSmallBase from "../big-small-base/big-small-base";
import { types } from "../game-monitoring-config";
import React from "react";

class BigSmallTurbo extends BigSmallBase {
  get turbo(): boolean {
    return true;
  }

  get type() {
    return types.taixiu;
  }

  get totalTimeInRound(): number {
    return 30;
  }

  get waitingTime(): number {
    return 5;
  }
}

export default (gameName: string) => (props) => {
  return (
    <BigSmallTurbo
      gameName={gameName}
      {...props}
    />
  );
};
