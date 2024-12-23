import sequelize from "../config/conexion.js";
import { DataTypes } from "sequelize";

const Campus = sequelize.define('Campus', {
    camp_id: {
      type: DataTypes.STRING(5),
      allowNull: false,
      primaryKey: true,
    },
    camp_nom: {
      type: DataTypes.STRING(25),
      allowNull: false,
    },
    camp_area: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    camp_perimetro: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    camp_capacidad: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    camp_cant_pobla: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    camp_dens_pobla: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    camp_calle_principal: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    camp_calle_secundaria: {
      type: DataTypes.STRING(50),
      allowNull: true,
    }
  }, {
    tableName: 'gm_wsi_campus', 
    timestamps: false, 
    freezeTableName: true 
  });

export default Campus;