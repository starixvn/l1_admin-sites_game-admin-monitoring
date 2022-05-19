let cascadingSlotGameResult = (function () {
    let globalBoardIndex = 0;
    const multiplerSymbolIndex = 10;
    const requiredBoardSymbols = 30;
    const multiplierDefaultValue = 1;
    const notedMessage = "Total symbols: ";

    let rawResults = [];

    let postData = {
        nickname: '',
        result: {
            baseSpin: {
                board: [],
                multipliers: []
            },
            tumbles: []
        },
        gameConfigName: $("#GameName").val()
    };
    return {
        onInputNickname: function (event) {
            event.preventDefault();
            const nickname = event.currentTarget.value;
            postData.nickname = nickname;
            if (nickname !== "") {
                $('.error').addClass('hidden');
                const $this = this;
                const disableSubmitButton = rawResults.find(function (result, index) {
                    return $this.calculateTotalSymbolInTumble(Object.values(result.Value)) !== 30;
                });

                this.monitorSubmitAndExportButton(disableSubmitButton);
            }
            else {
                this.monitorSubmitAndExportButton(true);
            }

        },
        calculateTotalSymbolInTumble: function (symbols) {
            return symbols.reduce((accumulator, curr) => accumulator + curr);
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
        assignMultiplierToPostData: function (boardIndex, multipliers) {
            if (this.isBaseSpin(boardIndex)) {
                postData.result.baseSpin.multipliers = multipliers;
            }
            else {
                postData.result.tumbles[boardIndex - 1].multipliers = multipliers;
            }
        },
        inputMultiplier: function (event, boardIndex) {
            event.preventDefault();
            let multipliers = [];
            $('#' + boardIndex + '.advance-mode .div-multipler:not(.pre-multipler) .input-multiplier').each(function () {
                let multiplierValue = parseInt($(this).val());
                if (isNaN(multiplierValue)) {
                    multiplierValue = multiplierDefaultValue;
                    $(this).val(multiplierDefaultValue);
                }

                const max = parseInt($(this).attr('max'));
                const min = parseInt($(this).attr('min'));
                if (multiplierValue > max) {
                    $(this).val(max);
                    multiplierValue = max;
                }
                else if (multiplierValue < min) {
                    $(this).val(min);
                    multiplierValue = min;
                }

                multipliers.push(multiplierValue);
            });

            this.assignMultiplierToPostData(boardIndex, multipliers);

        },
        addMultiplier: function (e) {
            e.preventDefault();
            this.changeNumberOfSymbol(e);
            const multiplierElm = $(e.currentTarget);

            multiplierElm.closest('.advance-mode').find('.div-multipler:not(.pre-multipler)').remove();

            const numberOfMuliplier = parseInt(multiplierElm.val());
            const boardIndex = parseInt(multiplierElm.closest('.advance-mode').attr("id"));
            const actualNumberOfMuliplier = this.calculateNumberOfMultiplier(numberOfMuliplier, boardIndex);

            const previousMultiplierLength = this.getPreviousTotalMultipliers(globalBoardIndex).length;

            let multiplierTmp = [];

            for (let i = 0; i < actualNumberOfMuliplier; i++) {
                multiplierTmp.push(multiplierDefaultValue);
                const inputMultiplierHtml = '<div class="div-multipler"> <label>Multiplier ' + (previousMultiplierLength + i) + '</label> <input value="' + multiplierDefaultValue + '" type="number" min="1" max="500" onchange="cascadingSlotGameResult.inputMultiplier(event,' + boardIndex + ')" class="input-multiplier" /></div>';
                multiplierElm.closest('.board-row').append(inputMultiplierHtml);
            }

            this.assignMultiplierToPostData(boardIndex, multiplierTmp);
        },
        calculateNumberOfMultiplier: function (numberOfMuliplier, tumbleNo) {
            let actualNumberOfMuliplier = 0;

            switch (tumbleNo) {
                case 0:
                    actualNumberOfMuliplier = numberOfMuliplier;
                    break;
                case 1:
                    actualNumberOfMuliplier = numberOfMuliplier - postData.result.baseSpin.multipliers.length;
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

                    actualNumberOfMuliplier = numberOfMuliplier - postData.result.baseSpin.multipliers.length - totalMultiplierInTumbles;
                    break;
            }

            return actualNumberOfMuliplier;
        },

        getPreviousTotalMultipliers: function (tumbleNo) {
            switch (tumbleNo) {
                case 0:
                    return [];
                case 1:
                    return postData.result.baseSpin.multipliers;
                default:
                    var tumbleNoCount = 0;
                    var totalMultipliers = JSON.parse(JSON.stringify(postData.result.baseSpin.multipliers));
                    postData.result.tumbles.forEach(function (tumble) {
                        if (tumbleNoCount < tumbleNo) {
                            totalMultipliers = totalMultipliers.concat(tumble.multipliers);
                        }

                        tumbleNoCount++;
                    });

                    return totalMultipliers;
            }
        },

        initialSymbols: function () {
            let symbols = {};
            for (let i = 0; i <= multiplerSymbolIndex; i++) {
                symbols["Item-" + i] = 0;
            }
            return symbols;
        },
        isBaseSpin: function (boardIndex) {
            return boardIndex === 0;
        },
        assignPostData: function () {
            if (this.isBaseSpin(globalBoardIndex)) {
                postData.result.baseSpin = {
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
        },
        addRawDataToGlobalResult: function (symbols, tumbleName) {
            rawResults.push(
                {
                    Name: tumbleName,
                    Id: globalBoardIndex,
                    Value: symbols,
                    OriginSymbols: JSON.parse(JSON.stringify(symbols)),
                    AddedSymbols: JSON.parse(JSON.stringify(symbols)),
                    IsExploded: false,
                    ExplodedIcons: 0
                });
            globalBoardIndex++;
        },
        isMultiplierSymbol: function (id) {
            return id === multiplerSymbolIndex;
        },
        appendMultiplierInputHtml: function (symbolId, elementClone) {
            this.getPreviousTotalMultipliers(globalBoardIndex).forEach(function (boardIndex, index) {
                const readonlyMultiplierHtml = '<div class="div-multipler pre-multipler"><label>Multiplier ' + index + '</label> <input type="number" readonly disabled class="input-multiplier" value="' + boardIndex + '" /></div>';
                $(elementClone).find(symbolId).closest('.board-number-multipler').append(readonlyMultiplierHtml);
            });
        },
        adjustSymbolDropDownlist: function (elementClone, symbols) {
            const previousTumble = Object.values(rawResults[globalBoardIndex - 1].Value);

            for (let i = 0; i <= multiplerSymbolIndex; i++) {
                const isMultipler = this.isMultiplierSymbol(i);
                const symbolName = 'Item-' + i;
                const symbolId = '#' + symbolName;

                const numberOfSymbol = previousTumble[i] < 8 || isMultipler ? previousTumble[i] : 0;
                symbols[symbolName] = numberOfSymbol;

                $(elementClone).find(symbolId).val(numberOfSymbol);
                $(elementClone).find(symbolId).find("option:lt(" + numberOfSymbol + ")").remove();

                if (isMultipler) {
                    this.appendMultiplierInputHtml(symbolId, elementClone);
                }
            }
        },
        addTumble: function () {
            const resultContainer = document.querySelector('#result-container');
            const template = document.querySelector('template');

            this.disableAddTumbleButton();
            this.monitorSubmitAndExportButton(true);

            let elementClone = template.content.cloneNode(true);
            const tumbleName = globalBoardIndex === 0 ? 'Base Spin' : 'Tumbling ' + globalBoardIndex;
            elementClone.querySelector('span').textContent = tumbleName;
            $(elementClone).find('.advance-mode').attr("id", globalBoardIndex);
            $(elementClone).find(':selected').attr("data-tumble-no", globalBoardIndex);

            let symbols = this.initialSymbols();

            if (!this.isBaseSpin(globalBoardIndex)) {
                this.adjustSymbolDropDownlist(elementClone, symbols);
            }

            $(elementClone).find('.message').text(notedMessage + this.calculateTotalSymbolInTumble(Object.values(symbols)));
            $(elementClone).find('.message').removeClass('successfully hidden').addClass('error');
            resultContainer.appendChild(elementClone);

            this.addRawDataToGlobalResult(symbols, tumbleName);
            this.assignPostData();
        },
        adjustDataWhenWrongInput: function (boardIndex) {
            rawResults = rawResults.filter(function (value, index) {
                return index <= boardIndex;
            });
            globalBoardIndex = boardIndex + 1;

            if (this.isBaseSpin(boardIndex)) {
                postData.result.tumbles = [];
            }
            else {
                postData.result.tumbles = postData.result.tumbles.filter(function (value, index) {
                    return index < boardIndex;
                });
            }
        },
        adjustHtmlWhenWrongInput: function (boardIndex) {
            $('.advance-mode').each(function (index, element) {
                if (parseInt($(element).attr("id")) > boardIndex) {
                    $(element).remove();
                }
            });
        },
        adjustWhenWrongInput: function (boardIndex) {
            this.adjustHtmlWhenWrongInput(boardIndex);
            this.adjustDataWhenWrongInput(boardIndex);
        },
        displayMessgeOnBoard: function (advanceModeElm, totalSymbol, boardIndex) {
            advanceModeElm.find('.message').text(notedMessage + totalSymbol);
            if (totalSymbol === requiredBoardSymbols) {
                advanceModeElm.find('.message').removeClass('error hidden').addClass('successfully');
                this.monitorSubmitAndExportButton(false);
            }
            else {
                advanceModeElm.find('.message').removeClass('successfully hidden').addClass('error');
                this.monitorSubmitAndExportButton(true);
                this.adjustWhenWrongInput(boardIndex);
            }
        },
        disableAddTumbleButton: function () {
            $('#add-tumble').addClass('disabled');
            $('#add-tumble').attr('disabled', true);
        },
        monitorSubmitAndExportButton: function (disabledButton) {
            const submitElement = $('#submit, #export-json-button');
            disabledButton || postData.nickname === '' ? submitElement.addClass('disabled').attr('disabled', true) : submitElement.removeClass('disabled').removeAttr('disabled');
        },
        monitorAddTumbleButton: function () {
            const disabledAddTumbleButton = rawResults.filter(function (tumble) {
                return !tumble.IsExploded;
            }).length > 0;

            const addTumbelButton = $('#add-tumble');
            disabledAddTumbleButton ? addTumbelButton.addClass('disabled').attr('disabled', true) : addTumbelButton.removeClass('disabled').removeAttr('disabled');
        },
        changeNumberOfSymbol: function (e) {
            const symbolDropDownElm = $(e.currentTarget);
            const numberOfSymbol = parseInt(symbolDropDownElm.val());
            const symbolId = symbolDropDownElm.attr("id");
            let advanceModeElm = symbolDropDownElm.closest('.advance-mode');
            const boardIndex = parseInt(advanceModeElm.attr("id"));

            const $this = this;
            rawResults.find(function (result) {
                if (result.Id === boardIndex) {
                    result.Value[symbolId] = numberOfSymbol;
                    result.ExplodedIcons = 0;
                    result.IsExploded = false;

                    let totalSymbol = 0;
                    $.each(Object.values(rawResults[boardIndex].Value), function (index, value) {
                        totalSymbol += value;
                        if (value > 7) {
                            result.ExplodedIcons += value;
                        }

                        const presetSymbolId = 'Item-' + index;
                        result.AddedSymbols[presetSymbolId] = boardIndex === 0 ? result.Value[presetSymbolId] : result.Value[presetSymbolId] - result.OriginSymbols[presetSymbolId];
                    });

                    if ($this.isBaseSpin(boardIndex)) {
                        postData.result.baseSpin.board = $this.createBoard(Object.values(rawResults[0].Value));
                    }
                    else {
                        postData.result.tumbles[boardIndex - 1].newSymbols = $this.createBoard(Object.values(rawResults[boardIndex].AddedSymbols));
                    }

                    result.IsExploded = totalSymbol === requiredBoardSymbols && result.ExplodedIcons > 7;

                    $this.displayMessgeOnBoard(advanceModeElm, totalSymbol, boardIndex);
                    $this.monitorAddTumbleButton();
                }
            });
        },
        submit: function (e) {
            e.preventDefault();

            if (postData.nickname === undefined || postData.nickname === '') {
                $('.error').removeClass('hidden');
                return;
            }

            $('#preloader').removeClass('hidden');

            console.log(JSON.stringify(rawResults, null, 2));
            console.log(JSON.stringify(postData, null, 2));

            $.ajax({
                type: "POST",
                url: "SetCascadingSlotResult",
                data: { data: JSON.stringify(postData) },
                dataType: 'html',
                success: function (response) {
                    $('#set-result').html(response);
                },
                complete: function () {
                    $('#preloader').addClass('hidden');
                }
            });
        },
        importTemplateResults: function (e) {
            e.preventDefault();

            $('#preloader').removeClass('hidden');
            let formData = new FormData();
            const excelFiles = document.getElementById('file').files;
            for (let i = 0; i < excelFiles.length; i++) {
                formData.append('file', excelFiles[i]);
            }

            $.ajax({
                type: "POST",
                url: "ImportTemplateResults",
                data: formData,
                processData: false,
                contentType: false,
                dataType: 'html',
                success: function (response) {
                    $('#set-result').html(response);
                },
                error: function (err) {
                    console.log(err)
                },
                complete: function () {
                    $('#preloader').addClass('hidden');
                }
            })
        },
        exportResultJsonFile: function (e) {
            e.preventDefault();
            if (postData.nickname === undefined || postData.nickname === '') {
                $('.error').removeClass('hidden');
                return;
            }

            $('#jsonData').val(JSON.stringify(postData));
            $('#export-json').submit();
        }
    };
})();

$(document).ready(function () {
    cascadingSlotGameResult.addTumble();
})