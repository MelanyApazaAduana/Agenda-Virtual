import express from 'express';
import {
    listarNotas,
    obtenerNota,
    crearNota,
    actualizarNota,
    autoguardarNota,
    guardarNota,
    cambiarEstadoNota,
    archivarNota,
    restaurarNota,
    eliminarNota,
    listarNotasArchivadas,
    listarNotasPorEvento,
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
router.get('/archivadas', listarNotasArchivadas);
router.get('/evento/:eventoId', listarNotasPorEvento);
router.get('/:id', obtenerNota);

router.post('/', crearNota);
router.put('/:id', actualizarNota);

router.post('/autoguardar', autoguardarNota);
router.post('/guardar/:id', guardarNota);

router.patch('/:id/estado', cambiarEstadoNota);
router.patch('/:id/archivar', archivarNota);
router.patch('/:id/restaurar', restaurarNota);

router.delete('/:id', eliminarNota);

export default router;