using GamesAdminMonitoring.Site.Features.ResultMonitor.ViewModels;
using MediatR;

namespace GamesAdminMonitoring.Site.Features.ResultMonitor.Requests
{
    public class SetPontoonResultRequest : IRequest<bool>
    {
        public string name { get; set; }

        public BlackjackCard[] dealer { get; set; }

        public Hands[] hands { get; set; }
    }

    public class Hands
    {
        public byte pos { get; set; }

        public BlackjackCard[] cards { get; set; }
    }
}
