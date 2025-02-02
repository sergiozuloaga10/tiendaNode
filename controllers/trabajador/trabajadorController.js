import Videojuego from "../../models/Videojuego.js";
import VideojuegoPlataforma from "../../models/VideojuegoPlataforma.js";
import Carrito from "../../models/Carrito.js";
import Usuario from "../../models/Usuario.js";
import Plataforma from "../../models/Plataforma.js";

const trabajador = async (req, res) => {
    try{

        const pedidos = await Carrito.count();
        const totalJuegos = await Videojuego.count();
        res.render("vistasRoles/trb/trabajador", { pedidos, totalJuegos });
    }catch(error){
        res.status(500).send("Error en el sistema.");
    }
}

const inventario = async (req, res) => {
    const plataformasJuegos = await Plataforma.findAll();
    try {
        const plataformas = await VideojuegoPlataforma.findAll({
            include: [
                {
                    model: Videojuego,
                    attributes: ['id_videojuego', 'nombre_juego', 'costo', 'precio', 'imagen', 'link_video', 'informacion'], // Traer columnas relevantes
                },
                {
                    model: Plataforma,
                    attributes: ['id_plataforma', 'nombre_plataforma'], // Traer columnas relevantes
                },
            ],
        });

        res.render("vistasRoles/trb/inventario", { 
            plataformas, 
            plataformasJuegos,
            //csrf:req.csrfToken(), 
        });
    } catch (error) {
        console.error("Error al obtener los juegos:", error);
        res.status(500).send("Error al obtener los juegos.");
    }
}


export{
    trabajador, inventario
}