using MediatR;
using System.Collections.Generic;
using System.Linq;

namespace GamesAdminMonitoring.Site.Features.ResultMonitor.Requests
{
    public class SetSlotBoardApiRequest : IRequest<bool>
    {
        public SetSlotBoardApiRequest(string name, IEnumerable<byte> result)
        {
            this.name = name;
            this.result = result.ToList();
        }

        public string name { get; }

        public IEnumerable<byte> result { get; }
    }
}