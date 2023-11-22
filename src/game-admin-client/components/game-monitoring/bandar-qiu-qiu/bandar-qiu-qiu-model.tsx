import BaseMonitoringState from "../../common/model/BaseMonitoringModel";
import { Dominoes } from "./bandar-qiu-qiu-constants";

export class HankModel {
  name: string;
  values: Array<string>;
  validedDominoes: Array<string>;
  duplicatedItems: Array<string>;

  constructor(name: string, values: Array<string>) {
    this.name = name;
    this.values = values;
    this.duplicatedItems = [];
    this.validedDominoes = [];
  }

  isValid() {
    this.validedDominoes = this.values.filter((item) => {
      return Dominoes.indexOf(item) !== -1
    })

    return this.validedDominoes.length === 4 && this.duplicatedItems.length === 0;
  }
}

export class BandarQiuQiuGameModel extends BaseMonitoringState {
  roundNumber: number;
  isHandleNextRoundResult: boolean;
  gameState: number;
  isValidResult: boolean;

  hanks: Array<HankModel>;
  flatHanks: Array<string>;
  duplicatedItems: Array<string>;
  isSubmited: boolean;

  constructor() {
    super();
    this.isHandleNextRoundResult = false;
    this.gameState = 0;
    this.isValidResult = false;
    this.isSubmited = false;
    this.duplicatedItems = [];
    this.flatHanks = [];

    this.hanks = [
      new HankModel("Banker", []),
      new HankModel("Spade", []),
      new HankModel("Heart", []),
      new HankModel("Club", []),
      new HankModel("Diamond", []),
    ];
  }
}

