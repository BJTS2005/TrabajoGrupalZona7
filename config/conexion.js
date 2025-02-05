import { Sequelize } from "sequelize";


const sequelize = new Sequelize('Proyecto_Integrador', 'postgres', '1234', {
    host: 'localhost',
    dialect: 'postgres',
    port: 5432,
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


