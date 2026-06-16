# InterCommerceWebApp

# Instrucciones de Instalacion y ejecucion en entorno local
    -Tener la aplicacion node.js instalada (v 22)
    -verificar que este npm (v 10)
    -Clonar el repositorio mediante git o github
    -Desde la carpeta clonada abrir cmd o powershell y usar 'npm install'
    -Al tener las node_modules descargado con el paso anterior ejecutar 'ng serve'
    -Abrir en el navegdor http://localhost:4200/

# Ejecutar test
    -Despues de  la instalacion anterior.
    -Ejecuatar el comando ng test.
    -La evidencia del esta en la carpeta TestEvidencias.

# Respuestas preguntas de Profundidad Técnica 
    -1 No se.
    -2 Para evitars XSS, angular al usar interpolacion de datos ya bloquea de manera automana el usuo de html en sus variables si se quisiera usar una inyeccion de HTML, se deberia usarl el servicio DomSanitizer y el metodo bypassSecurityTrustHtml que basicamente nos permite usar contenido HTML inyectando en nuestra apliaccion. 
    -3 Si el carrito necesitara usarse en multiples tiendas, al cargar la informacion de la tienda, usaria su id unico, para cargar solo la informacion correspondiente.

# Arquitectura
    La arquitectura que use para este proyecto, es la comun utilizada para apliaciones Angular(20+)
    -Uso de componentes StandAlone, ya no se usa el ngmodule, con el uso de servicios para manejo de logica de negocios
    -La estrucutura de carpetas orientada a funciones y por capas. Separando responsaibilidades.
        -Core, es donde se encuentra la logica principal de la aplicacion.
            -Models, Es donde se encuentrar la entidades utilizadas.
            -Services, Es donde se encuentra la logica de negocio.
            -Interceptors, Se encuentran lo Mmddleware para peticiones HTTP
        -Components, Es donde se encuentran los componentes que pueden ser compartidos o que se usan en otros.
        -Modules, Son las vistas principales de la aplicacion.
