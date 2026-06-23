import GastoModel from '../models/GastoModel.js';

// Listar todos los gastos del usuario
export const listarGastos = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const {
            tarea_id,
            presupuesto_id,
            fecha_desde,
            fecha_hasta,
            metodo_pago,
            monto_minimo,
            monto_maximo,
            orden,
            direccion,
            limite
        } = req.query;

        const filtros = {
            tarea_id: tarea_id ? parseInt(tarea_id) : null,
            presupuesto_id: presupuesto_id ? parseInt(presupuesto_id) : null,
            fecha_desde: fecha_desde || null,
            fecha_hasta: fecha_hasta || null,
            metodo_pago: metodo_pago || null,
            monto_minimo: monto_minimo ? parseFloat(monto_minimo) : null,
            monto_maximo: monto_maximo ? parseFloat(monto_maximo) : null,
            orden: orden || 'fecha',
            direccion: direccion || 'DESC',
            limite: limite ? parseInt(limite) : null
        };

        const gastos = await GastoModel.listarPorUsuario(usuarioId, filtros);

        res.json({
            success: true,
            data: gastos,
            total: gastos.length,
            filtros
        });
    } catch (error) {
        console.error('Error al listar gastos:', error);
        res.status(500).json({
            success: false,
            mensaje: 'Error al listar los gastos',
            error: error.message
        });
    }
};

// Obtener un gasto por ID
export const obtenerGasto = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const { id } = req.params;

        const gasto = await GastoModel.obtenerPorId(id, usuarioId);
        if (!gasto) {
            return res.status(404).json({
                success: false,
                mensaje: 'Gasto no encontrado'
            });
        }

        res.json({
            success: true,
            data: gasto
        });
    } catch (error) {
        console.error('Error al obtener gasto:', error);
        res.status(500).json({
            success: false,
            mensaje: 'Error al obtener el gasto',
            error: error.message
        });
    }
};

// Crear un nuevo gasto
export const crearGasto = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const { presupuesto_id, tarea_id, monto, fecha, metodo_pago } = req.body;

        if (!monto || monto <= 0) {
            return res.status(400).json({
                success: false,
                mensaje: 'El monto debe ser mayor a 0'
            });
        }

        const nuevoGasto = await GastoModel.crear(usuarioId, {
            presupuesto_id,
            tarea_id,
            monto,
            fecha,
            metodo_pago
        });

        res.status(201).json({
            success: true,
            mensaje: 'Gasto creado exitosamente',
            data: nuevoGasto
        });
    } catch (error) {
        console.error('Error al crear gasto:', error);
        res.status(400).json({
            success: false,
            mensaje: 'Error al crear el gasto',
            error: error.message
        });
    }
};

// Actualizar un gasto
export const actualizarGasto = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const { id } = req.params;
        const { monto, fecha, metodo_pago, presupuesto_id, tarea_id } = req.body;

        const gastoExistente = await GastoModel.obtenerPorId(id, usuarioId);
        if (!gastoExistente) {
            return res.status(404).json({
                success: false,
                mensaje: 'Gasto no encontrado'
            });
        }

        if (monto !== undefined && monto <= 0) {
            return res.status(400).json({
                success: false,
                mensaje: 'El monto debe ser mayor a 0'
            });
        }

        const gastoActualizado = await GastoModel.actualizar(id, usuarioId, {
            monto,
            fecha,
            metodo_pago,
            presupuesto_id,
            tarea_id
        });

        res.json({
            success: true,
            mensaje: 'Gasto actualizado exitosamente',
            data: gastoActualizado
        });
    } catch (error) {
        console.error('Error al actualizar gasto:', error);
        res.status(400).json({
            success: false,
            mensaje: 'Error al actualizar el gasto',
            error: error.message
        });
    }
};

// Eliminar un gasto
export const eliminarGasto = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const { id } = req.params;

        const eliminado = await GastoModel.eliminar(id, usuarioId);
        if (!eliminado) {
            return res.status(404).json({
                success: false,
                mensaje: 'Gasto no encontrado'
            });
        }

        res.json({
            success: true,
            mensaje: 'Gasto eliminado exitosamente'
        });
    } catch (error) {
        console.error('Error al eliminar gasto:', error);
        res.status(500).json({
            success: false,
            mensaje: 'Error al eliminar el gasto',
            error: error.message
        });
    }
};

// Obtener gastos asociados a una tarea
export const listarGastosPorTarea = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const { tarea_id } = req.params;

        if (!tarea_id) {
            return res.status(400).json({
                success: false,
                mensaje: 'El ID de la tarea es requerido'
            });
        }

        const gastos = await GastoModel.listarPorTarea(usuarioId, parseInt(tarea_id));

        res.json({
            success: true,
            data: gastos,
            total: gastos.length,
            tarea_id
        });
    } catch (error) {
        console.error('Error al listar gastos por tarea:', error);
        res.status(500).json({
            success: false,
            mensaje: 'Error al listar los gastos de la tarea',
            error: error.message
        });
    }
};

// Obtener gastos por rango de fechas
export const listarGastosPorRango = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const { fecha_inicio, fecha_fin } = req.query;

        if (!fecha_inicio || !fecha_fin) {
            return res.status(400).json({
                success: false,
                mensaje: 'Se requieren fecha_inicio y fecha_fin'
            });
        }

        const gastos = await GastoModel.listarPorRango(usuarioId, fecha_inicio, fecha_fin);

        res.json({
            success: true,
            data: gastos,
            total: gastos.length,
            fecha_inicio,
            fecha_fin
        });
    } catch (error) {
        console.error('Error al listar gastos por rango:', error);
        res.status(500).json({
            success: false,
            mensaje: 'Error al listar los gastos por rango',
            error: error.message
        });
    }
};

// Obtener gastos por mes
export const listarGastosPorMes = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const { anio, mes } = req.params;

        if (!anio || !mes) {
            return res.status(400).json({
                success: false,
                mensaje: 'Se requieren año y mes'
            });
        }

        const gastos = await GastoModel.obtenerPorMes(usuarioId, parseInt(anio), parseInt(mes));

        const total = await GastoModel.obtenerTotal(
            usuarioId,
            `${anio}-${String(mes).padStart(2, '0')}-01`,
            `${anio}-${String(mes).padStart(2, '0')}-${new Date(anio, mes, 0).getDate()}`
        );

        res.json({
            success: true,
            data: {
                gastos,
                total,
                mes: parseInt(mes),
                anio: parseInt(anio)
            }
        });
    } catch (error) {
        console.error('Error al listar gastos por mes:', error);
        res.status(500).json({
            success: false,
            mensaje: 'Error al listar los gastos del mes',
            error: error.message
        });
    }
};

// Obtener resumen de gastos
export const obtenerResumenGastos = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const { fecha_inicio, fecha_fin } = req.query;

        if (!fecha_inicio || !fecha_fin) {
            return res.status(400).json({
                success: false,
                mensaje: 'Se requieren fecha_inicio y fecha_fin'
            });
        }

        const resumen = await GastoModel.obtenerResumen(usuarioId, fecha_inicio, fecha_fin);
        const total = await GastoModel.obtenerTotal(usuarioId, fecha_inicio, fecha_fin);
        const porMetodoPago = await GastoModel.obtenerPorMetodoPago(usuarioId, fecha_inicio, fecha_fin);

        res.json({
            success: true,
            data: {
                resumen,
                total,
                por_metodo_pago: porMetodoPago
            }
        });
    } catch (error) {
        console.error('Error al obtener resumen de gastos:', error);
        res.status(500).json({
            success: false,
            mensaje: 'Error al obtener el resumen de gastos',
            error: error.message
        });
    }
};

// Obtener gastos agrupados por método de pago
export const obtenerGastosPorMetodoPago = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const { fecha_inicio, fecha_fin } = req.query;

        if (!fecha_inicio || !fecha_fin) {
            return res.status(400).json({
                success: false,
                mensaje: 'Se requieren fecha_inicio y fecha_fin'
            });
        }

        const porMetodoPago = await GastoModel.obtenerPorMetodoPago(usuarioId, fecha_inicio, fecha_fin);

        res.json({
            success: true,
            data: porMetodoPago
        });
    } catch (error) {
        console.error('Error al obtener gastos por método de pago:', error);
        res.status(500).json({
            success: false,
            mensaje: 'Error al obtener los gastos por método de pago',
            error: error.message
        });
    }
};

// Verificar si existe un gasto
export const verificarGastoExistente = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const { id } = req.params;

        const existe = await GastoModel.existe(id, usuarioId);

        res.json({
            success: true,
            data: {
                existe,
                id: parseInt(id)
            }
        });
    } catch (error) {
        console.error('Error al verificar gasto:', error);
        res.status(500).json({
            success: false,
            mensaje: 'Error al verificar el gasto',
            error: error.message
        });
    }
};
