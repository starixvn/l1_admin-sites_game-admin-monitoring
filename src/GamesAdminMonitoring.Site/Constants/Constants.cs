using System.Collections.Generic;

namespace GamesAdminMonitoring.Site
{
    public static class CardLabels
    {
        public static readonly string[] DisplayedName = { "A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K" };

        public static readonly Dictionary<string, int> CardSuit = new Dictionary<string, int>
        {
            {"h", 0 },
            {"d", 1 },
            {"c", 2 },
            {"s", 3 },
        };
    } 
}