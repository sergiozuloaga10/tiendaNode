import Sequelize from "sequelize";
import { DataTypes } from 'sequelize';
import db from '../config/db.js';
import VideojuegoPlataforma from './VideojuegoPlataforma.js';

const Videojuego = db.define('videojuegos', {
    id_videojuego: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nombre_juego: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    precio: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    costo: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    imagen: { // Nuevo campo para la imagen
        type: DataTypes.STRING,
        allowNull: false, // Cambiar a false si es obligatorio
    },
    link_video: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    informacion: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, { timestamps: false });

export default Videojuego;
