import express from "express";
import {guardarCarrito, inicio, obtenerCarrito, subirCarrito, subirMetodoPago} from "../controllers/inicioController.js";
import rutaProteger from "../middleware/rutasProteger.js";

const router = express.Router();
//Routing
router.get('/inicio', rutaProteger, inicio);

router.post('/carrito/guardar', rutaProteger, subirCarrito);
router.post('/metodo-pago', rutaProteger, subirMetodoPago);
router.post('/guardar-carrito', rutaProteger, guardarCarrito);
router.get('/obtener-carrito', rutaProteger, obtenerCarrito);

router.get('/debug-sesion', (req, res) => {
    res.json({
        sessionID: req.sessionID,
        carrito: req.session.carrito || [],
        total: req.session.total || 0,
        cantidad: req.session.cantidad || 0
    });
});


export default router
