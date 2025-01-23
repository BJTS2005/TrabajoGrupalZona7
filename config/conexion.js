import { Sequelize } from "sequelize";


const sequelize = new Sequelize('postgres', 'GM_TE', 'GM_TE', {
    host: 'bdd-unificada.postgres.database.azure.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: {
            require: true, 
            rejectUnauthorized: false, 
        },
    },
});

export const testDbConnection = async () => {
    try {
        await sequelize.authenticatae();
        console.log('Conexión exitosa a la base de datos');
    } catch (error) {
        console.log('Error al conectar la base de datos', error);
        throw error;
    }
};

export default sequelize;


