using ERP_Project.Commom;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Routing;
using System.Net.Http;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace ERP_Project.Middlewares
{
    public class LogginLogoutMiddleware
    {
        private readonly RequestDelegate _next;

        //Controller bat buoc dang nhap
        private static readonly HashSet<string> WhitelistedControllers = new HashSet<string>
        {
            "User",
            "Admin",
        };

        public LogginLogoutMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context)
        {
            var path = context.Request.Path.ToString();

            string controller = path.Split('/').Length > 1 ? path.Split('/')[1] : path.Split('/')[0];

            if (!WhitelistedControllers.Contains(controller))
            {
                await _next(context);
                return;
            }

            var check = context.Session.GetString(StaticUser.UserName);

            if (context.Session.GetString(StaticUser.UserName) == null && path != "/Login/Index")
            {
                context.Response.Redirect("/Login/Index");
            }

            await this._next(context);
        }

    }
    public static class LogginLogoutMiddlewareExtensions
    {
        public static IApplicationBuilder UseLogginLogout(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<LogginLogoutMiddleware>();
        }
    }
}
