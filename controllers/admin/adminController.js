import db from "../../config/db.js";
import {upload} from "../../middleware/multer.js";
import { check, validationResult } from "express-validator";
import Usuario from "../../models/Usuario.js";
import CarritoVideojuego from "../../models/CarritoVideojuego.js"
import Videojuego from "../../models/Videojuego.js";
import MetodoPago from "../../models/MetodoPago.js"
import Rol from "../../models/Rol.js";
import { idGenera } from "../../helpers/tokens.js";
import { correoRegistro } from "../../helpers/correos.js";
import Plataforma from "../../models/Plataforma.js";
import VideojuegoPlataforma from "../../models/VideojuegoPlataforma.js";
import Carrito from "../../models/Carrito.js";

const admin = async (req, res) => {
    try{
        const totalUsuarios = await Usuario.count();
        const totalOrdenes = await Carrito.count();
        const totalJuegos = await Videojuego.count();
        res.render("vistasRoles/adm/admin", { totalUsuarios, totalOrdenes, totalJuegos });
    }catch(error){
        res.status(500).send("Error en el sistema.");
    }
}

const agregarUsuario = async (req, res) => {
    const roles = await Rol.findAll();
    res.render("vistasRoles/adm/registro_adm", {
        roles,
        csrf:req.csrfToken(),
    })
}

const registrandoUser = async (req, res) => {
    let valido = await validacionFormulario(req);
    const roles = await Rol.findAll();
    const Usuarios = await Usuario.findAll();

    if (!valido.isEmpty()) {
            return res.render("vistasRoles/adm/registro_admin", {
            pagina: "Alta Usuario",
            roles,
            Usuarios,
            errores: valido.array(),
        });
    }

    const usuario = await Usuario.create({
        nombre_usuario: req.body.nombre_usuario,
        contraseña: req.body.contraseña,
        correo:req.body.correo,
        direccion: req.body.direccion,
        id_rol:req.body.id_rol,
        token:idGenera()
    });

    await usuario.save();
    //mandando el correo
    correoRegistro({
        nombre: usuario.nombre,
        correo: usuario.correo,
        token: usuario.token
    });

    //comprobar si el usuario existe
    const {correo, password} = req.body
    const us = await Usuario.findOne({where:{correo}})

    if(!us){
        return res.render("vistasRoles/adm/registro_adm", {
            pagina: "Alta Usuario",
            csrf:req.csrfToken(),
            roles,
            Usuarios,
            errores: "",
        })
    }

    //mostrar mensaje de confirmacions
    res.redirect("/adm/us");

}

const editUser = async (req, res) => {
    const { id } = req.params;
  
    try {
      const user = await Usuario.findOne({ where: { id_usuario: id } });
      const roles = await Rol.findAll();
      if (!user) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }
  
      res.json({
        csrf:req.csrfToken(),
        id_usuario: user.id_usuario,
        nombre_usuario: user.nombre_usuario,
        contraseña: user.contraseña,
        correo: user.correo,
        id_rol: user.id_rol,
        direccion: user.direccion,
        roles,
        user
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al obtener los datos del usuario" });
    }
  };

  const subirEdicionUser = async (req, res) => {
    // Validación del formulario
    let valido = await validacionFormulario(req);
    const roles = await Rol.findAll();
    const Usuarios = await Usuario.findAll();

    // Si hay errores en la validación, volver a renderizar el formulario
    if (!valido.isEmpty()) {
        return res.render("vistasRoles/adm/users", {
            pagina: "Alta Usuario",
            roles,
            Usuarios,
            csrf: req.csrfToken(),
            errores: valido.array(),
        });
    }

    // Verificar si el usuario existe antes de intentar actualizar
    const usuario = await Usuario.findOne({ where: { id_usuario: req.body.id_usuario } });

    if (!usuario) {
        return res.render("vistasRoles/adm/users", {
            pagina: "Alta Usuario",
            roles,
            Usuarios,
            csrf: req.csrfToken(),
            errores: [{ msg: "Usuario no encontrado" }],
        });
    }

    // Actualizar los datos del usuario
    await Usuario.update({
        nombre_usuario: req.body.nombre_usuario,
        contraseña: usuario.contraseña,
        correo: req.body.correo,
        direccion: req.body.direccion,
        id_rol: req.body.id_rol,
        token: idGenera(), // Generar nuevo token si es necesario
    }, {
        where: { id_usuario: req.body.id_usuario } // Especificar el usuario a actualizar
    });

    console.log(usuario);

    // Enviar correo de confirmación
    if(usuario.confirmar === false){
        correoRegistro({
            nombre: usuario.nombre_usuario,
            correo: usuario.correo,
            token: usuario.token
        });
    }

    // Redirigir a la lista de usuarios o una página de éxito
    res.redirect("/adm/us");
};

const borrarUsuario = async (req, res) => {
    const {id} = req.params;
    const user = await Usuario.findOne({ where: { id_usuario: id } });

    res.json({
        csrf:req.csrfToken(),
        id_usuario: user.id_usuario,
        nombre_usuario: user.nombre_usuario,
    })
} 

const borrandoUsuario = async (req, res) => {
    const usuario = await Usuario.findOne({where: {id_usuario: req.body.id_usuario}});

    
    usuario.destroy();

    res.redirect("/adm/us");
}


//Seccion para acciones de los videojuegos
const games = async (req, res) => {
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

        res.render("vistasRoles/adm/games", { 
            plataformas, 
            plataformasJuegos,
            //csrf:req.csrfToken(), 
        });
    } catch (error) {
        console.error("Error al obtener los juegos:", error);
        res.status(500).send("Error al obtener los juegos.");
    }
    //console.log(req.csrfToken());
};

const registroJuegos = async (req, res) => {
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

        res.render('vistasRoles/adm/registroJuego' ,{
            //csrf: req.csrfToken(),
            plataformas,
            plataformasJuegos
        });
    } catch (error) {
        console.error("Error al obtener los juegos:", error);
        res.status(500).send("Error al obtener los juegos.");
    }
}

const registrarJuego = async (req, res) => {
    try {

        // Procesa la información del archivo subido
        const imagen = `/img/${req.file.filename}`; // Ruta relativa al archivo subido

        // Datos del formulario
        const { nombre_juego, precio, costo, id_plataforma, stock, stock_minimo, precio_plataforma, link_video, informacion } = req.body;

        // Guardar en la base de datos
        const nuevoVideojuego = await Videojuego.create({
            nombre_juego,
            precio,
            costo,
            imagen,
            link_video,
            informacion,
        });

        // Obtener la información de la plataforma
        const consola = await Plataforma.findOne({ where: { id_plataforma } });

        // Crear relación entre videojuego y plataforma
        await VideojuegoPlataforma.create({
            id_videojuego: nuevoVideojuego.id_videojuego,
            id_plataforma,
            stock,
            stock_minimo,
            precio_plataforma,
            consola: consola.nombre_plataforma,
        });

        res.redirect('/adm/games'); // Redirige tras éxito
    } catch (error) {
        console.error('Error al registrar el videojuego:', error);
        res.status(500).send('Error al registrar el videojuego.');
    }
};

const borrarJuego = async (req, res) => {
    const {id} = req.params;
    //const juegos = await VideojuegoPlataforma.findOne({where: {id_videojuego: id}});
    const game = await Videojuego.findOne({where: {id_videojuego: id}});
    res.json({
        csrf:req.csrfToken(),
        id_videojuego: game.id_videojuego,
        nombre_juego: game.nombre_juego
    })
    //console.log(`${game.id_videojuego}` + `${game.nombre_juego}`);
} 

const borrandoJuego = async (req, res) => {
    const juego = await VideojuegoPlataforma.findOne({
        where: { id_videojuego: req.body.id_videojuego}
    });

    const j = await CarritoVideojuego.findAll({
        where: { id_videojuego: req.body.id_videojuego}
    });

    const game = await Videojuego.findOne({where: {id_videojuego: req.body.id_videojuego}})
    juego.destroy();
    game.destroy();
    if(j){
        await Promise.all(j.map(async (j) => {
            await j.destroy(); // Eliminar cada elemento del carrito
        }));
    }
    res.redirect("/adm/games");
}

const orders = async (req, res) => {
    try {
        const orders = await Carrito.findAll({
            include: [
                {
                    model: Usuario, // Asegurarse de que se cargue la relación con Usuario
                    attributes: ['id_usuario', 'nombre_usuario', 'correo'],
                },
                {
                    model: CarritoVideojuego, // Relación muchos a muchos con Videojuego
                    include: [
                        {
                            model: Videojuego, // Incluir los videojuegos asociados
                            attributes: ['nombre_juego', 'precio'],
                        }
                    ]
                },
                {
                    model: MetodoPago, // Incluir el método de pago (opcional)
                    attributes: ['tipo_pago', 'fecha_compra'],
                }
            ]
        });

        // Calcular el total de compras de cada pedido si es necesario
        const totalOrdenes = orders.map(order => order.total_compra);
        //console.log(orders);

        res.render("vistasRoles/adm/orders", { orders, totalOrdenes });
    } catch (error) {
        console.log(error);
        res.status(500).send("Error al obtener las ordenes.");
    }
};

const viewOrder = async (req, res) => {
    try {
        const { id_carrito } = req.params;

        // Buscar el carrito con los juegos asociados
        const order = await Carrito.findOne({
            where: { id_carrito },
            include: [
                {
                    model: CarritoVideojuego,
                    include: [
                        {
                            model: Videojuego,
                            attributes: ['id_videojuego','nombre_juego', 'precio', 'informacion', 'imagen'], // Asegúrate de incluir los campos necesarios
                        }
                    ]
                },
                {
                    model: Usuario,
                    attributes: ['id_usuario','nombre_usuario', 'correo'],
                },
                {
                    model: MetodoPago,
                    attributes: ['tipo_pago', 'fecha_compra'],
                }
            ]
        });

        if (!order) {
            return res.status(404).send("Carrito no encontrado.");
        }
        //console.log(order.usuarios);

        res.render("vistasRoles/adm/viewOrder", { order });
    } catch (error) {
        console.error("Error al obtener los detalles del carrito:", error);
        res.status(500).send("Error al obtener los detalles del carrito.");
    }
};


const users = async (req, res) => {
    try {
        const Usuarios = await Usuario.findAll(); // Obtenemos los usuarios de la base de datos
        const roles = await Rol.findAll();
        //const totalUsuarios = Usuarios.length;    // Cuenta el total de usuarios
        res.render('vistasRoles/adm/users', { 
            Usuarios, 
            roles,
            csrf:req.csrfToken(), 
        });
      } catch (error) {
        console.error(error);
        res.status(500).send("Error al obtener los usuarios.");
      }
}

async function validacionFormulario(req) {
    await check("nombre_usuario")
    .notEmpty()
    .withMessage("Usuario no debe ser vacio")
    .run(req);
    await check("contraseña")
    .notEmpty()
    .withMessage("Contraseña no debe ser vacio")
    .run(req);
    await check("correo")
    .notEmpty()
    .withMessage("Correo no debe ser vacio")
    .run(req);
    await check("direccion")
    .notEmpty()
    .withMessage("Direccion no debe ser vacio")
    .run(req);

    let salida = validationResult(req);
    return salida;
}

export{
    admin, games, orders, users, agregarUsuario, registrandoUser, editUser, subirEdicionUser,
    borrarUsuario, borrandoUsuario, registroJuegos, registrarJuego, borrarJuego, borrandoJuego,
    viewOrder

}
