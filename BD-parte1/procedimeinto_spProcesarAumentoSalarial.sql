CREATE OR ALTER PROCEDURE sp_ProcesarAumentoSalarial
    @Departamento VARCHAR(50),
    @Porcentaje DECIMAL(5,2),
    @Usuario VARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY

        -- validación de que el porcentaje esté entre 0 y 50
        IF @Porcentaje < 0 OR @Porcentaje > 50
        BEGIN
            THROW 50001, 'El porcentaje de aumento debe estar entre 0 y 50.', 1;
        END

        -- validación de que el departamento debe existir y tener al menos un empleado
        IF NOT EXISTS (SELECT 1 FROM Empleados WHERE Departamento = @Departamento)
        BEGIN
            THROW 50002, 'El departamento indicado no existe o no tiene empleados.', 1;
        END

        -- validación de que ningun salario  supere 20.000.000, si alguien lo supera no se aplica aumento a nadie
        IF EXISTS (
            SELECT 1 FROM Empleados
            WHERE Departamento = @Departamento
              AND Salario * (1 + @Porcentaje / 100.0) > 20000000
        )
        BEGIN
            THROW 50003, 'El aumento no se aplica porque hay un salario que superaria 20.000.000.', 1;
        END

        BEGIN TRANSACTION;

            DECLARE @CambiosSalario TABLE (
                EmpleadoId INT, Documento VARCHAR(20),
                SalarioAnterior DECIMAL(14,2), SalarioNuevo DECIMAL(14,2)
            );

            UPDATE Empleados
            SET Salario = Salario * (1 + @Porcentaje / 100.0)
            OUTPUT deleted.EmpleadoId, deleted.Documento, deleted.Salario, inserted.Salario
                INTO @CambiosSalario (EmpleadoId, Documento, SalarioAnterior, SalarioNuevo)
            WHERE Departamento = @Departamento;

            INSERT INTO EmpleadosHistorico (EmpleadoId, Documento, Accion, Usuario, Observacion)
            SELECT
                EmpleadoId, Documento, 'UPDATE_SALARIO', @Usuario,
                'Salario anterior: ' + CAST(SalarioAnterior AS VARCHAR(20)) +
                ', Salario nuevo: ' + CAST(SalarioNuevo AS VARCHAR(20))
            FROM @CambiosSalario;

            DECLARE @TotalEmpleadosActualizados INT = (SELECT COUNT(*) FROM @CambiosSalario);

        COMMIT TRANSACTION;

        PRINT 'Aumento aplicado a ' + CAST(@TotalEmpleadosActualizados AS VARCHAR(10)) + ' empleados del departamento ' + @Departamento + '.';

    END TRY
    BEGIN CATCH
        IF XACT_STATE() <> 0
            ROLLBACK TRANSACTION;

        THROW;
    END CATCH
END
