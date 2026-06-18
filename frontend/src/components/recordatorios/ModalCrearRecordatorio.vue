<template>
  <div class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-sans">
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-[550px] overflow-hidden flex flex-col transform transition-all">

      <div class="bg-gray-50/80 px-6 py-5 border-b border-gray-200 flex items-start justify-between">
        <div>
          <h2 class="text-[22px] font-bold text-gray-900 leading-tight">Nuevo Recordatorio</h2>
          <p class="text-xs text-gray-500 font-mono mt-1 tracking-wide">Nunca olvides lo importante</p>
        </div>
        <button @click="$emit('cerrar')" class="text-gray-500 hover:text-gray-800 transition mt-1">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="p-6 space-y-6 overflow-y-auto max-h-[75vh]">

        <div>
          <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">Tipo de entidad</label>
          <div class="grid grid-cols-3 gap-3">
            <button
              @click="formulario.tipoEntidad = 'evento'"
              type="button"
              :class="formulario.tipoEntidad === 'evento'
                ? 'bg-violet-50 border-violet-200 text-violet-700 ring-1 ring-violet-500'
                : 'bg-gray-50/50 border-gray-200 text-gray-600 hover:bg-gray-100'"
              class="flex items-center justify-center gap-2 py-2.5 border rounded-lg transition font-medium text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
              </svg>
              Evento
            </button>

            <button
              @click="formulario.tipoEntidad = 'tarea'"
              type="button"
              :class="formulario.tipoEntidad === 'tarea'
                ? 'bg-blue-50 border-blue-200 text-blue-700 ring-1 ring-blue-500'
                : 'bg-gray-50/50 border-gray-200 text-gray-600 hover:bg-gray-100'"
              class="flex items-center justify-center gap-2 py-2.5 border rounded-lg transition font-medium text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              Tarea
            </button>

            <button
              @click="formulario.tipoEntidad = 'nota'"
              type="button"
              :class="formulario.tipoEntidad === 'nota'
                ? 'bg-amber-50 border-amber-200 text-amber-700 ring-1 ring-amber-500'
                : 'bg-gray-50/50 border-gray-200 text-gray-600 hover:bg-gray-100'"
              class="flex items-center justify-center gap-2 py-2.5 border rounded-lg transition font-medium text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              </svg>
              Nota
            </button>
          </div>
        </div>

        <div>
          <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">{{ labelEntidad }}</label>
          <div class="relative">
            <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 text-gray-500">
                <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </span>
            <select v-model="formulario.entidadId"
              class="w-full pl-9 pr-10 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-black outline-none transition text-sm text-gray-800 appearance-none cursor-pointer">
              <option value="" disabled>Seleccionar {{ tipoEntidadTexto }}...</option>
              <option v-for="item in opcionesEntidad" :key="item.value" :value="item.value">
                {{ item.label }}
              </option>
            </select>
            <span class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 text-gray-500">
                <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </span>
          </div>
        </div>

        <div>
          <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">Fecha de envío *</label>
          <div class="relative">
            <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 text-gray-500">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </span>
            <input v-model="formulario.fechaEnvio" type="datetime-local" required
              class="w-full pl-9 pr-3 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-black outline-none transition text-sm text-gray-800" />
          </div>
        </div>

        <div>
          <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">Mensaje</label>
          <div class="relative">
            <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 text-gray-500">
                <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
              </svg>
            </span>
            <input v-model="formulario.mensaje" type="text" placeholder="Ej. No olvides llevar los documentos"
              class="w-full pl-9 pr-3 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-black focus:border-black outline-none transition text-sm text-gray-800 placeholder-gray-400" />
          </div>
        </div>

        <div>
          <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">Repeticiones</label>
          <div class="relative">
            <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 text-gray-500">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3" />
              </svg>
            </span>
            <input v-model="formulario.repeticiones" type="number" min="0" placeholder="0 = una sola vez"
              class="w-full pl-9 pr-3 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-black focus:border-black outline-none transition text-sm text-gray-800 placeholder-gray-400" />
          </div>
        </div>

      </div>

      <div class="px-6 py-4 border-t border-gray-200 flex justify-end items-center gap-6">
        <button
          @click="$emit('cerrar')"
          class="text-sm font-bold text-gray-600 hover:text-gray-900 transition"
        >
          Cancelar
        </button>
        <button
          @click="guardarRecordatorio"
          class="px-6 py-2.5 text-sm font-bold text-white bg-black rounded-xl hover:bg-zinc-800 transition shadow-lg shadow-black/10"
        >
          Guardar Recordatorio
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const emit = defineEmits(['cerrar', 'guardar'])

const ahora = new Date()
ahora.setHours(ahora.getHours() + 1)
const fechaDefault = ahora.toISOString().slice(0, 16)

const formulario = ref({
  tipoEntidad: 'evento',
  entidadId: '',
  fechaEnvio: fechaDefault,
  mensaje: '',
  repeticiones: 0
})

const tipoEntidadTexto = computed(() => {
  const map = { evento: 'evento', tarea: 'tarea', nota: 'nota' }
  return map[formulario.value.tipoEntidad] || 'entidad'
})

const labelEntidad = computed(() => {
  const map = {
    evento: 'Evento relacionado',
    tarea: 'Tarea relacionada',
    nota: 'Nota relacionada'
  }
  return map[formulario.value.tipoEntidad] || 'Entidad relacionada'
})

const opcionesEntidad = computed(() => {
  const opciones = {
    evento: [
      { value: 1, label: 'Reunión de equipo' },
      { value: 2, label: 'Presentación con cliente' },
      { value: 3, label: 'Revisión de sprint' }
    ],
    tarea: [
      { value: 1, label: 'Diseñar mockups' },
      { value: 2, label: 'Escribir documentación' },
      { value: 3, label: 'Corregir bugs críticos' }
    ],
    nota: [
      { value: 1, label: 'Ideas para el proyecto' },
      { value: 2, label: 'Minuta reunión' },
      { value: 3, label: 'Lista de pendientes' }
    ]
  }
  return opciones[formulario.value.tipoEntidad] || []
})

const guardarRecordatorio = () => {
  if (!formulario.value.fechaEnvio) {
    alert('La fecha de envío es obligatoria')
    return
  }
  if (!formulario.value.entidadId) {
    alert('Debes seleccionar una ' + tipoEntidadTexto.value)
    return
  }
  emit('guardar', { ...formulario.value })
  emit('cerrar')
}
</script>
