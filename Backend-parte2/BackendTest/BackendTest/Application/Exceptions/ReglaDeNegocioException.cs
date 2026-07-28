namespace BackendTest.Application.Exceptions;

public class ReglaDeNegocioException : Exception
{
    public ReglaDeNegocioException(string message) : base(message) { }
}
