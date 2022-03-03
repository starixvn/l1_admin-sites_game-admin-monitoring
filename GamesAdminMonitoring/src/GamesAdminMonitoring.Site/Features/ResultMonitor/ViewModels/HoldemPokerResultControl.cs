using System.Collections.Generic;

namespace GamesAdminMonitoring.Site.Features.ResultMonitor.ViewModels
{
    public class BaseCasinoHoldemPokerResultControl
    {
        public HoldemPokerHandModel playerResult { get; set; }

        public HoldemPokerHandModel dealerResult { get; set; }

        public bool isQualified { get; set; }
    }

    public class HoldemPokerResultControl : BaseCasinoHoldemPokerResultControl
    {
        public IEnumerable<PokerCard> communityCards { get; set; }
    }

    public class HoldemPokerHandModel
    {
        private readonly string[] RankHandName = {
                        "Does Not Qualify",
                        "High Card",
                        "Pair",
                        "Two Pair",
                        "Three Of A Kind",
                        "Straight",
                        "Flush",
                        "Full House",
                        "Four Of A Kind",
                        "Straight Flush",
                        "Royal Flush",
                    };

        public int Id { get; set; }

        public IEnumerable<PokerCard> Cards { get; set; }

        public IEnumerable<PokerCard> CombinationCards { get; set; }

        public string Rank => RankHandName[Id];
    }

    public class PokerCard
    {
        public byte rank { get; set; }

        public byte suit { get; set; }
    }
}