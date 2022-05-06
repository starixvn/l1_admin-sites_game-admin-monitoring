using System.Collections.Generic;
using GamesAdminMonitoring.Site.Enumeration;
using GamesAdminMonitoring.Site.Features.ResultMonitor.Requests;

namespace GamesAdminMonitoring.Site.Features.ResultMonitor.ViewModels
{
    public class SettlementCascadingSlotResultViewModel
    {
        public SettlementCascadingSlotResultViewModel()
        {
        }

        public SettlementCascadingSlotResultViewModel(SetCascadingSlotResultRequest request)
        {
            GameName = request.GameConfigName;
            ResultMatrixs = request.ResultMatrixs;
            IsValid = request.IsValid;
        }

        public string GameName { get; }

        public string DisplayGameName => Enumeration.Enumeration.FromValue<Game>(GameName).DisplayName;

        public string Nickname { get; set; }

        public IEnumerable<CascadingSlotGameResult> Results { get; set; }

        public IEnumerable<Icon> Icons { get; set; }

        public IEnumerable<string[,]> ResultMatrixs { get; }

        public bool IsValid { get; }
    }
}