using GamesAdmin.Site._Shared.Configurations;
using Newtonsoft.Json.Serialization;

namespace GamesAdminMonitoring.Site.Features.ResultMonitor.ViewModels
{
    public class GameSettingsViewModel
    {
        public GameSettingsViewModel(string token, string gameName, GameServerSettings gameServers)
        {
            Token = token;
            GameName = gameName;
            GameServers = gameServers;
        }

        public string Token { get; }

        public string GameName { get; }

        public GameServerSettings GameServers { get; }
    }

    public class LowercaseNamingStrategy : NamingStrategy
    {
        protected override string ResolvePropertyName(string name)
        {
            return name.ToLowerInvariant();
        }
    }
}