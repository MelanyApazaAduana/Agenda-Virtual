<template>
  <div class="fixed bottom-8 right-8 z-40 flex flex-col items-end gap-2">
    <div v-if="tipo === null && abierto" class="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden mb-2">
      <button @click="emit('crear', 'evento')"
        class="flex items-center gap-3 px-5 py-3 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700 w-full text-left transition border-b border-gray-100">
        <span class="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Nuevo Evento
      </button>
      <button @click="emit('crear', 'tarea')"
        class="flex items-center gap-3 px-5 py-3 text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-700 w-full text-left transition border-b border-gray-100">
        <span class="w-2.5 h-2.5 rounded-full bg-green-500"></span> Nueva Tarea
      </button>
      <button @click="emit('crear', 'nota')"
        class="flex items-center gap-3 px-5 py-3 text-sm font-medium text-gray-700 hover:bg-yellow-50 hover:text-yellow-700 w-full text-left transition">
        <span class="w-2.5 h-2.5 rounded-full bg-yellow-500"></span> Nueva Nota
      </button>
    </div>
    <button @click="handleClick"
      class="w-14 h-14 bg-black text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-105 transition-transform">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-8 h-8">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  tipo: { type: String, default: null }
})
const emit = defineEmits(['crear'])
const abierto = ref(false)

const handleClick = () => {
  if (props.tipo) {
    emit('crear', props.tipo)
  } else {
    abierto.value = !abierto.value
  }
}
</script>
