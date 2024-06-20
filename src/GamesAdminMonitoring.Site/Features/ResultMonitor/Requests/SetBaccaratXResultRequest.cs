using GamesAdminMonitoring.Site.Features.ResultMonitor.ViewModels;
using MediatR;

namespace GamesAdminMonitoring.Site.Features.ResultMonitor.Requests
{
    public class SetBaccaratXResultRequest : IRequest<bool>
    {
        public SetBaccaratXResultRequest(BaccaratXResult result, string gameConfigName)
        {
            this.result = result;
            this.gameConfigName = gameConfigName;
        }

        public string gameConfigName { get; set; }
        public BaccaratXResult result { get; set; }
    }

    public class BaccaratXResult
    {
        public PokerCard[] cards { get; set; }

        public byte cutCardIndex { get; set; }

        public LuckyCard[] luckyCards { get; set; }
    }

    public class LuckyCard : PokerCard
    {
        public byte value { get; set; }
    }
}