import Sequelize from "sequelize";
import { DataTypes } from 'sequelize';
import db from '../config/db.js';

const Carrito = db.define('carritos', {
    id_carrito: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    id_usuario: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
            model: 'usuarios', // Debe coincidir con el nombre del modelo de usuarios
            key: 'id_usuario'
        }
    },
    estado: {
        type: DataTypes.ENUM('Pendiente', 'Completado'),
        allowNull: false,
        defaultValue: 'Pendiente'
    },
    cantidad_producto: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    total_compra: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    }
}, {
    timestamps: false,
});

export default Carrito;
