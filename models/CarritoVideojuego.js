import Sequelize from "sequelize";
import { DataTypes } from 'sequelize';
import db from '../config/db.js';
import Carrito from "./Carrito.js";
import Videojuego from "./Videojuego.js";

const CarritoVideojuego = db.define('carritos_videojuegos', {
    id_videojuego: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'videojuegos',
            key: 'id_videojuego'
        }
    },
    id_carrito: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'carritos',
            key: 'id_carrito'
        }
    },
    cantidad: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
}, {
    timestamps: false,
});

export default CarritoVideojuego;
