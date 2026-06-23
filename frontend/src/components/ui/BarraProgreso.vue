<template>
  <div class="w-full">
    <div class="h-2.5 bg-gray-100 rounded-full overflow-hidden">
      <div class="h-full rounded-full transition-all" :class="excedido ? 'bg-red-500' : color" :style="{ width: anchoFinal + '%' }"></div>
    </div>
    <p v-if="etiqueta" class="text-[11px] mt-1" :class="excedido ? 'text-red-600 font-semibold' : 'text-gray-500'">{{ etiqueta }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  valor: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  color: { type: String, default: 'bg-emerald-500' },
  etiqueta: { type: String, default: '' }
})

const porcentaje = computed(() => (!props.total ? 0 : Math.round((props.valor / props.total) * 100)))
const excedido = computed(() => porcentaje.value > 100)
const anchoFinal = computed(() => Math.min(porcentaje.value, 100))
</script>
