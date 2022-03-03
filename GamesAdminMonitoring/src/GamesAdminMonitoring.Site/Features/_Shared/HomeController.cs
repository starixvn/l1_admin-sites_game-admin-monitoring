using Microsoft.AspNetCore.Mvc;

namespace GamesAdminMonitoring.Site.Features._Shared
{
    public class HomeController : Controller
    {
        public IActionResult Error()
        {
            return View();
        }
    }
}