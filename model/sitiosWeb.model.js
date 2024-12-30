import sequelize from "../config/conexion.js";
import { DataTypes } from "sequelize";
import Campus from "./campus.model.js"; 

const SitioWeb = sequelize.define(
    "SitioWeb",
    {
        id_sit: {
            type: DataTypes.STRING(5),
            allowNull: false,
            primaryKey: true,
        },
        camp_id: {
            type: DataTypes.STRING(5),
            allowNull: false,
            references: {
                model: Campus,
                key: "camp_id",
            },
            onDelete: "RESTRICT",
            onUpdate: "CASCADE",
        },
        sit_descripcion: {
            type: DataTypes.TEXT,
            allowNull: true, // Campo opcional
        },
        sit_url: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        sit_activo: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        sit_es_reporte: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
    },
    {
        tableName: "gm_te_sitios_web",
        timestamps: false,
        freezeTableName: true,
    }
);

// Relaciones
Campus.hasMany(SitioWeb, { foreignKey: "camp_id", as: "SitiosWeb" });
SitioWeb.belongsTo(Campus, { foreignKey: "camp_id" });

export default SitioWeb;
