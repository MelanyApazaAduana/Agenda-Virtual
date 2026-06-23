import express from 'express';
import {
    crearEvento,
    listarEventos,
    obtenerEvento,
    actualizarEvento,
    eliminarEvento,
    cambiarEstadoEvento,
    actualizarEstadosAutomaticos,
    actualizarEstadosGlobales
} from '../controllers/eventoController.js';

import { verificarAutenticacion } from '../middleware/auth.js';

const router = express.Router();

// Aplicar middleware de autenticación a todas las rutas
router.use(verificarAutenticacion);

router.put('/estados/actualizar', actualizarEstadosAutomaticos);      // Usuario actual
router.put('/estados/actualizar/global', actualizarEstadosGlobales);  // Todos (cron job)

router.post('/', crearEvento);                    // POST /eventos
router.get('/', listarEventos);                   // GET /eventos
router.get('/:id', obtenerEvento);                // GET /eventos/1
router.put('/:id', actualizarEvento);             // PUT /eventos/1
router.delete('/:id', eliminarEvento);            // DELETE /eventos/1
router.patch('/:id/estado', cambiarEstadoEvento); // PATCH /eventos/1/estado

export default router;
