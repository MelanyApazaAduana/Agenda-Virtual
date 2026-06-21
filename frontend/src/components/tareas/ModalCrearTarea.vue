<template>
  <div class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-sans">
    
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-[550px] overflow-hidden flex flex-col transform transition-all">
      
      <div class="bg-gray-50/80 px-6 py-5 border-b border-gray-200 flex items-start justify-between">
        <div>
          <h2 class="text-[22px] font-bold text-gray-900 leading-tight">Nueva Tarea</h2>
          <p class="text-xs text-gray-500 font-mono mt-1 tracking-wide">Break down your projects into actionable steps.</p>
        </div>
        <button @click="$emit('cerrar')" class="text-gray-500 hover:text-gray-800 transition mt-1">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="p-6 space-y-6 overflow-y-auto max-h-[75vh]">
        
        <div>
          <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">Nombre de la tarea</label>
          <input 
            v-model="formulario.nombre" 
            type="text" 
            placeholder="Ej. Finalizar presentación" 
            class="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-black focus:border-black outline-none transition text-sm text-gray-800 placeholder-gray-400"
          />
        </div>

        <div>
          <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">Prioridad</label>
          <div class="grid grid-cols-3 gap-3">
            <button 
              @click="formulario.prioridad = 'alta'"
              type="button"
              :class="formulario.prioridad === 'alta' 
                ? 'bg-red-50 border-red-200 text-red-700 ring-1 ring-red-500' 
                : 'bg-gray-50/50 border-gray-200 text-gray-600 hover:bg-gray-100'"
              class="flex items-center justify-center gap-2 py-2.5 border rounded-lg transition font-medium text-sm"
            >
              <div class="w-2 h-2 rounded-full" :class="formulario.prioridad === 'alta' ? 'bg-red-600' : 'bg-gray-400'"></div>
              Alta
            </button>
            
            <button 
              @click="formulario.prioridad = 'media'"
              type="button"
              :class="formulario.prioridad === 'media' 
                ? 'bg-orange-50 border-orange-200 text-orange-700 ring-1 ring-orange-500' 
                : 'bg-gray-50/50 border-gray-200 text-gray-600 hover:bg-gray-100'"
              class="flex items-center justify-center gap-2 py-2.5 border rounded-lg transition font-medium text-sm"
            >
              <div class="w-2 h-2 rounded-full" :class="formulario.prioridad === 'media' ? 'bg-orange-500' : 'bg-gray-400'"></div>
              Media
            </button>

            <button 
              @click="formulario.prioridad = 'baja'"
              type="button"
              :class="formulario.prioridad === 'baja' 
                ? 'bg-teal-50 border-teal-200 text-teal-700 ring-1 ring-teal-500' 
                : 'bg-gray-50/50 border-gray-200 text-gray-600 hover:bg-gray-100'"
              class="flex items-center justify-center gap-2 py-2.5 border rounded-lg transition font-medium text-sm"
            >
              <div class="w-2 h-2 rounded-full" :class="formulario.prioridad === 'baja' ? 'bg-teal-500' : 'bg-gray-400'"></div>
              Baja
            </button>
          </div>
        </div>

        <div>
          <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">Fecha de Vencimiento</label>
          <div class="relative">
            <div @click="abrirSelectorFecha" class="absolute inset-y-0 left-0 pl-3 flex items-center cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 text-gray-500">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
              </svg>
            </div>
            <input
              ref="inputFecha"
              v-model="formulario.fechaVencimiento"
              type="datetime-local"
              class="w-full pl-9 pr-3 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-black outline-none transition text-sm text-gray-800 cursor-pointer"
            />
          </div>
        </div>

        <div>
          <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">Etiquetas</label>
          <div class="flex flex-wrap gap-2 items-center bg-gray-50/50 border border-gray-200 rounded-lg p-2 focus-within:bg-white focus-within:ring-1 focus-within:ring-black focus-within:border-black transition">
            
            <span class="flex items-center gap-1 px-2.5 py-1 bg-indigo-100 text-indigo-700 rounded text-xs font-medium">
              #Design
              <button class="hover:bg-indigo-200 rounded-full p-0.5"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-3 h-3"><path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" /></svg></button>
            </span>

            <span class="flex items-center gap-1 px-2.5 py-1 bg-red-100 text-red-700 rounded text-xs font-medium">
              #Urgent
              <button class="hover:bg-red-200 rounded-full p-0.5"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-3 h-3"><path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" /></svg></button>
            </span>

            <input 
              type="text" 
              placeholder="Añadir etiqueta..." 
              class="flex-1 bg-transparent min-w-[120px] text-sm text-gray-800 outline-none placeholder-gray-400 py-1"
            />
          </div>
        </div>

        <div>
          <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">Descripción</label>
          <textarea 
            v-model="formulario.descripcion" 
            rows="3" 
            placeholder="Añade detalles sobre la tarea..." 
            class="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-black focus:border-black outline-none transition text-sm text-gray-800 placeholder-gray-400 resize-none"
          ></textarea>
        </div>

        <div class="pt-6 border-t border-gray-200 flex justify-end items-center gap-6 mt-2">
          <button 
            @click="$emit('cerrar')" 
            class="text-sm font-bold text-gray-600 hover:text-gray-900 transition"
          >
            Cancelar
          </button>
          <button 
            @click="crearTarea" 
            class="px-6 py-2.5 text-sm font-bold text-white bg-black rounded-xl hover:bg-zinc-800 transition shadow-lg shadow-black/10"
          >
            Crear Tarea
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['cerrar', 'guardar'])

const inputFecha = ref(null)

const formulario = ref({
  nombre: '',
  prioridad: 'alta',
  fechaVencimiento: '', 
  etiquetas: ['Design', 'Urgent'],
  descripcion: ''
})

const abrirSelectorFecha = () => {
  inputFecha.value?.showPicker?.()
}

const crearTarea = () => {
  if (!formulario.value.nombre) {
    alert('El nombre de la tarea es obligatorio.')
    return
  }
  emit('guardar', formulario.value)
  emit('cerrar')
}
</script>
