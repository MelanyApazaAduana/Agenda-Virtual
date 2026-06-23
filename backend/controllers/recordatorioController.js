import RecordatorioModel from '../models/RecordatorioModel.js';

// Listar todos los recordatorios del usuario
export const listarRecordatorios = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const {
            estado,
            evento_id,
            tarea_id,
            fecha_desde,
            fecha_hasta,
            solo_pendientes,
            orden,
            direccion,
            limite
        } = req.query;

        const filtros = {
            estado: estado || null,
            evento_id: evento_id ? parseInt(evento_id) : null,
            tarea_id: tarea_id ? parseInt(tarea_id) : null,
            fecha_desde: fecha_desde || null,
            fecha_hasta: fecha_hasta || null,
            solo_pendientes: solo_pendientes === 'true',
            orden: orden || 'fecha_envio',
            direccion: direccion || 'ASC',
            limite: limite ? parseInt(limite) : null
        };

        const recordatorios = await RecordatorioModel.listarPorUsuario(usuarioId, filtros);

        res.json({
            success: true,
            data: recordatorios,
            total: recordatorios.length,
            filtros
        });
    } catch (error) {
        console.error('Error al listar recordatorios:', error);
        res.status(500).json({
            success: false,
            mensaje: 'Error al listar los recordatorios',
            error: error.message
        });
    }
};

// Obtener un recordatorio por ID
export const obtenerRecordatorio = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const { id } = req.params;

        const recordatorio = await RecordatorioModel.obtenerPorId(id, usuarioId);
        if (!recordatorio) {
            return res.status(404).json({
                success: false,
                mensaje: 'Recordatorio no encontrado'
            });
        }

        res.json({
            success: true,
            data: recordatorio
        });
    } catch (error) {
        console.error('Error al obtener recordatorio:', error);
        res.status(500).json({
            success: false,
            mensaje: 'Error al obtener el recordatorio',
            error: error.message
        });
    }
};

// Crear un nuevo recordatorio
export const crearRecordatorio = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const { evento_id, tarea_id, fecha_envio, mensaje, repeticiones } = req.body;

        if (!fecha_envio) {
            return res.status(400).json({
                success: false,
                mensaje: 'La fecha de envío es obligatoria'
            });
        }

        if ((!evento_id && !tarea_id) || (evento_id && tarea_id)) {
            return res.status(400).json({
                success: false,
                mensaje: 'El recordatorio debe apuntar a un evento o a una tarea, pero no a ambos'
            });
        }

        const nuevoRecordatorio = await RecordatorioModel.crear(usuarioId, {
            evento_id,
            tarea_id,
            fecha_envio,
            mensaje,
            repeticiones
        });

        res.status(201).json({
            success: true,
            mensaje: 'Recordatorio creado exitosamente',
            data: nuevoRecordatorio
        });
    } catch (error) {
        console.error('Error al crear recordatorio:', error);
        res.status(400).json({
            success: false,
            mensaje: 'Error al crear el recordatorio',
            error: error.message
        });
    }
};

// Actualizar un recordatorio
export const actualizarRecordatorio = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const { id } = req.params;
        const { fecha_envio, mensaje, estado, repeticiones } = req.body;

        const recordatorioExistente = await RecordatorioModel.obtenerPorId(id, usuarioId);
        if (!recordatorioExistente) {
            return res.status(404).json({
                success: false,
                mensaje: 'Recordatorio no encontrado'
            });
        }

        const recordatorioActualizado = await RecordatorioModel.actualizar(id, usuarioId, {
            fecha_envio,
            mensaje,
            estado,
            repeticiones
        });

        res.json({
            success: true,
            mensaje: 'Recordatorio actualizado exitosamente',
            data: recordatorioActualizado
        });
    } catch (error) {
        console.error('Error al actualizar recordatorio:', error);
        res.status(400).json({
            success: false,
            mensaje: 'Error al actualizar el recordatorio',
            error: error.message
        });
    }
};

// Marcar recordatorio como leído
export const marcarLeido = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const { id } = req.params;

        const recordatorioExistente = await RecordatorioModel.obtenerPorId(id, usuarioId);
        if (!recordatorioExistente) {
            return res.status(404).json({
                success: false,
                mensaje: 'Recordatorio no encontrado'
            });
        }

        const recordatorioActualizado = await RecordatorioModel.marcarLeido(id, usuarioId);

        res.json({
            success: true,
            mensaje: 'Recordatorio marcado como leído',
            data: recordatorioActualizado
        });
    } catch (error) {
        console.error('Error al marcar recordatorio como leído:', error);
        res.status(400).json({
            success: false,
            mensaje: 'Error al marcar el recordatorio como leído',
            error: error.message
        });
    }
};

// Posponer recordatorio
export const posponerRecordatorio = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const { id } = req.params;
        const { nueva_fecha } = req.body;

        if (!nueva_fecha) {
            return res.status(400).json({
                success: false,
                mensaje: 'La nueva fecha de envío es requerida'
            });
        }

        const recordatorioExistente = await RecordatorioModel.obtenerPorId(id, usuarioId);
        if (!recordatorioExistente) {
            return res.status(404).json({
                success: false,
                mensaje: 'Recordatorio no encontrado'
            });
        }

        const recordatorioActualizado = await RecordatorioModel.posponer(id, usuarioId, nueva_fecha);

        res.json({
            success: true,
            mensaje: `Recordatorio pospuesto hasta ${nueva_fecha}`,
            data: recordatorioActualizado
        });
    } catch (error) {
        console.error('Error al posponer recordatorio:', error);
        res.status(400).json({
            success: false,
            mensaje: 'Error al posponer el recordatorio',
            error: error.message
        });
    }
};

// Cancelar recordatorio
export const cancelarRecordatorio = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const { id } = req.params;

        const recordatorioExistente = await RecordatorioModel.obtenerPorId(id, usuarioId);
        if (!recordatorioExistente) {
            return res.status(404).json({
                success: false,
                mensaje: 'Recordatorio no encontrado'
            });
        }

        const recordatorioActualizado = await RecordatorioModel.cancelar(id, usuarioId);

        res.json({
            success: true,
            mensaje: 'Recordatorio cancelado exitosamente',
            data: recordatorioActualizado
        });
    } catch (error) {
        console.error('Error al cancelar recordatorio:', error);
        res.status(400).json({
            success: false,
            mensaje: 'Error al cancelar el recordatorio',
            error: error.message
        });
    }
};

// Eliminar un recordatorio
export const eliminarRecordatorio = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const { id } = req.params;

        const eliminado = await RecordatorioModel.eliminar(id, usuarioId);
        if (!eliminado) {
            return res.status(404).json({
                success: false,
                mensaje: 'Recordatorio no encontrado'
            });
        }

        res.json({
            success: true,
            mensaje: 'Recordatorio eliminado exitosamente'
        });
    } catch (error) {
        console.error('Error al eliminar recordatorio:', error);
        res.status(500).json({
            success: false,
            mensaje: 'Error al eliminar el recordatorio',
            error: error.message
        });
    }
};

// Obtener recordatorios de un evento
export const listarRecordatoriosPorEvento = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const { evento_id } = req.params;

        const recordatorios = await RecordatorioModel.listarPorEvento(usuarioId, parseInt(evento_id));

        res.json({
            success: true,
            data: recordatorios,
            total: recordatorios.length,
            evento_id
        });
    } catch (error) {
        console.error('Error al listar recordatorios por evento:', error);
        res.status(500).json({
            success: false,
            mensaje: 'Error al listar los recordatorios del evento',
            error: error.message
        });
    }
};

// Obtener recordatorios de una tarea
export const listarRecordatoriosPorTarea = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const { tarea_id } = req.params;

        const recordatorios = await RecordatorioModel.listarPorTarea(usuarioId, parseInt(tarea_id));

        res.json({
            success: true,
            data: recordatorios,
            total: recordatorios.length,
            tarea_id
        });
    } catch (error) {
        console.error('Error al listar recordatorios por tarea:', error);
        res.status(500).json({
            success: false,
            mensaje: 'Error al listar los recordatorios de la tarea',
            error: error.message
        });
    }
};

// Obtener recordatorios pendientes (para el cron job)
export const obtenerRecordatoriosPendientes = async (req, res) => {
    try {
        const recordatorios = await RecordatorioModel.obtenerPendientes();

        res.json({
            success: true,
            data: recordatorios,
            total: recordatorios.length
        });
    } catch (error) {
        console.error('Error al obtener recordatorios pendientes:', error);
        res.status(500).json({
            success: false,
            mensaje: 'Error al obtener los recordatorios pendientes',
            error: error.message
        });
    }
};

// Obtener recordatorios por rango de fechas
export const listarRecordatoriosPorRango = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const { fecha_inicio, fecha_fin } = req.query;

        if (!fecha_inicio || !fecha_fin) {
            return res.status(400).json({
                success: false,
                mensaje: 'Se requieren fecha_inicio y fecha_fin'
            });
        }

        const recordatorios = await RecordatorioModel.listarPorRango(usuarioId, fecha_inicio, fecha_fin);

        res.json({
            success: true,
            data: recordatorios,
            total: recordatorios.length,
            fecha_inicio,
            fecha_fin
        });
    } catch (error) {
        console.error('Error al listar recordatorios por rango:', error);
        res.status(500).json({
            success: false,
            mensaje: 'Error al listar los recordatorios por rango',
            error: error.message
        });
    }
};

// Obtener resumen de recordatorios
export const obtenerResumenRecordatorios = async (req, res) => {
    try {
        const usuarioId = req.user.id;

        const resumen = await RecordatorioModel.obtenerResumen(usuarioId);
        const porEstado = await RecordatorioModel.contarPorEstado(usuarioId);

        res.json({
            success: true,
            data: {
                resumen,
                por_estado: porEstado
            }
        });
    } catch (error) {
        console.error('Error al obtener resumen de recordatorios:', error);
        res.status(500).json({
            success: false,
            mensaje: 'Error al obtener el resumen de recordatorios',
            error: error.message
        });
    }
};

// Limpiar recordatorios viejos
export const limpiarRecordatoriosViejos = async (req, res) => {
    try {
        const usuarioId = req.user.id;

        const eliminados = await RecordatorioModel.limpiarViejos(usuarioId);

        res.json({
            success: true,
            mensaje: `Se eliminaron ${eliminados} recordatorios viejos`,
            eliminados
        });
    } catch (error) {
        console.error('Error al limpiar recordatorios viejos:', error);
        res.status(500).json({
            success: false,
            mensaje: 'Error al limpiar los recordatorios viejos',
            error: error.message
        });
    }
};
