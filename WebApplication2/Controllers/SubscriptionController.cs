using ERP_Project.Commom;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using WebApplication2.Models;
using static Mysqlx.Expect.Open.Types;

namespace WebApplication2.Controllers
{
    public class SubscriptionController : Controller
    {
        private readonly MyDbContext _context;
        private readonly ILogger<SubscriptionController> _logger;

        public SubscriptionController(ILogger<SubscriptionController> logger, MyDbContext context)
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
        public IActionResult GetListSubscription(int id)
        {
            var list = from a in _context.Subscriptions.Where(x => x.is_active == true && x.service_id == id)
                       select new
                       {
                           a.ID,
                           a.value,
                       };

            return Json(list);
        }
    }
}
