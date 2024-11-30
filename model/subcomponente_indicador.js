import { DataTypes } from "sequelize";
import sequelize from "../config/conexion.js";
import Indicadores from "./indicador.js";
import Unidades from "./unidad.js";

const SubcomponentesIndicador = sequelize.define(
  "SubcomponentesIndicador",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      primaryKey: true,
      autoIncrement: true,
      field: 'sub_id_subcom'
    },
    idIndicador: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Indicadores,
        key: 'ind_id_indicador',
      },
      field: 'sub_id_indicador'
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'sub_nombre'
    },
    valor: {
      type: DataTypes.DECIMAL(12, 4),
      allowNull: false,
      field: 'sub_valor'
    },
    idUnidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Unidades,
        key: 'uni_id_unidad',
      },
      field: 'sub_id_unidad'
    },
  },
  {
    tableName: "SUBCOMPONENTES_INDICADOR",
    timestamps: false,
  }
);

SubcomponentesIndicador.belongsTo(Indicadores, { foreignKey: 'idIndicador' });
Indicadores.hasMany(SubcomponentesIndicador, { foreignKey: 'idIndicador' });

SubcomponentesIndicador.belongsTo(Unidades, { foreignKey: 'idUnidad' });
Unidades.hasMany(SubcomponentesIndicador, { foreignKey: 'idUnidad' });

export default SubcomponentesIndicador;
