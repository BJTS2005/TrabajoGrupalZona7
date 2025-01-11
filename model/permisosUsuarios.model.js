import { DataTypes } from "sequelize";
import sequelize from "../config/conexion";
import TipoUsuario from "./tipoUsuario.model.js";

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

PermisoUsuario.hasMany(TipoUsuario, { foreignKey: 'perus_id', as: 'tipos' });
TipoUsuario.belongsTo(PermisoUsuario, { foreignKey: 'perus_id', as: 'permiso' });

export default PermisoUsuario;