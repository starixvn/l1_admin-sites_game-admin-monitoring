using MediatR;

namespace GamesAdminMonitoring.Site.Features.ResultMonitor.Requests
{
    public class SetCrashGameResultRequest : IRequest<bool>
    {
        public SetCrashGameResultRequest(string gameConfigName, float result)
        {
            this.gameConfigName = gameConfigName;
            this.result = result;
        }

        public string gameConfigName { get; }

        public float result { get; }
    }

}
