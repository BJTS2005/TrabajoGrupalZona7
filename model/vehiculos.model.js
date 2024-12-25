import sequelize from "../config/conexion.js";
import { DataTypes } from "sequelize";

import Campus from "./campus.model.js";

const TipoVehiculo = sequelize.define('TipoVehiculo', {
    tpv_id: {
        type: DataTypes.STRING(5),
        allowNull: false,
        primaryKey: true,
    },
    tpv_detalle: {
        type: DataTypes.STRING(30),
        allowNull: false,
    },
}, {
    tableName: 'gm_te_tipos_vehiculo',
    timestamps: false,
    freezeTableName: true,
});

// Modelo de GM_TE_TIPOS_EMISION
const TipoEmision = sequelize.define('TipoEmision', {
    tpe_id: {
        type: DataTypes.STRING(5),
        allowNull: false,
        primaryKey: true,
    },
    tpe_detalle: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
}, {
    tableName: 'gm_te_tipos_emision',
    timestamps: false,
    freezeTableName: true,
});

// Modelo de GM_TE_FRECUENCIAS
const Frecuencia = sequelize.define('Frecuencia', {
    fre_id: {
        type: DataTypes.STRING(5),
        allowNull: false,
        primaryKey: true,
    },
    fre_detalle: {
        type: DataTypes.STRING(30),
        allowNull: false,
    },
}, {
    tableName: 'gm_te_frecuencias',
    timestamps: false,
    freezeTableName: true,
});

// Modelo de GM_TE_VEHICULOS
const Vehiculo = sequelize.define('Vehiculo', {
    veh_id: {
        type: DataTypes.STRING(10),
        allowNull: false,
        primaryKey: true,
    },
    fre_id: {
        type: DataTypes.STRING(5),
        allowNull: false,
        references: {
            model: Frecuencia,
            key: 'fre_id',
        },
    },
    tpe_id: {
        type: DataTypes.STRING(5),
        allowNull: false,
        references: {
            model: TipoEmision,
            key: 'tpe_id',
        },
    },
    tpv_id: {
        type: DataTypes.STRING(5),
        allowNull: false,
        references: {
            model: TipoVehiculo,
            key: 'tpv_id',
        },
    },
    camp_id: {
        type: DataTypes.STRING(5),
        allowNull: false,
        references: {
            model: Campus,
            key: 'camp_id',
        },
    },
    veh_cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    veh_cantidad_ruedas: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    veh_fecha_registro: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    veh_distancia_aprox_recorrida: {
        type: DataTypes.DECIMAL,
        allowNull: false,
    },
}, {
    tableName: 'gm_te_vehiculos',
    timestamps: false,
    freezeTableName: true,
});

// Relaciones
Vehiculo.belongsTo(Frecuencia, { foreignKey: 'fre_id' });
Vehiculo.belongsTo(TipoEmision, { foreignKey: 'tpe_id' });
Vehiculo.belongsTo(TipoVehiculo, { foreignKey: 'tpv_id' });
Vehiculo.belongsTo(Campus, { foreignKey: 'camp_id' });

export default {TipoVehiculo, TipoEmision, Frecuencia, Vehiculo};


