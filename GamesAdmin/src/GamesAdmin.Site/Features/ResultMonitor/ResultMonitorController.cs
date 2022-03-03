using GamesAdminMonitoring.Site.Enumeration;
using GamesAdminMonitoring.Site.Features.ResultMonitor.Requests;
using GamesAdminMonitoring.Site.Features.ResultMonitor.ViewModels;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Threading.Tasks;

namespace GamesAdminMonitoring.Site.Features.ResultMonitor
{
    public class ResultMonitorController : Controller
    {
        private readonly IMediator mediator;

        public ResultMonitorController(IMediator mediator)
        {
            this.mediator = mediator;
        }

        [HttpGet]
        public async Task<IActionResult> SlotResult(string token, string gameConfigName)
        {
            var model = await mediator.Send(new VerifyTokenRequest(token, gameConfigName));

            if (model.IsValid)
            {
                return View(new SlotResultViewModel(gameConfigName));
            }

            return RedirectToAction("Error", "Home");
        }

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

        [HttpGet]
        public async Task<IActionResult> HoldemPokderResult(string token, string gameConfigName)
        {
            var model = await mediator.Send(new VerifyTokenRequest(token, gameConfigName));

            if (model.IsValid)
            {
                return View("HoldemPoker/Index", new HoldemPokerResultViewModel(gameConfigName));
            }

            return RedirectToAction("Error", "Home");
        }

        [HttpPost]
        public async Task<IActionResult> SetHoldemPokerResult(SetHoldemPokerResultRequest request)
            => PartialView("HoldemPoker/_ResultMonitor", await mediator.Send(request));
    }
}