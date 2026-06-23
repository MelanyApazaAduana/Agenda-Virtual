<template>
  <div class="h-full flex flex-col">
    <div v-if="!cargando" class="flex-1 flex flex-col overflow-hidden">
      <div class="flex items-center gap-2 px-4 py-2 border-b border-gray-100 bg-white">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 text-gray-400"><path stroke-linecap="round" stroke-linejoin="round" d="M6 13.5V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m-6-9V3.75m0 3.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 9.75V10.5" /></svg>
        <span class="text-xs font-semibold text-gray-500">Etiqueta:</span>
        <select v-model="etiquetaFiltro" class="text-xs border border-gray-200 rounded-lg px-2 py-1 outline-none focus:ring-1 focus:ring-black cursor-pointer">
          <option :value="null">Todas</option>
          <option v-for="et in etiquetasStore.etiquetas" :key="et.id" :value="et.id">{{ et.nombre }}</option>
        </select>
        <span v-if="etiquetaFiltro" class="text-[11px] text-gray-400">(las notas se ocultan al filtrar)</span>
      </div>
      <div class="grid grid-cols-7 border-b border-gray-200 bg-white">
        <div v-for="dia in diasSemana" :key="dia" class="py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-widest border-r border-gray-200 last:border-0">
          {{ dia }}
        </div>
      </div>
      <div :class="diaSeleccionado !== null ? 'grid grid-cols-7 grid-rows-6 bg-gray-200 gap-px overflow-y-auto' : 'flex-1 grid grid-cols-7 grid-rows-6 bg-gray-200 gap-px'">
        <div
          v-for="(item, idx) in diasCalendario" :key="idx"
          @click="seleccionarDia(item)"
          class="bg-white p-2 flex flex-col hover:bg-gray-50 transition min-h-[90px] cursor-pointer relative"
          :class="{ 'ring-2 ring-black ring-inset': item.esSeleccionado && !item.fueraMes }"
        >
          <span
            class="text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full mb-1"
            :class="item.esHoy ? 'bg-black text-white' : item.esSeleccionado && !item.esHoy ? 'bg-gray-200 text-gray-900' : item.fueraMes ? 'text-gray-300' : 'text-gray-700'"
          >{{ item.dia }}</span>

          <div v-if="!item.fueraMes" class="flex-1 space-y-1 overflow-y-auto no-scrollbar">
            <div v-for="evento in eventosDelDia(item.fecha)" :key="'e-' + evento.id + '-' + evento.fecha_inicio"
                 @click.stop="editar('evento', evento)"
                 class="text-[10px] px-1.5 py-0.5 rounded font-medium truncate flex items-center gap-1 hover:opacity-80"
                 :style="{ backgroundColor: colorSuave(evento.color_hex), color: evento.color_hex || '#374151' }">
              <span class="w-1.5 h-1.5 rounded-full shrink-0" :style="{ backgroundColor: evento.color_hex || '#3B82F6' }"></span>
              {{ truncar(evento.titulo, 12) }}
            </div>
            <div v-for="tarea in tareasDelDia(item.fecha)" :key="'t-' + tarea.id + '-' + tarea.fecha_limite"
                 @click.stop="editar('tarea', tarea)"
                 class="text-[10px] px-1.5 py-0.5 rounded font-medium truncate flex items-center gap-1 hover:opacity-80"
                 :style="{ backgroundColor: colorSuave(tarea.color_hex), color: tarea.color_hex || '#374151' }">
              <span class="w-1.5 h-1.5 rounded-sm shrink-0" :style="{ backgroundColor: tarea.color_hex || '#10B981' }"></span>
              {{ truncar(tarea.titulo, 13) }}
            </div>
            <div v-for="nota in notasDelDia(item.fecha)" :key="'n-' + nota.id"
                 @click.stop="editar('nota', nota)"
                 class="text-[10px] px-1.5 py-0.5 rounded font-medium truncate hover:opacity-80"
                 :style="{ backgroundColor: colorSuave(nota.color_hex), color: nota.color_hex || '#92400e' }">
              {{ truncar(nota.titulo, 15) }}
            </div>
          </div>
        </div>
      </div>

      <!-- Panel detalle del día -->
      <div v-if="diaSeleccionado !== null" class="border-t border-gray-200 bg-white shrink-0 max-h-[280px] overflow-y-auto">
        <div class="px-6 py-3 flex items-center justify-between border-b border-gray-100 sticky top-0 bg-white">
          <h3 class="text-sm font-bold text-gray-900">
            {{ tituloDiaSeleccionado }}
            <span v-if="itemsDiaSeleccionado.length" class="text-gray-400 font-normal ml-1">· {{ itemsDiaSeleccionado.length }} registros</span>
          </h3>
          <div class="flex items-center gap-2">
            <button @click="crearNuevo('evento')" class="px-3 py-1.5 text-xs font-semibold bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition">+ Evento</button>
            <button @click="crearNuevo('tarea')" class="px-3 py-1.5 text-xs font-semibold bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition">+ Tarea</button>
            <button @click="crearNuevo('nota')" class="px-3 py-1.5 text-xs font-semibold bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition">+ Nota</button>
            <button @click="cerrarDetalleDia" class="text-gray-400 hover:text-gray-600 transition ml-1">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div class="px-6 py-3 space-y-4">
          <div v-if="!itemsDiaSeleccionado.length" class="text-center py-6 text-gray-400">
            <p class="text-sm">No hay registros para este día</p>
          </div>

          <div v-if="eventosDiaSeleccionado.length">
            <h4 class="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">Eventos ({{ eventosDiaSeleccionado.length }})</h4>
            <div class="space-y-1.5">
              <div v-for="item in eventosDiaSeleccionado" :key="item.id"
                   @click="editar('evento', item)"
                   class="rounded-lg px-4 py-2.5 border-l-4 flex items-start justify-between gap-2 cursor-pointer hover:bg-gray-50"
                   :style="{ borderLeftColor: item.color_hex || '#3B82F6' }">
                <div class="min-w-0">
                  <p class="text-sm font-semibold text-gray-900 truncate">{{ item.titulo }}</p>
                  <p class="text-xs text-gray-500 mt-0.5">{{ formatoHora(item.fecha_inicio) }} - {{ formatoHora(item.fecha_fin) }}</p>
                </div>
                <span class="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider" :class="badgeEstado(item.estado)">
                  {{ etiquetaEstado(item.estado) }}
                </span>
              </div>
            </div>
          </div>

          <div v-if="tareasDiaSeleccionado.length">
            <h4 class="text-xs font-bold text-green-600 uppercase tracking-wider mb-2">Tareas ({{ tareasDiaSeleccionado.length }})</h4>
            <div class="space-y-1.5">
              <div v-for="item in tareasDiaSeleccionado" :key="item.id"
                   @click="editar('tarea', item)"
                   class="rounded-lg px-4 py-2.5 border-l-4 cursor-pointer hover:bg-gray-50"
                   :style="{ borderLeftColor: item.color_hex || '#10B981' }">
                <p class="text-sm font-semibold text-gray-900">{{ item.titulo }}</p>
                <p class="text-xs text-gray-500 mt-0.5 capitalize">{{ item.estado.replace('_', ' ') }} · {{ item.prioridad }}</p>
              </div>
            </div>
          </div>

          <div v-if="notasDiaSeleccionado.length">
            <h4 class="text-xs font-bold text-yellow-600 uppercase tracking-wider mb-2">Notas ({{ notasDiaSeleccionado.length }})</h4>
            <div class="space-y-1.5">
              <div v-for="item in notasDiaSeleccionado" :key="item.id"
                   @click="editar('nota', item)"
                   class="rounded-lg px-4 py-2.5 border-l-4 cursor-pointer hover:bg-gray-50"
                   :style="{ borderLeftColor: item.color_hex || '#F59E0B' }">
                <p class="text-sm font-semibold text-gray-900">{{ item.titulo }}</p>
                <p v-if="item.contenido" class="text-xs text-gray-500 mt-0.5 line-clamp-2">{{ item.contenido }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="flex-1 flex items-center justify-center bg-gray-50">
      <div class="flex flex-col items-center gap-3">
        <svg class="animate-spin h-8 w-8 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <span class="text-sm text-gray-400">Cargando...</span>
      </div>
    </div>

    <AppFab @crear="crearNuevo" />

    <ModalCrearEvento v-if="modal.tipo === 'evento'" :modo="modal.modo" :valores="modal.valores" :fecha-predeterminada="modal.fechaPredeterminada"
      @cerrar="cerrarModal" @guardar="guardarEvento" @eliminar="eliminarEventoItem" />
    <ModalCrearTarea v-if="modal.tipo === 'tarea'" :modo="modal.modo" :valores="modal.valores" :fecha-predeterminada="modal.fechaPredeterminada"
      @cerrar="cerrarModal" @guardar="guardarTarea" @eliminar="eliminarTareaItem" />
    <ModalCrearNota v-if="modal.tipo === 'nota'" :modo="modal.modo" :valores="modal.valores"
      @cerrar="cerrarModal" @guardar="guardarNota" @eliminar="eliminarNotaItem" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import dayjs from 'dayjs'
import { storeToRefs } from 'pinia'
import { useCalendarioStore } from '@/stores/calendarioStore'
import { useEtiquetasStore } from '@/stores/etiquetasStore'
import { listarEntidadesPorEtiqueta } from '@/api/etiquetas'
import { useAgenda } from '@/composables/useAgenda'
import AppFab from '@/components/ui/AppFab.vue'
import ModalCrearEvento from '@/components/eventos/ModalCrearEvento.vue'
import ModalCrearTarea from '@/components/tareas/ModalCrearTarea.vue'
import ModalCrearNota from '@/components/notas/ModalCrearNota.vue'

const calStore = useCalendarioStore()
const { anio, mes, foco } = storeToRefs(calStore)

const {
  eventos, tareas, notas, cargando, modal,
  cargar, abrirCrear, editar, cerrarModal,
  guardarEvento, guardarTarea, guardarNota,
  eliminarEventoItem, eliminarTareaItem, eliminarNotaItem
} = useAgenda()

const etiquetasStore = useEtiquetasStore()
const diaSeleccionado = ref(null)
const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']

// Filtro por etiqueta
const etiquetaFiltro = ref(null)
const idsFiltrados = ref(new Set())
const pasaFiltro = (tipo, id) => !etiquetaFiltro.value || idsFiltrados.value.has(`${tipo}-${id}`)

watch(etiquetaFiltro, async (id) => {
  if (!id) { idsFiltrados.value = new Set(); return }
  try {
    const { data } = await listarEntidadesPorEtiqueta(id)
    idsFiltrados.value = new Set((data.data || []).map((e) => `${e.entidad_tipo}-${e.entidad_id}`))
  } catch (e) {
    idsFiltrados.value = new Set()
  }
})

const diasCalendario = computed(() => {
  const primerDia = dayjs(new Date(anio.value, mes.value, 1))
  const diasEnMes = primerDia.daysInMonth()
  const inicioSemana = primerDia.day()
  const dias = []
  for (let i = 0; i < inicioSemana; i++) {
    const fecha = primerDia.subtract(inicioSemana - i, 'day')
    dias.push({ dia: fecha.date(), fueraMes: true, esHoy: false, esSeleccionado: false, fecha })
  }
  for (let i = 1; i <= diasEnMes; i++) {
    const fecha = dayjs(new Date(anio.value, mes.value, i))
    dias.push({
      dia: i, fueraMes: false,
      esHoy: fecha.isSame(dayjs(), 'day'),
      esSeleccionado: diaSeleccionado.value === i,
      fecha
    })
  }
  const resto = 42 - dias.length
  for (let i = 1; i <= resto; i++) {
    const fecha = dayjs(new Date(anio.value, mes.value + 1, i))
    dias.push({ dia: i, fueraMes: true, esHoy: false, esSeleccionado: false, fecha })
  }
  return dias
})

const mismaFecha = (valor, fecha) => valor && dayjs(valor).isSame(fecha, 'day')
const eventosDelDia = (fecha) => eventos.value.filter((e) => mismaFecha(e.fecha_inicio, fecha) && pasaFiltro('evento', e.id))
const tareasDelDia = (fecha) => tareas.value.filter((t) => mismaFecha(t.fecha_limite, fecha) && pasaFiltro('tarea', t.id))
const notasDelDia = (fecha) => (etiquetaFiltro.value ? [] : notas.value.filter((n) => mismaFecha(n.fecha_creacion, fecha)))

const fechaDeDiaSeleccionado = computed(() =>
  diaSeleccionado.value !== null ? dayjs(new Date(anio.value, mes.value, diaSeleccionado.value)) : null
)
const eventosDiaSeleccionado = computed(() => fechaDeDiaSeleccionado.value ? eventosDelDia(fechaDeDiaSeleccionado.value) : [])
const tareasDiaSeleccionado = computed(() => fechaDeDiaSeleccionado.value ? tareasDelDia(fechaDeDiaSeleccionado.value) : [])
const notasDiaSeleccionado = computed(() => fechaDeDiaSeleccionado.value ? notasDelDia(fechaDeDiaSeleccionado.value) : [])
const itemsDiaSeleccionado = computed(() => [...eventosDiaSeleccionado.value, ...tareasDiaSeleccionado.value, ...notasDiaSeleccionado.value])

const tituloDiaSeleccionado = computed(() =>
  fechaDeDiaSeleccionado.value ? fechaDeDiaSeleccionado.value.format('D [de] MMMM') : ''
)
const fechaParaCrear = computed(() =>
  fechaDeDiaSeleccionado.value ? fechaDeDiaSeleccionado.value.format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD')
)

const formatoHora = (fecha) => (fecha ? dayjs(fecha).format('h:mm A') : '')
const truncar = (texto, max) => (!texto ? '' : texto.length > max ? texto.slice(0, max) + '…' : texto)
const colorSuave = (hex) => (hex ? hex + '22' : '#EFF6FF')

const badgeEstado = (estado) => ({
  pendiente: 'bg-blue-100 text-blue-700', en_curso: 'bg-indigo-100 text-indigo-700',
  completado: 'bg-green-100 text-green-700', vencido: 'bg-red-100 text-red-700',
  cancelado: 'bg-gray-100 text-gray-500', pospuesto: 'bg-amber-100 text-amber-700'
}[estado] || 'bg-blue-100 text-blue-700')
const etiquetaEstado = (estado) => ({
  pendiente: 'Pendiente', en_curso: 'En curso', completado: 'Completado',
  vencido: 'Vencido', cancelado: 'Cancelado', pospuesto: 'Pospuesto'
}[estado] || estado)

const recargarMes = () => {
  const primer = dayjs(new Date(anio.value, mes.value, 1)).format('YYYY-MM-DD')
  const ultimo = dayjs(new Date(anio.value, mes.value, 1)).endOf('month').format('YYYY-MM-DD')
  cargar(primer, ultimo)
}

const crearNuevo = (tipo) => abrirCrear(tipo, fechaParaCrear.value)

const seleccionarDia = (item) => {
  if (item.fueraMes) return
  diaSeleccionado.value = item.dia
  calStore.seleccionarFecha(item.fecha.format('YYYY-MM-DD'))
}
const cerrarDetalleDia = () => { diaSeleccionado.value = null }

onMounted(() => {
  calStore.setVista('mes')
  etiquetasStore.cargar()
  if (foco.value.isSame(dayjs(), 'month')) diaSeleccionado.value = dayjs().date()
  recargarMes()
})

watch([anio, mes], () => {
  diaSeleccionado.value = null
  recargarMes()
})
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
