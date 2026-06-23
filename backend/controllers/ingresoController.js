import IngresoModel from '../models/IngresoModel.js';

// Obtener todos los ingresos del usuario
export const listarIngresos = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const { anio, mes, fecha_desde, fecha_hasta, presupuesto_id, monto_minimo, monto_maximo } = req.query;

        const filtros = {
            anio: anio ? parseInt(anio) : null,
            mes: mes ? parseInt(mes) : null,
            fecha_desde: fecha_desde || null,
            fecha_hasta: fecha_hasta || null,
            presupuesto_id: presupuesto_id ? parseInt(presupuesto_id) : null,
            monto_minimo: monto_minimo ? parseFloat(monto_minimo) : null,
            monto_maximo: monto_maximo ? parseFloat(monto_maximo) : null
        };

        const ingresos = await IngresoModel.listarPorUsuario(usuarioId, filtros);

        res.json({
            success: true,
            data: ingresos,
            total: ingresos.length
        });
    } catch (error) {
        console.error('Error al listar ingresos:', error);
        res.status(500).json({
            success: false,
            mensaje: 'Error al listar los ingresos',
            error: error.message
        });
    }
};

// Obtener un ingreso por ID
export const obtenerIngreso = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const { id } = req.params;

        const ingreso = await IngresoModel.obtenerPorId(id, usuarioId);
        if (!ingreso) {
            return res.status(404).json({
                success: false,
                mensaje: 'Ingreso no encontrado'
            });
        }

        res.json({
            success: true,
            data: ingreso
        });
    } catch (error) {
        console.error('Error al obtener ingreso:', error);
        res.status(500).json({
            success: false,
            mensaje: 'Error al obtener el ingreso',
            error: error.message
        });
    }
};

// Crear un nuevo ingreso
export const crearIngreso = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const { monto, fuente, presupuesto_id, fecha, detalle } = req.body;

        if (!monto || monto <= 0) {
            return res.status(400).json({
                success: false,
                mensaje: 'El monto debe ser mayor a 0'
            });
        }

        if (!fecha) {
            return res.status(400).json({
                success: false,
                mensaje: 'La fecha es requerida'
            });
        }

        const nuevoIngreso = await IngresoModel.crear(usuarioId, {
            monto,
            fuente,
            presupuesto_id,
            fecha,
            detalle
        });

        res.status(201).json({
            success: true,
            mensaje: 'Ingreso creado exitosamente',
            data: nuevoIngreso
        });
    } catch (error) {
        console.error('Error al crear ingreso:', error);
        res.status(400).json({
            success: false,
            mensaje: 'Error al crear el ingreso',
            error: error.message
        });
    }
};

// Actualizar un ingreso
export const actualizarIngreso = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const { id } = req.params;
        const datos = req.body;

        const ingresoActualizado = await IngresoModel.actualizar(id, usuarioId, datos);

        res.json({
            success: true,
            mensaje: 'Ingreso actualizado exitosamente',
            data: ingresoActualizado
        });
    } catch (error) {
        console.error('Error al actualizar ingreso:', error);
        res.status(400).json({
            success: false,
            mensaje: 'Error al actualizar el ingreso',
            error: error.message
        });
    }
};

// Eliminar un ingreso
export const eliminarIngreso = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const { id } = req.params;

        const eliminado = await IngresoModel.eliminar(id, usuarioId);
        if (!eliminado) {
            return res.status(404).json({
                success: false,
                mensaje: 'Ingreso no encontrado'
            });
        }

        res.json({
            success: true,
            mensaje: 'Ingreso eliminado exitosamente'
        });
    } catch (error) {
        console.error('Error al eliminar ingreso:', error);
        res.status(500).json({
            success: false,
            mensaje: 'Error al eliminar el ingreso',
            error: error.message
        });
    }
};

// Obtener resumen de ingresos por mes
export const obtenerResumenIngresos = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const { anio, mes } = req.query;

        if (!anio || !mes) {
            return res.status(400).json({
                success: false,
                mensaje: 'Se requieren año y mes'
            });
        }

        const resumen = await IngresoModel.obtenerResumen(usuarioId, parseInt(anio), parseInt(mes));

        res.json({
            success: true,
            data: { resumen }
        });
    } catch (error) {
        console.error('Error al obtener resumen de ingresos:', error);
        res.status(500).json({
            success: false,
            mensaje: 'Error al obtener el resumen de ingresos',
            error: error.message
        });
    }
};

// Obtener ingresos por rango de fechas
export const obtenerIngresosPorRango = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const { fecha_desde, fecha_hasta } = req.query;

        if (!fecha_desde || !fecha_hasta) {
            return res.status(400).json({
                success: false,
                mensaje: 'Se requieren fecha_desde y fecha_hasta'
            });
        }

        const ingresos = await IngresoModel.obtenerPorRangoFechas(usuarioId, fecha_desde, fecha_hasta);
        const total = await IngresoModel.obtenerTotal(usuarioId, fecha_desde, fecha_hasta);

        res.json({
            success: true,
            data: {
                ingresos,
                total,
                fecha_desde,
                fecha_hasta
            }
        });
    } catch (error) {
        console.error('Error al obtener ingresos por rango:', error);
        res.status(500).json({
            success: false,
            mensaje: 'Error al obtener los ingresos por rango',
            error: error.message
        });
    }
};
