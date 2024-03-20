import BaseMonitoringState from "../../common/model/BaseMonitoringModel";

export class BacBall1GameModel extends BaseMonitoringState {
  roundNumber: number;
  isHandleNextRoundResult: boolean;
  gameState: number;
  isValidResult: boolean;
  player: string;
  banker: string;
  isSubmited: boolean;
  nextDrawId: number;

  constructor() {
    super();
    this.isHandleNextRoundResult = false;
    this.gameState = 0;
    this.isValidResult = false;
    this.isSubmited = false;
    this.player = "";
    this.banker = "";
  }
}

