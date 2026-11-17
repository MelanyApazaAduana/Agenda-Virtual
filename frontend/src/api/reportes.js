import api from './axios'

export const obtenerMovimientos = (fechaDesde, fechaHasta) =>
  api.get('/reportes/movimientos', { params: { fecha_desde: fechaDesde, fecha_hasta: fechaHasta } })
