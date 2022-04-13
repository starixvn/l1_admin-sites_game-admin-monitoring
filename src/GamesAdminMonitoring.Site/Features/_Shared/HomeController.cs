using GamesAdminMonitoring.Site.Models;
using Microsoft.AspNetCore.Mvc;

namespace GamesAdminMonitoring.Site.Features._Shared
{
    public class HomeController : Controller
    {
        private readonly string DefaultErrorMsg = "Oops, Something went wrong. Please contact your administrator.";
        public IActionResult Error()
        {
            return View(new ErrorViewModel(DefaultErrorMsg));
        }

        [HttpGet]
        public IActionResult Whoami()
        {
            return View();
        }
    }
}