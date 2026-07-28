IF OBJECT_ID('vw_EmpleadosStagingCarga') IS NOT NULL
    DROP VIEW vw_EmpleadosStagingCarga;
GO
-- Necesario para ocultar la primera columna que es el id y es un dato que no llega del archivo
CREATE VIEW vw_EmpleadosStagingCarga AS
SELECT Documento, Nombres, Apellidos, Email, Cargo, Departamento, Salario, FechaIngreso
FROM EmpleadosStaging;
GO

SET NOCOUNT ON;

-- --- Cargar staging desde el excel
TRUNCATE TABLE EmpleadosStaging;


BULK INSERT vw_EmpleadosStagingCarga
FROM 'C:\Temp\datos_prueba_sqlCorregido.csv'
WITH (
    FIRSTROW = 2,              -- indica que ignore la primera fila de los títulos y pase a la segunda de valores
    FIELDTERMINATOR = ';',     -- indica la separación por punto y coma ;
    ROWTERMINATOR = '0x0d0a',    -- maneja correctamente los saltos de líena en windows
    CODEPAGE = '65001',        -- usa UTF-8
    TABLOCK                    -- ua bloqueo de tabla para mejorar el rendimiento de insertado masivo
);

DECLARE @FilasStaging INT = (SELECT COUNT(*) FROM EmpleadosStaging);

IF @FilasStaging <> 120
BEGIN
    DECLARE @MsgConteo NVARCHAR(400) =
        'La carga a staging trajo ' + CAST(@FilasStaging AS VARCHAR(10)) +
        ' registros, se esperaban 120. Revisa los mensajes de BULK INSERT (filas descartadas por error de conversion).';

    THROW 51002, @MsgConteo, 1;
END



-- ---  Validar staging, rechazar si hay errores e insertar todo-o-nada si esta limpio
BEGIN TRY

    IF OBJECT_ID('tempdb..#Errores') IS NOT NULL DROP TABLE #Errores;
    CREATE TABLE #Errores (Documento VARCHAR(50) NULL, Motivo VARCHAR(200) NOT NULL);

    -- se verifica si el documento está duplicado dentro del archivo
    INSERT INTO #Errores (Documento, Motivo)
    SELECT s.Documento, 'Documento duplicado dentro del archivo'
    FROM EmpleadosStaging s
    WHERE EXISTS (
        SELECT 1 FROM EmpleadosStaging s2
        WHERE s2.Documento = s.Documento AND s2.StagingId <> s.StagingId
    );

    --  se verifica si el documento ya existe en la tabla final
    INSERT INTO #Errores (Documento, Motivo)
    SELECT s.Documento, 'Documento ya existe en Empleados'
    FROM EmpleadosStaging s
    WHERE EXISTS (SELECT 1 FROM Empleados e WHERE e.Documento = s.Documento);

    --  se verifica si el email está duplicado dentro del archivo
    INSERT INTO #Errores (Documento, Motivo)
    SELECT s.Documento, 'Email duplicado dentro del archivo: ' + s.Email
    FROM EmpleadosStaging s
    WHERE s.Email IS NOT NULL
      AND EXISTS (
          SELECT 1 FROM EmpleadosStaging s2
          WHERE s2.Email = s.Email AND s2.StagingId <> s.StagingId
      );

    --  se verifica si el email ya existe en la tabla final
    INSERT INTO #Errores (Documento, Motivo)
    SELECT s.Documento, 'Email ya existe en Empleados'
    FROM EmpleadosStaging s
    WHERE EXISTS (SELECT 1 FROM Empleados e WHERE e.Email = s.Email);

    --  se verifica si el salario es invalido; es decir si es no numerico o <= 0
    INSERT INTO #Errores (Documento, Motivo)
    SELECT Documento, 'Salario invalido (no numerico o <= 0): ' + ISNULL(Salario, 'NULL')
    FROM EmpleadosStaging
    WHERE TRY_CAST(REPLACE(Salario, '.', '') AS DECIMAL(14,2)) IS NULL
       OR TRY_CAST(REPLACE(Salario, '.', '') AS DECIMAL(14,2)) <= 0;

    --  se verifica si la fecha de ingreso invalida
    INSERT INTO #Errores (Documento, Motivo)
    SELECT Documento, 'Fecha de ingreso invalida: ' + ISNULL(FechaIngreso, 'NULL')
    FROM EmpleadosStaging
    WHERE TRY_CAST(FechaIngreso AS DATE) IS NULL;

    --  se verifica si los campos obligatorios son nulos o vacios
    INSERT INTO #Errores (Documento, Motivo)
    SELECT Documento, 'Campo obligatorio nulo o vacio'
    FROM EmpleadosStaging
    WHERE NULLIF(LTRIM(RTRIM(Documento)), '') IS NULL
       OR NULLIF(LTRIM(RTRIM(Nombres)), '') IS NULL
       OR NULLIF(LTRIM(RTRIM(Apellidos)), '') IS NULL
       OR NULLIF(LTRIM(RTRIM(Email)), '') IS NULL;

    --  se verifica si si hay errores se reporta y rechaza toda la carga (nada se inserta)
    IF EXISTS (SELECT 1 FROM #Errores)
    BEGIN
        SELECT Documento, Motivo FROM #Errores ORDER BY Documento;
        THROW 51000, 'Carga rechazada: existen registros invalidos en staging. Ver detalle en el resultado anterior.', 1;
    END

    -- si todos los registros son validos se inserta en Empleados y se registra en EmpleadosHistorico, en una sola transaccion
    BEGIN TRANSACTION;

        DECLARE @Insertados TABLE (EmpleadoId INT, Documento VARCHAR(20));

        INSERT INTO Empleados (Documento, Nombres, Apellidos, Email, Cargo, Departamento, Salario, FechaIngreso)
        OUTPUT inserted.EmpleadoId, inserted.Documento INTO @Insertados (EmpleadoId, Documento)
        SELECT Documento, Nombres, Apellidos, Email, Cargo, Departamento,
               TRY_CAST(REPLACE(Salario, '.', '') AS DECIMAL(14,2)), TRY_CAST(FechaIngreso AS DATE)
        FROM EmpleadosStaging;

        INSERT INTO EmpleadosHistorico (EmpleadoId, Documento, Accion, Observacion)
        SELECT EmpleadoId, Documento, 'INSERT', 'Carga masiva inicial'
        FROM @Insertados;

    COMMIT TRANSACTION;

    PRINT 'Carga completada correctamente.';

END TRY
BEGIN CATCH
    IF XACT_STATE() <> 0
        ROLLBACK TRANSACTION;

    PRINT 'Carga rechazada. Motivo: ' + ERROR_MESSAGE();
    THROW;
END CATCH