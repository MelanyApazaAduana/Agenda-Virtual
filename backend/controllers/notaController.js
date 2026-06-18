import NotaModel from '../models/NotaModel.js';

export const crearNota = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const { titulo, contenido, color_fondo, evento_id } = req.body;

        if (!titulo || titulo.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'El título de la nota es obligatorio'
            });
        }

        const nota = await NotaModel.crear(usuarioId, {
            titulo: titulo.trim(),
            contenido: contenido || null,
            color_fondo: color_fondo || null,
            evento_id: evento_id || null
        });

        res.status(201).json({
            success: true,
            message: 'Nota creada exitosamente',
            data: nota
        });
    } catch (error) {
        console.error('Error al crear nota:', error);
        res.status(500).json({
            success: false,
            message: 'Error al crear la nota',
            error: error.message
        });
    }
};

export const listarNotas = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const { estado, busqueda, fecha_desde, fecha_hasta, limite } = req.query;

        const filtros = {};
        if (estado) filtros.estado = estado;
        if (busqueda) filtros.busqueda = busqueda;
        if (fecha_desde) filtros.fecha_desde = fecha_desde;
        if (fecha_hasta) filtros.fecha_hasta = fecha_hasta;
        if (limite) filtros.limite = parseInt(limite);

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
            message: 'Error al obtener las notas',
            error: error.message
        });
    }
};

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

export const actualizarNota = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const { id } = req.params;
        const { titulo, contenido, color_fondo, evento_id } = req.body;

        const notaExistente = await NotaModel.obtenerPorId(id, usuarioId);
        if (!notaExistente) {
            return res.status(404).json({
                success: false,
                message: 'Nota no encontrada'
            });
        }

        if (titulo !== undefined && titulo.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'El título no puede estar vacío'
            });
        }

        const nota = await NotaModel.actualizar(id, usuarioId, {
            titulo: titulo !== undefined ? titulo.trim() : undefined,
            contenido,
            color_fondo,
            evento_id
        });

        res.json({
            success: true,
            message: 'Nota actualizada exitosamente',
            data: nota
        });
    } catch (error) {
        console.error('Error al actualizar nota:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar la nota',
            error: error.message
        });
    }
};

export const eliminarNota = async (req, res) => {
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

        const eliminado = await NotaModel.eliminar(id, usuarioId);

        if (eliminado) {
            res.json({
                success: true,
                message: 'Nota eliminada exitosamente'
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'No se pudo eliminar la nota'
            });
        }
    } catch (error) {
        console.error('Error al eliminar nota:', error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar la nota',
            error: error.message
        });
    }
};

export const cambiarEstadoNota = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const { id } = req.params;
        const { estado } = req.body;

        const estadosPermitidos = ['borrador', 'guardado', 'archivado'];

        if (!estado || !estadosPermitidos.includes(estado)) {
            return res.status(400).json({
                success: false,
                message: `Estado no válido. Use: ${estadosPermitidos.join(', ')}`
            });
        }

        const nota = await NotaModel.obtenerPorId(id, usuarioId);
        if (!nota) {
            return res.status(404).json({
                success: false,
                message: 'Nota no encontrada'
            });
        }

        const actualizada = await NotaModel.cambiarEstado(id, usuarioId, estado);

        res.json({
            success: true,
            message: `Estado cambiado a ${estado}`,
            data: actualizada
        });
    } catch (error) {
        console.error('Error al cambiar estado:', error);
        res.status(500).json({
            success: false,
            message: 'Error al cambiar el estado de la nota',
            error: error.message
        });
    }
};
