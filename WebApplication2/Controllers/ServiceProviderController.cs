using ERP_Project.Commom;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using WebApplication2.Models;
using static Mysqlx.Expect.Open.Types;

namespace WebApplication2.Controllers
{
    public class ServiceProviderController : Controller
    {
        private readonly MyDbContext _context;
        private readonly ILogger<ServiceProviderController> _logger;

        public ServiceProviderController(ILogger<ServiceProviderController> logger, MyDbContext context)
        {
            _logger = logger;
            _context = context;
        }

        public IActionResult Index()
        {
            ViewData["UserName"] = HttpContext.Session.GetString(StaticUser.UserName) ?? "";
            ViewData["FullName"] = HttpContext.Session.GetString(StaticUser.FullName) ?? "";

            return View();
        }
        [HttpGet]
        public IActionResult GetListSercive()
        {
            var list = from a in _context.ServiceProviders.Where(x => x.is_active == true)
                       select new
                       {
                           a.ID,
                           a.name,
                           a.picture
                       };

            return Json(list);
        }
        [HttpPost]
        public IActionResult GoSubscription([FromBody] ModelGoSubscription model)
        {
            var list = from a in _context.ServiceProviders.Where(x => x.is_active == true)
                       select new
                       {
                           a.ID,
                           a.name,
                           a.picture
                       };

            return RedirectToAction("Index", "Subscription");
        }
    }
    public class ModelGoSubscription
    {
        public string phone { get; set; }
    }
}
