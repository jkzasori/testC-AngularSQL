using BackendTest.Domain.Entities;

namespace BackendTest.Application.Interfaces;

public interface IEmpleadoRepository
{
    Task<(List<Empleado> Items, int TotalCount)> GetPagedAsync(int page, int pageSize, string? departamento);
    Task<Empleado?> GetByDocumentoAsync(string documento);
    Task<Empleado> CreateAsync(Empleado empleado);
    Task<bool> ExisteDocumentoOEmailAsync(string documento, string email);
    Task AplicarAumentoSalarialAsync(string departamento, decimal porcentaje, string usuario);
}
