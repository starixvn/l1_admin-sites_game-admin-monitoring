using System.Collections.Generic;

namespace GamesAdminMonitoring.Site.Features.ResultMonitor.ViewModels
{
    public class SettlementCascadingSlotResult
    {
        public IEnumerable<CascadingSlotIcon> icons { get; set; }

        public string[] board { get; set; }

        public IEnumerable<int> multipliers { get; set; }

        public int freeSpinCount { get; set; }

        public string[,] Matrix
        {
            get
            {
                if (!board.Length.Equals(30))
                {
                    return new string[0, 0];
                }

                int index = 0;
                int rows = 5, columns = 6;
                string[,] resultMatrix = new string[rows, columns];

                for (int x = 0; x < rows; x++)
                {
                    for (int y = 0; y < columns; y++)
                    {
                        resultMatrix[x, y] = board[index];
                        index++;
                    }
                }

                return resultMatrix;
            }
        }
    }

    public class CascadingSlotIcon
    {
        public string index { get; set; }

        public int count { get; set; }

        public int odds { get; set; }
    }
}