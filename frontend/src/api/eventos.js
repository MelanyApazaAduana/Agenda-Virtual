import api from './axios'

export const listarEventos = (filtros = {}) =>
  api.get('/eventos', { params: filtros })

export const obtenerEvento = (id) => api.get(`/eventos/${id}`)

export const crearEvento = (datos) => api.post('/eventos', datos)

export const actualizarEvento = (id, datos) => api.put(`/eventos/${id}`, datos)

export const eliminarEventoCompleto = (id) =>
  api.delete(`/eventos/${id}/completo`)

export const cambiarEstadoEvento = (id, estado) =>
  api.patch(`/eventos/${id}/estado`, { estado })

export const actualizarEstadosAutomaticos = () =>
  api.put('/eventos/estados/actualizar')

export const actualizarEstadosGlobales = () =>
  api.put('/eventos/estados/actualizar/global')
