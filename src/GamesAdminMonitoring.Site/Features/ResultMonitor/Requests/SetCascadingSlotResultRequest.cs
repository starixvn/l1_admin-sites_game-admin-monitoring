using System.Collections.Generic;
using GamesAdminMonitoring.Site.Features.ResultMonitor.ViewModels;
using MediatR;

namespace GamesAdminMonitoring.Site.Features.ResultMonitor.Requests
{
    public class SetCascadingSlotResultRequest : IRequest<SettlementCascadingSlotResultViewModel>
    {
        public string gameConfigName { get; set; }

        public string nickname { get; set; }

        public CascadingSlotResultRequest result { get; set; }

        public bool IsValid
        {
            get
            {
                return result.baseSpin.board.Count == 30;
            }
        }
    }


    // TO DO : remove
    public class RawResult
    {
        public string Name { get; set; }

        public string Value { get; set; }
    }

    public class CascadingSlotResultRequest
    {
        public BaseSpinRequest baseSpin { get; set; }

        public List<TumbleRequest> tumbles { get; set; }
    }

    public class BaseSpinRequest
    {
        public List<int> board { get; set; }

        public List<int> multipliers { get; set; }
    }

    public class TumbleRequest
    {
        public List<int> newSymbols { get; set; }

        public List<int> multipliers { get; set; }

    }
}