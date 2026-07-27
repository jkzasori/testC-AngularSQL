angular.module('empleadosApp').factory('EmpleadoService', function($q, $timeout) {

  var datos = [
    { documento: 2000101, nombres: 'Carlos', apellidos: 'Gomez Rojas',     departamento: 'Tecnologia',      salario: 3200000 },
    { documento: 2000102, nombres: 'Andrea', apellidos: 'Martinez Diaz',   departamento: 'Calidad',         salario: 3500000 },
    { documento: 2000103, nombres: 'Luis',   apellidos: 'Perez Castro',    departamento: 'Tecnologia',      salario: 6800000 },
    { documento: 2000104, nombres: 'Maria',  apellidos: 'Lopez Vargas',    departamento: 'Tecnologia',      salario: 8200000 },
    { documento: 2000105, nombres: 'Jorge',  apellidos: 'Hernandez Silva', departamento: 'Infraestructura', salario: 2800000 },
    { documento: 2000106, nombres: 'Paula',  apellidos: 'Sanchez Moreno',  departamento: 'Datos',           salario: 4100000 },
    { documento: 2000107, nombres: 'Felipe', apellidos: 'Ramirez Ortiz',   departamento: 'Tecnologia',      salario: 3100000 },
    { documento: 2000108, nombres: 'Camila', apellidos: 'Torres Rincon',   departamento: 'Datos',           salario: 5500000 }
  ];

  return {
    listar: function() {
      var deferred = $q.defer();
      $timeout(function() { deferred.resolve(angular.copy(datos)); }, 600);
      return deferred.promise;
    },

    // Simula una busqueda contra el backend
    buscar: function(texto) {
      var deferred = $q.defer();
      $timeout(function() {
        var t = (texto || '').toLowerCase();
        deferred.resolve(datos.filter(function(e) {
          return e.nombres.toLowerCase().indexOf(t) !== -1 ||
                 e.apellidos.toLowerCase().indexOf(t) !== -1;
        }));
      }, 300);
      return deferred.promise;
    },

    crear: function(emp) {
      var deferred = $q.defer();
      setTimeout(function() {
        datos.push(angular.copy(emp));
        deferred.resolve(angular.copy(emp));
      }, 400);
      return deferred.promise;
    }
  };
});
