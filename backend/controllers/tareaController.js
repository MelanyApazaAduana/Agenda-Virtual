import TareaModel from '../models/TareaModel.js';

// Color por defecto de la tarjeta de tarea (verde)
const COLOR_TAREA_POR_DEFECTO = '#10B981';

export const crearTarea = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const {
            titulo,
            descripcion,
            fecha_limite,
            fecha_completado,
            estado,
            prioridad,
            color_hex,
            recurrencia_id
        } = req.body;

        if (!titulo || titulo.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'El título de la tarea es obligatorio'
            });
        }

        const nuevaTarea = await TareaModel.crear({
            usuario_id: usuarioId,
            titulo: titulo.trim(),
            descripcion: descripcion || null,
            fecha_limite: fecha_limite || null,
            fecha_completado: fecha_completado || null,
            estado: estado || 'por_hacer',
            prioridad: prioridad || 'media',
            color_hex: color_hex || COLOR_TAREA_POR_DEFECTO,
            recurrencia_id: recurrencia_id || null
        });

        res.status(201).json({
            success: true,
            message: 'Tarea creada exitosamente',
            data: nuevaTarea
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

export const listarTareas = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const { estado, prioridad, fecha_limite_hasta } = req.query;

        const filtros = {};
        if (estado) filtros.estado = estado;
        if (prioridad) filtros.prioridad = prioridad;
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
            descripcion,
            fecha_limite,
            fecha_completado,
            estado,
            prioridad,
            color_hex,
            recurrencia_id
        } = req.body;

        const tareaExistente = await TareaModel.obtenerPorId(id, usuarioId);
        if (!tareaExistente) {
            return res.status(404).json({
                success: false,
                message: 'Tarea no encontrada'
            });
        }

        await TareaModel.actualizar(id, usuarioId, {
            titulo: titulo !== undefined ? titulo : tareaExistente.titulo,
            descripcion: descripcion !== undefined ? descripcion : tareaExistente.descripcion,
            fecha_limite: fecha_limite !== undefined ? fecha_limite : tareaExistente.fecha_limite,
            fecha_completado: fecha_completado !== undefined ? fecha_completado : tareaExistente.fecha_completado,
            estado: estado || tareaExistente.estado,
            prioridad: prioridad || tareaExistente.prioridad,
            color_hex: color_hex !== undefined ? color_hex : tareaExistente.color_hex,
            recurrencia_id: recurrencia_id !== undefined ? recurrencia_id : tareaExistente.recurrencia_id
        });

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

export const cambiarEstadoTarea = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const { id } = req.params;
        const { estado } = req.body;

        const estadosPermitidos = ['por_hacer', 'en_progreso', 'completada', 'cancelada'];

        if (!estado || !estadosPermitidos.includes(estado)) {
            return res.status(400).json({
                success: false,
                message: `Estado no válido. Use: ${estadosPermitidos.join(', ')}`
            });
        }

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
