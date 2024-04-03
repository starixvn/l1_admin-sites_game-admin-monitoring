namespace GamesAdminMonitoring.Site.Features.ResultMonitor.ViewModels
{
    public class FootballDiceSettlementViewModel
    {
        public FootballDiceSettlementViewModel(bool isSuccessful, byte? roundId)
        {
            RoundId = roundId;
            IsSuccessful = isSuccessful;
        }

        public byte? RoundId { get; set; }

        public bool IsSuccessful { get; set; }
    }
}