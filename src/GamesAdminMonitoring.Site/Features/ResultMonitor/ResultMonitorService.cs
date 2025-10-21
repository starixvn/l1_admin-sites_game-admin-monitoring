using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text.Json.Nodes;
using System.Threading.Tasks;
using GamesAdmin.Core.Models.SlotGame;
using GamesAdminMonitoring.Site.Features._Shared;
using GamesAdminMonitoring.Site.Features.ResultMonitor.Requests;
using GamesAdminMonitoring.Site.Features.ResultMonitor.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Refit;

namespace GamesAdmin.Site.Features.ResultMonitor
{
    public interface IResultMonitorApi : IBaseAuthorizationApi
    {
        [Post("/game_server/slot/set_board")]
        Task<SettlementBoard> SetSlotResult([FromBody] SetSlotResultRequest request);

        [Post("/game_server/holdempoker/set_result")]
        Task<HoldemPokerResultControl> SetHoldemPokerResult([FromBody] SetHoldemPokerResultRequest request);

        [Post("/game_server/verify_admin_monitoring_token")]
        Task<bool> VerifyAdminMonitoringToken(string token);

        [Post("/game_server/hilo/set_result")]
        Task<IEnumerable<HiloCard>> SetHiLoResult([FromBody] SetHiLoResultRequest request);

        [Post("/game_server/cascadingslot/set_result")]
        Task<IEnumerable<SettlementCascadingSlotResult>> SetCascadingSlotResult([FromBody] SetCascadingSlotResultRequest request);

        [Post("/game_server/pontoon/set_result")]
        Task<bool> SetPontoonResult([FromBody] SetPontoonResultRequest request);

        [Post("/game_server/crashgame/set_result")]
        Task<bool> SetCrashGameResult([FromBody] SetCrashGameResultRequest request);

        [Post("/game_server/chineseblackjack/set_result")]
        Task<bool> SetChineseBlackjackResult([FromBody] SetChineseBlackjackResultRequest request);

        [Post("/game_server/footballdice/set_result")]
        Task<FootballDiceSettlementViewModel> SetFootballDiceResult([FromBody] SetFootballDiceResultRequest request);

        [Post("/game_server/baccaratx/set_result")]
        Task<bool> SetBaccaratXResult([FromBody] SetBaccaratXResultRequest request);

        [Post("/game_server/crashturnbase/set_result")]
        Task<bool> SetCrashTurnBaseResultRequest([FromBody] SetCrashTurnBaseResultRequest request);

        [Post("/game_server/cascadingclusterslot/set_result")]
        Task<JsonNode> SetCascadingClusterSlotResult([FromBody] SetCascadingClusterSlotRequest request);
    }

    public interface IResultMonitorService
    {
        Task<SettlementBoard> SetSlotResult(SetSlotResultRequest request);

        Task<HoldemPokerResultControl> SetHoldemPokerResult(SetHoldemPokerResultRequest request);

        Task<bool> VerifyToken(string token);

        Task<IEnumerable<HiloCard>> SetHiLoResult(SetHiLoResultRequest request);

        Task<IEnumerable<SettlementCascadingSlotResult>> SetCascadingSlotResult(SetCascadingSlotResultRequest request);

        Task<bool> SetPontoonResult(SetPontoonResultRequest request);

        Task<bool> SetCrashGameResult(SetCrashGameResultRequest request);

        Task<bool> SetChineseBlackjackResult(SetChineseBlackjackResultRequest request);

        Task<FootballDiceSettlementViewModel> SetFootballDiceResult([FromBody] SetFootballDiceResultRequest request);

        Task<bool> SetBaccaratXResult([FromBody] SetBaccaratXResultRequest request);

        Task<bool> SetCrashTurnBaseResult(SetCrashTurnBaseResultRequest request);

        Task<JsonNode> SetCascadingClusterSlotResult(SetCascadingClusterSlotRequest request);
    }

    public class ResultMonitorService : IResultMonitorService
    {
        private readonly IResultMonitorApi api;
        private readonly ILogger<ResultMonitorService> logger;

        public ResultMonitorService(IResultMonitorApi api, ILogger<ResultMonitorService> logger)
        {
            this.api = api;
            this.logger = logger;
        }

        public async Task<bool> VerifyToken(string token)
            => await api.VerifyAdminMonitoringToken(token);

        public async Task<SettlementBoard> SetSlotResult(SetSlotResultRequest request)
            => await api.SetSlotResult(request);

        public async Task<HoldemPokerResultControl> SetHoldemPokerResult(SetHoldemPokerResultRequest request)
            => await api.SetHoldemPokerResult(request);

        public Task<IEnumerable<HiloCard>> SetHiLoResult(SetHiLoResultRequest request)
            => api.SetHiLoResult(request);

        public Task<IEnumerable<SettlementCascadingSlotResult>> SetCascadingSlotResult(SetCascadingSlotResultRequest request)
            => api.SetCascadingSlotResult(request);

        public async Task<bool> SetPontoonResult(SetPontoonResultRequest request)
           => await api.SetPontoonResult(request);

        public async Task<bool> SetCrashGameResult(SetCrashGameResultRequest request)
           => await api.SetCrashGameResult(request);

        public async Task<bool> SetChineseBlackjackResult(SetChineseBlackjackResultRequest request)
            => await api.SetChineseBlackjackResult(request);

        public async Task<FootballDiceSettlementViewModel> SetFootballDiceResult(SetFootballDiceResultRequest request)
            => await api.SetFootballDiceResult(request);

        public async Task<bool> SetBaccaratXResult(SetBaccaratXResultRequest request)
             => await api.SetBaccaratXResult(request);

        public async Task<bool> SetCrashTurnBaseResult(SetCrashTurnBaseResultRequest request)
           => await api.SetCrashTurnBaseResultRequest(request);

        public async Task<JsonNode> SetCascadingClusterSlotResult(SetCascadingClusterSlotRequest request)
        {
            try
            {
                return await api.SetCascadingClusterSlotResult(request);
            }
            catch (ApiException ex)
            {
                logger.LogError("Refit API Error - StatusCode: {StatusCode}, ReasonPhrase: {ReasonPhrase}, Message: {Message}",
                    ex.StatusCode, ex.ReasonPhrase, ex.Message);
                throw;
            }
        }
    }
}