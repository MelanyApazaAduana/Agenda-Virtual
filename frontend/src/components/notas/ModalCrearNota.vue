<template>
  <div class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-sans">
    
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-[600px] overflow-hidden flex flex-col transform transition-all">
      
      <div class="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="bg-slate-900 text-white p-1.5 rounded-lg shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
          </div>
          <h2 class="text-[18px] font-bold text-gray-900">Nueva Nota</h2>
        </div>
        <button @click="$emit('cerrar')" class="text-gray-400 hover:text-gray-800 transition">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="p-6 space-y-6">
        
        <div>
          <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">Título de la nota</label>
          <input 
            v-model="formulario.titulo" 
            type="text" 
            placeholder="Ingresa un título descriptivo..." 
            class="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-teal-500 focus:border-teal-500 outline-none transition text-sm text-gray-800 placeholder-gray-300"
          />
        </div>

        <div class="flex items-center justify-between">
          <div>
            <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">Categoría</label>
            <div class="flex items-center gap-2">
              <button 
                @click="formulario.categoria = 'trabajo'"
                type="button"
                :class="formulario.categoria === 'trabajo' ? 'bg-teal-50 text-teal-700 border-teal-200' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'"
                class="px-4 py-1.5 border rounded-full text-xs font-semibold transition"
              >
                Trabajo
              </button>
              <button 
                @click="formulario.categoria = 'personal'"
                type="button"
                :class="formulario.categoria === 'personal' ? 'bg-teal-50 text-teal-700 border-teal-200' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'"
                class="px-4 py-1.5 border rounded-full text-xs font-semibold transition"
              >
                Personal
              </button>
              <button 
                @click="formulario.categoria = 'ideas'"
                type="button"
                :class="formulario.categoria === 'ideas' ? 'bg-teal-50 text-teal-700 border-teal-200' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'"
                class="px-4 py-1.5 border rounded-full text-xs font-semibold transition"
              >
                Ideas
              </button>
              <button type="button" class="w-7 h-7 flex items-center justify-center border border-gray-200 rounded-full text-gray-500 hover:bg-gray-50 transition">
                +
              </button>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <span class="text-[11px] font-bold text-gray-500 uppercase tracking-widest mt-1">Fijar arriba</span>
            <label class="relative inline-flex items-center cursor-pointer mt-1">
              <input type="checkbox" v-model="formulario.fijar" class="sr-only peer">
              <div class="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-500"></div>
            </label>
          </div>
        </div>

        <div>
          <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">Contenido</label>
          <div class="border border-gray-200 rounded-lg overflow-hidden focus-within:border-teal-500 focus-within:ring-1 focus-within:ring-teal-500 transition">
            
            <textarea 
              v-model="formulario.contenido" 
              rows="5" 
              placeholder="Empieza a escribir tus ideas aquí..." 
              class="w-full px-4 py-3 outline-none text-sm text-gray-800 placeholder-gray-300 resize-none"
            ></textarea>
            
            <div class="px-3 py-2 border-t border-gray-100 flex items-center gap-2 bg-gray-50/50">
              <button type="button" class="p-1.5 text-gray-500 hover:text-gray-800 hover:bg-gray-200 rounded transition font-serif font-bold text-sm w-7 h-7 flex items-center justify-center">B</button>
              <button type="button" class="p-1.5 text-gray-500 hover:text-gray-800 hover:bg-gray-200 rounded transition font-serif italic text-sm w-7 h-7 flex items-center justify-center">I</button>
              <button type="button" class="p-1.5 text-gray-500 hover:text-gray-800 hover:bg-gray-200 rounded transition flex items-center justify-center w-7 h-7">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" /></svg>
              </button>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <button type="button" class="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 transition">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>
            Texto
          </button>
          <button type="button" class="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 transition">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" /></svg>
            Foto
          </button>
          <button type="button" class="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 transition">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" /></svg>
            Audio
          </button>
        </div>

      </div>

      <div class="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-white">
        <div class="flex items-center gap-1.5 text-gray-400 text-xs font-medium">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
          Último autoguardado hace 2m
        </div>
        
        <div class="flex items-center gap-4">
          <button 
            @click="$emit('cerrar')" 
            class="text-sm font-bold text-gray-600 hover:text-gray-900 transition"
          >
            Cancelar
          </button>
          <button 
            @click="guardarNota" 
            class="px-6 py-2.5 text-sm font-bold text-white bg-black rounded-xl hover:bg-zinc-800 transition shadow-lg shadow-black/10"
          >
            Guardar Nota
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
  categoria: 'trabajo',
  fijar: false,
  contenido: ''
})

const guardarNota = () => {
  if (!formulario.value.titulo) {
    alert('El título de la nota es obligatorio.')
    return
  }
  emit('guardar', formulario.value)
  emit('cerrar')
}
</script>
