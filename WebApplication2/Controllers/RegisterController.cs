using ERP_Project.Commom;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OnlineMobileRecharged.Common.CommonModels;
using System.ComponentModel.DataAnnotations;
using System.Security.Cryptography;
using System.Text;
using WebApplication2.Controllers;
using WebApplication2.Models;

namespace OnlineMobileRecharged.Controllers
{
    
    public class RegisterController : Controller
    {
        private readonly MyDbContext _context;
        private readonly ILogger<RegisterController> _logger;

        public RegisterController(ILogger<RegisterController> logger, MyDbContext context)
        {
            _logger = logger;
            _context = context;
        }
        [HttpGet]
        public IActionResult Index()
        {
           return View();
        }
        [HttpPost]
        public IActionResult Register([FromBody] ModelRegister model)
        {
            Result rs = new Result { HasError = false, Title = "", Object = { } };
            var u = _context.Users.FirstOrDefault(x => x.is_active == true && x.username == model.UserName);
            if (u != null)
            {
                rs.HasError = true;
                rs.Title = "Tài khoản đăng nhập";
            }
            else
            {
                u = _context.Users.FirstOrDefault(x => x.is_active == true && x.phone == model.Phone);
                if (u != null)
                {
                    rs.HasError = true;
                    rs.Title = "Số điện thoại";
                }
                else
                {
                    u = _context.Users.FirstOrDefault(x => x.is_active == true && x.email == model.Email);
                    if (u != null)
                    {
                        rs.HasError = true;
                        rs.Title = "Email";
                    }
                    else
                    {
                        using (SHA256 sha256Hash = SHA256.Create())
                        {
                            string hashedPassword = HashPassword(sha256Hash, model.Password);
                            u = new User()
                            {
                                username = model.UserName,
                                phone = model.Phone,
                                email = model.Email,
                                fullname = model.FullName,
                                password = hashedPassword,
                                address = model.Address,
                                role = 0,
                                amount = 0,
                                create_at = DateTime.Now,
                                create_by = "Admin",
                                is_active = true,
                            };
                            _context.Users.Add(u);
                            _context.SaveChanges();
                            rs.Title = "Đăng kí thành công!";
                        }
                    }
                }
            }
            return Json(rs);
        }
        public static string HashPassword(HashAlgorithm hashAlgorithm, string input)
        {
            // Chuyển đổi input thành một mảng bytes và tính toán mã hash
            byte[] data = hashAlgorithm.ComputeHash(Encoding.UTF8.GetBytes(input));

            // Tạo một StringBuilder để xây dựng chuỗi kết quả
            StringBuilder builder = new StringBuilder();

            // Duyệt qua từng byte của mảng hash và chuyển đổi nó thành ký tự hexa
            foreach (byte b in data)
            {
                builder.Append(b.ToString("x2"));
            }
            // Trả về chuỗi hexa đã được mã hóa
            return builder.ToString();
        }
    }
    public class ModelRegister
    {
        public string UserName { get; set; }
        public string Password { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public string FullName { get; set; }
        public string Address { get; set; }
    }
}
