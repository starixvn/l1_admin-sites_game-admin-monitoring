var cascadingSlotGameResult = (function () {
    var rowId = 0;

    var isValidNickname = false;
    var isValidTumble = false;

    var rawResults = [];

    var postData = {
        nickname: '',
        result: {
            baseSpin: {
                board: [],
                multiplier: []
            },
            tumbles: []
        },
        gameConfigName: $("#GameName").val()
    };
    return {
        onInputNickname: function (event) {
            event.preventDefault();
            if (event.currentTarget.value !== "") {
                $('.error').addClass('hidden');
                isValidNickname = true;

                //if (isValidTumble) {
                //    $('.btn-submit').removeClass('disabled');
                //    $('.btn-submit').removeAttr('disabled');
                //}
                //else {
                //    $('.btn-submit').addClass('disabled');
                //    $('.btn-submit').attr('disabled', true);

                //}
                return;
            }

            isValidNickname = false;
            //$('.btn-submit').addClass('disabled');
            //$('.btn-submit').attr('disabled', true);
        },
        generateRandom: function (min, max, exclude) {
            let random;
            while (!random) {
                const x = Math.floor(Math.random() * (max - min + 1)) + min;
                if (exclude.indexOf(x) === -1) random = x;
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
            var numbers = [];
            var count = 0;
            var excludeNumbers = [];

            $.each(matrix, function (index) {
                var numberOfSymbol = matrix[index];

                count += numberOfSymbol;
                if (numberOfSymbol > 0) {
                    excludeNumbers.push(index);
                }

                for (var i = numberOfSymbol; i > 0; i--) {
                    numbers.push(index);
                }
            });

            var length = matrix.reduce((accumulator, curr) => accumulator + curr);
            for (var i = length - count; i > 0; i--) {
                numbers.push(this.generateRandom(0, 10, excludeNumbers));
            }

            return this.shuffle(numbers);
        },
        inputMultiplier: function (event, tumbleNo) {
            event.preventDefault();
            var multiplier = [];
            $('#' + tumbleNo + '.advance-mode .div-multipler:not(.pre-multipler) .input-multiplier').each(function () {
                multiplier.push(parseInt($(this).val()));
            });

            if (tumbleNo === 0) {
                postData.result.baseSpin.multiplier = multiplier;
            }
            else {
                postData.result.tumbles[tumbleNo - 1].multiplier = multiplier;
            }
        },
        addMultiplier: function (e) {
            e.preventDefault();
            this.changeNumberOfSymbol(e);
            var multiplierElm = $(e.currentTarget);

            multiplierElm.closest('.advance-mode').find('.div-multipler:not(.pre-multipler)').remove();

            var numberOfMuliplier = parseInt(multiplierElm.val());
            var tumbleNo = parseInt(multiplierElm.closest('.advance-mode').attr("id"));
            var actualNumberOfMuliplier = this.calculateNumberOfMultiplier(numberOfMuliplier, tumbleNo);

            for (var i = 0; i < actualNumberOfMuliplier; i++) {
                const inputMultiplierHtml = '<div class="div-multipler"> <input type="number" min="1" max="500" onchange="cascadingSlotGameResult.inputMultiplier(event,' + tumbleNo + ')" class="input-multiplier" /></div>';
                multiplierElm.closest('.board-row').append(inputMultiplierHtml);
            }
        },
        calculateNumberOfMultiplier: function (numberOfMuliplier, tumbleNo) {
            var actualNumberOfMuliplier = 0

            switch (tumbleNo) {
                case 0:
                    actualNumberOfMuliplier = numberOfMuliplier;
                    break;
                case 1:
                    actualNumberOfMuliplier = numberOfMuliplier - postData.result.baseSpin.multiplier.length;
                    break;
                default:
                    var totalMultiplierInTumbles = 0;
                    var tumbleNoCount = 0;
                    postData.result.tumbles.forEach(function (tumble) {
                        if (tumbleNoCount < tumbleNo) {
                            totalMultiplierInTumbles += tumble.multiplier.length;
                        }

                        tumbleNoCount++;
                    });

                    actualNumberOfMuliplier = numberOfMuliplier - postData.result.baseSpin.multiplier.length - totalMultiplierInTumbles;
                    break;
            }

            return actualNumberOfMuliplier;
        },

        getPreviousTotalMultipliers: function (tumbleNo) {
            switch (tumbleNo) {
                case 0:
                    return [];
                case 1:
                    return postData.result.baseSpin.multiplier;
                default:
                    var tumbleNoCount = 0;
                    var totalMultipliers = JSON.parse(JSON.stringify(postData.result.baseSpin.multiplier));
                    postData.result.tumbles.forEach(function (tumble) {
                        if (tumbleNoCount < tumbleNo) {
                            totalMultipliers = totalMultipliers.concat(tumble.multiplier);
                        }

                        tumbleNoCount++;
                    });

                    return totalMultipliers;
            }
        },
        disableAddTumbleButton: function () {
            $('#add-tumble').addClass('disabled');
            $('#add-tumble').attr('disabled', true);
        },
        initialIcons: function () {
            var icons = {};
            for (var i = 0; i <= 10; i++) {
                icons["Item-" + i] = 0;
            }
            return icons;
        },
        addTumble: function () {
            var resultContainer = document.querySelector('#result-container');
            var template = document.querySelector('template');

            this.disableAddTumbleButton();

            var elementClone = template.content.cloneNode(true);
            var tumbleName = rowId === 0 ? 'Base Spin' : 'Tumbling ' + rowId;
            elementClone.querySelector('span').textContent = tumbleName;
            $(elementClone).find('.advance-mode').attr("id", rowId);
            $(elementClone).find(':selected').attr("data-tumble-no", rowId);

            var $this = this;
            const requiredIcons = 30;
            var icons = this.initialIcons();

            if (rowId > 0) {
                var previousTumble = Object.values(rawResults[rowId - 1].Value);

                for (var i = 0; i <= 10; i++) {
                    var presetIcon = previousTumble[i] < 8 || i === 10 ? previousTumble[i] : 0;

                    var presetIconId = 'Item-' + i;
                    icons[presetIconId] = presetIcon;
                    $(elementClone).find('#' + presetIconId).val(presetIcon);

                    $(elementClone).find('#' + presetIconId).find("option:lt(" + presetIcon + ")").remove();

                    if (i === 10) {
                        $this.getPreviousTotalMultipliers(rowId).forEach(function (tumble) {
                            const readonlyMultiplierHtml = '<div class="div-multipler pre-multipler"> <input type="number" readonly disabled class="input-multiplier" value="' + tumble + '" /></div>';
                            $(elementClone).find('#' + presetIconId).closest('.board-number-multipler').append(readonlyMultiplierHtml);
                        });
                    }
                }
            }

            $(elementClone).find('.required-icons').text('Required Icons: ' + requiredIcons);
            $(elementClone).find('.message').text('Total Icons: ' + Object.values(icons).reduce((accumulator, curr) => accumulator + curr));
            $(elementClone).find('.message').removeClass('successfully hidden').addClass('error');
            resultContainer.appendChild(elementClone);

            rawResults.push(
                {
                    Name: tumbleName,
                    Id: rowId,
                    RequiredIcons: requiredIcons,
                    Value: icons,
                    OriginIcons: JSON.parse(JSON.stringify(icons)),
                    AddedIcons: JSON.parse(JSON.stringify(icons)),
                    MultiPlier: [],
                    IsExploded: false,
                    ExplodedIcons: 0
                });

            if (rowId === 0) {
                postData.result.baseSpin = {
                    board: [],
                    multiplier: []
                }
            }
            else {
                postData.result.tumbles.push({
                    newSymbols: [],
                    multiplier: []
                });
            }

            rowId++;
        },
        adjustDataWhenWrongInput: function (boardIndex) {
            rawResults = rawResults.filter(function (value, index) {
                return index <= boardIndex;
            });

            if (boardIndex === 0) {
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
        displayMessgeOnBoard: function (advanceModeElm, tumble, totalIcons, boardIndex) {
            advanceModeElm.find('.message').text('Total Icons: ' + totalIcons);
            if (totalIcons === tumble.RequiredIcons) {
                advanceModeElm.find('.message').removeClass('error hidden').addClass('successfully');
            }
            else {
                advanceModeElm.find('.message').removeClass('successfully hidden').addClass('error');
                this.adjustWhenWrongInput(boardIndex);
            }
        },
        monitorAddTumbleButton: function () {
            var disabledAddTumble = rawResults.filter(function (tumble) {
                return !tumble.IsExploded;
            }).length > 0;

            if (disabledAddTumble) {
                $('#add-tumble').addClass('disabled');
                $('#add-tumble').attr('disabled', true);

                //$('.btn-submit').addClass('disabled');
                //$('.btn-submit').attr('disabled', true);
            }
            else {
                $('#add-tumble').removeClass('disabled');
                $('#add-tumble').removeAttr('disabled');

                //if (isValidNickname) {
                //    $('.btn-submit').removeClass('disabled');
                //    $('.btn-submit').removeAttr('disabled');
                //}
                //else {
                //    $('.btn-submit').addClass('disabled');
                //    $('.btn-submit').attr('disabled', true);

                //}
            }
        },
        changeNumberOfSymbol: function (e) {
            var numberOfSymbol = parseInt($(e.currentTarget).val());
            var id = $(e.currentTarget).attr("id");
            var advanceModeElm = $(e.currentTarget).closest('.advance-mode');
            var boardIndex = parseInt(advanceModeElm.attr("id"));

            var $this = this;
            rawResults.find(function (tumble) {
                if (tumble.Id === boardIndex) {
                    tumble.Value[id] = numberOfSymbol;
                    tumble.ExplodedIcons = 0;
                    tumble.IsExploded = false;

                    var totalIcons = 0;
                    $.each(Object.values(rawResults[boardIndex].Value), function (index, value) {
                        if (value > 7) {
                            tumble.ExplodedIcons += value;
                        }

                        totalIcons += value;

                        var presetIconId = 'Item-' + index;
                        tumble.AddedIcons[presetIconId] = boardIndex === 0 ? tumble.Value[presetIconId] : tumble.Value[presetIconId] - tumble.OriginIcons[presetIconId];
                    });

                    if (boardIndex === 0) {
                        postData.result.baseSpin.board = $this.createBoard(Object.values(rawResults[0].Value));
                    }
                    else {
                        postData.result.tumbles[boardIndex - 1].newSymbols = $this.createBoard(Object.values(rawResults[boardIndex].AddedIcons));
                    }

                    tumble.IsExploded = totalIcons === tumble.RequiredIcons && tumble.ExplodedIcons > 7;

                    $this.displayMessgeOnBoard(advanceModeElm, tumble, totalIcons, boardIndex);
                    $this.monitorAddTumbleButton();
                }
            });
        },
        importTemplateResults: function (e) {
            e.preventDefault();
            var nickame = $("#Nickname").val();
            if (nickame === undefined || nickame === '') {
                $('.error').removeClass('hidden');
                return;
            }

            $('#preloader').removeClass('hidden');
            var formData = new FormData();
            var excelFiles = document.getElementById('file').files;
            for (var i = 0; i < excelFiles.length; i++) {
                formData.append('file', excelFiles[i]);
                formData.append('gameConfigName', $("#GameName").val());
                formData.append('nickame', nickame);
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
        submit: function (e) {
            try {
                e.preventDefault();

                var nickame = $("#Nickname").val();
                if (nickame === undefined || nickame === '') {
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
            }
            catch (err) {
                console.log(err);
            }
        }
    };
})();

$(document).ready(function () {
    cascadingSlotGameResult.addTumble();
}) 