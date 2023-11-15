namespace GamesAdminMonitoring.Site.Features.ResultMonitor.ViewModels
{
    public class CrashGameResultViewModel
    {
        public CrashGameResultViewModel()
        {
           
        }
        public CrashGameResultViewModel(string name, string displayName)
        {
            GameName = name;
            DisplayGameName = displayName;
        }

        public string GameName { get; set; }

        public string DisplayGameName { get; set; }

        public float Result { get; set; }
    }
}
