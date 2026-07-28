using BackendTest.Application.Exceptions;
using Microsoft.AspNetCore.Mvc;

namespace BackendTest.Api.Middleware;

public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;

    public ExceptionHandlingMiddleware(RequestDelegate next) => _next = next;

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            var (statusCode, title) = ex switch
            {
                EmpleadoNotFoundException => (StatusCodes.Status404NotFound, "Empleado no encontrado"),
                ReglaDeNegocioException => (StatusCodes.Status400BadRequest, "Regla de negocio violada"),
                _ => (StatusCodes.Status500InternalServerError, "Error interno del servidor")
            };

            var problemDetails = new ProblemDetails
            {
                Status = statusCode,
                Title = title,
                Detail = ex.Message,
                Instance = context.Request.Path
            };

            context.Response.ContentType = "application/problem+json";
            context.Response.StatusCode = statusCode;
            await context.Response.WriteAsJsonAsync(problemDetails);
        }
    }
}
