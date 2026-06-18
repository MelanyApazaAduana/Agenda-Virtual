import express from 'express';
import {
    crearTarea,
    crearListaTarea,
    listarTareas,
    listarTareasPorElemento,
    obtenerTarea,
    actualizarTarea,
    eliminarTarea,
    eliminarTareaCompleta,
    cambiarEstadoTarea,
    cambiarPrioridadTarea,
    listarTareasVencidas,
    listarTareasPorEstado
} from '../controllers/tareaController.js';

import { verificarAutenticacion } from '../middleware/auth.js';

const router = express.Router();

// Aplicar middleware a todas las rutas
router.use(verificarAutenticacion);

router.get('/vencidas', listarTareasVencidas);                          
router.get('/estado/:estado', listarTareasPorEstado);                   
router.get('/elemento/:elemento_id', listarTareasPorElemento);          
router.post('/existente', crearListaTarea);              

router.post('/', crearTarea);                                           
router.get('/', listarTareas);                                          
router.get('/:id', obtenerTarea);                                       
router.put('/:id', actualizarTarea);                                    
router.delete('/:id', eliminarTarea);                                   
router.delete('/:id/completo', eliminarTareaCompleta);                  
router.patch('/:id/estado', cambiarEstadoTarea);                        
router.patch('/:id/prioridad', cambiarPrioridadTarea);                  

export default router;