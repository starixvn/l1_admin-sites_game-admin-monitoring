namespace GamesAdminMonitoring.Site.Features.ResultMonitor.Requests
{
    public class VerifyTokenViewModel
    {
        public VerifyTokenViewModel(bool isValid, string gameConfigName)
        {
            IsValid = isValid;
            GameConfigName = gameConfigName;
        }

        public bool IsValid { get; }

        public string GameConfigName { get; }
    }
}