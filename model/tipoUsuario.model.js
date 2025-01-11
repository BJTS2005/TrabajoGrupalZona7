import { DataTypes } from "sequelize";
import sequelize from "../config/conexion";
import PermisoUsuario from "./PermisoUsuario";
import Usuario from "./usuario.model.js";

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
            model: 'permisos_usuarios',
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

TipoUsuario.belongsTo(PermisoUsuario, { foreignKey: 'perus_id', as: 'permiso' });
PermisoUsuario.hasMany(TipoUsuario, { foreignKey: 'perus_id', as: 'tipos' });

Usuario.belongsTo(TipoUsuario, { foreignKey: 'tipus_id', as: 'tipo' });
TipoUsuario.hasMany(Usuario, { foreignKey: 'tipus_id', as: 'usuarios' });

export default TipoUsuario;