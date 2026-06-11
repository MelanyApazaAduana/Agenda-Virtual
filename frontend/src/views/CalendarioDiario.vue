<template>
  <div class="min-h-screen bg-white flex font-sans text-gray-800">
    
    <aside class="w-64 border-r border-gray-200 flex flex-col bg-gray-50/50 hidden lg:flex shrink-0">
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
            <span>13</span><span>14</span><span>15</span><span class="bg-black text-white rounded-full w-6 h-6 flex items-center justify-center mx-auto">16</span><span>17</span><span>18</span><span>19</span>
            <span>20</span><span>21</span><span>22</span><span>23</span><span>24</span><span>25</span><span>26</span>
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
              <input type="checkbox" checked class="rounded text-black focus:ring-black accent-black w-4 h-4" /> Work (Chronos)
            </label>
            <label class="flex items-center gap-3 text-sm text-gray-600 cursor-pointer">
              <input type="checkbox" class="rounded text-gray-300 focus:ring-gray-300 accent-gray-300 w-4 h-4" /> Deadlines
            </label>
          </div>
        </div>
      </div>
    </aside>

    <main class="flex-1 flex flex-col h-screen overflow-hidden border-r border-gray-200">
      
      <header class="h-16 border-b border-gray-200 flex items-center justify-between px-6 bg-white shrink-0">
        <div class="flex items-center gap-4">
          <button class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50">Hoy</button>
          <div class="flex items-center gap-3 text-lg font-bold text-gray-800">
            <button class="p-1 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100">&lt;</button>
            16 Octubre 2024
            <button class="p-1 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100">&gt;</button>
          </div>
        </div>

        <div class="flex bg-gray-100 p-1 rounded-lg">
          <button class="px-4 py-1.5 text-sm font-medium bg-white text-gray-900 rounded-md shadow-sm">Día</button>
          <button class="px-4 py-1.5 text-sm font-medium text-gray-500 rounded-md hover:text-gray-900">Semana</button>
          <button class="px-4 py-1.5 text-sm font-medium text-gray-500 rounded-md hover:text-gray-900">Mes</button>
        </div>
      </header>

      <div class="flex-1 overflow-y-auto relative bg-white pb-10">
        
        <div class="flex relative min-h-[800px] mt-4">
          
          <div class="w-20 shrink-0 flex flex-col text-xs text-gray-400 font-medium items-end pr-4">
            <div v-for="hora in horas" :key="hora" class="h-24 relative w-full">
              <span class="absolute -top-2 right-4">{{ hora }}</span>
            </div>
          </div>

          <div class="flex-1 relative border-l border-gray-100">
            <div v-for="hora in horas" :key="hora" class="h-24 border-t border-gray-100"></div>

            <div class="absolute left-4 right-4 top-[96px] h-[144px] z-10"> <div class="bg-teal-50/80 border-l-4 border-teal-500 rounded-r-lg p-4 h-full shadow-sm hover:shadow-md transition cursor-pointer">
                <h4 class="font-bold text-teal-900 text-sm">Sync: Design Team</h4>
                <p class="text-teal-700 text-xs mt-1">Room 402 • Zoom</p>
                <div class="flex -space-x-2 mt-3">
                  <div class="w-6 h-6 rounded-full bg-blue-400 border border-white"></div>
                  <div class="w-6 h-6 rounded-full bg-orange-400 border border-white"></div>
                </div>
              </div>
            </div>

            <div class="absolute left-4 right-4 top-[288px] h-[144px] z-10"> <div class="bg-gray-100 border-l-4 border-gray-800 rounded-r-lg p-4 h-full shadow-sm hover:shadow-md transition cursor-pointer">
                <h4 class="font-bold text-gray-900 text-sm">Project Alpha Launch</h4>
                <p class="text-gray-600 text-xs mt-1">Main Hallway • Stakeholder Review</p>
                <div class="flex items-center gap-3 mt-3">
                  <span class="text-[10px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded text-red-600 tracking-wider">HIGH PRIORITY</span>
                  <span class="text-[10px] text-gray-500 font-medium">IN-PERSON</span>
                </div>
              </div>
            </div>

            <div class="absolute left-4 right-4 top-[624px] h-[96px] z-10"> <div class="bg-indigo-50 border-l-4 border-indigo-500 rounded-r-lg p-4 h-full shadow-sm hover:shadow-md transition cursor-pointer flex justify-between items-start">
                <div>
                  <h4 class="font-bold text-indigo-900 text-sm">Client Call: TechGlobal</h4>
                  <p class="text-indigo-600 text-xs mt-1">External Meet Link</p>
                </div>
                <div class="text-indigo-400">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4"><path fill-rule="evenodd" d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z" clip-rule="evenodd" /></svg>
                </div>
              </div>
            </div>

            <div class="absolute w-full border-t-2 border-teal-500 z-20 flex items-center" style="top: 240px;"> <div class="w-3 h-3 rounded-full bg-teal-500 -ml-1.5 border-2 border-white"></div>
            </div>

          </div>
        </div>
      </div>
    </main>

    <aside class="w-80 bg-gray-50/30 flex flex-col h-screen overflow-y-auto hidden xl:flex shrink-0">
      
      <div class="h-16 flex items-center justify-end px-6">
        <div class="flex items-center gap-4">
          <button class="text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" /></svg>
          </button>
          <div class="w-8 h-8 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-full cursor-pointer border-2 border-white shadow-sm"></div>
        </div>
      </div>

      <div class="p-6 space-y-8">
        
        <div>
          <div class="flex justify-between items-center mb-4">
            <h3 class="font-bold text-gray-800">Tareas para hoy</h3>
            <button class="text-gray-400 hover:text-gray-600">-</button>
          </div>
          <div class="space-y-3">
            <label class="flex items-start gap-3 p-3 bg-white border border-gray-100 rounded-xl shadow-sm cursor-pointer hover:border-gray-300 transition">
              <input type="checkbox" class="mt-1 rounded text-teal-600 focus:ring-teal-600 w-4 h-4" />
              <div class="flex-1">
                <p class="text-sm text-gray-700 font-medium">Review Alpha documentation</p>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 text-gray-400"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>
            </label>
            <label class="flex items-start gap-3 p-3 bg-white border border-gray-100 rounded-xl shadow-sm cursor-pointer hover:border-gray-300 transition opacity-60">
              <input type="checkbox" checked class="mt-1 rounded text-teal-600 focus:ring-teal-600 w-4 h-4" />
              <div class="flex-1 line-through">
                <p class="text-sm text-gray-500 font-medium">Order coffee for tomorrow's workshop</p>
              </div>
            </label>
            <button class="w-full text-left text-sm text-gray-400 font-medium hover:text-black mt-2 flex items-center gap-2 px-2">
              <span>+</span> Añadir una nueva tarea
            </button>
          </div>
        </div>

        <div>
          <div class="flex justify-between items-center mb-4">
            <h3 class="font-bold text-gray-800">Notas Diarias</h3>
            <button class="text-xs text-teal-600 font-semibold hover:underline">Ver todas</button>
          </div>
          <div class="space-y-4">
            <div class="bg-indigo-50/60 p-4 rounded-xl">
              <h4 class="text-sm font-bold text-indigo-900 mb-2">Alpha Launch Prep</h4>
              <p class="text-xs text-indigo-700/80 leading-relaxed">
                Remember to double-check the server latency metrics before the 11:00 AM stakeholder review. Marco has the logs.
              </p>
            </div>
            <div class="bg-gray-100/80 p-4 rounded-xl">
              <h4 class="text-sm font-bold text-gray-800 mb-2">Design Feedback</h4>
              <ul class="text-xs text-gray-600 leading-relaxed list-disc pl-3 space-y-1">
                <li>Use more spacing in the grid</li>
                <li>Dark mode needs better contrast</li>
                <li>FAB position is perfect</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="bg-black text-white rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div class="relative z-10">
            <h3 class="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-1">PRODUCTIVITY SCORE</h3>
            <div class="flex items-baseline gap-2 mb-3">
              <span class="text-3xl font-bold">84%</span>
              <span class="text-xs text-teal-400 font-medium">+12% vs yesterday</span>
            </div>
            <p class="text-xs text-gray-400">You've completed 3 out of 5 core tasks today. Keep going!</p>
          </div>
          <button class="absolute bottom-4 right-4 bg-white/10 hover:bg-white/20 text-white w-8 h-8 rounded-full flex items-center justify-center transition backdrop-blur-sm">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          </button>
        </div>

      </div>
    </aside>

  </div>
</template>

<script setup>
import { ref } from 'vue'

// Definimos las horas del día de 08:00 a 17:00
const horas = ref([
  '08:00', '09:00', '10:00', '11:00', '12:00', 
  '13:00', '14:00', '15:00', '16:00', '17:00'
])
</script>

<style scoped>
/* Estilos para el scrollbar */
::-webkit-scrollbar {
  width: 4px;
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