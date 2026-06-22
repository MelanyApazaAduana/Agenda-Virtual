import promisePool from '../config/database.js';

class GastoModel {
    // Crear un nuevo gasto
    static async crear(usuarioId, datos) {
        const { tipo_entidad, entidad_id, monto, fecha, categoria_id, metodo_pago } = datos;

        // Validaciones básicas
        if (!tipo_entidad || !['evento', 'tarea', 'general'].includes(tipo_entidad)) {
            throw new Error('Tipo de entidad no válido. Debe ser: evento, tarea o general');
        }

        if (!monto || monto <= 0) {
            throw new Error('El monto debe ser mayor a 0');
        }

        // Validar que la entidad exista y pertenezca al usuario (solo si está asociada)
        if (entidad_id && tipo_entidad !== 'general') {
            await this.validarEntidad(usuarioId, tipo_entidad, entidad_id);
        }

        // Validar que la categoría pertenezca al usuario y sea de tipo gasto o todos
        if (categoria_id) {
            const [categoria] = await promisePool.execute(
                'SELECT id FROM categorias WHERE id = ? AND usuario_id = ? AND tipo_aplicable IN (?, ?)',
                [categoria_id, usuarioId, 'gasto', 'todos']
            );
            if (categoria.length === 0) {
                throw new Error('La categoría especificada no es válida para gastos');
            }
        }

        const montoFinal = Math.abs(parseFloat(monto));
        const fechaFinal = fecha || new Date();

        const sql = `
            INSERT INTO gastos (usuario_id, tipo_entidad, entidad_id, monto, fecha, categoria_id, metodo_pago)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const [result] = await promisePool.execute(sql, [
            usuarioId,
            tipo_entidad,
            entidad_id || null,
            montoFinal,
            fechaFinal,
            categoria_id || null,
            metodo_pago || null
        ]);

        return await this.obtenerPorId(result.insertId, usuarioId);
    }

    // Validar que la entidad exista y pertenezca al usuario
    static async validarEntidad(usuarioId, tipo_entidad, entidad_id) {
        let query;
        if (tipo_entidad === 'evento') {
            query = `
                SELECT e.id
                FROM eventos e
                INNER JOIN elementos el ON e.elemento_id = el.id
                WHERE e.id = ? AND el.usuario_id = ?
            `;
        } else if (tipo_entidad === 'tarea') {
            query = `
                SELECT t.id
                FROM tareas t
                INNER JOIN elementos el ON t.elemento_id = el.id
                WHERE t.id = ? AND el.usuario_id = ?
            `;
        }

        const [rows] = await promisePool.execute(query, [entidad_id, usuarioId]);
        if (rows.length === 0) {
            throw new Error(`El ${tipo_entidad} especificado no existe o no pertenece al usuario`);
        }
        return true;
    }

    // Obtener un gasto por ID
    static async obtenerPorId(id, usuarioId) {
        const sql = `
            SELECT g.*, 
                   c.nombre as categoria_nombre, 
                   c.color_hex as categoria_color,
                   CASE 
                       WHEN g.tipo_entidad = 'evento' THEN (SELECT el.titulo FROM elementos el INNER JOIN eventos e ON el.id = e.elemento_id WHERE e.id = g.entidad_id)
                       WHEN g.tipo_entidad = 'tarea' THEN (SELECT el.titulo FROM elementos el INNER JOIN tareas t ON el.id = t.elemento_id WHERE t.id = g.entidad_id)
                   END as entidad_titulo
            FROM gastos g
            LEFT JOIN categorias c ON g.categoria_id = c.id
            WHERE g.id = ? AND g.usuario_id = ?
        `;
        const [rows] = await promisePool.execute(sql, [id, usuarioId]);
        return rows[0] || null;
    }

    // Obtener todos los gastos de un usuario
    static async listarPorUsuario(usuarioId, filtros = {}) {
        let sql = `
            SELECT g.*, 
                   c.nombre as categoria_nombre, 
                   c.color_hex as categoria_color,
                   CASE 
                       WHEN g.tipo_entidad = 'evento' THEN (SELECT el.titulo FROM elementos el INNER JOIN eventos e ON el.id = e.elemento_id WHERE e.id = g.entidad_id)
                       WHEN g.tipo_entidad = 'tarea' THEN (SELECT el.titulo FROM elementos el INNER JOIN tareas t ON el.id = t.elemento_id WHERE t.id = g.entidad_id)
                   END as entidad_titulo
            FROM gastos g
            LEFT JOIN categorias c ON g.categoria_id = c.id
            WHERE g.usuario_id = ?
        `;
        const params = [usuarioId];

        // Filtro por tipo de entidad
        if (filtros.tipo_entidad && ['evento', 'tarea'].includes(filtros.tipo_entidad)) {
            sql += ` AND g.tipo_entidad = ?`;
            params.push(filtros.tipo_entidad);
        }

        // Filtro por entidad_id
        if (filtros.entidad_id) {
            sql += ` AND g.entidad_id = ?`;
            params.push(filtros.entidad_id);
        }

        // Filtro por categoría
        if (filtros.categoria_id) {
            sql += ` AND g.categoria_id = ?`;
            params.push(filtros.categoria_id);
        }

        // Filtro por fecha (desde)
        if (filtros.fecha_desde) {
            sql += ` AND DATE(g.fecha) >= ?`;
            params.push(filtros.fecha_desde);
        }

        // Filtro por fecha (hasta)
        if (filtros.fecha_hasta) {
            sql += ` AND DATE(g.fecha) <= ?`;
            params.push(filtros.fecha_hasta);
        }

        // Filtro por método de pago
        if (filtros.metodo_pago) {
            sql += ` AND g.metodo_pago = ?`;
            params.push(filtros.metodo_pago);
        }

        // Filtro por monto mínimo
        if (filtros.monto_minimo) {
            sql += ` AND g.monto >= ?`;
            params.push(filtros.monto_minimo);
        }

        // Filtro por monto máximo
        if (filtros.monto_maximo) {
            sql += ` AND g.monto <= ?`;
            params.push(filtros.monto_maximo);
        }

        // Ordenamiento
        const orden = filtros.orden || 'fecha';
        const direccion = filtros.direccion || 'DESC';
        const ordenesPermitidos = ['fecha', 'monto', 'creado_en', 'tipo_entidad'];
        const ordenFinal = ordenesPermitidos.includes(orden) ? orden : 'fecha';
        sql += ` ORDER BY g.${ordenFinal} ${direccion === 'ASC' ? 'ASC' : 'DESC'}`;

        // Límite
        if (filtros.limite) {
            sql += ` LIMIT ?`;
            params.push(parseInt(filtros.limite));
        }

        const [rows] = await promisePool.execute(sql, params);
        return rows;
    }

    // Actualizar un gasto
    static async actualizar(id, usuarioId, datos) {
        const gastoExistente = await this.obtenerPorId(id, usuarioId);
        if (!gastoExistente) {
            throw new Error('Gasto no encontrado o no pertenece al usuario');
        }

        const { monto, fecha, categoria_id, metodo_pago, tipo_entidad, entidad_id } = datos;

        // Validar monto si viene
        if (monto !== undefined) {
            if (monto <= 0) {
                throw new Error('El monto debe ser mayor a 0');
            }
        }

        // Validar categoría si viene
        if (categoria_id !== undefined && categoria_id) {
            const [categoria] = await promisePool.execute(
                'SELECT id FROM categorias WHERE id = ? AND usuario_id = ? AND tipo_aplicable IN (?, ?)',
                [categoria_id, usuarioId, 'gasto', 'todos']
            );
            if (categoria.length === 0) {
                throw new Error('La categoría especificada no es válida para gastos');
            }
        }

        // Validar entidad si viene
        if (entidad_id !== undefined && entidad_id) {
            const tipoFinal = tipo_entidad || gastoExistente.tipo_entidad;
            await this.validarEntidad(usuarioId, tipoFinal, entidad_id);
        }

        const montoFinal = monto !== undefined ? Math.abs(parseFloat(monto)) : undefined;

        const sql = `
            UPDATE gastos 
            SET monto = COALESCE(?, monto),
                fecha = COALESCE(?, fecha),
                categoria_id = ?,
                metodo_pago = ?,
                tipo_entidad = COALESCE(?, tipo_entidad),
                entidad_id = ?
            WHERE id = ? AND usuario_id = ?
        `;

        const [result] = await promisePool.execute(sql, [
            montoFinal,
            fecha || undefined,
            categoria_id !== undefined ? (categoria_id || null) : undefined,
            metodo_pago !== undefined ? (metodo_pago || null) : undefined,
            tipo_entidad || undefined,
            entidad_id !== undefined ? (entidad_id || null) : undefined,
            id,
            usuarioId
        ]);

        if (result.affectedRows === 0) {
            throw new Error('No se pudo actualizar el gasto');
        }

        return await this.obtenerPorId(id, usuarioId);
    }

    // Eliminar un gasto
    static async eliminar(id, usuarioId) {
        const sql = 'DELETE FROM gastos WHERE id = ? AND usuario_id = ?';
        const [result] = await promisePool.execute(sql, [id, usuarioId]);
        return result.affectedRows > 0;
    }

    // Obtener gastos por entidad (evento/tarea)
    static async listarPorEntidad(usuarioId, tipo_entidad, entidad_id) {
        return await this.listarPorUsuario(usuarioId, {
            tipo_entidad,
            entidad_id
        });
    }

    // Obtener gastos por rango de fechas
    static async listarPorRango(usuarioId, fechaInicio, fechaFin) {
        return await this.listarPorUsuario(usuarioId, {
            fecha_desde: fechaInicio,
            fecha_hasta: fechaFin
        });
    }

    // Obtener resumen de gastos por período
    static async obtenerResumen(usuarioId, fechaInicio, fechaFin) {
        const sql = `
            SELECT 
                COUNT(*) as total_gastos,
                SUM(monto) as monto_total,
                AVG(monto) as monto_promedio,
                MIN(monto) as monto_minimo,
                MAX(monto) as monto_maximo,
                COUNT(DISTINCT categoria_id) as categorias_utilizadas,
                COUNT(DISTINCT entidad_id) as entidades_con_gastos
            FROM gastos
            WHERE usuario_id = ? AND DATE(fecha) BETWEEN ? AND ?
        `;
        const [rows] = await promisePool.execute(sql, [usuarioId, fechaInicio, fechaFin]);
        return rows[0];
    }

    // Obtener gastos agrupados por categoría
    static async obtenerPorCategoria(usuarioId, fechaInicio, fechaFin) {
        const sql = `
            SELECT 
                c.id as categoria_id,
                c.nombre as categoria_nombre,
                c.color_hex as categoria_color,
                COUNT(g.id) as cantidad,
                SUM(g.monto) as monto_total,
                AVG(g.monto) as monto_promedio
            FROM gastos g
            LEFT JOIN categorias c ON g.categoria_id = c.id
            WHERE g.usuario_id = ? AND DATE(g.fecha) BETWEEN ? AND ?
            GROUP BY g.categoria_id
            ORDER BY monto_total DESC
        `;
        const [rows] = await promisePool.execute(sql, [usuarioId, fechaInicio, fechaFin]);
        return rows;
    }

    // Obtener gastos agrupados por tipo de entidad
    static async obtenerPorTipoEntidad(usuarioId, fechaInicio, fechaFin) {
        const sql = `
            SELECT 
                tipo_entidad,
                COUNT(*) as cantidad,
                SUM(monto) as monto_total,
                AVG(monto) as monto_promedio
            FROM gastos
            WHERE usuario_id = ? AND DATE(fecha) BETWEEN ? AND ?
            GROUP BY tipo_entidad
            ORDER BY monto_total DESC
        `;
        const [rows] = await promisePool.execute(sql, [usuarioId, fechaInicio, fechaFin]);
        return rows;
    }

    // Obtener gastos agrupados por método de pago
    static async obtenerPorMetodoPago(usuarioId, fechaInicio, fechaFin) {
        const sql = `
            SELECT 
                metodo_pago,
                COUNT(*) as cantidad,
                SUM(monto) as monto_total
            FROM gastos
            WHERE usuario_id = ? 
                AND DATE(fecha) BETWEEN ? AND ?
                AND metodo_pago IS NOT NULL
            GROUP BY metodo_pago
            ORDER BY monto_total DESC
        `;
        const [rows] = await promisePool.execute(sql, [usuarioId, fechaInicio, fechaFin]);
        return rows;
    }

    // Obtener total de gastos en un período
    static async obtenerTotal(usuarioId, fechaInicio, fechaFin) {
        const sql = `
            SELECT COALESCE(SUM(monto), 0) as total
            FROM gastos
            WHERE usuario_id = ? AND DATE(fecha) BETWEEN ? AND ?
        `;
        const [rows] = await promisePool.execute(sql, [usuarioId, fechaInicio, fechaFin]);
        return parseFloat(rows[0].total) || 0;
    }

    // Obtener gastos por mes
    static async obtenerPorMes(usuarioId, año, mes) {
        const fechaInicio = `${año}-${String(mes).padStart(2, '0')}-01`;
        const fechaFin = `${año}-${String(mes).padStart(2, '0')}-${new Date(año, mes, 0).getDate()}`;
        return await this.listarPorUsuario(usuarioId, {
            fecha_desde: fechaInicio,
            fecha_hasta: fechaFin
        });
    }

    // Verificar si existe un gasto
    static async existe(id, usuarioId) {
        const sql = 'SELECT id FROM gastos WHERE id = ? AND usuario_id = ?';
        const [rows] = await promisePool.execute(sql, [id, usuarioId]);
        return rows.length > 0;
    }

    // Contar gastos por categoría
    static async contarPorCategoria(usuarioId, fechaInicio, fechaFin) {
        const sql = `
            SELECT 
                c.id as categoria_id,
                c.nombre as categoria_nombre,
                COUNT(g.id) as cantidad
            FROM gastos g
            LEFT JOIN categorias c ON g.categoria_id = c.id
            WHERE g.usuario_id = ? AND DATE(g.fecha) BETWEEN ? AND ?
            GROUP BY g.categoria_id
            ORDER BY cantidad DESC
        `;
        const [rows] = await promisePool.execute(sql, [usuarioId, fechaInicio, fechaFin]);
        return rows;
    }
}

export default GastoModel;