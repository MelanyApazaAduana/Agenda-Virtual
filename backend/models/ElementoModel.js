import promisePool from '../config/database.js';

class ElementoModel {
    // Crear un nuevo elemento (base para evento o tarea)
    static async crear({ usuario_id, categoria_id, titulo }) {
        const sql = `
            INSERT INTO elementos (usuario_id, categoria_id, titulo) 
            VALUES (?, ?, ?)
        `;
        const [result] = await promisePool.execute(sql, [
            usuario_id,
            categoria_id || null,
            titulo
        ]);
        
        return {
            id: result.insertId,
            usuario_id,
            categoria_id: categoria_id || null,
            titulo,
            creado_en: new Date(),
            actualizado_en: new Date()
        };
    }

    // Obtener un elemento por ID
    static async obtenerPorId(id, usuarioId) {
        const sql = 'SELECT * FROM elementos WHERE id = ? AND usuario_id = ?';
        const [rows] = await promisePool.execute(sql, [id, usuarioId]);
        return rows[0] || null;
    }

    // Actualizar un elemento
    static async actualizar(id, usuarioId, { categoria_id, titulo }) {
        const sql = `
            UPDATE elementos 
            SET categoria_id = ?, titulo = ?, actualizado_en = NOW()
            WHERE id = ? AND usuario_id = ?
        `;
        const [result] = await promisePool.execute(sql, [
            categoria_id || null,
            titulo,
            id,
            usuarioId
        ]);
        return result.affectedRows > 0;
    }

    // Eliminar un elemento cascada 
    static async eliminar(id, usuarioId) {
        const sql = 'DELETE FROM elementos WHERE id = ? AND usuario_id = ?';
        const [result] = await promisePool.execute(sql, [id, usuarioId]);
        return result.affectedRows > 0; 
    }

    // Verificar si el elemento pertenece al usuario
    static async perteneceAUsuario(id, usuarioId) {
        const elemento = await this.obtenerPorId(id, usuarioId);
        return elemento !== null;
    }
}

export default ElementoModel;