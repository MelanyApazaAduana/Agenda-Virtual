import express from 'express';
import {
    listarRecordatorios,
    obtenerRecordatorio,
    crearRecordatorio,
    actualizarRecordatorio,
    marcarLeido,
    posponerRecordatorio,
    cancelarRecordatorio,
    eliminarRecordatorio,
    listarRecordatoriosPorEvento,
    listarRecordatoriosPorTarea,
    obtenerRecordatoriosPendientes,
    listarRecordatoriosPorRango,
    obtenerResumenRecordatorios,
    limpiarRecordatoriosViejos
} from '../controllers/recordatorioController.js';
import { verificarAutenticacion } from '../middleware/auth.js';

const router = express.Router();

router.use(verificarAutenticacion);

router.get('/', listarRecordatorios);
router.get('/resumen', obtenerResumenRecordatorios);
router.get('/rango', listarRecordatoriosPorRango);
router.get('/pendientes', obtenerRecordatoriosPendientes);

router.get('/evento/:evento_id', listarRecordatoriosPorEvento);
router.get('/tarea/:tarea_id', listarRecordatoriosPorTarea);

router.delete('/limpiar/viejos', limpiarRecordatoriosViejos);

router.get('/:id', obtenerRecordatorio);
router.post('/', crearRecordatorio);
router.put('/:id', actualizarRecordatorio);

router.patch('/:id/leido', marcarLeido);
router.patch('/:id/posponer', posponerRecordatorio);
router.patch('/:id/cancelar', cancelarRecordatorio);

router.delete('/:id', eliminarRecordatorio);

export default router;
