import PresupuestoModel from '../models/PresupuestoModel.js';

// Listar el historial de presupuestos del usuario
export const listarPresupuestos = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const presupuestos = await PresupuestoModel.listarPorUsuario(usuarioId);

        res.json({
            success: true,
            data: presupuestos,
            total: presupuestos.length
        });
    } catch (error) {
        console.error('Error al listar presupuestos:', error);
        res.status(500).json({
            success: false,
            mensaje: 'Error al listar los presupuestos',
            error: error.message
        });
    }
};

// Obtener el presupuesto vigente (último creado antes de la fecha, o de hoy)
export const obtenerPresupuestoVigente = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const { fecha } = req.query;

        const presupuesto = await PresupuestoModel.obtenerVigente(usuarioId, fecha || null);

        res.json({
            success: true,
            data: presupuesto
        });
    } catch (error) {
        console.error('Error al obtener presupuesto vigente:', error);
        res.status(500).json({
            success: false,
            mensaje: 'Error al obtener el presupuesto vigente',
            error: error.message
        });
    }
};

// Obtener un presupuesto por ID
export const obtenerPresupuesto = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const { id } = req.params;

        const presupuesto = await PresupuestoModel.obtenerPorId(id, usuarioId);
        if (!presupuesto) {
            return res.status(404).json({
                success: false,
                mensaje: 'Presupuesto no encontrado'
            });
        }

        res.json({
            success: true,
            data: presupuesto
        });
    } catch (error) {
        console.error('Error al obtener presupuesto:', error);
        res.status(500).json({
            success: false,
            mensaje: 'Error al obtener el presupuesto',
            error: error.message
        });
    }
};

// Crear un nuevo presupuesto
export const crearPresupuesto = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const { monto_total, limite_personalizado } = req.body;

        if (!monto_total || monto_total <= 0) {
            return res.status(400).json({
                success: false,
                mensaje: 'El monto total debe ser mayor a 0'
            });
        }

        const nuevoPresupuesto = await PresupuestoModel.crear(usuarioId, {
            monto_total,
            limite_personalizado
        });

        res.status(201).json({
            success: true,
            mensaje: 'Presupuesto creado exitosamente',
            data: nuevoPresupuesto
        });
    } catch (error) {
        console.error('Error al crear presupuesto:', error);
        res.status(400).json({
            success: false,
            mensaje: 'Error al crear el presupuesto',
            error: error.message
        });
    }
};

// Eliminar un presupuesto
export const eliminarPresupuesto = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const { id } = req.params;

        const eliminado = await PresupuestoModel.eliminar(id, usuarioId);
        if (!eliminado) {
            return res.status(404).json({
                success: false,
                mensaje: 'Presupuesto no encontrado'
            });
        }

        res.json({
            success: true,
            mensaje: 'Presupuesto eliminado exitosamente'
        });
    } catch (error) {
        console.error('Error al eliminar presupuesto:', error);
        res.status(500).json({
            success: false,
            mensaje: 'Error al eliminar el presupuesto',
            error: error.message
        });
    }
};
