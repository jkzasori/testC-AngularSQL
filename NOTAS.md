
¿Qué estrategias conoces para migrarAngularJS → Angular de forma incremental?  y qué trade-offs tiene cada una?
 reescritura por módulos: Es más limpio; consiste en escribir cada módulo archivo por archivo y cuando está completo se hace el remplazo del módulo(se quita el viejo y se coloca el nuevo)
 trade-offs: Es bastante lento de hacer(lento pero seguro) porque vas a escribir archivo por archivo cambiando y se debe mantener el código actual para que no se rompa


Cómo correr el backend : dotnet run --launch-profile http, puerto 5108
Cómo cprrer el front :npm install && npm start(la ruta al back ya está configurada en el proxy.conf.json)


Nota: Hay otros archivos de notas en cada carpeta de la solución