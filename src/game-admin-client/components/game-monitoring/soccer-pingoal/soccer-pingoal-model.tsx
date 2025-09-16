import BaseMonitoringState from "../../common/model/BaseMonitoringModel";

export class SoccerPinGoalGameModel extends BaseMonitoringState {
  isHandleNextRoundResult: boolean;
  gameState: number;
  isValidResult: boolean;
  red: number;
  blue: number;
  playerName: string;
  isSubmitted: boolean;

  constructor() {
    super();
    this.isHandleNextRoundResult = false;
    this.gameState = 0;
    this.isValidResult = false;
    this.isSubmitted = false;
    this.red = 0;
    this.blue = 0;
    this.playerName = "";
  }
}
