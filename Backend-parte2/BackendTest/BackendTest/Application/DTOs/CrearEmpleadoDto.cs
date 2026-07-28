using System.ComponentModel.DataAnnotations;

namespace BackendTest.Application.DTOs;

public class CrearEmpleadoDto
{
    [Required, StringLength(20)]
    public string Documento { get; set; } = string.Empty;

    [Required, StringLength(100)]
    public string Nombres { get; set; } = string.Empty;

    [Required, StringLength(100)]
    public string Apellidos { get; set; } = string.Empty;

    [Required, EmailAddress, StringLength(150)]
    public string Email { get; set; } = string.Empty;

    [Required, StringLength(100)]
    public string Cargo { get; set; } = string.Empty;

    [Required, StringLength(100)]
    public string Departamento { get; set; } = string.Empty;

    [Range(0.01, double.MaxValue, ErrorMessage = "El salario debe ser mayor a 0.")]
    public decimal Salario { get; set; }

    [Required]
    public DateTime FechaIngreso { get; set; }
}
