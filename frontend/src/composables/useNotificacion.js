import { ref } from 'vue'

const notificacion = ref(null)
let timeout = null

export function useNotificacion() {
  const mostrar = (mensaje, tipo = 'exito', duracion = 3000) => {
    if (timeout) clearTimeout(timeout)

    notificacion.value = { mensaje, tipo }

    timeout = setTimeout(() => {
      notificacion.value = null
    }, duracion)
  }

  const ocultar = () => {
    notificacion.value = null
    if (timeout) clearTimeout(timeout)
  }

  return {
    notificacion,
    mostrarExito: (msg) => mostrar(msg, 'exito'),
    mostrarError: (msg) => mostrar(msg, 'error'),
    mostrarAdvertencia: (msg) => mostrar(msg, 'advertencia'),
    ocultar
  }
}
