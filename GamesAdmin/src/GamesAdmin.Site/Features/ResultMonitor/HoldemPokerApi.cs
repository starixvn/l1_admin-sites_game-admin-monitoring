using GamesAdminMonitoring.Site.Features.ResultMonitor.Requests;
using GamesAdminMonitoring.Site.Features.ResultMonitor.ViewModels;
using Refit;
using System.Threading.Tasks;

namespace GamesAdminMonitoring.Site.Features.ResultMonitor
{
    [Headers("Authorization: Bearer")]
    public interface IHoldemPokerApi
    {
        [Post("/api/set-result")]
        Task<BaseCasinoHoldemPokerResultControl> SetResult([Body] SetHoldemPokerResultRequest request);
    }

    public interface ICasinoHoldemPokerApi : IHoldemPokerApi
    {
        [Post("/api/set-result")]
        new Task<BaseCasinoHoldemPokerResultControl> SetResult([Body] SetHoldemPokerResultRequest request);
    }
}