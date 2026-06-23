import promisePool from '../config/database.js';

// Presupuesto ÚNICO por usuario. Se mantiene una sola fila por usuario
// (la más reciente). Si no existe, se crea con monto_total = 0.
class PresupuestoModel {
    // Obtener el presupuesto del usuario (el más reciente), o null
    static async obtenerDeUsuario(usuarioId) {
        const sql = `
            SELECT * FROM presupuestos
            WHERE usuario_id = ?
            ORDER BY creado_en DESC, id DESC
            LIMIT 1
        `;
        const [rows] = await promisePool.execute(sql, [usuarioId]);
        return rows[0] || null;
    }

    // Garantiza que el usuario tenga un presupuesto: si no hay, crea uno en 0
    static async asegurar(usuarioId) {
        const existente = await this.obtenerDeUsuario(usuarioId);
        if (existente) return existente;

        const sql = 'INSERT INTO presupuestos (usuario_id, monto_total) VALUES (?, 0)';
        const [result] = await promisePool.execute(sql, [usuarioId]);
        return await this.obtenerPorId(result.insertId, usuarioId);
    }

    // Actualiza (o crea) el presupuesto del usuario
    static async establecer(usuarioId, { monto_total, limite_personalizado }) {
        const monto = parseFloat(monto_total);
        if (monto == null || isNaN(monto) || monto < 0) {
            throw new Error('El monto total debe ser un número válido (>= 0)');
        }
        const limite = limite_personalizado != null && limite_personalizado !== ''
            ? parseFloat(limite_personalizado) : null;

        const actual = await this.obtenerDeUsuario(usuarioId);
        if (actual) {
            await promisePool.execute(
                'UPDATE presupuestos SET monto_total = ?, limite_personalizado = ? WHERE id = ? AND usuario_id = ?',
                [monto, limite, actual.id, usuarioId]
            );
            return await this.obtenerPorId(actual.id, usuarioId);
        }
        const [result] = await promisePool.execute(
            'INSERT INTO presupuestos (usuario_id, monto_total, limite_personalizado) VALUES (?, ?, ?)',
            [usuarioId, monto, limite]
        );
        return await this.obtenerPorId(result.insertId, usuarioId);
    }

    static async obtenerPorId(id, usuarioId) {
        const sql = 'SELECT * FROM presupuestos WHERE id = ? AND usuario_id = ?';
        const [rows] = await promisePool.execute(sql, [id, usuarioId]);
        return rows[0] || null;
    }
}

export default PresupuestoModel;
