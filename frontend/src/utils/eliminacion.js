// Decide el alcance de una eliminación. Si el ítem pertenece a una serie
// recurrente, ofrece elegir entre borrar solo este o toda la serie; si no,
// pide una confirmación simple.
//
// ui: store de UI (con confirmar() y elegir()).
// tieneRecurrencia: boolean.
// nombreItem: ej. 'este evento' / 'esta tarea'.
// nombreSerie: ej. 'la serie de eventos'.
// Devuelve { confirmado: boolean, serie: boolean }.
export const confirmarEliminacion = async (ui, tieneRecurrencia, nombreItem, nombreSerie) => {
  if (!tieneRecurrencia) {
    const ok = await ui.confirmar(`¿Eliminar ${nombreItem}?`)
    return { confirmado: ok, serie: false }
  }

  const opcion = await ui.elegir(
    `${nombreItem.charAt(0).toUpperCase() + nombreItem.slice(1)} forma parte de una serie recurrente. ¿Qué deseas eliminar?`,
    [
      { valor: 'una', label: 'Eliminar solo este', estilo: 'normal' },
      { valor: 'serie', label: `Eliminar ${nombreSerie} completa`, estilo: 'peligro' }
    ],
    'Eliminar recurrencia'
  )

  if (!opcion) return { confirmado: false, serie: false }
  return { confirmado: true, serie: opcion === 'serie' }
}
