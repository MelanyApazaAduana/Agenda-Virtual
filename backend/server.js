const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const pool = require('./config/database');

// Middlewares
app.use(cors());           // Permite peticiones desde frontend (Vue)
app.use(express.json());   // Para recibir JSON en las peticiones
app.use(express.urlencoded({ extended: true }));


// Ruta de prueba
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'API funcionando' });
});

// Importar rutas (las crearemos luego)
// app.use('/api/eventos', require('./routes/api'));

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});