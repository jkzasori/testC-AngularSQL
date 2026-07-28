angular.module('empleadosApp').directive('resumenSalarios', function() {
  return {
    restrict: 'E',
    scope: { empleados: '=' },
    template: '<div class="resumen">Total nomina: {{ total | currency:"$":0 }} — Promedio: {{ promedio | currency:"$":0 }}</div>',
    controller: function($scope) {

      function calcular() {
        console.log('calculando total...');
        var t = 0;
        angular.forEach($scope.empleados, function(e) { t += e.salario; });
        // total y promedio eran funciones y angular no sabe que tiene eso o cuál es el resultado 
        // entonces en cada render o digest en este caso, se ejecutaban dichas funciones 
        // cosa que no pasa con lasvariables y por eso se cambió a variables; para evitar 
        // esa ejecución innecesaria
        $scope.total = t;
        $scope.promedio = $scope.empleados.length ? t / $scope.empleados.length : 0;
      };

      $scope.$watchCollection('empleados', calcular);
    }
  };
});
