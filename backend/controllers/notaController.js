import NotaModel from '../models/NotaModel.js';

// Color por defecto del fondo de la nota (ámbar)
const COLOR_NOTA_POR_DEFECTO = '#F59E0B';

// Listar todas las notas del usuario
export const listarNotas = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const {
            evento_id,
            tarea_id,
            busqueda,
            fecha_desde,
            fecha_hasta,
            tiene_audio,
            orden,
            direccion,
            limite
        } = req.query;

        const filtros = {
            evento_id: evento_id ? parseInt(evento_id) : null,
            tarea_id: tarea_id ? parseInt(tarea_id) : null,
            busqueda: busqueda || null,
            fecha_desde: fecha_desde || null,
            fecha_hasta: fecha_hasta || null,
            tiene_audio: tiene_audio !== undefined ? (tiene_audio === 'true') : undefined,
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
            message: 'Error al listar las notas',
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
                message: 'Nota no encontrada'
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
            message: 'Error al obtener la nota',
            error: error.message
        });
    }
};

// Crear una nota
export const crearNota = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const { titulo, contenido, audio_url, imagen_url, color_hex, evento_id, tarea_id } = req.body;

        if (!titulo || titulo.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'El título es obligatorio'
            });
        }

        const nuevaNota = await NotaModel.crear(usuarioId, {
            titulo,
            contenido,
            audio_url,
            imagen_url,
            color_hex: color_hex || COLOR_NOTA_POR_DEFECTO,
            evento_id,
            tarea_id
        });

        res.status(201).json({
            success: true,
            message: 'Nota creada exitosamente',
            data: nuevaNota
        });
    } catch (error) {
        console.error('Error al crear nota:', error);
        res.status(400).json({
            success: false,
            message: 'Error al crear la nota',
            error: error.message
        });
    }
};

// Actualizar una nota
export const actualizarNota = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const { id } = req.params;
        const { titulo, contenido, audio_url, imagen_url, color_hex, evento_id, tarea_id } = req.body;

        if (titulo !== undefined && titulo.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'El título no puede estar vacío'
            });
        }

        const notaActualizada = await NotaModel.actualizar(id, usuarioId, {
            titulo,
            contenido,
            audio_url,
            imagen_url,
            color_hex,
            evento_id,
            tarea_id
        });

        res.json({
            success: true,
            message: 'Nota actualizada exitosamente',
            data: notaActualizada
        });
    } catch (error) {
        console.error('Error al actualizar nota:', error);
        res.status(400).json({
            success: false,
            message: 'Error al actualizar la nota',
            error: error.message
        });
    }
};

// Autoguardar nota (crea o actualiza)
export const autoguardarNota = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const { id, titulo, contenido, audio_url, imagen_url, color_hex, evento_id, tarea_id } = req.body;

        const notaGuardada = await NotaModel.autoguardar(usuarioId, {
            id,
            titulo,
            contenido,
            audio_url,
            imagen_url,
            color_hex,
            evento_id,
            tarea_id
        });

        res.json({
            success: true,
            message: 'Nota autoguardada',
            data: notaGuardada
        });
    } catch (error) {
        console.error('Error al autoguardar nota:', error);
        res.status(400).json({
            success: false,
            message: 'Error al autoguardar la nota',
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
                message: 'Nota no encontrada'
            });
        }

        res.json({
            success: true,
            message: 'Nota eliminada exitosamente'
        });
    } catch (error) {
        console.error('Error al eliminar nota:', error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar la nota',
            error: error.message
        });
    }
};

// Obtener notas por evento
export const listarNotasPorEvento = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const { eventoId } = req.params;

        const notas = await NotaModel.listarPorEvento(usuarioId, parseInt(eventoId));

        res.json({
            success: true,
            data: notas,
            total: notas.length
        });
    } catch (error) {
        console.error('Error al listar notas por evento:', error);
        res.status(500).json({
            success: false,
            message: 'Error al listar las notas del evento',
            error: error.message
        });
    }
};

// Obtener notas por tarea
export const listarNotasPorTarea = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const { tareaId } = req.params;

        const notas = await NotaModel.listarPorTarea(usuarioId, parseInt(tareaId));

        res.json({
            success: true,
            data: notas,
            total: notas.length
        });
    } catch (error) {
        console.error('Error al listar notas por tarea:', error);
        res.status(500).json({
            success: false,
            message: 'Error al listar las notas de la tarea',
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
                message: 'El texto de búsqueda es requerido'
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
            message: 'Error al buscar notas',
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
            message: 'Error al obtener las notas recientes',
            error: error.message
        });
    }
};

// Obtener resumen de notas
export const obtenerResumenNotas = async (req, res) => {
    try {
        const usuarioId = req.user.id;

        const resumen = await NotaModel.obtenerResumen(usuarioId);

        res.json({
            success: true,
            data: { resumen }
        });
    } catch (error) {
        console.error('Error al obtener resumen de notas:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener el resumen de notas',
            error: error.message
        });
    }
};
