import { Sequelize } from "sequelize";
import { DataTypes } from "sequelize";
import db from "../config/db.js";
import Rol from "./Rol.js"
import bcrypt from "bcrypt";

const Usuario = db.define('usuario',{
    id_usuario: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nombre_usuario: {
        type: DataTypes.STRING,
        allowNull: false
    },
    correo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    contraseña: {
        type: DataTypes.STRING,
        allowNull: false
    },
    direccion: {
        type: DataTypes.STRING,
        allowNull: false
    },
    confirmar:DataTypes.BOOLEAN,
    token:DataTypes.STRING
    },{
        timestamps: false,
        hooks:{
            beforeCreate: async function (usuario){
                const rep = await bcrypt.genSalt(10);
                usuario.contraseña = await bcrypt.hash(usuario.contraseña,rep);
            } 
        },
        scopes:{
            elimiarClave:{
                attributes:{
                exclude:['token','contraseña','confirmar','id_rol']
                }
            }
        }
    });
    Rol.hasOne(Usuario, {
    foreignKey: {
    name: "id_rol",
    },
    });
    Usuario.belongsTo(Rol, {
    foreignKey: {
    name: "id_rol",
    },
});

//Metodo prototype
Usuario.prototype.verificandoClave=function(contraseña){
    return bcrypt.compareSync(contraseña,this.contraseña);
}

export default Usuario;