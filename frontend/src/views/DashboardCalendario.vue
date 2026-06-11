<template>
  <div class="min-h-screen bg-white flex font-sans text-gray-800">
    
    <!-- ================= BARRA LATERAL (SIDEBAR) ================= -->
    <aside class="w-64 border-r border-gray-200 flex flex-col bg-gray-50/50">
      
      <!-- Cabecera Sidebar (Logo) -->
      <div class="h-16 flex items-center px-6 border-b border-gray-200">
        <div class="bg-black text-white p-1.5 rounded-lg mr-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </div>
        <span class="font-bold text-lg tracking-wide">Agenda Virtual</span>
      </div>

      <div class="p-4 flex-1 overflow-y-auto">
        <!-- Botón Nuevo -->
        <button @click="abrirModal" class="w-full bg-black text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 mb-6 hover:bg-zinc-800 transition">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Nuevo
        </button>

        <!-- Mini Calendario Falso (Representación visual rápida) -->
        <div class="mb-8">
          <div class="flex justify-between items-center mb-4 px-1">
            <span class="text-sm font-bold">Octubre 2024</span>
            <div class="flex gap-2 text-gray-400">
              <button>&lt;</button>
              <button>&gt;</button>
            </div>
          </div>
          <div class="grid grid-cols-7 text-center text-xs text-gray-400 font-medium mb-2">
            <span>D</span><span>L</span><span>M</span><span>M</span><span>J</span><span>V</span><span>S</span>
          </div>
          <div class="grid grid-cols-7 text-center text-xs gap-y-2 text-gray-600">
            <!-- Días de relleno -->
            <span class="text-gray-300">29</span><span class="text-gray-300">30</span>
            <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span>
            <span>6</span><span>7</span><span>8</span><span>9</span><span>10</span><span>11</span><span>12</span>
            <span>13</span><span>14</span><span>15</span><span class="bg-black text-white rounded-full w-6 h-6 flex items-center justify-center mx-auto">16</span><span>17</span><span>18</span><span>19</span>
            <span>20</span><span>21</span><span>22</span><span>23</span><span>24</span><span>25</span><span>26</span>
            <span>27</span><span>28</span><span>29</span><span>30</span><span>31</span><span class="text-gray-300">1</span><span class="text-gray-300">2</span>
          </div>
        </div>

        <!-- Menú Principal -->
        <nav class="space-y-1 mb-8">
          <a href="#" class="flex items-center gap-3 px-3 py-2 text-sm font-medium bg-gray-100 rounded-lg text-gray-900">
            <svg class="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            Eventos
          </a>
          <button @click="$emit('navegar', 'tareas')" class="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg w-full text-left">
            <svg class="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
            Tareas
          </button>
          <button @click="$emit('navegar', 'notas')" class="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg w-full text-left">
            <svg class="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
            Notas
          </button>
          <button @click="$emit('navegar', 'productividad')" class="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg w-full text-left">
            <svg class="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
            Productividad
          </button>
        </nav>

        <!-- Filtros / Categorías -->
        <div>
          <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-3">Mis Categorías</h3>
          <div class="space-y-2 px-3">
            <label class="flex items-center gap-3 text-sm text-gray-600 cursor-pointer">
              <input type="checkbox" checked class="rounded text-black focus:ring-black accent-black w-4 h-4" />
              Todos
            </label>
            <label class="flex items-center gap-3 text-sm text-gray-600 cursor-pointer">
              <input type="checkbox" checked class="rounded text-teal-500 focus:ring-teal-500 accent-teal-500 w-4 h-4" />
              Personal
            </label>
            <label class="flex items-center gap-3 text-sm text-gray-600 cursor-pointer">
              <input type="checkbox" checked class="rounded text-indigo-600 focus:ring-indigo-600 accent-indigo-600 w-4 h-4" />
              Trabajo
            </label>
            <label class="flex items-center gap-3 text-sm text-gray-600 cursor-pointer">
              <input type="checkbox" class="rounded text-orange-400 focus:ring-orange-400 accent-orange-400 w-4 h-4" />
              Estudio
            </label>
          </div>
        </div>
      </div>

      <!-- Footer Sidebar -->
      <div class="p-4 border-t border-gray-200 space-y-2">
        <button class="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg w-full">
          <svg class="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          Ayuda
        </button>
        <button class="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg w-full">
          <svg class="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          Configuración
        </button>
      </div>
    </aside>

    <!-- ================= CONTENIDO PRINCIPAL ================= -->
    <main class="flex-1 flex flex-col h-screen overflow-hidden">
      
      <!-- Cabecera Superior -->
      <header class="h-16 border-b border-gray-200 flex items-center justify-between px-6 bg-white">
        <div class="flex items-center gap-4">
          <button class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50">Hoy</button>
          <div class="flex items-center gap-3 text-lg font-bold text-gray-800">
            <button class="p-1 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100">&lt;</button>
            {{ mesActual }}
            <button class="p-1 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100">&gt;</button>
          </div>
        </div>

        <div class="flex items-center gap-6">
          <!-- Selector de Vista -->
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
          
          <!-- Avatar de Usuario -->
          <div class="w-8 h-8 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-full cursor-pointer border-2 border-white shadow-sm"></div>
        </div>
      </header>

      <!-- ========== VISTA MES ========== -->
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

      <!-- ========== VISTA SEMANA ========== -->
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

      <!-- ========== VISTA DÍA ========== -->
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

    </main>

    <!-- Botón Flotante Extra Inferior Derecho (Signo Más) -->
    <button @click="abrirModal" class="fixed bottom-8 right-8 w-14 h-14 bg-black text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-105 transition-transform">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-8 h-8">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
    </button>

    <ModalCrearEvento v-if="mostrarModal" @cerrar="mostrarModal = false" @guardar="guardarEvento" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ModalCrearEvento from './ModalCrearEvento.vue'

defineEmits(['navegar'])

// Variables Reactivas
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

// Lista de eventos simulados según tu diseño
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
/* Ocultar barra de desplazamiento para los contenedores de eventos */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>