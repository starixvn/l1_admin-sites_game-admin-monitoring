using GamesAdminMonitoring.Site.Enumeration;

namespace GamesAdminMonitoring.Site.Features.ResultMonitor.ViewModels
{
    public class PontoonResultViewModel
    {
        public string GameName = "pontoon";

        public string DisplayGameName => Enumeration.Enumeration.FromValue<Game>(GameName).DisplayName;
    }
}
