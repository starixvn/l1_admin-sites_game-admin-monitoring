using GamesAdminMonitoring.Site.Features.ResultMonitor.Requests;

namespace GamesAdminMonitoring.Site.Features.ResultMonitor.ViewModels
{
    public class FootballDiceResultViewModel
    {
        public FootballDiceResultViewModel()
        {

        }
        public FootballDiceResultViewModel(FootballDiceResult result)
        {
            Result = result;
        }
        public FootballDiceResult Result { get; set; }
    }
}
