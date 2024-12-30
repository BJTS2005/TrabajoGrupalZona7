import sequelize from "../config/conexion.js";
import { DataTypes } from "sequelize";
import Campus from "./campus.model.js";

const Curso = sequelize.define(
    "Curso",
    {
        cur_id: {
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
        },
        cur_descripcion: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        cur_es_sostenible: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
    },
    {
        tableName: "gm_te_cursos",
        timestamps: false,
        freezeTableName: true,
    }
);

// Relaciones
Campus.hasMany(Curso, { foreignKey: "camp_id", as: "Cursos" });
Curso.belongsTo(Campus, { foreignKey: "camp_id" });

export default Curso;
