1.1 Para la creación de las tablas se creo un script y se decidió guardar los datos de la tabla stagin en ununa tabla persistente para poder revisar si así se quiere más adelante 

1.2 Para esta parte tocó investigar un poco, en principio se pretendió utilizar OPENROWSET y Microsoft.ACE.OLEDB.12.0  para leer el archivo xlsx directamente sin tener que convertirlo en csv; pero despues de instalar drivers y coonfigurar comenzó a apresentar fallas y se deciío optar por la solución más nativa y conocida de sql como lo es bulk insert para acortar tiempo y continuar con la prueba; sin embargo en este caso fue necesario convertir las pestañas especifas del excel senior en csv para poder procesarlas

1.3 Inicialmente fue necesario mdodifcar la tabla historico en el script(aunque puede hacerse con un alter) porque se requiere en el procedimiento almacenado registrar la acción UPDATE_SALARIO que no está en esa lista definida incialmente y or el check fallaría

1.4 
    1. Crearía un non-clustered, primero porque EmpleadoId ya es el índice clustered y solo hay uno por tabla y lo crearía así (Departamento, FechaIngreso) porque es más fácil por departamento y ya elimina un poco de registros y luego se aplica el filtro por fecha

    2. Si dos usuarios lo ejecutan sobre el mismo departamento se corre el riesgo de que ambos usuarios validen con datos actuales, pero a la hora de realizar el aumento primero se actualice con un usuario y luego con los resultados de ese usuario se actualice o se haga aumentos, quedando los empleados con aumento muy superior a lo que posiblemente se quiere; para mitigarlo tocaría bloquear la ejecución durante la transacción y mientras se va realizando la ejecución para el primer usuario, el segundo debe esperar a que se termine para que se realice su ejecuión 

    3. Para evitar insertar datos directamente sobre una tabla con datos posiblemente en producción o con informiación importante sin haber validado antes los posibles errores que esa misma información pueda tener, campos duplicados, null, etc; 