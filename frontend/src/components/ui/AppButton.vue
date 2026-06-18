<template>
  <button
    :type="type"
    :disabled="desactivado || cargando"
    :class="[
      'inline-flex items-center justify-center gap-2 font-bold transition-all active:scale-[0.99] select-none',
      clasesVariant,
      clasesTamano,
      desactivado || cargando ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
    ]"
    @click="$emit('click', $event)"
  >
    <svg v-if="cargando" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
    <slot />
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: { type: String, default: 'primary' },
  size: { type: String, default: 'md' },
  type: { type: String, default: 'button' },
  desactivado: { type: Boolean, default: false },
  cargando: { type: Boolean, default: false }
})

defineEmits(['click'])

const clasesVariant = computed(() => {
  const variantes = {
    primary: 'text-white bg-black hover:bg-zinc-800 shadow-lg shadow-black/10',
    secondary: 'text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 shadow-sm',
    ghost: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
  }
  return variantes[props.variant] || variantes.primary
})

const clasesTamano = computed(() => {
  const tamanos = {
    sm: 'px-3 py-1.5 text-xs rounded-lg',
    md: 'px-5 py-2.5 text-sm rounded-xl',
    lg: 'px-6 py-3 text-base rounded-xl'
  }
  return tamanos[props.size] || tamanos.md
})
</script>
