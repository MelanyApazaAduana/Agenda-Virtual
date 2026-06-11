<template>
  <div class="min-h-screen bg-gray-50 flex font-sans text-gray-800">
    <aside class="w-64 bg-white border-r border-gray-200 flex flex-col shrink-0 hidden md:flex">
      <div class="h-20 flex items-center px-6 border-b border-gray-100">
        <div class="bg-black text-white p-2 rounded-lg mr-3 shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
        </div>
        <div>
          <h2 class="font-bold text-gray-900 leading-tight">Workspace</h2>
          <p class="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Enterprise Plan</p>
        </div>
      </div>
      <nav class="p-4 flex-1 space-y-1">
        <button @click="$emit('navegar', 'calendario')" class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg w-full text-left">
          <svg class="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> Calendario
        </button>
        <button @click="$emit('navegar', 'tareas')" class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg w-full text-left">
          <svg class="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg> Tareas
        </button>
        <button class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium bg-slate-900 text-white rounded-lg shadow-md w-full text-left">
          <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg> Notas
        </button>
        <button @click="$emit('navegar', 'productividad')" class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg w-full text-left">
          <svg class="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" /></svg> Productividad
        </button>
        <button @click="$emit('navegar', 'usuarios')" class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg w-full text-left">
          <svg class="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" /></svg> Usuarios
        </button>
      </nav>
    </aside>

    <main class="flex-1 flex flex-col h-screen overflow-hidden">
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
    </main>

    <ModalCrearNota v-if="mostrarModal" @cerrar="mostrarModal = false" @guardar="guardarNota" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ModalCrearNota from './ModalCrearNota.vue'

defineEmits(['navegar'])

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
