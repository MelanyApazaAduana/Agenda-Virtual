<template>
  <div class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-sans">
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-[550px] overflow-hidden flex flex-col transform transition-all">
      <div class="bg-gray-50/80 px-6 py-5 border-b border-gray-200 flex items-start justify-between">
        <div>
          <h2 class="text-[22px] font-bold text-gray-900 leading-tight">Nueva Categoría</h2>
          <p class="text-xs text-gray-500 font-mono mt-1 tracking-wide">Organiza tus elementos con categorías personalizadas.</p>
        </div>
        <button @click="$emit('cerrar')" class="text-gray-500 hover:text-gray-800 transition mt-1">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="p-6 space-y-6 overflow-y-auto max-h-[75vh]">
        <div>
          <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">Nombre</label>
          <input
            v-model="formulario.nombre"
            type="text"
            maxlength="50"
            placeholder="Ej. Trabajo, Personal, Viajes"
            class="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-black focus:border-black outline-none transition text-sm text-gray-800 placeholder-gray-400"
          />
        </div>

        <div>
          <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">Color</label>
          <div class="flex items-center gap-4">
            <div class="relative">
              <input
                v-model="formulario.color_hex"
                type="color"
                class="w-11 h-11 rounded-lg border border-gray-200 cursor-pointer bg-transparent p-0.5"
              />
            </div>
            <input
              v-model="formulario.color_hex"
              type="text"
              maxlength="7"
              placeholder="#3B82F6"
              class="flex-1 px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-black focus:border-black outline-none transition text-sm text-gray-800 placeholder-gray-400 font-mono uppercase"
            />
          </div>
        </div>

        <div>
          <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">Ícono</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 text-gray-500">
                <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </div>
            <input
              v-model="formulario.icono"
              type="text"
              maxlength="50"
              placeholder="Ej. work, home, school, star"
              class="w-full pl-9 pr-3 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-black focus:border-black outline-none transition text-sm text-gray-800 placeholder-gray-400"
            />
          </div>
        </div>

        <div>
          <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">Tipo aplicable</label>
          <div class="grid grid-cols-5 gap-2">
            <button
              @click="formulario.tipo_aplicable = 'todos'"
              type="button"
              :class="formulario.tipo_aplicable === 'todos'
                ? 'bg-gray-800 border-gray-800 text-white ring-1 ring-gray-800'
                : 'bg-gray-50/50 border-gray-200 text-gray-600 hover:bg-gray-100'"
              class="flex flex-col items-center gap-1 py-2.5 border rounded-lg transition font-medium text-xs"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
              </svg>
              Todos
            </button>

            <button
              @click="formulario.tipo_aplicable = 'evento'"
              type="button"
              :class="formulario.tipo_aplicable === 'evento'
                ? 'bg-violet-600 border-violet-600 text-white ring-1 ring-violet-600'
                : 'bg-gray-50/50 border-gray-200 text-gray-600 hover:bg-gray-100'"
              class="flex flex-col items-center gap-1 py-2.5 border rounded-lg transition font-medium text-xs"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
              </svg>
              Evento
            </button>

            <button
              @click="formulario.tipo_aplicable = 'tarea'"
              type="button"
              :class="formulario.tipo_aplicable === 'tarea'
                ? 'bg-blue-600 border-blue-600 text-white ring-1 ring-blue-600'
                : 'bg-gray-50/50 border-gray-200 text-gray-600 hover:bg-gray-100'"
              class="flex flex-col items-center gap-1 py-2.5 border rounded-lg transition font-medium text-xs"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              Tarea
            </button>

            <button
              @click="formulario.tipo_aplicable = 'gasto'"
              type="button"
              :class="formulario.tipo_aplicable === 'gasto'
                ? 'bg-red-600 border-red-600 text-white ring-1 ring-red-600'
                : 'bg-gray-50/50 border-gray-200 text-gray-600 hover:bg-gray-100'"
              class="flex flex-col items-center gap-1 py-2.5 border rounded-lg transition font-medium text-xs"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.281 5.941" />
              </svg>
              Gasto
            </button>

            <button
              @click="formulario.tipo_aplicable = 'ingreso'"
              type="button"
              :class="formulario.tipo_aplicable === 'ingreso'
                ? 'bg-emerald-600 border-emerald-600 text-white ring-1 ring-emerald-600'
                : 'bg-gray-50/50 border-gray-200 text-gray-600 hover:bg-gray-100'"
              class="flex flex-col items-center gap-1 py-2.5 border rounded-lg transition font-medium text-xs"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              Ingreso
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
            @click="crearCategoria"
            class="px-6 py-2.5 text-sm font-bold text-white bg-black rounded-xl hover:bg-zinc-800 transition shadow-lg shadow-black/10"
          >
            Crear Categoría
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
  nombre: '',
  color_hex: '#3B82F6',
  icono: '',
  tipo_aplicable: 'todos'
})

const crearCategoria = () => {
  if (!formulario.value.nombre.trim()) {
    alert('El nombre de la categoría es obligatorio.')
    return
  }
  emit('guardar', { ...formulario.value })
  emit('cerrar')
}
</script>
