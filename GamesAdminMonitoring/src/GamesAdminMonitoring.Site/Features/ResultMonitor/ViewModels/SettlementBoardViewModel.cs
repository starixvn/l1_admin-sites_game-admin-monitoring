using GamesAdmin.Core.Models.SlotGame;
using GamesAdminMonitoring.Site.Extensions;
using System.Linq;

namespace GamesAdminMonitoring.Site.Features.ResultMonitor.ViewModels
{
    public class SettlementBoardViewModel
    {
        public SettlementBoardViewModel(string name, SettlementBoard board)
        {
            Name = name;
            Board = board;
        }

        public string Name { get; }

        public SettlementBoard Board { get; }

        public bool IsError => Board == null;

        public byte[][] FormattedBoard => Board?.Result?.ToArray()?.FormatBoard();

        public string WinningPaylines => string.Join(", ", Board?.Paylines?.Where(x => x.Odds > 0)?.Select(x => x.Payline) ?? Enumerable.Empty<byte>());

        public byte NumberOfFreeSpins => (byte)(IsError ? 0 : Board?.FreeSpins?.Odds ?? 0);

        public byte NumberOfBonus => (byte)(IsError ? 0 : Board?.Bonus?.Odds ?? 0);

        public string Jackpot => Board?.JackpotPayline > -1 ? "YES" : "NO";
    }
}