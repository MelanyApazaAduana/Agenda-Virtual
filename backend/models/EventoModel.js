import promisePool from '../config/database.js';

class EventoModel {
    // Crear un nuevo evento (tabla autonoma, sin elementos)
    static async crear({ usuario_id, titulo, descripcion, fecha_inicio, fecha_fin, ubicacion, color_hex, estado, recurrencia_id }) {
        const sql = `
            INSERT INTO eventos (usuario_id, titulo, descripcion, fecha_inicio, fecha_fin, ubicacion, color_hex, estado, recurrencia_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const [result] = await promisePool.execute(sql, [
            usuario_id,
            titulo,
            descripcion || null,
            fecha_inicio,
            fecha_fin,
            ubicacion || null,
            color_hex || null,
            estado || 'pendiente',
            recurrencia_id || null
        ]);

        return await this.obtenerPorId(result.insertId, usuario_id);
    }

    // Obtener un evento por id
    static async obtenerPorId(id, usuarioId) {
        const sql = `
            SELECT * FROM eventos
            WHERE id = ? AND usuario_id = ?
        `;
        const [rows] = await promisePool.execute(sql, [id, usuarioId]);
        return rows[0] || null;
    }

    // Listar todos los eventos de un usuario (con filtros opcionales)
    static async listarPorUsuario(usuarioId, filtros = {}) {
        let sql = `SELECT * FROM eventos WHERE usuario_id = ?`;
        const params = [usuarioId];

        // Filtro por rango de fechas
        if (filtros.fecha_inicio && filtros.fecha_fin) {
            sql += ` AND DATE(fecha_inicio) BETWEEN ? AND ?`;
            params.push(filtros.fecha_inicio, filtros.fecha_fin);
        } else if (filtros.fecha_inicio) {
            sql += ` AND DATE(fecha_inicio) = ?`;
            params.push(filtros.fecha_inicio);
        }

        // Filtro por estado
        if (filtros.estado) {
            sql += ` AND estado = ?`;
            params.push(filtros.estado);
        }

        sql += ` ORDER BY fecha_inicio ASC`;

        const [rows] = await promisePool.execute(sql, params);
        return rows;
    }

    // Actualizar evento
    static async actualizar(id, usuarioId, { titulo, descripcion, fecha_inicio, fecha_fin, ubicacion, color_hex, estado, recurrencia_id }) {
        const eventoActual = await this.obtenerPorId(id, usuarioId);
        if (!eventoActual) {
            return false;
        }

        const sql = `
            UPDATE eventos
            SET titulo = ?,
                descripcion = ?,
                fecha_inicio = ?,
                fecha_fin = ?,
                ubicacion = ?,
                color_hex = ?,
                estado = ?,
                recurrencia_id = ?
            WHERE id = ? AND usuario_id = ?
        `;
        const [result] = await promisePool.execute(sql, [
            titulo !== undefined ? titulo : eventoActual.titulo,
            descripcion !== undefined ? descripcion : eventoActual.descripcion,
            fecha_inicio || eventoActual.fecha_inicio,
            fecha_fin || eventoActual.fecha_fin,
            ubicacion !== undefined ? ubicacion : eventoActual.ubicacion,
            color_hex !== undefined ? color_hex : eventoActual.color_hex,
            estado || eventoActual.estado,
            recurrencia_id !== undefined ? recurrencia_id : eventoActual.recurrencia_id,
            id,
            usuarioId
        ]);
        return result.affectedRows > 0;
    }

    // Eliminar evento (en cascada se borran sus recordatorios; las notas quedan sueltas)
    static async eliminar(id, usuarioId) {
        const sql = 'DELETE FROM eventos WHERE id = ? AND usuario_id = ?';
        const [result] = await promisePool.execute(sql, [id, usuarioId]);
        return result.affectedRows > 0;
    }

    // Cambiar estado de un evento
    static async cambiarEstado(id, usuarioId, nuevoEstado) {
        const estadosPermitidos = ['pendiente', 'en_curso', 'completado', 'cancelado', 'pospuesto', 'vencido'];
        if (!estadosPermitidos.includes(nuevoEstado)) {
            return false;
        }

        const sql = 'UPDATE eventos SET estado = ? WHERE id = ? AND usuario_id = ?';
        const [result] = await promisePool.execute(sql, [nuevoEstado, id, usuarioId]);
        return result.affectedRows > 0;
    }

    // Calcular estado actual basado en fechas
    static calcularEstadoPorFechas(fecha_inicio, fecha_fin) {
        const ahora = new Date();
        const inicio = new Date(fecha_inicio);
        const fin = new Date(fecha_fin);

        if (fin <= ahora) {
            return 'vencido';
        } else if (inicio <= ahora && fin > ahora) {
            return 'en_curso';
        } else if (inicio > ahora) {
            return 'pendiente';
        }
        return 'pendiente';
    }

    // Obtener evento con estado actualizado
    static async obtenerConEstadoEnVivo(id, usuarioId) {
        const evento = await this.obtenerPorId(id, usuarioId);
        if (!evento) return null;

        const estadosManuales = ['cancelado', 'completado', 'pospuesto', 'vencido'];
        if (!estadosManuales.includes(evento.estado)) {
            evento.estado_calculado = this.calcularEstadoPorFechas(evento.fecha_inicio, evento.fecha_fin);
            evento.estado_real = evento.estado_calculado;
        } else {
            evento.estado_real = evento.estado;
        }

        return evento;
    }

    // Listar eventos con estado calculado en vivo
    static async listarConEstadoEnVivo(usuarioId, filtros = {}) {
        const eventos = await this.listarPorUsuario(usuarioId, filtros);
        const estadosManuales = ['cancelado', 'completado', 'pospuesto', 'vencido'];

        return eventos.map(evento => {
            if (!estadosManuales.includes(evento.estado)) {
                evento.estado_calculado = this.calcularEstadoPorFechas(evento.fecha_inicio, evento.fecha_fin);
                evento.estado_real = evento.estado_calculado;
            } else {
                evento.estado_real = evento.estado;
            }
            return evento;
        });
    }

    // Actualizacion automatica de estados por fechas (cron)
    static async actualizarEstadosAutomaticos(usuarioId = null) {
        const ahora = new Date();

        let sql = `
            UPDATE eventos e
            SET e.estado = CASE
                WHEN e.fecha_fin <= ? AND e.estado NOT IN ('cancelado', 'completado', 'pospuesto')
                    THEN 'vencido'
                WHEN e.fecha_inicio <= ? AND e.fecha_fin > ?
                    AND e.estado NOT IN ('cancelado', 'completado', 'pospuesto')
                    THEN 'en_curso'
                WHEN e.fecha_inicio > ?
                    AND e.estado NOT IN ('cancelado', 'completado', 'pospuesto')
                    THEN 'pendiente'
                ELSE e.estado
            END
        `;

        const params = [ahora, ahora, ahora, ahora];

        if (usuarioId) {
            sql += ` WHERE e.usuario_id = ?`;
            params.push(usuarioId);
        }

        const [result] = await promisePool.execute(sql, params);
        return {
            actualizados: result.affectedRows,
            mensaje: `Se actualizaron ${result.affectedRows} eventos automáticos`
        };
    }

    // Eventos que tienen una regla de recurrencia (con los datos de la regla)
    static async listarConRecurrencia(usuarioId) {
        const sql = `
            SELECT e.*, r.intervalo, r.frecuencia_dias, r.fecha_fin AS rec_fecha_fin, r.num_rec
            FROM eventos e
            INNER JOIN recurrencias r ON e.recurrencia_id = r.id
            WHERE e.usuario_id = ?
        `;
        const [rows] = await promisePool.execute(sql, [usuarioId]);
        return rows;
    }
}

export default EventoModel;
