import mysql from 'mysql2/promise';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Crea la base de datos y sus tablas si no existen.
// Es idempotente: si la base de datos ya tiene datos, NO se borra nada
// (el script init.sql usa CREATE DATABASE/TABLE IF NOT EXISTS).
export const inicializarBaseDeDatos = async () => {
    // Conexion SIN base de datos seleccionada: la BD podria no existir todavia.
    const conexion = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        multipleStatements: true,  // init.sql contiene varias sentencias
        charset: 'utf8mb4'         // acentos y ñ
    });

    try {
        const rutaSql = path.join(__dirname, '..', 'migrations', 'init.sql');
        const sql = await fs.readFile(rutaSql, 'utf8');

        // init.sql incluye CREATE DATABASE IF NOT EXISTS + USE + CREATE TABLE IF NOT EXISTS
        await conexion.query(sql);

        console.log('Base de datos verificada/creada correctamente (datos existentes conservados)');
    } catch (error) {
        console.error('Error al inicializar la base de datos:', error.message);
        throw error;
    } finally {
        await conexion.end();
    }
};

export default inicializarBaseDeDatos;
