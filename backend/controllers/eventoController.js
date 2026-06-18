import ElementoModel from '../models/ElementoModel.js';
import EventoModel from '../models/EventoModel.js';

export const crearEvento = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const {
            titulo,
            categoria_id,
            descripcion,
            fecha_inicio,
            fecha_fin,
            ubicacion,
            color_etiqueta,
            instancia_id
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
        }
        else if (fechaInicioObj <= ahora && fechaFinObj > ahora) {
            estadoCalculado = 'en_curso';
        }
        else if (fechaFinObj <= ahora) {
            estadoCalculado = 'vencido';
        }
        
        let estadoFinal = estadoCalculado;
        if (req.body.estado && ['cancelado', 'completado', 'pospuesto'].includes(req.body.estado)) {
            estadoFinal = req.body.estado;
        }

        // crear elemento y evento 
        const elemento = await ElementoModel.crear({
            usuario_id: usuarioId,
            categoria_id: categoria_id || null,
            titulo: titulo.trim()
        });

        const evento = await EventoModel.crear({
            elemento_id: elemento.id,
            descripcion: descripcion || null,
            fecha_inicio,
            fecha_fin,
            ubicacion: ubicacion || null,
            color_etiqueta: color_etiqueta || null,
            estado: estadoFinal,
            instancia_id: instancia_id || null
        });

        // retorno 
        const eventoCompleto = await EventoModel.obtenerPorId(evento.id, usuarioId);

        res.status(201).json({
            success: true,
            message: 'Evento creado exitosamente',
            data: eventoCompleto,
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
        const { fecha_inicio, fecha_fin, estado, categoria_id } = req.query;
        
        const filtros = {};
        
        if (fecha_inicio) filtros.fecha_inicio = fecha_inicio;
        if (fecha_fin) filtros.fecha_fin = fecha_fin;
        if (estado) filtros.estado = estado;
        if (categoria_id) filtros.categoria_id = parseInt(categoria_id);
        
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
            categoria_id,
            descripcion,
            fecha_inicio,
            fecha_fin,
            ubicacion,
            color_etiqueta,
            estado,
            instancia_id
        } = req.body;
        
        // Verificar que el evento existe
        const eventoExistente = await EventoModel.obtenerPorId(id, usuarioId);
        if (!eventoExistente) {
            return res.status(404).json({
                success: false,
                message: 'Evento no encontrado'
            });
        }
        
        // Determinar fechas finales (si vienen nuevas o las existentes)
        const fechaInicioFinal = fecha_inicio || eventoExistente.fecha_inicio;
        const fechaFinFinal = fecha_fin || eventoExistente.fecha_fin;
        
        // Validar fechas si vienen ambas
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
            }
            else if (fechaInicioObj <= ahora && fechaFinObj > ahora) {
                estadoCalculado = 'en_curso';
            }
            else if (fechaFinObj <= ahora) {
                estadoCalculado = 'vencido';
            }
        }
        
        const estadosManuales = ['cancelado', 'completado', 'pospuesto'];
        let estadoFinal = estado;
        
        if (estado && estadosManuales.includes(estado)) {
            
            estadoFinal = estado;
        } else if (estadoCalculado) {
            
            estadoFinal = estadoCalculado;
        } else {
            
            estadoFinal = eventoExistente.estado;
        }
        
        // actualizacion de elemento 
        if (titulo || categoria_id !== undefined) {
            const tituloFinal = titulo || eventoExistente.titulo;
            const categoriaFinal = categoria_id !== undefined ? categoria_id : eventoExistente.categoria_id;
            
            await ElementoModel.actualizar(eventoExistente.elemento_id, usuarioId, {
                titulo: tituloFinal,
                categoria_id: categoriaFinal
            });
        }
        
        // actualizacion de evento
        await EventoModel.actualizar(id, usuarioId, {
            descripcion: descripcion !== undefined ? descripcion : eventoExistente.descripcion,
            fecha_inicio: fechaInicioFinal,
            fecha_fin: fechaFinFinal,
            ubicacion: ubicacion !== undefined ? ubicacion : eventoExistente.ubicacion,
            color_etiqueta: color_etiqueta !== undefined ? color_etiqueta : eventoExistente.color_etiqueta,
            estado: estadoFinal,
            instancia_id: instancia_id !== undefined ? instancia_id : eventoExistente.instancia_id
        });
        
        // Obtener el evento actualizado
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

// eliminar solo el evento 

// export const eliminarEvento = async (req, res) => {
//     try {
//         const usuarioId = req.user.id;
//         const { id } = req.params;
        
//         // Verificar que el evento existe
//         const evento = await EventoModel.obtenerPorId(id, usuarioId);
//         if (!evento) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Evento no encontrado'
//             });
//         }
        
//         const eliminado = await EventoModel.eliminar(id, usuarioId);
        
//         if (eliminado) {
//             res.json({
//                 success: true,
//                 message: 'Evento eliminado exitosamente'
//             });
//         } else {
//             res.status(400).json({
//                 success: false,
//                 message: 'No se pudo eliminar el evento'
//             });
//         }
        
//     } catch (error) {
//         console.error('Error al eliminar evento:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Error al eliminar el evento',
//             error: error.message
//         });
//     }
// };

// eliminar evento cadena 
export const eliminarEventoCompleto = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const { id } = req.params;
        
        // Verificar que el evento existe
        const evento = await EventoModel.obtenerPorId(id, usuarioId);
        if (!evento) {
            return res.status(404).json({
                success: false,
                message: 'Evento no encontrado'
            });
        }
        
        const eliminado = await EventoModel.eliminarCompleto(id, usuarioId);
        
        if (eliminado) {
            res.json({
                success: true,
                message: 'Evento completo eliminado exitosamente'
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'No se pudo eliminar el evento completo'
            });
        }
        
    } catch (error) {
        console.error('Error al eliminar evento completo:', error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar el evento completo',
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
        
        // Verificar que el evento existe
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
        
        // Llamar al modelo para actualizar solo los eventos del usuario actual
        const resultado = await EventoModel.actualizarEstadosAutomaticos(usuarioId);
        
        // Opcional: obtener los eventos actualizados para devolverlos
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
        
        // Llamar al modelo para actualizar TODOS los eventos de TODOS los usuarios
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
