var pontoonResult = (function () {
    var cardSuits = { "h": 0, "d": 1, "c": 2, "s": 3 };
    var ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
    var suits = [0,1,2,3];
    return {
        onInputNickname: function (event) {
            event.preventDefault();
            if (event.currentTarget.value !== "") {
                $('.error').addClass('hidden');
            }
        },

        onInputDealerCards: function (event) {
            event.preventDefault();
            if (event.currentTarget.value !== "") {
                $('#error-dealer').hide();
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
            $('#error-format').hide();
           
            var nickame = $("#nickname").val();
            var dealerVal = $("#dealer").val();
            if (nickame === "") {
                $('.error').removeClass('hidden');
                $("#spinner").hide();
                return;
            }

            if (dealerVal === "") {
                $('#error-dealer').show();
                $("#spinner").hide();
                return;
            }

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
            if (!this.validateDealerCards(data.dealer) || !this.validateHandsCards(data.hands)) {
                $('#error-format').show();
                $("#spinner").hide();
                return;
            }
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
            const dealer = [];
            if (data !== "") {
                const dealerCards = data.split(",");
                $.each(dealerCards, (_, card) => {
                    dealer.push(this.parseCard(card));
                });
            }        
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
            const rank = card.substr(0, card.length - 1).toUpperCase();
            const suit = card[card.length - 1];
            return { "rank": rank, "suit": cardSuits[suit] };
        },

        validateDealerCards: function (cards) {
            const isRank = cards.every(card => ranks.includes(card.rank));
            const isSuit = cards.every(card => suits.includes(card.suit));
            return isRank && isSuit;
        },

         validateHandsCards: function (data) {
             const isRank = data.every(item => {
                 return item.cards.every(card => ranks.includes(card.rank));
             });
             const isSuit = data.every(item => {
                 return item.cards.every(card => suits.includes(card.suit));
             });

            return isRank && isSuit;
        }
    };
})();
