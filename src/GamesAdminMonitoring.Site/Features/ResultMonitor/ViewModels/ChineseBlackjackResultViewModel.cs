using GamesAdminMonitoring.Site.Enumeration;

namespace GamesAdminMonitoring.Site.Features.ResultMonitor.ViewModels
{
    public class ChineseBlackjackResultViewModel
    {
        public string GameName = "chineseblackjack";

        public string DisplayGameName => Enumeration.Enumeration.FromValue<Game>(GameName).DisplayName;
    }
}
