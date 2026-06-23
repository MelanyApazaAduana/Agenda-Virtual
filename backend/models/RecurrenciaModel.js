import promisePool from '../config/database.js';

class RecurrenciaModel {
    // Crear una regla de recurrencia (luego se referencia desde un evento o tarea)
    static async crear(usuarioId, { intervalo, frecuencia_dias, fecha_inicio, fecha_fin, num_rec }) {
        const intervalosPermitidos = ['diario', 'semanal', 'mensual', 'anual'];
        if (!intervalosPermitidos.includes(intervalo)) {
            throw new Error(`Intervalo no válido. Use: ${intervalosPermitidos.join(', ')}`);
        }
        if (!fecha_inicio) {
            throw new Error('La fecha de inicio es obligatoria');
        }

        const sql = `
            INSERT INTO recurrencias (usuario_id, intervalo, frecuencia_dias, fecha_inicio, fecha_fin, num_rec)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const [result] = await promisePool.execute(sql, [
            usuarioId,
            intervalo,
            frecuencia_dias || null,
            fecha_inicio,
            fecha_fin || null,
            num_rec || null
        ]);

        return await this.obtenerPorId(result.insertId, usuarioId);
    }

    // Listar las recurrencias del usuario
    static async listarPorUsuario(usuarioId) {
        const sql = 'SELECT * FROM recurrencias WHERE usuario_id = ? ORDER BY creado_en DESC';
        const [rows] = await promisePool.execute(sql, [usuarioId]);
        return rows;
    }

    // Obtener una recurrencia por ID
    static async obtenerPorId(id, usuarioId) {
        const sql = 'SELECT * FROM recurrencias WHERE id = ? AND usuario_id = ?';
        const [rows] = await promisePool.execute(sql, [id, usuarioId]);
        return rows[0] || null;
    }

    // Eliminar una recurrencia (los eventos/tareas quedan con recurrencia_id = NULL)
    static async eliminar(id, usuarioId) {
        const sql = 'DELETE FROM recurrencias WHERE id = ? AND usuario_id = ?';
        const [result] = await promisePool.execute(sql, [id, usuarioId]);
        return result.affectedRows > 0;
    }
}

export default RecurrenciaModel;
