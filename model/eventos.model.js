import sequelize from "../config/conexion.js";
import { DataTypes } from "sequelize";
import Campus from "./campus.model.js"; 

// Modelo para GM_TE_TIPOS_EVENTO
const TipoEvento = sequelize.define(
    "TipoEvento",
    {
        tpe_id: {
            type: DataTypes.STRING(5),
            allowNull: false,
            primaryKey: true,
        },
        tpe_detalle: {
            type: DataTypes.STRING(30),
            allowNull: false,
        },
    },
    {
        tableName: "gm_te_tipos_evento",
        timestamps: false,
        freezeTableName: true,
    }
);

// Modelo para GM_TE_EVENTOS_SOSTENIBLES
const EventoSostenible = sequelize.define(
    "EventoSostenible",
    {
        id_eve: {
            type: DataTypes.STRING(5),
            allowNull: false,
            primaryKey: true,
        },
        tpe_id: {
            type: DataTypes.STRING(5),
            allowNull: false,
            references: {
                model: TipoEvento,
                key: "tpe_id",
            },
            onDelete: "RESTRICT",
            onUpdate: "CASCADE",
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
        eve_detalle: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        eve_fecha: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        eve_por_estudiantes: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
    },
    {
        tableName: "gm_te_eventos_sostenibles",
        timestamps: false,
        freezeTableName: true,
    }
);

// Relaciones
Campus.hasMany(EventoSostenible, { foreignKey: "camp_id", as: "EventosSostenibles" });
EventoSostenible.belongsTo(Campus, { foreignKey: "camp_id" });

TipoEvento.hasMany(EventoSostenible, { foreignKey: "tpe_id", as: "Eventos" });
EventoSostenible.belongsTo(TipoEvento, { foreignKey: "tpe_id" });

export { EventoSostenible, TipoEvento };
