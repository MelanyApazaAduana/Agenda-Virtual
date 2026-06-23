import express from 'express';
import {
    listarPresupuestos,
    obtenerPresupuestoVigente,
    obtenerPresupuesto,
    crearPresupuesto,
    eliminarPresupuesto
} from '../controllers/presupuestoController.js';
import { verificarAutenticacion } from '../middleware/auth.js';

const router = express.Router();

router.use(verificarAutenticacion);

router.get('/', listarPresupuestos);
router.get('/vigente', obtenerPresupuestoVigente);
router.get('/:id', obtenerPresupuesto);
router.post('/', crearPresupuesto);
router.delete('/:id', eliminarPresupuesto);

export default router;
