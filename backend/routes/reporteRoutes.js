import { Router } from 'express';
import { verificarAutenticacion } from '../middleware/auth.js';
import { obtenerMovimientos } from '../controllers/reporteController.js';

const router = Router();

router.get('/movimientos', verificarAutenticacion, obtenerMovimientos);

export default router;
