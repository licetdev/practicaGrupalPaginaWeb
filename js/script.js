

const autor = document.getElementById("autor");
const nombreLibro = document.getElementById("nombreLibro");
const estadoLibro = document.querySelector(".formulario select");

const btnAgregar = document.querySelector(".formulario button");
const listaLibros = document.querySelector(".listaLibros");
const mensajeVacio = document.querySelector(".mensaje-vacio");


let libros = [];



function guardarLibros() {
    localStorage.setItem("biblioteca", JSON.stringify(libros));
}

function cargarLibros() {
    const datos = localStorage.getItem("biblioteca");

    if (datos !== null) {
        libros = JSON.parse(datos);
    }
}


btnAgregar.addEventListener("click", function () {

    if (autor.value.trim() === "" || nombreLibro.value.trim() === "") {
        alert("Completa todos los campos.");
        return;
    }

    const libro = {
        autor: autor.value.trim(),
        nombre: nombreLibro.value.trim(),
        estado: estadoLibro.value
    };

    libros.push(libro);

    guardarLibros();

    autor.value = "";
    nombreLibro.value = "";

    mostrarLibros();
});


function mostrarLibros(librosMostrar = libros) {

    listaLibros.innerHTML = "";

    mensajeVacio.style.display = libros.length === 0 ? "block" : "none";

    const tarjetas = librosMostrar.map(function (libro) {

        const tarjeta = document.createElement("div");

        const titulo = document.createElement("h3");
        titulo.textContent = libro.nombre;

        const autorLibro = document.createElement("p");
        autorLibro.textContent = "Autor: " + libro.autor;

        const estado = document.createElement("p");
        estado.textContent = "Estado: " + libro.estado;

        const boton = document.createElement("button");
        boton.textContent = "Eliminar";

        boton.addEventListener("click", function () {
            eliminarLibro(libro);
        });

        tarjeta.append(titulo, autorLibro, estado, boton);

        return tarjeta;
    });

    tarjetas.forEach(function (tarjeta) {
        listaLibros.appendChild(tarjeta);
    });

    const total = libros.reduce(function (contador) {
        return contador + 1;
    }, 0);

    console.log("Total de libros:", total);
}


function eliminarLibro(libroEliminar) {

    libros = libros.filter(function (libro) {
        return libro !== libroEliminar;
    });

    guardarLibros();
    mostrarLibros();
}

function filtrarLibros(estado) {

    const resultado = estado === "Todos"
        ? libros
        : libros.filter(function (libro) {
            return libro.estado === estado;
        });

    mostrarLibros(resultado);
}


const botones = document.querySelectorAll(
    ".menu button, .botones-filtro button"
);

botones.forEach(function (boton) {

    boton.addEventListener("click", function () {

        const opcion = boton.textContent.trim();

        if (opcion === "Quitar leídos") {

            libros = libros.filter(function (libro) {
                return libro.estado !== "Leído";
            });

            guardarLibros();
            mostrarLibros();

        } else if (opcion === "Vaciar biblioteca") {

            libros = [];

            guardarLibros();
            mostrarLibros();

        } else {

            const estado = opcion === "Leídos" ? "Leído" : opcion;

            filtrarLibros(estado);
        }
    });
});


cargarLibros();
mostrarLibros();
