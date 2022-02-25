using GamesAdminMonitoring.Site.Features.ResultMonitor.ViewModels;
using MediatR;

namespace GamesAdminMonitoring.Site.Features.ResultMonitor.Requests
{
    public class SetHoldemPokerResultRequest : IRequest<HoldemPokerResultControl>
    {
        public string gameConfigName { get; set; }

        public string roundName { get; set; }

        public PokerCard[] player { get; set; }

        public PokerCard[] dealer { get; set; }

        public PokerCard[] communityCards { get; set; }
    }
}