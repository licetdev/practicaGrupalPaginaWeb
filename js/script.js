
// ELEMENTOS DEL HTML
const $ = selector => document.querySelector(selector);
const $$ = selector => document.querySelectorAll(selector);

const autor = $("#autor");
const nombreLibro = $("#nombreLibro");
const estadoLibro = $("#estadoLibro");
const fechaLibro = $("#fechaLibro");
const listaLibros = $(".listaLibros");
const mensajeVacio = $(".mensaje-vacio");

const contadores = {
    total: $("#contTotal"),
    pendientes: $("#contPendientes"),
    leidos: $("#contLeidos"),
    leyendo: $("#contLeyendo")
};

// DATOS
let libros = JSON.parse(localStorage.getItem("biblioteca")) || [];
let filtroActual = "Todos";

// GUARDAR LIBROS
function guardarLibros() {
    localStorage.setItem("biblioteca", JSON.stringify(libros));
}

// AGREGAR LIBRO
function agregarLibro() {
    if (![autor, nombreLibro, fechaLibro].every(campo => campo.value.trim())) {
        alert("Completa todos los campos.");
        return;
    }

    libros.push({
        id: Date.now(),
        autor: autor.value.trim(),
        nombre: nombreLibro.value.trim(),
        estado: estadoLibro.value,
        fecha: fechaLibro.value
    });

    guardarLibros();
    $("#btnAgregar").form?.reset();
    autor.value = nombreLibro.value = fechaLibro.value = "";
    estadoLibro.value = "Por leer";

    mostrarLibros();
}

// FILTRAR LIBROS
function filtrarLibros() {
    return libros.filter(libro =>
        filtroActual === "Todos" || libro.estado === filtroActual
    );
}

// LISTAR LIBROS
function listarLibros(librosMostrar) {
    listaLibros.replaceChildren();

    librosMostrar.forEach(libro => {
        const tarjeta = document.createElement("div");
        const info = document.createElement("div");
        const icono = document.createElement("div");
        const texto = document.createElement("div");

        tarjeta.className = "tarjeta-libro";
        info.className = "libro-info";
        icono.className = "libro-icono";
        texto.className = "libro-texto";

        const titulo = document.createElement("h4");
        titulo.textContent = libro.nombre;

        const autorTexto = document.createElement("p");
        autorTexto.textContent = libro.autor;

        const estado = document.createElement("span");
        estado.className = "etiqueta-estado";
        estado.classList.add("estado-" + libro.estado.replace(" ", "."));
        estado.textContent = libro.estado;

        const fecha = document.createElement("div");
        fecha.className = "libro-fecha";
        fecha.textContent = "📅 " + (libro.fecha === "Sin fecha"
            ? libro.fecha
            : libro.fecha.split("-").reverse().join("/"));

        const acciones = document.createElement("div");
        acciones.className = "libro-acciones";

        const boton = document.createElement("button");
        boton.className = "btn-eliminar";
        boton.textContent = "🗑️";
        boton.title = "Eliminar";
        boton.addEventListener("click", () => eliminarLibro(libro.id));

        texto.append(titulo, autorTexto, estado);
        info.append(icono, texto);
        acciones.appendChild(boton);
        tarjeta.append(info, fecha, acciones);
        listaLibros.appendChild(tarjeta);
    });

    mensajeVacio.hidden = librosMostrar.length > 0;
    mensajeVacio.textContent = libros.length
        ? "No hay libros en este filtro."
        : "Aún no hay libros. ¡Agrega uno arriba para ver los apartados!";
}

// ACTUALIZAR CONTADORES
function actualizarContadores() {
    contadores.total.textContent = libros.length;
    contadores.pendientes.textContent = libros.filter(l => l.estado === "Por leer").length;
    contadores.leyendo.textContent = libros.filter(l => l.estado === "Leyendo").length;
    contadores.leidos.textContent = libros.filter(l => l.estado === "Leído").length;
}

// MOSTRAR LIBROS
function mostrarLibros() {
    listarLibros(filtrarLibros());
    actualizarContadores();
}

// ELIMINAR LIBRO
function eliminarLibro(id) {
    libros = libros.filter(libro => libro.id !== id);
    guardarLibros();
    mostrarLibros();
}

// FILTROS SUPERIORES Y MENÚ LATERAL
function seleccionarFiltro(valor, boton) {
    filtroActual = valor.includes("Todos") ? "Todos" :
        valor.includes("Por leer") ? "Por leer" :
        valor.includes("Leyendo") ? "Leyendo" : "Leído";

    $$(".filtro-btn, .menu-nav button").forEach(b => b.classList.remove("activo"));
    boton.classList.add("activo");

    const filtro = [...$$(".filtro-btn")].find(b =>
        (b.textContent.trim() === "Leídos" ? "Leído" : b.textContent.trim()) === filtroActual
    );

    filtro?.classList.add("activo");
    mostrarLibros();
}

// EVENTOS DE FILTROS
$$(".filtro-btn, .menu-nav button").forEach(boton =>
    boton.addEventListener("click", () => {
        seleccionarFiltro(boton.textContent.trim(), boton);
        $(".menu-nav").classList.remove("abierto");
        $(".acciones-laterales").classList.remove("abierto");
    })
);

// QUITAR LEÍDOS Y VACIAR BIBLIOTECA
$$(".btn-lateral").forEach(boton =>
    boton.addEventListener("click", () => {
        if (boton.textContent.includes("Quitar")) {
            libros = libros.filter(l => l.estado !== "Leído");
        } else if (confirm("¿Estás seguro de vaciar la biblioteca?")) {
            libros = [];
        } else {
            return;
        }

        guardarLibros();
        mostrarLibros();
    })
);

// MENÚ RESPONSIVE
$("#menuBtn").addEventListener("click", () => {
    $(".menu-nav").classList.toggle("abierto");
    $(".acciones-laterales").classList.toggle("abierto");
});

// INICIAR APLICACIÓN
$("#btnAgregar").addEventListener("click", agregarLibro);
mostrarLibros();
