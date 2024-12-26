import sequelize from "../config/conexion.js";
import { DataTypes } from "sequelize";

// Importar modelos relacionados
import Campus from "./campus.model.js";
import modelos from "../model/vehiculos.model.js";
const { TipoVehiculo, TipoEmision, Frecuencia, Vehiculo } = modelos;

const Shuttle = sequelize.define(
    "Shuttle",
    {
        sti_id: {
            type: DataTypes.STRING(5),
            allowNull: false,
            primaryKey: true,
        },
        tpe_id: {
            type: DataTypes.STRING(5),
            allowNull: true,
            references: {
                model: TipoEmision, // Relación con el modelo TipoEmision
                key: "tpe_id",
            },
            onDelete: "RESTRICT",
            onUpdate: "CASCADE",
        },
        camp_id: {
            type: DataTypes.STRING(5),
            allowNull: true,
            references: {
                model: Campus, // Relación con el modelo Campus
                key: "camp_id",
            },
            onDelete: "RESTRICT",
            onUpdate: "CASCADE",
        },
        sti_descripcion: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        sti_prom_pasajeros: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        sti_tot_viajes_dia: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        sti_fecha_registro: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    },
    {
        tableName: "gm_te_shuttles",
        timestamps: false,
        freezeTableName: true,
    }
);

// Relaciones
Shuttle.belongsTo(Campus, { foreignKey: "camp_id" });
Shuttle.belongsTo(TipoEmision, { foreignKey: "tpe_id" });

export default Shuttle;
