import sequelize from "../config/conexion.js";
import { DataTypes } from "sequelize";
import Categoria from "./categorias.model.js";
import { MiembroUnidad } from "./miembros.model.js";

const Indicador = sequelize.define(
    "Indicador",
    {
        ind_cod: {
            type: DataTypes.STRING(10),
            allowNull: false,
            primaryKey: true,
        },
        cat_cod: {
            type: DataTypes.STRING(5),
            allowNull: false,
            references: {
                model: Categoria,
                key: "cat_cod",
            },
        },
        mie_ci: {
            type: DataTypes.STRING(10),
            allowNull: false,
            references: {
                model: MiembroUnidad,
                key: "mie_ci",
            },
        },
        ind_nombre: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        ind_puntos: {
            type: DataTypes.SMALLINT,
            allowNull: false,
        },
    },
    {
        tableName: "gm_wsi_indicadores",
        timestamps: false,
    }
);

// Relaciones
Categoria.hasMany(Indicador, { foreignKey: "cat_cod" });
Indicador.belongsTo(Categoria, { foreignKey: "cat_cod" });

MiembroUnidad.hasMany(Indicador, { foreignKey: "mie_ci" });
Indicador.belongsTo(MiembroUnidad, { foreignKey: "mie_ci" });

export default Indicador;
