using BackendTest.Application.DTOs;
using BackendTest.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace BackendTest.Api.Controllers;

[ApiController]
[Route("api/empleados")]
public class EmpleadosController : ControllerBase
{
    private readonly IEmpleadoService _empleadoService;

    public EmpleadosController(IEmpleadoService empleadoService) => _empleadoService = empleadoService;

    [HttpGet]
    public async Task<ActionResult<PagedResultDto<EmpleadoDto>>> GetEmpleados(
        [FromQuery] int page = 1, [FromQuery] int pageSize = 20, [FromQuery] string? departamento = null)
    {
        var resultado = await _empleadoService.GetEmpleadosAsync(page, pageSize, departamento);
        return Ok(resultado);
    }

    [HttpGet("{documento}")]
    public async Task<ActionResult<EmpleadoDto>> GetByDocumento(string documento)
    {
        var empleado = await _empleadoService.GetByDocumentoAsync(documento);
        return Ok(empleado);
    }

    [HttpPost]
    public async Task<ActionResult<EmpleadoDto>> CrearEmpleado(CrearEmpleadoDto dto)
    {
        var creado = await _empleadoService.CrearEmpleadoAsync(dto);
        return CreatedAtAction(nameof(GetByDocumento), new { documento = creado.Documento }, creado);
    }

    [HttpPost("aumento")]
    public async Task<IActionResult> AplicarAumento(AumentoSalarialDto dto)
    {
        await _empleadoService.AplicarAumentoSalarialAsync(dto);
        return NoContent();
    }
}
