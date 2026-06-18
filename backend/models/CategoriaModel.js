import promisePool from '../config/database.js';

class CategoriaModel {
    // Obtener todas las categorías de un usuario
    static async listarPorUsuario(usuarioId) {
        const sql = `
            SELECT id, usuario_id, nombre, color_hex, icono, tipo_aplicable
            FROM categorias 
            WHERE usuario_id = ? 
            ORDER BY nombre
        `;  
        const [rows] = await promisePool.execute(sql, [usuarioId]);
        return rows;
    }

    // Obtener categorías por tipo aplicable
    static async listarPorTipo(usuarioId, tipo) {
        const sql = `
            SELECT id, usuario_id, nombre, color_hex, icono, tipo_aplicable, creado_en
            FROM categorias 
            WHERE usuario_id = ? AND (tipo_aplicable = ? OR tipo_aplicable = 'todos')
            ORDER BY nombre
        `;
        const [rows] = await promisePool.execute(sql, [usuarioId, tipo]);
        return rows;
    }

    // Obtener una categoría por ID
    static async obtenerPorId(id, usuarioId) {
        const sql = `
            SELECT id, usuario_id, nombre, color_hex, icono, tipo_aplicable, creado_en
            FROM categorias 
            WHERE id = ? AND usuario_id = ?
        `;
        const [rows] = await promisePool.execute(sql, [id, usuarioId]);
        return rows[0] || null;
    }

    // Crear nueva categoría
    static async crear(usuarioId, { nombre, color_hex, icono, tipo_aplicable }) {
        // Validar tipo_aplicable
        const tiposPermitidos = ['evento', 'tarea', 'gasto', 'ingreso', 'todos'];
        const tipoFinal = tiposPermitidos.includes(tipo_aplicable) ? tipo_aplicable : 'todos';
        
        const sql = `
            INSERT INTO categorias (usuario_id, nombre, color_hex, icono, tipo_aplicable) 
            VALUES (?, ?, ?, ?, ?)
        `;
        const [result] = await promisePool.execute(sql, [
            usuarioId, 
            nombre, 
            color_hex || '#3788d8', 
            icono || null, 
            tipoFinal
        ]);
        
        return {
            id: result.insertId,
            usuario_id: usuarioId,
            nombre,
            color_hex: color_hex || '#3788d8',
            icono: icono || null,
            tipo_aplicable: tipoFinal,
            creado_en: new Date()
        };
    }

    // Actualizar categoría
    // static async actualizar(id, usuarioId, { nombre, color_hex, icono, tipo_aplicable }) {
    //     const sql = `
    //         UPDATE categorias 
    //         SET nombre = ?, color_hex = ?, icono = ?, tipo_aplicable = ?
    //         WHERE id = ? AND usuario_id = ?
    //     `;
    //     const [result] = await promisePool.execute(sql, [
    //         nombre, 
    //         color_hex, 
    //         icono, 
    //         tipo_aplicable, 
    //         id, 
    //         usuarioId
    //     ]);
    //     return result.affectedRows > 0;
    // }

    // Eliminar categoría
    // static async eliminar(id, usuarioId) {
    //     const sql = 'DELETE FROM categorias WHERE id = ? AND usuario_id = ?';
    //     const [result] = await pool.execute(sql, [id, usuarioId]);
    //     return result.affectedRows > 0;
    // }

    // Verificar si existe una categoría con el mismo nombre y tipo para el usuario
    static async existeNombre(usuarioId, nombre, tipo_aplicable, excludeId = null) {
        let sql = 'SELECT id FROM categorias WHERE usuario_id = ? AND nombre = ? AND tipo_aplicable = ?';
        let params = [usuarioId, nombre, tipo_aplicable];
        
        if (excludeId) {
            sql += ' AND id != ?';
            params.push(excludeId);
        }
        
        const [rows] = await promisePool.execute(sql, params);
        return rows.length > 0;
    }

    // Obtener categorías predeterminadas para un nuevo usuario
    static async obtenerPredeterminadas() {
        return [
            { nombre: 'Trabajo', color_hex: '#4F46E5', icono: '', tipo_aplicable: 'todos' },
            { nombre: 'Personal', color_hex: '#10B981', icono: '', tipo_aplicable: 'todos' },
            { nombre: 'Reuniones', color_hex: '#F59E0B', icono: '', tipo_aplicable: 'evento' },
            { nombre: 'Compras', color_hex: '#EF4444', icono: '', tipo_aplicable: 'gasto' },
            { nombre: 'Salario', color_hex: '#22C55E', icono: '', tipo_aplicable: 'ingreso' },
            { nombre: 'Estudio', color_hex: '#8B5CF6', icono: '', tipo_aplicable: 'tarea' }
        ];
    }

    // Crear categorías predeterminadas para un usuario nuevo
    static async crearPredeterminadas(usuarioId) {
        const predeterminadas = await this.obtenerPredeterminadas();
        const categoriasCreadas = [];
        
        for (const cat of predeterminadas) {
            const nueva = await this.crear(usuarioId, cat);
            categoriasCreadas.push(nueva);
        }
        
        return categoriasCreadas;
    }
}

export default CategoriaModel;