angular.module('empleadosApp').controller('EmpleadosCtrl', function($scope, $interval, EmpleadoService) {

  $scope.empleados = [];
  $scope.resultados = [];
  $scope.nuevo = {};
  $scope.busqueda = '';
  $scope.totalPeticiones = 0;

  EmpleadoService.listar().then(function(data) {
    $scope.empleados = data;
    $scope.resultados = data;
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

  $interval(function() {
    $scope.ultimaActualizacion = new Date();
  }, 1000);
});
