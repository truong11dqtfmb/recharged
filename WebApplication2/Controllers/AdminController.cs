using ERP_Project.Commom;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OnlineMobileRecharged.Common.CommonModels;
using OnlineMobileRecharged.Controllers;
using System.Security.Cryptography;
using System.Data;
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
        //Screen Admin/User
        [HttpGet]
        public IActionResult GetListUser()
        {
            var rs = new Result() { HasError = false, Title = "", Object = { } };

            try
            {
                var data = (from a in _context.Users.Where(x => x.is_active == true)
                            join b in _context.Transactions.Where(x => x.is_active == true) on a.ID equals b.user_id into b1
                            from b in b1.DefaultIfEmpty()
                            select new
                            {
                                a.ID,
                                a.username,
                                a.fullname,
                                a.phone,
                                role = a.role == 0 ? "Admin" : "User",
                                check = b != null ? 1 : 0
                                //amountPayment = _context.Transactions.Where(x=>x.is_active == true).ToList()
                            } into c
                            group c by c.ID into d
                            select new
                            {
                                id = d.Key,
                                username = d.FirstOrDefault().username,
                                fullname = d.FirstOrDefault().fullname,
                                phone = d.FirstOrDefault().phone,
                                role = d.FirstOrDefault().role,
                                amountPayment = d.Count(x => x.check == 1)
                            }
                            ).ToList();


                rs.Object = new
                {
                    titles = new List<string> { "ID", "User Name", "Full Name", "Phone", "Role", "Total Buy" },
                    datas = data
                };
            }
            catch (Exception ex)
            {
                rs.HasError = true;
                rs.Title = "HasError! " + ex.InnerException.Message;
            }

            return Json(rs);
        }
        [HttpGet]
        public IActionResult DetailUser(int id)
        {
            var rs = new Result() { HasError = false, Title = "", Object = { } };

            try
            {
                rs.Object = (from a in _context.Users.Where(x => x.is_active == true && x.ID == id)
                             select new
                             {
                                 a.ID,
                                 UserName = a.username,
                                 PassWord = a.password,
                                 Fullname = a.fullname,
                                 Email = a.email,
                                 Address = a.address,
                                 Phone = a.phone,
                                 Role = a.role,
                             }).FirstOrDefault();
            }
            catch (Exception ex)
            {
                rs.HasError = true;
                rs.Title = "HasError! " + ex.InnerException.Message;
            }

            return Json(rs);
        }
        [HttpPost]
        public IActionResult EditUser([FromBody] ModelEditUserAdmin model)
        {
            Result rs = new Result { HasError = false, Title = "", Object = { } };
            var u = _context.Users.FirstOrDefault(x => x.is_active == true && x.username == model.UserName && x.ID != model.Id);
            if (u != null)
            {
                rs.HasError = true;
                rs.Title = "Tài khoản đăng nhập";
            }
            else
            {
                u = _context.Users.FirstOrDefault(x => x.is_active == true && x.phone == model.Phone && x.ID != model.Id);
                if (u != null)
                {
                    rs.HasError = true;
                    rs.Title = "Số điện thoại";
                }
                else
                {
                    u = _context.Users.FirstOrDefault(x => x.is_active == true && x.email == model.Email && x.ID != model.Id);
                    if (u != null)
                    {
                        rs.HasError = true;
                        rs.Title = "Email";
                    }
                    else
                    {
                        using (SHA256 sha256Hash = SHA256.Create())
                        {
                            string hashedPassword = RegisterController.HashPassword(sha256Hash, model.Password);
                            u = _context.Users.FirstOrDefault(x => x.is_active == true && x.ID == model.Id);
                            u.phone = model.Phone;
                            u.email = model.Email;
                            u.password = hashedPassword;
                            u.fullname = model.FullName;
                            u.address = model.Address;
                            u.role = model.Role;
                            u.modify_at = DateTime.Now;
                            u.modify_by = "Admin";

                            _context.Users.Update(u);
                            _context.SaveChanges();
                            rs.Title = "Chỉnh sửa thành công!";
                        }
                    }
                }
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
                            join b in _context.Users.Where(x => x.is_active == true) on a.user_id equals b.ID
                            join c in _context.ServiceProviders.Where(x => x.is_active == true) on a.service_id equals c.ID
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
        //Screen Admin / GetListSubcription
        [HttpGet]
        public IActionResult GetListSubcription()
        {
            var rs = new Result() { HasError = false, Title = "", Object = { } };

            try
            {
                var data = (from a in _context.Subscriptions.Where(x => x.is_active == true)
                            join b in _context.ServiceProviders.Where(x => x.is_active == true) on a.service_id equals b.ID
                            join c in _context.Transactions.Where(x => x.is_active == true) on new { value = a.value, id = a.service_id } equals new { c.value, id = c.service_id } into c1
                            from c in c1.DefaultIfEmpty()
                            select new
                            {
                                a.ID,
                                b.picture,
                                a.value,
                                check = c != null ? 1 : 0
                            } into d
                            group d by d.ID into e
                            select new
                            {
                                id = e.Key,
                                picture = e.FirstOrDefault().picture,
                                value = e.FirstOrDefault().value,
                                purchases = e.Count(x => x.check == 1)
                            }
                            ).ToList();


                rs.Object = new
                {
                    titles = new List<string> { "ID", "Service", "Value", "Purchases" },
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
        //Screen Admin / GetListServiceCard
        [HttpGet]
        public IActionResult GetListServiceCard()
        {
            var rs = new Result() { HasError = false, Title = "", Object = { } };

            try
            {
                var data = (from a in _context.ServiceProviders.Where(x => x.is_active == true)
                            join b in _context.Transactions.Where(x => x.is_active == true) on a.ID equals b.service_id into b1
                            from b in b1.DefaultIfEmpty()
                            let detail = _context.Subscriptions.Where(x => x.is_active == true && x.service_id == a.ID).ToList()
                            select new
                            {
                                a.ID,
                                a.name,
                                a.picture,
                                totalDetail = (detail != null && detail.Count() > 0) ? detail.Count() : 0,
                                check = b != null ? 1 : 0
                            } into d
                            group d by d.ID into e
                            select new
                            {
                                id = e.Key,
                                picture = e.FirstOrDefault().picture,
                                name = e.FirstOrDefault().name,
                                totalDetail = e.FirstOrDefault().totalDetail,
                                purchases = e.Count(x => x.check == 1),
                            }
                            ).ToList();


                rs.Object = new
                {
                    titles = new List<string> { "ID", "Name", "Picture", "Total Product", "Purchases" },
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
        //Screen Admin / GetListServiceCard
        [HttpGet]
        public IActionResult GetListFeedback()
        {
            var rs = new Result() { HasError = false, Title = "", Object = { } };

            try
            {
                var data = (from a in _context.Feedbacks.Where(x => x.is_active == true)
                            join b in _context.Users.Where(x => x.is_active == true) on a.user_id equals b.ID
                            select new
                            {
                                a.ID,
                                a.content,
                                b.fullname,
                            }
                            ).ToList();

                rs.Object = new
                {
                    titles = new List<string> { "ID", "Message", "User" },
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
}
