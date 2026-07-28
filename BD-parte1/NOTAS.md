1.1 Para la creación de las tablas se creo un script y se decidió guardar los datos de la tabla stagin en ununa tabla persistente para poder revisar si así se quiere más adelante 

1.2 Para esta parte tocó investigar un poco, en principio se pretendió utilizar OPENROWSET y Microsoft.ACE.OLEDB.12.0  para leer el archivo xlsx directamente sin tener que convertirlo en csv; pero despues de instalar drivers y coonfigurar comenzó a apresentar fallas y se deciío optar por la solución más nativa y conocida de sql como lo es bulk insert para acortar tiempo y continuar con la prueba; sin embargo en este caso fue necesario convertir las pestañas especifas del excel senior en csv para poder procesarlas

1.3 Inicialmente fue necesario mdodifcar la tabla historico en el script(aunque puede hacerse con un alter) porque se requiere en el procedimiento almacenado registrar la acción UPDATE_SALARIO que no está en esa lista definida incialmente y or el check fallaría
