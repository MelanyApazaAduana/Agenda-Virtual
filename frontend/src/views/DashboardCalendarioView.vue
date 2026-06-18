<template>
  <div class="h-full flex flex-col">
    <header class="h-16 border-b border-gray-200 flex items-center justify-between px-6 bg-white shrink-0">
      <div class="flex items-center gap-4">
        <button @click="irAHoy" class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50">Hoy</button>
        <div class="flex items-center gap-3 text-lg font-bold text-gray-800">
          <button @click="cambiarMes(-1)" class="p-1 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100">&lt;</button>
          {{ mesActualLabel }}
          <button @click="cambiarMes(1)" class="p-1 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100">&gt;</button>
        </div>
      </div>

      <div class="flex items-center gap-6">
        <div v-if="cargando" class="text-xs text-gray-400 font-medium">Cargando...</div>
        <div class="flex bg-gray-100 p-1 rounded-lg">
          <button @click="vistaActual = 'mes'" class="px-4 py-1.5 text-sm font-medium rounded-md transition"
            :class="vistaActual === 'mes' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'">Mes</button>
        </div>
      </div>
    </header>

    <div v-if="!cargando" class="flex-1 flex flex-col overflow-hidden">
      <div class="grid grid-cols-7 border-b border-gray-200 bg-white">
        <div v-for="dia in diasSemana" :key="dia" class="py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-widest border-r border-gray-200 last:border-0">
          {{ dia }}
        </div>
      </div>
      <div :class="diaSeleccionado !== null ? 'grid grid-cols-7 grid-rows-5 bg-gray-200 gap-px overflow-y-auto' : 'flex-1 grid grid-cols-7 grid-rows-5 bg-gray-200 gap-px'">
        <div
          v-for="diaNum in totalDiasMes" :key="diaNum"
          @click="seleccionarDia(diaNum)"
          class="bg-white p-2 flex flex-col hover:bg-gray-50 transition min-h-[90px] cursor-pointer relative"
          :class="{ 'ring-2 ring-black ring-inset': diaSeleccionado === diaNum }"
        >
          <span
            class="text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full mb-1"
            :class="esHoy(diaNum) ? 'bg-black text-white' : diaSeleccionado === diaNum && !esHoy(diaNum) ? 'bg-gray-200 text-gray-900' : 'text-gray-700'"
          >{{ diaNum }}</span>

          <div class="flex-1 space-y-1 overflow-y-auto no-scrollbar">
            <div v-for="evento in eventosDelDia(diaNum)" :key="'e-' + evento.id"
                 class="text-[10px] px-1.5 py-0.5 rounded font-medium truncate bg-blue-50 text-blue-700 border-l-2 border-blue-500">
              {{ truncarTexto(evento.titulo, 15) }}
            </div>
            <div v-for="tarea in tareasDelDia(diaNum)" :key="'t-' + tarea.id"
                 class="text-[10px] px-1.5 py-0.5 rounded font-medium truncate bg-green-50 text-green-700 border-l-2 border-green-500">
              {{ truncarTexto(tarea.titulo, 15) }}
            </div>
            <div v-for="nota in notasDelDia(diaNum)" :key="'n-' + nota.id"
                 class="text-[10px] px-1.5 py-0.5 rounded font-medium truncate bg-yellow-50 text-yellow-700 border-l-2 border-yellow-500">
              {{ truncarTexto(nota.titulo, 15) }}
            </div>
          </div>

          <div class="flex gap-1 mt-auto pt-1">
            <span v-if="eventosDelDia(diaNum).length" class="w-1.5 h-1.5 rounded-full bg-blue-500" title="Eventos"></span>
            <span v-if="tareasDelDia(diaNum).length" class="w-1.5 h-1.5 rounded-full bg-green-500" title="Tareas"></span>
            <span v-if="notasDelDia(diaNum).length" class="w-1.5 h-1.5 rounded-full bg-yellow-500" title="Notas"></span>
          </div>
        </div>
      </div>

      <!-- Day Detail Panel Inline -->
      <div v-if="diaSeleccionado !== null" class="border-t border-gray-200 bg-white shrink-0 max-h-[280px] overflow-y-auto">
        <div class="px-6 py-3 flex items-center justify-between border-b border-gray-100 sticky top-0 bg-white">
          <h3 class="text-sm font-bold text-gray-900">
            {{ diaSeleccionado }} de {{ mesActualLabel }}
            <span v-if="itemsDiaSeleccionado.length" class="text-gray-400 font-normal ml-1">· {{ itemsDiaSeleccionado.length }} registros</span>
          </h3>
          <div class="flex items-center gap-2">
            <button @click="abrirFormulario('evento')" class="px-3 py-1.5 text-xs font-semibold bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition">+ Evento</button>
            <button @click="abrirFormulario('tarea')" class="px-3 py-1.5 text-xs font-semibold bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition">+ Tarea</button>
            <button @click="abrirFormulario('nota')" class="px-3 py-1.5 text-xs font-semibold bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition">+ Nota</button>
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
            <h4 class="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2 flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-blue-500"></span> Eventos ({{ eventosDiaSeleccionado.length }})
            </h4>
            <div class="space-y-1.5">
              <div v-for="item in eventosDiaSeleccionado" :key="item.id"
                   class="bg-blue-50 rounded-lg px-4 py-2.5 border-l-4 border-blue-500">
                <p class="text-sm font-semibold text-gray-900">{{ item.titulo }}</p>
                <p class="text-xs text-gray-500 mt-0.5">{{ formatoHora(item.fecha_inicio) }} - {{ formatoHora(item.fecha_fin) }}</p>
              </div>
            </div>
          </div>

          <div v-if="tareasDiaSeleccionado.length">
            <h4 class="text-xs font-bold text-green-600 uppercase tracking-wider mb-2 flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-green-500"></span> Tareas ({{ tareasDiaSeleccionado.length }})
            </h4>
            <div class="space-y-1.5">
              <div v-for="item in tareasDiaSeleccionado" :key="item.id"
                   class="bg-green-50 rounded-lg px-4 py-2.5 border-l-4 border-green-500">
                <p class="text-sm font-semibold text-gray-900">{{ item.titulo }}</p>
                <p class="text-xs text-gray-500 mt-0.5 capitalize">{{ item.estado }} · {{ item.prioridad }}</p>
              </div>
            </div>
          </div>

          <div v-if="notasDiaSeleccionado.length">
            <h4 class="text-xs font-bold text-yellow-600 uppercase tracking-wider mb-2 flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-yellow-500"></span> Notas ({{ notasDiaSeleccionado.length }})
            </h4>
            <div class="space-y-1.5">
              <div v-for="item in notasDiaSeleccionado" :key="item.id"
                   class="bg-yellow-50 rounded-lg px-4 py-2.5 border-l-4 border-yellow-500">
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

    <!-- Nuevo Menu -->
    <AppFab @crear="abrirFormulario" />

    <!-- Modal Crear Evento -->
    <ModalCrearEvento v-if="modalTipo === 'evento'" @cerrar="cerrarModal" @guardar="guardarEvento" />

    <!-- Modal Crear Tarea -->
    <div v-if="modalTipo === 'tarea'" class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-sans" @click.self="cerrarModal">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
        <div class="bg-gray-50/80 px-6 py-5 border-b border-gray-200 flex items-start justify-between">
          <div>
            <h2 class="text-xl font-bold text-gray-900">Nueva Tarea</h2>
            <p class="text-xs text-gray-500 mt-1">Agrega una tarea para {{ fechaFormateadaParaCreacion }}</p>
          </div>
          <button @click="cerrarModal" class="text-gray-500 hover:text-gray-800 transition mt-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="p-6 space-y-5">
          <div>
            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Título</label>
            <input v-model="formTarea.titulo" type="text" placeholder="Nombre de la tarea"
              class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-black focus:border-black outline-none transition text-sm" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Prioridad</label>
            <select v-model="formTarea.prioridad"
              class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-black outline-none transition text-sm appearance-none">
              <option value="baja">Baja</option>
              <option value="media">Media</option>
              <option value="alta">Alta</option>
              <option value="urgente">Urgente</option>
            </select>
          </div>
          <div class="pt-4 border-t border-gray-200 flex justify-end gap-4">
            <button @click="cerrarModal" class="text-sm font-semibold text-gray-500 hover:text-gray-800 transition">Cancelar</button>
            <button @click="guardarTarea" class="px-6 py-2.5 text-sm font-bold text-white bg-black rounded-xl hover:bg-zinc-800 transition shadow-lg shadow-black/10">Guardar Tarea</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Crear Nota -->
    <div v-if="modalTipo === 'nota'" class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-sans" @click.self="cerrarModal">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
        <div class="bg-gray-50/80 px-6 py-5 border-b border-gray-200 flex items-start justify-between">
          <div>
            <h2 class="text-xl font-bold text-gray-900">Nueva Nota</h2>
            <p class="text-xs text-gray-500 mt-1">Crea una nota para {{ fechaFormateadaParaCreacion }}</p>
          </div>
          <button @click="cerrarModal" class="text-gray-500 hover:text-gray-800 transition mt-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="p-6 space-y-5">
          <div>
            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Título</label>
            <input v-model="formNota.titulo" type="text" placeholder="Título de la nota"
              class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-black focus:border-black outline-none transition text-sm" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Contenido</label>
            <textarea v-model="formNota.contenido" rows="4" placeholder="Escribe tu nota aquí..."
              class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-black focus:border-black outline-none transition text-sm resize-none"></textarea>
          </div>
          <div class="pt-4 border-t border-gray-200 flex justify-end gap-4">
            <button @click="cerrarModal" class="text-sm font-semibold text-gray-500 hover:text-gray-800 transition">Cancelar</button>
            <button @click="guardarNota" class="px-6 py-2.5 text-sm font-bold text-white bg-black rounded-xl hover:bg-zinc-800 transition shadow-lg shadow-black/10">Guardar Nota</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import dayjs from 'dayjs'
import ModalCrearEvento from '@/components/eventos/ModalCrearEvento.vue'
import AppFab from '@/components/ui/AppFab.vue'
import { listarCalendario } from '@/api/calendario.js'
import { crearEvento } from '@/api/eventos.js'
import { crearTarea } from '@/api/tareas.js'
import { crearNota } from '@/api/notas.js'

const route = useRoute()
const router = useRouter()

const vistaActual = ref('mes')
const cargando = ref(true)

const ahora = dayjs()
const anioActual = ref(ahora.year())
const mesActual = ref(ahora.month())

const eventos = ref([])
const tareas = ref([])
const notas = ref([])

const diaSeleccionado = ref(null)
const modalTipo = ref(null)

const formTarea = ref({ titulo: '', prioridad: 'media' })
const formNota = ref({ titulo: '', contenido: '' })

const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']

const mesActualLabel = computed(() => {
  const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
  return `${meses[mesActual.value]} ${anioActual.value}`
})

const totalDiasMes = computed(() => {
  return dayjs(new Date(anioActual.value, mesActual.value)).daysInMonth()
})

const esHoy = (diaNum) => {
  return diaNum === ahora.date() && mesActual.value === ahora.month() && anioActual.value === ahora.year()
}

const fechaFormateadaParaCreacion = computed(() => {
  if (diaSeleccionado.value !== null) {
    return `${diaSeleccionado.value} de ${mesActualLabel.value}`
  }
  return 'hoy'
})

const fechaParaCrear = computed(() => {
  if (diaSeleccionado.value !== null) {
    return dayjs(new Date(anioActual.value, mesActual.value, diaSeleccionado.value)).format('YYYY-MM-DD')
  }
  return ahora.format('YYYY-MM-DD')
})

const eventosDelDia = (diaNum) => {
  return eventos.value.filter((e) => {
    const fecha = dayjs(e.fecha_inicio)
    return fecha.date() === diaNum && fecha.month() === mesActual.value && fecha.year() === anioActual.value
  })
}

const tareasDelDia = (diaNum) => {
  return tareas.value.filter((t) => {
    if (!t.fecha_limite) return false
    const fecha = dayjs(t.fecha_limite)
    return fecha.date() === diaNum && fecha.month() === mesActual.value && fecha.year() === anioActual.value
  })
}

const notasDelDia = (diaNum) => {
  return notas.value.filter((n) => {
    const fecha = dayjs(n.fecha_creacion)
    return fecha.date() === diaNum && fecha.month() === mesActual.value && fecha.year() === anioActual.value
  })
}

const eventosDiaSeleccionado = computed(() => {
  if (diaSeleccionado.value === null) return []
  return eventosDelDia(diaSeleccionado.value)
})

const tareasDiaSeleccionado = computed(() => {
  if (diaSeleccionado.value === null) return []
  return tareasDelDia(diaSeleccionado.value)
})

const notasDiaSeleccionado = computed(() => {
  if (diaSeleccionado.value === null) return []
  return notasDelDia(diaSeleccionado.value)
})

const itemsDiaSeleccionado = computed(() => {
  return [
    ...eventosDiaSeleccionado.value,
    ...tareasDiaSeleccionado.value,
    ...notasDiaSeleccionado.value
  ]
})

const formatoHora = (fecha) => {
  if (!fecha) return ''
  return dayjs(fecha).format('h:mm A')
}

const truncarTexto = (texto, max) => {
  if (!texto) return ''
  return texto.length > max ? texto.slice(0, max) + '...' : texto
}

const cargarDatos = async () => {
  cargando.value = true
  try {
    const primerDia = dayjs(new Date(anioActual.value, mesActual.value, 1)).format('YYYY-MM-DD')
    const ultimoDia = dayjs(new Date(anioActual.value, mesActual.value, totalDiasMes.value)).format('YYYY-MM-DD')

    const respuesta = await listarCalendario(primerDia, ultimoDia)
    const data = respuesta.data.data || {}
    eventos.value = data.eventos || []
    tareas.value = data.tareas || []
    notas.value = data.notas || []
  } catch (error) {
    console.error('Error al cargar calendario:', error)
    eventos.value = []
    tareas.value = []
    notas.value = []
  } finally {
    cargando.value = false
  }
}

onMounted(() => {
  leerFechaQuery()
  cargarDatos()
})

watch([anioActual, mesActual], () => {
  cargarDatos()
})

watch(() => route.query.fecha, (nuevaFecha) => {
  if (nuevaFecha) {
    leerFechaQuery()
    cargarDatos()
  }
})

function leerFechaQuery() {
  const f = route.query.fecha
  if (f) {
    const fecha = dayjs(f)
    if (fecha.isValid()) {
      anioActual.value = fecha.year()
      mesActual.value = fecha.month()
      if (!route.query.crear) {
        diaSeleccionado.value = fecha.date()
      }
    }
  }
  if (route.query.crear) {
    abrirFormulario(route.query.crear)
    if (f) {
      const fecha = dayjs(f)
      if (fecha.isValid()) {
        anioActual.value = fecha.year()
        mesActual.value = fecha.month()
      }
    }
  }
}

const irAHoy = () => {
  anioActual.value = ahora.year()
  mesActual.value = ahora.month()
  diaSeleccionado.value = null
  router.push({ query: {} })
}

const cambiarMes = (delta) => {
  mesActual.value += delta
  if (mesActual.value > 11) {
    mesActual.value = 0
    anioActual.value++
  } else if (mesActual.value < 0) {
    mesActual.value = 11
    anioActual.value--
  }
}

const seleccionarDia = (diaNum) => {
  diaSeleccionado.value = diaNum
  const fecha = dayjs(new Date(anioActual.value, mesActual.value, diaNum)).format('YYYY-MM-DD')
  router.push({ query: { fecha } })
}

const cerrarDetalleDia = () => {
  diaSeleccionado.value = null
  router.push({ query: {} })
}

const abrirFormulario = (tipo) => {
  modalTipo.value = tipo
  mostrarMenuNuevo.value = false
  formTarea.value = { titulo: '', prioridad: 'media' }
  formNota.value = { titulo: '', contenido: '' }
}

const cerrarModal = () => {
  modalTipo.value = null
  const query = { ...route.query }
  delete query.crear
  router.replace({ query })
}

const guardarEvento = async (datos) => {
  try {
    const payload = {
      titulo: datos.titulo,
      fecha_inicio: datos.fechaInicio || fechaParaCrear.value + 'T09:00:00',
      fecha_fin: datos.fechaFin || fechaParaCrear.value + 'T10:00:00',
      ubicacion: datos.lugar || null,
      color_etiqueta: datos.categoria || null,
      categoria_id: datos.categoria_id || null
    }
    const respuesta = await crearEvento(payload)
    if (respuesta.data.data) {
      eventos.value.push(respuesta.data.data)
    }
    cerrarModal()
  } catch (error) {
    const mensaje = error.response?.data?.message || 'Error al crear el evento'
    alert(mensaje)
  }
}

const guardarTarea = async () => {
  if (!formTarea.value.titulo) {
    alert('El título es requerido')
    return
  }
  try {
    const payload = {
      titulo: formTarea.value.titulo,
      fecha_limite: fechaParaCrear.value,
      prioridad: formTarea.value.prioridad
    }
    const respuesta = await crearTarea(payload)
    if (respuesta.data.data) {
      tareas.value.push(respuesta.data.data)
    }
    cerrarModal()
  } catch (error) {
    const mensaje = error.response?.data?.message || 'Error al crear la tarea'
    alert(mensaje)
  }
}

const guardarNota = async () => {
  if (!formNota.value.titulo) {
    alert('El título es requerido')
    return
  }
  try {
    const payload = {
      titulo: formNota.value.titulo,
      contenido: formNota.value.contenido || null
    }
    const respuesta = await crearNota(payload)
    if (respuesta.data.data) {
      notas.value.push(respuesta.data.data)
    }
    cerrarModal()
  } catch (error) {
    const mensaje = error.response?.data?.message || 'Error al crear la nota'
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
