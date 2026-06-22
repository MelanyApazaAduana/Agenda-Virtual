import api from './axios'

export const listarIngresos = (filtros = {}) =>
  api.get('/ingresos', { params: filtros })

export const obtenerIngreso = (id) => api.get(`/ingresos/${id}`)

export const crearIngreso = (datos) => api.post('/ingresos', datos)

export const actualizarIngreso = (id, datos) => api.put(`/ingresos/${id}`, datos)

export const eliminarIngreso = (id) => api.delete(`/ingresos/${id}`)

export const obtenerResumenIngresos = (anio, mes) =>
  api.get('/ingresos/resumen', { params: { anio, mes } })

export const obtenerIngresosPorRango = (fechaDesde, fechaHasta) =>
  api.get('/ingresos/rango', { params: { fecha_desde: fechaDesde, fecha_hasta: fechaHasta } })
