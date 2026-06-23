import { defineStore } from 'pinia'
import { ref } from 'vue'

// Estado de UI global: notificaciones (toasts) y diálogo de confirmación,
// para reemplazar los alert()/confirm() nativos por modales propios.
export const useUiStore = defineStore('ui', () => {
  const notificaciones = ref([])
  const confirmacion = ref({ abierto: false, mensaje: '', titulo: '', resolver: null })
  let secuencia = 0

  const notificar = (mensaje, tipo = 'info') => {
    const id = ++secuencia
    notificaciones.value.push({ id, mensaje, tipo })
    setTimeout(() => {
      notificaciones.value = notificaciones.value.filter((n) => n.id !== id)
    }, 3500)
  }

  const exito = (mensaje) => notificar(mensaje, 'exito')
  const error = (mensaje) => notificar(mensaje, 'error')

  // Devuelve una promesa que resuelve a true/false
  const confirmar = (mensaje, titulo = 'Confirmar') =>
    new Promise((resolve) => {
      confirmacion.value = { abierto: true, mensaje, titulo, resolver: resolve }
    })

  const responderConfirmacion = (valor) => {
    if (confirmacion.value.resolver) confirmacion.value.resolver(valor)
    confirmacion.value = { abierto: false, mensaje: '', titulo: '', resolver: null }
  }

  return { notificaciones, confirmacion, notificar, exito, error, confirmar, responderConfirmacion }
})
