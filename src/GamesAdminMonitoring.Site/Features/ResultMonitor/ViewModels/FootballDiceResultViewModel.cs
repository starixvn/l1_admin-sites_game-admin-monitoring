using GamesAdminMonitoring.Site.Features.ResultMonitor.Requests;

namespace GamesAdminMonitoring.Site.Features.ResultMonitor.ViewModels
{
    public class BaccaratXResultViewModel
    {
        public BaccaratXResultViewModel()
        {

        }
        public BaccaratXResultViewModel(string gameConfigName, string displayName, bool enableMultiplier)
        {
            GameConfigName = gameConfigName;
            DisplayName = displayName;
            EnableMultiplier = enableMultiplier;
        }

        public string GameConfigName { get; set; }
        public string DisplayName { get; set; }
        public BaccaratXResult Result { get; set; }
        public bool EnableMultiplier { get; set; }
    }
}
