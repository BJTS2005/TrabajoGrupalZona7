import { DataTypes } from "sequelize";
import sequelize from "../config/conexion.js";

const PermisoUsuario = sequelize.define('PermisoUsuario', {
    perus_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    perus_detalle: {
        type: DataTypes.STRING(50),
        allowNull: false
    }
}, {
    tableName: 'permisos_usuarios',
    timestamps: false,
    freezeTableName: true
});


export default PermisoUsuario;