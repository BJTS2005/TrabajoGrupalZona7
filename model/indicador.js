import { DataTypes } from "sequelize";
import sequelize from "../config/conexion.js";
import Magnitudes from "./magnitud.js";

const Indicadores = sequelize.define(
  "Indicadores",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      primaryKey: true,
      autoIncrement: true,
      field: 'ind_id_indicador'
    },
    nombre: {
      type: DataTypes.STRING(150),
      allowNull: false,
      field: 'ind_nombre'
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'ind_descripcion'
    },
    idMagnitud: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Magnitudes,
        key: 'mag_id_magnitud',
      },
      field: 'ind_id_magnitud'
    },
  },
  {
    tableName: "INDICADORES",
    timestamps: false,
  }
);


Indicadores.belongsTo(Magnitudes, { foreignKey: 'idMagnitud' });
Magnitudes.hasMany(Indicadores, { foreignKey: 'idMagnitud' });

export default Indicadores;
