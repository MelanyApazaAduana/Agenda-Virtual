import express from 'express';
import {
    crearTarea,
    listarTareas,
    obtenerTarea,
    actualizarTarea,
    eliminarTarea,
    cambiarEstadoTarea,
    cambiarPrioridadTarea,
    listarTareasVencidas,
    listarTareasPorEstado
} from '../controllers/tareaController.js';

import { verificarAutenticacion } from '../middleware/auth.js';

const router = express.Router();

// Aplicar middleware a todas las rutas
router.use(verificarAutenticacion);

router.get('/vencidas', listarTareasVencidas);
router.get('/estado/:estado', listarTareasPorEstado);

router.post('/', crearTarea);
router.get('/', listarTareas);
router.get('/:id', obtenerTarea);
router.put('/:id', actualizarTarea);
router.delete('/:id', eliminarTarea);
router.patch('/:id/estado', cambiarEstadoTarea);
router.patch('/:id/prioridad', cambiarPrioridadTarea);

export default router;
