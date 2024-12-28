import sequelize from "../config/conexion.js";
import { DataTypes } from "sequelize";
import Campus from "./campus.model.js";

const FondoInvestigacion = sequelize.define(
    "FondoInvestigacion",
    {
        fondo_id: {
            type: DataTypes.STRING(10),
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
        },
        fondo_total: {
            type: DataTypes.DECIMAL,
            allowNull: false,
        },
        fondo_sostenibilidad: {
            type: DataTypes.DECIMAL,
            allowNull: false,
        },
    },
    {
        tableName: "gm_te_fondos_investigacion",
        timestamps: false,
        freezeTableName: true,
    }
);

// Relación con Campus
Campus.hasOne(FondoInvestigacion, { foreignKey: "camp_id", as: "FondoInvestigacion" });
FondoInvestigacion.belongsTo(Campus, { foreignKey: "camp_id", as: "Campus" });

export default FondoInvestigacion;
