var cascadingSlotGameResult = (function () {
    return {
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

            $('#preloader').removeClass('hidden');
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
                },
                complete: function () {
                    $('#preloader').addClass('hidden');
                }
            });
        }
    };
})();
