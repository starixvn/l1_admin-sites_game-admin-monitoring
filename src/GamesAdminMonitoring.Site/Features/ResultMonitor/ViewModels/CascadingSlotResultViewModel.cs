using System.Collections.Generic;
using System.Linq;
using GamesAdminMonitoring.Site.Enumeration;

namespace GamesAdminMonitoring.Site.Features.ResultMonitor.ViewModels
{
    public class CascadingSlotResultViewModel
    {
        public CascadingSlotResultViewModel()
        {
        }

        public CascadingSlotResultViewModel(string name)
        {
            GameName = name;
        }

        public string GameName { get; }

        public string Token { get; }

        public string DisplayGameName => Enumeration.Enumeration.FromValue<Game>(GameName).DisplayName;

        public string Nickname { get; set; }

        public IEnumerable<CascadingSlotGameResult> Results { get; set; }

        public IEnumerable<Icon> Icons { get; set; }
    }

    public class CascadingSlotGameResult
    {
        public IEnumerable<Icon> Icons { get; set; }

        public bool IsValid => Icons.All(icon => icon.IsValid) && Icons.ToList().Sum(icon => icon.Quantity).Equals(30);
    }

    public class Icon
    {
        public string Name { get; set; }

        public decimal Quantity { get; set; }

        public bool IsValid => Quantity > 0 && Quantity <= 30;
    }
}