using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using GamesAdminMonitoring.Site._Shared.Configurations;
using GamesAdminMonitoring.Site.Features.ResultMonitor.Requests;
using GamesAdminMonitoring.Site.Features.ResultMonitor.ViewModels;
using MediatR;

namespace GamesAdmin.Site.Features.ResultMonitor
{
    public class ResultMonitorHandler :
        IRequestHandler<VerifyTokenRequest, VerifyTokenViewModel>,
        IRequestHandler<SetSlotResultRequest, SettlementBoardViewModel>,
        IRequestHandler<SetHoldemPokerResultRequest, HoldemPokerResultControl>,
        IRequestHandler<SetHiLoResultRequest, IEnumerable<HiloCard>>,
        IRequestHandler<GameSettingsRequest, GameSettingsViewModel>,
        IRequestHandler<SetCascadingSlotResultRequest, SettlementCascadingSlotResultViewModel>
    {
        private readonly IResultMonitorService service;
        private readonly IAppSettings appSettings;
        private const string ProEnv = "pro";

        public ResultMonitorHandler(IResultMonitorService service, IAppSettings appSettings)
        {
            this.service = service;
            this.appSettings = appSettings;
        }

        public async Task<VerifyTokenViewModel> Handle(VerifyTokenRequest request, CancellationToken cancellationToken)
        {
            if (appSettings.Env.ToLowerInvariant().Equals(ProEnv))
            {
                return new VerifyTokenViewModel(VerifyTokenMessage.CannotSetResultOnPro, request.GameConfigName);
            }

            return new VerifyTokenViewModel(await service.VerifyToken(request.Token) ? VerifyTokenMessage.ValidToken : VerifyTokenMessage.InvalidToken, request.GameConfigName);
        }

        public async Task<SettlementBoardViewModel> Handle(SetSlotResultRequest request, CancellationToken cancellationToken)
            => new SettlementBoardViewModel(request.GameConfigName, await service.SetSlotResult(request));

        public async Task<HoldemPokerResultControl> Handle(SetHoldemPokerResultRequest request, CancellationToken cancellationToken)
            => await service.SetHoldemPokerResult(request);

        public async Task<IEnumerable<HiloCard>> Handle(SetHiLoResultRequest request, CancellationToken cancellationToken)
            => await service.SetHiLoResult(request);

        public Task<GameSettingsViewModel> Handle(GameSettingsRequest request, CancellationToken cancellationToken)
            => Task.FromResult(new GameSettingsViewModel(request.Token, request.GameName));

        public async Task<SettlementCascadingSlotResultViewModel> Handle(SetCascadingSlotResultRequest request, CancellationToken cancellationToken)
            => new SettlementCascadingSlotResultViewModel(request.gameConfigName, await service.SetCascadingSlotResult(request), request.IsValid);
    }
}