import api from './axios'

// Presupuesto único por usuario
export const obtenerMiPresupuesto = () => api.get('/presupuestos/mi')

export const establecerMiPresupuesto = (datos) => api.put('/presupuestos/mi', datos)
