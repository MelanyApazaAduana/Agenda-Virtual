<template>
  <div class="fixed top-4 right-4 z-[100] space-y-2 w-80 max-w-[90vw]">
    <TransitionGroup name="toast">
      <div v-for="n in ui.notificaciones" :key="n.id"
        class="flex items-start gap-3 px-4 py-3 rounded-xl shadow-lg border text-sm" :class="estilo(n.tipo)">
        <span class="shrink-0 mt-0.5">
          <svg v-if="n.tipo === 'exito'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
          <svg v-else-if="n.tipo === 'error'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" /></svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" /></svg>
        </span>
        <span class="flex-1">{{ n.mensaje }}</span>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { useUiStore } from '@/stores/uiStore'
const ui = useUiStore()
const estilo = (tipo) => ({
  exito: 'bg-emerald-50 border-emerald-200 text-emerald-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  info: 'bg-white border-gray-200 text-gray-700'
}[tipo] || 'bg-white border-gray-200 text-gray-700')
</script>

<style scoped>
.toast-enter-active, .toast-leave-active { transition: all 0.25s ease; }
.toast-enter-from { opacity: 0; transform: translateX(20px); }
.toast-leave-to { opacity: 0; transform: translateX(20px); }
</style>
