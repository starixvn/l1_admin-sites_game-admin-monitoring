using Newtonsoft.Json.Serialization;

namespace GamesAdminMonitoring.Site.Features.ResultMonitor.ViewModels
{
    public class GameSettingsViewModel
    {
        public GameSettingsViewModel(string token, string gameName)
        {
            Token = token;
            GameName = gameName;
        }

        public string Token { get; }

        public string GameName { get; }
    }

    public class LowercaseNamingStrategy : NamingStrategy
    {
        protected override string ResolvePropertyName(string name)
        {
            return name.ToLowerInvariant();
        }
    }
}