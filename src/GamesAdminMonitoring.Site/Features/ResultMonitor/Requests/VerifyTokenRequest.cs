using GamesAdminMonitoring.Site.Features.ResultMonitor.ViewModels;
using MediatR;

namespace GamesAdminMonitoring.Site.Features.ResultMonitor.Requests
{
    public class VerifyTokenRequest : IRequest<VerifyTokenViewModel>
    {
        public VerifyTokenRequest(string token, string gameConfigName = "")
        {
            Token = token;
            GameConfigName = gameConfigName;
        }

        public string Token { get; }

        public string GameConfigName { get; }
    }
}