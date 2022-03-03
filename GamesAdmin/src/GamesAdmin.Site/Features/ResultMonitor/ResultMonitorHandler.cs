using GamesAdmin.Site.Features.ResultMonitor.Requests;
using GamesAdminMonitoring.Site.Features.ResultMonitor.Requests;
using GamesAdminMonitoring.Site.Features.ResultMonitor.ViewModels;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace GamesAdmin.Site.Features.ResultMonitor
{
    public class ResultMonitorHandler :
         IRequestHandler<VerifyTokenRequest, VerifyTokenViewModel>,
        IRequestHandler<SetSlotResultRequest, SettlementBoardViewModel>,
        IRequestHandler<SetCasinoHoldemPokerResultRequest, HoldemPokerResultControl>
    {
        private readonly IResultMonitorService service;

        public ResultMonitorHandler(IResultMonitorService service)
        {
            this.service = service;
        }

        public async Task<VerifyTokenViewModel> Handle(VerifyTokenRequest request, CancellationToken cancellationToken)
        => new VerifyTokenViewModel(await service.VerifyToken(request.Token), request.GameConfigName);

        public async Task<SettlementBoardViewModel> Handle(SetSlotResultRequest request, CancellationToken cancellationToken)
        {
            var settlementBoard = await service.SetSlotResult(request);

            return new SettlementBoardViewModel(request.GameConfigName, settlementBoard);
        }

        public async Task<HoldemPokerResultControl> Handle(SetCasinoHoldemPokerResultRequest request, CancellationToken cancellationToken)
        {
            return await service.SetCasinoHoldemPokerResult(request);
        }
    }
}