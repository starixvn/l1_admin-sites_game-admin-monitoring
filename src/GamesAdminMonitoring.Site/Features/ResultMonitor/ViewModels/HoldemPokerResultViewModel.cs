using GamesAdminMonitoring.Site.Enumeration;

namespace GamesAdminMonitoring.Site.Features.ResultMonitor.ViewModels
{
    public class HoldemPokerResultViewModel
    {
        public HoldemPokerResultViewModel(string name)
        {
            GameName = name;
        }

        public string GameName { get; }

        public string DisplayGameName => Enumeration.Enumeration.FromValue<Game>(GameName).DisplayName;
    }
}