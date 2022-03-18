using GamesAdminMonitoring.Site.Features.ResultMonitor.ViewModels;
using MediatR;

namespace GamesAdminMonitoring.Site.Features.ResultMonitor.Requests
{
    public class GameSettingsRequest : IRequest<GameSettingsViewModel>
    {
        public GameSettingsRequest(string token, string gameName)
        {
            Token = token;
            GameName = gameName;
        }

        public string Token { get; }

        public string GameName { get; }
    }
}