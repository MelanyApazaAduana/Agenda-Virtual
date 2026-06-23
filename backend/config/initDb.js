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
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 3306;
    let conexion;

    try {
        // Conexion SIN base de datos seleccionada: la BD podria no existir todavia.
        conexion = await mysql.createConnection({
            host,
            port,
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            multipleStatements: true,  // init.sql contiene varias sentencias
            charset: 'utf8mb4'         // acentos y ñ
        });

        const rutaSql = path.join(__dirname, '..', 'migrations', 'init.sql');
        const sql = await fs.readFile(rutaSql, 'utf8');

        // init.sql incluye CREATE DATABASE IF NOT EXISTS + USE + CREATE TABLE IF NOT EXISTS
        await conexion.query(sql);

        // Migraciones idempotentes sobre BDs ya existentes (no afectan a BDs nuevas).
        const dbNombre = process.env.DB_NAME || 'agenda_virtual_v3';
        await ejecutarMigracion(conexion, `ALTER TABLE \`${dbNombre}\`.\`notas\` ADD COLUMN \`documento_url\` TEXT`);

        console.log('Base de datos verificada/creada correctamente (datos existentes conservados)');
    } catch (error) {
        // Mensajes claros segun la causa mas comun
        if (error.code === 'ECONNREFUSED') {
            console.error(`No se pudo conectar a MySQL en ${host}:${port}. ¿Está el servidor MySQL en ejecución?`);
        } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
            console.error('Acceso denegado a MySQL. Revisa DB_USER y DB_PASSWORD en backend/.env');
        } else {
            console.error('Error al inicializar la base de datos:', error.message);
        }
        throw error;
    } finally {
        if (conexion) await conexion.end();
    }
};

// Ejecuta una migración sin abortar el arranque si ya estaba aplicada (p. ej. columna duplicada).
const ejecutarMigracion = async (conexion, sentencia) => {
    try {
        await conexion.query(sentencia);
    } catch (error) {
        if (error.code !== 'ER_DUP_FIELDNAME') {
            console.warn('Migracion omitida:', error.message);
        }
    }
};

export default inicializarBaseDeDatos;
