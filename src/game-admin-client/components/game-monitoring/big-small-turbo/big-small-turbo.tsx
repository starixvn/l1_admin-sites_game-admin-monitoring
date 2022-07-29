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
    return this.props.duration.placingBet;
  }

  get waitingTime(): number {
    return this.props.duration.waitingTime;
  }
}

export default (gameName: string, duration: Object) => (props) => {
  return (
    <BigSmallTurbo
      gameName={gameName}
      duration={duration}
      {...props}
    />
  );
};
