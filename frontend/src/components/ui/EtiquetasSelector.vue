<template>
  <div>
    <div class="flex flex-wrap gap-2 items-center bg-gray-50/50 border border-gray-200 rounded-lg p-2 min-h-[44px]">
      <button
        v-for="etiqueta in etiquetasStore.etiquetas"
        :key="etiqueta.id"
        type="button"
        @click="alternar(etiqueta.id)"
        class="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition border"
        :class="estaSeleccionada(etiqueta.id)
          ? 'text-white border-transparent'
          : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'"
        :style="estaSeleccionada(etiqueta.id) ? { backgroundColor: etiqueta.color_hex || '#6B7280' } : {}"
      >
        <span class="w-2 h-2 rounded-full" :style="{ backgroundColor: etiqueta.color_hex || '#6B7280' }"
          v-if="!estaSeleccionada(etiqueta.id)"></span>
        {{ etiqueta.nombre }}
      </button>

      <span v-if="etiquetasStore.etiquetas.length === 0" class="text-xs text-gray-400 px-1">
        Sin etiquetas aún
      </span>
    </div>

    <div class="flex items-center gap-2 mt-2">
      <input
        v-model="nuevaEtiqueta"
        @keyup.enter="crearEtiqueta"
        type="text"
        placeholder="Nueva etiqueta..."
        maxlength="50"
        class="flex-1 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-black"
      />
      <button type="button" @click="crearEtiqueta"
        class="px-3 py-1.5 text-xs font-semibold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
        + Crear
      </button>
    </div>
  </div>
</template>

<script setup>
import { useUiStore } from '@/stores/uiStore'
const ui = useUiStore()
import { ref, onMounted } from 'vue'
import { useEtiquetasStore } from '@/stores/etiquetasStore'

const props = defineProps({
  modelValue: { type: Array, default: () => [] }
})
const emit = defineEmits(['update:modelValue'])

const etiquetasStore = useEtiquetasStore()
const nuevaEtiqueta = ref('')

onMounted(() => etiquetasStore.cargar())

const estaSeleccionada = (id) => props.modelValue.includes(id)

const alternar = (id) => {
  const actual = [...props.modelValue]
  const idx = actual.indexOf(id)
  if (idx === -1) actual.push(id)
  else actual.splice(idx, 1)
  emit('update:modelValue', actual)
}

const crearEtiqueta = async () => {
  const nombre = nuevaEtiqueta.value.trim()
  if (!nombre) return
  try {
    const nueva = await etiquetasStore.crear({ nombre })
    nuevaEtiqueta.value = ''
    alternar(nueva.id)
  } catch (error) {
    ui.error(error.response?.data?.message || 'No se pudo crear la etiqueta')
  }
}
</script>
