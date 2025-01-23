import sequelize from "../config/conexion.js";
import { DataTypes } from "sequelize";
import Categoria from "./categorias.model.js";
import { MiembroUnidad } from "./miembros.model.js";
import RangoIndicador from "./rangos.model.js";
import Usuario from "./usuario.model.js";


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
        user_id: {
            type: DataTypes.STRING(10),
            allowNull: false,
            references: {
                model: Usuario,
                key: "user_id",
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

Usuario.hasMany(Indicador, { foreignKey: "user_id" });
Indicador.belongsTo(Usuario, { foreignKey: "user_id" });

Indicador.hasMany(RangoIndicador, { foreignKey: "ind_cod" }); 
RangoIndicador.belongsTo(Indicador, { foreignKey: "ind_cod" }); 

export default Indicador;
