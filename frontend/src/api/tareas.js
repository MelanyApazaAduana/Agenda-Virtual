import api from './axios'

export const listarTareas = (filtros = {}) =>
  api.get('/tareas', { params: filtros })

export const listarTareasVencidas = () => api.get('/tareas/vencidas')

export const listarTareasPorEstado = (estado) => api.get(`/tareas/estado/${estado}`)

export const obtenerTarea = (id) => api.get(`/tareas/${id}`)

export const crearTarea = (datos) => api.post('/tareas', datos)

export const actualizarTarea = (id, datos) => api.put(`/tareas/${id}`, datos)

export const eliminarTarea = (id) => api.delete(`/tareas/${id}`)

export const cambiarEstadoTarea = (id, estado) =>
  api.patch(`/tareas/${id}/estado`, { estado })

export const cambiarPrioridadTarea = (id, prioridad) =>
  api.patch(`/tareas/${id}/prioridad`, { prioridad })
