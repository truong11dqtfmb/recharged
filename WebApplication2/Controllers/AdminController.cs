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
                            string hashedPassword = model.Password != "" ? RegisterController.HashPassword(sha256Hash, model.Password) : "";
                            u = _context.Users.FirstOrDefault(x => x.is_active == true && x.ID == model.Id);
                            u.phone = model.Phone;
                            u.email = model.Email;
                            u.password = model.Password != "" ? hashedPassword : u.password;
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
        [HttpGet]
        public IActionResult RemoveUser(int id)
        {
            Result rs = new Result { HasError = false, Title = "", Object = { } };
            var u = _context.Users.FirstOrDefault(x => x.is_active == true && x.ID == id);
            u.is_active = false;

            _context.Users.Update(u);
            _context.SaveChanges();
            rs.Title = "Xóa thành công!";
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
        [HttpGet]
        public IActionResult DetailTransaction(int id)
        {
            var rs = new Result() { HasError = false, Title = "", Object = { } };

            try
            {
                rs.Object = (from a in _context.Transactions.Where(x => x.is_active == true && x.ID == id)
                             join b in _context.ServiceProviders.Where(x => x.is_active == true) on a.service_id equals b.ID
                             join c in _context.Users.Where(x => x.is_active == true) on a.user_id equals c.ID
                             select new
                             {
                                 a.ID,
                                 a.value,
                                 a.user_id,
                                 a.service_id,
                                 a.phone,
                                 b.picture,
                                 b.name,
                                 c.fullname
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
        public IActionResult InsertTransaction([FromBody] ModelTransaction model)
        {
            var rs = new Result() { HasError = false, Title = "", Object = { } };

            try
            {
                Transaction item = new Transaction()
                {
                    service_id = model.IdService,
                    value = model.Value,
                    phone = model.Phone,
                    user_id = model.IdUser,
                    create_at = DateTime.Now,
                    create_by = "Admin",
                    is_active = true,
                };
                _context.Transactions.Add(item);
                _context.SaveChanges();
            }
            catch (Exception ex)
            {
                rs.HasError = true;
                rs.Title = "HasError! " + ex.InnerException.Message;
            }

            return Json(rs);
        }
        [HttpPost]
        public IActionResult EditTransaction([FromBody] ModelTransaction model)
        {
            var rs = new Result() { HasError = false, Title = "", Object = { } };

            try
            {
                Transaction item = _context.Transactions.Where(x => x.is_active == true && x.ID == model.Id).FirstOrDefault();
                item.service_id = model.IdService;
                item.value = model.Value;
                item.phone = model.Phone;
                item.user_id = model.IdUser;

                _context.Transactions.Update(item);
                _context.SaveChanges();
            }
            catch (Exception ex)
            {
                rs.HasError = true;
                rs.Title = "HasError! " + ex.InnerException.Message;
            }

            return Json(rs);
        }
        [HttpGet]
        public IActionResult RemoveTransaction(int id)
        {
            Result rs = new Result { HasError = false, Title = "", Object = { } };
            var u = _context.Transactions.FirstOrDefault(x => x.is_active == true && x.ID == id);
            u.is_active = false;

            _context.Transactions.Update(u);
            _context.SaveChanges();
            rs.Title = "Xóa thành công!";
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
                            ).OrderBy(x=>x.picture).ThenBy(x => x.value).ToList();


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
        [HttpPost]
        public IActionResult InsertSubcription([FromBody] ModelSubcription model)
        {
            var rs = new Result() { HasError = false, Title = "", Object = { } };

            try
            {
                Subscription item = _context.Subscriptions.Where(x => x.is_active == true && x.service_id == model.IdService && x.value == model.Value).FirstOrDefault();
                if (item != null)
                {
                    rs.HasError = true;
                    rs.Title = "Value is exists!";
                }
                else
                {
                    item = new Subscription()
                    {
                        service_id = model.IdService,
                        value = model.Value,
                        create_at = DateTime.Now,
                        create_by = "Admin",
                        is_active = true,
                    };
                    _context.Subscriptions.Add(item);
                    _context.SaveChanges();
                }
            }
            catch (Exception ex)
            {
                rs.HasError = true;
                rs.Title = "HasError! " + ex.InnerException.Message;
            }

            return Json(rs);
        }
        [HttpPost]
        public IActionResult EditSubcription([FromBody] ModelSubcription model)
        {
            var rs = new Result() { HasError = false, Title = "", Object = { } };

            try
            {
                Subscription item = _context.Subscriptions.Where(x => x.is_active == true && x.service_id == model.IdService && x.value == model.Value && x.ID != model.Id).FirstOrDefault();
                if (item != null)
                {
                    rs.HasError = true;
                    rs.Title = "Value is exists!";
                }
                else
                {
                    item = _context.Subscriptions.Where(x => x.is_active == true && x.ID == model.Id).FirstOrDefault();
                    item.service_id = model.IdService;
                    item.value = model.Value;

                    _context.Subscriptions.Update(item);
                    _context.SaveChanges();
                }
            }
            catch (Exception ex)
            {
                rs.HasError = true;
                rs.Title = "HasError! " + ex.InnerException.Message;
            }

            return Json(rs);
        }
        [HttpGet]
        public IActionResult DetailSubcription(int id)
        {
            var rs = new Result() { HasError = false, Title = "", Object = { } };

            try
            {
                rs.Object = (from a in _context.Subscriptions.Where(x => x.is_active == true && x.ID == id)
                             join b in _context.ServiceProviders.Where(x => x.is_active == true) on a.service_id equals b.ID
                             select new
                             {
                                 a.ID,
                                 b.picture,
                                 b.name,
                                 a.service_id,
                                 a.value
                             }).FirstOrDefault();
            }
            catch (Exception ex)
            {
                rs.HasError = true;
                rs.Title = "HasError! " + ex.InnerException.Message;
            }

            return Json(rs);
        }
        [HttpGet]
        public IActionResult RemoveSubcription(int id)
        {
            Result rs = new Result { HasError = false, Title = "", Object = { } };
            var u = _context.Subscriptions.FirstOrDefault(x => x.is_active == true && x.ID == id);
            u.is_active = false;

            _context.Subscriptions.Update(u);
            _context.SaveChanges();
            rs.Title = "Xóa thành công!";
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
        [HttpPost]
        public IActionResult InsertServiceCard([FromBody] ModelServiceCard model)
        {
            var rs = new Result() { HasError = false, Title = "", Object = { } };

            try
            {
                ServiceProviderr item = _context.ServiceProviders.Where(x => x.is_active == true && x.name == model.Name).FirstOrDefault();
                if (item != null)
                {
                    rs.HasError = true;
                    rs.Title = "Name is exists!";
                }
                else
                {
                    item = new ServiceProviderr()
                    {
                        name = model.Name,
                        picture = model.Picture,
                        create_at = DateTime.Now,
                        create_by = "Admin",
                        is_active = true,
                    };
                    _context.ServiceProviders.Add(item);
                    _context.SaveChanges();
                }
            }
            catch (Exception ex)
            {
                rs.HasError = true;
                rs.Title = "HasError! " + ex.InnerException.Message;
            }

            return Json(rs);
        }
        [HttpPost]
        public IActionResult EditServiceCard([FromBody] ModelServiceCard model)
        {
            var rs = new Result() { HasError = false, Title = "", Object = { } };

            try
            {
                ServiceProviderr item = _context.ServiceProviders.Where(x => x.is_active == true && x.name == model.Name && x.ID != model.Id).FirstOrDefault();
                if (item != null)
                {
                    rs.HasError = true;
                    rs.Title = "Name is exists!";
                }
                else
                {
                    item = _context.ServiceProviders.Where(x => x.is_active == true && x.ID == model.Id).FirstOrDefault();
                    item.name = model.Name;
                    item.picture = model.Picture;

                    _context.ServiceProviders.Update(item);
                    _context.SaveChanges();
                }
            }
            catch (Exception ex)
            {
                rs.HasError = true;
                rs.Title = "HasError! " + ex.InnerException.Message;
            }

            return Json(rs);
        }
        [HttpGet]
        public IActionResult DetailServiceCard(int id)
        {
            var rs = new Result() { HasError = false, Title = "", Object = { } };

            try
            {
                rs.Object = (from a in _context.ServiceProviders.Where(x => x.is_active == true && x.ID == id)
                             select new
                             {
                                 a.ID,
                                 a.name,
                                 a.picture
                             }).FirstOrDefault();
            }
            catch (Exception ex)
            {
                rs.HasError = true;
                rs.Title = "HasError! " + ex.InnerException.Message;
            }

            return Json(rs);
        }
        [HttpGet]
        public IActionResult RemoveServiceCard(int id)
        {
            Result rs = new Result { HasError = false, Title = "", Object = { } };
            var u = _context.ServiceProviders.FirstOrDefault(x => x.is_active == true && x.ID == id);
            u.is_active = false;

            _context.ServiceProviders.Update(u);
            _context.SaveChanges();
            rs.Title = "Xóa thành công!";
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
    public class ModelServiceCard
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Picture { get; set; }
    }
    public class ModelSubcription
    {
        public int Id { get; set; }
        public int IdService { get; set; }
        public int Value { get; set; }
    }
    public class ModelTransaction
    {
        public int Id { get; set; }
        public int IdService { get; set; }
        public int IdUser { get; set; }
        public int Value { get; set; }
        public string Phone { get; set; }
    }
}
