import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',  
    database: process.env.DB_NAME || 'agenda_virtual',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const promisePool = pool.promise();

// Probar conexión al iniciar
export const testConnection = async () => {
    try {
        const connection = await promisePool.getConnection()
        console.log('Conexion a la base de datos establecida correctamente')
        if (connection && connection.release) {
            connection.release()
        }
        return true
    } catch (error) {
        console.error('Error conectando a la base de datos:', error.message)
        return false
    }
}

export default promisePool;