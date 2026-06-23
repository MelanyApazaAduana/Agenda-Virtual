<template>
  <div class="flex-1 overflow-x-auto overflow-y-hidden p-8">
    <header class="mb-6">
      <div class="relative w-full max-w-md">
        <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
        </span>
        <input v-model="busqueda" type="text" placeholder="Buscar tareas..." class="w-full bg-gray-100/80 border-none rounded-full pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-black outline-none transition placeholder-gray-400" />
      </div>
    </header>

    <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 tracking-tight">Gestión de Tareas</h1>
        <p class="text-sm text-gray-500 mt-1">Optimiza tu flujo de trabajo</p>
      </div>
      <div v-if="cargando" class="flex items-center gap-2 text-sm text-gray-400">
        <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        Cargando...
      </div>
    </div>

    <div class="flex gap-6 h-[calc(100%-100px)] overflow-x-auto pb-4">
      <div v-for="col in columnas" :key="col.clave" class="w-80 shrink-0 flex flex-col">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 rounded-full" :class="col.punto"></div>
            <h3 class="font-bold text-gray-900">{{ col.titulo }}</h3>
          </div>
          <span class="text-xs font-bold px-2.5 py-1 rounded-full border" :class="col.chip">{{ tareasFiltradas(col.clave).length }} TAREAS</span>
        </div>

        <div class="flex-1 space-y-4 overflow-y-auto no-scrollbar">
          <div v-for="tarea in tareasFiltradas(col.clave)" :key="tarea.id"
            @click="editarTarea(tarea)"
            class="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition cursor-pointer relative overflow-hidden"
            :class="{ 'opacity-70': tarea.estado === 'completada' }">
            <div class="absolute top-0 left-0 w-full h-1" :style="{ backgroundColor: tarea.color_hex || '#10B981' }"></div>
            <div class="flex items-start gap-3">
              <input type="checkbox" :checked="tarea.estado === 'completada'" @click.stop @change="alternarCompletada(tarea)"
                class="mt-0.5 rounded border-gray-300 w-4 h-4 cursor-pointer" :style="{ accentColor: tarea.color_hex || '#10B981' }" />
              <div class="min-w-0">
                <h4 class="text-sm font-bold leading-tight" :class="tarea.estado === 'completada' ? 'text-gray-500 line-through' : 'text-gray-900'">{{ tarea.titulo }}</h4>
                <p v-if="tarea.descripcion" class="text-xs text-gray-500 mt-1.5 leading-relaxed truncate">{{ tarea.descripcion }}</p>
                <div class="flex items-center gap-2 mt-3 text-[10px] font-bold tracking-wider uppercase" :class="colorPrioridad(tarea.prioridad)">
                  <span>{{ tarea.prioridad }}</span>
                  <span v-if="tarea.fecha_limite" class="text-gray-400">• {{ formatoFecha(tarea.fecha_limite) }}</span>
                </div>
              </div>
            </div>
          </div>
          <div v-if="tareasFiltradas(col.clave).length === 0 && !cargando" class="text-center py-8 text-gray-400 text-sm">
            Sin tareas
          </div>
        </div>
      </div>
    </div>
  </div>

  <button @click="abrirCrear" class="fixed bottom-8 right-8 w-14 h-14 bg-teal-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-teal-700 hover:scale-105 transition-all z-50">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-6 h-6">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  </button>

  <ModalCrearTarea v-if="modal.tipo" :modo="modal.modo" :valores="modal.valores"
    @cerrar="cerrarModal" @guardar="guardarTarea" @eliminar="eliminarTareaItem" />
</template>

<script setup>
import { useUiStore } from '@/stores/uiStore'
const ui = useUiStore()
import { ref, computed, onMounted } from 'vue'
import dayjs from 'dayjs'
import ModalCrearTarea from '@/components/tareas/ModalCrearTarea.vue'
import { listarTareas, crearTarea, actualizarTarea, eliminarTarea, cambiarEstadoTarea } from '@/api/tareas.js'
import { crearRecurrencia } from '@/api/recurrencias.js'
import { sincronizarEtiquetas } from '@/utils/etiquetasSync'
import { confirmarEliminacion } from '@/utils/eliminacion'

const cargando = ref(true)
const busqueda = ref('')
const tareas = ref([])
const modal = ref({ tipo: null, modo: 'crear', valores: null })

const columnas = [
  { clave: 'vencidas', titulo: 'Vencidas', punto: 'bg-red-500', chip: 'bg-red-50 text-red-600 border-red-100' },
  { clave: 'pendientes', titulo: 'Pendientes', punto: 'bg-teal-500', chip: 'bg-teal-50 text-teal-700 border-teal-100' },
  { clave: 'completadas', titulo: 'Completadas', punto: 'bg-gray-400', chip: 'bg-gray-100 text-gray-600 border-gray-200' }
]

const cargarTareas = async () => {
  cargando.value = true
  try {
    const { data } = await listarTareas()
    tareas.value = data.data || []
  } catch (error) {
    console.error('Error al cargar tareas:', error)
    tareas.value = []
  } finally {
    cargando.value = false
  }
}
onMounted(cargarTareas)

const tareasVencidas = computed(() => tareas.value.filter(t =>
  !['completada', 'cancelada'].includes(t.estado) && t.fecha_limite && dayjs(t.fecha_limite).isBefore(dayjs(), 'day')
))
const tareasPendientes = computed(() => tareas.value.filter(t =>
  !['completada', 'cancelada'].includes(t.estado) && (!t.fecha_limite || !dayjs(t.fecha_limite).isBefore(dayjs(), 'day'))
))
const tareasCompletadas = computed(() => tareas.value.filter(t => t.estado === 'completada'))

const tareasFiltradas = (columna) => {
  let lista = columna === 'vencidas' ? tareasVencidas.value
    : columna === 'pendientes' ? tareasPendientes.value
    : columna === 'completadas' ? tareasCompletadas.value : []
  if (busqueda.value) {
    const q = busqueda.value.toLowerCase()
    lista = lista.filter(t => t.titulo?.toLowerCase().includes(q) || t.descripcion?.toLowerCase().includes(q))
  }
  return lista
}

const colorPrioridad = (p) => ({
  urgente: 'text-purple-600', alta: 'text-red-600', media: 'text-orange-600', baja: 'text-teal-600'
}[p] || 'text-gray-500')

const formatoFecha = (fecha) => (fecha ? dayjs(fecha).format('DD/MM/YYYY') : 'Sin fecha')

const alternarCompletada = async (tarea) => {
  try {
    const nuevoEstado = tarea.estado === 'completada' ? 'por_hacer' : 'completada'
    await cambiarEstadoTarea(tarea.id, nuevoEstado)
    tarea.estado = nuevoEstado
  } catch (error) {
    console.error('Error al cambiar estado:', error)
  }
}

const abrirCrear = () => { modal.value = { tipo: 'tarea', modo: 'crear', valores: null } }
const editarTarea = (tarea) => { modal.value = { tipo: 'tarea', modo: 'editar', valores: tarea } }
const cerrarModal = () => { modal.value = { tipo: null, modo: 'crear', valores: null } }

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
      if (payload.recurrencia) {
        try { const { data } = await crearRecurrencia(payload.recurrencia); cuerpo.recurrencia_id = data.data.id } catch (e) { /* ignora */ }
      }
      const { data } = await crearTarea(cuerpo)
      id = data.data.id
    }
    await sincronizarEtiquetas('tarea', id, payload.etiquetas, payload.etiquetasPrevias)
    cerrarModal(); await cargarTareas()
  } catch (error) {
    ui.error(error.response?.data?.message || 'Error al guardar la tarea')
  }
}

const eliminarTareaItem = async (id) => {
  const tarea = tareas.value.find((t) => t.id === id)
  const decision = await confirmarEliminacion(ui, !!tarea?.recurrencia_id, 'esta tarea', 'la serie de tareas')
  if (!decision.confirmado) return
  try { await eliminarTarea(id, decision.serie); cerrarModal(); await cargarTareas() }
  catch (e) { ui.error('No se pudo eliminar la tarea') }
}
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
