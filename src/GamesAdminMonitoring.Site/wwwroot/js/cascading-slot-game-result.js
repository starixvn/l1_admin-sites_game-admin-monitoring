const cascadingSlotGameResult = (function () {
    let globalBoardIndex = 0;
    let rawResults = [];
    const helper = cascadingSlotGameResultHelper;
    const constant = cascadingSlotConstant;

    let postData = {
        name: '',
        result: {
            base: {
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
            postData.name = nickname;

            const nicknameErrorElm = $(event.currentTarget).next();
            if (nickname !== "") {
                this.hideElm(nicknameErrorElm);
                const disableSubmitButton = rawResults.find(function (result) {
                    return helper.calculateTotalSymbolInTumble(Object.values(result.Value)) !== constant.requiredBoardSymbols;
                });

                this.monitorSubmitAndExportButton(disableSubmitButton);
            }
            else {
                this.displayElm(nicknameErrorElm);
                this.monitorSubmitAndExportButton(true);
            }

        },
        inputMultiplier: function (event, boardIndex) {
            event.preventDefault();
            let multipliers = [];
            $('#' + boardIndex + '.advance-mode .div-multipler:not(.pre-multipler) .input-multiplier').each(function () {
                let multiplierValue = parseInt($(this).val());
                if (isNaN(multiplierValue)) {
                    multiplierValue = constant.multiplierDefaultValue;
                    $(this).val(constant.multiplierDefaultValue);
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

            postData = helper.assignMultiplierToPostData(postData, boardIndex, multipliers);
        },
        addMultiplier: function (e) {
            e.preventDefault();
            this.changeNumberOfSymbol(e);
            const multiplierElm = $(e.currentTarget);

            multiplierElm.closest('.advance-mode').find('.div-multipler:not(.pre-multipler)').remove();

            const numberOfMuliplier = parseInt(multiplierElm.val());
            const boardIndex = parseInt(multiplierElm.closest('.advance-mode').attr("id"));
            const actualNumberOfMuliplier = helper.calculateNumberOfMultiplier(postData, numberOfMuliplier, boardIndex);

            const previousMultiplierLength = helper.getPreviousTotalMultipliers(postData, globalBoardIndex).length;

            let multiplierTmp = [];

            for (let i = 0; i < actualNumberOfMuliplier; i++) {
                multiplierTmp.push(constant.multiplierDefaultValue);
                const inputMultiplierHtml = '<div class="div-multipler"> <label>Multiplier ' + (previousMultiplierLength + i) + '</label> <input value="' + constant.multiplierDefaultValue + '" type="number" min="1" max="500" onchange="cascadingSlotGameResult.inputMultiplier(event,' + boardIndex + ')" class="input-multiplier" /></div>';
                multiplierElm.closest('.board-row').append(inputMultiplierHtml);
            }

            postData = helper.assignMultiplierToPostData(postData, boardIndex, multiplierTmp);
        },
        addRawDataToGlobalResult: function (symbols, tumbleName) {
            rawResults.push(
                {
                    Name: tumbleName,
                    Id: globalBoardIndex,
                    Value: symbols,
                    OriginSymbols: helper.copyObject(symbols),
                    AddedSymbols: helper.copyObject(symbols),
                    IsExploded: false,
                    ExplodedIcons: 0
                });
            globalBoardIndex++;
        },
        appendMultiplierInputHtml: function (symbolId, elementClone) {
            helper.getPreviousTotalMultipliers(postData, globalBoardIndex).forEach(function (boardIndex, index) {
                const readonlyMultiplierHtml = '<div class="div-multipler pre-multipler"><label>Multiplier ' + index + '</label> <input type="number" readonly disabled class="input-multiplier" value="' + boardIndex + '" /></div>';
                $(elementClone).find(symbolId).closest('.board-number-multipler').append(readonlyMultiplierHtml);
            });
        },
        adjustSymbolDropDownlist: function (elementClone, symbols) {
            const previousTumble = Object.values(rawResults[globalBoardIndex - 1].Value);

            for (let i = 0; i <= constant.multiplerSymbolIndex; i++) {
                const isMultipler = helper.isMultiplierSymbol(i);
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

            let symbols = helper.initialSymbols();

            if (!helper.isBaseSpin(globalBoardIndex)) {
                this.adjustSymbolDropDownlist(elementClone, symbols);
            }

            $(elementClone).find('.message').text(constant.notedMessage + helper.calculateTotalSymbolInTumble(Object.values(symbols))).removeClass('successfully hidden').addClass('error');
            resultContainer.appendChild(elementClone);

            this.addRawDataToGlobalResult(symbols, tumbleName);
            postData = helper.assignPostData(postData, globalBoardIndex);
        },
        removeDataWhenWrongInput: function (boardIndex) {
            rawResults = rawResults.filter(function (value, index) {
                return index <= boardIndex;
            });
            globalBoardIndex = boardIndex + 1;

            if (helper.isBaseSpin(boardIndex)) {
                postData.result.tumbles = [];
            }
            else {
                postData.result.tumbles = postData.result.tumbles.filter(function (value, index) {
                    return index < boardIndex;
                });
            }
        },
        removeHtmlWhenWrongInput: function (boardIndex) {
            $('.advance-mode').each(function (index, element) {
                if (parseInt($(element).attr("id")) > boardIndex) {
                    $(element).remove();
                }
            });
        },
        adjustWhenWrongInput: function (boardIndex) {
            this.removeHtmlWhenWrongInput(boardIndex);
            this.removeDataWhenWrongInput(boardIndex);
        },
        displayMessgeOnBoard: function (advanceModeElm, totalSymbol, boardIndex) {
            advanceModeElm.find('.message').text(constant.notedMessage + totalSymbol);
            if (totalSymbol === constant.requiredBoardSymbols) {
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
            this.switchEnableDisableButton(true, $('#add-tumble'));
        },
        switchEnableDisableButton: function (disabled, element) {
            disabled ?
                element.addClass('disabled').attr('disabled', true) :
                element.removeClass('disabled').removeAttr('disabled');
        },
        monitorSubmitAndExportButton: function (disabledButton) {
            this.switchEnableDisableButton(disabledButton || postData.name === '', $('#submit, #export-json-button'));
        },
        monitorAddTumbleButton: function () {
            const disabledAddTumbleButton = rawResults.filter(function (tumble) {
                return !tumble.IsExploded;
            }).length > 0;

            this.switchEnableDisableButton(disabledAddTumbleButton, $('#add-tumble'));
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
                        if (value >= constant.requiredIconToExploded) {
                            result.ExplodedIcons += value;
                        }

                        const presetSymbolId = 'Item-' + index;
                        result.AddedSymbols[presetSymbolId] = boardIndex === 0 ? result.Value[presetSymbolId] : result.Value[presetSymbolId] - result.OriginSymbols[presetSymbolId];
                    });

                    if (helper.isBaseSpin(boardIndex)) {
                        postData.result.base.board = helper.createBoard(Object.values(rawResults[0].Value));
                    }
                    else {
                        postData.result.tumbles[boardIndex - 1].newSymbols = helper.createBoard(Object.values(rawResults[boardIndex].AddedSymbols));
                    }

                    result.IsExploded = totalSymbol === constant.requiredBoardSymbols && result.ExplodedIcons >= constant.requiredIconToExploded;

                    $this.displayMessgeOnBoard(advanceModeElm, totalSymbol, boardIndex);
                    $this.monitorAddTumbleButton();
                }
            });
        },
        displayElm: function (element) {
            element.removeClass('hidden');
        },
        hideElm: function (element) {
            element.addClass('hidden');
        },
        submit: function (e) {
            e.preventDefault();

            if (postData.name === undefined || postData.name === '') {
                this.displayElm($('.error'));
                return;
            }

            var $this = this;
            this.displayElm($('#preloader'));
            $.ajax({
                type: "POST",
                url: "SetCascadingSlotResult",
                data: { data: JSON.stringify(postData) },
                dataType: 'html',
                success: function (response) {
                    $('#set-result').html(response);
                },
                complete: function () {
                    $this.hideElm($('#preloader'));
                }
            });
        },
        importTemplateResults: function (e) {
            e.preventDefault();

            this.displayElm($('#preloader'));
            let formData = new FormData();
            const excelFiles = document.getElementById('file').files;
            for (let i = 0; i < excelFiles.length; i++) {
                formData.append('file', excelFiles[i]);
            }
            var $this = this;
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
                    $this.hideElm($('#preloader'));
                }
            })
        },
        exportResultJsonFile: function (e) {
            e.preventDefault();
            if (postData.name === undefined || postData.name === '') {
                this.displayElm($('.error'));
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