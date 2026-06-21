import express from 'express';
import {
    listarGastos,
    obtenerGasto,
    crearGasto,
    actualizarGasto,
    eliminarGasto,
    listarGastosPorEntidad,
    listarGastosPorRango,
    listarGastosPorMes,
    obtenerResumenGastos,
    obtenerGastosPorCategoria,
    obtenerGastosPorTipoEntidad,
    obtenerGastosPorMetodoPago,
    verificarGastoExistente
} from '../controllers/gastoController.js';
import { verificarAutenticacion } from '../middleware/auth.js';

const router = express.Router();

router.use(verificarAutenticacion);

router.get('/', listarGastos);
router.get('/resumen', obtenerResumenGastos);
router.get('/rango', listarGastosPorRango);
router.get('/mes/:año/:mes', listarGastosPorMes);
router.get('/:id', obtenerGasto);

router.get('/reportes/categoria', obtenerGastosPorCategoria);
router.get('/reportes/tipo-entidad', obtenerGastosPorTipoEntidad);
router.get('/reportes/metodo-pago', obtenerGastosPorMetodoPago);

router.get('/entidad/:tipo_entidad/:entidad_id', listarGastosPorEntidad);

router.post('/', crearGasto);
router.put('/:id', actualizarGasto);
router.delete('/:id', eliminarGasto);

router.get('/:id/existe', verificarGastoExistente);

export default router;