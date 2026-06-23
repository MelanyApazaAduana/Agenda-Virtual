import express from 'express';
import {
    listarEtiquetas,
    obtenerEtiqueta,
    crearEtiqueta,
    eliminarEtiqueta,
    crearEtiquetasPredeterminadas,
    vincularEtiqueta,
    desvincularEtiqueta,
    listarEtiquetasDeEntidad,
    listarEntidadesPorEtiqueta
} from '../controllers/etiquetaController.js';

import { verificarAutenticacion } from '../middleware/auth.js';

const router = express.Router();

// Aplicar middleware de autenticación a todas las rutas
router.use(verificarAutenticacion);

// Vínculos etiqueta <-> entidad
router.post('/vincular', vincularEtiqueta);                       // POST /etiquetas/vincular
router.post('/desvincular', desvincularEtiqueta);                 // POST /etiquetas/desvincular
router.get('/entidad/:entidad_tipo/:entidad_id', listarEtiquetasDeEntidad); // GET /etiquetas/entidad/evento/1

// Predeterminadas
router.post('/predeterminadas/crear', crearEtiquetasPredeterminadas);

// CRUD de etiquetas
router.get('/', listarEtiquetas);                                 // GET /etiquetas
router.post('/', crearEtiqueta);                                  // POST /etiquetas
router.get('/:id', obtenerEtiqueta);                              // GET /etiquetas/1
router.delete('/:id', eliminarEtiqueta);                          // DELETE /etiquetas/1
router.get('/:id/entidades', listarEntidadesPorEtiqueta);         // GET /etiquetas/1/entidades

export default router;
