import EventoModel from '../models/EventoModel.js';
import TareaModel from '../models/TareaModel.js';
import NotaModel from '../models/NotaModel.js';
import { generarOcurrencias } from '../utils/recurrencia.js';

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

        const [eventos, tareas, notas, eventosRec, tareasRec] = await Promise.all([
            EventoModel.listarPorUsuario(usuarioId, { fecha_inicio, fecha_fin }),
            TareaModel.listarPorUsuario(usuarioId, { fecha_limite_desde: fecha_inicio, fecha_limite_hasta: fecha_fin }),
            NotaModel.listarPorUsuario(usuarioId, { fecha_desde: fecha_inicio, fecha_hasta: fecha_fin }),
            EventoModel.listarConRecurrencia(usuarioId),
            TareaModel.listarConRecurrencia(usuarioId)
        ]);

        // Genera las ocurrencias virtuales (repeticiones) dentro del rango pedido.
        const eventosExpandidos = [...eventos];
        for (const ev of eventosRec) {
            const ocurrencias = generarOcurrencias(ev.fecha_inicio, ev.fecha_fin, ev, fecha_inicio, fecha_fin);
            for (const o of ocurrencias) {
                eventosExpandidos.push({ ...ev, fecha_inicio: o.fecha_inicio, fecha_fin: o.fecha_fin, es_ocurrencia: true });
            }
        }

        const tareasExpandidas = [...tareas];
        for (const ta of tareasRec) {
            if (!ta.fecha_limite) continue;
            const ocurrencias = generarOcurrencias(ta.fecha_limite, null, ta, fecha_inicio, fecha_fin);
            for (const o of ocurrencias) {
                tareasExpandidas.push({ ...ta, fecha_limite: o.fecha_inicio, es_ocurrencia: true });
            }
        }

        res.json({
            success: true,
            data: {
                eventos: eventosExpandidos,
                tareas: tareasExpandidas,
                notas
            },
            meta: {
                fecha_inicio,
                fecha_fin,
                total: {
                    eventos: eventosExpandidos.length,
                    tareas: tareasExpandidas.length,
                    notas: notas.length
                }
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
