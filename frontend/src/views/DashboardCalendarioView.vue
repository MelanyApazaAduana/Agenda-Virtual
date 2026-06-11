<template>
  <header class="h-16 border-b border-gray-200 flex items-center justify-between px-6 bg-white shrink-0">
    <div class="flex items-center gap-4">
      <button class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50">Hoy</button>
      <div class="flex items-center gap-3 text-lg font-bold text-gray-800">
        <button class="p-1 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100">&lt;</button>
        {{ mesActual }}
        <button class="p-1 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100">&gt;</button>
      </div>
    </div>

    <div class="flex items-center gap-6">
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

  <div v-if="vistaActual === 'mes'" class="flex-1 flex flex-col bg-gray-50">
    <div class="grid grid-cols-7 border-b border-gray-200 bg-white">
      <div v-for="dia in diasSemana" :key="dia" class="py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-widest border-r border-gray-200 last:border-0">
        {{ dia }}
      </div>
    </div>
    <div class="flex-1 grid grid-cols-7 grid-rows-5 bg-gray-200 gap-px">
      <div v-for="diaNum in 35" :key="diaNum" class="bg-white p-2 flex flex-col hover:bg-gray-50 transition min-h-[100px]">
        <span
          class="text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full mb-1"
          :class="diaNum === 16 ? 'bg-black text-white' : 'text-gray-700'"
        >{{ diaNum <= 31 ? diaNum : diaNum - 31 }}</span>
        <div class="flex-1 space-y-1 overflow-y-auto mt-1 no-scrollbar">
          <div v-for="evento in eventos.filter(e => e.dia === diaNum)" :key="evento.id"
               :class="`text-xs px-2 py-1 rounded-md font-medium truncate ${evento.claseColor}`">
            <span class="font-bold">{{ evento.hora }}</span> {{ evento.titulo }}
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else-if="vistaActual === 'semana'" class="flex-1 flex flex-col overflow-auto bg-white">
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
        <div v-for="dia in 7" :key="dia" class="border-r border-gray-200 relative">
          <div v-for="hora in horas" :key="hora" class="h-20 border-b border-gray-100"></div>
        </div>
        <div class="absolute left-0 top-[20px] w-[14.28%] px-1 z-10">
          <div class="bg-teal-50 border-l-4 border-teal-500 rounded p-2 text-xs shadow-sm">
            <p class="font-bold text-teal-800">Sync: Design Team</p>
            <p class="text-teal-600">08:00 AM</p>
          </div>
        </div>
        <div class="absolute left-0 top-[260px] w-[14.28%] px-1 z-10">
          <div class="bg-red-50 border-l-4 border-red-500 rounded p-2 text-xs shadow-sm h-24">
            <p class="font-bold text-red-800">Urgent: Board</p>
            <p class="text-red-600">11:00 AM - 12:30 PM</p>
          </div>
        </div>
        <div class="absolute left-[14.28%] top-[100px] w-[14.28%] px-1 z-10">
          <div class="bg-gray-100 border-l-4 border-gray-400 rounded p-2 text-xs shadow-sm">
            <p class="font-bold text-gray-700">Update Website</p>
          </div>
        </div>
        <div class="absolute left-[28.56%] top-[60px] w-[14.28%] px-1 z-10">
          <div class="bg-slate-900 border-l-4 border-slate-500 rounded p-3 text-xs shadow-md text-white h-32 flex flex-col justify-between">
            <div>
              <p class="font-bold text-base mb-1">Project Alpha Launch</p>
              <p class="text-slate-400">09:00 AM - 11:00 AM</p>
            </div>
            <div class="flex -space-x-2 mt-2">
              <div class="w-6 h-6 rounded-full bg-blue-500 border-2 border-slate-900"></div>
              <div class="w-6 h-6 rounded-full bg-green-500 border-2 border-slate-900"></div>
              <div class="w-6 h-6 rounded-full bg-orange-500 border-2 border-slate-900 flex items-center justify-center text-[10px]">+3</div>
            </div>
          </div>
        </div>
        <div class="absolute left-[57.12%] top-[420px] w-[14.28%] px-1 z-10">
          <div class="bg-teal-50 border-l-4 border-teal-500 rounded p-2 text-xs shadow-sm">
            <p class="font-bold text-teal-800">Weekly Retro</p>
            <p class="text-teal-600">13:00 PM</p>
          </div>
        </div>
        <div class="absolute w-full border-t-2 border-green-500 z-20 flex items-center" style="top: 660px;">
          <div class="w-2 h-2 rounded-full bg-green-500 -ml-1"></div>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="flex-1 flex flex-col overflow-auto bg-white">
    <div class="flex border-b border-gray-200 bg-white sticky top-0 z-10">
      <div class="w-16 shrink-0 border-r border-gray-200"></div>
      <div class="flex-1 flex items-center px-6 py-3">
        <span class="text-lg font-bold text-gray-800">Miércoles 16</span>
        <span class="ml-2 text-sm text-gray-400">de Octubre 2024</span>
      </div>
    </div>
    <div class="flex flex-1 relative min-h-[800px]">
      <div class="w-16 shrink-0 border-r border-gray-200 flex flex-col text-xs text-gray-400 font-medium bg-gray-50/30">
        <div v-for="hora in horas" :key="hora" class="h-20 border-b border-gray-200 flex justify-center pt-2">{{ hora }}</div>
      </div>
      <div class="flex-1 relative">
        <div v-for="hora in horas" :key="hora" class="h-20 border-b border-gray-100"></div>
        <div class="absolute left-0 top-[20px] w-full px-1 z-10">
          <div class="bg-slate-900 border-l-4 border-slate-500 rounded p-3 text-xs shadow-md text-white">
            <p class="font-bold text-base mb-1">Discuss Product Analytics</p>
            <p class="text-slate-400">11:00 AM</p>
          </div>
        </div>
        <div class="absolute w-full border-t-2 border-green-500 z-20 flex items-center" style="top: 660px;">
          <div class="w-2 h-2 rounded-full bg-green-500 -ml-1"></div>
        </div>
      </div>
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
import { ref } from 'vue'
import ModalCrearEvento from '@/components/eventos/ModalCrearEvento.vue'

const vistaActual = ref('mes')
const mostrarModal = ref(false)
const mesActual = ref('Octubre 2024')
const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']

const horas = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00']

const semana = [
  { nombre: 'Lunes', fecha: '14', esHoy: false },
  { nombre: 'Martes', fecha: '15', esHoy: false },
  { nombre: 'Miércoles', fecha: '16', esHoy: true },
  { nombre: 'Jueves', fecha: '17', esHoy: false },
  { nombre: 'Viernes', fecha: '18', esHoy: false },
  { nombre: 'Sábado', fecha: '19', esHoy: false },
  { nombre: 'Domingo', fecha: '20', esHoy: false }
]

const eventos = ref([
  { id: 1, dia: 2, hora: '09:00', titulo: 'Sync: Design Team', claseColor: 'bg-teal-50 text-teal-700 border-l-2 border-teal-500' },
  { id: 2, dia: 4, hora: '14:00', titulo: 'Proyecto Alpha Review', claseColor: 'bg-indigo-50 text-indigo-700 border-l-2 border-indigo-500' },
  { id: 3, dia: 5, hora: '10:00', titulo: 'Urgent: Board', claseColor: 'bg-red-50 text-red-700 border-l-2 border-red-500' },
  { id: 4, dia: 9, hora: '13:00', titulo: '1:1 con Sarah', claseColor: 'bg-gray-100 text-gray-700 border-l-2 border-gray-400' },
  { id: 5, dia: 11, hora: '15:00', titulo: 'Marketing Workshop', claseColor: 'bg-teal-50 text-teal-700 border-l-2 border-teal-500' },
  { id: 6, dia: 11, hora: '16:30', titulo: 'Task: Update Roadmap', claseColor: 'bg-gray-100 text-gray-700 border-l-2 border-gray-400' },
  { id: 7, dia: 16, hora: '11:00', titulo: 'Discuss Product Analytics', claseColor: 'bg-slate-800 text-white border-l-2 border-slate-400' }
])

let proxId = 8

const abrirModal = () => {
  mostrarModal.value = true
}

const guardarEvento = (datos) => {
  const diaNum = parseInt(datos.fechaInicio.split('-')[2])
  const colores = {
    teal: 'bg-teal-50 text-teal-700 border-l-2 border-teal-500',
    indigo: 'bg-indigo-50 text-indigo-700 border-l-2 border-indigo-500',
    red: 'bg-red-50 text-red-700 border-l-2 border-red-500',
    black: 'bg-slate-800 text-white border-l-2 border-slate-400'
  }
  eventos.value.push({
    id: proxId++,
    dia: diaNum,
    hora: datos.horaInicio,
    titulo: datos.titulo,
    claseColor: colores[datos.color] || colores.teal
  })
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
