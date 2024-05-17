using ERP_Project.Commom;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OnlineMobileRecharged.Common.CommonModels;
using OnlineMobileRecharged.Controllers;
using System.Diagnostics;
using WebApplication2.Models;
using System.Security.Cryptography;
using static Mysqlx.Expect.Open.Types;

namespace WebApplication2.Controllers
{
    public class FeedbackController : Controller
    {
        private readonly MyDbContext _context;
        private readonly ILogger<FeedbackController> _logger;

        public FeedbackController(ILogger<FeedbackController> logger, MyDbContext context)
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
        [HttpPost]
        public IActionResult Feedback([FromBody] ModelFeedback model)
        {
            var rs = new Result() { HasError = false, Title = "" };

            try
            {

                var u = new Feedback()
                {
                    content = model.Content,
                    user_id = _context.Users.FirstOrDefault(x => x.is_active == true && x.username == model.UserName).ID,
                    is_active = true,
                    create_at = DateTime.Now,
                    create_by = "Admin",
                };

                _context.Feedbacks.Add(u);
                _context.SaveChanges();
                rs.Title = "Edit success!";
            }
            catch
            {
                rs.HasError = true;
                rs.Title = "Co loi xay ra khi EditUser!";
            }

            return Json(rs);
        }
    }
    public class ModelFeedback
    {
        public string UserName { get; set; }
        public string Content { get; set; }
    }
}
