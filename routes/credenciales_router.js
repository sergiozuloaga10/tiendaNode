import express from "express";
import {inicioSesion,registrandoEnlace,registrando, credenciales, confirmarInscripcionEnlace, logout} from "../controllers/credenciales/registroController.js"

const routerCredenciales=express.Router();
//Routing
//para la vista alta credenciales
routerCredenciales.get('/',inicioSesion);
routerCredenciales.get('/registrar',registrandoEnlace);
routerCredenciales.get('/logout', logout)
routerCredenciales.post('/registrar',registrando);
routerCredenciales.post('/credenciales',credenciales);

//confirmando token
routerCredenciales.get('/confirmarinscripcion/:token', confirmarInscripcionEnlace);

export default routerCredenciales