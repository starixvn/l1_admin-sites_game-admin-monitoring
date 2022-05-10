var cascadingSlotGameResult = (function () {
    var userNumberElements = document.querySelector('#result-container');
    var userNumberElementTemplate = document.querySelector('template');
    var index = 0;
    return {
        onInputNickname: function (event) {
            event.preventDefault();
            if (event.currentTarget.value !== "") {
                $('.error').addClass('hidden');
            }
        },
        addTumble: function () {
            var elementClone = userNumberElementTemplate.content.cloneNode(true);
            elementClone.querySelector('span').textContent = index === 0 ? 'Base Spin' : 'Tumbling ' + index;

            userNumberElements.appendChild(elementClone);
            index++;
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
                }
            })
        },
        submit: function (e) {
            try {
                e.preventDefault();

                var rawResults = [];
                var $this = this;

                $(".result-temp").each(function () {
                    var numbers = [];
                    var count = 0;
                    var excludeNumbers = [];

                    $(this).find('select[id^="Item"]').map(function () {
                        var itemNo = parseInt($(this).attr('data-no'));
                        var numberOfSymbol = parseInt($(this).val());

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

                    console.log(excludeNumbers);
                    rawResults.push(
                        {
                            Name: $(this).find('.attempt').text(),
                            Value: $this.shuffle(numbers).join(',')
                        });
                    console.log(rawResults);
                    console.log($this.shuffle(numbers));
                });

                var nickame = $("#Nickname").val();
                if (nickame === undefined || nickame === '') {
                    $('.error').removeClass('hidden');
                    return;
                }

                var data = {
                    roundName: nickame,
                    rawResults: rawResults,
                    gameConfigName: $("#GameName").val(),
                };

                $.ajax({
                    type: "POST",
                    url: "SetCascadingSlotResult",
                    data: data,
                    dataType: 'html',
                    success: function (response) {
                        $('#set-result').html(response);
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