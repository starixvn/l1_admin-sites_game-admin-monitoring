using GamesAdminMonitoring.Site.Enumeration;
using GamesAdminMonitoring.Site.Features.ResultMonitor.Requests;
using GamesAdminMonitoring.Site.Features.ResultMonitor.ViewModels;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Threading.Tasks;

namespace GamesAdminMonitoring.Site.Features.ResultMonitor
{
    //[Authorize(Roles = Role.AdminValue)]
    public class ResultMonitorController : Controller
    {
        private readonly IMediator mediator;

        public ResultMonitorController(IMediator mediator)
        {
            this.mediator = mediator;
        }

        [Authorize]
        [HttpPost]
        public IActionResult SlotResult(string gameConfigName)
            => View(new SlotResultViewModel(gameConfigName));

        [HttpPost]
        public async Task<IActionResult> SetSlotResult([Bind] SlotResultViewModel viewModel)
        {
            var viewName = viewModel.GameName == Game.HeroesSlotValue ?
                "_HeroesSlotResultMonitor" : "_ResultMonitor";
            return PartialView(viewName, await mediator.Send(new SetSlotBoardRequest(
                viewModel.GameName,
                viewModel.Nickname,
                viewModel.Results.Trim().Split(',').Select(x => byte.Parse(x)).ToArray())));
        }

        [Authorize]
        [HttpPost]
        public IActionResult HoldemPokderResult(string gameConfigName)
           => View("HoldemPoker/Index", new HoldemPokerResultViewModel(gameConfigName));

        [HttpPost]
        public async Task<IActionResult> SetHoldemPokerResult(SetHoldemPokerResultRequest request)
            => PartialView("HoldemPoker/_ResultMonitor", await mediator.Send(request));
    }
}