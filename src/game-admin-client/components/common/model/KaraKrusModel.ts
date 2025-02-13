import BaseMonitoringState from "./BaseMonitoringModel";
import BetList from "./BetList";
import DiceModel from "./DiceModel";
import DiceType from "./DiceType";

class KaraKrusBetList {
  kara: BetList;
  krus: BetList;
  head1: BetList;
  head2: BetList;
  head3: BetList;
  tail3: BetList;

  constructor() {
    this.kara = new BetList();
    this.krus = new BetList();
    this.head1 = new BetList();
    this.head2 = new BetList();
    this.head3 = new BetList();
    this.tail3 = new BetList();
  }
}

class KaraKrusSettlementResult {
  kara: boolean;
  krus: boolean;
  head1: boolean;
  head2: boolean;
  head3: boolean;
  tail3: boolean;
}

export default class KaraKrusModel extends BaseMonitoringState {
  result: Array<DiceModel>;
  settlementResult: KaraKrusSettlementResult;
  currentDiceNumber: number;
  nextRoundResult: { [key: string]: boolean };

  constructor() {
    super();
    this.currentDiceNumber = -1;
    this.nextRoundResult = {};
    this.betList = new KaraKrusBetList();
    this.settlementResult = new KaraKrusSettlementResult();
    this.result = [
      new DiceModel(-1, DiceType.XocXoc),
      new DiceModel(-1, DiceType.XocXoc),
      new DiceModel(-1, DiceType.XocXoc),
    ];
  }
}

export { KaraKrusBetList, KaraKrusModel, KaraKrusSettlementResult };
