import promisePool from '../config/database.js';

class EtiquetaModel {
    // Listar todas las etiquetas de un usuario
    static async listarPorUsuario(usuarioId) {
        const sql = `
            SELECT id, usuario_id, nombre, color_hex, creado_en
            FROM etiquetas
            WHERE usuario_id = ?
            ORDER BY nombre
        `;
        const [rows] = await promisePool.execute(sql, [usuarioId]);
        return rows;
    }

    // Obtener una etiqueta por ID
    static async obtenerPorId(id, usuarioId) {
        const sql = `
            SELECT id, usuario_id, nombre, color_hex, creado_en
            FROM etiquetas
            WHERE id = ? AND usuario_id = ?
        `;
        const [rows] = await promisePool.execute(sql, [id, usuarioId]);
        return rows[0] || null;
    }

    // Crear nueva etiqueta
    static async crear(usuarioId, { nombre, color_hex }) {
        const sql = `
            INSERT INTO etiquetas (usuario_id, nombre, color_hex)
            VALUES (?, ?, ?)
        `;
        const [result] = await promisePool.execute(sql, [
            usuarioId,
            nombre,
            color_hex || '#3788d8'
        ]);

        return await this.obtenerPorId(result.insertId, usuarioId);
    }

    // Eliminar etiqueta (sus vínculos se borran en cascada por la FK)
    static async eliminar(id, usuarioId) {
        const sql = 'DELETE FROM etiquetas WHERE id = ? AND usuario_id = ?';
        const [result] = await promisePool.execute(sql, [id, usuarioId]);
        return result.affectedRows > 0;
    }

    // Verificar si ya existe una etiqueta con el mismo nombre para el usuario
    static async existeNombre(usuarioId, nombre, excludeId = null) {
        let sql = 'SELECT id FROM etiquetas WHERE usuario_id = ? AND nombre = ?';
        const params = [usuarioId, nombre];

        if (excludeId) {
            sql += ' AND id != ?';
            params.push(excludeId);
        }

        const [rows] = await promisePool.execute(sql, params);
        return rows.length > 0;
    }

    // Etiquetas predeterminadas para un usuario nuevo
    static async obtenerPredeterminadas() {
        return [
            { nombre: 'Trabajo', color_hex: '#4F46E5' },
            { nombre: 'Personal', color_hex: '#10B981' },
            { nombre: 'Urgente', color_hex: '#EF4444' },
            { nombre: 'Estudio', color_hex: '#8B5CF6' },
            { nombre: 'Finanzas', color_hex: '#22C55E' }
        ];
    }

    // Crear etiquetas predeterminadas para un usuario nuevo
    static async crearPredeterminadas(usuarioId) {
        const predeterminadas = await this.obtenerPredeterminadas();
        const creadas = [];

        for (const etiqueta of predeterminadas) {
            const nueva = await this.crear(usuarioId, etiqueta);
            creadas.push(nueva);
        }

        return creadas;
    }
}

export default EtiquetaModel;
