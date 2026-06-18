import { ref } from 'vue'

export function usePeticion() {
  const cargando = ref(false)
  const error = ref(null)

  const ejecutar = async (fn, ...args) => {
    cargando.value = true
    error.value = null

    try {
      const resultado = await fn(...args)
      return resultado
    } catch (e) {
      const mensaje = e.response?.data?.message || e.response?.data?.mensaje || e.message || 'Error inesperado'
      error.value = mensaje
      throw e
    } finally {
      cargando.value = false
    }
  }

  return {
    cargando,
    error,
    ejecutar
  }
}
