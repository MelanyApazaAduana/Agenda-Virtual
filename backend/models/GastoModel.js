import promisePool from '../config/database.js';

class GastoModel {
    // Validar que la tarea pertenezca al usuario
    static async validarTarea(usuarioId, tareaId) {
        const [rows] = await promisePool.execute(
            'SELECT id FROM tareas WHERE id = ? AND usuario_id = ?',
            [tareaId, usuarioId]
        );
        if (rows.length === 0) {
            throw new Error('La tarea especificada no existe o no pertenece al usuario');
        }
        return true;
    }

    // Validar que el presupuesto pertenezca al usuario
    static async validarPresupuesto(usuarioId, presupuestoId) {
        const [rows] = await promisePool.execute(
            'SELECT id FROM presupuestos WHERE id = ? AND usuario_id = ?',
            [presupuestoId, usuarioId]
        );
        if (rows.length === 0) {
            throw new Error('El presupuesto especificado no existe o no pertenece al usuario');
        }
        return true;
    }

    // Crear un nuevo gasto
    static async crear(usuarioId, datos) {
        const { presupuesto_id, tarea_id, monto, fecha, metodo_pago } = datos;

        if (!monto || monto <= 0) {
            throw new Error('El monto debe ser mayor a 0');
        }

        if (tarea_id) {
            await this.validarTarea(usuarioId, tarea_id);
        }
        if (presupuesto_id) {
            await this.validarPresupuesto(usuarioId, presupuesto_id);
        }

        const montoFinal = Math.abs(parseFloat(monto));
        const fechaFinal = fecha || new Date();

        const sql = `
            INSERT INTO gastos (usuario_id, presupuesto_id, tarea_id, monto, fecha, metodo_pago)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const [result] = await promisePool.execute(sql, [
            usuarioId,
            presupuesto_id || null,
            tarea_id || null,
            montoFinal,
            fechaFinal,
            metodo_pago || null
        ]);

        return await this.obtenerPorId(result.insertId, usuarioId);
    }

    // Obtener un gasto por ID (con el título de la tarea asociada, si la hay)
    static async obtenerPorId(id, usuarioId) {
        const sql = `
            SELECT g.*, t.titulo as tarea_titulo
            FROM gastos g
            LEFT JOIN tareas t ON g.tarea_id = t.id
            WHERE g.id = ? AND g.usuario_id = ?
        `;
        const [rows] = await promisePool.execute(sql, [id, usuarioId]);
        return rows[0] || null;
    }

    // Obtener todos los gastos de un usuario
    static async listarPorUsuario(usuarioId, filtros = {}) {
        let sql = `
            SELECT g.*, t.titulo as tarea_titulo
            FROM gastos g
            LEFT JOIN tareas t ON g.tarea_id = t.id
            WHERE g.usuario_id = ?
        `;
        const params = [usuarioId];

        // Filtro por tarea
        if (filtros.tarea_id) {
            sql += ` AND g.tarea_id = ?`;
            params.push(filtros.tarea_id);
        }

        // Filtro por presupuesto
        if (filtros.presupuesto_id) {
            sql += ` AND g.presupuesto_id = ?`;
            params.push(filtros.presupuesto_id);
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
        const direccion = filtros.direccion === 'ASC' ? 'ASC' : 'DESC';
        const ordenesPermitidos = ['fecha', 'monto', 'creado_en'];
        const ordenFinal = ordenesPermitidos.includes(filtros.orden) ? filtros.orden : 'fecha';
        sql += ` ORDER BY g.${ordenFinal} ${direccion}`;

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

        const { monto, fecha, metodo_pago, presupuesto_id, tarea_id } = datos;

        if (monto !== undefined && monto <= 0) {
            throw new Error('El monto debe ser mayor a 0');
        }

        if (tarea_id !== undefined && tarea_id) {
            await this.validarTarea(usuarioId, tarea_id);
        }
        if (presupuesto_id !== undefined && presupuesto_id) {
            await this.validarPresupuesto(usuarioId, presupuesto_id);
        }

        const montoFinal = monto !== undefined ? Math.abs(parseFloat(monto)) : null;

        const sql = `
            UPDATE gastos
            SET monto = COALESCE(?, monto),
                fecha = COALESCE(?, fecha),
                metodo_pago = ?,
                presupuesto_id = ?,
                tarea_id = ?
            WHERE id = ? AND usuario_id = ?
        `;

        const [result] = await promisePool.execute(sql, [
            montoFinal,
            fecha !== undefined ? fecha : null,
            metodo_pago !== undefined ? (metodo_pago || null) : gastoExistente.metodo_pago,
            presupuesto_id !== undefined ? (presupuesto_id || null) : gastoExistente.presupuesto_id,
            tarea_id !== undefined ? (tarea_id || null) : gastoExistente.tarea_id,
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

    // Obtener gastos asociados a una tarea
    static async listarPorTarea(usuarioId, tareaId) {
        return await this.listarPorUsuario(usuarioId, { tarea_id: tareaId });
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
                COUNT(DISTINCT tarea_id) as tareas_con_gastos
            FROM gastos
            WHERE usuario_id = ? AND DATE(fecha) BETWEEN ? AND ?
        `;
        const [rows] = await promisePool.execute(sql, [usuarioId, fechaInicio, fechaFin]);
        return rows[0];
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
    static async obtenerPorMes(usuarioId, anio, mes) {
        const fechaInicio = `${anio}-${String(mes).padStart(2, '0')}-01`;
        const fechaFin = `${anio}-${String(mes).padStart(2, '0')}-${new Date(anio, mes, 0).getDate()}`;
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
}

export default GastoModel;
