using GamesAdminMonitoring.Site.Features.ResultMonitor.Requests;
using GamesAdminMonitoring.Site.Features.ResultMonitor.ViewModels;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace GamesAdminMonitoring.Site.Features.ResultMonitor
{
    public class ResultMonitorHandler :
        IRequestHandler<SetSlotBoardRequest, SettlementBoardViewModel>,
        IRequestHandler<SetHoldemPokerResultRequest, HoldemPokerResultControl>
    {
        private readonly IResultMonitorService service;

        public ResultMonitorHandler(IResultMonitorService service)
        {
            this.service = service;
        }

        public async Task<SettlementBoardViewModel> Handle(SetSlotBoardRequest request, CancellationToken cancellationToken)
            => new SettlementBoardViewModel(request.GameConfigName, await service.SetSlotBoard(request));

        public async Task<HoldemPokerResultControl> Handle(SetHoldemPokerResultRequest request, CancellationToken cancellationToken)
            => await service.SetCasinoHoldemPokerResult(request);
    }
}