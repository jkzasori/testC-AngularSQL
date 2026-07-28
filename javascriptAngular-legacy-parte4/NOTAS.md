
1. Reporte de usuario:
Causa: Al momento de listar se estaba haciendo referencia al mismo espacio en memoria en 2 variables distintas por lo que alguardar se guardaba dos veces lo mismo y eso generaba el error
Solución: Para lo solución se copia el array con angular.copy para que ambas listas tengan referencias diferentes y por ende sean independientes y se puedan guardar sin generar el error ngRepeat:dupes que lanzaba ng-repeat
2. Rendimiento: 
Cause: Se está llamando una función directamente y Angular no sabe que devuelve dicha función o si algo dentro de ella cambió, por lo que ve necesario vovler a ejecutar dichas funciones de total y promedio.
Solución: Guardar los datos de las operaciones en variables, en este caso Angular sabe si esos datos cambiaron o no y no vuelve a ejecutar el cálculo

3. Buscador: 
Causa: Falta el debounce y los tiempos de respuesta de la busqueda pueden ser más grandes que lo esperado por lo que las respuestas puede que se tracen o no lleguen en el mismo orden que se realizaron(Suele suceder en proyectos frotend si no se controla)
Solución: Agregar el debounde en el input con ng-model-options="{ debounce: 300 }"
Para evitar que una petición vijo pise los resultados del termino actual lo más apropiado sería descartar las respuestas viejas al recibirlas y solo dejar las nuevas para ello se podría guardar una copia del texto que se busca a al hora de ejecutar la petición (aunque también se puede hacer con un contador o un dato que permita realizar o identifcar las peticiones por así decirlo), se hace comparación en caso de que los datos coincidan se muestran los resultados y en caso que no se se descartan esos resultados

$scope.buscar = function() {
  $scope.totalPeticiones++;
  var textoBuscado = $scope.busqueda; petición

  EmpleadoService.buscar(textoBuscado).then(function(data) {
    if (textoBuscado === $scope.busqueda) {la respuesta?
      $scope.resultados = data;
    }
  });
};


4. Fuga de memoria: 
Causa: Se busco en el archivo controller cualquier cosa que se ejecuta siempre o sola como los setinterval, interval, listener, etc y se encontró que existe un interval que no se desmonta por así decirlo o se cancela, lo que puede ser potencialmente un memori leack.
Solución: Se guardó la referencia del interval en una variable y se Desmontó, destruyó o canceló ese interval con un destroy

var intervalo = $interval(function() {
  $scope.ultimaActualizacion = new Date();
}, 1000);

$scope.$on('$destroy', function() {
  $interval.cancel(intervalo);
});

5. Migración de la directiva resumen.salario a Angular Moderno: 

Por qué desaparece el problema de rendimiento: El problema de rendimiento desaparece porque lo que pasa es que computed() no funciona como una función normal que Angular esté ejecutando una y otra vez para ver si cambió algo; es más como cuando uno guarda el resultado de una operación en una variable porque se sabe que mientras los datos no cambien, el resultado va a ser el mismo; cosa que en angular.js(angular 1) sí pasaba porque no se tenía forma de saber si la función iba a dar resultados diferentes. Con la versión moderna ahora cada computed conoce exactamente de qué señales depende; es decir, si cambia el reloj pero empleados() sigue igual, el computed no hace nada y conserva el valor que tenía porque sabe que la información de la que depende no cambió y allí es donde se gana mucho rendimiento.

Casos seguiría existiendo el problema: puede haber casos donde el rendimiento vuelva a verse afectado; por jemplo, si empleados() cambia a cada rato, podrían ser cada 100 ms, por ejemplo; pues el computed si va a recalcular porque realmente los datos cambiaron y no tiene sentido que use el valor anterior. En ese caso la actualización de la información de forma constante causa el problema, y si además se tienen un montón de registro; el recorrrer todos esos registros cada vez tambien causa problemas; entonces, tocaria buscar otra solución, como un debounce, paginación o ir actualizando solo el total sin volver a recorrer todo