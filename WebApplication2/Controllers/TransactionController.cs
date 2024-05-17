using ERP_Project.Commom;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OnlineMobileRecharged.Common.CommonModels;
using System.Diagnostics;
using WebApplication2.Models;
using static Mysqlx.Expect.Open.Types;

namespace WebApplication2.Controllers
{
    public class TransactionController : Controller
    {
        private readonly MyDbContext _context;
        private readonly ILogger<TransactionController> _logger;

        public TransactionController(ILogger<TransactionController> logger, MyDbContext context)
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
        public IActionResult Insert([FromBody] ModelInsertTransaction model)
        {
            var result = new Result() { HasError = false, Title ="", Object = { } };
            try
            {
                User u = _context.Users.FirstOrDefault(x => x.is_active == true && x.username == model.UserName);
                u.amount += model.Value;
                _context.Users.Update(u);

                Transaction t = new Transaction()
                {
                    phone = model.Phone+"",
                    user_id = u.ID,
                    service_id = model.ServiceId,
                    value = model.Value,
                    create_at = DateTime.Now,
                    create_by = "Admin",
                    is_active = true,
                };
                _context.Transactions.Add(t);
                _context.SaveChanges();
                result.Title = "Payment Success!";
            }
            catch
            {
                result.HasError = true;
                result.Title = "Có lỗi khi Insert Stansaction!";
            }

            return Json(result);
        }
        [HttpPost]
        public IActionResult GetGmail([FromBody] ModelInsertTransaction model)
        {
            var result = new Result() { HasError = false, Title ="", Object = { } };
            try
            {
                User u = _context.Users.FirstOrDefault(x => x.is_active == true && x.username == model.UserName);
                result.Object = new
                {
                    gmail = u.email
                };
            }
            catch
            {
                result.HasError = true;
                result.Title = "Có lỗi khi GetGmail Stansaction!";
            }

            return Json(result);
        }
    }
    public class ModelInsertTransaction
    {
        public string UserName { get; set; }
        public int Phone { get; set; }
        public int Value { get; set; }
        public int ServiceId { get; set; }
    }
}
