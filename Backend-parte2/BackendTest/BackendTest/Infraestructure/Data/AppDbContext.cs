using BackendTest.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace BackendTest.Infrastructure.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Empleado> Empleados { get; set; }
    }
}
