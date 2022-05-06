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

            decimal index = 10;
            var icons = new List<Icon>();
            while (index > 0)
            {
                icons.Add(
                    new Icon
                    {
                        Name = $"Item-${index}",
                        Quantity = 1
                    });

                index--;
            }

            Icons = icons;
        }

        public string GameName { get; set; }

        public string DisplayGameName => Enumeration.Enumeration.FromValue<Game>(GameName).DisplayName;

        public string Nickname { get; set; }

        public IEnumerable<CascadingSlotGameResult> Results { get; set; }

        public IEnumerable<Icon> Icons { get; private set; }
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