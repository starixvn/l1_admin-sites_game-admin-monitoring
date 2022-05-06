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

        public IEnumerable<ResultMaxtrix> ResultMatrixs { get; }

        public bool IsValid { get; }
    }

    public class ResultMaxtrix
    {
        public ResultMaxtrix(
            string name,
            string[,] value,
            IEnumerable<WinningSymbol> winningSymbols,
            int multipliers,
            int scatters)
        {
            Name = name;
            Value = value;
            WinningSymbols = winningSymbols;
            Multipliers = multipliers;
            Scatters = scatters;
        }

        public string Name { get; }

        public string[,] Value { get; }

        public IEnumerable<WinningSymbol> WinningSymbols { get; }

        public int Multipliers { get; }

        public int Scatters { get; }
    }

    public class WinningSymbol
    {
        public WinningSymbol(int symbol, int numberOfSymbol)
        {
            Symbol = symbol;
            NumberOfSymbol = numberOfSymbol;
        }

        public int Symbol { get; }

        public int NumberOfSymbol { get; }
    }
}