import Usuario from "../../models/Usuario.js";
import { check, validationResult } from "express-validator";
import { idGenera, JWTGenera } from "../../helpers/tokens.js";

import { correoRegistro } from "../../helpers/correos.js";
import dotenv from "dotenv";
import { render } from "pug";
dotenv.config({path:'.env'});

const logout = (req, res) => {
    res.render("credenciales/logout"), {
        pagina: "cerrar sesion",
        csrf:req.csrfToken(),
    }
}

const inicioSesion = (req, res) => {
    res.render("credenciales/login", {
    pagina: "Autentificación",
    csrf:req.csrfToken(),
});
};

const registrandoEnlace = (req, res) => {
    res.render("credenciales/registrar", {
    pagina: "Alta Usuario",
    csrf:req.csrfToken(),
});
};

const registrando = async (req, res) => {
    let valido = await validacionFormulario(req);

    if (!valido.isEmpty()) {
            return res.render("credenciales/registrar", {
            pagina: "Alta Usuario",
            csrf:req.csrfToken(),
            errores: valido.array(),
        });
    }

    const usuario = await Usuario.create({
        nombre_usuario: req.body.nombre_usuario,
        contraseña: req.body.contraseña,
        correo:req.body.correo,
        direccion: req.body.direccion,
        id_rol:1,
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
        return res.render("credenciales/login", {
            pagina: "Alta Usuario",
            errores: "",
        })
    }

    //mostrar mensaje de confirmacions
    res.render("credenciales/confirmacion", {
        pagina: "Usuario se registro exitosamente, verifica tu correo",
        csrf:req.csrfToken(),
    });

};

const confirmarInscripcionEnlace = async (req, res) => {
    const {token} = req.params;
    //token valido
    const usuario = await Usuario.findOne({
        where: {token}
    });

    if(!usuario){
        res.render("credenciales/confirmacion", {
            pagina: "No se pudo confirmar tu cuenta",
            mensaje: "Lo lamentamos, no se pudo confirmar tu cuenta"
        });
    }

    //confirmar la cuenta del usuario
    usuario.token = token;
    usuario.confirmar = true;
    await usuario.save();

    res.render("credenciales/confirmacion", {
        pagina: "Su cuenta se confirmo exitosamente",
        mensaje: "Felicidades, el registro se termino exitosamente",
        enlace: "salto"
    });
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

const credenciales = async (req, res) => {
    let valido = await validacionFormularioInicio(req);
    if (!valido.isEmpty()) {
        console.log("Errores en la validación del formulario");
        return res.render("credenciales/login", {
            pagina: "Alta Usuario",
            csrf: req.csrfToken(),
            errores: valido.array(),
        });
    }

    const { correo, contraseña } = req.body;
    const us = await Usuario.findOne({ where: { correo } });

    if (!us) {
        console.log("Usuario no encontrado");
        return res.render("credenciales/login", {
            pagina: "Alta Usuario",
            csrf: req.csrfToken(),
            errores: [{ msg: 'El usuario no existe' }],
        });
    }

    if (!us.confirmar) {
        console.log("Usuario no confirmado");
        return res.render("credenciales/login", {
            pagina: "Alta Usuario",
            csrf: req.csrfToken(),
            errores: [{ msg: 'Tu cuenta no tiene confirmación, revisa tu correo' }],
        });
    }

    if (!us.verificandoClave(contraseña)) {
        console.log(contraseña);
        console.log("Contraseña incorrecta");
        return res.render("credenciales/login", {
            pagina: "Alta Usuario",
            csrf: req.csrfToken(),
            errores: [{ msg: 'Credenciales no válidas' }],
        });
    }


    const ruta = (us) => {
        let renderiza;
        if(us.id_rol === 3){
            renderiza = "/adm";
        } else if(us.id_rol === 2){
            renderiza = "/trb";
        }else{
            renderiza = "/inicio";
            
        }
        
        return renderiza;
    }

    const token = JWTGenera(us);
    console.log("Token generado:", token);

    req.session.id_usuario = us.id_usuario;

    return res.cookie('_token', token, {
        httpOnly: true,
        //maxAge: 60 * 1000
        //secure: true,
    }).redirect(ruta(us));
};


async function validacionFormularioInicio(req) {
    await check("correo")
    .notEmpty()
    .withMessage("El correo no debe ser vacio")
    .run(req);
    await check("contraseña")
    .notEmpty()
    .withMessage("Clave no debe ser vacio")
    .run(req);
    let salida = validationResult(req);
    return salida;
}

export {inicioSesion,registrandoEnlace,registrando,confirmarInscripcionEnlace,credenciales, logout};
