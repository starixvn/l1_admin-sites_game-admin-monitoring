using GamesAdmin.Core.Models.SlotGame;
using GamesAdminMonitoring.Site.Features.ResultMonitor.Requests;
using Refit;
using System.Threading.Tasks;

namespace GamesAdminMonitoring.Site.Features.ResultMonitor
{
    [Headers("Authorization: Bearer")]
    public interface ISlotBoardApi
    {
        [Post("/api/set-board")]
        Task<SettlementBoard> SetBoard([Body] SetSlotBoardServerRequest request);
    }

    public interface IFourGuardiansBoardApi : ISlotBoardApi
    {
        [Post("/api/set-board")]
        new Task<SettlementBoard> SetBoard([Body] SetSlotBoardServerRequest request);
    }

    public interface IHeroesSlotBoardApi : ISlotBoardApi
    {
        [Post("/api/set-board")]
        new Task<SettlementBoard> SetBoard([Body] SetSlotBoardServerRequest request);
    }
}