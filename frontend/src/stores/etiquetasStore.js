import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  listarEtiquetas as apiListar,
  crearEtiqueta as apiCrear,
  eliminarEtiqueta as apiEliminar
} from '../api/etiquetas'

// Lista de etiquetas del usuario, compartida entre el sidebar y los modales.
export const useEtiquetasStore = defineStore('etiquetas', () => {
  const etiquetas = ref([])
  const cargado = ref(false)

  const cargar = async (forzar = false) => {
    if (cargado.value && !forzar) return etiquetas.value
    try {
      const respuesta = await apiListar()
      etiquetas.value = respuesta.data.data || []
      cargado.value = true
    } catch (error) {
      console.error('Error al cargar etiquetas:', error)
      etiquetas.value = []
    }
    return etiquetas.value
  }

  const crear = async (datos) => {
    const respuesta = await apiCrear(datos)
    const nueva = respuesta.data.data
    etiquetas.value.push(nueva)
    return nueva
  }

  const eliminar = async (id) => {
    await apiEliminar(id)
    etiquetas.value = etiquetas.value.filter((e) => e.id !== id)
  }

  return { etiquetas, cargado, cargar, crear, eliminar }
})
