using GamesAdminMonitoring.Site.Enumeration;

namespace GamesAdminMonitoring.Site.Features.ResultMonitor.ViewModels
{
    public class SlotResultViewModel
    {
        public SlotResultViewModel()
        {
        }

        public SlotResultViewModel(string name)
        {
            GameName = name;
        }

        public string GameName { get; set; }

        public string DisplayGameName => Enumeration.Enumeration.FromValue<Game>(GameName).DisplayName;

        public string Nickname { get; set; }

        public string Results { get; set; }
    }
}