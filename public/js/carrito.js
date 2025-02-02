let carrito = [];
let listaJuegos = document.querySelector('.contenido');
const contenedorCarrito = document.querySelector('#lista-carrito tbody');
const vaciarCarritoB = document.querySelector('#vaciar-carrito');
const enviarCarritoB = document.querySelector('#enviar-carrito'); // Botón "Enviar
let cantidadProducto = 0;
let precio = 0;

registrarListener();

function registrarListener() {
    listaJuegos.addEventListener('click', agregarJuego);
    vaciarCarritoB.addEventListener('click', vaciar);
    contenedorCarrito.addEventListener('click', quitarItem);
    enviarCarritoB.addEventListener('click', enviarCarrito); // Registrar el evento 
}

// Agregamos un juego al carrito
function agregarJuego(evt) {
    evt.preventDefault();
    if (evt.target.classList.contains('agregar')) {
        const juegoSeleccionado = evt.target.closest('.juegos'); 
        leerJuego(juegoSeleccionado);
    }
}

// Leer el contenido del juego
function leerJuego(juego) {
    const juegoInfo = {
        imagen: juego.querySelector('img').src,
        nombre: juego.querySelector('h3').textContent,
        precio: juego.querySelector('span').textContent,
        id: juego.querySelector('a.agregar').getAttribute('data-id'),
        cantidad: 1
    }

    const existe = carrito.some(juego => juego.id === juegoInfo.id);

    if (existe) {
        // Actualizar la cantidad
        const juegos = carrito.map(juego => {
            if (juego.id === juegoInfo.id) {
                juego.cantidad++;
                return juego;
            } else {
                return juego;
            }
        });
        carrito = [...juegos];
    } else {
        carrito = [...carrito, juegoInfo];
    }

    console.log(juegoInfo);
    console.log(carrito);
    agregarCarrito();
}

// Actualizar el carrito y mostrar los juegos
function agregarCarrito() {
    contenedorCarrito.innerHTML = '';

    // Reinicializa el precio cada vez que se actualiza el carrito
    precio = 0;

    carrito.forEach((item, i) => {

        const row = document.createElement('tr');

        let itemPrice = parseFloat(item.precio.slice(1)); // Convertir a número el precio
        precio += itemPrice * item.cantidad;

        row.innerHTML = `
        <td>
            <img src="${item.imagen}" alt="${item.title}" width="100">
        </td>
        <td>
            <h4>${item.nombre}</h4>
        </td>
        <td>
            ${item.precio}
        </td>
        <td>
            ${item.cantidad}
        </td>
        <td>
        <button class='quitar' data-index="${i}">X</button>
        </td>
        `;

        cantidadProducto += item.cantidad;
        contenedorCarrito.appendChild(row);
    });

    totalVenta();
    sendCarrito();  // Guardar en la sesión
}

// Actualizar el total de la venta
function totalVenta() {
    let total = document.querySelector('.total');
    total.innerHTML = `Total: $${precio.toFixed(2)}`;
    console.log(total);
}

// Vaciar el carrito
function vaciar() {
    carrito = [];
    agregarCarrito();
    precio = 0;
    cantidadProducto = 0;
    totalVenta();
}

// Quitar un elemento del carrito
function quitarItem(e) {
    if (e.target.classList.contains('quitar')) {
        let index = e.target.getAttribute('data-index'); 

        // Eliminar el juego del array `carrito`
        let removedItem = carrito.splice(index, 1)[0];

        let itemPrice = parseFloat(removedItem.precio.slice(1));

        // Restar el precio al total
        precio -= itemPrice * removedItem.cantidad;

        agregarCarrito();

        console.log(`Item removed: ${removedItem.nombre}`);

        totalVenta();
    }
}

function sendCarrito() {
    if (carrito.length === 0) {
        alert("El carrito está vacío.");
        return;
    }

    // 🔹 Revisa qué datos se están enviando
    console.log("📤 Enviando carrito al servidor:", {
        carrito: carrito,
        total: precio,
        cantidad: cantidadProducto
    });

    fetch('/guardar-carrito', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': document.querySelector('input[name="_csrf"]')?.value || ''
        },
        body: JSON.stringify({
            carrito: carrito, 
            total: precio, 
            cantidad: cantidadProducto
        })
    })
    .then(response => response.json())
    .then(data => console.log('Carrito guardado:', data))
    .catch(error => console.error('Error guardando carrito:', error));
}

document.addEventListener("DOMContentLoaded", () => {
    fetch('/obtener-carrito')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("🛒 Carrito recuperado desde sesión:", data);
            
            if (!data.carrito || data.carrito.length === 0) {
                console.warn("⚠️ Carrito vacío en la sesión.");
                return;
            }

            carrito = data.carrito;
            precio = data.total;
            cantidadProducto = data.cantidad;

            console.log("✅ Carrito restaurado:", carrito);
            agregarCarrito();
        })
        .catch(error => console.error("🚨 Error cargando el carrito:", error));
});



// Enviar el carrito al servidor
function enviarCarrito() {
    if (carrito.length === 0) {
        alert("El carrito está vacío. Agrega juegos antes de enviarlo.");
        return;
        //location.reload();
    }
    // Serializar los items del carrito como JSON
    const itemsCarrito = JSON.stringify(carrito);  // Asumiendo que `carrito` es tu array de productos
    document.getElementById('items').value = itemsCarrito;

    // Establecer el total del carrito
    const total = precio;  
    document.getElementById('total').value = total;
    const cantidadP = cantidadProducto
    document.getElementById('cantidadP').value = cantidadP

    
}


