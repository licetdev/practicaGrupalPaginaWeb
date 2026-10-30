var libros = [];
var filtroActual = 'todos';

// Cargar libros
var guardado = localStorage.getItem('libros');
if (guardado != null) {
  libros = JSON.parse(guardado);
}

// Elementos
var inputTitulo = document.getElementById('inputTitulo');
var inputAutor = document.getElementById('inputAutor');
var selectEstado = document.getElementById('selectEstado');
var btnAgregar = document.getElementById('btnAgregar');
var listaLibros = document.getElementById('listaLibros');
var contador = document.getElementById('contador');
var contadorMenu = document.getElementById('contadorMenu');
var tituloSeccion = document.getElementById('tituloSeccion');
var paneles = document.getElementById('paneles');
var mensajeVacio = document.getElementById('mensajeVacio');

var badgeTodos = document.getElementById('badgeTodos');
var badgePendientes = document.getElementById('badgePendientes');
var badgeLeyendo = document.getElementById('badgeLeyendo');
var badgeLeidos = document.getElementById('badgeLeidos');

// Botones del menú izquierdo y los del apartado derecho
var botonesMenu = document.querySelectorAll('.filtro');
var botonesApartado = document.querySelectorAll('.btn-apartado');

function guardar() {
  localStorage.setItem('libros', JSON.stringify(libros));
}

function agregarLibro() {
  var titulo = inputTitulo.value.trim();
  var autor = inputAutor.value.trim();
  var estado = selectEstado.value;

  if (titulo == '') {
    alert('Escribe el título del libro');
    return;
  }
  if (autor == '') autor = 'Autor desconocido';

  var hoy = new Date();
  var fechaTexto = hoy.getDate() + '/' + (hoy.getMonth() + 1) + '/' + hoy.getFullYear();

  var libro = {
    id: Date.now(),
    titulo: titulo,
    autor: autor,
    estado: estado,
    fecha: fechaTexto
  };

  libros.push(libro);

  inputTitulo.value = '';
  inputAutor.value = '';
  selectEstado.value = 'pendiente';

  guardar();
  mostrarLibros();
}

function mostrarLibros() {
  listaLibros.innerHTML = '';

  // Mostrar u ocultar los paneles según si hay libros
  if (libros.length == 0) {
    paneles.style.display = 'none';
    mensajeVacio.style.display = 'block';
    return;
  } else {
    paneles.style.display = 'flex';
    mensajeVacio.style.display = 'none';
  }

  var total = libros.length;
  var pendientes = 0;
  var leyendo = 0;
  var leidos = 0;

  for (var i = 0; i < libros.length; i++) {
    if (libros[i].estado == 'pendiente') pendientes++;
    if (libros[i].estado == 'leyendo') leyendo++;
    if (libros[i].estado == 'leido') leidos++;
  }

  badgeTodos.textContent = total;
  badgePendientes.textContent = pendientes;
  badgeLeyendo.textContent = leyendo;
  badgeLeidos.textContent = leidos;

  contador.textContent = total + ' libros';
  contadorMenu.textContent = total + ' libros en total';

  if (filtroActual == 'todos') tituloSeccion.textContent = '📖 Listado de libros';
  if (filtroActual == 'pendientes') tituloSeccion.textContent = '📖 Libros por leer';
  if (filtroActual == 'leyendo') tituloSeccion.textContent = '📖 Libros que estoy leyendo';
  if (filtroActual == 'leidos') tituloSeccion.textContent = '📖 Libros leídos';

  for (var i = 0; i < libros.length; i++) {
    var libro = libros[i];
    var mostrar = false;

    if (filtroActual == 'todos') mostrar = true;
    if (filtroActual == 'pendientes' && libro.estado == 'pendiente') mostrar = true;
    if (filtroActual == 'leyendo' && libro.estado == 'leyendo') mostrar = true;
    if (filtroActual == 'leidos' && libro.estado == 'leido') mostrar = true;

    if (mostrar == true) {
      listaLibros.appendChild(crearFila(libro));
    }
  }

  if (listaLibros.innerHTML == '') {
    var mensaje = document.createElement('div');
    mensaje.className = 'mensaje-vacio';
    mensaje.textContent = 'No hay libros con este filtro 📭';
    listaLibros.appendChild(mensaje);
  }
}

function crearFila(libro) {
  var li = document.createElement('li');
  if (libro.estado == 'leido') li.className = 'completado';

  var portada = document.createElement('div');
  portada.className = 'libro-portada';
  if (libro.estado == 'pendiente') portada.textContent = '📕';
  if (libro.estado == 'leyendo') portada.textContent = '📖';
  if (libro.estado == 'leido') portada.textContent = '📗';

  var info = document.createElement('div');
  info.className = 'libro-info';

  var titulo = document.createElement('div');
  titulo.className = 'libro-titulo';
  titulo.textContent = libro.titulo;

  var autor = document.createElement('div');
  autor.className = 'libro-autor';
  autor.textContent = libro.autor;

  var fecha = document.createElement('div');
  fecha.className = 'libro-fecha';
  fecha.textContent = libro.fecha != undefined ? '📅 ' + libro.fecha : '';

  info.appendChild(titulo);
  info.appendChild(autor);
  info.appendChild(fecha);

  var botonEstado = document.createElement('button');
  botonEstado.className = 'libro-estado estado-' + libro.estado;
  if (libro.estado == 'pendiente') botonEstado.textContent = '⏳ Por leer';
  if (libro.estado == 'leyendo') botonEstado.textContent = '👓 Leyendo';
  if (libro.estado == 'leido') botonEstado.textContent = '✅ Leído';

  botonEstado.onclick = function () {
    cambiarEstado(libro.id);
  };

  var botonEliminar = document.createElement('button');
  botonEliminar.className = 'btn-eliminar';
  botonEliminar.textContent = '✕';

  botonEliminar.onclick = function () {
    if (confirm('¿Eliminar "' + libro.titulo + '"?')) {
      eliminarLibro(libro.id);
    }
  };

  li.appendChild(portada);
  li.appendChild(info);
  li.appendChild(botonEstado);
  li.appendChild(botonEliminar);

  return li;
}

function cambiarEstado(id) {
  for (var i = 0; i < libros.length; i++) {
    if (libros[i].id == id) {
      if (libros[i].estado == 'pendiente') libros[i].estado = 'leyendo';
      else if (libros[i].estado == 'leyendo') libros[i].estado = 'leido';
      else libros[i].estado = 'pendiente';
    }
  }
  guardar();
  mostrarLibros();
}

function eliminarLibro(id) {
  for (var i = 0; i < libros.length; i++) {
    if (libros[i].id == id) {
      libros.splice(i, 1);
      break;
    }
  }
  guardar();
  mostrarLibros();
}

function quitarLeidos() {
  var leidos = 0;
  for (var i = 0; i < libros.length; i++) {
    if (libros[i].estado == 'leido') leidos++;
  }

  if (leidos == 0) {
    alert('No hay libros leídos');
    return;
  }

  if (!confirm('¿Quitar ' + leidos + ' libro(s) leído(s)?')) return;

  for (var i = libros.length - 1; i >= 0; i--) {
    if (libros[i].estado == 'leido') libros.splice(i, 1);
  }

  guardar();
  mostrarLibros();
}

function vaciarBiblioteca() {
  if (libros.length == 0) return;
  if (!confirm('¿Vaciar TODA la biblioteca?')) return;

  while (libros.length > 0) {
    libros.pop();
  }

  guardar();
  mostrarLibros();
}

// Sincronizar ambos menús al cambiar de filtro
function cambiarFiltro(nuevoFiltro) {
  filtroActual = nuevoFiltro;

  // Actualizar botones del menú izquierdo
  for (var i = 0; i < botonesMenu.length; i++) {
    botonesMenu[i].classList.remove('activo');
    if (botonesMenu[i].dataset.filtro == filtroActual) {
      botonesMenu[i].classList.add('activo');
    }
  }

  // Actualizar botones del apartado derecho
  for (var i = 0; i < botonesApartado.length; i++) {
    botonesApartado[i].classList.remove('activo');
    if (botonesApartado[i].dataset.filtro == filtroActual) {
      botonesApartado[i].classList.add('activo');
    }
  }

  mostrarLibros();
}

// Eventos
btnAgregar.onclick = agregarLibro;

inputTitulo.onkeydown = function (e) { if (e.key == 'Enter') agregarLibro(); };
inputAutor.onkeydown = function (e) { if (e.key == 'Enter') agregarLibro(); };

// Asignar evento a los botones del menú izquierdo
for (let i = 0; i < botonesMenu.length; i++) {
  botonesMenu[i].onclick = function () {
    cambiarFiltro(botonesMenu[i].dataset.filtro);
  };
}

// Asignar evento a los botones del apartado derecho
for (let i = 0; i < botonesApartado.length; i++) {
  botonesApartado[i].onclick = function () {
    cambiarFiltro(botonesApartado[i].dataset.filtro);
  };
}

document.getElementById('btnLimpiarLeidos').onclick = quitarLeidos;
document.getElementById('btnEliminarTodos').onclick = vaciarBiblioteca;

mostrarLibros();