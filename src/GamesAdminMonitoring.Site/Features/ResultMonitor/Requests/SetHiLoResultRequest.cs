using GamesAdminMonitoring.Site.Features.ResultMonitor.ViewModels;
using MediatR;
using System.Collections.Generic;

namespace GamesAdminMonitoring.Site.Features.ResultMonitor.Requests
{
    public class SetHiLoResultRequest : IRequest<IEnumerable<HiloCard>>
    {
        public SetHiLoResultRequest(string nickname, IEnumerable<string> result)
        {
            Name = nickname;
            Result = result;
        }

        public string Name { get; }

        public IEnumerable<string> Result { get; }
    }
}