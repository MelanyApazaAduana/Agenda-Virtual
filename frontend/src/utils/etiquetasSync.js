import {
  listarEtiquetasDeEntidad,
  vincularEtiqueta,
  desvincularEtiqueta
} from '@/api/etiquetas'

// Devuelve los IDs de etiquetas vinculadas a una entidad (para precargar al editar).
export const obtenerIdsEtiquetas = async (entidadTipo, entidadId) => {
  try {
    const respuesta = await listarEtiquetasDeEntidad(entidadTipo, entidadId)
    return (respuesta.data.data || []).map((e) => e.id)
  } catch (error) {
    console.error('Error al obtener etiquetas de la entidad:', error)
    return []
  }
}

// Sincroniza los vínculos: agrega los nuevos y quita los que se deseleccionaron.
export const sincronizarEtiquetas = async (entidadTipo, entidadId, idsNuevos = [], idsPrevios = []) => {
  const agregar = idsNuevos.filter((id) => !idsPrevios.includes(id))
  const quitar = idsPrevios.filter((id) => !idsNuevos.includes(id))

  await Promise.all([
    ...agregar.map((id) => vincularEtiqueta(id, entidadTipo, entidadId).catch(() => {})),
    ...quitar.map((id) => desvincularEtiqueta(id, entidadTipo, entidadId).catch(() => {}))
  ])
}
