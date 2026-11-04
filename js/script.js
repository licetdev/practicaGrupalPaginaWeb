/* =========================================
   1. ELEMENTOS DEL HTML
   Obtener los campos, botones y lista
========================================= */

const autor = document.getElementById("autor");
const nombreLibro = document.getElementById("nombreLibro");
const estadoLibro = document.getElementById("estadoLibro");
const fechaLibro = document.getElementById("fechaLibro");

const btnAgregar = document.getElementById("btnAgregar");
const listaLibros = document.querySelector(".listaLibros");
const mensajeVacio = document.querySelector(".mensaje-vacio");


/* =========================================
   2. CONTADORES DE LIBROS
   Obtener los elementos de los contadores
========================================= */

const contTotal = document.getElementById("contTotal");
const contPendientes = document.getElementById("contPendientes");
const contLeidos = document.getElementById("contLeidos");
const contLeyendo = document.getElementById("contLeyendo");


/* =========================================
   3. BOTONES PARA FILTRAR
   Seleccionar los botones de filtros
========================================= */

const botonesFiltro = document.querySelectorAll(".filtro-btn");


/* =========================================
   4. VARIABLES PRINCIPALES
   Guardar libros y controlar el filtro
========================================= */

let libros = [];
let filtroActual = "Todos";


/* =========================================
   5. GUARDAR Y CARGAR LIBROS
   Guardar los datos en el navegador
========================================= */

function guardarLibros() {
    localStorage.setItem("biblioteca", JSON.stringify(libros));
}

function cargarLibros() {
    const datos = localStorage.getItem("biblioteca");

    if (datos !== null) {
        libros = JSON.parse(datos);
    }
}


/* =========================================
   6. AGREGAR LIBRO
   Validar los campos y registrar un libro
========================================= */

btnAgregar.addEventListener("click", function (e) {
    e.preventDefault();

    if (autor.value.trim() === "" || nombreLibro.value.trim() === "") {
        alert("Completa todos los campos.");
        return;
    }

    const libro = {
        autor: autor.value.trim(),
        nombre: nombreLibro.value.trim(),
        estado: estadoLibro.value,
        fecha: fechaLibro.value || "Sin fecha"
    };

    libros.push(libro);
    guardarLibros();


    /* =====================================
       7. LIMPIAR FORMULARIO
       Borrar los campos después de agregar
    ===================================== */

    autor.value = "";
    nombreLibro.value = "";
    fechaLibro.value = "";
    estadoLibro.value = "Por leer";

    mostrarLibros();
});


/* =========================================
   8. MOSTRAR LIBROS
   Actualizar la lista en pantalla
========================================= */

function mostrarLibros() {
    listaLibros.innerHTML = "";


    /* =====================================
       9. FILTRAR LIBROS
       Mostrar libros según su estado
    ===================================== */

    let librosMostrar = libros;

    if (filtroActual === "Por leer") {
        librosMostrar = libros.filter(libro => libro.estado === "Por leer");

    } else if (filtroActual === "Leyendo") {
        librosMostrar = libros.filter(libro => libro.estado === "Leyendo");

    } else if (filtroActual === "Leídos") {
        librosMostrar = libros.filter(libro => libro.estado === "Leído");
    }


    /* =====================================
       10. MENSAJE DE LISTA VACÍA
       Mostrar aviso cuando no hay libros
    ===================================== */

    if (librosMostrar.length === 0) {
        mensajeVacio.style.display = "block";

        if (libros.length === 0) {
            mensajeVacio.textContent = "Aún no hay libros. ¡Agrega uno arriba para ver los apartados!";
        } else {
            mensajeVacio.textContent = "No hay libros en este filtro.";
        }

    } else {
        mensajeVacio.style.display = "none";
    }


    /* =====================================
       11. CREAR TARJETAS DE LIBROS
       Crear un cuadro para cada libro
    ===================================== */

    librosMostrar.forEach(function (libro) {
        const tarjeta = document.createElement("div");


        /* =================================
           12. FORMATO DE FECHA
           Mostrar la fecha como día/mes/año
        ================================= */

        let fechaMostrar = libro.fecha;

        if (libro.fecha !== "Sin fecha") {
            const partes = libro.fecha.split("-");

            if (partes.length === 3) {
                fechaMostrar = `${partes[2]}/${partes[1]}/${partes[0]}`;
            }
        }


        /* =================================
           13. INFORMACIÓN DEL LIBRO
           Mostrar nombre, autor, estado,
           fecha y botón eliminar
        ================================= */

        const info = document.createElement("div");
        info.className = "libro-info";

        const icono = document.createElement("div");
        icono.className = "libro-icono";

        const texto = document.createElement("div");
        texto.className = "libro-texto";

        const titulo = document.createElement("h4");
        titulo.textContent = libro.nombre;

        const autorTexto = document.createElement("p");
        autorTexto.textContent = libro.autor;

        const estado = document.createElement("span");
        estado.className = "etiqueta-estado";
        estado.classList.add("estado-" + libro.estado.replace(" ", "."));
        estado.textContent = libro.estado;

        texto.appendChild(titulo);
        texto.appendChild(autorTexto);
        texto.appendChild(estado);

        info.appendChild(icono);
        info.appendChild(texto);

        const fecha = document.createElement("div");
        fecha.className = "libro-fecha";
        fecha.textContent = "📅 " + fechaMostrar;

        const acciones = document.createElement("div");
        acciones.className = "libro-acciones";


        /* =================================
           14. BOTÓN ELIMINAR
           Detectar el clic para borrar
           un libro de la lista
        ================================= */

        const btnEliminar = document.createElement("button");
        btnEliminar.className = "btn-eliminar";
        btnEliminar.title = "Eliminar";
        btnEliminar.textContent = "🗑️";

        btnEliminar.addEventListener("click", function () {
            eliminarLibro(libro);
        });

        acciones.appendChild(btnEliminar);

        tarjeta.appendChild(info);
        tarjeta.appendChild(fecha);
        tarjeta.appendChild(acciones);

        listaLibros.appendChild(tarjeta);
    });

    actualizarContadores();
}


/* =========================================
   15. ACTUALIZAR CONTADORES
   Calcular la cantidad de libros por estado
========================================= */

function actualizarContadores() {
    const total = libros.length;
    const leidos = libros.filter(libro => libro.estado === "Leído").length;
    const pendientes = libros.filter(libro => libro.estado === "Por leer").length;
    const leyendo = libros.filter(libro => libro.estado === "Leyendo").length;

    contTotal.textContent = total;
    contPendientes.textContent = pendientes;
    contLeidos.textContent = leidos;
    contLeyendo.textContent = leyendo;
}


/* =========================================
   16. ELIMINAR UN LIBRO
   Borrar el libro seleccionado
========================================= */

function eliminarLibro(libroEliminar) {
    libros = libros.filter(function (libro) {
        return libro !== libroEliminar;
    });

    guardarLibros();
    mostrarLibros();
}


/* =========================================
   17. FILTROS SUPERIORES
   Cambiar los libros que se muestran
   cuando se selecciona un filtro
========================================= */

botonesFiltro.forEach(function (boton) {
    boton.addEventListener("click", function () {

        botonesFiltro.forEach(b => b.classList.remove("activo"));
        this.classList.add("activo");

        filtroActual = this.textContent.trim();
        mostrarLibros();
    });
});


/* =========================================
   18. MENÚ LATERAL
   Controlar los botones del menú izquierdo
========================================= */

const botonesMenu = document.querySelectorAll(".menu-nav button, .btn-lateral");

botonesMenu.forEach(function (boton) {
    boton.addEventListener("click", function () {
        const opcion = boton.textContent.trim();


        /* =================================
           19. QUITAR LIBROS LEÍDOS
           Eliminar todos los libros leídos
        ================================= */

        if (opcion === "Quitar leídos") {
            libros = libros.filter(libro => libro.estado !== "Leído");

            guardarLibros();
            mostrarLibros();


        /* =================================
           20. VACIAR BIBLIOTECA
           Eliminar todos los libros
           después de confirmar
        ================================= */

        } else if (opcion === "Vaciar biblioteca") {

            if (confirm("¿Estás seguro de que quieres vaciar la biblioteca?")) {
                libros = [];
                guardarLibros();
                mostrarLibros();
            }


        /* =================================
           21. FILTROS DEL MENÚ LATERAL
           Seleccionar los libros por estado
        ================================= */

        } else if (
            opcion.includes("Todos") ||
            opcion.includes("Por leer") ||
            opcion.includes("Leyendo") ||
            opcion.includes("Leídos")
        ) {

            let filtro = opcion.replace(/^[^a-zA-ZÁÉÍÓÚáéíóú]+/, '').trim();

            if (filtro === "Todos los libros") filtro = "Todos";

            filtroActual = filtro;


            /* =============================
               22. ACTIVAR FILTRO
               Resaltar el botón seleccionado
            ============================= */

            botonesFiltro.forEach(b => {
                b.classList.remove("activo");

                if (b.textContent.trim() === filtro) {
                    b.classList.add("activo");
                }
            });

            document.querySelectorAll(".menu-nav button").forEach(b => {
                b.classList.remove("activo");
            });

            if (boton.closest(".menu-nav")) {
                boton.classList.add("activo");
            }

            mostrarLibros();
        }
    });
});


/* =========================================
   23. INICIAR LA APLICACIÓN
   Cargar y mostrar los libros guardados
========================================= */

cargarLibros();
mostrarLibros();


/* =========================================
   24. MENÚ RESPONSIVE
   Abrir y cerrar el menú en tablet y celular
========================================= */

const menuBtn = document.getElementById("menuBtn");
const menuNav = document.querySelector(".menu-nav");
const accionesLaterales = document.querySelector(".acciones-laterales");

menuBtn.addEventListener("click", function () {
    menuNav.classList.toggle("abierto");
    accionesLaterales.classList.toggle("abierto");
});


/* =========================================
   25. CERRAR MENÚ AL SELECCIONAR
   Cerrar el menú después de elegir un filtro
========================================= */

menuNav.querySelectorAll("button").forEach(function (boton) {
    boton.addEventListener("click", function () {
        menuNav.classList.remove("abierto");
        accionesLaterales.classList.remove("abierto");
    });
});