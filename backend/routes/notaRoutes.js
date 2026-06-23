import express from 'express';
import {
    listarNotas,
    obtenerNota,
    crearNota,
    actualizarNota,
    autoguardarNota,
    eliminarNota,
    listarNotasPorEvento,
    listarNotasPorTarea,
    buscarNotas,
    obtenerNotasRecientes,
    obtenerResumenNotas
} from '../controllers/notaController.js';
import { verificarAutenticacion } from '../middleware/auth.js';

const router = express.Router();

router.use(verificarAutenticacion);

router.get('/', listarNotas);
router.get('/recientes', obtenerNotasRecientes);
router.get('/resumen', obtenerResumenNotas);
router.get('/buscar', buscarNotas);
router.get('/evento/:eventoId', listarNotasPorEvento);
router.get('/tarea/:tareaId', listarNotasPorTarea);
router.get('/:id', obtenerNota);

router.post('/', crearNota);
router.put('/:id', actualizarNota);

router.post('/autoguardar', autoguardarNota);

router.delete('/:id', eliminarNota);

export default router;
