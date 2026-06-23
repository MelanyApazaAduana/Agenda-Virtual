import express from 'express';
import {
    listarRecurrencias,
    obtenerRecurrencia,
    crearRecurrencia,
    eliminarRecurrencia
} from '../controllers/recurrenciaController.js';
import { verificarAutenticacion } from '../middleware/auth.js';

const router = express.Router();

router.use(verificarAutenticacion);

router.get('/', listarRecurrencias);
router.get('/:id', obtenerRecurrencia);
router.post('/', crearRecurrencia);
router.delete('/:id', eliminarRecurrencia);

export default router;
