<template>
  <Transition name="fade">
    <div v-if="ui.confirmacion.abierto" class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[110] p-4"
      @click.self="ui.responderConfirmacion(false)">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden">
        <div class="px-6 pt-6 pb-2">
          <h3 class="text-lg font-bold text-gray-900">{{ ui.confirmacion.titulo }}</h3>
          <p class="text-sm text-gray-600 mt-2">{{ ui.confirmacion.mensaje }}</p>
        </div>

        <!-- Diálogo de elección: una opción por botón apilado -->
        <div v-if="ui.confirmacion.opciones" class="px-6 py-4 flex flex-col gap-2">
          <button v-for="op in ui.confirmacion.opciones" :key="op.valor"
            @click="ui.responderConfirmacion(op.valor)"
            class="w-full px-5 py-2.5 text-sm font-bold rounded-xl transition"
            :class="op.estilo === 'peligro'
              ? 'text-white bg-red-600 hover:bg-red-700'
              : 'text-gray-800 bg-gray-100 hover:bg-gray-200'">
            {{ op.label }}
          </button>
          <button @click="ui.responderConfirmacion(null)" class="mt-1 text-sm font-bold text-gray-500 hover:text-gray-800 transition">Cancelar</button>
        </div>

        <!-- Diálogo clásico Confirmar / Cancelar -->
        <div v-else class="px-6 py-4 flex justify-end gap-3">
          <button @click="ui.responderConfirmacion(false)" class="text-sm font-bold text-gray-600 hover:text-gray-900 transition">Cancelar</button>
          <button @click="ui.responderConfirmacion(true)" class="px-5 py-2 text-sm font-bold text-white bg-black rounded-xl hover:bg-zinc-800 transition">Confirmar</button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { useUiStore } from '@/stores/uiStore'
const ui = useUiStore()
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
