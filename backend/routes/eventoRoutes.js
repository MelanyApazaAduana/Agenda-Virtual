import express from 'express';
import {
    crearEvento,
    listarEventos,
    obtenerEvento,
    actualizarEvento,
    //eliminarEvento,
    eliminarEventoCompleto,
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

router.post('/', crearEvento);                    // POST /api/eventos
router.get('/', listarEventos);                   // GET /api/eventos
router.get('/:id', obtenerEvento);                // GET /api/eventos/1
router.put('/:id', actualizarEvento);             // PUT /api/eventos/1
//router.delete('/:id', eliminarEvento);            // DELETE /api/eventos/1
router.delete('/:id/completo', eliminarEventoCompleto); // DELETE /api/eventos/1/completo
router.patch('/:id/estado', cambiarEstadoEvento); // PATCH /api/eventos/1/estado

export default router;