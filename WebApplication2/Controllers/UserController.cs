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
    public class UserController : Controller
    {
        private readonly MyDbContext _context;
        private readonly ILogger<UserController> _logger;

        public UserController(ILogger<UserController> logger, MyDbContext context)
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
        public IActionResult GetProfile([FromBody] ModelGetProfile model)
        {
            var u = from a in _context.Users.Where(x => x.is_active == true && x.username == model.UserName)
                    select new
                    {
                        a.ID,
                        a.phone,
                        //use
                        a.fullname,
                        a.email,
                        a.address,
                    };

            return Json(u);
        }
        [HttpPost]
        public IActionResult EditUser([FromBody] ModelEditUser model)
        {
            var rs = new Result() { HasError = false, Title = "" };

            try
            {
                var u = _context.Users.FirstOrDefault(x => x.is_active == true && x.ID == model.id);
                u.fullname = model.fullname;
                u.email = model.email;
                u.address = model.address;

                _context.Users.Update(u);
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
        [HttpPost]
        public IActionResult GetTransactionOfU([FromBody] ModelGetTransactionOfU model)
        {
            var rs = new Result() { HasError = false, Title = "" };

            try
            {
                rs.Object = from a in _context.Users.Where(x => x.is_active == true && x.username == model.UserName)
                            join b in _context.Transactions.Where(x => x.is_active == true && (string.IsNullOrEmpty(model.Phone) || x.phone.Contains(model.Phone))) on a.ID equals b.user_id
                            join c in _context.ServiceProviders.Where(x => x.is_active == true) on b.service_id equals c.ID
                            select new
                            {
                                idT = b.ID,
                                titleService = c.name,
                                value = b.value,
                                phone = b.phone,
                                picture = c.picture,
                            }
                            into d
                            group d by d.titleService into d1
                            select new
                            {
                                titleService = d1.Key,
                                detail = d1.Select(x => new
                                {
                                    idTran = x.idT,
                                    value = x.value,
                                    phone = x.phone,
                                    picture = x.picture,
                                })
                            }
                            ;
            }
            catch
            {
                rs.HasError = true;
                rs.Title = "Co loi xay ra khi EditUser!";
            }

            return Json(rs);
        }
        [HttpPost]
        public IActionResult ChangePass([FromBody] ModelChangePass model)
        {
            var rs = new Result() { HasError = false, Title = "" };

            try
            {
                using (SHA256 sha256Hash = SHA256.Create())
                {
                    var u = _context.Users.Where(x => x.is_active == true && x.username == model.UserName).FirstOrDefault();
                    var haspass = RegisterController.HashPassword(sha256Hash, model.Password);
                    if (haspass != u.password)
                    {
                        rs.HasError = true;
                        rs.Title = "Incorrect Password!";
                    }
                    else
                    {
                        u.password= RegisterController.HashPassword(sha256Hash, model.NewPassword);
                        _context.Users.Update(u);
                        _context.SaveChanges();
                        rs.Title = "Change Password success!";
                    }
                }
            }
            catch
            {
                rs.HasError = true;
                rs.Title = "Co loi xay ra khi EditUser!";
            }

            return Json(rs);
        }
        //Screen Admin/User
        [HttpGet]
        public IActionResult GetListUser()
        {
            var rs = new Result() { HasError = false, Title = "", Object = { } };

            try
            {
                var data = (from a in _context.Users.Where(x => x.is_active == true)
                           select new
                           {
                               a.ID,
                               a.username,
                               a.fullname,
                               a.phone,
                           }).ToList();


                rs.Object = new
                {
                    titles = new List<string> { "ID", "User Name", "Full Name", "Phone" },
                    datas = data
                };
            }
            catch
            {
                rs.HasError = true;
                rs.Title = "HasError!";
            }

            return Json(rs);
        }
        //Screen Admin / ListTransaction
        [HttpGet]
        public IActionResult GetListTransaction()
        {
            var rs = new Result() { HasError = false, Title = "", Object = { } };

            try
            {
                var data = (from a in _context.Transactions.Where(x => x.is_active == true)
                           join b in _context.Users.Where(x=>x.is_active == true) on a.user_id equals b.ID
                           join c in _context.ServiceProviders.Where(x=>x.is_active == true) on a.service_id equals c.ID
                           select new
                           {
                               a.ID,
                               a.value,
                               picture = c.picture,
                               a.phone,
                               account = b.fullname
                           }).ToList();


                rs.Object = new
                {
                    titles = new List<string> { "ID", "Value", "Phone", "Mobile", "Payment By" },
                    datas = data
                };
            }
            catch
            {
                rs.HasError = true;
                rs.Title = "HasError!";
            }

            return Json(rs);
        }
    }
    public class ModelGetProfile
    {
        public string UserName { get; set; }
    }
    public class ModelGetTransactionOfU
    {
        public string UserName { get; set; }
        public string Phone { get; set; }
    }
    public class ModelChangePass
    {
        public string UserName { get; set; }
        public string Password { get; set; }
        public string NewPassword { get; set; }
    }
    public class ModelEditUser
    {
        public int id { get; set; }
        public string phone { get; set; }
        public string fullname { get; set; }
        public string email { get; set; }
        public string address { get; set; }
    }
}
