using Microsoft.EntityFrameworkCore;
using System.Xml;

namespace WebApplication2.Models
{
    public class MyDbContext : DbContext
    {
        public MyDbContext(DbContextOptions<MyDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<ServiceProvider> ServiceProviders { get; set; }
        public DbSet<Feedback> Feedbacks { get; set; }
        public DbSet<Transaction> Transactions { get; set; }
        public DbSet<Subscription> Subscriptions { get; set; }
    }
}
