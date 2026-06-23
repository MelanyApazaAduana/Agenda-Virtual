import promisePool from '../config/database.js';

// Tipos de entidad que pueden etiquetarse (pivote polimórfico)
export const TIPOS_ENTIDAD = ['evento', 'tarea', 'ingreso', 'gasto'];

class EntidadEtiquetaModel {
    // Vincular una etiqueta a una entidad (idempotente por la UNIQUE KEY)
    static async vincular(etiquetaId, entidadTipo, entidadId) {
        const sql = `
            INSERT INTO entidad_etiquetas (etiqueta_id, entidad_tipo, entidad_id)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE id = id
        `;
        const [result] = await promisePool.execute(sql, [etiquetaId, entidadTipo, entidadId]);
        return result;
    }

    // Quitar el vínculo entre una etiqueta y una entidad
    static async desvincular(etiquetaId, entidadTipo, entidadId) {
        const sql = `
            DELETE FROM entidad_etiquetas
            WHERE etiqueta_id = ? AND entidad_tipo = ? AND entidad_id = ?
        `;
        const [result] = await promisePool.execute(sql, [etiquetaId, entidadTipo, entidadId]);
        return result.affectedRows > 0;
    }

    // Listar las etiquetas (del usuario) asociadas a una entidad concreta
    static async listarEtiquetasDeEntidad(usuarioId, entidadTipo, entidadId) {
        const sql = `
            SELECT e.id, e.nombre, e.color_hex
            FROM entidad_etiquetas ee
            INNER JOIN etiquetas e ON ee.etiqueta_id = e.id
            WHERE ee.entidad_tipo = ? AND ee.entidad_id = ? AND e.usuario_id = ?
            ORDER BY e.nombre
        `;
        const [rows] = await promisePool.execute(sql, [entidadTipo, entidadId, usuarioId]);
        return rows;
    }

    // Listar las entidades (tipo + id) vinculadas a una etiqueta del usuario
    static async listarEntidadesPorEtiqueta(usuarioId, etiquetaId) {
        const sql = `
            SELECT ee.entidad_tipo, ee.entidad_id, ee.creado_en
            FROM entidad_etiquetas ee
            INNER JOIN etiquetas e ON ee.etiqueta_id = e.id
            WHERE ee.etiqueta_id = ? AND e.usuario_id = ?
            ORDER BY ee.entidad_tipo, ee.entidad_id
        `;
        const [rows] = await promisePool.execute(sql, [etiquetaId, usuarioId]);
        return rows;
    }
}

export default EntidadEtiquetaModel;
