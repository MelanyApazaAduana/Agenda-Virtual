import EventoModel from '../models/EventoModel.js';

// Color por defecto del bloque de evento en el calendario (azul)
const COLOR_EVENTO_POR_DEFECTO = '#3B82F6';

export const crearEvento = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const {
            titulo,
            descripcion,
            fecha_inicio,
            fecha_fin,
            ubicacion,
            color_hex,
            recurrencia_id
        } = req.body;

        // validacion de fechas
        if (!titulo || titulo.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'El título del evento es obligatorio'
            });
        }

        if (!fecha_inicio) {
            return res.status(400).json({
                success: false,
                message: 'La fecha de inicio es obligatoria'
            });
        }

        if (!fecha_fin) {
            return res.status(400).json({
                success: false,
                message: 'La fecha de fin es obligatoria'
            });
        }

        const fechaInicioObj = new Date(fecha_inicio);
        const fechaFinObj = new Date(fecha_fin);

        if (fechaFinObj <= fechaInicioObj) {
            return res.status(400).json({
                success: false,
                message: 'La fecha de fin debe ser posterior a la fecha de inicio'
            });
        }

        // estado del evento
        const ahora = new Date();
        let estadoCalculado;

        if (fechaInicioObj > ahora) {
            estadoCalculado = 'pendiente';
        } else if (fechaInicioObj <= ahora && fechaFinObj > ahora) {
            estadoCalculado = 'en_curso';
        } else if (fechaFinObj <= ahora) {
            estadoCalculado = 'vencido';
        }

        let estadoFinal = estadoCalculado;
        if (req.body.estado && ['cancelado', 'completado', 'pospuesto'].includes(req.body.estado)) {
            estadoFinal = req.body.estado;
        }

        const evento = await EventoModel.crear({
            usuario_id: usuarioId,
            titulo: titulo.trim(),
            descripcion: descripcion || null,
            fecha_inicio,
            fecha_fin,
            ubicacion: ubicacion || null,
            color_hex: color_hex || COLOR_EVENTO_POR_DEFECTO,
            estado: estadoFinal,
            recurrencia_id: recurrencia_id || null
        });

        res.status(201).json({
            success: true,
            message: 'Evento creado exitosamente',
            data: evento,
            meta: {
                estado_calculado: estadoCalculado,
                estado_final: estadoFinal,
                fechas: {
                    ahora: ahora.toISOString(),
                    fecha_inicio: fechaInicioObj.toISOString(),
                    fecha_fin: fechaFinObj.toISOString()
                }
            }
        });

    } catch (error) {
        console.error('Error al crear evento:', error);
        res.status(500).json({
            success: false,
            message: 'Error al crear el evento',
            error: error.message
        });
    }
};

export const listarEventos = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const { fecha_inicio, fecha_fin, estado } = req.query;

        const filtros = {};

        if (fecha_inicio) filtros.fecha_inicio = fecha_inicio;
        if (fecha_fin) filtros.fecha_fin = fecha_fin;
        if (estado) filtros.estado = estado;

        const eventos = await EventoModel.listarPorUsuario(usuarioId, filtros);

        res.json({
            success: true,
            data: eventos,
            total: eventos.length,
            filtros_aplicados: filtros
        });

    } catch (error) {
        console.error('Error al listar eventos:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener los eventos',
            error: error.message
        });
    }
};

export const obtenerEvento = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const { id } = req.params;

        const evento = await EventoModel.obtenerPorId(id, usuarioId);

        if (!evento) {
            return res.status(404).json({
                success: false,
                message: 'Evento no encontrado'
            });
        }

        res.json({
            success: true,
            data: evento
        });

    } catch (error) {
        console.error('Error al obtener evento:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener el evento',
            error: error.message
        });
    }
};

export const actualizarEvento = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const { id } = req.params;
        const {
            titulo,
            descripcion,
            fecha_inicio,
            fecha_fin,
            ubicacion,
            color_hex,
            estado,
            recurrencia_id
        } = req.body;

        const eventoExistente = await EventoModel.obtenerPorId(id, usuarioId);
        if (!eventoExistente) {
            return res.status(404).json({
                success: false,
                message: 'Evento no encontrado'
            });
        }

        const fechaInicioFinal = fecha_inicio || eventoExistente.fecha_inicio;
        const fechaFinFinal = fecha_fin || eventoExistente.fecha_fin;

        const fechaInicioObj = new Date(fechaInicioFinal);
        const fechaFinObj = new Date(fechaFinFinal);

        if (fechaFinObj <= fechaInicioObj) {
            return res.status(400).json({
                success: false,
                message: 'La fecha de fin debe ser posterior a la fecha de inicio'
            });
        }

        // recalculo de estado por fechas modificadas
        const ahora = new Date();
        let estadoCalculado = null;

        const fechasCambiaron = fecha_inicio || fecha_fin;

        if (!estado || fechasCambiaron) {
            if (fechaInicioObj > ahora) {
                estadoCalculado = 'pendiente';
            } else if (fechaInicioObj <= ahora && fechaFinObj > ahora) {
                estadoCalculado = 'en_curso';
            } else if (fechaFinObj <= ahora) {
                estadoCalculado = 'vencido';
            }
        }

        const estadosManuales = ['cancelado', 'completado', 'pospuesto'];
        let estadoFinal;

        if (estado && estadosManuales.includes(estado)) {
            estadoFinal = estado;
        } else if (estadoCalculado) {
            estadoFinal = estadoCalculado;
        } else {
            estadoFinal = eventoExistente.estado;
        }

        await EventoModel.actualizar(id, usuarioId, {
            titulo: titulo !== undefined ? titulo : eventoExistente.titulo,
            descripcion: descripcion !== undefined ? descripcion : eventoExistente.descripcion,
            fecha_inicio: fechaInicioFinal,
            fecha_fin: fechaFinFinal,
            ubicacion: ubicacion !== undefined ? ubicacion : eventoExistente.ubicacion,
            color_hex: color_hex !== undefined ? color_hex : eventoExistente.color_hex,
            estado: estadoFinal,
            recurrencia_id: recurrencia_id !== undefined ? recurrencia_id : eventoExistente.recurrencia_id
        });

        const eventoActualizado = await EventoModel.obtenerPorId(id, usuarioId);

        res.json({
            success: true,
            message: 'Evento actualizado exitosamente',
            data: eventoActualizado,
            meta: estadoCalculado ? {
                estado_recalculado: true,
                estado_anterior: eventoExistente.estado,
                estado_nuevo: estadoFinal
            } : null
        });

    } catch (error) {
        console.error('Error al actualizar evento:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar el evento',
            error: error.message
        });
    }
};

export const eliminarEvento = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const { id } = req.params;

        const evento = await EventoModel.obtenerPorId(id, usuarioId);
        if (!evento) {
            return res.status(404).json({
                success: false,
                message: 'Evento no encontrado'
            });
        }

        const eliminado = await EventoModel.eliminar(id, usuarioId);

        if (eliminado) {
            res.json({
                success: true,
                message: 'Evento eliminado exitosamente'
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'No se pudo eliminar el evento'
            });
        }

    } catch (error) {
        console.error('Error al eliminar evento:', error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar el evento',
            error: error.message
        });
    }
};

export const cambiarEstadoEvento = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const { id } = req.params;
        const { estado } = req.body;

        const estadosPermitidos = ['completado', 'cancelado', 'pospuesto'];

        if (!estado || !estadosPermitidos.includes(estado)) {
            return res.status(400).json({
                success: false,
                message: `Estado no válido. Use: ${estadosPermitidos.join(', ')}`
            });
        }

        const evento = await EventoModel.obtenerPorId(id, usuarioId);
        if (!evento) {
            return res.status(404).json({
                success: false,
                message: 'Evento no encontrado'
            });
        }

        const actualizado = await EventoModel.cambiarEstado(id, usuarioId, estado);

        if (actualizado) {
            const eventoActualizado = await EventoModel.obtenerPorId(id, usuarioId);
            res.json({
                success: true,
                message: `Estado cambiado a ${estado}`,
                data: eventoActualizado
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
            message: 'Error al cambiar el estado del evento',
            error: error.message
        });
    }
};

export const actualizarEstadosAutomaticos = async (req, res) => {
    try {
        const usuarioId = req.user.id;

        const resultado = await EventoModel.actualizarEstadosAutomaticos(usuarioId);
        const eventosActualizados = await EventoModel.listarPorUsuario(usuarioId);

        res.json({
            success: true,
            message: resultado.mensaje,
            data: {
                eventos_actualizados: resultado.actualizados,
                total_eventos: eventosActualizados.length,
                eventos: eventosActualizados
            }
        });

    } catch (error) {
        console.error('Error al actualizar estados automáticos:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar los estados de los eventos',
            error: error.message
        });
    }
};

export const actualizarEstadosGlobales = async (req, res) => {
    try {
        const resultado = await EventoModel.actualizarEstadosAutomaticos(null);

        res.json({
            success: true,
            message: resultado.mensaje,
            data: {
                eventos_actualizados: resultado.actualizados,
                timestamp: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('Error al actualizar estados globales:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar los estados globales de los eventos',
            error: error.message
        });
    }
};
