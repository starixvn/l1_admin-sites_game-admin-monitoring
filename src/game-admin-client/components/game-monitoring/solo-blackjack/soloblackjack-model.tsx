import BaseMonitoringState from "../../common/model/BaseMonitoringModel";

export class SoloBlackjackGameModel extends BaseMonitoringState {
  gameId: number;
  gameName: string;
  name: string;
  dealer: string;
  hands: Hands[];
  isSubmited: boolean;
  inputHand1: string;
  inputHand4: string;
  errorMessage: string;

  constructor() {
    super();
    this.gameId = 115;
    this.isHandleNextRoundResult = false;
    this.gameState = 0;
    this.isSubmited = false;
    this.errorMessage = "";
    this.gameName = "SoloBlackjack";
    this.name = "";
    this.inputHand1 = "";
    this.inputHand4 = "";
    this.dealer = "";
    this.hands = [{
      pos: 1,
      cards: []
    }, {
      pos: 4,
      cards: []
    }];
  }
}

export class Hands {
  pos: number;
  cards: CardModel[];
}


export interface CardModel {
  rank: string;
  suit: number;
}