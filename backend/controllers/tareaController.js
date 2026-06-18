import ElementoModel from '../models/ElementoModel.js';
import TareaModel from '../models/TareaModel.js';

export const crearTarea = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const {
            titulo,
            categoria_id,
            descripcion,
            fecha_limite,
            fecha_completado,
            estado,
            prioridad,
            instancia_id,
            ingreso_id,
            presupuesto_asignado
        } = req.body;

        // Validaciones obligatorias
        if (!titulo || titulo.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'El título de la tarea es obligatorio'
            });
        }

        // Crear tarea con nuevo elemento
        const nuevaTarea = await TareaModel.CrearNuevaTarea({
            usuario_id: usuarioId,
            categoria_id: categoria_id || null,
            titulo: titulo.trim(),
            descripcion: descripcion || null,
            fecha_limite: fecha_limite || null,
            fecha_completado: fecha_completado || null,
            estado: estado || 'por_hacer',
            prioridad: prioridad || 'media',
            instancia_id: instancia_id || null,
            ingreso_id: ingreso_id || null,
            presupuesto_asignado: presupuesto_asignado || null
        });

        const tareaCompleta = await TareaModel.obtenerPorId(nuevaTarea.id, usuarioId);

        res.status(201).json({
            success: true,
            message: 'Tarea creada exitosamente',
            data: tareaCompleta
        });

    } catch (error) {
        console.error('Error al crear tarea:', error);
        res.status(500).json({
            success: false,
            message: 'Error al crear la tarea',
            error: error.message
        });
    }
};

export const crearListaTarea = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const {
            elemento_id,
            descripcion,
            fecha_limite,
            fecha_completado,
            estado,
            prioridad,
            instancia_id,
            ingreso_id,
            presupuesto_asignado
        } = req.body;

        // Validaciones
        if (!elemento_id) {
            return res.status(400).json({
                success: false,
                message: 'El ID del elemento es obligatorio'
            });
        }

        // Verificar que el elemento existe y pertenece al usuario
        const elemento = await ElementoModel.obtenerPorId(elemento_id, usuarioId);
        if (!elemento) {
            return res.status(404).json({
                success: false,
                message: 'Elemento no encontrado o no pertenece al usuario'
            });
        }

        // Crear tarea con elemento existente
        const nuevaTarea = await TareaModel.crearConElementoExistente({
            elemento_id,
            descripcion: descripcion || null,
            fecha_limite: fecha_limite || null,
            fecha_completado: fecha_completado || null,
            estado: estado || 'por_hacer',
            prioridad: prioridad || 'media',
            instancia_id: instancia_id || null,
            ingreso_id: ingreso_id || null,
            presupuesto_asignado: presupuesto_asignado || null
        });

        // Obtener la tarea completa
        const tareaCompleta = await TareaModel.obtenerPorId(nuevaTarea.id, usuarioId);

        res.status(201).json({
            success: true,
            message: 'Tarea creada exitosamente usando elemento existente',
            data: tareaCompleta
        });

    } catch (error) {
        console.error('Error al crear tarea con elemento existente:', error);
        res.status(500).json({
            success: false,
            message: 'Error al crear la tarea',
            error: error.message
        });
    }
};

export const listarTareas = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const { estado, prioridad, categoria_id, fecha_limite_hasta } = req.query;

        const filtros = {};
        if (estado) filtros.estado = estado;
        if (prioridad) filtros.prioridad = prioridad;
        if (categoria_id) filtros.categoria_id = parseInt(categoria_id);
        if (fecha_limite_hasta) filtros.fecha_limite_hasta = fecha_limite_hasta;

        const tareas = await TareaModel.listarPorUsuario(usuarioId, filtros);

        res.json({
            success: true,
            data: tareas,
            total: tareas.length,
            filtros_aplicados: filtros
        });

    } catch (error) {
        console.error('Error al listar tareas:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener las tareas',
            error: error.message
        });
    }
};

export const listarTareasPorElemento = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const { elemento_id } = req.params;

        // Verificar que el elemento existe
        const elemento = await ElementoModel.obtenerPorId(elemento_id, usuarioId);
        if (!elemento) {
            return res.status(404).json({
                success: false,
                message: 'Elemento no encontrado o no pertenece al usuario'
            });
        }

        const tareas = await TareaModel.listarPorElementoId(elemento_id, usuarioId);

        res.json({
            success: true,
            data: {
                elemento: elemento,
                tareas: tareas,
                total: tareas.length
            }
        });

    } catch (error) {
        console.error('Error al listar tareas por elemento:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener las tareas del elemento',
            error: error.message
        });
    }
};

export const obtenerTarea = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const { id } = req.params;

        const tarea = await TareaModel.obtenerPorId(id, usuarioId);

        if (!tarea) {
            return res.status(404).json({
                success: false,
                message: 'Tarea no encontrada'
            });
        }

        res.json({
            success: true,
            data: tarea
        });

    } catch (error) {
        console.error('Error al obtener tarea:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener la tarea',
            error: error.message
        });
    }
};

export const actualizarTarea = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const { id } = req.params;
        const {
            titulo,
            categoria_id,
            descripcion,
            fecha_limite,
            fecha_completado,
            estado,
            prioridad,
            instancia_id,
            ingreso_id,
            presupuesto_asignado
        } = req.body;

        
        const tareaExistente = await TareaModel.obtenerPorId(id, usuarioId);
        if (!tareaExistente) {
            return res.status(404).json({
                success: false,
                message: 'Tarea no encontrada'
            });
        }

        
        if (titulo || categoria_id !== undefined) {
            const tituloFinal = titulo || tareaExistente.titulo;
            const categoriaFinal = categoria_id !== undefined ? categoria_id : tareaExistente.categoria_id;

            await ElementoModel.actualizar(tareaExistente.elemento_id, usuarioId, {
                titulo: tituloFinal,
                categoria_id: categoriaFinal
            });
        }


        await TareaModel.actualizar(id, usuarioId, {
            descripcion: descripcion !== undefined ? descripcion : tareaExistente.descripcion,
            fecha_limite: fecha_limite !== undefined ? fecha_limite : tareaExistente.fecha_limite,
            fecha_completado: fecha_completado !== undefined ? fecha_completado : tareaExistente.fecha_completado,
            estado: estado || tareaExistente.estado,
            prioridad: prioridad || tareaExistente.prioridad,
            instancia_id: instancia_id !== undefined ? instancia_id : tareaExistente.instancia_id,
            ingreso_id: ingreso_id !== undefined ? ingreso_id : tareaExistente.ingreso_id,
            presupuesto_asignado: presupuesto_asignado !== undefined ? presupuesto_asignado : tareaExistente.presupuesto_asignado
        });

        // Obtener la tarea actualizada
        const tareaActualizada = await TareaModel.obtenerPorId(id, usuarioId);

        res.json({
            success: true,
            message: 'Tarea actualizada exitosamente',
            data: tareaActualizada
        });

    } catch (error) {
        console.error('Error al actualizar tarea:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar la tarea',
            error: error.message
        });
    }
};


export const eliminarTarea = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const { id } = req.params;

        // Verificar que la tarea existe
        const tarea = await TareaModel.obtenerPorId(id, usuarioId);
        if (!tarea) {
            return res.status(404).json({
                success: false,
                message: 'Tarea no encontrada'
            });
        }

        const eliminado = await TareaModel.eliminar(id, usuarioId);

        if (eliminado) {
            res.json({
                success: true,
                message: 'Tarea eliminada exitosamente'
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'No se pudo eliminar la tarea'
            });
        }

    } catch (error) {
        console.error('Error al eliminar tarea:', error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar la tarea',
            error: error.message
        });
    }
};

export const eliminarTareaCompleta = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const { id } = req.params;

        // Verificar que la tarea existe
        const tarea = await TareaModel.obtenerPorId(id, usuarioId);
        if (!tarea) {
            return res.status(404).json({
                success: false,
                message: 'Tarea no encontrada'
            });
        }

        // Obtener el elemento_id antes de eliminar
        const elementoId = tarea.elemento_id;
        const eliminado = await TareaModel.eliminarCompleto(id, usuarioId);

        if (eliminado) {
            // Verificar si el elemento fue eliminado o se mantuvo
            const elemento = await ElementoModel.obtenerPorId(elementoId, usuarioId);
            
            res.json({
                success: true,
                message: elemento ? 
                    'Tarea eliminada. El elemento se mantiene porque otras tareas lo usan' :
                    'Tarea y elemento eliminados completamente',
                data: {
                    elemento_eliminado: !elemento,
                    elemento_mantenido: !!elemento
                }
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'No se pudo eliminar la tarea'
            });
        }

    } catch (error) {
        console.error('Error al eliminar tarea completa:', error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar la tarea',
            error: error.message
        });
    }
};


export const cambiarEstadoTarea = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const { id } = req.params;
        const { estado } = req.body;

        const estadosPermitidos = ['por_hacer', 'completada', 'cancelada'];

        if (!estado || !estadosPermitidos.includes(estado)) {
            return res.status(400).json({
                success: false,
                message: `Estado no válido. Use: ${estadosPermitidos.join(', ')}`
            });
        }

        // Verificar que la tarea existe
        const tarea = await TareaModel.obtenerPorId(id, usuarioId);
        if (!tarea) {
            return res.status(404).json({
                success: false,
                message: 'Tarea no encontrada'
            });
        }

        const actualizado = await TareaModel.cambiarEstado(id, usuarioId, estado);

        if (actualizado) {
            const tareaActualizada = await TareaModel.obtenerPorId(id, usuarioId);
            res.json({
                success: true,
                message: `Estado cambiado a ${estado}`,
                data: tareaActualizada
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'No se pudo cambiar el estado'
            });
        }

    } catch (error) {
        console.error('Error al cambiar estado:', error);
        res.status(500).json({
            success: false,
            message: 'Error al cambiar el estado de la tarea',
            error: error.message
        });
    }
};

export const cambiarPrioridadTarea = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const { id } = req.params;
        const { prioridad } = req.body;

        const prioridadesPermitidas = ['baja', 'media', 'alta', 'urgente'];

        if (!prioridad || !prioridadesPermitidas.includes(prioridad)) {
            return res.status(400).json({
                success: false,
                message: `Prioridad no válida. Use: ${prioridadesPermitidas.join(', ')}`
            });
        }

        // Verificar que la tarea existe
        const tarea = await TareaModel.obtenerPorId(id, usuarioId);
        if (!tarea) {
            return res.status(404).json({
                success: false,
                message: 'Tarea no encontrada'
            });
        }

        const actualizado = await TareaModel.cambiarPrioridad(id, usuarioId, prioridad);

        if (actualizado) {
            const tareaActualizada = await TareaModel.obtenerPorId(id, usuarioId);
            res.json({
                success: true,
                message: `Prioridad cambiada a ${prioridad}`,
                data: tareaActualizada
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'No se pudo cambiar la prioridad'
            });
        }

    } catch (error) {
        console.error('Error al cambiar prioridad:', error);
        res.status(500).json({
            success: false,
            message: 'Error al cambiar la prioridad de la tarea',
            error: error.message
        });
    }
};

export const listarTareasVencidas = async (req, res) => {
    try {
        const usuarioId = req.user.id;

        const tareasVencidas = await TareaModel.listarVencidas(usuarioId);

        res.json({
            success: true,
            data: tareasVencidas,
            total: tareasVencidas.length
        });

    } catch (error) {
        console.error('Error al listar tareas vencidas:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener las tareas vencidas',
            error: error.message
        });
    }
};

export const listarTareasPorEstado = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const { estado } = req.params;

        const tareas = await TareaModel.listarPorEstado(usuarioId, estado);

        res.json({
            success: true,
            data: tareas,
            total: tareas.length
        });

    } catch (error) {
        console.error('Error al listar tareas por estado:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener las tareas por estado',
            error: error.message
        });
    }
};