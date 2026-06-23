import promisePool from '../config/database.js';

class PresupuestoModel {
    // Crear un nuevo presupuesto (registro histórico)
    static async crear(usuarioId, { monto_total, limite_personalizado }) {
        const montoFinal = parseFloat(monto_total);
        if (!montoFinal || montoFinal <= 0) {
            throw new Error('El monto total debe ser mayor a 0');
        }

        const sql = `
            INSERT INTO presupuestos (usuario_id, monto_total, limite_personalizado)
            VALUES (?, ?, ?)
        `;
        const [result] = await promisePool.execute(sql, [
            usuarioId,
            montoFinal,
            limite_personalizado != null ? parseFloat(limite_personalizado) : null
        ]);

        return await this.obtenerPorId(result.insertId, usuarioId);
    }

    // Listar el historial de presupuestos del usuario (más reciente primero)
    static async listarPorUsuario(usuarioId) {
        const sql = `
            SELECT * FROM presupuestos
            WHERE usuario_id = ?
            ORDER BY creado_en DESC
        `;
        const [rows] = await promisePool.execute(sql, [usuarioId]);
        return rows;
    }

    // Obtener un presupuesto por ID
    static async obtenerPorId(id, usuarioId) {
        const sql = 'SELECT * FROM presupuestos WHERE id = ? AND usuario_id = ?';
        const [rows] = await promisePool.execute(sql, [id, usuarioId]);
        return rows[0] || null;
    }

    // Obtener el presupuesto vigente: el último creado antes (o en) la fecha dada
    static async obtenerVigente(usuarioId, fecha = null) {
        const fechaCorte = fecha || new Date();
        const sql = `
            SELECT * FROM presupuestos
            WHERE usuario_id = ? AND creado_en <= ?
            ORDER BY creado_en DESC
            LIMIT 1
        `;
        const [rows] = await promisePool.execute(sql, [usuarioId, fechaCorte]);
        return rows[0] || null;
    }

    // Eliminar un presupuesto
    static async eliminar(id, usuarioId) {
        const sql = 'DELETE FROM presupuestos WHERE id = ? AND usuario_id = ?';
        const [result] = await promisePool.execute(sql, [id, usuarioId]);
        return result.affectedRows > 0;
    }
}

export default PresupuestoModel;
