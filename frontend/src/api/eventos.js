import api from './axios'

export const listarEventos = (filtros = {}) =>
  api.get('/eventos', { params: filtros })

export const obtenerEvento = (id) => api.get(`/eventos/${id}`)

export const crearEvento = (datos) => api.post('/eventos', datos)

export const actualizarEvento = (id, datos) => api.put(`/eventos/${id}`, datos)

export const eliminarEvento = (id) => api.delete(`/eventos/${id}`)

export const cambiarEstadoEvento = (id, estado) =>
  api.patch(`/eventos/${id}/estado`, { estado })

export const actualizarEstadosAutomaticos = () =>
  api.put('/eventos/estados/actualizar')
