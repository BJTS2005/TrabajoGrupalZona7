import sequelize from "../config/conexion.js";
import { DataTypes } from "sequelize";
import Magnitudes from "./magnitud.js";

const Unidades = sequelize.define(
    "Unidades",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'uni_id_unidad',
        allowNull: true,
      },
      nombre: {
        type: DataTypes.STRING(50),
        allowNull: false,
        field: 'uni_nombre'
      },
      simbolo: {
        type: DataTypes.STRING(10),
        field: 'uni_simbolo',
        allowNull: true,
      },
      idMagnitud: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: Magnitudes,
          key: 'mag_id_magnitud',
        },
        field: 'uni_id_magnitud'
      },
    },
    {
      tableName: "UNIDADES",
      timestamps: false,
    }
  );
  
  Unidades.belongsTo(Magnitudes, { foreignKey: 'idMagnitud' });
  Magnitudes.hasMany(Unidades, { foreignKey: 'idMagnitud' });
  
  export default Unidades;

