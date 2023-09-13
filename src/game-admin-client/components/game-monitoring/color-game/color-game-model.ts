import BaseMonitoringState from "../../common/model/BaseMonitoringModel";
import BetList from "../../common/model/BetList";
import DiceModel from "../../common/model/DiceModel";
import DiceType from "../../common/model/DiceType";
import TimeModel from "../../common/model/TimeModel";

class ColorGameBetList {
  yellow: BetList;
  red: BetList;
  pink: BetList;
  white: BetList;
  blue: BetList;
  green: BetList;
  hot: BetList;
  cold: BetList;

  constructor() {
    this.yellow = new BetList();
    this.red = new BetList();
    this.pink = new BetList();
    this.white = new BetList();
    this.blue = new BetList();
    this.green = new BetList();
    this.hot = new BetList();
    this.cold = new BetList();
  }
}

class ColorGameSettlementResult {
  yellow: boolean;
  red: boolean;
  pink: boolean;
  white: boolean;
  blue: boolean;
  green: boolean;
  hot: boolean;
  cold: boolean;
}

class GameResult {
  "dice1": number;
  "dice2": number;
  "dice3": number;

  constructor(dice0 = -1, dice1 = -1, dice2 = -1) {
    this["dice1"] = dice0;
    this["dice2"] = dice1;
    this["dice3"] = dice2;
  }
}

export default class ColorGameModel extends BaseMonitoringState {
  roundNumber: number;
  time: TimeModel;
  betList: ColorGameBetList;
  result: Array<DiceModel>;
  isOpenModal: boolean;
  currentDiceNumber: number;
  isHandleNextRoundResult: boolean;
  nextRoundResult: GameResult;
  gameState: number;
  settlementResult: ColorGameSettlementResult;

  constructor() {
    super();
    this.result = [
      new DiceModel(-1, DiceType.ColorGame),
      new DiceModel(-1, DiceType.ColorGame),
      new DiceModel(-1, DiceType.ColorGame),
    ];
    this.betList = new ColorGameBetList();
    this.time = new TimeModel();
    this.isOpenModal = false;
    this.isHandleNextRoundResult = false;
    this.nextRoundResult = new GameResult();
    this.gameState = 0;
    this.settlementResult = new ColorGameSettlementResult();
  }
}

export {
  ColorGameModel,
  ColorGameBetList,
  GameResult,
  ColorGameSettlementResult,
};
