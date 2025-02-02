import Plataforma from "../models/Plataforma.js";
import Videojuego from "../models/Videojuego.js";
import VideojuegoPlataforma from "../models/VideojuegoPlataforma.js";
import Carrito from "../models/Carrito.js"
import MetodoPago from "../models/MetodoPago.js"
import CarritoVideojuego from "../models/CarritoVideojuego.js";

const inicio = async (req, res) => {  //req, res
    try {
        // Consultar videojuegos y plataformas relacionadas
        const videojuegos = await VideojuegoPlataforma.findAll({
            include: [
                {
                    model: Videojuego,
                    attributes: ['id_videojuego', 'nombre_juego', 'precio', 'imagen', 'link_video', 'informacion'],
                },
                {
                    model: Plataforma,
                    attributes: ['id_plataforma', 'nombre_plataforma'],
                },
            ],
        });        
       // console.log(videojuegos.videojuego.nombre_juego);
        res.render('inicio', { videojuegos, csrf: req.csrfToken()}); // Pasar datos a la vista
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al cargar videojuegos');
    }

}

const subirCarrito = async (req, res) => {
    const { items, total, cantidadProducto } = req.body;

    if (!items || items.length === 0) {
        return res.redirect('/inicio')
        //return res.status(400).json({ success: false, message: "El carrito está vacío." });
    }

    try {
        // Parsear el campo 'items' que ahora es un string JSON
        const itemsCarrito = JSON.parse(items);  // Convertir el string JSON a un objeto
        const totalCompra = parseFloat(total);
        const cantidad = parseInt(cantidadProducto);; 

        if (isNaN(totalCompra)) {
            return res.status(400).json({ success: false, message: "El total de la compra no es válido." });
        }

        // Inserción en la base de datos
        const carrito = await Carrito.create({
            id_usuario: req.session.id_usuario,  // Asegúrate de que la sesión esté correcta
            estado: "Pendiente",
            cantidad_producto: cantidad,
            total_compra: totalCompra
        });

        await carrito.save();

        // Guardar los juegos del carrito en la base de datos
        for (let item of itemsCarrito) {
            await CarritoVideojuego.create({
                id_videojuego: item.id,  // Asegúrate de que 'id' esté en el objeto item
                id_carrito: carrito.id_carrito,
                cantidad: item.cantidad
            });
        }

        const id_c = carrito.id_carrito;
        //console.log("Carrito recibido:", itemsCarrito, "Total:", totalCompra);

        // Responder con éxito
        res.render("addMetodo",{
            id_c,
            csrf: req.csrfToken()
        })
    } catch (error) {
        console.error("Error al crear el carrito:", error);
        res.status(500).json({ success: false, message: "Hubo un error al crear el carrito." });
    }
};

const subirMetodoPago = async (req, res) => {
    try {
        const {
            id_usuario,
            id_carrito,
            tipo_pago,
            fecha_compra,
            numero_tarjeta,
            nombre_tarjeta,
            vencimiento_tarjeta,
            cvv
        } = req.body;
        const consulta = await Carrito.findOne({where: {id_carrito: id_carrito}});
        // Crear el nuevo método de pago
        await MetodoPago.create({
            id_usuario: consulta.id_usuario,
            id_carrito,
            tipo_pago,
            fecha_compra,
            numero_tarjeta: numero_tarjeta || null,
            nombre_tarjeta: nombre_tarjeta || null,
            vencimiento_tarjeta: vencimiento_tarjeta || null,
            cvv: cvv || null
        });

        res.redirect('/inicio'); // Ajusta la redirección según tu aplicación
    } catch (error) {
        console.error('Error al guardar el método de pago:', error);
        res.status(500).send('Error al guardar el método de pago.');
    }
}

const guardarCarrito = (req, res) => {
    console.log("🟢 Datos recibidos en /guardar-carrito:", req.body);

    console.log("📌 Sesión antes de guardar carrito:", req.session); // 🔹 Muestra la sesión antes de modificarla

    req.session.carrito = req.body.carrito || [];
    req.session.total = req.body.total || 0;
    req.session.cantidad = req.body.cantidad || 0;

    req.session.save(err => {
        if (err) {
            console.error("🔴 Error guardando sesión:", err);
            return res.status(500).json({ success: false, message: "Error al guardar sesión" });
        }
        console.log("✅ Carrito guardado en sesión:", req.session.carrito);
        res.json({ success: true, message: "Carrito guardado en sesión" });
    });

    console.log("📌 Sesión después de intentar guardar:", req.session); // 🔹 Muestra la sesión después de modificarla
};


const obtenerCarrito = (req, res) => {
    res.json({
        carrito: req.session.carrito || [],
        total: req.session.total || 0,
        cantidad: req.session.cantidad || 0
    });
}

export{
    inicio, subirCarrito, subirMetodoPago, guardarCarrito, obtenerCarrito
}
