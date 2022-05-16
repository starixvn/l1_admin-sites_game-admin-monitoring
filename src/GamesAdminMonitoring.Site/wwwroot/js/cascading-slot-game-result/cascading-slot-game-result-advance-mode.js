var cascadingSlotGameResult = (function () {
    var resultContainer = document.querySelector('#result-container');
    var template = document.querySelector('template');
    var index = 0;

    var isValidNickname = false;
    var isValidTumble = false;

    var tumbleResults = [];
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


                var $this = this;

                //$(".advance-mode").each(function () {
                //    var numbers = [];
                //    var count = 0;
                //    var excludeNumbers = [];

                //    $(this).find('select[id^="Item"]').map(function () {
                //        var itemNo = parseInt($(this).attr('data-no'));
                //        var numberOfSymbol = parseInt($(this).val());

                //        count += numberOfSymbol;
                //        if (numberOfSymbol > 0) {
                //            excludeNumbers.push(itemNo);
                //        }

                //        for (var i = numberOfSymbol; i > 0; i--) {
                //            numbers.push(itemNo);
                //        }
                //    });

                //    for (var i = 30 - count; i > 0; i--) {
                //        numbers.push($this.generateRandom(0, 10, excludeNumbers));
                //    }

                //    var multipliers = [];
                //    $(this).find('.input-multiplier').map(function () {
                //        var multiplier = parseInt($(this).val());

                //        if (multiplier > 0) {
                //            multipliers.push(multiplier);
                //        }
                //    });


                //    rawResults.push(
                //        {
                //            Name: $(this).find('.attempt').text(),
                //            Value: $this.shuffle(numbers).join(','),
                //            MultiPlier: multipliers.join(',')
                //        });
                //});

                var nickame = $("#Nickname").val();
                //if (nickame === undefined || nickame === '') {
                //    $('.error').removeClass('hidden');
                //    return;
                //}

                //$('#preloader').removeClass('hidden');

                console.log(JSON.stringify(tumbleResults, null, 2));

                var rawResults = {
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

                $.each(tumbleResults, function (index, value) {
                    var multiplier = [];
                    $('#' + index + '.result-container').find('.input-multiplier').each(function () {
                        multiplier.push(parseInt($(this).val()));
                    });

                    if (index === 0) {
                        rawResults.result.baseSpin.board = $this.createBaseSpinBoard(Object.values(tumbleResults[0].Value));
                        rawResults.result.baseSpin.multiplier = multiplier;
                    }
                    else {
                        rawResults.result.tumbles.push({
                            newSymbols: Object.values(tumbleResults[index].AddedIcons),
                            multiplier
                        });
                    }
                });

                //var data = {
                //    roundName: nickame,
                //    rawResults: rawResults, 
                //    gameConfigName: $("#GameName").val(),
                //};

                //console.log(JSON.stringify(data, null, 2));

                //return;
                $.ajax({
                    type: "POST",
                    url: "SetCascadingSlotResult",
                    data: { data: JSON.stringify(rawResults) },
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

        },
        createBaseSpinBoard: function (matrix) {
            var numbers = [];
            var count = 0;
            var excludeNumbers = [];

            $.each(matrix, function (index, value) {
                var itemNo = index;
                var numberOfSymbol = matrix[index];

                count += numberOfSymbol;
                if (numberOfSymbol > 0) {
                    excludeNumbers.push(itemNo);
                }

                for (var i = numberOfSymbol; i > 0; i--) {
                    numbers.push(itemNo);
                }
            });

            for (var i = 30 - count; i > 0; i--) {
                numbers.push($this.generateRandom(0, 10, excludeNumbers));
            }

            return this.shuffle(numbers);
        },
        addMultiplier: function (e) {
            this.sumIcons(e);
            var numberOfMuliplier = parseInt($(e.currentTarget).val());
            $(e.currentTarget).parent().parent().find('.div-multipler').remove();
            for (var i = 0; i < numberOfMuliplier; i++) {
                $(e.currentTarget).parent().parent().append('<div class="div-multipler" style="display: inline-block; max-width:50px; margin-left: 5px;"> <input type="number" style="display: inline-block; max-width:50px" class="input-multiplier" /></div>');
            }
        },
        addTumble: function () {
            $('#add-tumble').addClass('disabled');
            $('#add-tumble').attr('disabled', true);

            $('#result-container').find('.add-tumble').remove();
            var elementClone = template.content.cloneNode(true);
            var tumbleName = index === 0 ? 'Base Spin' : 'Tumbling ' + index;
            elementClone.querySelector('span').textContent = tumbleName;
            $(elementClone).find('.result-container').attr("id", index);
            //elementClone.attr("id", index === 0 ? 'BaseSpin' : 'Tumbling ' + index);

            var requiredIcons = 30;
            var icons = {
                "Item-0": 0,
                "Item-1": 0,
                "Item-2": 0,
                "Item-3": 0,
                "Item-4": 0,
                "Item-5": 0,
                "Item-6": 0,
                "Item-7": 0,
                "Item-8": 0,
                "Item-9": 0,
                "Item-10": 0,
            };

            var addedIcons = JSON.parse(JSON.stringify(icons));
            if (index > 0) {
                requiredIcons = 30;//tumbleResults[index - 1].ExplodedIcons;

                var previousTumble = Object.values(tumbleResults[index - 1].Value);

                for (var i = 0; i <= 10; i++) {
                    var presetIcon = previousTumble[i] > 7 || i === 10 ? 0 : previousTumble[i];

                    var presetIconId = 'Item-' + i;
                    icons[presetIconId] = presetIcon;
                    $(elementClone).find('#' + presetIconId).val(presetIcon);

                    $(elementClone).find('#' + presetIconId).find("option:lt(" + presetIcon + ")").remove();

                    //for (var j = 0; j <= presetIcon; j++) {
                    //    $(elementClone).find('Item-' + j).remove();
                    //}
                }
                //icons = {
                //    "Item-0": previousTumble[0] > 7 ? 0 : previousTumble[0],
                //    "Item-1": previousTumble[1] > 7 ? 0 : previousTumble[1],
                //    "Item-2": previousTumble[2] > 7 ? 0 : previousTumble[2],
                //    "Item-3": previousTumble[3] > 7 ? 0 : previousTumble[3],
                //    "Item-4": previousTumble[4] > 7 ? 0 : previousTumble[4],
                //    "Item-5": previousTumble[5] > 7 ? 0 : previousTumble[5],
                //    "Item-6": previousTumble[6] > 7 ? 0 : previousTumble[6],
                //    "Item-7": previousTumble[7] > 7 ? 0 : previousTumble[7],
                //    "Item-8": previousTumble[8] > 7 ? 0 : previousTumble[8],
                //    "Item-9": previousTumble[9] > 7 ? 0 : previousTumble[9],
                //    "Item-10": previousTumble[10] > 7 ? 0 : previousTumble[10],
                //}
            }

            $(elementClone).find('.required-icons').text('Required Icons: ' + requiredIcons);
            $(elementClone).find('.message').text('Total Icons: ' + Object.values(icons).reduce((accumulator, curr) => accumulator + curr));
            $(elementClone).find('.message').removeClass('successfully hidden').addClass('error');
            resultContainer.appendChild(elementClone);

            tumbleResults.push(
                {
                    Name: tumbleName,
                    RequiredIcons: requiredIcons,
                    Value: icons,
                    OriginIcons: JSON.parse(JSON.stringify(icons)),
                    AddedIcons: addedIcons,
                    MultiPlier: [],
                    IsValid: false,
                    ExplodedIcons: 0
                });

            index++;
        },
        sumIcons: function (e) {
            var numberOfSymbol = parseInt($(e.currentTarget).val());
            var id = $(e.currentTarget).attr("id");
            var advanceModeElm = $(e.currentTarget).parent().parent().parent()
            var name = advanceModeElm.parent().find('.attempt').text();

            var advanceModeId = advanceModeElm.attr("id");
            tumbleResults.find(function (tumble) {
                if (tumble.Name === name) {
                    tumble.Value[id] = numberOfSymbol;
                    tumble.ExplodedIcons = 0;
                    tumble.IsValid = false;

                    var totalIcons = 0;
                    $.each(Object.values(tumbleResults[advanceModeId].Value), function (index, value) {
                        if (value > 7) {
                            tumble.ExplodedIcons += value;
                        }
                        totalIcons += value;

                        var presetIconId = 'Item-' + index;
                        if (parseInt(advanceModeId) === 0) {
                            tumble.AddedIcons[presetIconId] = tumble.Value[presetIconId];
                        }
                        else {
                            tumble.AddedIcons[presetIconId] = tumble.Value[presetIconId] - tumble.OriginIcons[presetIconId];
                        }
                    });

                    advanceModeElm.find('.message').text('Total Icons: ' + totalIcons);
                    if (totalIcons === tumble.RequiredIcons) {
                        advanceModeElm.find('.message').removeClass('error hidden').addClass('successfully');

                    }
                    else {
                        advanceModeElm.find('.message').removeClass('successfully hidden').addClass('error');
                    }

                    tumble.IsValid = totalIcons === tumble.RequiredIcons && tumble.ExplodedIcons > 7;
                    //if (parseInt(advanceModeId) === 0) {
                    //    //var totalIcons = Object.values(tumbleResults[0].Value).reduce((accumulator, curr) => accumulator + curr);

                    //}

                    var disabledAddTumble = tumbleResults.filter(function (tumble) {
                        return !tumble.IsValid;
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
                }
            });

            //console.log(JSON.stringify(tumbleResults, null, 2));
        }
    };
})();
