import api from './axios'

export const listarEtiquetas = () => api.get('/etiquetas')

export const obtenerEtiqueta = (id) => api.get(`/etiquetas/${id}`)

export const crearEtiqueta = (datos) => api.post('/etiquetas', datos)

export const eliminarEtiqueta = (id) => api.delete(`/etiquetas/${id}`)

export const crearEtiquetasPredeterminadas = () =>
  api.post('/etiquetas/predeterminadas/crear')

// Vínculos etiqueta <-> entidad (evento | tarea | ingreso | gasto)
export const vincularEtiqueta = (etiqueta_id, entidad_tipo, entidad_id) =>
  api.post('/etiquetas/vincular', { etiqueta_id, entidad_tipo, entidad_id })

export const desvincularEtiqueta = (etiqueta_id, entidad_tipo, entidad_id) =>
  api.post('/etiquetas/desvincular', { etiqueta_id, entidad_tipo, entidad_id })

export const listarEtiquetasDeEntidad = (entidad_tipo, entidad_id) =>
  api.get(`/etiquetas/entidad/${entidad_tipo}/${entidad_id}`)

export const listarEntidadesPorEtiqueta = (etiquetaId) =>
  api.get(`/etiquetas/${etiquetaId}/entidades`)
