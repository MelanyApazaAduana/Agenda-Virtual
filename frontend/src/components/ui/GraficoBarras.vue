<template>
  <div>
    <div class="flex items-end gap-3 h-40">
      <div v-for="(barra, i) in barras" :key="i" class="flex-1 flex flex-col items-center gap-1 group">
        <div class="w-full flex flex-col justify-end h-full">
          <div class="w-full rounded-t-md transition-all" :style="{ height: altura(barra.valor) + '%', backgroundColor: barra.color || '#10B981' }"
            :title="formato(barra.valor)"></div>
        </div>
        <span class="text-[10px] text-gray-400 font-medium truncate w-full text-center">{{ barra.etiqueta }}</span>
      </div>
      <p v-if="barras.length === 0" class="text-sm text-gray-400 self-center w-full text-center">Sin datos</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  // [{ etiqueta, valor, color }]
  datos: { type: Array, default: () => [] }
})

const barras = computed(() => props.datos.map((d) => ({ ...d, valor: Number(d.valor) || 0 })))
const maximo = computed(() => Math.max(1, ...barras.value.map((b) => b.valor)))
const altura = (v) => Math.max((v / maximo.value) * 100, 2)
const formato = (n) => Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
</script>
