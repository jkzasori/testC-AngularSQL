-- Creación de la tabla de empleados
CREATE TABLE Empleados (
    EmpleadoId int identity(1,1) primary key,
    Documento varchar(20) not null,
    Nombres nvarchar(100) not null,
    Apellidos nvarchar(100) not null,
    Email varchar(150) not null,
    Cargo nvarchar(100) not null,
    Departamento nvarchar(100) not null,
    Salario decimal(14,2) not null,
    FechaIngreso date not null,
    FechaCreacion datetime2 not null default sysdatetime(),
    constraint UQ_Empleados_Documento unique (Documento),
    constraint UQ_Empleados_Email unique (Email),
    constraint CK_Empleados_Salario check (Salario > 0)
)
-- Los UNIQUE en Documento/Email ya crean su propio índice, así que 
-- no hace falta un índice adicional 
-- El check de salario evita que un dato inválido llegue a la tabla 
-- final incluso si algún proceso futuro se salta la validación de staging


-- Creación de la tabla de empleadosHistorico
CREATE TABLE EmpleadosHistorico  (
    HistoricoId int identity(1,1) primary key,
    EmpleadoId int not null,
    Documento varchar(20) not null,
    Accion varchar(20) not null,
    FechaAccion datetime2 not null default sysdatetime(),
    Usuario nvarchar(100) not null default suser_name(),
    Observacion nvarchar(500) null,
    ALTER TABLE EmpleadosHistorico DROP CONSTRAINT CK_EmpleadosHistorico_Accion;

ALTER TABLE EmpleadosHistorico
ADD CONSTRAINT CK_EmpleadosHistorico_Accion
    CHECK (Accion IN ('INSERT','UPDATE','DELETE','UPDATE_SALARIO'));
    constraint FK_EmpleadosHistorico_Empleado foreign key (EmpleadoId) references Empleados(EmpleadoId),
    INDEX IX_EmpleadosHistorico_EmpleadoId (EmpleadoId)
)
-- La FK garantiza que no quede un registro de histórico huérfano; 
-- El índice en EmpleadoId acelera "dame el historial de este empleado", que es la consulta típica de auditoría


-- Creación de la tabla de EmpleadosStaging 
CREATE TABLE EmpleadosStaging (
    StagingId int identity(1,1) primary key,
    Documento varchar(20) null,
    Nombres nvarchar(100) null,
    Apellidos nvarchar(100) null,
    Email varchar(150) null,
    Cargo nvarchar(100) null,
    Departamento nvarchar(100) null,
    Salario varchar(52) null,
    FechaIngreso varchar(50) null
)

-- Aquí todo es NULL permitido y varchar o nvarchar, a propósito
-- Los datos se montan como están para validarlos 
-- Se decide crear una tabla persistente para poder revisar si así se quiere más adelante