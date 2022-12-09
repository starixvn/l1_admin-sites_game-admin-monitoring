import BetList from "./BetList";
import TimeModel from "./TimeModel";
import CardResult from "./CardResult";
import { GameState } from "../../shared/common/GameState";
import BaseMonitoringState from "./BaseMonitoringModel";

class Win3CardsBetList {
  dragon: BetList;
  phoenix: BetList;
  pair8Plus: BetList;
  threeOfAKind: BetList;
  straightFlush: BetList;
  flush: BetList;
  straight: BetList;

  constructor() {
    this.dragon = new BetList();
    this.phoenix = new BetList();
    this.pair8Plus = new BetList();
    this.threeOfAKind = new BetList();
    this.straightFlush = new BetList();
    this.flush = new BetList();
    this.straight = new BetList();
  }
}

class Win3CardsModel extends BaseMonitoringState {
  result: { dragonCards: CardResult[]; phoenixCards: CardResult[] };
  isShowResultUpdater: boolean;
  selectedCard: string;
  cardIndex: number;
  isShowDeskOfCards: boolean;

  constructor() {
    super();

    this.result = {
      dragonCards: [new CardResult(), new CardResult(), new CardResult()],
      phoenixCards: [new CardResult(), new CardResult(), new CardResult()],
    };
    this.time = new TimeModel();
    this.gameState = GameState.none;
    this.isShowResultUpdater = false;
    this.selectedCard = "";
    this.cardIndex = -1;
    this.isShowDeskOfCards = false;
  }
}

export { Win3CardsBetList, Win3CardsModel };
