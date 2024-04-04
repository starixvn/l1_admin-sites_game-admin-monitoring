import BaseMonitoringState from "../../common/model/BaseMonitoringModel";
import TimeModel from "../../common/model/TimeModel";
import { footballSlotConstant } from "./football-slot-constant";

class FootballSlotDropdownlistModel {
  min: number;
  max: number;

  constructor(min: number, max: number) {
    this.min = min;
    this.max = max;
  }
}

type FootballSlotBigSmall = {
  choice: string;
  value: number;
};

class FootballSlotState extends BaseMonitoringState {
  roundNumber: number;
  time: TimeModel;
  gameState: number;
  symbolsRender: any;
  isLucky: boolean;
  symbols: Array<string>;
  bigSmall: FootballSlotBigSmall;
  numberOfLuckySymbols: number;
  isUpdateMessage: boolean;

  constructor() {
    super();
    this.time = new TimeModel();
    this.gameState = 0;
    this.symbols = [];
    this.symbolsRender = { ...footballSlotConstant.defaultSymbols };
    this.numberOfLuckySymbols = footballSlotConstant.luckySymbol.min;
    this.isUpdateMessage = false;
    this.bigSmall = {
      choice: "small",
      value: 1,
    };
  }
}

export { FootballSlotDropdownlistModel, FootballSlotState };
