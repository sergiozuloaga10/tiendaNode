const contenedorJuegos = document.querySelector('.contenido');
const botonesConsolas = document.querySelectorAll('.plataforma img');

// Función para detener la reproducción de videos
function detenerVideos() {
    const videos = document.querySelectorAll('.informacion iframe');
    videos.forEach(video => {
        const src = video.getAttribute('src'); // Obtiene la URL original
        video.setAttribute('src', ''); // Elimina temporalmente el src para detener el video
        video.setAttribute('src', src); // Restablece el src original para que el video esté listo para ser reproducido nuevamente
    });
}

// Manejar el cambio de consolas
botonesConsolas.forEach(boton => {
    boton.addEventListener('click', () => {
        const consolaSeleccionada = boton.getAttribute('data-consola'); // Obtener la consola seleccionada.

        // Muestra solo los juegos de la consola seleccionada
        const juegos = document.querySelectorAll('.juegos');
        juegos.forEach(juego => {
            if (juego.dataset.consola === consolaSeleccionada) {
                juego.style.display = 'flex'; // Muestra el juego
            } else {
                juego.style.display = 'none'; // Oculta los juegos de otras consolas
            }
        });

        // Ocultar todos los cuadros de información al cambiar de consola
        const cuadrosInformacion = document.querySelectorAll('.informacion');
        cuadrosInformacion.forEach(cuadro => {
            cuadro.style.display = 'none'; // Oculta todos los cuadros de información
        });

        // Detener cualquier video que esté reproduciéndose
        detenerVideos();
    });
});

// Manejar el botón de "Más información"
let botonInfo = document.querySelectorAll('.info');

botonInfo.forEach(boton => {
    boton.addEventListener('click', () => {
        const consolaSeleccionada = boton.getAttribute('data-id'); // Identificar el ID del juego

        // Muestra solo la información del juego seleccionado
        const info = document.querySelectorAll('.informacion');
        info.forEach(info => {
            if (info.getAttribute("id") === consolaSeleccionada) {
                info.style.display = 'block'; // Muestra la información
            } else {
                info.style.display = 'none'; // Oculta la información de otros juegos
            }
        });

        // Detener cualquier video que esté reproduciéndose
        detenerVideos();
    });
});
