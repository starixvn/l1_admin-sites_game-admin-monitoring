const baccaratx = (function () {
    const suitMapper = { h: 0, d: 1, c: 2, s: 3 };
    const getCard = (card) => {
        const trimmedCard = card.replaceAll(' ', '');
        return {
            rank: trimmedCard.slice(0, -1) - 1,
            suit: suitMapper[trimmedCard.slice(-1)]
        }
    }
    const cardPattern = /[1-9][hscd]|1[0-3][hscd]/;
    return {
        submit: function (e) {
            e.preventDefault();
            const rawCards = $("#cards").val().split(',')

            if (rawCards != '' && rawCards.some(c => !cardPattern.test(c))) {
                alert(`Result cards is invalid`)

                return
            }

            const cards = rawCards.map(c => getCard(c));
            const luckyCards = [];
            const cutCardIndex = +$("#cutCardIndex").val();

            if (cutCardIndex && cutCardIndex < 0) {
                alert(`Cut card index is invalid`)

                return
            }


            if ($("#EnableMultiplier").val() === "true") {
                for (let i = 0; i < 8; i++) {
                    const rawCard = $(`#cards${i}`).val();
                    const mul = +$(`#multiplier${i}`).val();

                    if (rawCard && mul && cardPattern.test(rawCard)) {
                        luckyCards.push({ ...getCard(rawCard), value: mul })
                    } else {
                        alert(`Lucky card #${i + 1} is invalid`)
                        return
                    }
                }
            }

            const data = {
                GameConfigName: $("#GameConfigName").val(),
                displayName: $("#GameConfigName").val(),
                result: {
                    cards,
                    luckyCards,
                    cutCardIndex
                }
             
            };

            $.ajax({
                type: "POST",
                url: "SetBaccaratXResult",
                data: data,
                dataType: 'html',
                success: function (response) {
                    $('#modal').modal('show');
                    $('.modal-body').html(response ? "Successful" : "Internal Server Error");
                }
            });
        }
    };
})();
