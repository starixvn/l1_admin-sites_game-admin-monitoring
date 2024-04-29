import BaseMonitoringState from "../../common/model/BaseMonitoringModel";

export class CoinTossGameModel extends BaseMonitoringState {
  roundNumber: number;
  isHandleNextRoundResult: boolean;
  gameState: number;
  isValidResult: boolean;
  selectedChoice: string;
  isSubmited: boolean;

  constructor() {
    super();
    this.isHandleNextRoundResult = false;
    this.gameState = 0;
    this.isValidResult = false;
    this.isSubmited = false;
    this.selectedChoice = "head";
  }
}

