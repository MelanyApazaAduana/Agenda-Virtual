<template>
  <header class="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 shrink-0">
    <div class="flex items-center gap-4">
      <h1 class="font-bold text-lg tracking-wide text-gray-900">Dashboard <span class="text-gray-300 font-normal mx-1">/</span> Notas</h1>
    </div>
    <div class="flex items-center gap-4">
      <button class="w-8 h-8 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-full cursor-pointer shadow-sm"></button>
    </div>
  </header>

  <div class="flex-1 overflow-y-auto p-8">
    <div class="flex justify-between items-center mb-8">
      <div>
        <h2 class="text-3xl font-bold text-gray-900 tracking-tight">Todas las Notas</h2>
        <p class="text-sm text-gray-500 mt-1">Captura ideas, organiza tu conocimiento.</p>
      </div>
      <button @click="mostrarModal = true" class="px-5 py-2.5 text-sm font-bold text-white bg-black rounded-xl hover:bg-zinc-800 transition shadow-lg flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
        Nueva Nota
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="nota in notas" :key="nota.id" class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition cursor-pointer">
        <h3 class="font-bold text-gray-900 mb-2">{{ nota.titulo }}</h3>
        <p class="text-sm text-gray-500 leading-relaxed">{{ nota.contenido }}</p>
        <p class="text-xs text-gray-400 mt-4">{{ nota.fecha }}</p>
      </div>
    </div>
  </div>

  <ModalCrearNota v-if="mostrarModal" @cerrar="mostrarModal = false" @guardar="guardarNota" />
</template>

<script setup>
import { ref } from 'vue'
import ModalCrearNota from '@/components/notas/ModalCrearNota.vue'

const mostrarModal = ref(false)

const notas = ref([
  { id: 1, titulo: 'Ideas para el Dashboard', contenido: 'Integrar gráficos de productividad y un resumen semanal de tareas completadas.', fecha: 'Hoy' },
  { id: 2, titulo: 'Meeting Notes - Sprint Planning', contenido: 'Definir objetivos del sprint, asignar tareas pendientes y revisar el backlog.', fecha: 'Ayer' }
])

let proxId = 3

const guardarNota = (datos) => {
  notas.value.unshift({
    id: proxId++,
    titulo: datos.titulo,
    contenido: datos.contenido,
    fecha: 'Ahora'
  })
}
</script>
