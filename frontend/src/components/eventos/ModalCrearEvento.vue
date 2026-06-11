<template>
  <div class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-sans">
    
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-[550px] overflow-hidden flex flex-col transform transition-all">
      
      <div class="bg-gray-50/80 px-6 py-5 border-b border-gray-200 flex items-start justify-between">
        <div>
          <h2 class="text-[22px] font-bold text-gray-900 leading-tight">Nuevo Evento</h2>
          <p class="text-xs text-gray-500 font-mono mt-1 tracking-wide">Perfecciona tu agenda con precisión</p>
        </div>
        <button @click="$emit('cerrar')" class="text-gray-500 hover:text-gray-800 transition mt-1">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="p-6 space-y-6">
        
        <div>
          <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">Titulo del evento</label>
          <input 
            v-model="formulario.titulo" 
            type="text" 
            placeholder="Reunión" 
            class="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-black focus:border-black outline-none transition text-sm text-gray-800 placeholder-gray-400"
          />
        </div>

        <div class="grid grid-cols-2 gap-5">
          <div>
            <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">Fecha Inicio</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 text-gray-500">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                </svg>
              </div>
              <input 
                v-model="formulario.fechaInicio" 
                type="text" 
                placeholder="dd /mm/aaaa, --:-- --"
                class="w-full pl-9 pr-3 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-black outline-none transition text-sm text-gray-800 placeholder-gray-500"
              />
            </div>
          </div>
          
          <div>
            <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">Fecha Fin</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 text-gray-500">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </div>
              <input 
                v-model="formulario.fechaFin" 
                type="text" 
                placeholder="dd /mm/aaaa, --:-- --"
                class="w-full pl-9 pr-3 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-black outline-none transition text-sm text-gray-800 placeholder-gray-500"
              />
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-5">
          <div>
            <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">Lugar (Optional)</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 text-gray-500">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
              </div>
              <input 
                v-model="formulario.lugar" 
                type="text" 
                placeholder="Conference Room A" 
                class="w-full pl-9 pr-3 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-black outline-none transition text-sm text-gray-400 placeholder-gray-400"
              />
            </div>
          </div>

          <div>
            <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">Categoria</label>
            <div class="relative">
              <select 
                v-model="formulario.categoria"
                class="w-full pl-4 pr-10 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-black outline-none transition text-sm text-gray-800 appearance-none cursor-pointer"
              >
                <option value="work">Work (Deep Blue)</option>
                <option value="personal">Personal</option>
                <option value="design">Design Team</option>
              </select>
              <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 text-gray-500">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div>
          <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">Recordatorios</label>
          <div class="flex items-center gap-3">
            
            <label class="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition">
              <input 
                type="checkbox" 
                v-model="formulario.rec15min" 
                class="w-4 h-4 text-teal-700 rounded border-gray-300 focus:ring-teal-700 accent-teal-700"
              >
              <span class="text-sm text-gray-700 font-medium">15min antes</span>
            </label>

            <label class="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition">
              <input 
                type="checkbox" 
                v-model="formulario.rec1h" 
                class="w-4 h-4 rounded border-gray-300 text-teal-700 focus:ring-teal-700 accent-teal-700"
              >
              <span class="text-sm text-gray-700 font-medium">1h antes</span>
            </label>

            <button class="text-sm font-medium text-teal-700 hover:text-teal-800 flex items-center gap-1 ml-2 font-mono tracking-tight">
              + Añadir recordatorio
            </button>
          </div>
        </div>

        <div class="pt-6 border-t border-gray-200 flex justify-end items-center gap-6 mt-2">
          <button 
            @click="$emit('cerrar')" 
            class="text-sm font-bold text-gray-600 hover:text-gray-900 transition"
          >
            Cancelar
          </button>
          <button 
            @click="guardarEvento" 
            class="px-6 py-2.5 text-sm font-bold text-white bg-black rounded-xl hover:bg-zinc-800 transition shadow-lg shadow-black/10"
          >
            Guardar Evento
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['cerrar', 'guardar'])

const formulario = ref({
  titulo: '',
  fechaInicio: '',
  fechaFin: '',
  lugar: '',
  categoria: 'work',
  rec15min: true,
  rec1h: false
})

const guardarEvento = () => {
  if (!formulario.value.titulo) {
    alert('El título es requerido')
    return
  }
  emit('guardar', formulario.value)
  emit('cerrar')
}
</script>
