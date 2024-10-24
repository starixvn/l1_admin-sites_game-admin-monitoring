import BaseMonitoringState from "../../common/model/BaseMonitoringModel";

export class SevenUpDownGameModel extends BaseMonitoringState {
  roundNumber: number;
  isHandleNextRoundResult: boolean;
  gameState: number;
  isValidResult: boolean;
  dice1: number;
  dice2: number;
  choice: string;
  multiplierValue: number;
  isSubmited: boolean;

  constructor() {
    super();
    this.isHandleNextRoundResult = false;
    this.gameState = 0;
    this.isValidResult = false;
    this.isSubmited = false;
    this.choice = "";
  }
}

