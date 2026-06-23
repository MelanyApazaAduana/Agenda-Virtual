import api from './axios'

export const listarPresupuestos = () => api.get('/presupuestos')

export const obtenerPresupuestoVigente = (fecha = null) =>
  api.get('/presupuestos/vigente', { params: fecha ? { fecha } : {} })

export const obtenerPresupuesto = (id) => api.get(`/presupuestos/${id}`)

export const crearPresupuesto = (datos) => api.post('/presupuestos', datos)

export const eliminarPresupuesto = (id) => api.delete(`/presupuestos/${id}`)
