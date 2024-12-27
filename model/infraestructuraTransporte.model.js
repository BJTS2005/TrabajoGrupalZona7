import sequelize from "../config/conexion.js";
import { DataTypes } from "sequelize";
import Campus from "./campus.model.js"; 

// Modelo para TIPOS_INF
const TipoInfraestructura = sequelize.define(
    "TipoInfraestructura",
    {
        tpi_id: {
            type: DataTypes.STRING(5),
            allowNull: false,
            primaryKey: true,
        },
        tpi_detalle: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
    },
    {
        tableName: "tipos_inf",
        timestamps: false,
        freezeTableName: true,
    }
);

// Modelo para GM_TE_INFRAESTRUCTURAS_TRANSPOR
const InfraestructuraTransporte = sequelize.define(
    "InfraestructuraTransporte",
    {
        int_id: {
            type: DataTypes.STRING(5),
            allowNull: false,
            primaryKey: true,
        },
        int_detalle: {
            type: DataTypes.STRING(100),
            allowNull: false,
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
        tpi_id: {
            type: DataTypes.STRING(5),
            allowNull: false,
            references: {
                model: TipoInfraestructura,
                key: "tpi_id",
            },
            onDelete: "RESTRICT",
            onUpdate: "CASCADE",
        },
        int_ubicacion: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        int_area: {
            type: DataTypes.DECIMAL,
            allowNull: false,
        },
        int_fecha_registro: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    },
    {
        tableName: "gm_te_infraestructuras_transpor",
        timestamps: false,
        freezeTableName: true,
    }
);

// Relaciones
Campus.hasMany(InfraestructuraTransporte, { foreignKey: "camp_id", as: "InfraestructurasTransporte" });
InfraestructuraTransporte.belongsTo(Campus, { foreignKey: "camp_id" });

TipoInfraestructura.hasMany(InfraestructuraTransporte, { foreignKey: "tpi_id", as: "Infraestructuras" });
InfraestructuraTransporte.belongsTo(TipoInfraestructura, { foreignKey: "tpi_id" });

export { InfraestructuraTransporte, TipoInfraestructura };
