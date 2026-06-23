import api from './axios'

export const obtenerResumenProductividad = (dias = 7) =>
  api.get('/productividad/resumen', { params: { dias } })
