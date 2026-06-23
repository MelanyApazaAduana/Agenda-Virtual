import { ref } from 'vue'
import dayjs from 'dayjs'
import { listarCalendario } from '@/api/calendario.js'
import { crearEvento, actualizarEvento, eliminarEvento } from '@/api/eventos.js'
import { crearTarea, actualizarTarea, eliminarTarea } from '@/api/tareas.js'
import { crearNota, actualizarNota, eliminarNota } from '@/api/notas.js'
import { crearRecordatorio } from '@/api/recordatorios.js'
import { crearRecurrencia } from '@/api/recurrencias.js'
import { sincronizarEtiquetas } from '@/utils/etiquetasSync'
import { confirmarEliminacion } from '@/utils/eliminacion'
import { useUiStore } from '@/stores/uiStore'

// Crea la regla de recurrencia (si la hay) y devuelve su id, o null.
const resolverRecurrenciaId = async (recurrencia) => {
  if (!recurrencia) return null
  try {
    const { data } = await crearRecurrencia(recurrencia)
    return data.data.id
  } catch (e) {
    return null
  }
}

// Lógica compartida por las vistas de calendario (mes / semana / día):
// carga de datos por rango, estado del modal y orquestación de
// crear / editar / eliminar incluyendo etiquetas y recordatorios.
export function useAgenda() {
  const ui = useUiStore()
  const eventos = ref([])
  const tareas = ref([])
  const notas = ref([])
  const cargando = ref(true)
  const modal = ref({ tipo: null, modo: 'crear', valores: null, fechaPredeterminada: null })

  let rango = { inicio: null, fin: null }

  const cargar = async (inicio, fin) => {
    rango = { inicio, fin }
    cargando.value = true
    try {
      const { data } = await listarCalendario(inicio, fin)
      eventos.value = data.data?.eventos || []
      tareas.value = data.data?.tareas || []
      notas.value = data.data?.notas || []
    } catch (error) {
      console.error('Error al cargar la agenda:', error)
      eventos.value = []; tareas.value = []; notas.value = []
    } finally {
      cargando.value = false
    }
  }

  const recargar = async () => {
    if (rango.inicio) await cargar(rango.inicio, rango.fin)
  }

  const abrirCrear = (tipo, fecha = null) => {
    modal.value = { tipo, modo: 'crear', valores: null, fechaPredeterminada: fecha }
  }
  const editar = (tipo, item) => {
    modal.value = { tipo, modo: 'editar', valores: item, fechaPredeterminada: null }
  }
  const cerrarModal = () => {
    modal.value = { tipo: null, modo: 'crear', valores: null, fechaPredeterminada: null }
  }

  const crearRecordatoriosEvento = async (eventoId, fechaInicio, recordatoriosMin = []) => {
    for (const min of recordatoriosMin) {
      const envio = dayjs(fechaInicio).subtract(min, 'minute')
      if (envio.isAfter(dayjs())) {
        try {
          await crearRecordatorio({
            evento_id: eventoId,
            fecha_envio: envio.format('YYYY-MM-DD HH:mm:ss'),
            mensaje: `Recordatorio: ${min} min antes`
          })
        } catch (e) { /* fecha inválida: se ignora */ }
      }
    }
  }

  const guardarEvento = async (payload) => {
    try {
      const cuerpo = {
        titulo: payload.titulo, descripcion: payload.descripcion,
        fecha_inicio: payload.fecha_inicio, fecha_fin: payload.fecha_fin,
        ubicacion: payload.ubicacion, color_hex: payload.color_hex
      }
      let id
      if (modal.value.modo === 'editar') {
        id = modal.value.valores.id
        if (payload.estado) cuerpo.estado = payload.estado
        await actualizarEvento(id, cuerpo)
      } else {
        cuerpo.recurrencia_id = await resolverRecurrenciaId(payload.recurrencia)
        const { data } = await crearEvento(cuerpo)
        id = data.data.id
        await crearRecordatoriosEvento(id, payload.fecha_inicio, payload.recordatoriosMin)
      }
      await sincronizarEtiquetas('evento', id, payload.etiquetas, payload.etiquetasPrevias)
      cerrarModal(); await recargar()
    } catch (error) {
      ui.error(error.response?.data?.message || 'Error al guardar el evento')
    }
  }

  const guardarTarea = async (payload) => {
    try {
      const cuerpo = {
        titulo: payload.titulo, descripcion: payload.descripcion,
        prioridad: payload.prioridad, fecha_limite: payload.fecha_limite, color_hex: payload.color_hex
      }
      let id
      if (modal.value.modo === 'editar') {
        id = modal.value.valores.id
        if (payload.estado) cuerpo.estado = payload.estado
        await actualizarTarea(id, cuerpo)
      } else {
        cuerpo.recurrencia_id = await resolverRecurrenciaId(payload.recurrencia)
        const { data } = await crearTarea(cuerpo)
        id = data.data.id
      }
      await sincronizarEtiquetas('tarea', id, payload.etiquetas, payload.etiquetasPrevias)
      cerrarModal(); await recargar()
    } catch (error) {
      ui.error(error.response?.data?.message || 'Error al guardar la tarea')
    }
  }

  const guardarNota = async (payload) => {
    try {
      if (modal.value.modo === 'editar') {
        await actualizarNota(modal.value.valores.id, payload)
      } else {
        await crearNota(payload)
      }
      cerrarModal(); await recargar()
    } catch (error) {
      ui.error(error.response?.data?.message || 'Error al guardar la nota')
    }
  }

  const eliminarEventoItem = async (id) => {
    const evento = eventos.value.find((e) => e.id === id)
    const decision = await confirmarEliminacion(ui, !!evento?.recurrencia_id, 'este evento', 'la serie de eventos')
    if (!decision.confirmado) return
    try { await eliminarEvento(id, decision.serie); cerrarModal(); await recargar() }
    catch (e) { ui.error('No se pudo eliminar el evento') }
  }
  const eliminarTareaItem = async (id) => {
    const tarea = tareas.value.find((t) => t.id === id)
    const decision = await confirmarEliminacion(ui, !!tarea?.recurrencia_id, 'esta tarea', 'la serie de tareas')
    if (!decision.confirmado) return
    try { await eliminarTarea(id, decision.serie); cerrarModal(); await recargar() }
    catch (e) { ui.error('No se pudo eliminar la tarea') }
  }
  const eliminarNotaItem = async (id) => {
    if (!(await ui.confirmar('¿Eliminar esta nota?'))) return
    try { await eliminarNota(id); cerrarModal(); await recargar() }
    catch (e) { ui.error('No se pudo eliminar la nota') }
  }

  return {
    eventos, tareas, notas, cargando, modal,
    cargar, recargar,
    abrirCrear, editar, cerrarModal,
    guardarEvento, guardarTarea, guardarNota,
    eliminarEventoItem, eliminarTareaItem, eliminarNotaItem
  }
}
