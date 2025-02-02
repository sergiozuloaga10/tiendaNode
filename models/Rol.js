import Sequelize from "sequelize";
import {DataTypes} from 'sequelize';
import db from '../config/db.js';

const Rol= db.define('roles',{
    id_rol: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    },
    nombre_rol:{
    type:DataTypes.STRING,
    allowNull:false
    }
},{
    timestamps: false,
});
export default Rol;