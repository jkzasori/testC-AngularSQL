using BackendTest.Application.Interfaces;
using BackendTest.Application.Services;
using BackendTest.Infrastructure.Data;
using BackendTest.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;

namespace BackendTest.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        services.AddScoped<IEmpleadoService, EmpleadoService>();
        return services;
    }

    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<AppDbContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("ConexionSQL")));

        services.AddScoped<IEmpleadoRepository, EmpleadoRepository>();
        return services;
    }
}
