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
            $('#result-container').find('.add-tumble').remove();
            var elementClone = userNumberElementTemplate.content.cloneNode(true);
            elementClone.querySelector('span').textContent = index === 0 ? 'Base Spin' : 'Tumbling ' + index;

            userNumberElements.appendChild(elementClone);
            index++;
        },
        submit: function (e) {
            e.preventDefault();

            var rawResults = [];
            $(".result-temp").each(function (index) {
                var rawResult = $(this).find(".result-raw").val();
                if (rawResult !== '') {
                    rawResults.push(
                        {
                            Name: $(this).find(".attempt").text(),
                            Value: rawResult
                        });
                }
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
    };
})();

$(document).ready(function () {
    cascadingSlotGameResult.addTumble();
}) 