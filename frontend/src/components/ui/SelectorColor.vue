<template>
  <div class="flex items-center gap-2 flex-wrap">
    <button
      v-for="color in paleta"
      :key="color"
      type="button"
      @click="seleccionar(color)"
      class="w-7 h-7 rounded-full border-2 transition hover:scale-110"
      :class="modelValue === color ? 'border-gray-900 ring-2 ring-offset-1 ring-gray-300' : 'border-white shadow'"
      :style="{ backgroundColor: color }"
      :title="color"
    ></button>

    <label class="relative w-7 h-7 rounded-full border border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-gray-500 transition"
      title="Color personalizado">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3.5 h-3.5 text-gray-400">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
      <input type="color" :value="modelValue || '#3B82F6'" @input="seleccionar($event.target.value)"
        class="absolute inset-0 opacity-0 cursor-pointer" />
    </label>
  </div>
</template>

<script setup>
defineProps({
  modelValue: { type: String, default: null }
})
const emit = defineEmits(['update:modelValue'])

const paleta = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#6B7280']

const seleccionar = (color) => emit('update:modelValue', color)
</script>
