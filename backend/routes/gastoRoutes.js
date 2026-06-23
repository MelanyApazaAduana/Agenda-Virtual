import express from 'express';
import {
    listarGastos,
    obtenerGasto,
    crearGasto,
    actualizarGasto,
    eliminarGasto,
    listarGastosPorTarea,
    listarGastosPorRango,
    listarGastosPorMes,
    obtenerResumenGastos,
    obtenerGastosPorMetodoPago,
    verificarGastoExistente
} from '../controllers/gastoController.js';
import { verificarAutenticacion } from '../middleware/auth.js';

const router = express.Router();

router.use(verificarAutenticacion);

router.get('/', listarGastos);
router.get('/resumen', obtenerResumenGastos);
router.get('/rango', listarGastosPorRango);
router.get('/mes/:anio/:mes', listarGastosPorMes);

router.get('/reportes/metodo-pago', obtenerGastosPorMetodoPago);

router.get('/tarea/:tarea_id', listarGastosPorTarea);

router.get('/:id', obtenerGasto);
router.post('/', crearGasto);
router.put('/:id', actualizarGasto);
router.delete('/:id', eliminarGasto);

router.get('/:id/existe', verificarGastoExistente);

export default router;
