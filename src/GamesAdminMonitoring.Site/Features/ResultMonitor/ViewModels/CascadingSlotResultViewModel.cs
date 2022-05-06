using System.Collections.Generic;
using System.Linq;
using GamesAdminMonitoring.Site.Enumeration;

namespace GamesAdminMonitoring.Site.Features.ResultMonitor.ViewModels
{
    public static class Extensions
    {
        public static IEnumerable<IEnumerable<T>> Split<T>(this T[] arr, int size)
        {
            for (var i = 0; i < arr.Length / size + 1; i++)
            {
                yield return arr.Skip(i * size).Take(size);
            }
        }
    }

    public class CascadingSlotResultViewModel
    {
        public CascadingSlotResultViewModel()
        {
        }

        public CascadingSlotResultViewModel(string name)
        {
            GameName = name;

            string rawResult = "0,0,0,5,7,8,5,0,2,0,0,7,3,0,3,8,5,9,7,7,8,0,5,0,6,0,4,4,2,0";
            string[] splittedStrings = rawResult.Split(",");

            int index = 0;
            int rows = 5, columns = 6;
            string[,] resultMatrix = new string[rows, columns];

            for (int x = 0; x < rows; x++)
            {
                for (int y = 0; y < columns; y++)
                {
                    resultMatrix[x, y] = splittedStrings[index];
                    index++;
                }
            }

            ResultMatrix = resultMatrix;
        }

        public string GameName { get; }

        public string DisplayGameName => Enumeration.Enumeration.FromValue<Game>(GameName).DisplayName;

        public string Nickname { get; set; }

        public IEnumerable<CascadingSlotGameResult> Results { get; set; }

        public IEnumerable<Icon> Icons { get; set; }

        public string[,] ResultMatrix { get; set; }
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