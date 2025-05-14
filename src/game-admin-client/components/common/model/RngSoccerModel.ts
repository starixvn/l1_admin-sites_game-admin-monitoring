import BetList from "./BetList";
import BaseMonitoringState from "./BaseMonitoringModel";

export class RngSoccerBetList {
  home: BetList;
  draw: BetList;
  away: BetList;

  constructor() {
    this.home = new BetList();
    this.draw = new BetList();
    this.away = new BetList();
  }
}

export default class RngSoccerModel extends BaseMonitoringState {
    isShowDeskOfCards: boolean;
    selectedCard: string;
  
    constructor() {
      super();
      this.isShowDeskOfCards = false;
      this.selectedCard = "";
    }
} 