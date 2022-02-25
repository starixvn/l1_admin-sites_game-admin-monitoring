using GamesAdminMonitoring.Site.Features.ResultMonitor.ViewModels;
using MediatR;

namespace GamesAdminMonitoring.Site.Features.ResultMonitor.Requests
{
    public class SetSlotBoardRequest : IRequest<SettlementBoardViewModel>
    {
        public SetSlotBoardRequest(string gameConfigName, string nickname, byte[] results)
        {
            GameConfigName = gameConfigName;
            Nickname = nickname;
            Results = results;
        }

        public string GameConfigName { get; }

        public string Nickname { get; }

        public byte[] Results { get; }
    }
}