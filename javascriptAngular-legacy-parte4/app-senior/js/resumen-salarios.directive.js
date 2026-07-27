angular.module('empleadosApp').directive('resumenSalarios', function() {
  return {
    restrict: 'E',
    scope: { empleados: '=' },
    template: '<div class="resumen">Total nomina: {{ total() | currency:"$":0 }} — Promedio: {{ promedio() | currency:"$":0 }}</div>',
    controller: function($scope) {

      $scope.total = function() {
        console.log('calculando total...');
        var t = 0;
        angular.forEach($scope.empleados, function(e) { t += e.salario; });
        return t;
      };

      $scope.promedio = function() {
        if (!$scope.empleados || !$scope.empleados.length) return 0;
        return $scope.total() / $scope.empleados.length;
      };
    }
  };
});
