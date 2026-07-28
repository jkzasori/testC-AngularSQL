using System.ComponentModel.DataAnnotations;

namespace BackendTest.Application.DTOs;

public class AumentoSalarialDto
{
    [Required, StringLength(50)]
    public string Departamento { get; set; } = string.Empty;

    [Range(0, 50, ErrorMessage = "El porcentaje debe estar entre 0 y 50.")]
    public decimal PorcentajeAumento { get; set; }

    [Required, StringLength(50)]
    public string Usuario { get; set; } = string.Empty;
}
