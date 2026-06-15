import express from 'express'
import cors from 'cors'
import session from 'express-session'
import dotenv from 'dotenv'
import passport from './config/passport.js'
import authRoutes from './routes/authRoutes.js'
import { testConnection } from './config/database.js'

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
    secret: process.env.SESSION_SECRET ,
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
app.use('/auth', authRoutes)

// Ruta de prueba
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Servidor funcionando',
        autenticado: req.isAuthenticated() || false
    })
})

app.listen(PORT, async () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    await testConnection()
})
