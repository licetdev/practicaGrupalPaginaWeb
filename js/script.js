// Elementos del DOM
const autor = document.getElementById("autor");
const nombreLibro = document.getElementById("nombreLibro");
const estadoLibro = document.getElementById("estadoLibro"); // ID corregido
const fechaLibro = document.getElementById("fechaLibro");

const btnAgregar = document.getElementById("btnAgregar");
const listaLibros = document.querySelector(".listaLibros");
const mensajeVacio = document.querySelector(".mensaje-vacio");

// Contadores
const contTotal = document.getElementById("contTotal");
const contPendientes = document.getElementById("contPendientes");
const contLeidos = document.getElementById("contLeidos");

// Botones de filtro
const botonesFiltro = document.querySelectorAll(".filtro-btn");

let libros = [];
let filtroActual = "Todos";

// =========================
// PERSISTENCIA
// =========================
function guardarLibros() {
    localStorage.setItem("biblioteca", JSON.stringify(libros));
}

function cargarLibros() {
    const datos = localStorage.getItem("biblioteca");
    if (datos !== null) {
        libros = JSON.parse(datos);
    }
}

// =========================
// AGREGAR LIBRO
// =========================
btnAgregar.addEventListener("click", function (e) {
    e.preventDefault(); // Evitar recarga si es necesario

    if (autor.value.trim() === "" || nombreLibro.value.trim() === "") {
        alert("Completa todos los campos.");
        return;
    }

    const libro = {
        autor: autor.value.trim(),
        nombre: nombreLibro.value.trim(),
        estado: estadoLibro.value, // Ahora sí lee el valor
        fecha: fechaLibro.value || "Sin fecha"
    };

    libros.push(libro);
    guardarLibros();

    // Limpiar formulario
    autor.value = "";
    nombreLibro.value = "";
    fechaLibro.value = "";
    estadoLibro.value = "Por leer";

    mostrarLibros();
});

// =========================
// MOSTRAR LIBROS
// =========================
function mostrarLibros() {
    listaLibros.innerHTML = "";

    // 1. Filtrar
    let librosMostrar = libros;
    if (filtroActual === "Por leer") {
        librosMostrar = libros.filter(libro => libro.estado === "Por leer");
    } else if (filtroActual === "Leyendo") {
        librosMostrar = libros.filter(libro => libro.estado === "Leyendo");
    } else if (filtroActual === "Leídos") {
        librosMostrar = libros.filter(libro => libro.estado === "Leído");
    }

    // 2. Mensaje vacío
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

    // 3. Crear Tarjetas
    librosMostrar.forEach(function (libro) {
        const tarjeta = document.createElement("div");

        // Formatear fecha
        let fechaMostrar = libro.fecha;
        if (libro.fecha !== "Sin fecha") {
            const partes = libro.fecha.split("-");
            if (partes.length === 3) {
                fechaMostrar = `${partes[2]}/${partes[1]}/${partes[0]}`;
            }
        }

        tarjeta.innerHTML = `
            <div class="libro-info">
                <div class="libro-icono"></div>
                <div class="libro-texto">
                    <h4>${libro.nombre}</h4>
                    <p>${libro.autor}</p>
                    <span class="etiqueta-estado estado-${libro.estado.replace(' ', '.')}">${libro.estado}</span>
                </div>
            </div>
            <div class="libro-fecha">📅 ${fechaMostrar}</div>
            <div class="libro-acciones">
                <button class="btn-eliminar" title="Eliminar">🗑️</button>
            </div>
        `;

        // Evento Eliminar
        const btnEliminar = tarjeta.querySelector(".btn-eliminar");
        btnEliminar.addEventListener("click", function () {
            eliminarLibro(libro);
        });

        listaLibros.appendChild(tarjeta);
    });

    actualizarContadores();
}

// =========================
// ACTUALIZAR CONTADORES
// =========================
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

// =========================
// ELIMINAR LIBRO
// =========================
function eliminarLibro(libroEliminar) {
    libros = libros.filter(function (libro) {
        return libro !== libroEliminar;
    });
    guardarLibros();
    mostrarLibros();
}

// =========================
// FILTROS (Botones superiores)
// =========================
botonesFiltro.forEach(function (boton) {
    boton.addEventListener("click", function () {
        botonesFiltro.forEach(b => b.classList.remove("activo"));
        this.classList.add("activo");

        filtroActual = this.textContent.trim();
        mostrarLibros();
    });
});

// =========================
// MENÚ LATERAL
// =========================
const botonesMenu = document.querySelectorAll(".menu-nav button, .btn-lateral");
botonesMenu.forEach(function (boton) {
    boton.addEventListener("click", function () {
        const opcion = boton.textContent.trim();

        if (opcion === "Quitar leídos") {
            libros = libros.filter(libro => libro.estado !== "Leído");
            guardarLibros();
            mostrarLibros();
        } else if (opcion === "Vaciar biblioteca") {
            if(confirm("¿Estás seguro de que quieres vaciar la biblioteca?")) {
                libros = [];
                guardarLibros();
                mostrarLibros();
            }
        } else if (opcion.includes("Todos") || opcion.includes("Por leer") || opcion.includes("Leyendo") || opcion.includes("Leídos")) {
            let filtro = opcion.replace(/[^\w\s]/g, '').trim(); 
            if (filtro === "Todos los libros") filtro = "Todos";
            
            filtroActual = filtro;
            
            botonesFiltro.forEach(b => {
                b.classList.remove("activo");
                if (b.textContent.trim() === filtro) b.classList.add("activo");
            });
            
            mostrarLibros();
        }
    });
});

// =========================
// INICIALIZACIÓN
// =========================
cargarLibros();
mostrarLibros();