import api from './axios'

export const listarEventos = (filtros = {}) =>
  api.get('/eventos', { params: filtros })

export const obtenerEvento = (id) => api.get(`/eventos/${id}`)

export const crearEvento = (datos) => api.post('/eventos', datos)

export const actualizarEvento = (id, datos) => api.put(`/eventos/${id}`, datos)

// serie=true elimina toda la serie recurrente; por defecto solo este evento
export const eliminarEvento = (id, serie = false) =>
  api.delete(`/eventos/${id}`, { params: serie ? { serie: true } : {} })

export const cambiarEstadoEvento = (id, estado) =>
  api.patch(`/eventos/${id}/estado`, { estado })

export const actualizarEstadosAutomaticos = () =>
  api.put('/eventos/estados/actualizar')
