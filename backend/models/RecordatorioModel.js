// backend/models/RecordatorioModel.js
import promisePool from '../config/database.js';

class RecordatorioModel {
    // Crear un nuevo recordatorio
    static async crear(usuarioId, datos) {
        const { tipo_entidad, entidad_id, fecha_envio, mensaje, repeticiones } = datos;

        // Validaciones básicas
        if (!tipo_entidad || !['evento', 'tarea', 'nota'].includes(tipo_entidad)) {
            throw new Error('Tipo de entidad no válido. Debe ser: evento, tarea o nota');
        }

        if (!entidad_id) {
            throw new Error('El ID de la entidad es obligatorio');
        }

        if (!fecha_envio) {
            throw new Error('La fecha de envío es obligatoria');
        }

        // Validar que la fecha de envío sea futura
        const fechaActual = new Date();
        const fechaEnvio = new Date(fecha_envio);
        if (fechaEnvio <= fechaActual) {
            throw new Error('La fecha de envío debe ser futura');
        }

        // Validar que la entidad exista y pertenezca al usuario
        await this.validarEntidad(usuarioId, tipo_entidad, entidad_id);

        const sql = `
            INSERT INTO recordatorios (usuario_id, tipo_entidad, entidad_id, fecha_envio, mensaje, repeticiones)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const [result] = await promisePool.execute(sql, [
            usuarioId,
            tipo_entidad,
            entidad_id,
            fecha_envio,
            mensaje || null,
            repeticiones || null
        ]);

        return await this.obtenerPorId(result.insertId, usuarioId);
    }

    // Validar que la entidad exista y pertenezca al usuario
    static async validarEntidad(usuarioId, tipo_entidad, entidad_id) {
        let tabla, idCampo, query;

        if (tipo_entidad === 'evento' || tipo_entidad === 'tarea') {
            // Eventos y tareas usan la tabla elementos
            if (tipo_entidad === 'evento') {
                query = `
                    SELECT e.id 
                    FROM elementos e
                    INNER JOIN eventos ev ON e.id = ev.id
                    WHERE e.id = ? AND e.usuario_id = ?
                `;
            } else {
                query = `
                    SELECT e.id 
                    FROM elementos e
                    INNER JOIN tareas t ON e.id = t.id
                    WHERE e.id = ? AND e.usuario_id = ?
                `;
            }
        } else if (tipo_entidad === 'nota') {
            query = 'SELECT id FROM notas WHERE id = ? AND usuario_id = ?';
        }

        const [rows] = await promisePool.execute(query, [entidad_id, usuarioId]);
        if (rows.length === 0) {
            throw new Error(`El ${tipo_entidad} especificado no existe o no pertenece al usuario`);
        }
        return true;
    }

    // Obtener un recordatorio por ID
    static async obtenerPorId(id, usuarioId) {
        const sql = `
            SELECT r.*,
                   CASE 
                       WHEN r.tipo_entidad = 'evento' THEN (SELECT e.titulo FROM elementos e WHERE e.id = r.entidad_id)
                       WHEN r.tipo_entidad = 'tarea' THEN (SELECT e.titulo FROM elementos e WHERE e.id = r.entidad_id)
                       WHEN r.tipo_entidad = 'nota' THEN (SELECT n.titulo FROM notas n WHERE n.id = r.entidad_id)
                   END as entidad_titulo
            FROM recordatorios r
            WHERE r.id = ? AND r.usuario_id = ?
        `;
        const [rows] = await promisePool.execute(sql, [id, usuarioId]);
        return rows[0] || null;
    }

    // Obtener todos los recordatorios de un usuario
    static async listarPorUsuario(usuarioId, filtros = {}) {
        let sql = `
            SELECT r.*,
                   CASE 
                       WHEN r.tipo_entidad = 'evento' THEN (SELECT e.titulo FROM elementos e WHERE e.id = r.entidad_id)
                       WHEN r.tipo_entidad = 'tarea' THEN (SELECT e.titulo FROM elementos e WHERE e.id = r.entidad_id)
                       WHEN r.tipo_entidad = 'nota' THEN (SELECT n.titulo FROM notas n WHERE n.id = r.entidad_id)
                   END as entidad_titulo
            FROM recordatorios r
            WHERE r.usuario_id = ?
        `;
        const params = [usuarioId];

        // Filtro por tipo de entidad
        if (filtros.tipo_entidad && ['evento', 'tarea', 'nota'].includes(filtros.tipo_entidad)) {
            sql += ` AND r.tipo_entidad = ?`;
            params.push(filtros.tipo_entidad);
        }

        // Filtro por estado
        if (filtros.estado && ['programado', 'leido', 'pospuesto', 'cancelado'].includes(filtros.estado)) {
            sql += ` AND r.estado = ?`;
            params.push(filtros.estado);
        }

        // Filtro por entidad_id
        if (filtros.entidad_id) {
            sql += ` AND r.entidad_id = ?`;
            params.push(filtros.entidad_id);
        }

        // Filtro por fecha de envío (desde)
        if (filtros.fecha_desde) {
            sql += ` AND DATE(r.fecha_envio) >= ?`;
            params.push(filtros.fecha_desde);
        }

        // Filtro por fecha de envío (hasta)
        if (filtros.fecha_hasta) {
            sql += ` AND DATE(r.fecha_envio) <= ?`;
            params.push(filtros.fecha_hasta);
        }

        // Solo recordatorios pendientes (fecha_envio >= ahora y estado = programado)
        if (filtros.solo_pendientes) {
            sql += ` AND r.fecha_envio >= NOW() AND r.estado = 'programado'`;
        }

        // Ordenamiento
        const orden = filtros.orden || 'fecha_envio';
        const direccion = filtros.direccion || 'ASC';
        const ordenesPermitidos = ['fecha_envio', 'creado_en', 'estado', 'tipo_entidad'];
        const ordenFinal = ordenesPermitidos.includes(orden) ? orden : 'fecha_envio';
        sql += ` ORDER BY r.${ordenFinal} ${direccion === 'DESC' ? 'DESC' : 'ASC'}`;

        // Límite
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

        // Validar estado
        if (estado && !['programado', 'leido', 'pospuesto', 'cancelado'].includes(estado)) {
            throw new Error('Estado no válido. Debe ser: programado, leido, pospuesto o cancelado');
        }

        // Validar fecha futura si viene
        if (fecha_envio) {
            const fechaEnvio = new Date(fecha_envio);
            const fechaActual = new Date();
            if (fechaEnvio <= fechaActual) {
                throw new Error('La fecha de envío debe ser futura');
            }
        }

        // Si se marca como leido, registrar fecha_lectura
        let fechaLectura = null;
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
            fecha_envio || undefined,
            mensaje !== undefined ? (mensaje || null) : undefined,
            estado || undefined,
            repeticiones !== undefined ? repeticiones : undefined,
            fechaLectura,
            id,
            usuarioId
        ]);

        if (result.affectedRows === 0) {
            throw new Error('No se pudo actualizar el recordatorio');
        }

        return await this.obtenerPorId(id, usuarioId);
    }

    // Marcar recordatorio como leido
    static async marcarLeido(id, usuarioId) {
        return await this.actualizar(id, usuarioId, { estado: 'leido' });
    }

    // Posponer recordatorio
    static async posponer(id, usuarioId, nuevaFecha) {
        if (!nuevaFecha) {
            throw new Error('La nueva fecha de envío es requerida');
        }

        const fechaEnvio = new Date(nuevaFecha);
        const fechaActual = new Date();
        if (fechaEnvio <= fechaActual) {
            throw new Error('La fecha de envío debe ser futura');
        }

        return await this.actualizar(id, usuarioId, {
            estado: 'pospuesto',
            fecha_envio: nuevaFecha
        });
    }

    // Cancelar recordatorio
    static async cancelar(id, usuarioId) {
        return await this.actualizar(id, usuarioId, { estado: 'cancelado' });
    }

    // Eliminar un recordatorio
    static async eliminar(id, usuarioId) {
        const sql = 'DELETE FROM recordatorios WHERE id = ? AND usuario_id = ?';
        const [result] = await promisePool.execute(sql, [id, usuarioId]);
        return result.affectedRows > 0;
    }

    // Obtener recordatorios por entidad (evento/tarea/nota)
    static async listarPorEntidad(usuarioId, tipo_entidad, entidad_id) {
        return await this.listarPorUsuario(usuarioId, {
            tipo_entidad,
            entidad_id
        });
    }

    // Obtener recordatorios pendientes (para el cron job)
    static async obtenerPendientes() {
        const sql = `
            SELECT r.*,
                   u.email as usuario_email,
                   u.nombre as usuario_nombre,
                   CASE 
                       WHEN r.tipo_entidad = 'evento' THEN (SELECT e.titulo FROM elementos e WHERE e.id = r.entidad_id)
                       WHEN r.tipo_entidad = 'tarea' THEN (SELECT e.titulo FROM elementos e WHERE e.id = r.entidad_id)
                       WHEN r.tipo_entidad = 'nota' THEN (SELECT n.titulo FROM notas n WHERE n.id = r.entidad_id)
                   END as entidad_titulo
            FROM recordatorios r
            INNER JOIN usuarios u ON r.usuario_id = u.id
            WHERE r.estado = 'programado' 
                AND r.fecha_envio <= NOW()
                AND r.fecha_envio > DATE_SUB(NOW(), INTERVAL 1 HOUR)
            ORDER BY r.fecha_envio ASC
        `;
        const [rows] = await promisePool.execute(sql);
        return rows;
    }

    // Obtener recordatorios por rango de fechas
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
                SUM(CASE WHEN estado = 'pospuesto' THEN 1 ELSE 0 END) como pospuestos,
                SUM(CASE WHEN estado = 'cancelado' THEN 1 ELSE 0 END) como cancelados,
                SUM(CASE WHEN fecha_envio >= NOW() AND estado = 'programado' THEN 1 ELSE 0 END) como pendientes,
                COUNT(DISTINCT entidad_id) as entidades_distintas
            FROM recordatorios
            WHERE usuario_id = ?
        `;
        const [rows] = await promisePool.execute(sql, [usuarioId]);
        return rows[0];
    }

    // Verificar si existe un recordatorio para una entidad
    static async existeParaEntidad(usuarioId, tipo_entidad, entidad_id) {
        const sql = `
            SELECT id FROM recordatorios 
            WHERE usuario_id = ? 
                AND tipo_entidad = ? 
                AND entidad_id = ?
                AND estado IN ('programado', 'pospuesto')
                AND fecha_envio >= NOW()
        `;
        const [rows] = await promisePool.execute(sql, [usuarioId, tipo_entidad, entidad_id]);
        return rows.length > 0;
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