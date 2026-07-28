using BackendTest.Application.DTOs;

namespace BackendTest.Application.Interfaces;

public interface IEmpleadoService
{
    Task<PagedResultDto<EmpleadoDto>> GetEmpleadosAsync(int page, int pageSize, string? departamento);
    Task<EmpleadoDto> GetByDocumentoAsync(string documento);
    Task<EmpleadoDto> CrearEmpleadoAsync(CrearEmpleadoDto dto);
    Task AplicarAumentoSalarialAsync(AumentoSalarialDto dto);
}
