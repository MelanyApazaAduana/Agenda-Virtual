<template>
  <header class="h-20 bg-white flex items-center justify-between px-8 shrink-0 relative">
    <div class="flex items-center gap-6 flex-1">
      <span class="font-bold text-lg tracking-wide text-gray-900">Agenda Virtual</span>
      <div class="relative w-full max-w-md hidden lg:block">
        <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
        </span>
        <input v-model="busqueda" type="text" placeholder="Buscar tareas..." class="w-full bg-gray-100/80 border-none rounded-full pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-black outline-none transition placeholder-gray-400" />
      </div>
    </div>

    <div class="flex items-center gap-4">
      <button class="text-gray-400 hover:text-gray-600 transition"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" /></svg></button>
      <button @click="cambiarFiltroPrioridad" class="text-gray-400 hover:text-gray-600 transition"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg></button>
      <div class="w-8 h-8 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-full cursor-pointer border-2 border-white shadow-sm ml-2"></div>
    </div>
  </header>

  <div class="flex-1 overflow-x-auto overflow-y-hidden p-8">

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
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import dayjs from 'dayjs'
import ModalCrearTarea from '@/components/tareas/ModalCrearTarea.vue'
import { listarTareas, crearTarea, cambiarEstadoTarea } from '@/api/tareas.js'

const mostrarModal = ref(false)
const cargando = ref(true)
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
