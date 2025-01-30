import sequelize from "../config/conexion.js";
import { DataTypes } from "sequelize";
import Campus from "./campus.model.js";

const GreenJob = sequelize.define(
    "GreenJob",
    {
        job_id: {
            type: DataTypes.STRING(5),
            allowNull: false,
            primaryKey: true,
        },
        job_detalle: {
            type: DataTypes.STRING(80),
            allowNull: false,
        },
    },
    {
        tableName: "gm_te_green_jobs",
        timestamps: false,
        freezeTableName: true,
    }
);

const GraduadoGreenJob = sequelize.define(
    "GraduadoGreenJob",
    {
        gra_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            autoIncrementIdentity: true, // Añade esta línea
            field: 'gra_id'
        }, 
        camp_id: {
            type: DataTypes.STRING(5),
            allowNull: false,
        },
        job_id: {
            type: DataTypes.STRING(5),
            allowNull: false,
        },
        gra_cantidad: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        tableName: "gm_te_graduados_green_jobs",
        timestamps: false,
        freezeTableName: true,
        indexes: [
            {
                unique: true,
                fields: ["camp_id", "job_id"], // Asegura unicidad en esta combinación
            },
        ],
    }
);

// Relaciones
Campus.hasMany(GraduadoGreenJob, { foreignKey: "camp_id", as: "GraduadosGreenJobs" });
GraduadoGreenJob.belongsTo(Campus, { foreignKey: "camp_id" });

GreenJob.hasMany(GraduadoGreenJob, { foreignKey: "job_id", as: "Graduados" });
GraduadoGreenJob.belongsTo(GreenJob, { foreignKey: "job_id" });

export { GreenJob, GraduadoGreenJob };
