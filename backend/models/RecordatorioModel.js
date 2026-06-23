// backend/models/RecordatorioModel.js
import promisePool from '../config/database.js';

class RecordatorioModel {
    // Validar que el evento pertenezca al usuario
    static async validarEvento(usuarioId, eventoId) {
        const [rows] = await promisePool.execute(
            'SELECT id FROM eventos WHERE id = ? AND usuario_id = ?',
            [eventoId, usuarioId]
        );
        if (rows.length === 0) {
            throw new Error('El evento especificado no existe o no pertenece al usuario');
        }
    }

    // Validar que la tarea pertenezca al usuario
    static async validarTarea(usuarioId, tareaId) {
        const [rows] = await promisePool.execute(
            'SELECT id FROM tareas WHERE id = ? AND usuario_id = ?',
            [tareaId, usuarioId]
        );
        if (rows.length === 0) {
            throw new Error('La tarea especificada no existe o no pertenece al usuario');
        }
    }

    // Crear un nuevo recordatorio (apunta a UN evento o UNA tarea, nunca ambos)
    static async crear(usuarioId, datos) {
        const { evento_id, tarea_id, fecha_envio, mensaje, repeticiones } = datos;

        if (!fecha_envio) {
            throw new Error('La fecha de envío es obligatoria');
        }

        // Debe apuntar exactamente a una entidad
        if ((!evento_id && !tarea_id) || (evento_id && tarea_id)) {
            throw new Error('El recordatorio debe apuntar a un evento o a una tarea, pero no a ambos');
        }

        const fechaEnvio = new Date(fecha_envio);
        if (fechaEnvio <= new Date()) {
            throw new Error('La fecha de envío debe ser futura');
        }

        if (evento_id) await this.validarEvento(usuarioId, evento_id);
        if (tarea_id) await this.validarTarea(usuarioId, tarea_id);

        const sql = `
            INSERT INTO recordatorios (usuario_id, evento_id, tarea_id, fecha_envio, mensaje, repeticiones)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const [result] = await promisePool.execute(sql, [
            usuarioId,
            evento_id || null,
            tarea_id || null,
            fecha_envio,
            mensaje || null,
            repeticiones || null
        ]);

        return await this.obtenerPorId(result.insertId, usuarioId);
    }

    // SELECT base con el título de la entidad asociada
    static baseSelect() {
        return `
            SELECT r.*,
                   CASE WHEN r.evento_id IS NOT NULL THEN 'evento'
                        WHEN r.tarea_id IS NOT NULL THEN 'tarea' END as entidad_tipo,
                   COALESCE(e.titulo, t.titulo) as entidad_titulo
            FROM recordatorios r
            LEFT JOIN eventos e ON r.evento_id = e.id
            LEFT JOIN tareas t ON r.tarea_id = t.id
        `;
    }

    // Obtener un recordatorio por ID
    static async obtenerPorId(id, usuarioId) {
        const sql = `${this.baseSelect()} WHERE r.id = ? AND r.usuario_id = ?`;
        const [rows] = await promisePool.execute(sql, [id, usuarioId]);
        return rows[0] || null;
    }

    // Obtener todos los recordatorios de un usuario
    static async listarPorUsuario(usuarioId, filtros = {}) {
        let sql = `${this.baseSelect()} WHERE r.usuario_id = ?`;
        const params = [usuarioId];

        if (filtros.estado && ['programado', 'leido', 'pospuesto', 'cancelado'].includes(filtros.estado)) {
            sql += ` AND r.estado = ?`;
            params.push(filtros.estado);
        }

        if (filtros.evento_id) {
            sql += ` AND r.evento_id = ?`;
            params.push(filtros.evento_id);
        }

        if (filtros.tarea_id) {
            sql += ` AND r.tarea_id = ?`;
            params.push(filtros.tarea_id);
        }

        if (filtros.fecha_desde) {
            sql += ` AND DATE(r.fecha_envio) >= ?`;
            params.push(filtros.fecha_desde);
        }

        if (filtros.fecha_hasta) {
            sql += ` AND DATE(r.fecha_envio) <= ?`;
            params.push(filtros.fecha_hasta);
        }

        if (filtros.solo_pendientes) {
            sql += ` AND r.fecha_envio >= NOW() AND r.estado = 'programado'`;
        }

        const direccion = filtros.direccion === 'DESC' ? 'DESC' : 'ASC';
        const ordenesPermitidos = ['fecha_envio', 'creado_en', 'estado'];
        const ordenFinal = ordenesPermitidos.includes(filtros.orden) ? filtros.orden : 'fecha_envio';
        sql += ` ORDER BY r.${ordenFinal} ${direccion}`;

        if (filtros.limite) {
            sql += ` LIMIT ?`;
            params.push(parseInt(filtros.limite));
        }

        const [rows] = await promisePool.execute(sql, params);
        return rows;
    }

    // Actualizar un recordatorio
    static async actualizar(id, usuarioId, datos) {
        const recordatorioExistente = await this.obtenerPorId(id, usuarioId);
        if (!recordatorioExistente) {
            throw new Error('Recordatorio no encontrado o no pertenece al usuario');
        }

        const { fecha_envio, mensaje, estado, repeticiones } = datos;

        if (estado && !['programado', 'leido', 'pospuesto', 'cancelado'].includes(estado)) {
            throw new Error('Estado no válido. Debe ser: programado, leido, pospuesto o cancelado');
        }

        if (fecha_envio) {
            const fechaEnvio = new Date(fecha_envio);
            if (fechaEnvio <= new Date()) {
                throw new Error('La fecha de envío debe ser futura');
            }
        }

        let fechaLectura = recordatorioExistente.fecha_lectura;
        if (estado === 'leido') {
            fechaLectura = new Date();
        }

        const sql = `
            UPDATE recordatorios
            SET fecha_envio = COALESCE(?, fecha_envio),
                mensaje = ?,
                estado = COALESCE(?, estado),
                repeticiones = ?,
                fecha_lectura = ?
            WHERE id = ? AND usuario_id = ?
        `;

        const [result] = await promisePool.execute(sql, [
            fecha_envio || null,
            mensaje !== undefined ? (mensaje || null) : recordatorioExistente.mensaje,
            estado || null,
            repeticiones !== undefined ? repeticiones : recordatorioExistente.repeticiones,
            fechaLectura || null,
            id,
            usuarioId
        ]);

        if (result.affectedRows === 0) {
            throw new Error('No se pudo actualizar el recordatorio');
        }

        return await this.obtenerPorId(id, usuarioId);
    }

    static async marcarLeido(id, usuarioId) {
        return await this.actualizar(id, usuarioId, { estado: 'leido' });
    }

    static async posponer(id, usuarioId, nuevaFecha) {
        if (!nuevaFecha) {
            throw new Error('La nueva fecha de envío es requerida');
        }
        if (new Date(nuevaFecha) <= new Date()) {
            throw new Error('La fecha de envío debe ser futura');
        }
        return await this.actualizar(id, usuarioId, {
            estado: 'pospuesto',
            fecha_envio: nuevaFecha
        });
    }

    static async cancelar(id, usuarioId) {
        return await this.actualizar(id, usuarioId, { estado: 'cancelado' });
    }

    // Eliminar un recordatorio
    static async eliminar(id, usuarioId) {
        const sql = 'DELETE FROM recordatorios WHERE id = ? AND usuario_id = ?';
        const [result] = await promisePool.execute(sql, [id, usuarioId]);
        return result.affectedRows > 0;
    }

    static async listarPorEvento(usuarioId, eventoId) {
        return await this.listarPorUsuario(usuarioId, { evento_id: eventoId });
    }

    static async listarPorTarea(usuarioId, tareaId) {
        return await this.listarPorUsuario(usuarioId, { tarea_id: tareaId });
    }

    // Obtener recordatorios pendientes (para el cron job)
    static async obtenerPendientes() {
        const sql = `
            SELECT r.*,
                   u.correo as usuario_correo,
                   u.nombre as usuario_nombre,
                   COALESCE(e.titulo, t.titulo) as entidad_titulo
            FROM recordatorios r
            INNER JOIN usuarios u ON r.usuario_id = u.id
            LEFT JOIN eventos e ON r.evento_id = e.id
            LEFT JOIN tareas t ON r.tarea_id = t.id
            WHERE r.estado = 'programado'
                AND r.fecha_envio <= NOW()
                AND r.fecha_envio > DATE_SUB(NOW(), INTERVAL 1 HOUR)
            ORDER BY r.fecha_envio ASC
        `;
        const [rows] = await promisePool.execute(sql);
        return rows;
    }

    static async listarPorRango(usuarioId, fechaInicio, fechaFin) {
        return await this.listarPorUsuario(usuarioId, {
            fecha_desde: fechaInicio,
            fecha_hasta: fechaFin
        });
    }

    // Contar recordatorios por estado
    static async contarPorEstado(usuarioId) {
        const sql = `
            SELECT estado, COUNT(*) as cantidad
            FROM recordatorios
            WHERE usuario_id = ?
            GROUP BY estado
        `;
        const [rows] = await promisePool.execute(sql, [usuarioId]);
        return rows;
    }

    // Obtener resumen de recordatorios
    static async obtenerResumen(usuarioId) {
        const sql = `
            SELECT
                COUNT(*) as total,
                SUM(CASE WHEN estado = 'programado' THEN 1 ELSE 0 END) as programados,
                SUM(CASE WHEN estado = 'leido' THEN 1 ELSE 0 END) as leidos,
                SUM(CASE WHEN estado = 'pospuesto' THEN 1 ELSE 0 END) as pospuestos,
                SUM(CASE WHEN estado = 'cancelado' THEN 1 ELSE 0 END) as cancelados,
                SUM(CASE WHEN fecha_envio >= NOW() AND estado = 'programado' THEN 1 ELSE 0 END) as pendientes
            FROM recordatorios
            WHERE usuario_id = ?
        `;
        const [rows] = await promisePool.execute(sql, [usuarioId]);
        return rows[0];
    }

    // Eliminar recordatorios viejos (leidos o cancelados de hace más de 30 días)
    static async limpiarViejos(usuarioId) {
        const sql = `
            DELETE FROM recordatorios
            WHERE usuario_id = ?
                AND estado IN ('leido', 'cancelado')
                AND fecha_lectura < DATE_SUB(NOW(), INTERVAL 30 DAY)
        `;
        const [result] = await promisePool.execute(sql, [usuarioId]);
        return result.affectedRows;
    }
}

export default RecordatorioModel;
