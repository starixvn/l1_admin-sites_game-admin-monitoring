using GamesAdmin.Core.Models.SlotGame;
using GamesAdmin.Site.Features.ResultMonitor.Requests;
using GamesAdminMonitoring.Site.Features._Shared;
using GamesAdminMonitoring.Site.Features.ResultMonitor.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Refit;
using System.Threading.Tasks;

namespace GamesAdmin.Site.Features.ResultMonitor
{
    public interface IResultMonitorApi : IBaseAuthorizationApi
    {
        [Post("/game_server/slot/set_board")]
        Task<SettlementBoard> SetSlotResult([FromBody] SetSlotResultRequest request);

        [Post("/game_server/casinoholdempoker/set_result")]
        Task<HoldemPokerResultControl> SetCasinoHoldemPokerResult([FromBody] SetCasinoHoldemPokerResultRequest request);

        [Post("/game_server/verify_admin_monitoring_token")]
        Task<bool> VerifyAdminMonitoringToken(string token);
    }

    public interface IResultMonitorService
    {
        Task<SettlementBoard> SetSlotResult(SetSlotResultRequest request);

        Task<HoldemPokerResultControl> SetCasinoHoldemPokerResult(SetCasinoHoldemPokerResultRequest request);

        Task<bool> VerifyToken(string token);
    }

    public class ResultMonitorService : IResultMonitorService
    {
        private readonly IResultMonitorApi api;

        public ResultMonitorService(IResultMonitorApi api)
        {
            this.api = api;
        }

        public async Task<bool> VerifyToken(string token)
        {
            return await api.VerifyAdminMonitoringToken(token);
        }

        public Task<SettlementBoard> SetSlotResult(SetSlotResultRequest request)
        => api.SetSlotResult(request);

        public Task<HoldemPokerResultControl> SetCasinoHoldemPokerResult(SetCasinoHoldemPokerResultRequest request)
      => api.SetCasinoHoldemPokerResult(request);
    }
}