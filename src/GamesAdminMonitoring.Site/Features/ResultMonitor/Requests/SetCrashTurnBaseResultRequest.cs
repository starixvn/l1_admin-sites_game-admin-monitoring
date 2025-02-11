using MediatR;

namespace GamesAdminMonitoring.Site.Features.ResultMonitor.Requests
{
    public class SetCrashTurnBaseResultRequest : IRequest<bool>
    {
        public SetCrashTurnBaseResultRequest(string gameConfigName, float result, string nickname)
        {
            this.gameConfigName = gameConfigName;
            this.result = result;
            this.nickname = nickname;
        }

        public string gameConfigName { get; }

        public float result { get; }

        public string nickname { get; }
    }

}
