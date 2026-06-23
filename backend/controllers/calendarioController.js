import EventoModel from '../models/EventoModel.js';
import TareaModel from '../models/TareaModel.js';
import NotaModel from '../models/NotaModel.js';

export const listarCalendario = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const { fecha_inicio, fecha_fin } = req.query;

        if (!fecha_inicio || !fecha_fin) {
            return res.status(400).json({
                success: false,
                message: 'Se requieren fecha_inicio y fecha_fin'
            });
        }

        const [eventos, tareas, notas] = await Promise.all([
            EventoModel.listarPorUsuario(usuarioId, { fecha_inicio, fecha_fin }),
            TareaModel.listarPorUsuario(usuarioId, { fecha_limite_desde: fecha_inicio, fecha_limite_hasta: fecha_fin }),
            NotaModel.listarPorUsuario(usuarioId, { fecha_desde: fecha_inicio, fecha_hasta: fecha_fin })
        ]);

        res.json({
            success: true,
            data: { eventos, tareas, notas },
            meta: {
                fecha_inicio,
                fecha_fin,
                total: { eventos: eventos.length, tareas: tareas.length, notas: notas.length }
            }
        });
    } catch (error) {
        console.error('Error al listar calendario:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener datos del calendario',
            error: error.message
        });
    }
};
