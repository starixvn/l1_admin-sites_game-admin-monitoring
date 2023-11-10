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
    this.isValidResult = true;
    this.isSubmited = false;
    this.duplicatedItems = [];

    this.hanks = [
      new HankModel("Banker", ["00", "01", "02", "03"]),
      new HankModel("Spade", ["11", "12", "13", "14"]),
      new HankModel("Heart", ["22", "23", "24", "25"]),
      new HankModel("Club", ["33", "34", "35", "36"]),
      new HankModel("Diamond", ["44", "45", "46", "55"]),
    ];
  }
}

