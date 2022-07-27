import BigSmallBase from "../big-small-base/big-small-base";
import { types } from "../game-monitoring-config";
import React from "react";

class BigSmall extends BigSmallBase {
  get turbo(): boolean {
    return false;
  }

  get type() {
    return types.taixiu;
  }

  get totalTimeInRound(): number {
    return 50;
  }

  get waitingTime(): number {
    return 10;
  }
}

export default (gameName: string) => (props) => {
  return (
    <BigSmall
      gameName={gameName}
      {...props}
    />
  );
};
