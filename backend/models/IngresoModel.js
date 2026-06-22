import promisePool from '../config/database.js';

class IngresoModel {
    // Crear nuevo ingreso
    static async crear(usuarioId, datos) {
        const { monto, fuente, categoria_id, fecha, detalle, evento_id } = datos;
        
        const montoFinal = Math.abs(parseFloat(monto));
        if (montoFinal <= 0) {
            throw new Error('El monto debe ser mayor a 0');
        }

        // Validar que el evento pertenezca al usuario si se especifica
        if (evento_id) {
            const [evento] = await promisePool.execute(
                'SELECT id FROM eventos WHERE id = ? AND usuario_id = ?',
                [evento_id, usuarioId]
            );
            if (evento.length === 0) {
                throw new Error('El evento especificado no existe o no pertenece al usuario');
            }
        }

        // Validar que la categoría pertenezca al usuario y sea de tipo ingreso o todos
        if (categoria_id) {
            const [categoria] = await promisePool.execute(
                'SELECT id FROM categorias WHERE id = ? AND usuario_id = ? AND tipo_aplicable IN (?, ?)',
                [categoria_id, usuarioId, 'ingreso', 'todos']
            );
            if (categoria.length === 0) {
                throw new Error('La categoría especificada no es válida para ingresos');
            }
        }
        
        const sql = `
            INSERT INTO ingresos (usuario_id, monto, fuente, categoria_id, fecha, detalle, evento_id)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const [result] = await promisePool.execute(sql, [
            usuarioId,
            montoFinal,
            fuente || null,
            categoria_id || null,
            fecha,
            detalle || null,
            evento_id || null
        ]);
        
        // Obtener el ingreso creado con los datos completos
        return await this.obtenerPorId(result.insertId, usuarioId);
    }
    
    // Obtener todos los ingresos de un usuario
    static async listarPorUsuario(usuarioId, filtros = {}) {
        let sql = `
            SELECT i.*, 
                   c.nombre as categoria_nombre, 
                   c.color_hex as categoria_color,
                   el.titulo as evento_titulo,
                   e.estado as evento_estado
            FROM ingresos i
            LEFT JOIN categorias c ON i.categoria_id = c.id
            LEFT JOIN eventos e ON i.evento_id = e.id
            LEFT JOIN elementos el ON e.elemento_id = el.id
            WHERE i.usuario_id = ?
        `;
        const params = [usuarioId];
        
        // Filtro por fecha (año-mes)
        if (filtros.anio && filtros.mes) {
            sql += ` AND YEAR(i.fecha) = ? AND MONTH(i.fecha) = ?`;
            params.push(filtros.anio, filtros.mes);
        }
        
        // Filtro por rango de fechas
        if (filtros.fecha_desde && filtros.fecha_hasta) {
            sql += ` AND i.fecha BETWEEN ? AND ?`;
            params.push(filtros.fecha_desde, filtros.fecha_hasta);
        }
        
        // Filtro por categoría
        if (filtros.categoria_id) {
            sql += ` AND i.categoria_id = ?`;
            params.push(filtros.categoria_id);
        }

        // Filtro por evento
        if (filtros.evento_id) {
            sql += ` AND i.evento_id = ?`;
            params.push(filtros.evento_id);
        }
        
        // Filtro por monto mínimo
        if (filtros.monto_minimo) {
            sql += ` AND i.monto >= ?`;
            params.push(filtros.monto_minimo);
        }

        // Filtro por monto máximo
        if (filtros.monto_maximo) {
            sql += ` AND i.monto <= ?`;
            params.push(filtros.monto_maximo);
        }
        
        sql += ` ORDER BY i.fecha DESC, i.creado_en DESC`;
        
        const [rows] = await promisePool.execute(sql, params);
        return rows;
    }
    
    // Obtener ingreso por ID
    static async obtenerPorId(id, usuarioId) {
        const sql = `
            SELECT i.*, 
                   c.nombre as categoria_nombre, 
                   c.color_hex as categoria_color,
                   el.titulo as evento_titulo,
                   e.estado as evento_estado
            FROM ingresos i
            LEFT JOIN categorias c ON i.categoria_id = c.id
            LEFT JOIN eventos e ON i.evento_id = e.id
            LEFT JOIN elementos el ON e.elemento_id = el.id
            WHERE i.id = ? AND i.usuario_id = ?
        `;
        const [rows] = await promisePool.execute(sql, [id, usuarioId]);
        return rows[0] || null;
    }
    
    // Actualizar ingreso
    static async actualizar(id, usuarioId, datos) {
        // Verificar que el ingreso existe y pertenece al usuario
        const ingresoExistente = await this.obtenerPorId(id, usuarioId);
        if (!ingresoExistente) {
            throw new Error('Ingreso no encontrado o no pertenece al usuario');
        }

        const { monto, fuente, categoria_id, fecha, detalle, evento_id } = datos;
        
        // Validar monto positivo si viene
        let montoFinal = null;
        if (monto !== undefined && monto !== null) {
            montoFinal = Math.abs(parseFloat(monto));
            if (montoFinal <= 0) {
                throw new Error('El monto debe ser mayor a 0');
            }
        }

        // Validar evento si viene
        if (evento_id !== undefined) {
            if (evento_id) {
                const [evento] = await promisePool.execute(
                    'SELECT id FROM eventos WHERE id = ? AND usuario_id = ?',
                    [evento_id, usuarioId]
                );
                if (evento.length === 0) {
                    throw new Error('El evento especificado no existe o no pertenece al usuario');
                }
            }
        }

        // Validar categoría si viene
        if (categoria_id !== undefined && categoria_id) {
            const [categoria] = await promisePool.execute(
                'SELECT id FROM categorias WHERE id = ? AND usuario_id = ? AND tipo_aplicable IN (?, ?)',
                [categoria_id, usuarioId, 'ingreso', 'todos']
            );
            if (categoria.length === 0) {
                throw new Error('La categoría especificada no es válida para ingresos');
            }
        }
        
        const sql = `
            UPDATE ingresos 
            SET monto = COALESCE(?, monto),
                fuente = ?,
                categoria_id = ?,
                fecha = COALESCE(?, fecha),
                detalle = ?,
                evento_id = ?
            WHERE id = ? AND usuario_id = ?
        `;
        
        const [result] = await promisePool.execute(sql, [
            montoFinal,
            fuente !== undefined ? (fuente || null) : undefined,
            categoria_id !== undefined ? (categoria_id || null) : undefined,
            fecha !== undefined ? fecha : undefined,
            detalle !== undefined ? (detalle || null) : undefined,
            evento_id !== undefined ? (evento_id || null) : undefined,
            id,
            usuarioId
        ]);
        
        if (result.affectedRows === 0) {
            throw new Error('No se pudo actualizar el ingreso');
        }

        // Retornar el ingreso actualizado
        return await this.obtenerPorId(id, usuarioId);
    }
    
    // Eliminar ingreso
    static async eliminar(id, usuarioId) {
        const sql = 'DELETE FROM ingresos WHERE id = ? AND usuario_id = ?';
        const [result] = await promisePool.execute(sql, [id, usuarioId]);
        return result.affectedRows > 0;
    }
    
    // Obtener resumen de ingresos por período
    static async obtenerResumen(usuarioId, anio, mes) {
        const sql = `
            SELECT 
                SUM(monto) as total,
                COUNT(*) as cantidad,
                AVG(monto) as promedio,
                MIN(monto) as minimo,
                MAX(monto) as maximo
            FROM ingresos
            WHERE usuario_id = ? 
                AND YEAR(fecha) = ? 
                AND MONTH(fecha) = ?
        `;
        const [rows] = await promisePool.execute(sql, [usuarioId, anio, mes]);
        return {
            total: parseFloat(rows[0].total) || 0,
            cantidad: rows[0].cantidad || 0,
            promedio: parseFloat(rows[0].promedio) || 0,
            minimo: parseFloat(rows[0].minimo) || 0,
            maximo: parseFloat(rows[0].maximo) || 0
        };
    }
    
    // Obtener ingresos agrupados por categoría
    static async obtenerPorCategoria(usuarioId, anio, mes) {
        const sql = `
            SELECT 
                c.id as categoria_id,
                c.nombre as categoria_nombre,
                c.color_hex,
                SUM(i.monto) as total,
                COUNT(i.id) as cantidad,
                AVG(i.monto) as promedio
            FROM ingresos i
            LEFT JOIN categorias c ON i.categoria_id = c.id
            WHERE i.usuario_id = ? 
                AND YEAR(i.fecha) = ? 
                AND MONTH(i.fecha) = ?
            GROUP BY c.id, c.nombre, c.color_hex
            ORDER BY total DESC
        `;
        const [rows] = await promisePool.execute(sql, [usuarioId, anio, mes]);
        return rows;
    }

    // Obtener ingresos agrupados por evento
    static async obtenerPorEvento(usuarioId, anio, mes) {
        const sql = `
            SELECT
                e.id as evento_id,
                el.titulo as evento_titulo,
                e.estado as evento_estado,
                COUNT(i.id) as cantidad_ingresos,
                SUM(i.monto) as total_ingresos,
                AVG(i.monto) as promedio_ingresos
            FROM ingresos i
            LEFT JOIN eventos e ON i.evento_id = e.id
            LEFT JOIN elementos el ON e.elemento_id = el.id
            WHERE i.usuario_id = ?
                AND YEAR(i.fecha) = ?
                AND MONTH(i.fecha) = ?
                AND i.evento_id IS NOT NULL
            GROUP BY e.id, el.titulo, e.estado
            ORDER BY total_ingresos DESC
        `;
        const [rows] = await promisePool.execute(sql, [usuarioId, anio, mes]);
        return rows;
    }
    
    // Verificar si existe ingreso (para validaciones)
    static async existe(id, usuarioId) {
        const sql = 'SELECT id FROM ingresos WHERE id = ? AND usuario_id = ?';
        const [rows] = await promisePool.execute(sql, [id, usuarioId]);
        return rows.length > 0;
    }
    
    // Obtener ingresos por rango de fechas (para reportes)
    static async obtenerPorRangoFechas(usuarioId, fechaDesde, fechaHasta) {
        const sql = `
            SELECT i.*,
                   c.nombre as categoria_nombre,
                   c.color_hex as categoria_color,
                   el.titulo as evento_titulo
            FROM ingresos i
            LEFT JOIN categorias c ON i.categoria_id = c.id
            LEFT JOIN eventos e ON i.evento_id = e.id
            LEFT JOIN elementos el ON e.elemento_id = el.id
            WHERE i.usuario_id = ? AND i.fecha BETWEEN ? AND ?
            ORDER BY i.fecha DESC
        `;
        const [rows] = await promisePool.execute(sql, [usuarioId, fechaDesde, fechaHasta]);
        return rows;
    }

    // Obtener total de ingresos por período
    static async obtenerTotal(usuarioId, fechaDesde, fechaHasta) {
        const sql = `
            SELECT COALESCE(SUM(monto), 0) as total
            FROM ingresos
            WHERE usuario_id = ? AND fecha BETWEEN ? AND ?
        `;
        const [rows] = await promisePool.execute(sql, [usuarioId, fechaDesde, fechaHasta]);
        return parseFloat(rows[0].total) || 0;
    }
}

export default IngresoModel;