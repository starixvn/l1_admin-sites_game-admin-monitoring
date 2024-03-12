namespace GamesAdminMonitoring.Site.Features.ResultMonitor.ViewModels
{
    public class FootballDiceResultControl
    {
        public FootballDiceResultControl(bool isSuccessful)
        {
            IsSucessful = isSuccessful;
        }

        public bool IsSucessful { get; }
    }
}
