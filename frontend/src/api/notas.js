import api from './axios'

export const listarNotas = (filtros = {}) =>
  api.get('/notas', { params: filtros })

export const obtenerNota = (id) => api.get(`/notas/${id}`)

export const crearNota = (datos) => api.post('/notas', datos)

export const actualizarNota = (id, datos) => api.put(`/notas/${id}`, datos)

export const eliminarNota = (id) => api.delete(`/notas/${id}`)

export const autoguardarNota = (datos) => api.post('/notas/autoguardar', datos)

export const listarNotasPorEvento = (eventoId) => api.get(`/notas/evento/${eventoId}`)

export const listarNotasPorTarea = (tareaId) => api.get(`/notas/tarea/${tareaId}`)
