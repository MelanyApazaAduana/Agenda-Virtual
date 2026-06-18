<template>
  <header class="h-16 border-b border-gray-200 flex items-center justify-between px-6 bg-white shrink-0">
    <div class="flex items-center gap-4">
      <button @click="irAHoy" class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50">Hoy</button>
      <div class="flex items-center gap-3 text-lg font-bold text-gray-800">
        <button @click="cambiarMes(-1)" class="p-1 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100">&lt;</button>
        {{ mesActual }}
        <button @click="cambiarMes(1)" class="p-1 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100">&gt;</button>
      </div>
    </div>

    <div class="flex items-center gap-6">
      <div v-if="cargando" class="text-xs text-gray-400 font-medium">Cargando eventos...</div>
      <div class="flex bg-gray-100 p-1 rounded-lg">
        <button
          @click="vistaActual = 'dia'"
          class="px-4 py-1.5 text-sm font-medium rounded-md transition"
          :class="vistaActual === 'dia' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'"
        >Día</button>
        <button
          @click="vistaActual = 'semana'"
          class="px-4 py-1.5 text-sm font-medium rounded-md transition"
          :class="vistaActual === 'semana' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'"
        >Semana</button>
        <button
          @click="vistaActual = 'mes'"
          class="px-4 py-1.5 text-sm font-medium rounded-md transition"
          :class="vistaActual === 'mes' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'"
        >Mes</button>
      </div>

      <div class="w-8 h-8 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-full cursor-pointer border-2 border-white shadow-sm"></div>
    </div>
  </header>

  <div v-if="!cargando && vistaActual === 'mes'" class="flex-1 flex flex-col bg-gray-50">
    <div class="grid grid-cols-7 border-b border-gray-200 bg-white">
      <div v-for="dia in diasSemana" :key="dia" class="py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-widest border-r border-gray-200 last:border-0">
        {{ dia }}
      </div>
    </div>
    <div class="flex-1 grid grid-cols-7 grid-rows-5 bg-gray-200 gap-px">
      <div v-for="diaNum in totalDiasMes" :key="diaNum" class="bg-white p-2 flex flex-col hover:bg-gray-50 transition min-h-[100px]">
        <span
          class="text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full mb-1"
          :class="diaNum === diaHoy && mesActual === mesHoyLabel && anioActual === anioHoy ? 'bg-black text-white' : 'text-gray-700'"
        >{{ diaNum }}</span>
        <div class="flex-1 space-y-1 overflow-y-auto mt-1 no-scrollbar">
          <div v-for="evento in eventosDelDia(diaNum)" :key="evento.id"
               :class="`text-xs px-2 py-1 rounded-md font-medium truncate ${claseColorEvento(evento.color_etiqueta)}`">
            <span class="font-bold">{{ formatoHora(evento.fecha_inicio) }}</span> {{ evento.titulo }}
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else-if="!cargando && vistaActual === 'semana'" class="flex-1 flex flex-col overflow-auto bg-white">
    <div class="flex border-b border-gray-200 bg-white sticky top-0 z-10">
      <div class="w-16 shrink-0 border-r border-gray-200"></div>
      <div class="flex-1 grid grid-cols-7">
        <div v-for="dia in semana" :key="dia.fecha" class="text-center py-3 border-r border-gray-200 last:border-0 flex flex-col items-center">
          <span class="text-xs font-bold text-gray-400 uppercase tracking-widest">{{ dia.nombre }}</span>
          <span class="text-xl mt-1" :class="dia.esHoy ? 'bg-black text-white w-8 h-8 flex items-center justify-center rounded-full' : 'text-gray-700 font-medium'">{{ dia.fecha }}</span>
        </div>
      </div>
    </div>
    <div class="flex flex-1 relative min-h-[800px]">
      <div class="w-16 shrink-0 border-r border-gray-200 flex flex-col text-xs text-gray-400 font-medium bg-gray-50/30">
        <div v-for="hora in horas" :key="hora" class="h-20 border-b border-gray-200 flex justify-center pt-2">{{ hora }}</div>
      </div>
      <div class="flex-1 grid grid-cols-7 relative">
        <div v-for="d in 7" :key="d" class="border-r border-gray-200 relative">
          <div v-for="hora in horas" :key="hora" class="h-20 border-b border-gray-100"></div>
          <div v-for="evento in eventosSemanaColumna(d)" :key="evento.id"
               class="absolute left-1 right-1 z-10 rounded p-2 text-xs shadow-sm"
               :style="{ top: posYEvento(evento) + 'px', height: alturaEvento(evento) + 'px' }"
               :class="claseColorEvento(evento.color_etiqueta)">
            <p class="font-bold truncate">{{ evento.titulo }}</p>
            <p class="opacity-75">{{ formatoHora(evento.fecha_inicio) }}</p>
          </div>
        </div>
        <div v-if="lineaActual" class="absolute w-full border-t-2 border-green-500 z-20 flex items-center" :style="{ top: lineaActual + 'px' }">
          <div class="w-2 h-2 rounded-full bg-green-500 -ml-1"></div>
        </div>
      </div>
    </div>
  </div>

  <div v-else-if="!cargando && vistaActual === 'dia'" class="flex-1 flex flex-col overflow-auto bg-white">
    <div class="flex border-b border-gray-200 bg-white sticky top-0 z-10">
      <div class="w-16 shrink-0 border-r border-gray-200"></div>
      <div class="flex-1 flex items-center px-6 py-3">
        <span class="text-lg font-bold text-gray-800">{{ tituloDiaActual }}</span>
      </div>
    </div>
    <div class="flex flex-1 relative min-h-[800px]">
      <div class="w-16 shrink-0 border-r border-gray-200 flex flex-col text-xs text-gray-400 font-medium bg-gray-50/30">
        <div v-for="hora in horas" :key="hora" class="h-20 border-b border-gray-200 flex justify-center pt-2">{{ hora }}</div>
      </div>
      <div class="flex-1 relative">
        <div v-for="hora in horas" :key="hora" class="h-20 border-b border-gray-100"></div>
        <div v-for="evento in eventosDelDiaView" :key="evento.id"
             class="absolute left-1 right-1 z-10 rounded p-3 text-xs shadow-md"
             :style="{ top: posYEvento(evento) + 'px', height: alturaEvento(evento) + 'px' }"
             :class="claseColorEvento(evento.color_etiqueta)">
          <p class="font-bold text-base mb-1">{{ evento.titulo }}</p>
          <p class="opacity-75">{{ formatoHora(evento.fecha_inicio) }} - {{ formatoHora(evento.fecha_fin) }}</p>
          <p v-if="evento.ubicacion" class="opacity-50 mt-1">{{ evento.ubicacion }}</p>
        </div>
        <div v-if="lineaActual" class="absolute w-full border-t-2 border-green-500 z-20 flex items-center" :style="{ top: lineaActual + 'px' }">
          <div class="w-2 h-2 rounded-full bg-green-500 -ml-1"></div>
        </div>
      </div>
    </div>
  </div>

  <div v-else-if="cargando" class="flex-1 flex items-center justify-center bg-gray-50">
    <div class="flex flex-col items-center gap-3">
      <svg class="animate-spin h-8 w-8 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
      <span class="text-sm text-gray-400">Cargando eventos...</span>
    </div>
  </div>

  <button @click="abrirModal" class="fixed bottom-8 right-8 w-14 h-14 bg-black text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-105 transition-transform">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-8 h-8">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  </button>

  <ModalCrearEvento v-if="mostrarModal" @cerrar="mostrarModal = false" @guardar="guardarEvento" />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import dayjs from 'dayjs'
import ModalCrearEvento from '@/components/eventos/ModalCrearEvento.vue'
import { listarEventos, crearEvento } from '@/api/eventos.js'

const vistaActual = ref('mes')
const mostrarModal = ref(false)
const cargando = ref(true)
const eventos = ref([])

const ahora = dayjs()
const anioActual = ref(ahora.year())
const mesActual = ref(ahora.month())

const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']

const horas = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00']

const mesActualLabel = computed(() => {
  const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
  return `${meses[mesActual.value]} ${anioActual.value}`
})

const diaHoy = computed(() => ahora.date())
const mesHoyLabel = computed(() => ahora.month())
const anioHoy = computed(() => ahora.year())

const totalDiasMes = computed(() => {
  return dayjs(new Date(anioActual.value, mesActual.value)).daysInMonth()
})

const semana = computed(() => {
  const inicioSemana = ahora.startOf('week')
  const dias = []
  for (let i = 0; i < 7; i++) {
    const dia = inicioSemana.add(i, 'day')
    dias.push({
      nombre: diasSemana[dia.day()],
      fecha: dia.date(),
      esHoy: dia.isSame(ahora, 'day')
    })
  }
  return dias
})

const tituloDiaActual = computed(() => {
  return `${diasSemana[ahora.day()]} ${ahora.date()} de ${mesActualLabel.value.split(' ')[0]}`
})

const lineaActual = computed(() => {
  const hora = ahora.hour()
  const minuto = ahora.minute()
  if (hora < 8 || hora >= 17) return null
  const minutosDesdeInicio = (hora - 8) * 60 + minuto
  return (minutosDesdeInicio / 60) * 80
})

const cargarEventos = async () => {
  cargando.value = true
  try {
    const respuesta = await listarEventos()
    eventos.value = respuesta.data.data || []
  } catch (error) {
    console.error('Error al cargar eventos:', error)
    eventos.value = []
  } finally {
    cargando.value = false
  }
}

onMounted(() => {
  cargarEventos()
})

const irAHoy = () => {
  anioActual.value = ahora.year()
  mesActual.value = ahora.month()
  vistaActual.value = 'mes'
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

const eventosDelDia = (diaNum) => {
  return eventos.value.filter((e) => {
    const fecha = dayjs(e.fecha_inicio)
    return fecha.date() === diaNum && fecha.month() === mesActual.value && fecha.year() === anioActual.value
  })
}

const eventosDelDiaView = computed(() => {
  return eventos.value.filter((e) => {
    const fecha = dayjs(e.fecha_inicio)
    return fecha.isSame(ahora, 'day')
  })
})

const eventosSemanaColumna = (columna) => {
  const diaSemana = semana.value[columna - 1]
  if (!diaSemana) return []
  return eventos.value.filter((e) => {
    const fecha = dayjs(e.fecha_inicio)
    return fecha.date() === diaSemana.fecha && fecha.month() === ahora.month()
  })
}

const formatoHora = (fecha) => {
  if (!fecha) return ''
  return dayjs(fecha).format('h:mm A')
}

const posYEvento = (evento) => {
  if (!evento.fecha_inicio) return 0
  const h = dayjs(evento.fecha_inicio).hour()
  const m = dayjs(evento.fecha_inicio).minute()
  return ((h - 8) * 60 + m) / 60 * 80 + 4
}

const alturaEvento = (evento) => {
  if (!evento.fecha_inicio || !evento.fecha_fin) return 76
  const inicio = dayjs(evento.fecha_inicio)
  const fin = dayjs(evento.fecha_fin)
  const diffMin = fin.diff(inicio, 'minute')
  return Math.max(30, (diffMin / 60) * 80 - 4)
}

const claseColorEvento = (color) => {
  const mapa = {
    'teal': 'bg-teal-50 text-teal-700 border-l-2 border-teal-500',
    'indigo': 'bg-indigo-50 text-indigo-700 border-l-2 border-indigo-500',
    'red': 'bg-red-50 text-red-700 border-l-2 border-red-500',
    'blue': 'bg-blue-50 text-blue-700 border-l-2 border-blue-500',
    'green': 'bg-green-50 text-green-700 border-l-2 border-green-500',
    'yellow': 'bg-yellow-50 text-yellow-700 border-l-2 border-yellow-500',
    'purple': 'bg-purple-50 text-purple-700 border-l-2 border-purple-500',
    'black': 'bg-slate-800 text-white border-l-2 border-slate-400',
  }
  return mapa[color] || 'bg-teal-50 text-teal-700 border-l-2 border-teal-500'
}

const abrirModal = () => {
  mostrarModal.value = true
}

const guardarEvento = async (datos) => {
  try {
    const payload = {
      titulo: datos.titulo,
      fecha_inicio: datos.fechaInicio,
      fecha_fin: datos.fechaFin,
      ubicacion: datos.lugar || null,
      color_etiqueta: datos.categoria || null,
      categoria_id: datos.categoria_id || null
    }
    const respuesta = await crearEvento(payload)
    if (respuesta.data.data) {
      eventos.value.push(respuesta.data.data)
    }
  } catch (error) {
    const mensaje = error.response?.data?.message || 'Error al crear el evento'
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
