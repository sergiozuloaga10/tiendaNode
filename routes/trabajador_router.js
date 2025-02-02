import express from "express";
import { trabajador, inventario } from "../controllers/trabajador/trabajadorController.js";
import rutaProteger from "../middleware/rutasProteger.js";

const routerTrabajador = express.Router();

routerTrabajador.get('/', rutaProteger, trabajador);
routerTrabajador.get('/inventario', rutaProteger, inventario);

export default routerTrabajador;