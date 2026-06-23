import api from './axios'

export const listarGastos = (filtros = {}) =>
  api.get('/gastos', { params: filtros })

export const obtenerGasto = (id) => api.get(`/gastos/${id}`)

export const crearGasto = (datos) => api.post('/gastos', datos)

export const actualizarGasto = (id, datos) => api.put(`/gastos/${id}`, datos)

export const eliminarGasto = (id) => api.delete(`/gastos/${id}`)

export const listarGastosPorTarea = (tareaId) => api.get(`/gastos/tarea/${tareaId}`)

export const obtenerResumenGastos = (fechaInicio, fechaFin) =>
  api.get('/gastos/resumen', { params: { fecha_inicio: fechaInicio, fecha_fin: fechaFin } })

export const obtenerGastosPorMetodoPago = (fechaInicio, fechaFin) =>
  api.get('/gastos/reportes/metodo-pago', { params: { fecha_inicio: fechaInicio, fecha_fin: fechaFin } })
