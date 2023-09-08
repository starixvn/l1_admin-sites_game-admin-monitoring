var pontoonResult = (function () {
    var cardSuits = { "h": 0, "d": 1, "c": 2, "s": 3 };
    return {
        onInputNickname: function (event) {
            event.preventDefault();
            if (event.currentTarget.value !== "") {
                $('.error').addClass('hidden');
            }
        },
    
        reset: function (e) {
            e.preventDefault();
            location.reload();
        },
        submit: function (e) {
            e.preventDefault();
            $('#success').hide();
            $('#fail').hide();
            $("#spinner").show();
            var nickame = $("#nickname").val();
            if (nickame === "") {
                $('.error').removeClass('hidden');
                $("#spinner").hide();
                return;
            }
            var dealerVal = $("#dealer").val();
            var hands = [];
            for (var i = 1; i <= 6; i++) {
                var handInput = $("#hand" + i).val();
                hands.push(handInput);
            }
            var data = {
                name: nickame,
                dealer: this.transformDealer(dealerVal),
                hands: this.transformHands(hands),
            };

            $.ajax({
                type: "POST",
                url: "SetPontoonResult",
                data: data,
                dataType: 'html',
            }).done(function (success) {
                $("#spinner").hide();
                if (success === "true") {
                    $('#success').show();
                } else {
                    $('#fail').show();
                }
            });
        },
        transformDealer: function (data) {
            const dealerCards = data.split(",");
            const dealer = [];
            $.each(dealerCards, (_, card) => {
                dealer.push(this.parseCard(card));
            });
            return dealer;
        }, 

        transformHands: function (data) {       
            const hands = [];
            $.each(data, (index, hand) => {
                if (hand !== "") {
                    const cardsArray = hand.split(",");
                    const cards = cardsArray.map(card => this.parseCard(card));              
                    hands.push({ "pos": index + 1, "cards": cards });
                }
                index++;
            });

            return hands;
        },

        parseCard: function (card) {
            const rank = card.slice(0, -1).toUpperCase();
            const suit = card.slice(-1);
            return { "rank": rank, "suit": cardSuits[suit] ?? 0 };
        }
    };
})();
