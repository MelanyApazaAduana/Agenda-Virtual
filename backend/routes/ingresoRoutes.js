import express from 'express';
import {
    listarIngresos,
    obtenerIngreso,
    crearIngreso,
    actualizarIngreso,
    eliminarIngreso,
    obtenerResumenIngresos,
    obtenerIngresosPorRango
} from '../controllers/ingresoController.js';
import { verificarAutenticacion } from '../middleware/auth.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(verificarAutenticacion);

// Rutas principales
router.get('/', listarIngresos);
router.get('/resumen', obtenerResumenIngresos);
router.get('/rango', obtenerIngresosPorRango);
router.get('/:id', obtenerIngreso);

router.post('/', crearIngreso);

router.put('/:id', actualizarIngreso);

router.delete('/:id', eliminarIngreso);

export default router;