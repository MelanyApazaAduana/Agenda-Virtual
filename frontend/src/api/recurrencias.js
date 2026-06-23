import api from './axios'

export const listarRecurrencias = () => api.get('/recurrencias')

export const obtenerRecurrencia = (id) => api.get(`/recurrencias/${id}`)

export const crearRecurrencia = (datos) => api.post('/recurrencias', datos)

export const eliminarRecurrencia = (id) => api.delete(`/recurrencias/${id}`)
