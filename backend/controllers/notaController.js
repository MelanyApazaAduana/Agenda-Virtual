import NotaModel from '../models/NotaModel.js';

// Listar todas las notas del usuario
export const listarNotas = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const { 
            estado, 
            evento_id, 
            busqueda, 
            fecha_desde, 
            fecha_hasta, 
            tiene_audio, 
            tiene_imagen,
            orden,
            direccion,
            limite
        } = req.query;

        const filtros = {
            estado: estado || null,
            evento_id: evento_id ? parseInt(evento_id) : null,
            busqueda: busqueda || null,
            fecha_desde: fecha_desde || null,
            fecha_hasta: fecha_hasta || null,
            tiene_audio: tiene_audio !== undefined ? (tiene_audio === 'true') : undefined,
            tiene_imagen: tiene_imagen !== undefined ? (tiene_imagen === 'true') : undefined,
            orden: orden || 'fecha_modificacion',
            direccion: direccion || 'DESC',
            limite: limite ? parseInt(limite) : null
        };

        const notas = await NotaModel.listarPorUsuario(usuarioId, filtros);

        res.json({
            success: true,
            data: notas,
            total: notas.length
        });
    } catch (error) {
        console.error('Error al listar notas:', error);
        res.status(500).json({
            success: false,
            mensaje: 'Error al listar las notas',
            error: error.message
        });
    }
};

// Obtener una nota por ID
export const obtenerNota = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const { id } = req.params;

        const nota = await NotaModel.obtenerPorId(id, usuarioId);
        if (!nota) {
            return res.status(404).json({
                success: false,
                mensaje: 'Nota no encontrada'
            });
        }

        res.json({
            success: true,
            data: nota
        });
    } catch (error) {
        console.error('Error al obtener nota:', error);
        res.status(500).json({
            success: false,
            mensaje: 'Error al obtener la nota',
            error: error.message
        });
    }
};

export const crearNota = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const { titulo, contenido, audio_url, imagen_url, estado, color_fondo, evento_id } = req.body;

        if (!titulo || titulo.trim() === '') {
            return res.status(400).json({
                success: false,
                mensaje: 'El título es obligatorio'
            });
        }

        const nuevaNota = await NotaModel.crear(usuarioId, {
            titulo,
            contenido,
            audio_url,
            imagen_url,
            estado,
            color_fondo,
            evento_id
        });

        res.status(201).json({
            success: true,
            mensaje: 'Nota creada exitosamente',
            data: nuevaNota
        });
    } catch (error) {
        console.error('Error al crear nota:', error);
        res.status(400).json({
            success: false,
            mensaje: 'Error al crear la nota',
            error: error.message
        });
    }
};


export const actualizarNota = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const { id } = req.params;
        const { titulo, contenido, audio_url, imagen_url, estado, color_fondo, evento_id } = req.body;

        // Validación de entrada: si viene título, no puede estar vacío
        if (titulo !== undefined && titulo.trim() === '') {
            return res.status(400).json({
                success: false,
                mensaje: 'El título no puede estar vacío'
            });
        }

        const notaActualizada = await NotaModel.actualizar(id, usuarioId, {
            titulo,
            contenido,
            audio_url,
            imagen_url,
            estado,
            color_fondo,
            evento_id
        });

        res.json({
            success: true,
            mensaje: 'Nota actualizada exitosamente',
            data: notaActualizada
        });
    } catch (error) {
        console.error('Error al actualizar nota:', error);
        res.status(400).json({
            success: false,
            mensaje: 'Error al actualizar la nota',
            error: error.message
        });
    }
};

// Autoguardar nota
export const autoguardarNota = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const { id, titulo, contenido, audio_url, imagen_url, color_fondo, evento_id } = req.body;

        let notaActualizada;

        
        if (id) {
            // Verificar que la nota existe
            const notaExistente = await NotaModel.obtenerPorId(id, usuarioId);
            if (!notaExistente) {
                return res.status(404).json({
                    success: false,
                    mensaje: 'Nota no encontrada'
                });
            }

            notaActualizada = await NotaModel.actualizarAutoguardado(id, usuarioId, {
                titulo,
                contenido,
                audio_url,
                imagen_url,
                color_fondo,
                evento_id
            });
        } else {
            // Si no tiene ID, crear nueva nota como borrador
            notaActualizada = await NotaModel.autoguardar(usuarioId, {
                titulo,
                contenido,
                audio_url,
                imagen_url,
                color_fondo,
                evento_id
            });
        }

        res.json({
            success: true,
            mensaje: 'Nota autoguardada como borrador',
            data: notaActualizada
        });
    } catch (error) {
        console.error('Error al autoguardar nota:', error);
        res.status(400).json({
            success: false,
            mensaje: 'Error al autoguardar la nota',
            error: error.message
        });
    }
};

// Guardar nota definitivamente
export const guardarNota = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const { id } = req.params;
        const { titulo, contenido, audio_url, imagen_url, color_fondo, evento_id } = req.body;

        // Verificar que la nota existe
        const notaExistente = await NotaModel.obtenerPorId(id, usuarioId);
        if (!notaExistente) {
            return res.status(404).json({
                success: false,
                mensaje: 'Nota no encontrada'
            });
        }

        // Validación: si viene título, no puede estar vacío
        if (titulo !== undefined && titulo.trim() === '') {
            return res.status(400).json({
                success: false,
                mensaje: 'El título no puede estar vacío'
            });
        }

        const notaGuardada = await NotaModel.guardarNota(id, usuarioId, {
            titulo,
            contenido,
            audio_url,
            imagen_url,
            color_fondo,
            evento_id
        });

        res.json({
            success: true,
            mensaje: 'Nota guardada exitosamente',
            data: notaGuardada
        });
    } catch (error) {
        console.error('Error al guardar nota:', error);
        res.status(400).json({
            success: false,
            mensaje: 'Error al guardar la nota',
            error: error.message
        });
    }
};

// Cambiar estado de una nota
export const cambiarEstadoNota = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const { id } = req.params;
        const { estado } = req.body;

        // Validación de entrada
        if (!estado) {
            return res.status(400).json({
                success: false,
                mensaje: 'El estado es requerido'
            });
        }

        const estadosValidos = ['borrador', 'guardado', 'archivado'];
        if (!estadosValidos.includes(estado)) {
            return res.status(400).json({
                success: false,
                mensaje: 'Estado no válido. Debe ser: borrador, guardado o archivado'
            });
        }

        const notaActualizada = await NotaModel.cambiarEstado(id, usuarioId, estado);

        res.json({
            success: true,
            mensaje: `Estado cambiado a '${estado}'`,
            data: notaActualizada
        });
    } catch (error) {
        console.error('Error al cambiar estado:', error);
        res.status(400).json({
            success: false,
            mensaje: 'Error al cambiar el estado de la nota',
            error: error.message
        });
    }
};

// Archivar una nota
export const archivarNota = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const { id } = req.params;

        const notaArchivada = await NotaModel.archivar(id, usuarioId);

        res.json({
            success: true,
            mensaje: 'Nota archivada exitosamente',
            data: notaArchivada
        });
    } catch (error) {
        console.error('Error al archivar nota:', error);
        res.status(400).json({
            success: false,
            mensaje: 'Error al archivar la nota',
            error: error.message
        });
    }
};

// Restaurar nota archivada
export const restaurarNota = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const { id } = req.params;

        const notaRestaurada = await NotaModel.restaurar(id, usuarioId);

        res.json({
            success: true,
            mensaje: 'Nota restaurada exitosamente',
            data: notaRestaurada
        });
    } catch (error) {
        console.error('Error al restaurar nota:', error);
        res.status(400).json({
            success: false,
            mensaje: 'Error al restaurar la nota',
            error: error.message
        });
    }
};

// Eliminar una nota
export const eliminarNota = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const { id } = req.params;

        const eliminado = await NotaModel.eliminar(id, usuarioId);
        if (!eliminado) {
            return res.status(404).json({
                success: false,
                mensaje: 'Nota no encontrada'
            });
        }

        res.json({
            success: true,
            mensaje: 'Nota eliminada exitosamente'
        });
    } catch (error) {
        console.error('Error al eliminar nota:', error);
        res.status(500).json({
            success: false,
            mensaje: 'Error al eliminar la nota',
            error: error.message
        });
    }
};

// Obtener notas archivadas
export const listarNotasArchivadas = async (req, res) => {
    try {
        const usuarioId = req.user.id;

        const notas = await NotaModel.listarArchivadas(usuarioId);

        res.json({
            success: true,
            data: notas,
            total: notas.length
        });
    } catch (error) {
        console.error('Error al listar notas archivadas:', error);
        res.status(500).json({
            success: false,
            mensaje: 'Error al listar las notas archivadas',
            error: error.message
        });
    }
};

// Obtener notas por evento
export const listarNotasPorEvento = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const { eventoId } = req.params;

        if (!eventoId) {
            return res.status(400).json({
                success: false,
                mensaje: 'El ID del evento es requerido'
            });
        }

        const notas = await NotaModel.listarPorEvento(usuarioId, eventoId);

        res.json({
            success: true,
            data: notas,
            total: notas.length
        });
    } catch (error) {
        console.error('Error al listar notas por evento:', error);
        res.status(500).json({
            success: false,
            mensaje: 'Error al listar las notas del evento',
            error: error.message
        });
    }
};

// Buscar notas por texto
export const buscarNotas = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const { texto } = req.query;

        if (!texto || texto.trim() === '') {
            return res.status(400).json({
                success: false,
                mensaje: 'El texto de búsqueda es requerido'
            });
        }

        const notas = await NotaModel.buscar(usuarioId, texto);

        res.json({
            success: true,
            data: notas,
            total: notas.length,
            busqueda: texto
        });
    } catch (error) {
        console.error('Error al buscar notas:', error);
        res.status(500).json({
            success: false,
            mensaje: 'Error al buscar notas',
            error: error.message
        });
    }
};

// Obtener notas recientes
export const obtenerNotasRecientes = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const { limite } = req.query;
        const limiteFinal = limite ? parseInt(limite) : 10;

        const notas = await NotaModel.obtenerRecientes(usuarioId, limiteFinal);

        res.json({
            success: true,
            data: notas,
            total: notas.length,
            limite: limiteFinal
        });
    } catch (error) {
        console.error('Error al obtener notas recientes:', error);
        res.status(500).json({
            success: false,
            mensaje: 'Error al obtener las notas recientes',
            error: error.message
        });
    }
};

// Obtener resumen de notas
export const obtenerResumenNotas = async (req, res) => {
    try {
        const usuarioId = req.user.id;

        const resumen = await NotaModel.obtenerResumen(usuarioId);
        const porEstado = await NotaModel.contarPorEstado(usuarioId);

        res.json({
            success: true,
            data: {
                resumen,
                por_estado: porEstado
            }
        });
    } catch (error) {
        console.error('Error al obtener resumen de notas:', error);
        res.status(500).json({
            success: false,
            mensaje: 'Error al obtener el resumen de notas',
            error: error.message
        });
    }
};