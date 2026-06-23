import promisePool from '../config/database.js';

class TareaModel {
    // Crear una nueva tarea (tabla autonoma, sin elementos)
    static async crear({ usuario_id, titulo, descripcion, fecha_limite, fecha_completado, estado, prioridad, color_hex, recurrencia_id }) {
        const sql = `
            INSERT INTO tareas (
                usuario_id, titulo, descripcion, fecha_limite, fecha_completado,
                estado, prioridad, color_hex, recurrencia_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const [result] = await promisePool.execute(sql, [
            usuario_id,
            titulo,
            descripcion || null,
            fecha_limite || null,
            fecha_completado || null,
            estado || 'por_hacer',
            prioridad || 'media',
            color_hex || null,
            recurrencia_id || null
        ]);

        return await this.obtenerPorId(result.insertId, usuario_id);
    }

    // Obtener una tarea por ID
    static async obtenerPorId(id, usuarioId) {
        const sql = `SELECT * FROM tareas WHERE id = ? AND usuario_id = ?`;
        const [rows] = await promisePool.execute(sql, [id, usuarioId]);
        return rows[0] || null;
    }

    // Listar todas las tareas de un usuario
    static async listarPorUsuario(usuarioId, filtros = {}) {
        let sql = `SELECT * FROM tareas WHERE usuario_id = ?`;
        const params = [usuarioId];

        // Filtro por estado
        if (filtros.estado) {
            sql += ` AND estado = ?`;
            params.push(filtros.estado);
        }

        // Filtro por prioridad
        if (filtros.prioridad) {
            sql += ` AND prioridad = ?`;
            params.push(filtros.prioridad);
        }

        // Filtro por rango de fecha límite
        if (filtros.fecha_limite_desde && filtros.fecha_limite_hasta) {
            sql += ` AND DATE(fecha_limite) BETWEEN ? AND ?`;
            params.push(filtros.fecha_limite_desde, filtros.fecha_limite_hasta);
        } else if (filtros.fecha_limite_hasta) {
            sql += ` AND fecha_limite <= ?`;
            params.push(filtros.fecha_limite_hasta);
        } else if (filtros.fecha_limite_desde) {
            sql += ` AND fecha_limite >= ?`;
            params.push(filtros.fecha_limite_desde);
        }

        sql += ` ORDER BY ISNULL(fecha_limite) ASC, fecha_limite ASC, creado_en DESC`;

        const [rows] = await promisePool.execute(sql, params);
        return rows;
    }

    // Listar tareas por estado
    static async listarPorEstado(usuarioId, estado) {
        const estadosPermitidos = ['por_hacer', 'en_progreso', 'completada', 'cancelada'];
        if (!estadosPermitidos.includes(estado)) {
            throw new Error(`Estado no válido. Use: ${estadosPermitidos.join(', ')}`);
        }

        return await this.listarPorUsuario(usuarioId, { estado });
    }

    // Listar tareas por prioridad
    static async listarPorPrioridad(usuarioId, prioridad) {
        const prioridadesPermitidas = ['baja', 'media', 'alta', 'urgente'];
        if (!prioridadesPermitidas.includes(prioridad)) {
            throw new Error(`Prioridad no válida. Use: ${prioridadesPermitidas.join(', ')}`);
        }

        return await this.listarPorUsuario(usuarioId, { prioridad });
    }

    // Actualizar tarea
    static async actualizar(id, usuarioId, { titulo, descripcion, fecha_limite, fecha_completado, estado, prioridad, color_hex, recurrencia_id }) {
        const tareaActual = await this.obtenerPorId(id, usuarioId);
        if (!tareaActual) {
            return false;
        }

        const sql = `
            UPDATE tareas
            SET titulo = ?,
                descripcion = ?,
                fecha_limite = ?,
                fecha_completado = ?,
                estado = ?,
                prioridad = ?,
                color_hex = ?,
                recurrencia_id = ?
            WHERE id = ? AND usuario_id = ?
        `;
        const [result] = await promisePool.execute(sql, [
            titulo !== undefined ? titulo : tareaActual.titulo,
            descripcion !== undefined ? descripcion : tareaActual.descripcion,
            fecha_limite !== undefined ? fecha_limite : tareaActual.fecha_limite,
            fecha_completado !== undefined ? fecha_completado : tareaActual.fecha_completado,
            estado || tareaActual.estado,
            prioridad || tareaActual.prioridad,
            color_hex !== undefined ? color_hex : tareaActual.color_hex,
            recurrencia_id !== undefined ? recurrencia_id : tareaActual.recurrencia_id,
            id,
            usuarioId
        ]);
        return result.affectedRows > 0;
    }

    // Eliminar tarea
    static async eliminar(id, usuarioId) {
        const sql = 'DELETE FROM tareas WHERE id = ? AND usuario_id = ?';
        const [result] = await promisePool.execute(sql, [id, usuarioId]);
        return result.affectedRows > 0;
    }

    // Eliminar toda la serie de tareas que comparten una misma recurrencia
    static async eliminarSerie(recurrenciaId, usuarioId) {
        const sql = 'DELETE FROM tareas WHERE recurrencia_id = ? AND usuario_id = ?';
        const [result] = await promisePool.execute(sql, [recurrenciaId, usuarioId]);
        return result.affectedRows;
    }

    // Cambiar estado de una tarea
    static async cambiarEstado(id, usuarioId, nuevoEstado) {
        const estadosPermitidos = ['por_hacer', 'en_progreso', 'completada', 'cancelada'];
        if (!estadosPermitidos.includes(nuevoEstado)) {
            return false;
        }

        let fechaCompletado = null;
        if (nuevoEstado === 'completada') {
            fechaCompletado = new Date();
        }

        const sql = 'UPDATE tareas SET estado = ?, fecha_completado = ? WHERE id = ? AND usuario_id = ?';
        const [result] = await promisePool.execute(sql, [nuevoEstado, fechaCompletado, id, usuarioId]);
        return result.affectedRows > 0;
    }

    // Cambiar prioridad de una tarea
    static async cambiarPrioridad(id, usuarioId, nuevaPrioridad) {
        const prioridadesPermitidas = ['baja', 'media', 'alta', 'urgente'];
        if (!prioridadesPermitidas.includes(nuevaPrioridad)) {
            return false;
        }

        const sql = 'UPDATE tareas SET prioridad = ? WHERE id = ? AND usuario_id = ?';
        const [result] = await promisePool.execute(sql, [nuevaPrioridad, id, usuarioId]);
        return result.affectedRows > 0;
    }

    // Obtener tareas vencidas (fecha_limite pasada y estado no completada/cancelada)
    static async listarVencidas(usuarioId) {
        const ahora = new Date();
        const sql = `
            SELECT * FROM tareas
            WHERE usuario_id = ?
                AND fecha_limite < ?
                AND estado NOT IN ('completada', 'cancelada')
            ORDER BY fecha_limite ASC
        `;
        const [rows] = await promisePool.execute(sql, [usuarioId, ahora]);
        return rows;
    }

    // Tareas que tienen una regla de recurrencia (con los datos de la regla)
    static async listarConRecurrencia(usuarioId) {
        const sql = `
            SELECT t.*, r.intervalo, r.frecuencia_dias, r.fecha_fin AS rec_fecha_fin, r.num_rec
            FROM tareas t
            INNER JOIN recurrencias r ON t.recurrencia_id = r.id
            WHERE t.usuario_id = ?
        `;
        const [rows] = await promisePool.execute(sql, [usuarioId]);
        return rows;
    }
}

export default TareaModel;
