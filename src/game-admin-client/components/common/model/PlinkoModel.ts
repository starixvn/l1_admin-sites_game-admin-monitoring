import BaseMonitoringState from "./BaseMonitoringModel";

export default class PlinkoModel extends BaseMonitoringState {
  roundNumber: number;
  gameState: number;
  isValidResult: boolean;
  isSubmited: boolean;
  choice: string;
  nickname: string;
  errorMessage: string;

  constructor() {
    super();
    this.gameState = 0;
    this.isValidResult = false;
    this.isSubmited = false;
    this.choice = "";
    this.nickname = "";
    this.errorMessage = "";
  }
}
