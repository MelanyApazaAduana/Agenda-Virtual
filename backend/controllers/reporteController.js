import promisePool from '../config/database.js';

export const obtenerMovimientos = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const { fecha_desde, fecha_hasta } = req.query;

        if (!fecha_desde || !fecha_hasta) {
            return res.status(400).json({
                success: false,
                mensaje: 'Se requieren fecha_desde y fecha_hasta'
            });
        }

        const sql = `
            SELECT
                fecha,
                'ingreso' AS tipo,
                COALESCE(NULLIF(fuente, ''), NULLIF(detalle, ''), 'Ingreso') AS descripcion,
                monto AS monto_ingreso,
                0 AS monto_salida
            FROM ingresos
            WHERE usuario_id = ? AND fecha BETWEEN ? AND ?
            UNION ALL
            SELECT
                DATE(g.fecha) AS fecha,
                'salida' AS tipo,
                COALESCE(NULLIF(t.titulo, ''), NULLIF(g.metodo_pago, ''), 'Gasto') AS descripcion,
                0 AS monto_ingreso,
                g.monto AS monto_salida
            FROM gastos g
            LEFT JOIN tareas t ON g.tarea_id = t.id
            WHERE g.usuario_id = ? AND DATE(g.fecha) BETWEEN ? AND ?
            ORDER BY fecha ASC
        `;

        const [rows] = await promisePool.execute(sql, [
            usuarioId, fecha_desde, fecha_hasta,
            usuarioId, fecha_desde, fecha_hasta
        ]);

        const totalIngresos = rows.reduce((s, r) => s + Number(r.monto_ingreso), 0);
        const totalSalidas = rows.reduce((s, r) => s + Number(r.monto_salida), 0);

        res.json({
            success: true,
            data: {
                movimientos: rows,
                total_ingresos: totalIngresos,
                total_salidas: totalSalidas,
                balance: totalIngresos - totalSalidas,
                fecha_desde,
                fecha_hasta
            }
        });
    } catch (error) {
        console.error('Error al obtener movimientos:', error);
        res.status(500).json({
            success: false,
            mensaje: 'Error al generar el reporte de movimientos',
            error: error.message
        });
    }
};
