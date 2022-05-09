using System.Collections.Generic;
using System.Linq;
using GamesAdminMonitoring.Site.Features.ResultMonitor.ViewModels;
using MediatR;

namespace GamesAdminMonitoring.Site.Features.ResultMonitor.Requests
{
    public class SetCascadingSlotResultRequest : IRequest<SettlementCascadingSlotResultViewModel>
    {
        private bool isValid;

        public string GameConfigName { get; set; }
        public RawResult[] RawResults { get; set; }

        public bool IsValid
        {
            get
            {
                return isValid;
            }
        }

        public IEnumerable<ResultMaxtrix> ResultMatrixs
        {
            get
            {
                var resultMatrixs = new List<ResultMaxtrix>();
                foreach (var rawResult in RawResults)
                {
                    string[] splittedStrings = rawResult.Value.Split(",");

                    if (!splittedStrings.Length.Equals(30))
                    {
                        isValid = false;
                        return Enumerable.Empty<ResultMaxtrix>();
                    }

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

                    var winningSymbols = new List<WinningSymbol> { new WinningSymbol(3, 8), new WinningSymbol(5, 9) };
                    resultMatrixs.Add(new ResultMaxtrix(rawResult.Name, resultMatrix, winningSymbols, 1, 2));
                }

                isValid = true;
                return resultMatrixs;
            }
        }

        public class RawResult
        {
            public string Name { get; set; }

            public string Value { get; set; }
        }
    }
}