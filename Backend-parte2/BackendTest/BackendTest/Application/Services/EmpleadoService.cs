using BackendTest.Application.DTOs;
using BackendTest.Application.Exceptions;
using BackendTest.Application.Interfaces;
using BackendTest.Domain.Entities;

namespace BackendTest.Application.Services;

public class EmpleadoService : IEmpleadoService
{
    private readonly IEmpleadoRepository _repository;

    public EmpleadoService(IEmpleadoRepository repository) => _repository = repository;

    public async Task<PagedResultDto<EmpleadoDto>> GetEmpleadosAsync(int page, int pageSize, string? departamento)
    {
        if (page < 1) page = 1;
        if (pageSize < 1 || pageSize > 100) pageSize = 20;

        var (items, totalCount) = await _repository.GetPagedAsync(page, pageSize, departamento);

        return new PagedResultDto<EmpleadoDto>
        {
            Items = items.Select(MapToDto).ToList(),
            Page = page,
            PageSize = pageSize,
            TotalCount = totalCount
        };
    }

    public async Task<EmpleadoDto> GetByDocumentoAsync(string documento)
    {
        var empleado = await _repository.GetByDocumentoAsync(documento)
            ?? throw new EmpleadoNotFoundException(documento);

        return MapToDto(empleado);
    }

    public async Task<EmpleadoDto> CrearEmpleadoAsync(CrearEmpleadoDto dto)
    {
        if (await _repository.ExisteDocumentoOEmailAsync(dto.Documento, dto.Email))
            throw new ReglaDeNegocioException("Ya existe un empleado con ese documento o email.");

        var empleado = new Empleado
        {
            Documento = dto.Documento,
            Nombres = dto.Nombres,
            Apellidos = dto.Apellidos,
            Email = dto.Email,
            Cargo = dto.Cargo,
            Departamento = dto.Departamento,
            Salario = dto.Salario,
            FechaIngreso = dto.FechaIngreso
        };

        var creado = await _repository.CreateAsync(empleado);
        return MapToDto(creado);
    }

    public Task AplicarAumentoSalarialAsync(AumentoSalarialDto dto) =>
        _repository.AplicarAumentoSalarialAsync(dto.Departamento, dto.PorcentajeAumento, dto.Usuario);

    private static EmpleadoDto MapToDto(Empleado e) => new()
    {
        EmpleadoId = e.EmpleadoId,
        Documento = e.Documento,
        Nombres = e.Nombres,
        Apellidos = e.Apellidos,
        Email = e.Email,
        Cargo = e.Cargo,
        Departamento = e.Departamento,
        Salario = e.Salario,
        FechaIngreso = e.FechaIngreso
    };
}
