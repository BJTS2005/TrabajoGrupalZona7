import { DataTypes } from "sequelize";
import sequelize from "../config/conexion.js";
import Indicador from "./indicadores.model.js";

const RangoIndicador = sequelize.define("RangoIndicador", {
    id_ran: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    ind_cod: {
        type: DataTypes.STRING(10),
        allowNull: true,
        references: {
            model: Indicador,
            key: "ind_cod",
        },
    },
    descripcion_ran: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    valor_ran: {
        type: DataTypes.DECIMAL,
        allowNull: false,
    },
    esta_seleccionado: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
}, {
    tableName: "gm_te_rangos_indicador",
    timestamps: false,
});

RangoIndicador.belongsTo(Indicador, { foreignKey: "ind_cod" });
Indicador.hasMany(RangoIndicador, { foreignKey: "ind_cod" });

export default RangoIndicador;
