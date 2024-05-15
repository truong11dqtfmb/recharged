using ERP_Project.Commom;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using WebApplication2.Models;
using static Mysqlx.Expect.Open.Types;

namespace WebApplication2.Controllers
{
    public class AdminController : Controller
    {
        private readonly MyDbContext _context;
        private readonly ILogger<AdminController> _logger;

        public AdminController(ILogger<AdminController> logger, MyDbContext context)
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
    }
}
