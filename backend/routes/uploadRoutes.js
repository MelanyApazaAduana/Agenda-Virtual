import express from 'express';
import { subida } from '../config/uploads.js';
import { verificarAutenticacion } from '../middleware/auth.js';

const router = express.Router();

router.use(verificarAutenticacion);

// POST /uploads/:tipo  (tipo = documento | imagen | audio)
// Campo del formulario: "archivo". Devuelve la ruta pública del archivo.
router.post('/:tipo', (req, res) => {
    const manejador = subida.single('archivo');
    manejador(req, res, (err) => {
        if (err) {
            return res.status(400).json({ success: false, mensaje: err.message });
        }
        if (!req.file) {
            return res.status(400).json({ success: false, mensaje: 'No se recibió ningún archivo' });
        }
        const url = `/uploads/${req.file.filename}`;
        res.status(201).json({
            success: true,
            data: { url, nombre: req.file.originalname, tamano: req.file.size }
        });
    });
});

export default router;
