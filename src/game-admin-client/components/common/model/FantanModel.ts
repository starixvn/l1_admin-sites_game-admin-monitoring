import BetList from "./BetList";
import TimeModel from "./TimeModel";
import BaseMonitoringState from "./BaseMonitoringModel";

class FanTanBetList {
  even: BetList;
  odd: BetList;
  fan1: BetList;
  fan2: BetList;
  fan3: BetList;
  fan4: BetList;
  kwok12: BetList;
  kwok23: BetList;
  kwok34: BetList;
  kwok41: BetList;
  chun123: BetList;
  chun124: BetList;
  chun134: BetList;
  chun234: BetList;

  constructor() {
    this.even = new BetList();
    this.odd = new BetList();
    this.fan1 = new BetList();
    this.fan2 = new BetList();
    this.fan3 = new BetList();
    this.fan4 = new BetList();
    this.kwok12 = new BetList();
    this.kwok23 = new BetList();
    this.kwok34 = new BetList();
    this.kwok41 = new BetList();
    this.chun123 = new BetList();
    this.chun124 = new BetList();
    this.chun134 = new BetList();
    this.chun234 = new BetList();
  }
}

export default class FanTanModel extends BaseMonitoringState {
  betList: FanTanBetList;
  result: number;
  isOpenControlResultModal: boolean;
  currentDiceNumber: number;
  isHandleNextRoundResult: boolean;
  nextRoundResult: number;

  constructor() {
    super();

    this.result = 0;
    this.betList = new FanTanBetList();
    this.time = new TimeModel();
    this.gameState = 0;
    this.isOpenControlResultModal = false;
    this.currentDiceNumber = -1;
    this.isHandleNextRoundResult = false;
    this.nextRoundResult = 0;
  }
}

export { FanTanModel, FanTanBetList };
