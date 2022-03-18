using GamesAdminMonitoring.Site._Shared.Configurations;
using Newtonsoft.Json.Serialization;
using System.Collections.Generic;

namespace GamesAdminMonitoring.Site.Features.ResultMonitor.ViewModels
{
    public class GameSettingsViewModel
    {
        public GameSettingsViewModel(string token, string gameName, List<GameServerConfigs> gameServers)
        {
            Token = token;
            GameName = gameName;
            GameServers = gameServers;
        }

        public string Token { get; }

        public string GameName { get; }

        public List<GameServerConfigs> GameServers { get; }
    }

    public class LowercaseNamingStrategy : NamingStrategy
    {
        protected override string ResolvePropertyName(string name)
        {
            return name.ToLowerInvariant();
        }
    }
}