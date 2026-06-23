import promisePool from '../config/database.js';
import PresupuestoModel from './PresupuestoModel.js';

class IngresoModel {
    // Crear nuevo ingreso (siempre ligado al presupuesto único del usuario)
    static async crear(usuarioId, datos) {
        const { monto, fuente, fecha, detalle } = datos;

        const montoFinal = Math.abs(parseFloat(monto));
        if (montoFinal <= 0) {
            throw new Error('El monto debe ser mayor a 0');
        }

        // Ligado automáticamente al presupuesto del usuario
        const presupuesto = await PresupuestoModel.asegurar(usuarioId);

        const sql = `
            INSERT INTO ingresos (usuario_id, presupuesto_id, monto, fuente, fecha, detalle)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const [result] = await promisePool.execute(sql, [
            usuarioId,
            presupuesto.id,
            montoFinal,
            fuente || null,
            fecha,
            detalle || null
        ]);

        return await this.obtenerPorId(result.insertId, usuarioId);
    }

    // Obtener todos los ingresos de un usuario
    static async listarPorUsuario(usuarioId, filtros = {}) {
        let sql = `SELECT * FROM ingresos WHERE usuario_id = ?`;
        const params = [usuarioId];

        // Filtro por fecha (año-mes)
        if (filtros.anio && filtros.mes) {
            sql += ` AND YEAR(fecha) = ? AND MONTH(fecha) = ?`;
            params.push(filtros.anio, filtros.mes);
        }

        // Filtro por rango de fechas
        if (filtros.fecha_desde && filtros.fecha_hasta) {
            sql += ` AND fecha BETWEEN ? AND ?`;
            params.push(filtros.fecha_desde, filtros.fecha_hasta);
        }

        // Filtro por presupuesto
        if (filtros.presupuesto_id) {
            sql += ` AND presupuesto_id = ?`;
            params.push(filtros.presupuesto_id);
        }

        // Filtro por monto mínimo
        if (filtros.monto_minimo) {
            sql += ` AND monto >= ?`;
            params.push(filtros.monto_minimo);
        }

        // Filtro por monto máximo
        if (filtros.monto_maximo) {
            sql += ` AND monto <= ?`;
            params.push(filtros.monto_maximo);
        }

        sql += ` ORDER BY fecha DESC, creado_en DESC`;

        const [rows] = await promisePool.execute(sql, params);
        return rows;
    }

    // Obtener ingreso por ID
    static async obtenerPorId(id, usuarioId) {
        const sql = `SELECT * FROM ingresos WHERE id = ? AND usuario_id = ?`;
        const [rows] = await promisePool.execute(sql, [id, usuarioId]);
        return rows[0] || null;
    }

    // Actualizar ingreso
    static async actualizar(id, usuarioId, datos) {
        const ingresoExistente = await this.obtenerPorId(id, usuarioId);
        if (!ingresoExistente) {
            throw new Error('Ingreso no encontrado o no pertenece al usuario');
        }

        const { monto, fuente, fecha, detalle } = datos;

        let montoFinal = null;
        if (monto !== undefined && monto !== null) {
            montoFinal = Math.abs(parseFloat(monto));
            if (montoFinal <= 0) {
                throw new Error('El monto debe ser mayor a 0');
            }
        }

        // El presupuesto queda ligado al del usuario; no se cambia aquí.
        const sql = `
            UPDATE ingresos
            SET monto = COALESCE(?, monto),
                fuente = ?,
                fecha = COALESCE(?, fecha),
                detalle = ?
            WHERE id = ? AND usuario_id = ?
        `;

        const [result] = await promisePool.execute(sql, [
            montoFinal,
            fuente !== undefined ? (fuente || null) : ingresoExistente.fuente,
            fecha !== undefined ? fecha : null,
            detalle !== undefined ? (detalle || null) : ingresoExistente.detalle,
            id,
            usuarioId
        ]);

        if (result.affectedRows === 0) {
            throw new Error('No se pudo actualizar el ingreso');
        }

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

    // Verificar si existe ingreso
    static async existe(id, usuarioId) {
        const sql = 'SELECT id FROM ingresos WHERE id = ? AND usuario_id = ?';
        const [rows] = await promisePool.execute(sql, [id, usuarioId]);
        return rows.length > 0;
    }

    // Obtener ingresos por rango de fechas (para reportes)
    static async obtenerPorRangoFechas(usuarioId, fechaDesde, fechaHasta) {
        const sql = `
            SELECT * FROM ingresos
            WHERE usuario_id = ? AND fecha BETWEEN ? AND ?
            ORDER BY fecha DESC
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
