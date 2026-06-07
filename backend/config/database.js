const mysql = require('mysql2');
const dotenv = require('dotenv');

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
(async () => {
    try {
        const [result] = await promisePool.query('SELECT 1');
        console.log('Conexion a la base de datos establecida correctamente');
    } catch (error) {
        console.error('Error conectando a la base de datos:', error.message);
    }
})();

module.exports = promisePool;