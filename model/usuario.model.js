import { DataTypes } from "sequelize";
import sequelize from "../config/conexion.js";
import TipoUsuario from "./tipoUsuario.model.js"; 

const Usuario = sequelize.define('Usuario', {
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    tipus_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'tipos_usuarios',
            key: 'tipus_id'
        }
    },
    user_nombre: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    user_apellido: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    user_email: {
        type: DataTypes.STRING(35),
        allowNull: false,
        unique: true
    },
    user_password: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    user_telefono: {
        type: DataTypes.STRING(10),
        allowNull: false
    },
    user_estado: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: true
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: true
    },user_cedula: {
        type: DataTypes.STRING(10),
        allowNull: false
    }
}, {
    tableName: 'usuarios',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    freezeTableName: true
});




TipoUsuario.hasMany(Usuario, { foreignKey: 'tipus_id', as: 'Usuarios' });
Usuario.belongsTo(TipoUsuario, { foreignKey: 'tipus_id' });

export default Usuario;