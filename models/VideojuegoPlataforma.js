import Sequelize from 'sequelize';
import { DataTypes } from 'sequelize';
import db from '../config/db.js';

const VideojuegoPlataforma = db.define('videojuegos_plataformas', {
    id_videojuego: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'videojuegos', // Nombre de la tabla Videojuego
            key: 'id'            // Clave primaria de Videojuego
        },
    },
    id_plataforma: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'plataformas', // Nombre de la tabla Plataforma
            key: 'id'             // Clave primaria de Plataforma
        },
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    stock_minimo: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
    },
    precio_plataforma: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    consola: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, { 
    timestamps: false, // Si no usas createdAt/updatedAt
    tableName: 'videojuegos_plataformas', // Asegúrate de que coincide con el nombre real de tu tabla
});

export default VideojuegoPlataforma;
