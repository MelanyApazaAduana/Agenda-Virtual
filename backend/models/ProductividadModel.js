import promisePool from '../config/database.js';

// Convierte a número los agregados que MySQL puede devolver como string (BIGINT/DECIMAL)
const aNumero = (valor) => Number(valor) || 0;

class ProductividadModel {
    // Conteos de tareas por estado + vencidas (estado real según fecha límite)
    static async resumenTareas(usuarioId) {
        const sql = `
            SELECT
                COUNT(*) AS total,
                SUM(estado = 'por_hacer')   AS por_hacer,
                SUM(estado = 'en_progreso') AS en_progreso,
                SUM(estado = 'completada')  AS completadas,
                SUM(estado = 'cancelada')   AS canceladas,
                SUM(
                    estado NOT IN ('completada', 'cancelada')
                    AND fecha_limite IS NOT NULL
                    AND fecha_limite < NOW()
                ) AS vencidas
            FROM tareas
            WHERE usuario_id = ?
        `;
        const [rows] = await promisePool.execute(sql, [usuarioId]);
        const r = rows[0] || {};
        return {
            total: aNumero(r.total),
            por_hacer: aNumero(r.por_hacer),
            en_progreso: aNumero(r.en_progreso),
            completadas: aNumero(r.completadas),
            canceladas: aNumero(r.canceladas),
            vencidas: aNumero(r.vencidas)
        };
    }

    // Conteos de eventos por estado
    static async resumenEventos(usuarioId) {
        const sql = `
            SELECT
                COUNT(*) AS total,
                SUM(estado = 'pendiente')  AS pendientes,
                SUM(estado = 'en_curso')   AS en_curso,
                SUM(estado = 'completado') AS completados,
                SUM(estado = 'vencido')    AS vencidos,
                SUM(estado = 'cancelado')  AS cancelados,
                SUM(estado = 'pospuesto')  AS pospuestos
            FROM eventos
            WHERE usuario_id = ?
        `;
        const [rows] = await promisePool.execute(sql, [usuarioId]);
        const r = rows[0] || {};
        return {
            total: aNumero(r.total),
            pendientes: aNumero(r.pendientes),
            en_curso: aNumero(r.en_curso),
            completados: aNumero(r.completados),
            vencidos: aNumero(r.vencidos),
            cancelados: aNumero(r.cancelados),
            pospuestos: aNumero(r.pospuestos)
        };
    }

    // Distribución de tareas por prioridad
    static async tareasPorPrioridad(usuarioId) {
        const sql = `
            SELECT prioridad, COUNT(*) AS total
            FROM tareas
            WHERE usuario_id = ?
            GROUP BY prioridad
        `;
        const [rows] = await promisePool.execute(sql, [usuarioId]);
        const orden = ['urgente', 'alta', 'media', 'baja'];
        const mapa = Object.fromEntries(rows.map((f) => [f.prioridad, aNumero(f.total)]));
        return orden.map((prioridad) => ({ prioridad, total: mapa[prioridad] || 0 }));
    }

    // Tareas completadas por día en los últimos N días (incluye días sin completar = 0)
    static async completadasPorDia(usuarioId, dias = 7) {
        const sql = `
            SELECT DATE(fecha_completado) AS fecha, COUNT(*) AS total
            FROM tareas
            WHERE usuario_id = ?
                AND estado = 'completada'
                AND fecha_completado IS NOT NULL
                AND fecha_completado >= (CURDATE() - INTERVAL ? DAY)
            GROUP BY DATE(fecha_completado)
        `;
        const [rows] = await promisePool.execute(sql, [usuarioId, dias - 1]);
        const mapa = Object.fromEntries(rows.map((f) => [String(f.fecha).slice(0, 10), aNumero(f.total)]));

        // Construye la serie completa de los últimos `dias` días, rellenando con 0
        const serie = [];
        const hoy = new Date();
        for (let i = dias - 1; i >= 0; i--) {
            const d = new Date(hoy);
            d.setDate(hoy.getDate() - i);
            const clave = d.toISOString().slice(0, 10);
            serie.push({ fecha: clave, total: mapa[clave] || 0 });
        }
        return serie;
    }
}

export default ProductividadModel;
