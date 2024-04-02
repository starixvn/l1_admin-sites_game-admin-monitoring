import BaseMonitoringState from "../../common/model/BaseMonitoringModel";

export class LuckyNextGameModel extends BaseMonitoringState {
  isHandleNextRoundResult: boolean;
  gameState: number;
  isValidResult: boolean;
  ball: string;
  isSubmited: boolean;
  nextDrawId: number;

  constructor() {
    super();
    this.isHandleNextRoundResult = false;
    this.gameState = 0;
    this.isValidResult = false;
    this.isSubmited = false;
    this.ball = "";
  }
}

