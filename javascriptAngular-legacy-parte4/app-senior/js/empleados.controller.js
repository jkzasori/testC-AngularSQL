angular.module('empleadosApp').controller('EmpleadosCtrl', function($scope, $interval, EmpleadoService) {

  $scope.empleados = [];
  $scope.resultados = [];
  $scope.nuevo = {};
  $scope.busqueda = '';
  $scope.totalPeticiones = 0;

  EmpleadoService.listar().then(function(data) {
    $scope.empleados = data;
    // Se estaba guardando el mismo data dos veces en el 
    // mismo array(Se estaba haciendo referencia al mismo espacio en memoria) y ng-repeat lanzaba ngRepeat:dupes 
    // Para soloculionarlo se copia el array con angular.copy para que ambas listas sean independientes
    $scope.resultados = angular.copy(data);
  });

  // Cada tecla del buscador dispara una peticion "al servidor"
  $scope.buscar = function() {
    $scope.totalPeticiones++;
    EmpleadoService.buscar($scope.busqueda).then(function(data) {
      $scope.resultados = data;
    });
  };

  $scope.guardar = function() {
    EmpleadoService.crear($scope.nuevo).then(function(emp) {
      $scope.empleados.push(emp);
      $scope.resultados.push(emp);
      $scope.nuevo = {};
    });
  };

  // No se estaba destruyendo el interval, por lo que se debe hacerse
 var intervalo = $interval(function() {
    $scope.ultimaActualizacion = new Date();
  }, 1000);

  $scope.$on('$destroy', function() {
    $interval.cancel(intervalo);
  });
});
