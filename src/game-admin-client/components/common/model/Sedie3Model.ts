import BaseMonitoringState from "./BaseMonitoringModel";
import BetList from "./BetList";
import DiceModel from "./DiceModel";
import DiceType from "./DiceType";

class SeDie3BetList {
  red: BetList;
  white: BetList;
  red1: BetList;
  red2: BetList;
  red3: BetList;
  white3: BetList;

  constructor() {
    this.red = new BetList();
    this.white = new BetList();
    this.red1 = new BetList();
    this.red2 = new BetList();
    this.red3 = new BetList();
    this.white3 = new BetList();
  }
}

class SeDie3SettlementResult {
  red: boolean;
  white: boolean;
  red1: boolean;
  red2: boolean;
  red3: boolean;
  white3: boolean;
}

export default class SeDie3Model extends BaseMonitoringState {
  result: Array<DiceModel>;
  settlementResult: SeDie3SettlementResult;
  currentDiceNumber: number;
  nextRoundResult: { [key: string]: boolean };

  constructor() {
    super();
    this.currentDiceNumber = -1;
    this.nextRoundResult = {};
    this.betList = new SeDie3BetList();
    this.settlementResult = new SeDie3SettlementResult();
    this.result = [
      new DiceModel(-1, DiceType.XocXoc),
      new DiceModel(-1, DiceType.XocXoc),
      new DiceModel(-1, DiceType.XocXoc),
    ];
  }
}

export { SeDie3BetList, SeDie3Model, SeDie3SettlementResult };
