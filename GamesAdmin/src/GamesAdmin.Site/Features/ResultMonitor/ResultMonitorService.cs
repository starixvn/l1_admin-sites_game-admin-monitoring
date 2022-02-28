using GamesAdmin.Core.Models.SlotGame;
using GamesAdminMonitoring.Site.Enumeration;
using GamesAdminMonitoring.Site.Features.ResultMonitor.Requests;
using GamesAdminMonitoring.Site.Features.ResultMonitor.ViewModels;
using GamesAdminMonitoring.Site.GameSettings;
using Refit;
using Sentry;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace GamesAdminMonitoring.Site.Features.ResultMonitor
{
    [Headers("Authorization: Bearer")]
    public interface IUserApi
    {
        [Post("/users/validateJwtToken")]
        Task<bool> ValidateJwtToken(string token);
    }

    public interface IResultMonitorService
    {
        Task<SettlementBoard> SetSlotBoard(SetSlotBoardRequest request);

        Task<HoldemPokerResultControl> SetCasinoHoldemPokerResult(SetHoldemPokerResultRequest request);
    }

    public class ResultMonitorService : IResultMonitorService
    {
        private readonly IUserApi uerApi;
        private readonly IGameSettingsService gameSettingService;
        private readonly ISlotBoardApiFactory slotBoardApiFactory;
        private readonly IHoldemPokerApiFactory holdemPokerApiFactory;
        private readonly ISentryClient sentryClient;

        public ResultMonitorService(
            IUserApi uerApi,
            IGameSettingsService gameSettingService,
            ISlotBoardApiFactory slotBoardApiFactory,
            IHoldemPokerApiFactory holdemPokerApiFactory,
            ISentryClient sentryClient)
        {
            this.uerApi = uerApi;
            this.gameSettingService = gameSettingService;
            this.slotBoardApiFactory = slotBoardApiFactory;
            this.holdemPokerApiFactory = holdemPokerApiFactory;
            this.sentryClient = sentryClient;
        }

        public async Task<SettlementBoard> SetSlotBoard(SetSlotBoardRequest request)
        {
            try
            {
                var config = await gameSettingService.GetByName(request.GameConfigName);
                var isExcludeUUS = (config?.SlotsConfig?.Jackpot) != null && config.SlotsConfig.Jackpot.ExcludeUUS;

                if (await gameSettingService.IsAbleToSetSlotResult(request.Nickname, isExcludeUUS))
                {
                    var gameEnum = Enumeration.Enumeration.FromValue<Game>(request.GameConfigName);

                    var result = await slotBoardApiFactory.SetBoardApi(gameEnum).SetBoard(new SetSlotBoardServerRequest(request.Nickname, request.Results));
                    result.Result = request.Results.ToList();

                    return result;
                }
            }
            catch (Exception ex)
            {
                HandleException(ex);
            }

            return null;
        }

        public async Task<HoldemPokerResultControl> SetCasinoHoldemPokerResult(SetHoldemPokerResultRequest request)
        {
            try
            {
                var pokerApi = holdemPokerApiFactory.SetResultApi(Enumeration.Enumeration.FromValue<Game>(request.gameConfigName));
                var model = await pokerApi.SetResult(request);

                return new HoldemPokerResultControl
                {
                    playerResult = new HoldemPokerHandModel { Cards = request.player, CombinationCards = model.playerResult.Cards, Id = model.playerResult.Id },
                    dealerResult = new HoldemPokerHandModel { Cards = request.dealer, CombinationCards = model.dealerResult.Cards, Id = model.dealerResult.Id },
                    communityCards = request.communityCards,
                    isQualified = model.isQualified
                };
            }
            catch (Exception ex)
            {
                HandleException(ex);
                return null;
            }
        }

        private void HandleException(Exception ex, string title = null)
        {
            if (ex is ApiException apiEx)
            {
                sentryClient.CaptureMessage($"Request {apiEx.Uri} error: {apiEx.Message}");
            }

            if (!string.IsNullOrWhiteSpace(title))
            {
                sentryClient.CaptureMessage(title, Sentry.Protocol.SentryLevel.Error);
            }

            sentryClient.CaptureException(ex);
        }
    }
}