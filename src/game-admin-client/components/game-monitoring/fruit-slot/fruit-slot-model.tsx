import BaseMonitoringState from "../../common/model/BaseMonitoringModel";
import TimeModel from "../../common/model/TimeModel";
import { fruitSlotConstant } from "./fruit-slot-constant";

class FruitSlotDropdownlistModel {
    min: number;
    max: number;

    constructor(min: number, max: number) {
        this.min = min;
        this.max = max;
    }
}

type FruitSlotBigSmall = {
    choice: string;
    value: number;
}

class FruitSlotState extends BaseMonitoringState {
    roundNumber: number;
    time: TimeModel;
    gameState: number;
    symbolsRender: any;
    isLucky: boolean;
    symbols: Array<string>;
    bigSmall: FruitSlotBigSmall;
    numberOfLuckySymbols: number;
    isUpdateMessage: boolean;

    constructor() {
        super();
        this.time = new TimeModel();
        this.gameState = 0;
        this.symbols = [];
        this.symbolsRender = { ...fruitSlotConstant.defaultSymbols };
        this.numberOfLuckySymbols = fruitSlotConstant.luckySymbol.min;
        this.isUpdateMessage = false;
        this.bigSmall = {
            choice: "small",
            value: 1
        }
    }
}

export { FruitSlotDropdownlistModel, FruitSlotState };