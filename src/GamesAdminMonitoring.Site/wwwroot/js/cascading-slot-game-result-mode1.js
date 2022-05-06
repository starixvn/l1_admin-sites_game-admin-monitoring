var cascadingSlotGameResult = (function () {
    var userNumberElements = document.querySelector('#result-container');
    var userNumberElementTemplate = document.querySelector('template');
    var index = 0;
    return {
        addTumble: function () {
            var elementClone = userNumberElementTemplate.content.cloneNode(true);
            elementClone.querySelector('span').textContent = index === 0 ? 'Base Spin' : 'Tumbling ' + index;

            userNumberElements.appendChild(elementClone);
            index++;
        },
        submit: function (e) {
            e.preventDefault();

            var rawResults = [];
            $(".result-raw").each(function (index) {
                var rawResult = $(this).val();
                if (rawResult !== '') {
                    rawResults.push(rawResult);
                }
            });

            var nickame = $("#nickname").val();
            if (nickame === "") {
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