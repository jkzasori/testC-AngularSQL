namespace BackendTest.Application.Exceptions;

public class EmpleadoNotFoundException : Exception
{
    public EmpleadoNotFoundException(string documento)
        : base($"No se encontro un empleado con documento '{documento}'.") { }
}
