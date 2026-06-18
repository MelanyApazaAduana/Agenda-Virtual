import promisePool from '../config/database.js';

class EventoModel {
    // Crear un nuevo evento (requiere que el elemento ya exista)
    static async crear({ elemento_id, descripcion, fecha_inicio, fecha_fin, ubicacion, color_etiqueta, estado, instancia_id }) {
        const sql = `
            INSERT INTO eventos (elemento_id, descripcion, fecha_inicio, fecha_fin, ubicacion, color_etiqueta, estado, instancia_id) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const [result] = await promisePool.execute(sql, [
            elemento_id,
            descripcion || null,
            fecha_inicio,
            fecha_fin,
            ubicacion || null,
            color_etiqueta || null,
            estado || 'pendiente',
            instancia_id || null
        ]);
        
        return {
            id: result.insertId,
            elemento_id,
            descripcion: descripcion || null,
            fecha_inicio,
            fecha_fin,
            ubicacion: ubicacion || null,
            color_etiqueta: color_etiqueta || null,
            estado: estado || 'pendiente',
            instancia_id: instancia_id || null,
            creado_en: new Date()
        };
    }

    // Obtener un evento por id 
    static async obtenerPorId(id, usuarioId) {
        const sql = `
            SELECT e.*, 
                   el.titulo, el.categoria_id, el.usuario_id,
                   c.nombre as categoria_nombre, c.color_hex as categoria_color
            FROM eventos e
            INNER JOIN elementos el ON e.elemento_id = el.id
            LEFT JOIN categorias c ON el.categoria_id = c.id
            WHERE e.id = ? AND el.usuario_id = ?
        `;
        const [rows] = await promisePool.execute(sql, [id, usuarioId]);
        return rows[0] || null;
    }

    // Listar todos los eventos de un usuario (con filtros opcionales)
    static async listarPorUsuario(usuarioId, filtros = {}) {
        let sql = `
            SELECT e.*, 
                   el.titulo, el.categoria_id,
                   c.nombre as categoria_nombre, c.color_hex as categoria_color
            FROM eventos e
            INNER JOIN elementos el ON e.elemento_id = el.id
            LEFT JOIN categorias c ON el.categoria_id = c.id
            WHERE el.usuario_id = ?
        `;
        const params = [usuarioId];
        
        // Filtro por rango de fechas
        if (filtros.fecha_inicio && filtros.fecha_fin) {
            sql += ` AND e.fecha_inicio BETWEEN ? AND ?`;
            params.push(filtros.fecha_inicio, filtros.fecha_fin);
        } else if (filtros.fecha_inicio) {
            sql += ` AND DATE(e.fecha_inicio) = ?`;
            params.push(filtros.fecha_inicio);
        }
        
        // Filtro por estado
        if (filtros.estado) {
            sql += ` AND e.estado = ?`;
            params.push(filtros.estado);
        }
        
        // Filtro por categoría
        if (filtros.categoria_id) {
            sql += ` AND el.categoria_id = ?`;
            params.push(filtros.categoria_id);
        }
        
        sql += ` ORDER BY e.fecha_inicio ASC`;
        
        const [rows] = await promisePool.execute(sql, params);
        return rows;
    }

    // Actualizar evento
    static async actualizar(id, usuarioId, { descripcion, fecha_inicio, fecha_fin, ubicacion, color_etiqueta, estado, instancia_id }) {
        // Primero verificar que el evento pertenece al usuario
        const eventoActual = await this.obtenerPorId(id, usuarioId);
        if (!eventoActual) {
            return false;
        }
        
        const sql = `
            UPDATE eventos 
            SET descripcion = ?, 
                fecha_inicio = ?, 
                fecha_fin = ?, 
                ubicacion = ?, 
                color_etiqueta = ?, 
                estado = ?, 
                instancia_id = ?
            WHERE id = ?
        `;
        const [result] = await promisePool.execute(sql, [
            descripcion !== undefined ? descripcion : eventoActual.descripcion,
            fecha_inicio || eventoActual.fecha_inicio,
            fecha_fin || eventoActual.fecha_fin,
            ubicacion !== undefined ? ubicacion : eventoActual.ubicacion,
            color_etiqueta !== undefined ? color_etiqueta : eventoActual.color_etiqueta,
            estado || eventoActual.estado,
            instancia_id !== undefined ? instancia_id : eventoActual.instancia_id,
            id
        ]);
        return result.affectedRows > 0;
    }

    // Eliminar evento (solo elimina el evento, no el elemento)
    // static async eliminar(id, usuarioId) {
    //     // Verificar que el evento pertenece al usuario
    //     const evento = await this.obtenerPorId(id, usuarioId);
    //     if (!evento) {
    //         return false;
    //     }
        
    //     const sql = 'DELETE FROM eventos WHERE id = ?';
    //     const [result] = await promisePool.execute(sql, [id]);
    //     return result.affectedRows > 0;
    // }

    // Eliminar evento y su elemento base cascada 
    static async eliminarCompleto(id, usuarioId) {
        // Obtener el evento para saber el elemento_id
        const evento = await this.obtenerPorId(id, usuarioId);
        if (!evento) {
            return false;
        }
        
        // Eliminar evento (por la FK, se puede eliminar independientemente)
        await this.eliminar(id, usuarioId);
        
        // Eliminar el elemento (esto eliminará en cascada si hay otras relaciones)
        const sql = 'DELETE FROM elementos WHERE id = ? AND usuario_id = ?';
        const [result] = await promisePool.execute(sql, [evento.elemento_id, usuarioId]);
        return result.affectedRows > 0;
    }

    // Cambiar estado de un evento
    static async cambiarEstado(id, usuarioId, nuevoEstado) {
        const estadosPermitidos = ['pendiente', 'en_curso', 'completado', 'cancelado', 'pospuesto', 'vencido'];
        if (!estadosPermitidos.includes(nuevoEstado)) {
            return false;
        }
        
        const sql = 'UPDATE eventos SET estado = ? WHERE id = ?';
        const [result] = await promisePool.execute(sql, [nuevoEstado, id]);
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
        
        const estadosconst = ['cancelado', 'completado', 'pospuesto','vencido'];
        if (!estadosconst.includes(evento.estado)) {
            evento.estado_calculado = this.calcularEstadoPorFechas(evento.fecha_inicio, evento.fecha_fin);
            evento.estado_real = evento.estado_calculado; // Para que el frontend use este
        } else {
            evento.estado_real = evento.estado;
        }
        
        return evento;
    }

    // Listar eventos con estado calculado en vivo
    static async listarConEstadoEnVivo(usuarioId, filtros = {}) {
        const eventos = await this.listarPorUsuario(usuarioId, filtros);
        const estadosManuales = ['cancelado', 'completado', 'pospuesto','vencido'];
        
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

    // E2  - E3
    static async actualizarEstadosAutomaticos(usuarioId=null) {
        const ahora = new Date();
        
        let sql = `
            UPDATE eventos e
            INNER JOIN elementos el ON e.elemento_id = el.id
            SET e.estado = CASE
                -- Eventos vencidos (fecha_fin ya pasó)
                WHEN e.fecha_fin <= ? AND e.estado NOT IN ('cancelado', 'completado', 'pospuesto')
                    THEN 'vencido'
                -- Eventos en curso (empezaron pero no terminaron)
                WHEN e.fecha_inicio <= ? AND e.fecha_fin > ? 
                    AND e.estado NOT IN ('cancelado', 'completado', 'pospuesto')
                    THEN 'en_curso'
                -- Eventos pendientes (aún no empiezan)
                WHEN e.fecha_inicio > ? 
                    AND e.estado NOT IN ('cancelado', 'completado', 'pospuesto')
                    THEN 'pendiente'
                ELSE e.estado
            END
            
        `;
        
        const params = [ahora, ahora, ahora, ahora];
        
        if (usuarioId) {
            sql += ` WHERE el.usuario_id = ?`;
            params.push(usuarioId);
        }

        const [result] = await promisePool.execute(sql, params);
        return {
            actualizados: result.affectedRows,
            mensaje: `Se actualizaron ${result.affectedRows} eventos automáticos`
        };
    }
}

export default EventoModel;