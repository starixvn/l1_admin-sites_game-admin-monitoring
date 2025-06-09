using GamesAdminMonitoring.Site._Shared.Configurations;
using GamesAdminMonitoring.Site.Features.ResultMonitor.Requests;
using MediatR;
using System;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Threading;
using Newtonsoft.Json;
using GamesAdminMonitoring.Site.Features.ResultMonitor.ViewModels;

namespace GamesAdminMonitoring.Site.Features.ResultMonitor.Handlers
{
    public class SetMiniRouletteResultHandler : IRequestHandler<SetMiniRouletteResultRequest, MiniRouletteResultControl>
    {
        private readonly IAppSettings appSettings;
        private readonly HttpClient httpClient;

        public SetMiniRouletteResultHandler(IAppSettings appSettings)
        {
            this.appSettings = appSettings;
            this.httpClient = new HttpClient();
        }

        public async Task<MiniRouletteResultControl> Handle(SetMiniRouletteResultRequest request, CancellationToken cancellationToken)
        {
            try
            {
                var baseUrl = appSettings.GetGameServerUrl("MiniRoulette");
                if (string.IsNullOrEmpty(baseUrl))
                    return new MiniRouletteResultControl(false);

                var payload = new
                {
                    playerName = request.PlayerName,
                    result = request.Result
                };

                var content = new StringContent(
                    JsonConvert.SerializeObject(payload),
                    Encoding.UTF8,
                    "application/json");

                var url = $"{baseUrl}/api/set-result";
                var response = await httpClient.PostAsync(url, content, cancellationToken);

                return new MiniRouletteResultControl(response.IsSuccessStatusCode);
            }
            catch (Exception)
            {
                return new MiniRouletteResultControl(false);
            }
        }
    }
}
