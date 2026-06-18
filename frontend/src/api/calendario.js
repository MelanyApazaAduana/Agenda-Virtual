import api from './axios'

export const listarCalendario = (fechaInicio, fechaFin) =>
  api.get('/calendario', { params: { fecha_inicio: fechaInicio, fecha_fin: fechaFin } })
