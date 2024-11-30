import { DataTypes } from "sequelize";
import sequelize from "../config/conexion.js";
import Indicadores from "./indicador.js";

const CategoriasIndicador = sequelize.define(
  "CategoriasIndicador",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      primaryKey: true,
      autoIncrement: true,
      field: 'cat_id_categoria'
    },
    idIndicador: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Indicadores,
        key: 'ind_id_indicador',
      },
      field: 'cat_id_indicador'
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'cat_descripcion'
    },
  },
  {
    tableName: "CATEGORIAS_INDICADOR",
    timestamps: false,
  }
);


CategoriasIndicador.belongsTo(Indicadores, { foreignKey: 'idIndicador' });
Indicadores.hasMany(CategoriasIndicador, { foreignKey: 'idIndicador' });

export default CategoriasIndicador;
