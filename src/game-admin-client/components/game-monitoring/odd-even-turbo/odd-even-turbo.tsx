import BigSmallBase from "../big-small-base/big-small-base";
import { types } from "../game-monitoring-config";
import React from "react";

class OddEvenTurbo extends BigSmallBase {
  get turbo(): boolean {
    return true;
  }

  get type() {
    return types.clturbo;
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
    <OddEvenTurbo
      gameName={gameName}
      {...props}
    />
  );
};
