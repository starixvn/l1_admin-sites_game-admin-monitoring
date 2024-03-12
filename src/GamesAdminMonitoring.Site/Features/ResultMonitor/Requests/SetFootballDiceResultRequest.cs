using MediatR;

namespace GamesAdminMonitoring.Site.Features.ResultMonitor.Requests
{
    public class SetFootballDiceResultRequest : IRequest<bool>
    {
        public SetFootballDiceResultRequest(FootballDiceResult result)
        {
            this.result = result;
        }

        public FootballDiceResult result { get; set; }
    }

    public class FootballDiceResult
    {
        public decimal[] home { get; set; }

        public decimal[] away { get; set; }
    }
}