import express from 'express';
import { obtenerResumenProductividad } from '../controllers/productividadController.js';
import { verificarAutenticacion } from '../middleware/auth.js';

const router = express.Router();

router.use(verificarAutenticacion);

router.get('/resumen', obtenerResumenProductividad); // GET /productividad/resumen

export default router;
