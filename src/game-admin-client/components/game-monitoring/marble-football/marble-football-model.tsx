import BaseMonitoringState from "../../common/model/BaseMonitoringModel";

export class MarbleFootballGameModel extends BaseMonitoringState {
  isHandleNextRoundResult: boolean;
  gameState: number;
  isValidResult: boolean;
  firstHalf: string;
  secondHalf: string;
  homeWinsOnDraw: boolean;
  isSubmited: boolean;
  nextRoundId: number;

  constructor() {
    super();
    this.isHandleNextRoundResult = false;
    this.gameState = 0;
    this.isValidResult = false;
    this.isSubmited = false;
    this.firstHalf = "";
    this.secondHalf = "";
    this.homeWinsOnDraw = false;
  }
}
