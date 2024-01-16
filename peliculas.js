// Variables
let pagina = 1;
let cargando = false;
let generos=[];
let carrito=[];

// funcion para hacer la llamada de la API para los generos 
// y cargalos en el select de generos
async function cargarGeneros() {
    let response = await fetch('https://api.themoviedb.org/3/genre/movie/list?api_key=57537ff19f381dd7b67eee1ea8b8164a');
    let data = await response.json();
    generos = data.genres;
  
    let selectGeneros = document.getElementById('filtrarPorGenero');
  
    generos.forEach(genero => {
      let opcion = document.createElement('option');
      opcion.value = genero.id;
      opcion.textContent = genero.name;
      selectGeneros.appendChild(opcion);

    });
  }


// funcion para cargar las peliculas de la API y luego mostralas
function cargarPeliculas() {
    if (cargando) {
        return;
    }

    // Mostrar el icono de carga
    mostrarIconoCarga();

    cargando = true;
    obtenerPeliculas()
        .then(mostrarPeliculas)
        .catch(error => {
            console.error('Error al cargar películas:', error);
        })
        .finally(() => {
            // Ocultar el icono de carga después de cargar las películas
            ocultarIconoCarga();

            cargando = false;
            pagina++;
            console.log(pagina);
        });
}

function mostrarIconoCarga() {
    // Mostrar el icono de carga
    let iconoCarga = document.getElementById('iconoCarga');
    if (iconoCarga) {
        iconoCarga.style.display = 'block';
    }
}

function ocultarIconoCarga() {
    // Ocultar el icono de carga
    let iconoCarga = document.getElementById('iconoCarga');
    if (iconoCarga) {
        iconoCarga.style.display = 'none';
    }
}


// llamada para obtener las peliculas
// y que cada vez cambie la pagina
async function obtenerPeliculas() {
    let response = await fetch(`https://api.themoviedb.org/3/discover/movie?&page=${pagina}&api_key=57537ff19f381dd7b67eee1ea8b8164a`);
    return await response.json();
}


//   funcion para mostrar las peliculas en el contenedor
function mostrarPeliculas(peliculasAPI) {
    let contenedorPeliculas = document.getElementById('contenedor');
    peliculasAPI.results.forEach(pelicula => {
        let tarjeta = crearTarjetaPelicula(pelicula);
        contenedorPeliculas.appendChild(tarjeta);
    });
}

// funcion para crear y cargar las tarjetas de las peliculas
// y rellenarlas con los datos proporcionados por la API
function crearTarjetaPelicula(pelicula) {
    let tarjeta = document.createElement('div');
    tarjeta.classList.add('tarjeta');

    let imagenContainer = document.createElement('div');
    imagenContainer.classList.add('tarjeta_imagen');

    let titulo = document.createElement('h2');
    titulo.textContent = pelicula.title;

    let descripcion = document.createElement('p');
    descripcion.textContent = pelicula.overview;

    let imagen = document.createElement('img');
    imagen.src = `https://image.tmdb.org/t/p/w500${pelicula.poster_path}`;
    imagen.alt = pelicula.title;

    imagenContainer.appendChild(imagen);

    let botonMostrar = document.createElement('button');
    botonMostrar.textContent = 'Mostrar Película';
    botonMostrar.classList.add('boton_detalle');
    botonMostrar.addEventListener('click', () => {
        mostrarDetallesPelicula(pelicula);
    });

    tarjeta.appendChild(imagenContainer);
    tarjeta.appendChild(titulo);
    tarjeta.appendChild(descripcion);
    tarjeta.appendChild(botonMostrar);

    return tarjeta;
}
// creamos una varieble para almacenar la pelicula mas tarde
let peliculaActual;
// funcion para mostrar el modal y cargar los datos de la pelicula en el 
function mostrarDetallesPelicula(pelicula) {
    peliculaActual=pelicula;
    let modal = document.getElementById('modal');
    let modalTitulo = document.getElementById('modal-titulo');
    let modalDescripcion = document.getElementById('modal-descripcion');
    let modalImagen = document.getElementById('modal-imagen');
    modalTitulo.textContent = pelicula.title;
    modalDescripcion.textContent = pelicula.overview;
    modalImagen.src = `https://image.tmdb.org/t/p/w500${pelicula.poster_path}`;
    modal.style.display = 'block';
}
// con la variable peliculaActual añadimos al carrito la pelicula
document.getElementById('boton-carrito').addEventListener('click', function() {
    anadirAlCarrito(peliculaActual.title);
});
// cierre del modal este lo llamamos desde el index pues porque si 
function cerrarModal() {
    let modal = document.getElementById('modal');
    modal.style.display = 'none';
}

// funcion de añadir al carrito de localStorage
function anadirAlCarrito(pelicula) {
    let index = carrito.findIndex(item => item.pelicula === pelicula);
    console.log(pelicula);
    console.log(index)
    if (index !== -1) {
        carrito[index].cantidad++;
    } else {
        carrito.push({
            pelicula: pelicula,
            cantidad: 1,
            precio: 2.99
        });
    }
     localStorage.setItem('carrito', JSON.stringify(carrito));
    alert('Pelicula añadida al carrito');
}



// llamada a la API para el filtrado
async function obtenerPeliculasGenero(genero,ordenar) {
    const response = await fetch(`https://api.themoviedb.org/3/discover/movie?&page=1&sort_by=popularity.${ordenar}&with_genres=${genero}&api_key=57537ff19f381dd7b67eee1ea8b8164a`);
    return await response.json();
}

// carga de los datos de filtrado de la API
function cargarporGenero(genero,ordenar) {
    if (cargando) {
        return;
    }

    cargando = true;
    obtenerPeliculasGenero(genero,ordenar)
        .then(mostrarPeliculasFiltradas)
        .catch(error => {
            console.error('Error al cargar películas:', error);
        })
        .finally(() => {
            cargando = false;
            console.log(pagina);
        });
}

// funciones para el filtrado
function mostrarPeliculasFiltradas(peliculasAPI) {
    let contenedorPeliculas = document.getElementById('contenedor');
    contenedorPeliculas.innerHTML = "";
    peliculasAPI.results.forEach(pelicula => {
        let tarjeta = crearTarjetaPelicula(pelicula);
        contenedorPeliculas.appendChild(tarjeta);
    });
}

// funcion para vaciar el contenedor principal
function limpiarcontenedor(){
    let contenedorPeliculas = document.getElementById('contenedor');
    contenedorPeliculas.innerHTML = "";
}
// comprobar que existe la variable local carrito y guardarla en carrito
if (localStorage.getItem('carrito')) {
    carrito = JSON.parse(localStorage.getItem('carrito'));
}

// funcion del scroll
function scrollInfinito() {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        cargarPeliculas();
    }
}
// llamada al scroll
window.addEventListener('scroll', scrollInfinito);

// funciones para la carga de la pagina de peliculas
window.onload = function() {
    if(!localStorage.getItem('usuario')){
        location.href="index.html";
    }else{
    cargarPeliculas();
    cargarGeneros();
    document.getElementById('buscar').addEventListener('click', function() {
        let idGeneroSeleccionado = document.getElementById('filtrarPorGenero').value;
        let ordenar=document.getElementById('ordenar').value;

        if (idGeneroSeleccionado !== "") {
            cargarporGenero(idGeneroSeleccionado,ordenar);
        } else {
            limpiarcontenedor();
            pagina=1;
            cargarPeliculas();
        }
    });
}
}

// funcionalidades para mostrar la tabla del carrito y que aumente o disminuya o elimine

function mostrarTablaCarrito() {
    let contenedorPeliculas = document.getElementById('contenedor');
    contenedorPeliculas.innerHTML = "";
    let tabla = document.getElementById('carrito_Tabla');
    tabla.style.display='block';
    let tbody = tabla.querySelector('tbody');

    tbody.innerHTML = '';

    carrito.forEach((item,index) => {
        let fila = document.createElement('tr');
        let nombreCell = document.createElement('td');
        let cantidadCell = document.createElement('td');
        let precioCell = document.createElement('td');
        let opcionesCell = document.createElement('td');

        nombreCell.textContent = item.pelicula;
        cantidadCell.textContent = item.cantidad;
        precioCell.textContent = `${(item.cantidad * item.precio).toFixed(2)}€`;

        let botonAumentar = document.createElement('button');
        botonAumentar.textContent = '+';
        botonAumentar.addEventListener('click', () => aumentarCantidad(index));

        let botonDisminuir = document.createElement('button');
        botonDisminuir.textContent = '-';
        botonDisminuir.addEventListener('click', () => disminuirCantidad(index));

        let botonEliminar = document.createElement('button');
        botonEliminar.textContent = 'Eliminar';
        botonEliminar.addEventListener('click', () => eliminarArticulo(index));

        opcionesCell.appendChild(botonAumentar);
        opcionesCell.appendChild(botonDisminuir);
        opcionesCell.appendChild(botonEliminar);

        nombreCell.textContent = item.pelicula;
        cantidadCell.textContent = item.cantidad;
        precioCell.textContent = `${(item.cantidad * item.precio).toFixed(2)}€`;

        fila.appendChild(nombreCell);
        fila.appendChild(cantidadCell);
        fila.appendChild(precioCell);
        fila.appendChild(opcionesCell);
        tbody.appendChild(fila);
    });

    let realizarPedidoBtn = document.getElementById('realizarPedido');
    realizarPedidoBtn.style.display = carrito.length > 0 ? 'block' : 'none';
}

document.querySelector('.cart-icon').addEventListener('click', mostrarTablaCarrito);


function aumentarCantidad(index) {
    carrito[index].cantidad++;
    actualizarCarrito();
}

function disminuirCantidad(index) {
    if (carrito[index].cantidad > 1) {
        carrito[index].cantidad--;
    } else {
        carrito.splice(index, 1);
    }
    actualizarCarrito();
}

function eliminarArticulo(index) {
    carrito.splice(index, 1);
    actualizarCarrito();
}

function actualizarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
    mostrarTablaCarrito();
}

// vamos a cerrar la sesion y vaciar el carrito avisando al cliente
document.getElementById('sesion-out').addEventListener('click',()=>{
    let confirmacion = confirm('¿Estás seguro de cerrar la sesión y vaciar el carrito?');
    
    if (confirmacion) {
        carrito = [];
        localStorage.removeItem('usuario');
        localStorage.removeItem('carrito');
        window.location.href = 'index.html';
    }
});

// al pulsar el boton realizar pedido enviamos un email con el precio total del pedido
emailjs.init("TPeAAz9eS6NeNHYgn");

document.getElementById('realizarPedido').addEventListener('click', function () {
    let correoUsuario = prompt("Por favor, introduce tu correo electrónico:");
    
    if (correoUsuario) {
        let precioFinal = carrito.reduce((total, item) => total + (item.cantidad * item.precio), 0);
        enviarCorreo(correoUsuario, precioFinal);
        alert(`${precioFinal.toFixed(2)}€`);
    } else {
        alert("Debes ingresar un correo electrónico para completar la orden.");
    }
});



function enviarCorreo(correoUsuario, precioFinal) {
    let parametros = {
        to_email: correoUsuario,
        from_name: "VideoClub Antonio",
        message: `${precioFinal.toFixed(2)}€`,
    };

    emailjs.send("service_pp7gitf", "template_7i1ujdl", parametros)
        .then(function(response) {
            console.log("Correo electrónico enviado con éxito:", response);
        }, function(error) {
            console.error("Error al enviar el correo electrónico:", error);
        });
}