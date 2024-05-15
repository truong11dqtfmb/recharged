using ERP_Project.Commom;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using WebApplication2.Models;
using static Mysqlx.Expect.Open.Types;

namespace WebApplication2.Controllers
{
    //[Area("myWeb")]
    public class HomeController : Controller
    {
        private readonly MyDbContext _context;
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger, MyDbContext context)
        {
            _logger = logger;
            _context = context;
        }

        public IActionResult Index()
        {
            ViewData["UserName"] = HttpContext.Session.GetString(StaticUser.UserName) ?? "";
            ViewData["FullName"] = HttpContext.Session.GetString(StaticUser.FullName) ?? "";
            if (HttpContext.Session.GetString(StaticUser.IsAdmin) != null)
            {
                return RedirectToAction("Index", "Admin");
            }
            return View();
        }
        [HttpGet]
        public IActionResult GetListItem()
        {
            var users = _context.Users.Where(x => x.is_active == true)
                                      .Select(a => new
                                      {
                                          a.ID,
                                          a.username,
                                          a.email
                                      })
                                      .ToList();

            return Json(users);
        }
    }
    public class Item
    {
        public int id { get; set; }
        public string name { get; set; }
    }
}
