using GamesAdmin.Core.IdentityServer;
using GamesAdminMonitoring.Site._Shared.Configurations;
using GamesAdminMonitoring.Site.Features.ResultMonitor;
using GamesAdminMonitoring.Site.GameSettings;
using Microsoft.Extensions.DependencyInjection;
using Refit;

namespace GamesAdminMonitoring.Site._Shared.Middlewares
{
    public static class ServiceMiddleware
    {
        public static void AddServices(this IServiceCollection services, IAppSettings appSettings)
        {
            IdentityServerManager.Initialize(appSettings.IdentityServerAuth);

            var refitSettings = new RefitSettings
            {
                AuthorizationHeaderValueGetter = IdentityServerManager.GetAccessToken
            };

            services.AddScoped<IGameSettingsService, GameSettingsService>();

            services.AddScoped<IHoldemPokerApiFactory, HoldemPokerApiFactory>();
            services.AddSingleton(RestService.For<ICasinoHoldemPokerApi>(appSettings.GameServers.CasinoHoldemPoker.Api, refitSettings));

            services.AddScoped<ISlotBoardApiFactory, SlotBoardApiFactory>();
            services.AddSingleton(RestService.For<IFourGuardiansBoardApi>(appSettings.GameServers.FourGuardians.Api, refitSettings));
            services.AddSingleton(RestService.For<IHeroesSlotBoardApi>(appSettings.GameServers.HeroesSlot.Api, refitSettings));

            services.AddScoped<IResultMonitorService, ResultMonitorService>();
        }
    }
}