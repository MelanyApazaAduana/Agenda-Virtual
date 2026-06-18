import express from 'express';
import {
    listarCategorias,
    listarCategoriasPorTipo,
    obtenerCategoria,
    crearCategoria,
    // actualizarCategoria,
    // eliminarCategoria,
    crearCategoriasPredeterminadas
} from '../controllers/categoriaController.js';

import { verificarAutenticacion } from '../middleware/auth.js';

const router = express.Router();
// Aplicar middleware de autenticación a todas las rutas
router.use(verificarAutenticacion);

// Rutas de categorías
router.get('/', listarCategorias);                           // GET /api/categorias
router.get('/tipo/:tipo', listarCategoriasPorTipo);         // GET /api/categorias/tipo/evento
router.get('/:id', obtenerCategoria);                       // GET /api/categorias/1
router.post('/', crearCategoria);                           // POST /api/categorias
// router.put('/:id', actualizarCategoria);                    // PUT /api/categorias/1
// router.delete('/:id', eliminarCategoria);                   // DELETE /api/categorias/1
router.post('/predeterminadas/crear', crearCategoriasPredeterminadas); // POST /api/categorias/predeterminadas/crear

export default router;