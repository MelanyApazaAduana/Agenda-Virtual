import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useUsuarioStore } from '../stores/usuarioStore'

export function useAuth() {
  const store = useUsuarioStore()
  const { usuario, autenticado, cargando } = storeToRefs(store)

  const estaAutenticado = computed(() => autenticado.value)
  const usuarioActual = computed(() => usuario.value)
  const sesionCargando = computed(() => cargando.value)

  return {
    estaAutenticado,
    usuarioActual,
    sesionCargando,
    verificarSesion: store.verificarSesion,
    cerrarSesion: store.cerrarSesion
  }
}
