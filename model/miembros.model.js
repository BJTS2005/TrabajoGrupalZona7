import sequelize from "../config/conexion.js";
import { DataTypes } from "sequelize";

const TipoMiembro = sequelize.define(
    "TipoMiembro",
    {
        tipmi_id: {
            type: DataTypes.STRING(4),
            allowNull: false,
            primaryKey: true,
        },
        tipmi_detalle: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
    },
    {
        tableName: "gm_wsi_tipos_miembros",
        timestamps: false,
    }
);

const MiembroUnidad = sequelize.define(
    "MiembroUnidad",
    {
        mie_ci: {
            type: DataTypes.STRING(10),
            allowNull: false,
            primaryKey: true,
        },
        tipmi_id: {
            type: DataTypes.STRING(4),
            allowNull: false,
            references: {
                model: TipoMiembro,
                key: "tipmi_id",
            },
        },
        mie_nombres: {
            type: DataTypes.STRING(25),
            allowNull: false,
        },
        mie_apellidos: {
            type: DataTypes.STRING(25),
            allowNull: false,
        },
        mie_telefono: {
            type: DataTypes.STRING(10),
            allowNull: false,
        },
        mie_mail: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
    },
    {
        tableName: "gm_wsi_miembros_unidad",
        timestamps: false,
    }
);

// Relaciones
TipoMiembro.hasMany(MiembroUnidad, { foreignKey: "tipmi_id" });
MiembroUnidad.belongsTo(TipoMiembro, { foreignKey: "tipmi_id" });

export { TipoMiembro, MiembroUnidad };
