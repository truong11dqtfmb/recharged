using ERP_Project.Commom;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OnlineMobileRecharged.Common.CommonModels;
using System.Security.Cryptography;
using WebApplication2.Controllers;
using WebApplication2.Models;

namespace OnlineMobileRecharged.Controllers
{
    
    public class LoginController : Controller
    {
        private readonly MyDbContext _context;
        private readonly ILogger<LoginController> _logger;

        public LoginController(ILogger<LoginController> logger, MyDbContext context)
        {
            _logger = logger;
            _context = context;
        }
        [HttpGet]
        public IActionResult Index()
        {
            if (HttpContext.Session.GetString(StaticUser.UserName) == null)
            {
                return View();
            }
            else
            {
                if (HttpContext.Session.GetString(StaticUser.IsAdmin) != null)
                {
                    return RedirectToAction("Index", "Admin");
                }
                else
                {
                    return RedirectToAction("Index", "Home");
                }
            }
        }
        [HttpPost]
        public IActionResult Login([FromBody] ModelLogin model)
        {
            var rs = new Result { HasError = false, Title = "", Object = { } };

            using (SHA256 sha256Hash = SHA256.Create())
            {
                string hashedPassword = RegisterController.HashPassword(sha256Hash, model.PassWord);
                var u = _context.Users.FirstOrDefault(x => x.is_active == true && x.username == model.UserName && x.password == hashedPassword);
                if (u != null)
                {
                    HttpContext.Session.SetString(StaticUser.UserName, u.username);
                    HttpContext.Session.SetString(StaticUser.FullName, u.fullname);
                    if (u.role == 0)
                    {
                        HttpContext.Session.SetString(StaticUser.IsAdmin, u.username);
                    }
                }
                else
                {
                    rs.HasError = true;
                    rs.Title = "Thông tin tài khoản chưa chính xác!";
                }
            }
            return Json(rs);
        }
        [HttpGet]
        public IActionResult Logout()
        {
            var rs = new Result { HasError = false, Title = "", Object = { } };

            HttpContext.Session.Clear();

            return RedirectToAction("Index", "Home");
        }
    }
    public class ModelLogin
    {
        public string UserName { get; set; }
        public string PassWord { get; set; }
    }
}
