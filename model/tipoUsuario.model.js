import { DataTypes } from "sequelize";
import sequelize from "../config/conexion.js";
import PermisoUsuario from "./permisosUsuarios.model.js";

const TipoUsuario = sequelize.define('TipoUsuario', {
    tipus_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    perus_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'PermisoUsuario',
            key: 'perus_id'
        }
    },
    tipus_detalles: {
        type: DataTypes.STRING(50),
        allowNull: false
    }
}, {
    tableName: 'tipos_usuarios',
    timestamps: false,
    freezeTableName: true
});

PermisoUsuario.hasMany(TipoUsuario, { foreignKey: 'perus_id', as: 'TipoUsuarios' });
TipoUsuario.belongsTo(PermisoUsuario, { foreignKey: 'perus_id' });

export default TipoUsuario;