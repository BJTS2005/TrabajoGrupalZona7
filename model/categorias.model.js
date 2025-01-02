import sequelize from "../config/conexion.js";
import { DataTypes } from "sequelize";

const Categoria = sequelize.define(
    "Categoria",
    {
        cat_cod: {
            type: DataTypes.STRING(5),
            allowNull: false,
            primaryKey: true,
        },
        cat_nombre: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        cat_porc: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
    },
    {
        tableName: "gm_wsi_categorias",
        timestamps: false,
    }
);

export default Categoria;
