using GamesAdminMonitoring.Site.Features.ResultMonitor.ViewModels;
using MediatR;

namespace GamesAdmin.Site.Features.ResultMonitor.Requests
{
    public class SetCasinoHoldemPokerResultRequest : IRequest<HoldemPokerResultControl>
    {
        public string roundName { get; set; }

        public PokerCard[] player { get; set; }

        public PokerCard[] dealer { get; set; }

        public PokerCard[] communityCards { get; set; }
    }
}