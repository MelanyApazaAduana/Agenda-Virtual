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
        <p class="text-sm text-gray-500 mt-1">Optimiza tu flujo de trabajo con precisión algorítmica</p>
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

      <div class="w-80 shrink-0 flex flex-col">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 rounded-full bg-red-500"></div>
            <h3 class="font-bold text-gray-900">Vencidas</h3>
          </div>
          <span class="bg-red-50 text-red-600 text-xs font-bold px-2.5 py-1 rounded-full border border-red-100">{{ tareasVencidas.length }} TAREAS</span>
        </div>

        <div class="flex-1 space-y-4 overflow-y-auto no-scrollbar">
          <div v-for="tarea in tareasFiltradas('vencidas')" :key="tarea.id" class="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition cursor-pointer">
            <label class="flex items-start gap-3">
              <input type="checkbox" @change="completarTarea(tarea)" class="mt-0.5 rounded border-gray-300 text-red-500 focus:ring-red-500 w-4 h-4 cursor-pointer" />
              <div>
                <h4 class="text-sm font-bold text-gray-900 leading-tight">{{ tarea.titulo }}</h4>
                <p v-if="tarea.descripcion" class="text-xs text-gray-500 mt-1.5 leading-relaxed truncate">{{ tarea.descripcion }}</p>
                <div class="flex items-center gap-2 mt-4 text-[10px] font-bold text-red-600 tracking-wider uppercase">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3.5 h-3.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                  {{ etiquetaPrioridad(tarea.prioridad) }} • {{ formatoVencimiento(tarea.fecha_limite) }}
                </div>
              </div>
            </label>
          </div>
          <div v-if="tareasVencidas.length === 0 && !cargando" class="text-center py-8 text-gray-400 text-sm">
            No hay tareas vencidas
          </div>
        </div>
      </div>

      <div class="w-80 shrink-0 flex flex-col">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 rounded-full bg-teal-500"></div>
            <h3 class="font-bold text-gray-900">Pendientes</h3>
          </div>
          <span class="bg-teal-50 text-teal-700 text-xs font-bold px-2.5 py-1 rounded-full border border-teal-100">{{ tareasPendientes.length }} TAREAS</span>
        </div>

        <div class="flex-1 space-y-4 overflow-y-auto no-scrollbar">
          <div v-for="tarea in tareasFiltradas('pendientes')" :key="tarea.id" class="bg-white p-5 rounded-xl border border-teal-200 shadow-sm hover:shadow-md transition cursor-pointer relative overflow-hidden">
            <div class="absolute top-0 left-0 w-full h-1 bg-teal-500"></div>
            <label class="flex items-start gap-3">
              <input type="checkbox" @change="completarTarea(tarea)" class="mt-0.5 rounded border-gray-300 text-teal-600 focus:ring-teal-600 w-4 h-4 cursor-pointer" />
              <div>
                <h4 class="text-sm font-bold text-gray-900 leading-tight">{{ tarea.titulo }}</h4>
                <p v-if="tarea.descripcion" class="text-xs text-gray-500 mt-1.5 leading-relaxed truncate">{{ tarea.descripcion }}</p>
                <div class="flex items-center gap-2 mt-4 text-[10px] font-bold text-teal-600 tracking-wider uppercase">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3.5 h-3.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                  {{ etiquetaPrioridad(tarea.prioridad) }} • {{ formatoVencimiento(tarea.fecha_limite) }}
                </div>
              </div>
            </label>
          </div>
          <div v-if="tareasPendientes.length === 0 && !cargando" class="text-center py-8 text-gray-400 text-sm">
            No hay tareas pendientes
          </div>
        </div>
      </div>

      <div class="w-80 shrink-0 flex flex-col">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 rounded-full bg-gray-400"></div>
            <h3 class="font-bold text-gray-900">Completadas</h3>
          </div>
          <span class="bg-gray-100 text-gray-600 text-xs font-bold px-2.5 py-1 rounded-full border border-gray-200">{{ tareasCompletadas.length }} TAREAS</span>
        </div>

        <div class="flex-1 space-y-4 overflow-y-auto no-scrollbar">
          <div v-for="tarea in tareasFiltradas('completadas')" :key="tarea.id" class="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition cursor-pointer opacity-70">
            <label class="flex items-start gap-3">
              <input type="checkbox" checked disabled class="mt-0.5 rounded border-gray-300 text-gray-600 w-4 h-4 cursor-not-allowed" />
              <div>
                <h4 class="text-sm font-bold text-gray-500 line-through leading-tight">{{ tarea.titulo }}</h4>
                <p v-if="tarea.descripcion" class="text-xs text-gray-400 mt-1.5 leading-relaxed truncate line-through">{{ tarea.descripcion }}</p>
                <div class="flex items-center gap-2 mt-4 text-[10px] font-bold text-gray-400 tracking-wider uppercase">
                  {{ etiquetaPrioridad(tarea.prioridad) }}
                </div>
              </div>
            </label>
          </div>
          <div v-if="tareasCompletadas.length === 0 && !cargando" class="text-center py-8 text-gray-400 text-sm">
            No hay tareas completadas
          </div>
        </div>
      </div>

    </div>
  </div>

<button @click="abrirModalTarea" class="fixed bottom-8 right-8 w-14 h-14 bg-teal-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-teal-700 hover:scale-105 transition-all z-50">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-6 h-6">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  </button>

  <ModalCrearTarea v-if="mostrarModal" @cerrar="mostrarModal = false" @guardar="guardarTarea" />

  <AppFab @crear="navegarCrear" />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import dayjs from 'dayjs'
import ModalCrearTarea from '@/components/tareas/ModalCrearTarea.vue'
import AppFab from '@/components/ui/AppFab.vue'
import { listarTareas, crearTarea, cambiarEstadoTarea } from '@/api/tareas.js'

const mostrarModal = ref(false)
const cargando = ref(true)

const router = useRouter()

const navegarCrear = (tipo) => {
  router.push({ path: '/calendario', query: { crear: tipo } })
}
const busqueda = ref('')
const filtroPrioridad = ref('')
const tareas = ref([])

const cargarTareas = async () => {
  cargando.value = true
  try {
    const respuesta = await listarTareas()
    tareas.value = respuesta.data.data || []
  } catch (error) {
    console.error('Error al cargar tareas:', error)
    tareas.value = []
  } finally {
    cargando.value = false
  }
}

onMounted(() => {
  cargarTareas()
})

const tareasVencidas = computed(() => {
  return tareas.value.filter(t => {
    if (t.estado === 'completada' || t.estado === 'cancelada') return false
    if (!t.fecha_limite) return false
    return dayjs(t.fecha_limite).isBefore(dayjs(), 'day')
  })
})

const tareasPendientes = computed(() => {
  return tareas.value.filter(t => {
    if (t.estado === 'completada' || t.estado === 'cancelada') return false
    if (!t.fecha_limite) return true
    return !dayjs(t.fecha_limite).isBefore(dayjs(), 'day')
  })
})

const tareasCompletadas = computed(() => {
  return tareas.value.filter(t => t.estado === 'completada')
})

const tareasFiltradas = (columna) => {
  let lista
  if (columna === 'vencidas') lista = tareasVencidas.value
  else if (columna === 'pendientes') lista = tareasPendientes.value
  else if (columna === 'completadas') lista = tareasCompletadas.value
  else lista = []

  if (busqueda.value) {
    const q = busqueda.value.toLowerCase()
    lista = lista.filter(t => t.titulo?.toLowerCase().includes(q) || t.descripcion?.toLowerCase().includes(q))
  }
  if (filtroPrioridad.value) {
    lista = lista.filter(t => t.prioridad === filtroPrioridad.value)
  }
  return lista
}

const cambiarFiltroPrioridad = () => {
  const opciones = ['', 'urgente', 'alta', 'media', 'baja']
  const idx = opciones.indexOf(filtroPrioridad.value)
  filtroPrioridad.value = opciones[(idx + 1) % opciones.length]
}

const etiquetaPrioridad = (prioridad) => {
  const mapa = { urgente: 'Urgente', alta: 'Alta', media: 'Media', baja: 'Baja' }
  return mapa[prioridad] || prioridad
}

const formatoVencimiento = (fecha) => {
  if (!fecha) return 'Sin fecha'
  return dayjs(fecha).format('DD/MM/YYYY')
}

const completarTarea = async (tarea) => {
  try {
    const nuevoEstado = tarea.estado === 'completada' ? 'por_hacer' : 'completada'
    await cambiarEstadoTarea(tarea.id, nuevoEstado)
    tarea.estado = nuevoEstado
  } catch (error) {
    console.error('Error al cambiar estado:', error)
  }
}

const abrirModalTarea = () => {
  mostrarModal.value = true
}

const guardarTarea = async (datos) => {
  try {
    const payload = {
      titulo: datos.nombre,
      descripcion: datos.descripcion || null,
      prioridad: datos.prioridad || 'media',
      fecha_limite: datos.fechaVencimiento || null
    }
    const respuesta = await crearTarea(payload)
    if (respuesta.data.data) {
      tareas.value.push(respuesta.data.data)
    }
  } catch (error) {
    const mensaje = error.response?.data?.message || 'Error al crear la tarea'
    alert(mensaje)
  }
}
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
