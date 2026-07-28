using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using BackendTest.Application.Exceptions;
using BackendTest.Application.Interfaces;
using BackendTest.Domain.Entities;
using BackendTest.Infrastructure.Data;

namespace BackendTest.Infrastructure.Repositories;

public class EmpleadoRepository : IEmpleadoRepository
{
    private readonly AppDbContext _context;

    public EmpleadoRepository(AppDbContext context) => _context = context;

    public async Task<(List<Empleado> Items, int TotalCount)> GetPagedAsync(int page, int pageSize, string? departamento)
    {
        var query = _context.Empleados.AsNoTracking().AsQueryable();

        if (!string.IsNullOrWhiteSpace(departamento))
            query = query.Where(e => e.Departamento == departamento);

        var totalCount = await query.CountAsync();
        var items = await query
            .OrderBy(e => e.EmpleadoId)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (items, totalCount);
    }

    public async Task<Empleado?> GetByDocumentoAsync(string documento) =>
        await _context.Empleados.AsNoTracking().FirstOrDefaultAsync(e => e.Documento == documento);

    public async Task<bool> ExisteDocumentoOEmailAsync(string documento, string email) =>
        await _context.Empleados.AnyAsync(e => e.Documento == documento || e.Email == email);

    public async Task<Empleado> CreateAsync(Empleado empleado)
    {
        _context.Empleados.Add(empleado);
        await _context.SaveChangesAsync();
        return empleado;
    }

    public async Task AplicarAumentoSalarialAsync(string departamento, decimal porcentaje, string usuario)
    {
        try
        {
            await _context.Database.ExecuteSqlInterpolatedAsync(
                $"EXEC sp_ProcesarAumentoSalarial @Departamento = {departamento}, @Porcentaje = {porcentaje}, @Usuario = {usuario}");
        }
        catch (SqlException ex)
        {
            throw new ReglaDeNegocioException(ex.Message);
        }
    }
}
