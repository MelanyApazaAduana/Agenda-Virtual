import ProductividadModel from '../models/ProductividadModel.js';

// Resumen completo de productividad del usuario autenticado, calculado en vivo
// a partir de sus tareas y eventos reales.
export const obtenerResumenProductividad = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const dias = Number(req.query.dias) || 7;

        const [tareas, eventos, porPrioridad, completadasPorDia] = await Promise.all([
            ProductividadModel.resumenTareas(usuarioId),
            ProductividadModel.resumenEventos(usuarioId),
            ProductividadModel.tareasPorPrioridad(usuarioId),
            ProductividadModel.completadasPorDia(usuarioId, dias)
        ]);

        // Tareas activas (ni completadas ni canceladas) que aún no vencen
        const pendientes = tareas.total - tareas.completadas - tareas.canceladas - tareas.vencidas;

        // Tasa de completado sobre el total de tareas no canceladas
        const baseFinalizables = tareas.total - tareas.canceladas;
        const tasaCompletado = baseFinalizables > 0
            ? Math.round((tareas.completadas / baseFinalizables) * 100)
            : 0;

        res.json({
            success: true,
            data: {
                tareas: {
                    ...tareas,
                    pendientes: Math.max(pendientes, 0),
                    tasa_completado: tasaCompletado
                },
                eventos,
                por_prioridad: porPrioridad,
                completadas_por_dia: completadasPorDia
            }
        });
    } catch (error) {
        console.error('Error al obtener resumen de productividad:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener el resumen de productividad',
            error: error.message
        });
    }
};
