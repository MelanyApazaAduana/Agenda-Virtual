import express from 'express';
import {
    crearNota,
    listarNotas,
    obtenerNota,
    actualizarNota,
    eliminarNota,
    cambiarEstadoNota
} from '../controllers/notaController.js';

import { verificarAutenticacion } from '../middleware/auth.js';

const router = express.Router();

router.use(verificarAutenticacion);

router.post('/', crearNota);
router.get('/', listarNotas);
router.get('/:id', obtenerNota);
router.put('/:id', actualizarNota);
router.delete('/:id', eliminarNota);
router.patch('/:id/estado', cambiarEstadoNota);

export default router;
