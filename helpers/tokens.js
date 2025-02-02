import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config({path: '.env'});

const idGenera=()=>Math.random().toString(32).substring(2)+Date.now().toString(32);

function JWTGenera(us) {
    // Define una clave secreta para firmar el token
    const secretKey = process.env.SC_JWT;

    // Define el payload del token
    const payload = {
        id: us.id_usuario,
        nombre: us.nombre_usuario,
        email: us.correo
        // Puedes añadir más información que quieras incluir en el token
    };

    // Opciones del token (puedes definir el tiempo de expiración, etc.)
    const options = {
        expiresIn: '1h' // El token expirará en 1 hora
    };

    // Genera el token con el payload y la clave secreta
    const token = jwt.sign(payload, secretKey, options);

    return token;
} 

export {
    idGenera,
    JWTGenera
}