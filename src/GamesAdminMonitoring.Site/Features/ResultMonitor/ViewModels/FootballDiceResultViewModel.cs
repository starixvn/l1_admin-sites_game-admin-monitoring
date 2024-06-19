using GamesAdminMonitoring.Site.Features.ResultMonitor.Requests;

namespace GamesAdminMonitoring.Site.Features.ResultMonitor.ViewModels
{
    public class BaccaratXResultViewModel
    {
        public BaccaratXResultViewModel()
        {

        }
        public BaccaratXResultViewModel( string gameConfigName, string displayName)
        {
            GameConfigName = gameConfigName;
            DisplayName = displayName;
        }

        public string GameConfigName { get; set; }
        public string DisplayName { get; set; }
        public BaccaratXResult Result { get; set; }
    }
}
