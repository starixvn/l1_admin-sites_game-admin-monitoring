import { FruitSlotDropdownlistModel } from "./fruit-slot-model";
import configs from "../../../configs.json";

export const fruitSlotConstant = {
    luckySymbol: new FruitSlotDropdownlistModel(2, 3),
    bigSmall: new FruitSlotDropdownlistModel(1, 16),
    totalTimeInRound: 30,
    waitingTime: 13,
    luckyRoundDuration: 4,
    defaultSymbols: {
        bar: false,
        bar25: false,
        bar50: false,
        tripleSeven: false,
        tripleSeven3: false,
        watermelon: false,
        watermelon3: false,
        star: false,
        star3: false,
        bell: false,
        bell3: false,
        orange: false,
        orange3: false,
        lemon: false,
        lemon3: false,
        cherry: false,
        cherry3: false
    },
    resources: {
        FruitSlot: "Fruit Slot",
        RoundId: "RoundId:",
        BigSmallValue: "Big Small Result",
        SymbolResult: "Symbols Result:",
        LuckySymbol: "Lucky Symbol",
        MaxSymbols: "Max symbols",
        Submit: "Submit",
        SuccessfullyMessage: "Update successfuly!"
    },
    symbolPositionsMapper: {
        bar: [5],
        bar25: [3],
        bar50: [4],
        tripleSeven: [16],
        tripleSeven3: [15],
        watermelon: [8],
        watermelon3: [9],
        star: [20],
        star3: [21],
        bell: [2],
        bell3: [0],
        orange: [1, 13],
        orange3: [12],
        lemon: [7, 19],
        lemon3: [18],
        cherry: [11, 17, 23],
        cherry3: [6],
        lucky: [10, 22],
    },
    betchoiceName: {
        big: "big",
        small: "small"
    },
    rootImageUrl: `${configs.RootUrl}/game-admin/images/fruitslot/`
};
