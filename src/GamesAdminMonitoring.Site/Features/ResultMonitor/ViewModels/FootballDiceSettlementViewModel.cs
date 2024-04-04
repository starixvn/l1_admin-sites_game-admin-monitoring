namespace GamesAdminMonitoring.Site.Features.ResultMonitor.ViewModels
{
    public class FootballDiceSettlementViewModel
    {
        public FootballDiceSettlementViewModel(bool isSuccessful, int roundId)
        {
            RoundId = roundId;
            IsSuccessful = isSuccessful;
        }

        public int RoundId { get; set; }

        public bool IsSuccessful { get; set; }
    }
}