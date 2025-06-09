using GamesAdminMonitoring.Site.Features.ResultMonitor.ViewModels;
using MediatR;

namespace GamesAdminMonitoring.Site.Features.ResultMonitor.Requests
{
    public class SetMiniRouletteResultRequest : IRequest<MiniRouletteResultControl>
    {
        public SetMiniRouletteResultRequest(string playerName, int result)
        {
            PlayerName = playerName;
            Result = result;
        }

        public string PlayerName { get; }

        public int Result { get; }
    }
}
