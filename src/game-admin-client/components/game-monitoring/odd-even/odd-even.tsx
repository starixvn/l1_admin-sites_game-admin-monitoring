import BigSmallBase from "../big-small-base/big-small-base";
import { types } from "../game-monitoring-config";
import React from "react";

class OddEven extends BigSmallBase {
  get turbo(): boolean {
    return false;
  }

  get type() {
    return types.chanle;
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
    <OddEven
      gameName={gameName}
      {...props}
    />
  );
};
