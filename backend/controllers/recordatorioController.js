import RecordatorioModel from '../models/RecordatorioModel.js';

// Listar todos los recordatorios del usuario
export const listarRecordatorios = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const { 
            tipo_entidad, 
            estado, 
            entidad_id, 
            fecha_desde, 
            fecha_hasta, 
            solo_pendientes,
            orden,
            direccion,
            limite
        } = req.query;

        const filtros = {
            tipo_entidad: tipo_entidad || null,
            estado: estado || null,
            entidad_id: entidad_id ? parseInt(entidad_id) : null,
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
        const { tipo_entidad, entidad_id, fecha_envio, mensaje, repeticiones } = req.body;

        // Validaciones de entrada
        if (!tipo_entidad) {
            return res.status(400).json({
                success: false,
                mensaje: 'El tipo de entidad es obligatorio'
            });
        }

        if (!entidad_id) {
            return res.status(400).json({
                success: false,
                mensaje: 'El ID de la entidad es obligatorio'
            });
        }

        if (!fecha_envio) {
            return res.status(400).json({
                success: false,
                mensaje: 'La fecha de envío es obligatoria'
            });
        }

        // Validar que la fecha sea futura
        const fechaActual = new Date();
        const fechaEnvio = new Date(fecha_envio);
        if (fechaEnvio <= fechaActual) {
            return res.status(400).json({
                success: false,
                mensaje: 'La fecha de envío debe ser futura'
            });
        }

        const nuevoRecordatorio = await RecordatorioModel.crear(usuarioId, {
            tipo_entidad,
            entidad_id,
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

        // Verificar que el recordatorio existe
        const recordatorioExistente = await RecordatorioModel.obtenerPorId(id, usuarioId);
        if (!recordatorioExistente) {
            return res.status(404).json({
                success: false,
                mensaje: 'Recordatorio no encontrado'
            });
        }

        // Validar fecha futura si viene
        if (fecha_envio) {
            const fechaActual = new Date();
            const fechaEnvio = new Date(fecha_envio);
            if (fechaEnvio <= fechaActual) {
                return res.status(400).json({
                    success: false,
                    mensaje: 'La fecha de envío debe ser futura'
                });
            }
        }

        // Validar estado si viene
        if (estado) {
            const estadosValidos = ['programado', 'leido', 'pospuesto', 'cancelado'];
            if (!estadosValidos.includes(estado)) {
                return res.status(400).json({
                    success: false,
                    mensaje: 'Estado no válido. Debe ser: programado, leido, pospuesto o cancelado'
                });
            }
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

        // Validar que la nueva fecha sea futura
        const fechaActual = new Date();
        const nuevaFecha = new Date(nueva_fecha);
        if (nuevaFecha <= fechaActual) {
            return res.status(400).json({
                success: false,
                mensaje: 'La nueva fecha de envío debe ser futura'
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

// Obtener recordatorios por entidad
export const listarRecordatoriosPorEntidad = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const { tipo_entidad, entidad_id } = req.params;

        if (!tipo_entidad || !['evento', 'tarea', 'nota'].includes(tipo_entidad)) {
            return res.status(400).json({
                success: false,
                mensaje: 'Tipo de entidad no válido. Debe ser: evento, tarea o nota'
            });
        }

        if (!entidad_id) {
            return res.status(400).json({
                success: false,
                mensaje: 'El ID de la entidad es requerido'
            });
        }

        const recordatorios = await RecordatorioModel.listarPorEntidad(
            usuarioId, 
            tipo_entidad, 
            parseInt(entidad_id)
        );

        res.json({
            success: true,
            data: recordatorios,
            total: recordatorios.length,
            tipo_entidad,
            entidad_id
        });
    } catch (error) {
        console.error('Error al listar recordatorios por entidad:', error);
        res.status(500).json({
            success: false,
            mensaje: 'Error al listar los recordatorios de la entidad',
            error: error.message
        });
    }
};

// Obtener recordatorios pendientes (para el cron job)
export const obtenerRecordatoriosPendientes = async (req, res) => {
    try {
        // Solo permitir acceso interno o admin
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

        const recordatorios = await RecordatorioModel.listarPorRango(
            usuarioId,
            fecha_inicio,
            fecha_fin
        );

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

// Verificar si existe recordatorio para una entidad
export const verificarRecordatorioExistente = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const { tipo_entidad, entidad_id } = req.params;

        if (!tipo_entidad || !['evento', 'tarea', 'nota'].includes(tipo_entidad)) {
            return res.status(400).json({
                success: false,
                mensaje: 'Tipo de entidad no válido. Debe ser: evento, tarea o nota'
            });
        }

        if (!entidad_id) {
            return res.status(400).json({
                success: false,
                mensaje: 'El ID de la entidad es requerido'
            });
        }

        const existe = await RecordatorioModel.existeParaEntidad(
            usuarioId,
            tipo_entidad,
            parseInt(entidad_id)
        );

        res.json({
            success: true,
            data: {
                existe,
                tipo_entidad,
                entidad_id
            }
        });
    } catch (error) {
        console.error('Error al verificar recordatorio existente:', error);
        res.status(500).json({
            success: false,
            mensaje: 'Error al verificar el recordatorio',
            error: error.message
        });
    }
};