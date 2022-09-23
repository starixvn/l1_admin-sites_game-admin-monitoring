import { FruitSlotDropdownlistModel } from "./fruit-slot-model";
import configs from "../../../configs.json";

export const fruitSlotConstant = {
    luckySymbol: new FruitSlotDropdownlistModel(2, 3),
    bigSmall: new FruitSlotDropdownlistModel(1, 16),
    totalTimeInRound: 30,
    waitingTime: 13,
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
    rootImageUrl: `${configs.RootUrl}/game-admin/images/fruitslot/`
};
