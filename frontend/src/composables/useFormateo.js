import dayjs from 'dayjs'
import 'dayjs/locale/es'

dayjs.locale('es')

export function useFormateo() {
  const formatoMoneda = (valor) => {
    return Number(valor).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  }

  const formatoFecha = (fecha, formato = 'DD MMM, YYYY') => {
    return dayjs(fecha).format(formato)
  }

  const formatoFechaHora = (fecha, formato = 'DD MMM, YYYY h:mm A') => {
    return dayjs(fecha).format(formato)
  }

  const desdeAhora = (fecha) => {
    return dayjs(fecha).fromNow()
  }

  const capitalizar = (texto) => {
    if (!texto) return ''
    return texto.charAt(0).toUpperCase() + texto.slice(1)
  }

  return {
    formatoMoneda,
    formatoFecha,
    formatoFechaHora,
    desdeAhora,
    capitalizar
  }
}
