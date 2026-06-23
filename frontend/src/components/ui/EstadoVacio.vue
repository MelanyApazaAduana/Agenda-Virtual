<template>
  <div class="text-center py-12 text-gray-400">
    <svg v-if="icono" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10 mx-auto mb-3 text-gray-300">
      <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2Z" />
    </svg>
    <p class="text-sm">{{ mensaje }}</p>
  </div>
</template>

<script setup>
defineProps({
  mensaje: { type: String, default: 'No hay registros' },
  icono: { type: Boolean, default: true }
})
</script>
