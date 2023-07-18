using GamesAdminMonitoring.Site.Enumeration;

namespace GamesAdminMonitoring.Site.Features.ResultMonitor.ViewModels
{
    public class SlotResultViewModel
    {
        public SlotResultViewModel()
        {
        }

        public SlotResultViewModel(string name, string displayName)
        {
            GameName = name;
            DisplayGameName = displayName;
        }

        public string GameName { get; set; }

        public string DisplayGameName { get; set; }

        public string Nickname { get; set; }

        public string Results { get; set; }
    }
}