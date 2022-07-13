const cascadingSlotConstant = {
    multiplerSymbolIndex: 10,
    requiredBoardSymbols: 30,
    multiplierDefaultValue: 1,
    requiredIconToExploded: 8,
    notedMessage: "Total symbols: "
}

const cascadingSlotGameResultHelper = {
    calculateTotalSymbolInTumble: function (symbols) {
        return symbols.reduce((accumulator, curr) => accumulator + curr);
    },
    isBaseSpin: function (boardIndex) {
        return boardIndex === 0;
    },
    isMultiplierSymbol: function (id) {
        return id === cascadingSlotConstant.multiplerSymbolIndex;
    },
    generateRandom: function (min, max, exclude) {
        let random;
        while (!random) {
            const x = Math.floor(Math.random() * (max - min + 1)) + min;
            if (exclude.indexOf(x) === -1) {
                random = x;
            }
        }
        return random;
    },
    copyObject: function (data) {
        return JSON.parse(JSON.stringify(data));
    },
    shuffle: function (array) {
        let currentIndex = array.length, randomIndex;

        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
        }

        return array;
    },
    createBoard: function (matrix) {
        let numbers = [];
        let count = 0;
        let excludeNumbers = [];

        $.each(matrix, function (index) {
            let numberOfSymbol = matrix[index];

            count += numberOfSymbol;
            if (numberOfSymbol > 0) {
                excludeNumbers.push(index);
            }

            for (let i = numberOfSymbol; i > 0; i--) {
                numbers.push(index);
            }
        });

        const length = this.calculateTotalSymbolInTumble(matrix);
        for (let i = length - count; i > 0; i--) {
            numbers.push(this.generateRandom(0, multiplerSymbolIndex, excludeNumbers));
        }

        return this.shuffle(numbers);
    },
    calculateNumberOfMultiplier: function (postData, numberOfMuliplier, tumbleNo) {
        let actualNumberOfMuliplier = 0;

        switch (tumbleNo) {
            case 0:
                actualNumberOfMuliplier = numberOfMuliplier;
                break;
            case 1:
                actualNumberOfMuliplier = numberOfMuliplier - postData.result.base.multipliers.length;
                break;
            default:
                var totalMultiplierInTumbles = 0;
                var tumbleNoCount = 0;
                postData.result.tumbles.forEach(function (tumble) {
                    if (tumbleNoCount < tumbleNo) {
                        totalMultiplierInTumbles += tumble.multipliers.length;
                    }

                    tumbleNoCount++;
                });

                actualNumberOfMuliplier = numberOfMuliplier - postData.result.base.multipliers.length - totalMultiplierInTumbles;
                break;
        }

        return actualNumberOfMuliplier;
    },
    getPreviousTotalMultipliers: function (postData, tumbleNo) {
        switch (tumbleNo) {
            case 0:
                return [];
            case 1:
                return postData.result.base.multipliers;
            default:
                var tumbleNoCount = 0;
                var totalMultipliers = this.copyObject(postData.result.base.multipliers);
                postData.result.tumbles.forEach(function (tumble) {
                    if (tumbleNoCount < tumbleNo) {
                        totalMultipliers = totalMultipliers.concat(tumble.multipliers);
                    }

                    tumbleNoCount++;
                });

                return totalMultipliers;
        }
    },
    assignMultiplierToPostData: function (postData, boardIndex, multipliers) {
        if (this.isBaseSpin(boardIndex)) {
            postData.result.base.multipliers = multipliers;
        }
        else {
            postData.result.tumbles[boardIndex - 1].multipliers = multipliers;
        }

        return postData;
    },
    assignPostData: function (postData, globalBoardIndex) {
        if (this.isBaseSpin(globalBoardIndex)) {
            postData.result.base = {
                board: [],
                multipliers: []
            }
        }
        else {
            postData.result.tumbles.push({
                newSymbols: [],
                multipliers: []
            });
        }

        return postData;
    },
    initialSymbols: function () {
        let symbols = {};
        for (let i = 0; i <= cascadingSlotConstant.multiplerSymbolIndex; i++) {
            symbols["Item-" + i] = 0;
        }
        return symbols;
    }
}