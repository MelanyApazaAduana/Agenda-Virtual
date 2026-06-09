<template>
  <div class="min-h-screen bg-white flex font-sans text-gray-800">
    
    <aside class="w-64 border-r border-gray-200 flex flex-col bg-gray-50/50 hidden md:flex">
      <div class="h-16 flex items-center px-6 border-b border-gray-200">
        <div class="bg-black text-white p-1.5 rounded-lg mr-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </div>
        <span class="font-bold text-lg tracking-wide">ChronosAI</span>
      </div>

      <div class="p-4 flex-1 overflow-y-auto">
        <button class="w-full bg-black text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 mb-6 hover:bg-zinc-800 transition">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Nuevo
        </button>

        <div class="mb-8">
          <div class="flex justify-between items-center mb-4 px-1">
            <span class="text-sm font-bold">Octubre 2024</span>
            <div class="flex gap-2 text-gray-400">
              <button>&lt;</button><button>&gt;</button>
            </div>
          </div>
          <div class="grid grid-cols-7 text-center text-xs text-gray-400 font-medium mb-2">
            <span>D</span><span>L</span><span>M</span><span>M</span><span>J</span><span>V</span><span>S</span>
          </div>
          <div class="grid grid-cols-7 text-center text-xs gap-y-2 text-gray-600">
            <span class="text-gray-300">29</span><span class="text-gray-300">30</span>
            <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span>
            <span>6</span><span>7</span><span>8</span><span>9</span><span>10</span><span>11</span><span>12</span>
            <span>13</span><span class="font-bold text-black">14</span><span class="font-bold text-black">15</span><span class="bg-black text-white rounded-full w-6 h-6 flex items-center justify-center mx-auto">16</span><span class="font-bold text-black">17</span><span class="font-bold text-black">18</span><span class="font-bold text-black">19</span>
            <span class="font-bold text-black">20</span><span>21</span><span>22</span><span>23</span><span>24</span><span>25</span><span>26</span>
            <span>27</span><span>28</span><span>29</span><span>30</span><span>31</span><span class="text-gray-300">1</span><span class="text-gray-300">2</span>
          </div>
        </div>

        <nav class="space-y-1 mb-8">
          <a href="#" class="flex items-center gap-3 px-3 py-2 text-sm font-medium bg-gray-100 rounded-lg text-gray-900">Eventos</a>
          <a href="#" class="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg">Tareas</a>
          <a href="#" class="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg">Notas</a>
          <a href="#" class="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg">Productividad</a>
        </nav>

        <div>
          <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-3">Mis Calendarios</h3>
          <div class="space-y-2 px-3">
            <label class="flex items-center gap-3 text-sm text-gray-600 cursor-pointer">
              <input type="checkbox" checked class="rounded text-teal-500 focus:ring-teal-500 accent-teal-500 w-4 h-4" /> Personal
            </label>
            <label class="flex items-center gap-3 text-sm text-gray-600 cursor-pointer">
              <input type="checkbox" checked class="rounded text-black focus:ring-black accent-black w-4 h-4" /> Trabajo (Chronos)
            </label>
            <label class="flex items-center gap-3 text-sm text-gray-600 cursor-pointer">
              <input type="checkbox" class="rounded text-gray-300 focus:ring-gray-300 accent-gray-300 w-4 h-4" /> Deadlines
            </label>
          </div>
        </div>
      </div>
    </aside>

    <main class="flex-1 flex flex-col h-screen overflow-hidden">
      
      <header class="h-16 border-b border-gray-200 flex items-center justify-between px-6 bg-white shrink-0">
        <div class="flex items-center gap-4">
          <button class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50">Hoy</button>
          <div class="flex items-center gap-3 text-lg font-bold text-gray-800">
            <button class="p-1 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100">&lt;</button>
            {{ semanaActual }}
            <button class="p-1 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100">&gt;</button>
          </div>
        </div>

        <div class="flex items-center gap-6">
          <div class="flex bg-gray-100 p-1 rounded-lg">
            <button class="px-4 py-1.5 text-sm font-medium text-gray-500 rounded-md hover:text-gray-900">Día</button>
            <button class="px-4 py-1.5 text-sm font-medium bg-white text-gray-900 rounded-md shadow-sm">Semana</button>
            <button class="px-4 py-1.5 text-sm font-medium text-gray-500 rounded-md hover:text-gray-900">Mes</button>
          </div>
          <div class="w-8 h-8 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-full border-2 border-white shadow-sm cursor-pointer"></div>
        </div>
      </header>

      <div class="flex-1 flex flex-col overflow-auto bg-white relative">
        
        <div class="flex border-b border-gray-200 bg-white sticky top-0 z-10">
          <div class="w-16 shrink-0 border-r border-gray-200"></div> <div class="flex-1 grid grid-cols-7">
            <div v-for="dia in diasSemana" :key="dia.fecha" class="text-center py-3 border-r border-gray-200 last:border-0 flex flex-col items-center">
              <span class="text-xs font-bold text-gray-400 uppercase tracking-widest">{{ dia.nombre }}</span>
              <span class="text-xl mt-1" :class="dia.esHoy ? 'bg-black text-white w-8 h-8 flex items-center justify-center rounded-full' : 'text-gray-700 font-medium'">
                {{ dia.fecha }}
              </span>
            </div>
          </div>
        </div>

        <div class="flex flex-1 relative min-h-[800px]">
          
          <div class="w-16 shrink-0 border-r border-gray-200 flex flex-col text-xs text-gray-400 font-medium bg-gray-50/30">
            <div v-for="hora in horas" :key="hora" class="h-20 border-b border-gray-200 flex justify-center pt-2">
              {{ hora }}
            </div>
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
    </main>

    <button class="fixed bottom-8 right-8 w-14 h-14 bg-black text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-105 transition-transform z-50">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-8 h-8">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
    </button>

  </div>
</template>

<script setup>
import { ref } from 'vue'

// Título de la cabecera
const semanaActual = ref('14 - 20 Octubre 2024')

// Definición de las horas de la columna izquierda (de 08:00 a 17:00 para simular el PDF)
const horas = ref([
  '08:00', '09:00', '10:00', '11:00', '12:00', 
  '13:00', '14:00', '15:00', '16:00', '17:00'
])

// Días de la semana que se mostrarán en la cabecera sticky
const diasSemana = ref([
  { nombre: 'Lunes', fecha: '14', esHoy: false },
  { nombre: 'Martes', fecha: '15', esHoy: false },
  { nombre: 'Miércoles', fecha: '16', esHoy: true }, // El 16 está marcado de negro
  { nombre: 'Jueves', fecha: '17', esHoy: false },
  { nombre: 'Viernes', fecha: '18', esHoy: false },
  { nombre: 'Sábado', fecha: '19', esHoy: false },
  { nombre: 'Domingo', fecha: '20', esHoy: false }
])
</script>

<style scoped>
/* Para esconder la barra de scroll y mantener el diseño limpio */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #e5e7eb;
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: #d1d5db;
}
</style>