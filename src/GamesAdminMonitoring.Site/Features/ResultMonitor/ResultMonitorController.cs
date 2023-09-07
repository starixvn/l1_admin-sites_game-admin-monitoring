using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using GamesAdminMonitoring.Site._Shared.Configurations;
using GamesAdminMonitoring.Site.Features.ResultMonitor.Requests;
using GamesAdminMonitoring.Site.Features.ResultMonitor.ViewModels;
using GamesAdminMonitoring.Site.Models;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace GamesAdminMonitoring.Site.Features.ResultMonitor
{
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
            return View("Container/Index", await mediator.Send(new GameSettingsRequest(token, gameName)));
        }

        [HttpGet]
        public async Task<IActionResult> SlotResult(string token, string gameConfigName, string displayName)
        {
            var model = await mediator.Send(new VerifyTokenRequest(token, gameConfigName));

            return model.IsValid ? View("SlotGames/Index", new SlotResultViewModel(gameConfigName, displayName)) : RedirectToRestrictedPage(model.Message);
        }

        [HttpPost]
        public async Task<IActionResult> SetSlotResult([Bind] SlotResultViewModel viewModel)
        {
            var model = await mediator.Send(new SetSlotResultRequest(
                viewModel.GameName,
                viewModel.Nickname,
                viewModel.Results.Trim().Split(',').Select(x => byte.Parse(x)).ToArray()));
            model.SystemType = appSettings.SystemType;

            return PartialView("SlotGames/_ResultMonitor", model);
        }

        [HttpGet]
        public async Task<IActionResult> HoldemPokderResult(string token, string gameConfigName)
        {
            var model = await mediator.Send(new VerifyTokenRequest(token, gameConfigName));

            return model.IsValid ? View("HoldemPoker/Index", new HoldemPokerResultViewModel(gameConfigName)) : RedirectToRestrictedPage(model.Message);
        }

        [HttpPost]
        public async Task<IActionResult> SetHoldemPokerResult(SetHoldemPokerResultRequest request)
            => PartialView("HoldemPoker/_ResultMonitor", await mediator.Send(request));

        [HttpGet]
        public async Task<IActionResult> HiLoResult(string token)
        {
            var model = await mediator.Send(new VerifyTokenRequest(token));

            return model.IsValid ? View("HiLo/Index", new HiLoResultViewModel()) : RedirectToRestrictedPage(model.Message);
        }

        [HttpPost]
        public async Task<IActionResult> SetHiLoResult(HiLoResultViewModel viewModel)
            => PartialView("HiLo/_HiLoResult", await mediator.Send(new SetHiLoResultRequest(viewModel.Nickname, viewModel.Result.Split(";"))));

        [HttpGet]
        public async Task<IActionResult> CascadingSlotResult(string token, string gameConfigName, string displayName)
        {
            var model = await mediator.Send(new VerifyTokenRequest(token, gameConfigName));

            return model.IsValid ? View("CascadingSlotGames/Index", new CascadingSlotResultViewModel(gameConfigName, displayName)) : RedirectToRestrictedPage(model.Message);
        }

        [HttpPost]
        public async Task<IActionResult> SetCascadingSlotResult(string data)
        {
            var request = JsonConvert.DeserializeObject<SetCascadingSlotResultRequest>(data);

            return PartialView("CascadingSlotGames/_ResultMonitor", await mediator.Send(request));
        }

        [HttpPost]
        public IActionResult ExportResultJsonFile(string jsonData)
        {
            JsonSerializerSettings options = new JsonSerializerSettings() { NullValueHandling = NullValueHandling.Ignore, Formatting = Formatting.Indented };
            var request = JsonConvert.DeserializeObject<SetCascadingSlotResultRequest>(jsonData);

            return File(
                SerializeToUtf8Bytes(request, options),
                "text/plain",
                $"{request.gameConfigName}-Result-Template-{DateTime.Now:yyyy'-'MM'-'dd'T'HH':'mm':'ss.fffffffK}.json");
        }

        [HttpPost]
        public async Task<IActionResult> ImportTemplateResults(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return PartialView(
                    "CascadingSlotGames/_ResultMonitor",
                    new SettlementCascadingSlotResultViewModel(string.Empty, Enumerable.Empty<SettlementCascadingSlotResult>(), false));
            }

            using var reader = new StreamReader(file.OpenReadStream());
            var request = JsonConvert.DeserializeObject<SetCascadingSlotResultRequest>(await reader.ReadToEndAsync());
            return PartialView("CascadingSlotGames/_ResultMonitor", await mediator.Send(request));
        }


        [HttpGet]
        public async Task<IActionResult> PontoonResult(string token, string gameConfigName)
        {
            var model = await mediator.Send(new VerifyTokenRequest(token, gameConfigName));

            return model.IsValid ? View("Pontoon/Index", new PontoonResultViewModel()) : RedirectToRestrictedPage(model.Message);
        }

        [HttpPost]
        public async Task<bool> SetPontoonResult(SetPontoonResultRequest request)      
            => await mediator.Send(request);

        private IActionResult RedirectToRestrictedPage(string message)
            => View("Features/_Shared/Error.cshtml", new ErrorViewModel(message));

        private static byte[] SerializeToUtf8Bytes(object obj, JsonSerializerSettings options)
        {
            using var stream = new MemoryStream();
            using var streamWriter = new StreamWriter(stream);
            using var jsonWriter = new JsonTextWriter(streamWriter);
            JsonSerializer.CreateDefault(options).Serialize(jsonWriter, obj);
            jsonWriter.Flush();
            stream.Position = 0;
            return stream.ToArray();
        }
    }
}