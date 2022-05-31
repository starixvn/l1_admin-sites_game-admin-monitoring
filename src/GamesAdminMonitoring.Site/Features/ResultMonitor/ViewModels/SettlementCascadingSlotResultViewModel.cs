using System.Collections.Generic;
using GamesAdminMonitoring.Site.Enumeration;

namespace GamesAdminMonitoring.Site.Features.ResultMonitor.ViewModels
{
    public class SettlementCascadingSlotResultViewModel
    {
        public SettlementCascadingSlotResultViewModel(
            string gameConfigName,
            IEnumerable<SettlementCascadingSlotResult> results,
            bool isValid)
        {
            GameName = gameConfigName;
            Results = results;
            IsValid = isValid && results != null;
        }

        public string GameName { get; }

        public string DisplayGameName => Enumeration.Enumeration.FromValue<Game>(GameName).DisplayName;

        public string Nickname { get; set; }

        public IEnumerable<SettlementCascadingSlotResult> Results { get; set; }

        public bool IsValid { get; }
    }
}