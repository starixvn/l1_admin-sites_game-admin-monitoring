namespace GamesAdminMonitoring.Site.Features.ResultMonitor.ViewModels
{
    public class CrashTurnBaseReusltViewModel
    {
        public CrashTurnBaseReusltViewModel()
        {
           
        }
        public CrashTurnBaseReusltViewModel(string name, string displayName, string nickName)
        {
            GameName = name;
            DisplayGameName = displayName;
            Nickname = nickName;
        }

        public string GameName { get; set; }

        public string DisplayGameName { get; set; }

        public float Result { get; set; }

        public string Nickname { get; set; }
    }
}
