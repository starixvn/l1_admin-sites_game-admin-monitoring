using System.Collections.Generic;

namespace GamesAdminMonitoring.Site.Database
{
    public class BetLimit
    {
        public BetLimit(double minBet, double maxBet, Dictionary<string, double> maxBetChoices = null)
        {
            MinBet = minBet;
            MaxBet = maxBet;
            MaxBetChoices = maxBetChoices;
        }

        public double MinBet { get; }

        public double MaxBet { get; }

        public Dictionary<string, double> MaxBetChoices { get; }
    }
}