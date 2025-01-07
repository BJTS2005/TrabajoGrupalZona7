import { Sequelize } from "sequelize";


const sequelize = new Sequelize('gmte', 'postgres', 'aaron', {
    host: 'localhost',
    dialect: 'postgres',
    port: 5432,
});

export const testDbConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Conexión exitosa a la base de datos');
    } catch (error) {
        console.log('Error al conectar la base de datos', error);
        throw error;
    }
};

export default sequelize;


