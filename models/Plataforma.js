import Sequelize from "sequelize";
import { DataTypes } from 'sequelize';
import VideojuegoPlataforma from './VideojuegoPlataforma.js';
import db from '../config/db.js';

const Plataforma = db.define('plataformas', {
    id_plataforma: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nombre_plataforma: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, { 
    timestamps: false, // No usamos createdAt y updatedAt
});

export default Plataforma;
