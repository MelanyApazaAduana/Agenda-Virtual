import express from 'express';
import {
    obtenerMiPresupuesto,
    establecerMiPresupuesto
} from '../controllers/presupuestoController.js';
import { verificarAutenticacion } from '../middleware/auth.js';

const router = express.Router();

router.use(verificarAutenticacion);

// Presupuesto único por usuario
router.get('/mi', obtenerMiPresupuesto);
router.put('/mi', establecerMiPresupuesto);

export default router;
