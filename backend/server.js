import express from 'express'
import cors from 'cors'
import session from 'express-session'
import dotenv from 'dotenv'
import cron from 'node-cron';

import passport from './config/passport.js'
import authRoutes from './routes/authRoutes.js'
import categoriaRoutes from './routes/categoriaRoutes.js'
import tareaRoutes from './routes/tareaRoutes.js'
import eventoRoutes from './routes/eventoRoutes.js'
import ingresoRoutes from './routes/ingresoRoutes.js'
import EventoModel from './models/EventoModel.js'

import notaRoutes from './routes/notaRoutes.js'
import recordatorioRoutes from './routes/recordatorioRoutes.js';
import gastoRoutes from './routes/gastoRoutes.js';

import calendarioRoutes from './routes/calendarioRoutes.js';


import { testConnection } from './config/database.js'
import { inicializarBaseDeDatos } from './config/initDb.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Middlewares
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

// Configuración de sesión
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 24 * 60 * 60 * 1000  // 24 horas
    }
}))

// Inicializar Passport
app.use(passport.initialize())
app.use(passport.session())

// Rutas
app.use('/auth', authRoutes);

app.use('/categorias', categoriaRoutes);

app.use('/eventos', eventoRoutes);

app.use('/tareas', tareaRoutes);

app.use('/ingresos', ingresoRoutes);

app.use('/notas',notaRoutes);

app.use('/recordatorios',recordatorioRoutes);

app.use('/gastos',gastoRoutes);

app.use('/calendario',calendarioRoutes);

// Ruta de prueba
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Servidor funcionando',
        autenticado: req.isAuthenticated() || false
    })
})

cron.schedule('0 * * * *', async () => {
    console.log('🔄 Ejecutando actualización automática de estados...');
    try {
        const resultado = await EventoModel.actualizarEstadosAutomaticos(null);
        if (resultado.actualizados > 0) {
            console.log(`Estados actualizados: ${resultado.actualizados} eventos`);
        } else {
            console.log(`No hay eventos para actualizar`);
        }
    } catch (error) {
        console.error('Error en actualización automática:', error.message);
    }
});

// Ejecutar una vez al iniciar el servidor (opcional)
// setTimeout(async () => {
//     console.log('🔄 [INICIO] Ejecutando primera actualización de estados...');
//     try {
//         const resultado = await EventoModel.actualizarEstadosAutomaticos(null);
//         if (resultado.actualizados > 0) {
//             console.log(`✅ [INICIO] Estados actualizados: ${resultado.actualizados} eventos`);
//         }
//     } catch (error) {
//         console.error('❌ [INICIO] Error en actualización inicial:', error.message);
//     }
// }, 5000); // Espera 5 segundos después de iniciar

// Arranque del servidor: primero asegura que la base de datos exista
const iniciarServidor = async () => {
    try {
        await inicializarBaseDeDatos()  // crea BD/tablas si faltan, conserva datos
    } catch (error) {
        console.error('No se pudo inicializar la base de datos. Abortando arranque.');
        process.exit(1);
    }

    app.listen(PORT, async () => {
        console.log(`Servidor corriendo en http://localhost:${PORT}`);
        await testConnection()
    })
}

iniciarServidor()