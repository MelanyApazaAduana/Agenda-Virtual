import PresupuestoModel from '../models/PresupuestoModel.js';

// Obtener (o crear en 0) el presupuesto único del usuario
export const obtenerMiPresupuesto = async (req, res) => {
    try {
        const presupuesto = await PresupuestoModel.asegurar(req.user.id);
        res.json({ success: true, data: presupuesto });
    } catch (error) {
        console.error('Error al obtener presupuesto:', error);
        res.status(500).json({ success: false, mensaje: 'Error al obtener el presupuesto', error: error.message });
    }
};

// Definir / actualizar el presupuesto del usuario
export const establecerMiPresupuesto = async (req, res) => {
    try {
        const { monto_total, limite_personalizado } = req.body;
        const presupuesto = await PresupuestoModel.establecer(req.user.id, { monto_total, limite_personalizado });
        res.json({ success: true, mensaje: 'Presupuesto actualizado', data: presupuesto });
    } catch (error) {
        console.error('Error al establecer presupuesto:', error);
        res.status(400).json({ success: false, mensaje: error.message || 'Error al establecer el presupuesto' });
    }
};
