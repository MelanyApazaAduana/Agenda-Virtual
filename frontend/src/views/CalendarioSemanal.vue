<template>
  <div class="min-h-screen bg-white flex font-sans text-gray-800">
    
    <main class="flex-1 flex flex-col h-screen overflow-hidden">
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