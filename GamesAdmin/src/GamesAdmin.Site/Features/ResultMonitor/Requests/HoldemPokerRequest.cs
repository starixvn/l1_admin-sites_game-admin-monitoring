using MediatR;

namespace GamesAdminMonitoring.Site.Features.ResultMonitor.Requests
{
    public class HoldemPokerRequest : VerifyTokenRequest, IRequest<VerifyTokenViewModel>
    {
        public HoldemPokerRequest(string token, string gameConfigName)
            : base(token, gameConfigName)
        {
        }
    }
}