using System.Collections.Generic;
using System.Linq;
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
            if (appSettings.Env.ToLower().Equals(ProEnv))
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
            => Task.FromResult(new GameSettingsViewModel(request.Token, request.GameName, appSettings.GameServers));

        public async Task<SettlementCascadingSlotResultViewModel> Handle(SetCascadingSlotResultRequest request, CancellationToken cancellationToken)
        {
            var model = new List<SettlementCascadingSlotResultApi>
            {
                new SettlementCascadingSlotResultApi
                {
                    icons = new List<CascadingSlotIcon>
                    {
                        new CascadingSlotIcon
                        {
                            index= "9",
                            count = 8,
                            odds = 4
                        },
                         new CascadingSlotIcon
                        {
                            index= "8",
                            count = 8,
                            odds = 5
                        },
                    },
                    board = "4,5,9,3,9,10,9,9,9,9,5,3,1,4,10,9,5,9,2,3,2,5,7,9,2,1,1,6,3,7",
                    multipliers =  new  List<int>{ 1 },
                    freeSpinCount = 2
                },
                 new SettlementCascadingSlotResultApi
                {
                    icons = Enumerable.Empty<CascadingSlotIcon>(),
                    board = "4,5,9,3,9,10,9,9,9,9,5,3,1,4,10,9,5,9,2,3,2,5,7,9,2,1,1,6,3,7",
                    multipliers =  new  List<int>{ 1,2},
                    freeSpinCount = 3
                },
                new SettlementCascadingSlotResultApi
                {
                    icons = new List<CascadingSlotIcon>
                    {
                        new CascadingSlotIcon
                        {
                            index= "9",
                            count = 8,
                            odds = 4
                        },
                         new CascadingSlotIcon
                        {
                            index= "8",
                            count = 9,
                            odds = 5
                        },
                    },
                    board = "4,5,9,3,9,10,9,9,9,9,5,3,1,4,10,9,5,9,2,3,2,5,7,9,2,1,1,6,3,7",
                    multipliers =  new  List<int>{ 1,2,3},
                    freeSpinCount = 3
                }
            };

            return new SettlementCascadingSlotResultViewModel(request.gameConfigName, model, request.IsValid);
            //return new SettlementCascadingSlotResultViewModel(request.GameConfigName, request.ResultMatrixs, request.IsValid);
        }
    }
}