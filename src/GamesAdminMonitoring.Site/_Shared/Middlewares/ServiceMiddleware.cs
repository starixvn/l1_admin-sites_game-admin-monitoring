using GamesAdmin.Core.IdentityServer;
using GamesAdmin.Site.Features.ResultMonitor;
using GamesAdminMonitoring.Site._Shared.Configurations;
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
                AuthorizationHeaderValueGetter = async (request, cancellationToken) => await IdentityServerManager.GetAccessToken()
            };

            services.AddSingleton(RestService.For<IResultMonitorApi>(appSettings.ApiHost, refitSettings));

            services.AddScoped<IResultMonitorService, ResultMonitorService>();
        }
    }
}