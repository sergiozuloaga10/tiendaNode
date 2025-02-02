import Sequelize from "sequelize";
import { DataTypes } from 'sequelize';
import db from '../config/db.js';

const MetodoPago = db.define('metodo_pagos', {
    id_usuario: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'usuarios',
            key: 'id_usuario'
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
    tipo_pago: {
        type: DataTypes.ENUM('Efectivo', 'Tarjeta de Credito', 'Tarjeta de Debito'),
        allowNull: false,
        defaultValue: 'Efectivo'
    },
    fecha_compra: {
        type: DataTypes.DATE,
        allowNull: false
    },
    numero_tarjeta: {
        type: DataTypes.STRING(16),
        allowNull: true
    },
    nombre_tarjeta: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    vencimiento_tarjeta: {
        type: DataTypes.DATE,
        allowNull: true
    },
    cvv: {
        type: DataTypes.STRING(3),
        allowNull: true
    }
}, {
    timestamps: false,
});

export default MetodoPago;
