<template>
  <div class="flex items-center gap-6">
    <div class="relative w-36 h-36 shrink-0">
      <div class="w-full h-full rounded-full" :style="{ background: gradiente }"></div>
      <div class="absolute inset-[18%] bg-[var(--bg-sidebar)] rounded-full flex flex-col items-center justify-center">
        <span class="text-lg font-bold text-gray-900">{{ totalFormateado }}</span>
        <span class="text-[10px] text-gray-400 uppercase tracking-wider">Total</span>
      </div>
    </div>
    <div class="space-y-2 flex-1">
      <div v-for="(seg, i) in segmentos" :key="i" class="flex items-center justify-between text-sm">
        <span class="flex items-center gap-2 text-gray-600">
          <span class="w-2.5 h-2.5 rounded-full" :style="{ backgroundColor: seg.color }"></span>
          {{ seg.etiqueta }}
        </span>
        <span class="font-semibold text-gray-900">{{ formato(seg.valor) }}</span>
      </div>
      <p v-if="segmentos.length === 0" class="text-sm text-gray-400">Sin datos</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  // [{ etiqueta, valor, color }]
  datos: { type: Array, default: () => [] }
})

const paleta = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#6B7280']

const segmentos = computed(() =>
  props.datos.map((d, i) => ({ ...d, valor: Number(d.valor) || 0, color: d.color || paleta[i % paleta.length] }))
)

const total = computed(() => segmentos.value.reduce((s, d) => s + d.valor, 0))

const formato = (n) => Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const totalFormateado = computed(() => formato(total.value))

const gradiente = computed(() => {
  if (!total.value) return 'var(--border)'
  let acc = 0
  const partes = segmentos.value.map((d) => {
    const ini = (acc / total.value) * 360
    acc += d.valor
    const fin = (acc / total.value) * 360
    return `${d.color} ${ini}deg ${fin}deg`
  })
  return `conic-gradient(${partes.join(', ')})`
})
</script>
