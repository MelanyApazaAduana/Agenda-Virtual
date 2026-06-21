<template>
  <div class="min-h-screen bg-white flex font-sans text-gray-800">
    
    <main class="flex-1 flex flex-col h-screen overflow-hidden border-r border-gray-200">

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