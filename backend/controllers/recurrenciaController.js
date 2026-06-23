import RecurrenciaModel from '../models/RecurrenciaModel.js';

// Listar las recurrencias del usuario
export const listarRecurrencias = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const recurrencias = await RecurrenciaModel.listarPorUsuario(usuarioId);

        res.json({
            success: true,
            data: recurrencias,
            total: recurrencias.length
        });
    } catch (error) {
        console.error('Error al listar recurrencias:', error);
        res.status(500).json({
            success: false,
            mensaje: 'Error al listar las recurrencias',
            error: error.message
        });
    }
};

// Obtener una recurrencia por ID
export const obtenerRecurrencia = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const { id } = req.params;

        const recurrencia = await RecurrenciaModel.obtenerPorId(id, usuarioId);
        if (!recurrencia) {
            return res.status(404).json({
                success: false,
                mensaje: 'Recurrencia no encontrada'
            });
        }

        res.json({
            success: true,
            data: recurrencia
        });
    } catch (error) {
        console.error('Error al obtener recurrencia:', error);
        res.status(500).json({
            success: false,
            mensaje: 'Error al obtener la recurrencia',
            error: error.message
        });
    }
};

// Crear una nueva recurrencia
export const crearRecurrencia = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const { intervalo, frecuencia_dias, fecha_inicio, fecha_fin, num_rec } = req.body;

        const nuevaRecurrencia = await RecurrenciaModel.crear(usuarioId, {
            intervalo,
            frecuencia_dias,
            fecha_inicio,
            fecha_fin,
            num_rec
        });

        res.status(201).json({
            success: true,
            mensaje: 'Recurrencia creada exitosamente',
            data: nuevaRecurrencia
        });
    } catch (error) {
        console.error('Error al crear recurrencia:', error);
        res.status(400).json({
            success: false,
            mensaje: 'Error al crear la recurrencia',
            error: error.message
        });
    }
};

// Eliminar una recurrencia
export const eliminarRecurrencia = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const { id } = req.params;

        const eliminado = await RecurrenciaModel.eliminar(id, usuarioId);
        if (!eliminado) {
            return res.status(404).json({
                success: false,
                mensaje: 'Recurrencia no encontrada'
            });
        }

        res.json({
            success: true,
            mensaje: 'Recurrencia eliminada exitosamente'
        });
    } catch (error) {
        console.error('Error al eliminar recurrencia:', error);
        res.status(500).json({
            success: false,
            mensaje: 'Error al eliminar la recurrencia',
            error: error.message
        });
    }
};
