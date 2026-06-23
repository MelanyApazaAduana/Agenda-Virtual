import api from './axios'

export const listarRecordatorios = (filtros = {}) =>
  api.get('/recordatorios', { params: filtros })

export const obtenerRecordatorio = (id) => api.get(`/recordatorios/${id}`)

export const crearRecordatorio = (datos) => api.post('/recordatorios', datos)

export const actualizarRecordatorio = (id, datos) => api.put(`/recordatorios/${id}`, datos)

export const eliminarRecordatorio = (id) => api.delete(`/recordatorios/${id}`)

export const marcarRecordatorioLeido = (id) => api.patch(`/recordatorios/${id}/leido`)

export const posponerRecordatorio = (id, nuevaFecha) =>
  api.patch(`/recordatorios/${id}/posponer`, { nueva_fecha: nuevaFecha })

export const cancelarRecordatorio = (id) => api.patch(`/recordatorios/${id}/cancelar`)

export const listarRecordatoriosPorEvento = (eventoId) =>
  api.get(`/recordatorios/evento/${eventoId}`)

export const listarRecordatoriosPorTarea = (tareaId) =>
  api.get(`/recordatorios/tarea/${tareaId}`)
