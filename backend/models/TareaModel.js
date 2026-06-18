import promisePool from '../config/database.js';

class TareaModel {
    // Crear una nueva tarea
    static async CrearNuevaTarea({ 
        elemento_id, 
        descripcion, 
        fecha_limite, 
        fecha_completado, 
        estado, 
        prioridad, 
        instancia_id,
        ingreso_id,
        presupuesto_asignado 
    }) {
        const sql = `
            INSERT INTO tareas (
                elemento_id, 
                descripcion, 
                fecha_limite, 
                fecha_completado, 
                estado, 
                prioridad, 
                instancia_id,
                ingreso_id,
                presupuesto_asignado
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const [result] = await promisePool.execute(sql, [
            elemento_id,
            descripcion || null,
            fecha_limite || null,
            fecha_completado || null,
            estado || 'por_hacer',
            prioridad || 'media',
            instancia_id || null,
            ingreso_id || null,
            presupuesto_asignado || null
        ]);
        
        return {
            id: result.insertId,
            elemento_id,
            descripcion: descripcion || null,
            fecha_limite: fecha_limite || null,
            fecha_completado: fecha_completado || null,
            estado: estado || 'por_hacer',
            prioridad: prioridad || 'media',
            instancia_id: instancia_id || null,
            ingreso_id: ingreso_id || null,
            presupuesto_asignado: presupuesto_asignado || null,
            creado_en: new Date()
        };
    }

    // Obtener una tarea por ID 
    static async obtenerPorId(id, usuarioId) {
        const sql = `
            SELECT t.*, 
                   el.titulo, el.categoria_id, el.usuario_id,
                   c.nombre as categoria_nombre, c.color_hex as categoria_color,
                   i.monto as ingreso_monto, i.fuente as ingreso_fuente
            FROM tareas t
            INNER JOIN elementos el ON t.elemento_id = el.id
            LEFT JOIN categorias c ON el.categoria_id = c.id
            LEFT JOIN ingresos i ON t.ingreso_id = i.id
            WHERE t.id = ? AND el.usuario_id = ?
        `;
        const [rows] = await promisePool.execute(sql, [id, usuarioId]);
        return rows[0] || null;
    }

    // Listar todas las tareas de un usuario 
    static async listarPorUsuario(usuarioId, filtros = {}) {
        let sql = `
            SELECT t.*, 
                   el.titulo, el.categoria_id,
                   c.nombre as categoria_nombre, c.color_hex as categoria_color,
                   i.monto as ingreso_monto, i.fuente as ingreso_fuente
            FROM tareas t
            INNER JOIN elementos el ON t.elemento_id = el.id
            LEFT JOIN categorias c ON el.categoria_id = c.id
            LEFT JOIN ingresos i ON t.ingreso_id = i.id
            WHERE el.usuario_id = ?
        `;
        const params = [usuarioId];
        
        // Filtro por estado
        if (filtros.estado) {
            sql += ` AND t.estado = ?`;
            params.push(filtros.estado);
        }
        
        // Filtro por prioridad
        if (filtros.prioridad) {
            sql += ` AND t.prioridad = ?`;
            params.push(filtros.prioridad);
        }
        
        // Filtro por categoría
        if (filtros.categoria_id) {
            sql += ` AND el.categoria_id = ?`;
            params.push(filtros.categoria_id);
        }
        
        // Filtro por rango de fecha límite
        if (filtros.fecha_limite_desde && filtros.fecha_limite_hasta) {
            sql += ` AND t.fecha_limite BETWEEN ? AND ?`;
            params.push(filtros.fecha_limite_desde, filtros.fecha_limite_hasta);
        } else if (filtros.fecha_limite_hasta) {
            sql += ` AND t.fecha_limite <= ?`;
            params.push(filtros.fecha_limite_hasta);
        } else if (filtros.fecha_limite_desde) {
            sql += ` AND t.fecha_limite >= ?`;
            params.push(filtros.fecha_limite_desde);
        }
        
        // Ordenar por fecha límite (más cercanas primero)
        sql += ` ORDER BY ISNULL(t.fecha_limite) ASC, t.fecha_limite ASC, t.creado_en DESC`;
        
        const [rows] = await promisePool.execute(sql, params);
        return rows;
    }

    // Listar tareas por estado 
    static async listarPorEstado(usuarioId, estado) {
        const estadosPermitidos = ['por_hacer', 'completada', 'cancelada'];
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
    static async actualizar(id, usuarioId, { 
        descripcion, 
        fecha_limite, 
        fecha_completado, 
        estado, 
        prioridad, 
        instancia_id,
        ingreso_id,
        presupuesto_asignado 
    }) {
        // Primero verificar que la tarea pertenece al usuario
        const tareaActual = await this.obtenerPorId(id, usuarioId);
        if (!tareaActual) {
            return false;
        }
        
        const sql = `
            UPDATE tareas 
            SET descripcion = ?, 
                fecha_limite = ?, 
                fecha_completado = ?, 
                estado = ?, 
                prioridad = ?, 
                instancia_id = ?,
                ingreso_id = ?,
                presupuesto_asignado = ?
            WHERE id = ?
        `;
        const [result] = await promisePool.execute(sql, [
            descripcion !== undefined ? descripcion : tareaActual.descripcion,
            fecha_limite !== undefined ? fecha_limite : tareaActual.fecha_limite,
            fecha_completado !== undefined ? fecha_completado : tareaActual.fecha_completado,
            estado || tareaActual.estado,
            prioridad || tareaActual.prioridad,
            instancia_id !== undefined ? instancia_id : tareaActual.instancia_id,
            ingreso_id !== undefined ? ingreso_id : tareaActual.ingreso_id,
            presupuesto_asignado !== undefined ? presupuesto_asignado : tareaActual.presupuesto_asignado,
            id
        ]);
        return result.affectedRows > 0;
    }

    // Eliminar tarea 
    static async eliminar(id, usuarioId) {
        // Verificar que la tarea pertenece al usuario
        const tarea = await this.obtenerPorId(id, usuarioId);
        if (!tarea) {
            return false;
        }
        
        const sql = 'DELETE FROM tareas WHERE id = ?';
        const [result] = await promisePool.execute(sql, [id]);
        return result.affectedRows > 0;
    }

    // Eliminar tarea y su elemento base
    static async eliminarCompleto(id, usuarioId) {
        const tarea = await this.obtenerPorId(id, usuarioId);
        if (!tarea) {
            return false;
        }
        
        await this.eliminar(id, usuarioId);
        
        const sql = 'DELETE FROM elementos WHERE id = ? AND usuario_id = ?';
        const [result] = await promisePool.execute(sql, [tarea.elemento_id, usuarioId]);
        return result.affectedRows > 0;
    }

    // Cambiar estado de una tarea
    static async cambiarEstado(id, usuarioId, nuevoEstado) {
        const estadosPermitidos = ['por_hacer', 'completada', 'cancelada'];
        if (!estadosPermitidos.includes(nuevoEstado)) {
            return false;
        }
        
        let fechaCompletado = null;
        if (nuevoEstado === 'completada') {
            fechaCompletado = new Date();
        }
        
        const sql = 'UPDATE tareas SET estado = ?, fecha_completado = ? WHERE id = ?';
        const [result] = await promisePool.execute(sql, [nuevoEstado, fechaCompletado, id]);
        return result.affectedRows > 0;
    }

    // Cambiar prioridad de una tarea
    static async cambiarPrioridad(id, usuarioId, nuevaPrioridad) {
        const prioridadesPermitidas = ['baja', 'media', 'alta', 'urgente'];
        if (!prioridadesPermitidas.includes(nuevaPrioridad)) {
            return false;
        }
        
        const sql = 'UPDATE tareas SET prioridad = ? WHERE id = ?';
        const [result] = await promisePool.execute(sql, [nuevaPrioridad, id]);
        return result.affectedRows > 0;
    }

    // Obtener tareas vencidas (fecha_limite pasada y estado no completada/cancelada)
    static async listarVencidas(usuarioId) {
        const ahora = new Date();
        const sql = `
            SELECT t.*, 
                   el.titulo, el.categoria_id,
                   c.nombre as categoria_nombre
            FROM tareas t
            INNER JOIN elementos el ON t.elemento_id = el.id
            LEFT JOIN categorias c ON el.categoria_id = c.id
            WHERE el.usuario_id = ? 
                AND t.fecha_limite < ?
                AND t.estado NOT IN ('completada', 'cancelada')
            ORDER BY t.fecha_limite ASC
        `;
        const [rows] = await promisePool.execute(sql, [usuarioId, ahora]);
        return rows;
    }

    // Crear una lista de tareas
    static async crearConElementoExistente({ 
        elemento_id,
        descripcion, 
        fecha_limite, 
        fecha_completado, 
        estado, 
        prioridad, 
        instancia_id,
        ingreso_id,
        presupuesto_asignado 
    }) {
        // Primero verificar que el elemento existe y pertenece al usuario
        const sqlVerificar = `
            SELECT id, usuario_id FROM elementos WHERE id = ?
        `;
        const [rows] = await promisePool.execute(sqlVerificar, [elemento_id]);
        
        if (rows.length === 0) {
            throw new Error('El elemento especificado no existe');
        }
        
        // Insertar la tarea usando el elemento_id existente
        const sql = `
            INSERT INTO tareas (
                elemento_id, 
                descripcion, 
                fecha_limite, 
                fecha_completado, 
                estado, 
                prioridad, 
                instancia_id,
                ingreso_id,
                presupuesto_asignado
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const [result] = await promisePool.execute(sql, [
            elemento_id,
            descripcion || null,
            fecha_limite || null,
            fecha_completado || null,
            estado || 'por_hacer',
            prioridad || 'media',
            instancia_id || null,
            ingreso_id || null,
            presupuesto_asignado || null
        ]);
        
        return {
            id: result.insertId,
            elemento_id,
            descripcion: descripcion || null,
            fecha_limite: fecha_limite || null,
            fecha_completado: fecha_completado || null,
            estado: estado || 'por_hacer',
            prioridad: prioridad || 'media',
            instancia_id: instancia_id || null,
            ingreso_id: ingreso_id || null,
            presupuesto_asignado: presupuesto_asignado || null,
            creado_en: new Date()
        };
    }

    // Listar lista de tareas
    static async listarPorElementoId(elementoId, usuarioId) {
        const sql = `
            SELECT t.*, 
                el.titulo, el.categoria_id, el.usuario_id,
                c.nombre as categoria_nombre, c.color_hex as categoria_color,
                i.monto as ingreso_monto, i.fuente as ingreso_fuente
            FROM tareas t
            INNER JOIN elementos el ON t.elemento_id = el.id
            LEFT JOIN categorias c ON el.categoria_id = c.id
            LEFT JOIN ingresos i ON t.ingreso_id = i.id
            WHERE t.elemento_id = ? AND el.usuario_id = ?
            ORDER BY t.fecha_limite ASC NULLS LAST, t.creado_en DESC
        `;
        const [rows] = await promisePool.execute(sql, [elementoId, usuarioId]);
        return rows;
    }
}

export default TareaModel;