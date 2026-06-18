import express from 'express';
import { listarCalendario } from '../controllers/calendarioController.js';
import { verificarAutenticacion } from '../middleware/auth.js';

const router = express.Router();

router.use(verificarAutenticacion);

router.get('/', listarCalendario);

export default router;
