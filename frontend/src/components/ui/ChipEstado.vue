<template>
  <span class="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-0.5 rounded-full" :class="[clase.bg, clase.fg]">
    <span class="w-1.5 h-1.5 rounded-full" :class="clase.dot"></span>
    {{ clase.texto }}
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  estado: { type: String, required: true },
  tipo: { type: String, default: 'evento' } // evento | tarea | recordatorio | prioridad
})

const MAPA = {
  evento: {
    pendiente: { texto: 'Pendiente', bg: 'bg-gray-100', fg: 'text-gray-600', dot: 'bg-gray-400' },
    en_curso: { texto: 'En curso', bg: 'bg-blue-100', fg: 'text-blue-700', dot: 'bg-blue-500' },
    completado: { texto: 'Completado', bg: 'bg-emerald-100', fg: 'text-emerald-700', dot: 'bg-emerald-500' },
    cancelado: { texto: 'Cancelado', bg: 'bg-red-100', fg: 'text-red-700', dot: 'bg-red-500' },
    pospuesto: { texto: 'Pospuesto', bg: 'bg-amber-100', fg: 'text-amber-700', dot: 'bg-amber-500' },
    vencido: { texto: 'Vencido', bg: 'bg-red-100', fg: 'text-red-800', dot: 'bg-red-600' }
  },
  tarea: {
    por_hacer: { texto: 'Por hacer', bg: 'bg-gray-100', fg: 'text-gray-600', dot: 'bg-gray-400' },
    en_progreso: { texto: 'En progreso', bg: 'bg-blue-100', fg: 'text-blue-700', dot: 'bg-blue-500' },
    completada: { texto: 'Completada', bg: 'bg-emerald-100', fg: 'text-emerald-700', dot: 'bg-emerald-500' },
    cancelada: { texto: 'Cancelada', bg: 'bg-red-100', fg: 'text-red-700', dot: 'bg-red-500' }
  },
  recordatorio: {
    programado: { texto: 'Programado', bg: 'bg-blue-100', fg: 'text-blue-700', dot: 'bg-blue-500' },
    leido: { texto: 'Leído', bg: 'bg-emerald-100', fg: 'text-emerald-700', dot: 'bg-emerald-500' },
    pospuesto: { texto: 'Pospuesto', bg: 'bg-amber-100', fg: 'text-amber-700', dot: 'bg-amber-500' },
    cancelado: { texto: 'Cancelado', bg: 'bg-gray-100', fg: 'text-gray-500', dot: 'bg-gray-400' }
  },
  prioridad: {
    baja: { texto: 'Baja', bg: 'bg-gray-100', fg: 'text-gray-600', dot: 'bg-gray-400' },
    media: { texto: 'Media', bg: 'bg-amber-100', fg: 'text-amber-700', dot: 'bg-amber-500' },
    alta: { texto: 'Alta', bg: 'bg-orange-100', fg: 'text-orange-700', dot: 'bg-orange-500' },
    urgente: { texto: 'Urgente', bg: 'bg-red-100', fg: 'text-red-700', dot: 'bg-red-500' }
  }
}

const clase = computed(() =>
  MAPA[props.tipo]?.[props.estado] || { texto: props.estado, bg: 'bg-gray-100', fg: 'text-gray-600', dot: 'bg-gray-400' }
)
</script>
