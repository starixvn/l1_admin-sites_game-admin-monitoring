using GamesAdminMonitoring.Site._Shared.Configurations;
using GamesAdminMonitoring.Site.Enumeration;
using GamesAdminMonitoring.Site.Features.ResultMonitor.Requests;
using GamesAdminMonitoring.Site.Features.ResultMonitor.ViewModels;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Threading.Tasks;

namespace GamesAdminMonitoring.Site.Features.ResultMonitor
{
    [Authorize(Roles = Role.AdminValue)]
    public class ResultMonitorController : Controller
    {
        private readonly IMediator mediator;
        private readonly IAppSettings appSettings;

        public ResultMonitorController(IMediator mediator, IAppSettings appSettings)
        {
            this.mediator = mediator;
            this.appSettings = appSettings;
        }

        [HttpGet]
        public async Task<IActionResult> Index(string token, string gameName)
        {
            HttpContext.Response.Cookies.Append("token", token);
            HttpContext.Response.Cookies.Append("game-server-endpoint", appSettings.GameServers.Main.Socket);
            HttpContext.Response.Cookies.Append("sedie-server-endpoint", appSettings.GameServers.Sedie.Socket);
            HttpContext.Response.Cookies.Append("sedie-server-endpoint-route", appSettings.GameServers.Sedie.SocketRoute);
            HttpContext.Response.Cookies.Append("vip-sedie-server-endpoint", appSettings.GameServers.VipSedie.Socket);
            HttpContext.Response.Cookies.Append("vip-sedie-server-endpoint-route", appSettings.GameServers.VipSedie.SocketRoute);
            HttpContext.Response.Cookies.Append("special-sedie-server-endpoint", appSettings.GameServers.SpecialSedie.Socket);
            HttpContext.Response.Cookies.Append("special-sedie-server-endpoint-route", appSettings.GameServers.SpecialSedie.SocketRoute);
            HttpContext.Response.Cookies.Append("vip-fish-prawn-crab-server-endpoint", appSettings.GameServers.VipFishPrawnCrab.Socket);
            HttpContext.Response.Cookies.Append("vip-fish-prawn-crab-server-endpoint-route", appSettings.GameServers.VipFishPrawnCrab.SocketRoute);
            HttpContext.Response.Cookies.Append("sic-bo-server-endpoint", appSettings.GameServers.SicBo.Socket);
            HttpContext.Response.Cookies.Append("sic-bo-server-endpoint-route", appSettings.GameServers.SicBo.SocketRoute);
            HttpContext.Response.Cookies.Append("vip-baccarat-server-endpoint", appSettings.GameServers.VipBaccarat.Socket);
            HttpContext.Response.Cookies.Append("vip-baccarat-server-endpoint-route", appSettings.GameServers.VipBaccarat.SocketRoute);
            HttpContext.Response.Cookies.Append("vip-sedie-war-server-endpoint", appSettings.GameServers.VipSeDieWar.Socket);
            HttpContext.Response.Cookies.Append("vip-sedie-war-server-endpoint-route", appSettings.GameServers.VipSeDieWar.SocketRoute);
            HttpContext.Response.Cookies.Append("keno-pro-max-server-endpoint", appSettings.GameServers.KenoProMax.Socket);
            HttpContext.Response.Cookies.Append("keno-pro-max-server-endpoint-route", appSettings.GameServers.KenoProMax.SocketRoute);
            HttpContext.Response.Cookies.Append("mini-sedie-server-endpoint", appSettings.GameServers.MiniSeDie.Socket);
            HttpContext.Response.Cookies.Append("mini-sedie-server-endpoint-route", appSettings.GameServers.MiniSeDie.SocketRoute);
            HttpContext.Response.Cookies.Append("fish-prawn-crab-server-endpoint", appSettings.GameServers.FishPrawnCrab.Socket);
            HttpContext.Response.Cookies.Append("fish-prawn-crab-server-endpoint-route", appSettings.GameServers.FishPrawnCrab.SocketRoute);
            HttpContext.Response.Cookies.Append("big-small-endpoint", appSettings.GameServers.BigSmall.Socket);
            HttpContext.Response.Cookies.Append("big-small-server-endpoint-route", appSettings.GameServers.BigSmall.SocketRoute);
            HttpContext.Response.Cookies.Append("turbo-big-small-endpoint", appSettings.GameServers.TurboBigSmall.Socket);
            HttpContext.Response.Cookies.Append("turbo-big-small-server-endpoint-route", appSettings.GameServers.TurboBigSmall.SocketRoute);
            HttpContext.Response.Cookies.Append("dragon-tiger-endpoint", appSettings.GameServers.DragonTiger.Socket);
            HttpContext.Response.Cookies.Append("dragon-tiger-server-endpoint-route", appSettings.GameServers.DragonTiger.SocketRoute);
            HttpContext.Response.Cookies.Append("turbo-odd-even-endpoint", appSettings.GameServers.TurboOddEven.Socket);
            HttpContext.Response.Cookies.Append("turbo-odd-even-server-endpoint-route", appSettings.GameServers.TurboOddEven.SocketRoute);
            HttpContext.Response.Cookies.Append("roulette-endpoint", appSettings.GameServers.Roulette.Socket);
            HttpContext.Response.Cookies.Append("roulette-server-endpoint-route", appSettings.GameServers.Roulette.SocketRoute);
            HttpContext.Response.Cookies.Append("baccarat-server-endpoint", appSettings.GameServers.Baccarat.Socket);
            HttpContext.Response.Cookies.Append("baccarat-server-endpoint-route", appSettings.GameServers.Baccarat.SocketRoute);
            HttpContext.Response.Cookies.Append("lottery-server-endpoint", appSettings.GameServers.Lottery.Socket);
            HttpContext.Response.Cookies.Append("lottery-server-endpoint-route", appSettings.GameServers.Lottery.SocketRoute);
            HttpContext.Response.Cookies.Append("three-cards-server-endpoint", appSettings.GameServers.ThreeCards.Socket);
            HttpContext.Response.Cookies.Append("three-cards-server-endpoint-route", appSettings.GameServers.ThreeCards.SocketRoute);
            AddMiniKenoCookie();
            HttpContext.Response.Cookies.Append("kenomatch1-server-endpoint", appSettings.GameServers.KenoMatch1.Socket);
            HttpContext.Response.Cookies.Append("kenomatch1-server-endpoint-route", appSettings.GameServers.KenoMatch1.SocketRoute);
            HttpContext.Response.Cookies.Append("kenomatch2-server-endpoint", appSettings.GameServers.KenoMatch2.Socket);
            HttpContext.Response.Cookies.Append("kenomatch2-server-endpoint-route", appSettings.GameServers.KenoMatch2.SocketRoute);
            HttpContext.Response.Cookies.Append("kenopower1-server-endpoint", appSettings.GameServers.KenoPower1.Socket);
            HttpContext.Response.Cookies.Append("kenopower1-server-endpoint-route", appSettings.GameServers.KenoPower1.SocketRoute);
            HttpContext.Response.Cookies.Append("kenopower2-server-endpoint", appSettings.GameServers.KenoPower2.Socket);
            HttpContext.Response.Cookies.Append("kenopower2-server-endpoint-route", appSettings.GameServers.KenoPower2.SocketRoute);

            HttpContext.Response.Cookies.Append("bitcoin-master-server-endpoint", appSettings.GameServers.BitcoinMaster.Socket);
            HttpContext.Response.Cookies.Append("bitcoin-master-server-endpoint-route", appSettings.GameServers.BitcoinMaster.SocketRoute);

            HttpContext.Response.Cookies.Append("casinoholdempoker-server-endpoint", appSettings.GameServers.CasinoHoldemPoker.Socket);
            HttpContext.Response.Cookies.Append("casinoholdempoker-server-endpoint-route", appSettings.GameServers.CasinoHoldemPoker.SocketRoute);
            HttpContext.Response.Cookies.Append("texasholdempoker-server-endpoint", appSettings.GameServers.TexasHoldemPoker.Socket);
            HttpContext.Response.Cookies.Append("texasholdempoker-server-endpoint-route", appSettings.GameServers.TexasHoldemPoker.SocketRoute);

            HttpContext.Response.Cookies.Append("env", appSettings.Env);

            return View("Container/Index", await mediator.Send(new GameSettingsRequest(token, gameName)));
        }

        [HttpGet]
        public async Task<IActionResult> SlotResult(string token, string gameConfigName)
        {
            var model = await mediator.Send(new VerifyTokenRequest(token, gameConfigName));

            if (model.IsValid)
            {
                return View("SlotGames/Index", new SlotResultViewModel(gameConfigName));
            }

            return RedirectToAction("Error", "Home");
        }

        [HttpPost]
        public async Task<IActionResult> SetSlotResult([Bind] SlotResultViewModel viewModel)
        {
            var viewName = viewModel.GameName == Game.HeroesSlotValue ?
                "_HeroesSlotResultMonitor" : "_ResultMonitor";

            return PartialView($"SlotGames/{viewName}", await mediator.Send(new SetSlotResultRequest(
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

        [HttpGet]
        public async Task<IActionResult> HiLoResult(string token)
        {
            var model = await mediator.Send(new VerifyTokenRequest(token));

            if (model.IsValid)
            {
                return View("HiLo/Index", new HiLoResultViewModel());
            }

            return RedirectToAction("Error", "Home");
        }

        [HttpPost]
        public async Task<IActionResult> SetHiLoResult(HiLoResultViewModel viewModel)
        {
            return PartialView("HiLo/_HiLoResult", await mediator.Send(new SetHiLoResultRequest(viewModel.Nickname, viewModel.Result.Split(";"))));
        }

        private void AddMiniKenoCookie()
        {
            var cookies = new[] { "keno-max", "keno-max2", "keno-mini", "keno-mini2", "keno-east", "keno-west", "keno-south", "keno-north" };

            foreach (var c in cookies)
            {
                var socketKey = c.Replace("-", string.Empty);
                HttpContext.Response.Cookies.Append($"{c}-server-endpoint", $"{appSettings.GameServers.MiniKeno.Socket}{socketKey}");
                HttpContext.Response.Cookies.Append($"{c}-server-endpoint-route", appSettings.GameServers.MiniKeno.SocketRoute);
            }
        }
    }
}