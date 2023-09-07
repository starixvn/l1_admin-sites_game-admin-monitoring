using GamesAdminMonitoring.Site.Features.ResultMonitor.ViewModels;
using MediatR;

namespace GamesAdminMonitoring.Site.Features.ResultMonitor.Requests
{
    public class SetPontoonResultRequest : IRequest<bool>
    {
        public string name { get; set; }

        public PokerCard[] dealer { get; set; }

        public Hands[] hands { get; set; }
    }

    public class Hands
    {
        public string pos { get; set; }

        public PokerCard[] cards { get; set; }
    }
}
