<template>
  <span class="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-white border border-gray-200 text-gray-600">
    <span class="w-2 h-2 rounded-full" :style="{ backgroundColor: etiqueta.color_hex || '#6B7280' }"></span>
    {{ etiqueta.nombre }}
  </span>
</template>

<script setup>
defineProps({ etiqueta: { type: Object, required: true } })
</script>
