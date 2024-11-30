import sequelize from "../config/conexion.js";
import { DataTypes } from "sequelize";

const Magnitudes = sequelize.define(
    'Magnitud', 
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            primaryKey: true,
            autoIncrement: true,
            field: 'mag_id_magnitud',
        },
        nombre: {
            type: DataTypes.STRING(50),
            allowNull: false,
            field: 'mag_nombre',
        },
        descripcion: {
            type: DataTypes.TEXT,
            allowNull: true,
            field: 'mag_descripcion',
        },
    },
    {
        tableName: 'MAGNITUDES',
        timestamps: false,
    }

);

export default Magnitudes;